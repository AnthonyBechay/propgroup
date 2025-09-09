-- Seed data for PropGroup development

-- Insert sample profiles (these would normally come from auth.users)
-- Note: In production, profiles are created automatically via trigger

-- Insert sample properties
INSERT INTO public.properties (
    title,
    description,
    property_type,
    status,
    address,
    price,
    rental_price,
    size_sqft,
    bedrooms,
    bathrooms,
    year_built,
    lot_size,
    features,
    amenities,
    images,
    is_featured
) VALUES 
(
    'Modern Downtown Condo',
    'Luxurious 2-bedroom condo in the heart of downtown with stunning city views',
    'residential',
    'available',
    '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "zip": "94102", "country": "USA"}',
    850000,
    4500,
    1200,
    2,
    2,
    2020,
    0,
    '{"parking": true, "gym": true, "pool": true, "concierge": true, "pet_friendly": true}',
    ARRAY['Gym', 'Pool', 'Concierge', 'Parking', 'Pet Friendly'],
    '[{"url": "https://example.com/image1.jpg", "caption": "Living Room"}, {"url": "https://example.com/image2.jpg", "caption": "Kitchen"}]',
    true
),
(
    'Suburban Family Home',
    'Spacious 4-bedroom home in quiet neighborhood with excellent schools',
    'residential',
    'available',
    '{"street": "456 Oak Ave", "city": "Palo Alto", "state": "CA", "zip": "94301", "country": "USA"}',
    2500000,
    8000,
    3200,
    4,
    3.5,
    2018,
    7500,
    '{"garage": "2-car", "backyard": true, "solar_panels": true, "smart_home": true}',
    ARRAY['Garage', 'Backyard', 'Solar Panels', 'Smart Home'],
    '[{"url": "https://example.com/image3.jpg", "caption": "Front View"}, {"url": "https://example.com/image4.jpg", "caption": "Backyard"}]',
    true
),
(
    'Commercial Office Space',
    'Prime office location with modern amenities and flexible layout',
    'commercial',
    'available',
    '{"street": "789 Business Blvd", "city": "San Jose", "state": "CA", "zip": "95110", "country": "USA"}',
    3500000,
    15000,
    8000,
    null,
    null,
    2019,
    15000,
    '{"parking_spaces": 50, "conference_rooms": 4, "kitchen": true, "security": "24/7"}',
    ARRAY['Parking', 'Conference Rooms', 'Kitchen', 'Security'],
    '[{"url": "https://example.com/image5.jpg", "caption": "Lobby"}, {"url": "https://example.com/image6.jpg", "caption": "Office Space"}]',
    false
),
(
    'Beachfront Villa',
    'Stunning beachfront property with private beach access',
    'residential',
    'available',
    '{"street": "101 Ocean Drive", "city": "Malibu", "state": "CA", "zip": "90265", "country": "USA"}',
    8500000,
    25000,
    5500,
    5,
    6,
    2021,
    12000,
    '{"beach_access": true, "infinity_pool": true, "wine_cellar": true, "home_theater": true}',
    ARRAY['Beach Access', 'Infinity Pool', 'Wine Cellar', 'Home Theater'],
    '[{"url": "https://example.com/image7.jpg", "caption": "Ocean View"}, {"url": "https://example.com/image8.jpg", "caption": "Pool Area"}]',
    true
),
(
    'Industrial Warehouse',
    'Large warehouse facility with loading docks and office space',
    'industrial',
    'available',
    '{"street": "555 Industrial Way", "city": "Oakland", "state": "CA", "zip": "94607", "country": "USA"}',
    4200000,
    18000,
    25000,
    null,
    null,
    2015,
    45000,
    '{"loading_docks": 6, "office_space": 2000, "ceiling_height": "30ft", "power": "3-phase"}',
    ARRAY['Loading Docks', 'Office Space', 'High Ceilings', '3-Phase Power'],
    '[{"url": "https://example.com/image9.jpg", "caption": "Warehouse Interior"}, {"url": "https://example.com/image10.jpg", "caption": "Loading Area"}]',
    false
);

-- Insert sample property analytics
INSERT INTO public.property_analytics (property_id, views_count, inquiries_count, favorites_count, shares_count, average_time_on_page, conversion_rate)
SELECT 
    id,
    floor(random() * 1000 + 100),
    floor(random() * 50 + 5),
    floor(random() * 100 + 10),
    floor(random() * 30 + 2),
    floor(random() * 300 + 60),
    random() * 10
FROM public.properties;

-- Create sample storage buckets (these would be created via Supabase dashboard in production)
-- This is just documentation of required buckets
/*
Required Storage Buckets:
1. property-images - For property photos and virtual tours
2. documents - For contracts, deeds, and other documents
3. user-avatars - For user profile pictures
4. company-assets - For company logos and branding materials
*/

-- Create database functions for common operations
CREATE OR REPLACE FUNCTION public.increment_property_view(property_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO public.property_analytics (property_id, views_count, date)
    VALUES (property_uuid, 1, CURRENT_DATE)
    ON CONFLICT (property_id, date)
    DO UPDATE SET views_count = property_analytics.views_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_property_recommendations(user_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE(property_id UUID, score NUMERIC) AS $$
BEGIN
    -- Simple recommendation algorithm based on user's search history and favorites
    -- In production, this would be more sophisticated
    RETURN QUERY
    SELECT DISTINCT
        p.id as property_id,
        COALESCE(pa.views_count::NUMERIC / 100, 0) + 
        COALESCE(pa.favorites_count::NUMERIC / 10, 0) +
        CASE WHEN p.is_featured THEN 10 ELSE 0 END as score
    FROM public.properties p
    LEFT JOIN public.property_analytics pa ON p.id = pa.property_id
    WHERE p.is_active = true
    AND p.status = 'available'
    AND p.id NOT IN (
        SELECT property_id FROM public.favorites WHERE user_id = user_uuid
    )
    ORDER BY score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate property ROI
CREATE OR REPLACE FUNCTION public.calculate_roi(
    purchase_price NUMERIC,
    rental_income NUMERIC,
    expenses NUMERIC DEFAULT 0
)
RETURNS NUMERIC AS $$
BEGIN
    IF purchase_price <= 0 THEN
        RETURN 0;
    END IF;
    RETURN ((rental_income * 12 - expenses) / purchase_price) * 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to search properties by location radius
CREATE OR REPLACE FUNCTION public.search_properties_nearby(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 10
)
RETURNS TABLE(
    property_id UUID,
    distance_km NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as property_id,
        ST_Distance(p.location, ST_MakePoint(lng, lat)::geography) / 1000 as distance_km
    FROM public.properties p
    WHERE p.is_active = true
    AND p.status = 'available'
    AND ST_DWithin(p.location, ST_MakePoint(lng, lat)::geography, radius_km * 1000)
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
