-- ==============================================================================
-- FUSIONSOLE LEARNING & DEVELOPMENT PORTAL
-- Migration 001: Relational Schema, RLS, Indexes, Triggers & Quiz RPC
-- Technology: Supabase PostgreSQL (Free Tier compatible)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (HR Team & Administrators)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'hr_staff')) DEFAULT 'hr_staff',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for role lookup and active status
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE (Staff & Workers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_path TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- ------------------------------------------------------------------------------
-- 3. SUBJECTS TABLE (Manufacturing subjects under Workers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_path TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subjects_category ON public.subjects(category_id);
CREATE INDEX IF NOT EXISTS idx_subjects_slug ON public.subjects(slug);
CREATE INDEX IF NOT EXISTS idx_subjects_display_order ON public.subjects(display_order);

-- ------------------------------------------------------------------------------
-- 4. MODULES TABLE (All individual training modules)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    overview TEXT,
    learning_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    youtube_url TEXT,
    youtube_video_id TEXT,
    thumbnail_path TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_modules_category ON public.modules(category_id);
CREATE INDEX IF NOT EXISTS idx_modules_subject ON public.modules(subject_id);
CREATE INDEX IF NOT EXISTS idx_modules_slug ON public.modules(slug);
CREATE INDEX IF NOT EXISTS idx_modules_status ON public.modules(status);
CREATE INDEX IF NOT EXISTS idx_modules_display_order ON public.modules(display_order);

-- ------------------------------------------------------------------------------
-- 5. QUIZZES TABLE (Associated with modules)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL UNIQUE REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_module ON public.quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_is_published ON public.quizzes(is_published);

-- ------------------------------------------------------------------------------
-- 6. QUIZ_QUESTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON public.quiz_questions(display_order);

-- ------------------------------------------------------------------------------
-- 7. QUIZ_OPTIONS TABLE (Multiple options, 1 correct answer)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_options_question ON public.quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_order ON public.quiz_options(display_order);

-- ------------------------------------------------------------------------------
-- 8. AUTOMATIC updated_at TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
DO $$
BEGIN
    CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_quizzes_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TRIGGER trg_quiz_options_updated_at BEFORE UPDATE ON public.quiz_options FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current authenticated user is active HR Staff or Admin
CREATE OR REPLACE FUNCTION public.is_hr_team()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert and update profiles" ON public.profiles;
CREATE POLICY "Admins can insert and update profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- CATEGORIES Policies
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins full access to categories" ON public.categories;
CREATE POLICY "Admins full access to categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- SUBJECTS Policies
DROP POLICY IF EXISTS "Public can view active subjects" ON public.subjects;
CREATE POLICY "Public can view active subjects"
    ON public.subjects FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins full access to subjects" ON public.subjects;
CREATE POLICY "Admins full access to subjects"
    ON public.subjects FOR ALL
    USING (public.is_admin());

-- MODULES Policies
DROP POLICY IF EXISTS "Public can view published modules" ON public.modules;
CREATE POLICY "Public can view published modules"
    ON public.modules FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "HR staff can view all modules" ON public.modules;
CREATE POLICY "HR staff can view all modules"
    ON public.modules FOR SELECT
    USING (public.is_hr_team());

DROP POLICY IF EXISTS "Admins full access to modules" ON public.modules;
CREATE POLICY "Admins full access to modules"
    ON public.modules FOR ALL
    USING (public.is_admin());

-- QUIZZES Policies
DROP POLICY IF EXISTS "Public can view published quizzes" ON public.quizzes;
CREATE POLICY "Public can view published quizzes"
    ON public.quizzes FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins full access to quizzes" ON public.quizzes;
CREATE POLICY "Admins full access to quizzes"
    ON public.quizzes FOR ALL
    USING (public.is_admin());

-- QUIZ_QUESTIONS Policies
DROP POLICY IF EXISTS "Public can view questions for published quizzes" ON public.quiz_questions;
CREATE POLICY "Public can view questions for published quizzes"
    ON public.quiz_questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            WHERE q.id = quiz_questions.quiz_id
            AND q.is_published = true
        )
    );

