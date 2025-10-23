-- ============================================
-- RESET RENDER DATABASE - Complete Wipe
-- ============================================
-- WARNING: This deletes ALL data and schema
-- Use only if you don't care about existing data
-- ============================================

-- Drop everything in public schema
DROP SCHEMA public CASCADE;

-- Recreate public schema
CREATE SCHEMA public;

-- Grant permissions (adjust username if needed)
GRANT ALL ON SCHEMA public TO render;
GRANT ALL ON SCHEMA public TO public;

-- Verify it's clean
SELECT 'Database reset complete. Ready for fresh migration.' AS status;
