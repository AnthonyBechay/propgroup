-- Row Level Security Policies for PropGroup

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
    ON public.properties FOR SELECT
    USING (is_active = true);

CREATE POLICY "Agents and admins can insert properties"
    ON public.properties FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('agent', 'admin')
        )
    );

CREATE POLICY "Agents can update own properties"
    ON public.properties FOR UPDATE
    USING (
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Agents can delete own properties"
    ON public.properties FOR DELETE
    USING (
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Property Analytics policies
CREATE POLICY "Analytics viewable by property owners and agents"
    ON public.property_analytics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
            AND (p.agent_id = auth.uid() OR p.owner_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "System can insert analytics"
    ON public.property_analytics FOR INSERT
    WITH CHECK (true);

CREATE POLICY "System can update analytics"
    ON public.property_analytics FOR UPDATE
    USING (true);

-- Favorites policies
CREATE POLICY "Users can view own favorites"
    ON public.favorites FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
    ON public.favorites FOR DELETE
    USING (user_id = auth.uid());

-- Inquiries policies
CREATE POLICY "Users can view own inquiries"
    ON public.inquiries FOR SELECT
    USING (
        user_id = auth.uid() OR
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
            AND (p.agent_id = auth.uid() OR p.owner_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can create inquiries"
    ON public.inquiries FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Agents can update inquiries"
    ON public.inquiries FOR UPDATE
    USING (
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Transactions policies
CREATE POLICY "Transactions viewable by involved parties"
    ON public.transactions FOR SELECT
    USING (
        buyer_id = auth.uid() OR
        seller_id = auth.uid() OR
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Agents can create transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('agent', 'admin')
        )
    );

CREATE POLICY "Agents can update own transactions"
    ON public.transactions FOR UPDATE
    USING (
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Documents policies
CREATE POLICY "Documents viewable by authorized parties"
    ON public.documents FOR SELECT
    USING (
        is_public = true OR
        uploaded_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.transactions t
            WHERE t.id = transaction_id
            AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid() OR t.agent_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_id
            AND (p.agent_id = auth.uid() OR p.owner_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Authorized users can upload documents"
    ON public.documents FOR INSERT
    WITH CHECK (
        uploaded_by = auth.uid()
    );

CREATE POLICY "Document owners can update"
    ON public.documents FOR UPDATE
    USING (
        uploaded_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Document owners can delete"
    ON public.documents FOR DELETE
    USING (
        uploaded_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Appointments policies
CREATE POLICY "Users can view own appointments"
    ON public.appointments FOR SELECT
    USING (
        user_id = auth.uid() OR
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can create appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and agents can update appointments"
    ON public.appointments FOR UPDATE
    USING (
        user_id = auth.uid() OR
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Users and agents can cancel appointments"
    ON public.appointments FOR DELETE
    USING (
        user_id = auth.uid() OR
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
    ON public.notifications FOR DELETE
    USING (user_id = auth.uid());

-- Search History policies
CREATE POLICY "Users can view own search history"
    ON public.search_history FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own search history"
    ON public.search_history FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own search history"
    ON public.search_history FOR DELETE
    USING (user_id = auth.uid());

-- Create helper functions for common operations
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_agent()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('agent', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