DROP POLICY IF EXISTS "Admins full access to quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins full access to quiz questions"
    ON public.quiz_questions FOR ALL
    USING (public.is_admin());

-- QUIZ_OPTIONS Policies
-- CRITICAL SECURITY REQUIREMENT:
-- Unauthenticated learners MUST NOT read is_correct prior to submitting answers.
-- Admin can view all options with is_correct.
DROP POLICY IF EXISTS "Admins full access to quiz options" ON public.quiz_options;
CREATE POLICY "Admins full access to quiz options"
    ON public.quiz_options FOR ALL
    USING (public.is_admin());

-- Public learner safe view of options:
-- We create a dedicated view or grant select to public learners where is_correct is NOT leaked.
CREATE OR REPLACE VIEW public.learner_quiz_options AS
SELECT 
    id,
    question_id,
    option_text,
    display_order
FROM public.quiz_options;

-- Grant select on public learner view to anon & authenticated
GRANT SELECT ON public.learner_quiz_options TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 10. SERVER-SIDE SECURE QUIZ EVALUATION (RPC)
-- Evaluates learner answers on the database server without ever exposing is_correct
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.evaluate_quiz_submission(
    p_quiz_id UUID,
    p_answers JSONB -- Expected: [{"question_id": "...", "selected_option_id": "..."}]
)
RETURNS JSONB AS $$
DECLARE
    v_total_questions INT;
    v_correct_count INT := 0;
    v_score_percent INT;
    v_passed BOOLEAN;
    v_result_items JSONB := '[]'::jsonb;
    v_item JSONB;
    v_q_id UUID;
    v_selected_opt_id UUID;
    v_actual_correct_opt_id UUID;
    v_explanation TEXT;
    v_is_q_correct BOOLEAN;
BEGIN
    -- Verify quiz exists and is published
    IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE id = p_quiz_id AND is_published = true) THEN
        RAISE EXCEPTION 'Quiz not found or not currently published';
    END IF;

    -- Count total questions in quiz
    SELECT COUNT(*) INTO v_total_questions 
    FROM public.quiz_questions 
    WHERE quiz_id = p_quiz_id;

    IF v_total_questions = 0 THEN
        RAISE EXCEPTION 'Quiz has no questions';
    END IF;

    -- Iterate through each question in the quiz
    FOR v_q_id, v_actual_correct_opt_id, v_explanation IN
        SELECT q.id, o.id, q.explanation
        FROM public.quiz_questions q
        LEFT JOIN public.quiz_options o ON o.question_id = q.id AND o.is_correct = true
        WHERE q.quiz_id = p_quiz_id
        ORDER BY q.display_order ASC
    LOOP
        -- Find learner's selected answer for this question
        v_selected_opt_id := NULL;
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_answers)
        LOOP
            IF (v_item->>'question_id')::uuid = v_q_id THEN
                v_selected_opt_id := (v_item->>'selected_option_id')::uuid;
                EXIT;
            END IF;
        END LOOP;

        v_is_q_correct := (v_selected_opt_id IS NOT NULL AND v_selected_opt_id = v_actual_correct_opt_id);

        IF v_is_q_correct THEN
            v_correct_count := v_correct_count + 1;
        END IF;

        -- Append evaluation result with explanation
        v_result_items := v_result_items || jsonb_build_object(
            'question_id', v_q_id,
            'selected_option_id', v_selected_opt_id,
            'is_correct', v_is_q_correct,
            'correct_option_id', v_actual_correct_opt_id,
            'explanation', COALESCE(v_explanation, '')
        );
    END LOOP;

    v_score_percent := ROUND((v_correct_count::numeric / v_total_questions::numeric) * 100);
    v_passed := (v_score_percent >= 66);

    RETURN jsonb_build_object(
        'quiz_id', p_quiz_id,
        'total_questions', v_total_questions,
        'correct_count', v_correct_count,
        'score_percentage', v_score_percent,
        'passed', v_passed,
        'feedback', CASE 
            WHEN v_passed THEN 'Assessment Passed: You have demonstrated solid operational understanding.' 
            ELSE 'Review Required: Please review the operational explanations and retake the assessment.' 
        END,
        'results', v_result_items
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.evaluate_quiz_submission(UUID, JSONB) TO anon, authenticated;
