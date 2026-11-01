-- ==============================================================================
-- FUSIONSOLE LEARNING & DEVELOPMENT PORTAL
-- Migration 002: Idempotent Seed Data (Data-Only DML)
-- 
-- Scope:
--   - Exactly 2 Categories (Staff, Workers)
--   - Exactly 3 Subjects (Stitching, Assembly, Cutting under Workers)
--   - Exactly 28 Modules (1 Staff Induction, 6 Stitching, 19 Assembly, 2 Cutting)
--   - All modules initialized in 'draft' status
--   - Zero fabricated YouTube links or quizzes
--   - No DDL (no CREATE TABLE, CREATE INDEX, CREATE FUNCTION, or CREATE POLICY)
--   - 100% Idempotent: safe to run multiple times without duplicate records
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES (Exactly 2 Initial Categories)
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, description, image_path, display_order, is_active)
VALUES 
    (
        'Staff',
        'staff',
        'An introduction to Fusionsole, the workplace environment, company practices and essential information for newly joined staff.',
        '/images/fusion-moulds.jpg',
        1,
        true
    ),
    (
        'Workers',
        'workers',
        'Practical skill programmes covering manufacturing departments and footwear construction operations.',
        '/images/fusion-stitching.jpg',
        2,
        true
    )
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_path = EXCLUDED.image_path,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- ------------------------------------------------------------------------------
-- 2. SUBJECTS (Exactly 3 Initial Subjects under 'Workers')
-- ------------------------------------------------------------------------------
INSERT INTO public.subjects (category_id, name, slug, description, image_path, display_order, is_active)
VALUES
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        'Stitching',
        'stitching',
        'Understand stitching operations, equipment, component joining and the importance of quality throughout the process.',
        '/images/fusion-stitching.jpg',
        1,
        true
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        'Assembly',
        'assembly',
        'Learn about shoe shaping, lasting operations, sole bonding and the processes involved in forming the footwear structure.',
        '/images/fusion-lasting.jpg',
        2,
        true
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        'Cutting',
        'cutting',
        'An introduction to material preparation, cutting operations and the processes involved in preparing footwear components.',
        '/images/fusion-moulds.jpg',
        3,
        true
    )
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_path = EXCLUDED.image_path,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- ------------------------------------------------------------------------------
-- 3. MODULES (Exactly 28 Initial Modules, All 'draft', No YouTube Links)
-- ------------------------------------------------------------------------------

-- 3.1 Staff Category (1 Module)
INSERT INTO public.modules (
    category_id,
    subject_id,
    title,
    slug,
    description,
    overview,
    learning_objectives,
    instructions,
    youtube_url,
    youtube_video_id,
    display_order,
    status
)
VALUES (
    (SELECT id FROM public.categories WHERE slug = 'staff'),
    NULL,
    'Staff Induction',
    'staff-induction',
    'Get introduced to our workplace culture, organizational values, facility layout, safety protocols, and company operational standards.',
    'This foundational induction module is designed to provide all newly joined staff members with a clear understanding of Fusionsole as a premier footwear manufacturing organization.',
    '["Understand Fusionsole mission and quality values", "Identify key facility safety regulations and PPE rules", "Learn HR policies and communication channels"]'::jsonb,
    '["Review organizational guidelines with HR during week one", "Wear required PPE when touring the production floor", "Report safety hazards immediately to your supervisor"]'::jsonb,
    NULL,
    NULL,
    1,
    'draft'
)
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    subject_id = EXCLUDED.subject_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    overview = EXCLUDED.overview,
    learning_objectives = EXCLUDED.learning_objectives,
    instructions = EXCLUDED.instructions,
    display_order = EXCLUDED.display_order;

