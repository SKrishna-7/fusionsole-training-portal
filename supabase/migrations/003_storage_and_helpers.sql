-- ==============================================================================
-- FUSIONSOLE LEARNING & DEVELOPMENT PORTAL
-- Migration 003: Storage Bucket Setup & Admin User Bootstrap
-- ==============================================================================

-- 1. Create public storage bucket for learning assets (thumbnails, images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'learning-assets',
    'learning-assets',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- 2. Storage Policies
-- Public can view/download images
DROP POLICY IF EXISTS "Public Access Learning Assets" ON storage.objects;
CREATE POLICY "Public Access Learning Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'learning-assets');

-- Authenticated admins can upload learning assets
DROP POLICY IF EXISTS "Admins Upload Learning Assets" ON storage.objects;
CREATE POLICY "Admins Upload Learning Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'learning-assets'
    AND public.is_admin()
);

-- Authenticated admins can update learning assets
DROP POLICY IF EXISTS "Admins Update Learning Assets" ON storage.objects;
CREATE POLICY "Admins Update Learning Assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'learning-assets'
    AND public.is_admin()
);

-- Authenticated admins can delete learning assets
DROP POLICY IF EXISTS "Admins Delete Learning Assets" ON storage.objects;
CREATE POLICY "Admins Delete Learning Assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'learning-assets'
    AND public.is_admin()
);

-- ------------------------------------------------------------------------------
-- 3. BOOTSTRAP FIRST ADMIN USER (Run this after creating auth user in Supabase)
-- ------------------------------------------------------------------------------
-- Example SQL to assign 'admin' role to the first signed-up HR manager:
--
-- INSERT INTO public.profiles (id, full_name, email, role, is_active)
-- VALUES (
--     'USER_UUID_FROM_AUTH_USERS',
--     'HR Administrator',
--     'admin@fusionsole.com',
--     'admin',
--     true
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;
