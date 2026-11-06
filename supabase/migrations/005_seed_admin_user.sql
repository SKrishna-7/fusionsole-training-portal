-- ==============================================================================
-- FUSIONSOLE LEARNING PORTAL - BOOTSTRAP DEFAULT ADMIN ACCOUNTS IN SUPABASE
-- Run this in the Supabase SQL Editor to instantly activate admin logins:
-- 1. admin@fusionsole.com (password: password123)
-- 2. fusionadmin@fusionsole.com (password: password123)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert admin@fusionsole.com into auth.users (auto-confirmed)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@fusionsole.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin","role":"admin"}',
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('password123', gen_salt('bf')),
    email_confirmed_at = now(),
    raw_user_meta_data = '{"full_name":"Admin","role":"admin"}';

-- 2. Insert fusionadmin@fusionsole.com into auth.users (auto-confirmed)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'fusionadmin@fusionsole.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Lead Operations Administrator","role":"admin"}',
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('password123', gen_salt('bf')),
    email_confirmed_at = now(),
    raw_user_meta_data = '{"full_name":"Lead Operations Administrator","role":"admin"}';

-- 3. Link profiles in public.profiles
INSERT INTO public.profiles (id, full_name, email, role, is_active)
SELECT id, 'Admin', 'admin@fusionsole.com', 'admin', true
FROM auth.users
WHERE email = 'admin@fusionsole.com'
ON CONFLICT (id) DO UPDATE SET full_name = 'Admin', role = 'admin', is_active = true;

INSERT INTO public.profiles (id, full_name, email, role, is_active)
SELECT id, 'Lead Operations Administrator', 'fusionadmin@fusionsole.com', 'admin', true
FROM auth.users
WHERE email = 'fusionadmin@fusionsole.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;