-- 3.2 Workers Category -> Stitching Subject (6 Modules)
INSERT INTO public.modules (
    category_id,
    subject_id,
    title,
    slug,
    description,
    youtube_url,
    youtube_video_id,
    display_order,
    status
)
VALUES
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'stitching'),
        'S/N Stitching',
        'sn-stitching',
        'Single Needle stitching operations for precision seam joining and shoe upper contour construction.',
        NULL, NULL, 1, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'stitching'),
        'D/N Stitching',
        'dn-stitching',
        'Double Needle stitching for parallel stitch reinforcement, aesthetic detailing, and high-stress seam durability.',
        NULL, NULL, 2, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'stitching'),
        'C/S Stitching',
        'cs-stitching',
        'Chain Stitching operations delivering elasticity, flexibility, and high seam elongation for ergonomic zones.',
        NULL, NULL, 3, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'stitching'),
        'Binding Stitching',
        'binding-stitching',
        'Edge binding operations with fabric or synthetic tape to protect raw material margins and seal shoe openings.',
        NULL, NULL, 4, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'stitching'),
        'Zig Zag Stitching',
        'zigzag-stitching',
        'Zig-zag stitching for stretchable components, collar padding reinforcement, and dynamic stress zones.',
        NULL, NULL, 5, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'stitching'),
        'Flat Stitching',
        'flat-stitching',
        'Flatbed industrial stitching for flat upper pattern sub-assemblies before lasting geometry preparation.',
        NULL, NULL, 6, 'draft'
    )
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    subject_id = EXCLUDED.subject_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 3.3 Workers Category -> Assembly Subject (19 Modules in exact sequence)
INSERT INTO public.modules (
    category_id,
    subject_id,
    title,
    slug,
    description,
    youtube_url,
    youtube_video_id,
    display_order,
    status
)
VALUES
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Counter Moulding',
        'counter-moulding',
        'Thermoplastic heel counter activation and 3D cup shaping for rearfoot structural stability.',
        NULL, NULL, 1, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Stroble Stitching',
        'stroble-stitching',
        'Specialized strobel sewing attaching the insole sock directly to the upper perimeter.',
        NULL, NULL, 2, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Lasting',
        'lasting',
        'Precision pulling and lasting operations stretching upper leather securely over anatomical lasts.',
        NULL, NULL, 3, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Lace',
        'lace',
        'Lace tightening, anatomical eyelet tension balancing, and alignment locking before toe-seat clamping.',
        NULL, NULL, 4, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Seed Lasting',
        'seed-lasting',
        'Pre-tensioning and micro-adjusting side margins to eliminate wrinkles along the arch.',
        NULL, NULL, 5, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Marking',
        'marking',
        'Laser and gauge boundary marking defining exact adhesive zones for outsole attachment.',
        NULL, NULL, 6, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Roufing',
        'roufing',
        'Surface buffing and roughing to strip leather glaze and optimize molecular bonding surfaces.',
        NULL, NULL, 7, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Sole Wash',
        'sole-wash',
        'Chemical degreasing and surface decontamination of rubber and EVA outsole components.',
        NULL, NULL, 8, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Upper Wash',
        'upper-wash',
        'Specialized solvent washing removing release agents and particulates from the lasted upper feather edge.',
        NULL, NULL, 9, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Sole Pasting',
        'sole-pasting',
        'Even application of high-grade polyurethane adhesive across outsole gluing channels.',
        NULL, NULL, 10, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Upper Pasting',
        'upper-pasting',
        'Precise adhesive coating along the roughed margin of the lasted upper structure.',
        NULL, NULL, 11, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Sole Attaching',
        'sole-attaching',
        'Thermal adhesive reactivation and pneumatic bladder press bonding of sole to upper.',
        NULL, NULL, 12, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Edge Cleaning',
        'edge-cleaning',
        'Meticulous removal of microscopic adhesive flashings and overflow along the sole line.',
        NULL, NULL, 13, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'D Lasting',
        'd-lasting',
        'Delasting - safe pneumatic extraction of the aluminum or composite last without distorting shoe geometry.',
        NULL, NULL, 14, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Stuffing',
        'stuffing',
        'Recycled tissue paper stuffing and anatomical shape retention filler insertion for packaging stability.',
        NULL, NULL, 15, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Socks Inserting',
        'socks-inserting',
        'Orthopedic footbed and insole insert positioning with perfect arch and heel seat alignment.',
        NULL, NULL, 16, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Checking',
        'checking',
        'Comprehensive 100% final quality inspection verifying aesthetics, stitch integrity, and bonding strength.',
        NULL, NULL, 17, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Packing',
        'packing',
        'Individual pair wrapping, silica gel moisture placement, barcode verification, and luxury box packaging.',
        NULL, NULL, 18, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'assembly'),
        'Foxing',
        'foxing',
        'Vulcanized rubber foxing tape application sealing the perimeter junction of canvas and rubber footwear.',
        NULL, NULL, 19, 'draft'
    )
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    subject_id = EXCLUDED.subject_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 3.4 Workers Category -> Cutting Subject (2 Modules)
INSERT INTO public.modules (
    category_id,
    subject_id,
    title,
    slug,
    description,
    youtube_url,
    youtube_video_id,
    display_order,
    status
)
VALUES
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'cutting'),
        'Beam Cutting',
        'beam-cutting',
        'Hydraulic traveling head beam press operations for multi-layer fabric and lining cutting.',
        NULL, NULL, 1, 'draft'
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'workers'),
        (SELECT id FROM public.subjects WHERE slug = 'cutting'),
        'Normal Cutting',
        'normal-cutting',
        'Precision swing arm clicker press operations for genuine leather hide grading and directional cutting.',
        NULL, NULL, 2, 'draft'
    )
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    subject_id = EXCLUDED.subject_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- 4. VALIDATION QUERY (Verifies expected record counts)
-- ------------------------------------------------------------------------------
SELECT 
    (SELECT count(*) FROM public.categories) AS total_categories, -- Expected: 2
    (SELECT count(*) FROM public.subjects)   AS total_subjects,   -- Expected: 3
    (SELECT count(*) FROM public.modules)    AS total_modules;    -- Expected: 28
