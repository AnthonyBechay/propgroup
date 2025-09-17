-- Supabase RLS Policies for Role-Based Access Control

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_owned_properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Super admins can do anything" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can update user profiles" ON users;

-- Function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('ADMIN', 'SUPER_ADMIN')
    FROM users
    WHERE id = auth.uid()::text
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super_admin
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'SUPER_ADMIN'
    FROM users
    WHERE id = auth.uid()::text
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is active
CREATE OR REPLACE FUNCTION auth.is_active_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_active = true AND banned_at IS NULL
    FROM users
    WHERE id = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (
    auth.uid()::text = id 
    OR auth.is_admin()
  );

-- Users can update their own basic info (not role or ban status)
CREATE POLICY "Users can update own basic info"
  ON users FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (
    auth.uid()::text = id 
    AND role = (SELECT role FROM users WHERE id = auth.uid()::text)
    AND is_active = (SELECT is_active FROM users WHERE id = auth.uid()::text)
    AND banned_at IS NULL
  );

-- Admins can view all active users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (auth.is_admin());

-- Admins can update users (but not other admins unless super_admin)
CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (
    auth.is_admin() 
    AND (
      auth.is_super_admin() 
      OR (SELECT role FROM users WHERE id = users.id) = 'USER'
    )
  );

-- Super admins can do anything
CREATE POLICY "Super admins full access"
  ON users FOR ALL
  USING (auth.is_super_admin());

-- ============================================
-- PROPERTIES TABLE POLICIES
-- ============================================

-- Everyone can view active properties
CREATE POLICY "Anyone can view properties"
  ON properties FOR SELECT
  USING (true);

-- Only admins can insert properties
CREATE POLICY "Admins can create properties"
  ON properties FOR INSERT
  WITH CHECK (auth.is_admin());

-- Only admins can update properties
CREATE POLICY "Admins can update properties"
  ON properties FOR UPDATE
  USING (auth.is_admin());

-- Only admins can delete properties
CREATE POLICY "Admins can delete properties"
  ON properties FOR DELETE
  USING (auth.is_admin());

-- ============================================
-- ADMIN AUDIT LOGS POLICIES
-- ============================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_logs FOR SELECT
  USING (auth.is_admin());

-- System automatically inserts audit logs (via service role)
CREATE POLICY "System can insert audit logs"
  ON admin_audit_logs FOR INSERT
  WITH CHECK (auth.is_admin());

-- No one can update or delete audit logs
-- (This ensures audit trail integrity)

-- ============================================
-- FAVORITE PROPERTIES POLICIES
-- ============================================

-- Users can manage their own favorites
CREATE POLICY "Users manage own favorites"
  ON favorite_properties FOR ALL
  USING (auth.uid()::text = user_id);

-- ============================================
-- PROPERTY INQUIRIES POLICIES
-- ============================================

-- Anyone can create an inquiry
CREATE POLICY "Anyone can create inquiry"
  ON property_inquiries FOR INSERT
  WITH CHECK (true);

-- Users can view their own inquiries
CREATE POLICY "Users view own inquiries"
  ON property_inquiries FOR SELECT
  USING (
    auth.uid()::text = user_id 
    OR auth.is_admin()
  );

-- Admins can view all inquiries
CREATE POLICY "Admins view all inquiries"
  ON property_inquiries FOR SELECT
  USING (auth.is_admin());

-- ============================================
-- USER OWNED PROPERTIES POLICIES
-- ============================================

-- Users can manage their own properties
CREATE POLICY "Users manage own properties"
  ON user_owned_properties FOR ALL
  USING (auth.uid()::text = user_id);

-- Admins can view all owned properties (for analytics)
CREATE POLICY "Admins view all owned properties"
  ON user_owned_properties FOR SELECT
  USING (auth.is_admin());
