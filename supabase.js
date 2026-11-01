/**
 * Fusionsole Learning Portal - Supabase Client & Data Service Layer
 * Supports both live Supabase PostgreSQL + Auth and offline-persistent Local DB mode.
 * Automatically synchronizes with local storage and respects RLS principles.
 */

import { createClient } from '@supabase/supabase-js';

// -----------------------------------------------------------------------------
// 1. ENVIRONMENT CONFIGURATION & RESOLUTION
// -----------------------------------------------------------------------------
const ENV_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Allow dynamic credentials via Admin Panel settings or localStorage
const STORED_URL = localStorage.getItem('FUSIONSOLE_SUPABASE_URL') || '';
const STORED_KEY = localStorage.getItem('FUSIONSOLE_SUPABASE_ANON_KEY') || '';

export const SUPABASE_URL = STORED_URL || ENV_URL;
export const SUPABASE_ANON_KEY = STORED_KEY || ENV_KEY;

export const isLiveConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('http') && 
  !SUPABASE_URL.includes('your-project-id')
);

export const isProduction = Boolean(import.meta.env.PROD);

// Initialize Supabase Client instance (null if unconfigured)
export const supabase = isLiveConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// -----------------------------------------------------------------------------
// 2. INITIAL SEED DEFINITION (Used for Local DB mode and fallback synchronization)
// All 28 modules are initially 'draft' per user prompt requirement.
// -----------------------------------------------------------------------------
const INITIAL_CATEGORIES = [
  {
    id: 'cat-staff-01',
    name: 'Staff',
    slug: 'staff',
    description: 'An introduction to Fusionsole, the workplace environment, company practices and essential information for newly joined staff.',
    image_path: '/images/fusion-moulds.jpg',
    display_order: 1,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'cat-workers-02',
    name: 'Workers',
    slug: 'workers',
    description: 'Practical skill programmes covering manufacturing departments and footwear construction operations.',
    image_path: '/images/fusion-stitching.jpg',
    display_order: 2,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  }
];

const INITIAL_SUBJECTS = [
  {
    id: 'sub-stitching-01',
    category_id: 'cat-workers-02',
    name: 'Stitching',
    slug: 'stitching',
    description: 'Understand stitching operations, equipment, component joining and the importance of quality throughout the process.',
    image_path: '/images/fusion-stitching.jpg',
    display_order: 1,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'sub-assembly-02',
    category_id: 'cat-workers-02',
    name: 'Assembly',
    slug: 'assembly',
    description: 'Learn about shoe shaping, lasting operations, sole bonding and the processes involved in forming the footwear structure.',
    image_path: '/images/fusion-lasting.jpg',
    display_order: 2,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'sub-cutting-03',
    category_id: 'cat-workers-02',
    name: 'Cutting',
    slug: 'cutting',
    description: 'An introduction to material preparation, cutting operations and the processes involved in preparing footwear components.',
    image_path: '/images/fusion-moulds.jpg',
    display_order: 3,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  }
];

// 28 initial modules (1 Staff + 6 Stitching + 19 Assembly + 2 Cutting)
// All initial modules start as 'draft' until HR publishes them
const INITIAL_MODULES = [
  // Staff (1)
  {
    id: 'mod-01-staff-induction',
    category_id: 'cat-staff-01',
    subject_id: null,
    title: 'Staff Induction',
    slug: 'staff-induction',
    description: 'Get introduced to our workplace culture, organizational values, facility layout, safety protocols, and company operational standards.',
    overview: 'This foundational induction module is designed to provide all newly joined staff members with a clear understanding of Fusionsole as a premier footwear manufacturing organization.',
    learning_objectives: [
      'Understand Fusionsole organizational mission, operational values, and company history.',
      'Identify key facility safety regulations, emergency exits, and workplace health practices.',
      'Learn HR policies, attendance systems, compliance protocols, and employee communication channels.'
    ],
    instructions: [
      'Review all organizational guidelines and complete your induction checklist with HR within week one.',
      'Ensure adherence to personal protective equipment (PPE) requirements when walking production areas.',
      'Report any safety hazards or facility concerns immediately to your department supervisor.'
    ],
    youtube_url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    youtube_video_id: 'ysz5S6PUM-U',
    thumbnail_path: '/images/fusion-moulds.jpg',
    display_order: 1,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },

  // Stitching (6)
  {
    id: 'mod-02-sn-stitching',
    category_id: 'cat-workers-02',
    subject_id: 'sub-stitching-01',
    title: 'S/N Stitching',
    slug: 'sn-stitching',
    description: 'Single Needle stitching operations for precision seam joining and shoe upper contour construction.',
    overview: 'Single Needle (S/N) stitching is one of the most critical foundational operations in the footwear upper preparation.',
    learning_objectives: [
      'Master single-needle machine setup, thread tension adjustment, and feed dog calibration.',
      'Execute consistent stitch pitch and precise margin distances from cut component edges.',
      'Identify common stitch defects such as thread breakage, skipped stitches, and seam puckering.'
    ],
    instructions: [
      'Always verify needle sharpness and size (#16-#18 for heavy upper leathers) before starting a run.',
      'Maintain a stable 2.0mm to 2.5mm margin from the edge unless blueprint specifications dictate otherwise.',
      'Clean bobbin cases regularly with compressed air or soft brushes at the end of each shift.'
    ],
    youtube_url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    youtube_video_id: 'ysz5S6PUM-U',
    thumbnail_path: '/images/fusion-stitching.jpg',
    display_order: 1,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'mod-03-dn-stitching',
    category_id: 'cat-workers-02',
    subject_id: 'sub-stitching-01',
    title: 'D/N Stitching',
    slug: 'dn-stitching',
    description: 'Double Needle stitching for parallel stitch reinforcement, aesthetic detailing, and high-stress seam durability.',
    overview: 'Double Needle (D/N) machines utilize two needles operating in parallel to produce twin rows of uniform stitching in a single pass.',
    learning_objectives: ['Synchronize twin needle timing', 'Ensure uniform needle gauge spacing', 'Maintain straight parallel seam tracks'],
    instructions: ['Check needle alignment using standard gauge finger before feeding material.'],
    youtube_url: '',
    youtube_video_id: '',
    thumbnail_path: '/images/fusion-stitching.jpg',
    display_order: 2,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'mod-04-cs-stitching',
    category_id: 'cat-workers-02',
    subject_id: 'sub-stitching-01',
    title: 'C/S Stitching',
    slug: 'cs-stitching',
    description: 'Chain Stitching operations delivering elasticity, flexibility, and high seam elongation for ergonomic zones.',
    overview: 'Chain Stitching creates flexible seams capable of stretching without rupture.',
    learning_objectives: ['Understand looper mechanics and chain tension balance', 'Prevent accidental unraveling of tail ends'],
    instructions: ['Lock trailing stitch loops properly before routing parts to next station.'],
    youtube_url: '',
    youtube_video_id: '',
    thumbnail_path: '/images/fusion-stitching.jpg',
    display_order: 3,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'mod-05-binding-stitching',
    category_id: 'cat-workers-02',
    subject_id: 'sub-stitching-01',
    title: 'Binding Stitching',
    slug: 'binding-stitching',
    description: 'Edge binding operations with fabric or synthetic tape to protect raw material margins and seal shoe openings.',
    overview: 'Binding encloses raw edges of collar and eyelet facings with dedicated tape folders.',
    learning_objectives: ['Master tape folder positioning and uniform wrap depth', 'Maintain even corner tension on curves'],
    instructions: ['Inspect folder cleanliness to prevent tape oil stains.'],
    youtube_url: '',
    youtube_video_id: '',
    thumbnail_path: '/images/fusion-stitching.jpg',
    display_order: 4,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'mod-06-zigzag-stitching',
    category_id: 'cat-workers-02',
    subject_id: 'sub-stitching-01',
    title: 'Zig Zag Stitching',
    slug: 'zigzag-stitching',
    description: 'Zig-zag stitching for stretchable components, collar padding reinforcement, and dynamic stress zones.',
    overview: 'Zig-zag stitching accommodates multidirectional stretch and butt-joint joining.',
    learning_objectives: ['Calibrate stitch width and throw frequency', 'Reinforce collar seams without edge puckering'],
    instructions: ['Test fabric stretch recovery on test swatches before each lot.'],
    youtube_url: '',
    youtube_video_id: '',
    thumbnail_path: '/images/fusion-stitching.jpg',
    display_order: 5,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'mod-07-flat-stitching',
    category_id: 'cat-workers-02',
    subject_id: 'sub-stitching-01',
    title: 'Flat Stitching',
    slug: 'flat-stitching',
    description: 'Flatbed industrial stitching for flat upper pattern sub-assemblies before lasting geometry preparation.',
    overview: 'Flat stitching performs pre-closing assemblies on heavy flatbed machinery.',
    learning_objectives: ['Guide flat components smoothly across the flatbed feed plate', 'Control stitch margin consistency'],
    instructions: ['Keep hands clear of needle bars; use magnetic edge guides.'],
    youtube_url: '',
    youtube_video_id: '',
    thumbnail_path: '/images/fusion-stitching.jpg',
    display_order: 6,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },

  // Assembly (19 Modules in exact order)
  { id: 'mod-08-counter-moulding', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Counter Moulding', slug: 'counter-moulding', description: 'Thermoplastic heel counter activation and 3D cup shaping for rearfoot structural stability.', display_order: 1, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-09-stroble-stitching', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Stroble Stitching', slug: 'stroble-stitching', description: 'Specialized strobel sewing attaching the insole sock directly to the upper perimeter.', display_order: 2, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-10-lasting', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Lasting', slug: 'lasting', description: 'Precision pulling and lasting operations stretching upper leather securely over anatomical lasts.', display_order: 3, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-11-lace', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Lace', slug: 'lace', description: 'Lace tightening, anatomical eyelet tension balancing, and alignment locking before toe-seat clamping.', display_order: 4, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-12-seed-lasting', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Seed Lasting', slug: 'seed-lasting', description: 'Pre-tensioning and micro-adjusting side margins to eliminate wrinkles along the arch.', display_order: 5, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-13-marking', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Marking', slug: 'marking', description: 'Laser and gauge boundary marking defining exact adhesive zones for outsole attachment.', display_order: 6, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-14-roufing', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Roufing', slug: 'roufing', description: 'Surface buffing and roughing to strip leather glaze and optimize molecular bonding surfaces.', display_order: 7, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-15-sole-wash', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Sole Wash', slug: 'sole-wash', description: 'Chemical degreasing and surface decontamination of rubber and EVA outsole components.', display_order: 8, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-16-upper-wash', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Upper Wash', slug: 'upper-wash', description: 'Specialized solvent washing removing release agents and particulates from the lasted upper feather edge.', display_order: 9, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-17-sole-pasting', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Sole Pasting', slug: 'sole-pasting', description: 'Even application of high-grade polyurethane adhesive across outsole gluing channels.', display_order: 10, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-18-upper-pasting', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Upper Pasting', slug: 'upper-pasting', description: 'Precise adhesive coating along the roughed margin of the lasted upper structure.', display_order: 11, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-19-sole-attaching', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Sole Attaching', slug: 'sole-attaching', description: 'Thermal adhesive reactivation and pneumatic bladder press bonding of sole to upper.', display_order: 12, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-20-edge-cleaning', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Edge Cleaning', slug: 'edge-cleaning', description: 'Meticulous removal of microscopic adhesive flashings and overflow along the sole line.', display_order: 13, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-21-d-lasting', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'D Lasting', slug: 'd-lasting', description: 'Delasting - safe pneumatic extraction of the aluminum or composite last without distorting shoe geometry.', display_order: 14, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-22-stuffing', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Stuffing', slug: 'stuffing', description: 'Recycled tissue paper stuffing and anatomical shape retention filler insertion for packaging stability.', display_order: 15, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-23-socks-inserting', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Socks Inserting', slug: 'socks-inserting', description: 'Orthopedic footbed and insole insert positioning with perfect arch and heel seat alignment.', display_order: 16, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-24-checking', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Checking', slug: 'checking', description: 'Comprehensive 100% final quality inspection verifying aesthetics, stitch integrity, and bonding strength.', display_order: 17, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-25-packing', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Packing', slug: 'packing', description: 'Individual pair wrapping, silica gel moisture placement, barcode verification, and luxury box packaging.', display_order: 18, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-26-foxing', category_id: 'cat-workers-02', subject_id: 'sub-assembly-02', title: 'Foxing', slug: 'foxing', description: 'Vulcanized rubber foxing tape application sealing the perimeter junction of canvas and rubber footwear.', display_order: 19, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },

  // Cutting (2)
  { id: 'mod-27-beam-cutting', category_id: 'cat-workers-02', subject_id: 'sub-cutting-03', title: 'Beam Cutting', slug: 'beam-cutting', description: 'Hydraulic traveling head beam press operations for multi-layer fabric and lining cutting.', display_order: 1, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' },
  { id: 'mod-28-normal-cutting', category_id: 'cat-workers-02', subject_id: 'sub-cutting-03', title: 'Normal Cutting', slug: 'normal-cutting', description: 'Precision swing arm clicker press operations for genuine leather hide grading and directional cutting.', display_order: 2, status: 'draft', created_at: '2026-11-01T08:00:00Z', updated_at: '2026-11-01T08:00:00Z' }
];

const INITIAL_QUIZZES = [
  {
    id: 'quiz-01-staff-induction',
    module_id: 'mod-01-staff-induction',
    title: 'Staff Induction Knowledge Assessment',
    description: 'Verification of company values, facility safety, and workplace standards for new staff members.',
    is_published: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  }
];

const INITIAL_QUESTIONS = [
  {
    id: 'q-01-staff-induction-1',
    quiz_id: 'quiz-01-staff-induction',
    question_text: 'What is the primary commitment that guides everyday operations across all Fusionsole facilities?',
    display_order: 1,
    explanation: 'Fusionsole emphasizes that crafting quality begins with skilled people who understand their work and collaborate with mutual respect.',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'q-02-staff-induction-2',
    quiz_id: 'quiz-01-staff-induction',
    question_text: 'When visiting or transitioning through production floor departments, what is mandatory for all staff members?',
    display_order: 2,
    explanation: 'Safety is paramount. All team members must adhere to PPE protocols and remain within marked pedestrian transit lines on the factory floor.',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'q-03-staff-induction-3',
    quiz_id: 'quiz-01-staff-induction',
    question_text: 'Where should staff members direct general operational questions or HR checklist submissions?',
    display_order: 3,
    explanation: 'Department supervisors and the HR Learning team are always available to assist new personnel with questions and checklist verifications.',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  }
];

const INITIAL_OPTIONS = [
  // Q1
  { id: 'opt-q1-1', question_id: 'q-01-staff-induction-1', option_text: 'Achieving speed at the expense of process compliance', is_correct: false, display_order: 1 },
  { id: 'opt-q1-2', question_id: 'q-01-staff-induction-1', option_text: 'Building knowledge, developing skills, and upholding uncompromising product quality', is_correct: true, display_order: 2 },
  { id: 'opt-q1-3', question_id: 'q-01-staff-induction-1', option_text: 'Focusing solely on administrative targets rather than workshop safety', is_correct: false, display_order: 3 },
  { id: 'opt-q1-4', question_id: 'q-01-staff-induction-1', option_text: 'Limiting inter-departmental communication between staff and production teams', is_correct: false, display_order: 4 },
  // Q2
  { id: 'opt-q2-1', question_id: 'q-02-staff-induction-2', option_text: 'Using active mobile phones while walking near machines', is_correct: false, display_order: 1 },
  { id: 'opt-q2-2', question_id: 'q-02-staff-induction-2', option_text: 'Wearing designated personal protective equipment (PPE) and following marked safety walkways', is_correct: true, display_order: 2 },
  { id: 'opt-q2-3', question_id: 'q-02-staff-induction-2', option_text: 'Operating heavy industrial machinery without prior department authorization', is_correct: false, display_order: 3 },
  { id: 'opt-q2-4', question_id: 'q-02-staff-induction-2', option_text: 'Ignoring floor warning tape and machine safety cages', is_correct: false, display_order: 4 },
  // Q3
  { id: 'opt-q3-1', question_id: 'q-03-staff-induction-3', option_text: 'To their immediate department supervisor or the HR Learning & Development office', is_correct: true, display_order: 1 },
  { id: 'opt-q3-2', question_id: 'q-03-staff-induction-3', option_text: 'External social media groups', is_correct: false, display_order: 2 },
  { id: 'opt-q3-3', question_id: 'q-03-staff-induction-3', option_text: 'Leave questions unasked until annual reviews', is_correct: false, display_order: 3 },
  { id: 'opt-q3-4', question_id: 'q-03-staff-induction-3', option_text: 'To outside vendors visiting the loading docks', is_correct: false, display_order: 4 }
];

const INITIAL_TEAM = [
  {
    id: 'user-admin-01',
    full_name: 'Elena Rostova',
    email: 'admin@fusionsole.com',
    role: 'admin',
    is_active: true,
    created_at: '2026-10-15T09:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'user-hr-02',
    full_name: 'Marcus Vance',
    email: 'hr.vance@fusionsole.com',
    role: 'hr_staff',
    is_active: true,
    created_at: '2026-10-20T10:30:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'user-hr-03',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@fusionsole.com',
    role: 'hr_staff',
    is_active: true,
    created_at: '2026-10-25T11:15:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  }
];

// -----------------------------------------------------------------------------
// 3. LOCAL RELATIONAL DATABASE STORAGE ENGINE (Persistence Layer)
// -----------------------------------------------------------------------------
class LocalDatabaseStore {
  constructor() {
    this.storageKey = 'FUSIONSOLE_LOCAL_DB_V2';
    this.authKey = 'FUSIONSOLE_CURRENT_AUTH_USER';
    this.init();
  }

  init() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.data = {
        categories: INITIAL_CATEGORIES,
        subjects: INITIAL_SUBJECTS,
        modules: INITIAL_MODULES,
        quizzes: INITIAL_QUIZZES,
        quiz_questions: INITIAL_QUESTIONS,
        quiz_options: INITIAL_OPTIONS,
        profiles: INITIAL_TEAM
      };
      this.save();
    } else {
      try {
        this.data = JSON.parse(raw);
        // Ensure all collections exist
        if (!this.data.categories) this.data.categories = INITIAL_CATEGORIES;
        if (!this.data.subjects) this.data.subjects = INITIAL_SUBJECTS;
        if (!this.data.modules) this.data.modules = INITIAL_MODULES;
        if (!this.data.quizzes) this.data.quizzes = INITIAL_QUIZZES;
        if (!this.data.quiz_questions) this.data.quiz_questions = INITIAL_QUESTIONS;
        if (!this.data.quiz_options) this.data.quiz_options = INITIAL_OPTIONS;
        if (!this.data.profiles) this.data.profiles = INITIAL_TEAM;
      } catch (e) {
        console.error('Failed to parse local database storage, resetting to seeds:', e);
        this.data = {
          categories: INITIAL_CATEGORIES,
          subjects: INITIAL_SUBJECTS,
          modules: INITIAL_MODULES,
          quizzes: INITIAL_QUIZZES,
          quiz_questions: INITIAL_QUESTIONS,
          quiz_options: INITIAL_OPTIONS,
          profiles: INITIAL_TEAM
        };
        this.save();
      }
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  resetToInitial() {
    this.data = {
      categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
      subjects: JSON.parse(JSON.stringify(INITIAL_SUBJECTS)),
      modules: JSON.parse(JSON.stringify(INITIAL_MODULES)),
      quizzes: JSON.parse(JSON.stringify(INITIAL_QUIZZES)),
      quiz_questions: JSON.parse(JSON.stringify(INITIAL_QUESTIONS)),
      quiz_options: JSON.parse(JSON.stringify(INITIAL_OPTIONS)),
      profiles: JSON.parse(JSON.stringify(INITIAL_TEAM))
    };
    this.save();
  }
}

export const localDb = new LocalDatabaseStore();

// -----------------------------------------------------------------------------
// 4. UNIFIED DATA SERVICE (Abstracts Supabase Live vs Local Database)
// -----------------------------------------------------------------------------
export const dbService = {
  // --- CONNECTION STATUS ---
  getConnectionStatus() {
    return {
      isLive: isLiveConfigured,
      isProduction,
      url: SUPABASE_URL || 'Not Configured',
      anonKey: SUPABASE_ANON_KEY ? '••••••••' + SUPABASE_ANON_KEY.slice(-6) : 'Missing',
      mode: isLiveConfigured 
        ? 'Supabase PostgreSQL (Cloud Active)' 
        : (isProduction ? 'Supabase Connection Required' : 'Local Database Mode (Development Fallback)')
    };
  },

  // --- AUTHENTICATION & SESSION ---
  async getCurrentUser() {
    if (isLiveConfigured && supabase) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileErr && profileErr.code !== 'PGRST116') {
        console.warn('Profile fetch note:', profileErr.message);
      }
      return {
        id: session.user.id,
        email: session.user.email,
        full_name: profile?.full_name || session.user.user_metadata?.full_name || 'HR User',
        role: profile?.role || 'admin',
        is_active: profile?.is_active ?? true
      };
    }

    if (isProduction) {
      return null;
    }

    // Local DB Auth (Development only - require explicit session)
    const raw = localStorage.getItem('FUSIONSOLE_CURRENT_AUTH_USER');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  async signIn(email, password) {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message || 'Invalid email or password.');
      const user = await this.getCurrentUser();
      if (user && !user.is_active) {
        await supabase.auth.signOut();
        throw new Error('This HR account is currently disabled. Please contact system admin.');
      }
      return user;
    }

    if (isProduction) {
      throw new Error('Cloud Connection Error: Cannot authenticate without configured Supabase project in production.');
    }

    // Local Auth verification (Development only)
    const found = localDb.data.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('User not found. Use admin@fusionsole.com to sign in.');
    }
    if (!found.is_active) {
      throw new Error('This HR account is currently disabled. Please contact system admin.');
    }
    localStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(found));
    return found;
  },

  async signOut() {
    if (isLiveConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('FUSIONSOLE_CURRENT_AUTH_USER');
  },

  // --- CATEGORIES ---
  async getCategories(onlyActive = false) {
    if (isLiveConfigured && supabase) {
      let query = supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (error) {
        console.error('Supabase getCategories error:', error);
        throw new Error('Failed to load categories from Supabase: ' + error.message);
      }
      return data || [];
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloudflare Pages.');
    }
    let list = [...localDb.data.categories];
    if (onlyActive) list = list.filter(c => c.is_active);
    return list.sort((a, b) => a.display_order - b.display_order);
  },

  async getCategoryBySlug(slug) {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to load category from Supabase: ' + error.message);
      }
      return data || null;
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }
    return localDb.data.categories.find(c => c.slug === slug) || null;
  },

  async saveCategory(categoryData) {
    const now = new Date().toISOString();
    if (isLiveConfigured && supabase) {
      if (categoryData.id) {
        const { data, error } = await supabase.from('categories').update({ ...categoryData, updated_at: now }).eq('id', categoryData.id).select().single();
        if (error) throw new Error('Failed to update category: ' + error.message);
        return data;
      } else {
        const { data, error } = await supabase.from('categories').insert([{ ...categoryData, created_at: now, updated_at: now }]).select().single();
        if (error) throw new Error('Failed to create category: ' + error.message);
        return data;
      }
    }
    if (isProduction) {
      throw new Error('Database write error: Production requires active Supabase cloud connection.');
    }

    if (categoryData.id) {
      const idx = localDb.data.categories.findIndex(c => c.id === categoryData.id);
      if (idx !== -1) {
        localDb.data.categories[idx] = { ...localDb.data.categories[idx], ...categoryData, updated_at: now };
        localDb.save();
        return localDb.data.categories[idx];
      }
    }
    const newCat = {
      id: 'cat-' + Date.now(),
      ...categoryData,
      display_order: Number(categoryData.display_order) || localDb.data.categories.length + 1,
      is_active: categoryData.is_active ?? true,
      created_at: now,
      updated_at: now
    };
    localDb.data.categories.push(newCat);
    localDb.save();
    return newCat;
  },

  async deleteCategory(id) {
    if (isLiveConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw new Error('Failed to delete category: ' + error.message);
      return true;
    }
    if (isProduction) {
      throw new Error('Database delete error: Production requires active Supabase cloud connection.');
    }

    const hasSubjects = localDb.data.subjects.some(s => s.category_id === id);
    const hasModules = localDb.data.modules.some(m => m.category_id === id);
    if (hasSubjects || hasModules) {
      throw new Error('Cannot delete category: Dependent subjects or modules exist. Please reassign or delete them first.');
    }
    localDb.data.categories = localDb.data.categories.filter(c => c.id !== id);
    localDb.save();
    return true;
  },

  // --- SUBJECTS ---
  async getSubjects(onlyActive = false) {
    if (isLiveConfigured && supabase) {
      let query = supabase.from('subjects').select('*, categories(name)').order('display_order', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (error) {
        console.error('Supabase getSubjects error:', error);
        throw new Error('Failed to load subjects from Supabase: ' + error.message);
      }
      return (data || []).map(s => ({
        ...s,
        category_name: s.categories?.name || 'Unknown'
      }));
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloudflare Pages.');
    }
    let list = localDb.data.subjects.map(s => {
      const cat = localDb.data.categories.find(c => c.id === s.category_id);
      return { ...s, category_name: cat ? cat.name : 'Unknown' };
    });
    if (onlyActive) list = list.filter(s => s.is_active);
    return list.sort((a, b) => a.display_order - b.display_order);
  },

  async getSubjectBySlug(slug) {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase.from('subjects').select('*, categories(*)').eq('slug', slug).single();
      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to load subject from Supabase: ' + error.message);
      }
      return data || null;
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }
    return localDb.data.subjects.find(s => s.slug === slug) || null;
  },

  async saveSubject(subjectData) {
    const now = new Date().toISOString();
    if (isLiveConfigured && supabase) {
      if (subjectData.id) {
        const { data, error } = await supabase.from('subjects').update({ ...subjectData, updated_at: now }).eq('id', subjectData.id).select().single();
        if (error) throw new Error('Failed to update subject: ' + error.message);
        return data;
      } else {
        const { data, error } = await supabase.from('subjects').insert([{ ...subjectData, created_at: now, updated_at: now }]).select().single();
        if (error) throw new Error('Failed to create subject: ' + error.message);
        return data;
      }
    }
    if (isProduction) {
      throw new Error('Database write error: Production requires active Supabase cloud connection.');
    }

    if (subjectData.id) {
      const idx = localDb.data.subjects.findIndex(s => s.id === subjectData.id);
      if (idx !== -1) {
        localDb.data.subjects[idx] = { ...localDb.data.subjects[idx], ...subjectData, updated_at: now };
        localDb.save();
        return localDb.data.subjects[idx];
      }
    }
    const newSub = {
      id: 'sub-' + Date.now(),
      ...subjectData,
      display_order: Number(subjectData.display_order) || localDb.data.subjects.length + 1,
      is_active: subjectData.is_active ?? true,
      created_at: now,
      updated_at: now
    };
    localDb.data.subjects.push(newSub);
    localDb.save();
    return newSub;
  },

  async deleteSubject(id) {
    if (isLiveConfigured && supabase) {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) throw new Error('Failed to delete subject: ' + error.message);
      return true;
    }
    if (isProduction) {
      throw new Error('Database delete error: Production requires active Supabase cloud connection.');
    }

    const hasModules = localDb.data.modules.some(m => m.subject_id === id);
    if (hasModules) {
      throw new Error('Cannot delete subject: Modules are assigned to this subject. Please reassign or delete modules first.');
    }
    localDb.data.subjects = localDb.data.subjects.filter(s => s.id !== id);
    localDb.save();
    return true;
  },

  // --- MODULES ---
  async getModules(filters = {}) {
    if (isLiveConfigured && supabase) {
      let query = supabase.from('modules').select('*, categories(name, slug), subjects(name, slug), quizzes(id, is_published)');
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
      query = query.order('display_order', { ascending: true });
      const { data, error } = await query;
      if (error) {
        console.error('Supabase getModules error:', error);
        throw new Error('Failed to load modules from Supabase: ' + error.message);
      }
      let list = (data || []).map(m => {
        const quiz = Array.isArray(m.quizzes) ? m.quizzes[0] : m.quizzes;
        return {
          ...m,
          category: m.categories ? { name: m.categories.name, slug: m.categories.slug } : null,
          subject: m.subjects ? { name: m.subjects.name, slug: m.subjects.slug } : null,
          has_video: Boolean(m.youtube_video_id || m.youtube_url),
          has_quiz: Boolean(quiz),
          quiz_published: quiz?.is_published ?? false
        };
      });
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(m => m.title.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q));
      }
      return list;
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloudflare Pages.');
    }

    let list = localDb.data.modules.map(m => {
      const cat = localDb.data.categories.find(c => c.id === m.category_id);
      const sub = localDb.data.subjects.find(s => s.id === m.subject_id);
      const quiz = localDb.data.quizzes.find(q => q.module_id === m.id);
      return {
        ...m,
        category: cat ? { name: cat.name, slug: cat.slug } : null,
        subject: sub ? { name: sub.name, slug: sub.slug } : null,
        has_video: Boolean(m.youtube_video_id || m.youtube_url),
        has_quiz: Boolean(quiz),
        quiz_published: quiz?.is_published ?? false
      };
    });

    if (filters.status) list = list.filter(m => m.status === filters.status);
    if (filters.categoryId) list = list.filter(m => m.category_id === filters.categoryId);
    if (filters.subjectId) list = list.filter(m => m.subject_id === filters.subjectId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(m => m.title.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.display_order - b.display_order);
  },

  async getModuleBySlug(slug) {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase
        .from('modules')
        .select('*, categories(*), subjects(*)')
        .eq('slug', slug)
        .single();
      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to load module from Supabase: ' + error.message);
      }
      return data || null;
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }

    const m = localDb.data.modules.find(mod => mod.slug === slug);
    if (!m) return null;
    const cat = localDb.data.categories.find(c => c.id === m.category_id);
    const sub = localDb.data.subjects.find(s => s.id === m.subject_id);
    return {
      ...m,
      categories: cat || null,
      subjects: sub || null
    };
  },

  async getModuleById(id) {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase.from('modules').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') {
        throw new Error('Failed to load module from Supabase: ' + error.message);
      }
      return data || null;
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }
    return localDb.data.modules.find(m => m.id === id) || null;
  },

  async saveModule(moduleData) {
    const now = new Date().toISOString();
    let ytId = moduleData.youtube_video_id || '';
    if (moduleData.youtube_url) {
      ytId = this.extractYouTubeId(moduleData.youtube_url);
    }

    const cleanData = {
      ...moduleData,
      youtube_video_id: ytId,
      display_order: Number(moduleData.display_order) || 1,
      learning_objectives: Array.isArray(moduleData.learning_objectives) ? moduleData.learning_objectives : [],
      instructions: Array.isArray(moduleData.instructions) ? moduleData.instructions : [],
      updated_at: now
    };

    if (isLiveConfigured && supabase) {
      if (cleanData.id) {
        const { data, error } = await supabase.from('modules').update(cleanData).eq('id', cleanData.id).select().single();
        if (error) throw new Error('Failed to update module: ' + error.message);
        return data;
      } else {
        const { data, error } = await supabase.from('modules').insert([{ ...cleanData, created_at: now }]).select().single();
        if (error) throw new Error('Failed to create module: ' + error.message);
        return data;
      }
    }
    if (isProduction) {
      throw new Error('Database write error: Production requires active Supabase cloud connection.');
    }

    if (cleanData.id) {
      const idx = localDb.data.modules.findIndex(m => m.id === cleanData.id);
      if (idx !== -1) {
        localDb.data.modules[idx] = { ...localDb.data.modules[idx], ...cleanData };
        localDb.save();
        return localDb.data.modules[idx];
      }
    }

    const newMod = {
      id: 'mod-' + Date.now(),
      ...cleanData,
      status: cleanData.status || 'draft',
      created_at: now
    };
    localDb.data.modules.push(newMod);
    localDb.save();
    return newMod;
  },

  async deleteModule(id) {
    if (isLiveConfigured && supabase) {
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) throw new Error('Failed to delete module: ' + error.message);
      return true;
    }
    if (isProduction) {
      throw new Error('Database delete error: Production requires active Supabase cloud connection.');
    }

    localDb.data.modules = localDb.data.modules.filter(m => m.id !== id);
    const qIds = localDb.data.quizzes.filter(q => q.module_id === id).map(q => q.id);
    localDb.data.quizzes = localDb.data.quizzes.filter(q => q.module_id !== id);
    localDb.data.quiz_questions = localDb.data.quiz_questions.filter(qq => !qIds.includes(qq.quiz_id));
    localDb.save();
    return true;
  },

  async reorderModules(orderedIds) {
    if (isLiveConfigured && supabase) {
      for (let i = 0; i < orderedIds.length; i++) {
        const { error } = await supabase.from('modules').update({ display_order: i + 1 }).eq('id', orderedIds[i]);
        if (error) throw new Error('Failed to reorder modules: ' + error.message);
      }
      return true;
    }
    if (isProduction) {
      throw new Error('Database reorder error: Production requires active Supabase cloud connection.');
    }

    orderedIds.forEach((id, index) => {
      const m = localDb.data.modules.find(item => item.id === id);
      if (m) m.display_order = index + 1;
    });
    localDb.save();
    return true;
  },

  // --- QUIZZES ---
  async getQuizzes() {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, modules(title, slug, status), quiz_questions(id)');
      if (error) throw new Error('Failed to load quizzes: ' + error.message);
      return (data || []).map(q => ({
        ...q,
        module_title: q.modules?.title || 'Unassigned',
        module_slug: q.modules?.slug || '',
        question_count: q.quiz_questions?.length || 0
      }));
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }

    return localDb.data.quizzes.map(q => {
      const m = localDb.data.modules.find(mod => mod.id === q.module_id);
      const questionCount = localDb.data.quiz_questions.filter(qq => qq.quiz_id === q.id).length;
      return {
        ...q,
        module_title: m ? m.title : 'Unassigned',
        module_slug: m ? m.slug : '',
        question_count: questionCount
      };
    });
  },

  async getQuizByModuleId(moduleId, includeAnswers = false) {
    if (isLiveConfigured && supabase) {
      const { data: qData, error: qErr } = await supabase.from('quizzes').select('*').eq('module_id', moduleId).single();
      if (qErr && qErr.code !== 'PGRST116') throw new Error('Failed to load quiz: ' + qErr.message);
      if (!qData) return null;

      const { data: qList, error: listErr } = await supabase.from('quiz_questions').select('*').eq('quiz_id', qData.id).order('display_order', { ascending: true });
      if (listErr) throw new Error('Failed to load quiz questions: ' + listErr.message);

      const questions = await Promise.all((qList || []).map(async (q) => {
        const { data: opts, error: optErr } = await supabase
          .from(includeAnswers ? 'quiz_options' : 'learner_quiz_options')
          .select('*')
          .eq('question_id', q.id)
          .order('display_order', { ascending: true });
        if (optErr) throw new Error('Failed to load quiz options: ' + optErr.message);
        return { ...q, options: opts || [] };
      }));
      return { ...qData, questions };
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }

    const quiz = localDb.data.quizzes.find(q => q.module_id === moduleId);
    if (!quiz) return null;

    const rawQuestions = localDb.data.quiz_questions
      .filter(qq => qq.quiz_id === quiz.id)
      .sort((a, b) => a.display_order - b.display_order);

    const questions = rawQuestions.map(q => {
      const opts = localDb.data.quiz_options
        .filter(opt => opt.question_id === q.id)
        .sort((a, b) => a.display_order - b.display_order)
        .map(opt => {
          if (includeAnswers) return opt;
          const { is_correct, ...safeOpt } = opt;
          return safeOpt;
        });
      return { ...q, options: opts };
    });

    return { ...quiz, questions };
  },

  async getQuizById(id) {
    if (isLiveConfigured && supabase) {
      const { data: qData, error: qErr } = await supabase.from('quizzes').select('*, modules(*)').eq('id', id).single();
      if (qErr && qErr.code !== 'PGRST116') throw new Error('Failed to load quiz: ' + qErr.message);
      if (!qData) return null;

      const { data: qList, error: listErr } = await supabase.from('quiz_questions').select('*').eq('quiz_id', id).order('display_order', { ascending: true });
      if (listErr) throw new Error('Failed to load questions: ' + listErr.message);

      const questions = await Promise.all((qList || []).map(async (q) => {
        const { data: opts, error: optErr } = await supabase.from('quiz_options').select('*').eq('question_id', q.id).order('display_order', { ascending: true });
        if (optErr) throw new Error('Failed to load options: ' + optErr.message);
        return { ...q, options: opts || [] };
      }));
      return { ...qData, questions };
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }

    const quiz = localDb.data.quizzes.find(q => q.id === id);
    if (!quiz) return null;

    const questions = localDb.data.quiz_questions
      .filter(qq => qq.quiz_id === quiz.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(q => {
        const opts = localDb.data.quiz_options
          .filter(opt => opt.question_id === q.id)
          .sort((a, b) => a.display_order - b.display_order);
        return { ...q, options: opts };
      });

    const m = localDb.data.modules.find(mod => mod.id === quiz.module_id);
    return { ...quiz, module: m, questions };
  },

  async saveQuiz(quizData, questionsWithOpts = []) {
    const now = new Date().toISOString();
    let quizId = quizData.id;

    if (questionsWithOpts.length > 0) {
      for (let i = 0; i < questionsWithOpts.length; i++) {
        const q = questionsWithOpts[i];
        if (!q.question_text || !q.question_text.trim()) {
          throw new Error(`Question #${i + 1} text cannot be empty.`);
        }
        if (!q.options || q.options.length < 2) {
          throw new Error(`Question #${i + 1} must have at least 2 answer options.`);
        }
        const hasEmptyOption = q.options.some(opt => !opt.option_text || !opt.option_text.trim());
        if (hasEmptyOption) {
          throw new Error(`Question #${i + 1} has blank answer options. Please fill all options.`);
        }
        const correctCount = q.options.filter(opt => opt.is_correct).length;
        if (correctCount !== 1) {
          throw new Error(`Question #${i + 1} must have exactly one correct answer marked.`);
        }
      }
    }

    if (isLiveConfigured && supabase) {
      if (quizId) {
        const { error: updErr } = await supabase.from('quizzes').update({
          title: quizData.title,
          description: quizData.description || '',
          is_published: quizData.is_published,
          updated_at: now
        }).eq('id', quizId);
        if (updErr) throw new Error('Failed to update quiz: ' + updErr.message);
      } else {
        const { data: newQ, error: insErr } = await supabase.from('quizzes').insert([{
          module_id: quizData.module_id,
          title: quizData.title,
          description: quizData.description || '',
          is_published: quizData.is_published ?? false,
          created_at: now,
          updated_at: now
        }]).select().single();
        if (insErr) throw new Error('Failed to create quiz: ' + insErr.message);
        quizId = newQ.id;
      }

      if (questionsWithOpts.length > 0) {
        await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);

        for (let i = 0; i < questionsWithOpts.length; i++) {
          const q = questionsWithOpts[i];
          const { data: qRec, error: qErr } = await supabase.from('quiz_questions').insert([{
            quiz_id: quizId,
            question_text: q.question_text,
            display_order: i + 1,
            explanation: q.explanation || '',
            created_at: now,
            updated_at: now
          }]).select().single();
          if (qErr) throw new Error('Failed to save question: ' + qErr.message);

          if (q.options && q.options.length > 0) {
            const optPayloads = q.options.map((opt, optIdx) => ({
              question_id: qRec.id,
              option_text: opt.option_text,
              is_correct: Boolean(opt.is_correct),
              display_order: optIdx + 1,
              created_at: now,
              updated_at: now
            }));
            const { error: optErr } = await supabase.from('quiz_options').insert(optPayloads);
            if (optErr) throw new Error('Failed to save options: ' + optErr.message);
          }
        }
      }
      return quizId;
    }
    if (isProduction) {
      throw new Error('Database write error: Production requires active Supabase cloud connection.');
    }

    if (!quizId) {
      quizId = 'quiz-' + Date.now();
      const newQuiz = {
        id: quizId,
        module_id: quizData.module_id,
        title: quizData.title,
        description: quizData.description || '',
        is_published: quizData.is_published ?? false,
        created_at: now,
        updated_at: now
      };
      localDb.data.quizzes.push(newQuiz);
    } else {
      const idx = localDb.data.quizzes.findIndex(q => q.id === quizId);
      if (idx !== -1) {
        localDb.data.quizzes[idx] = {
          ...localDb.data.quizzes[idx],
          title: quizData.title,
          description: quizData.description,
          is_published: quizData.is_published,
          updated_at: now
        };
      }
    }

    localDb.data.quiz_questions = localDb.data.quiz_questions.filter(qq => qq.quiz_id !== quizId);
    
    questionsWithOpts.forEach((q, qIdx) => {
      const qId = q.id || `q-${quizId}-${qIdx + 1}-${Date.now()}`;
      localDb.data.quiz_questions.push({
        id: qId,
        quiz_id: quizId,
        question_text: q.question_text,
        display_order: qIdx + 1,
        explanation: q.explanation || '',
        created_at: now,
        updated_at: now
      });

      localDb.data.quiz_options = localDb.data.quiz_options.filter(o => o.question_id !== qId);

      q.options.forEach((opt, optIdx) => {
        localDb.data.quiz_options.push({
          id: opt.id || `opt-${qId}-${optIdx + 1}-${Date.now()}`,
          question_id: qId,
          option_text: opt.option_text,
          is_correct: Boolean(opt.is_correct),
          display_order: optIdx + 1,
          created_at: now,
          updated_at: now
        });
      });
    });

    localDb.save();
    return quizId;
  },

  async deleteQuiz(id) {
    if (isLiveConfigured && supabase) {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) throw new Error('Failed to delete quiz: ' + error.message);
      return true;
    }
    if (isProduction) {
      throw new Error('Database delete error: Production requires active Supabase cloud connection.');
    }

    localDb.data.quizzes = localDb.data.quizzes.filter(q => q.id !== id);
    const qIds = localDb.data.quiz_questions.filter(qq => qq.quiz_id === id).map(qq => qq.id);
    localDb.data.quiz_questions = localDb.data.quiz_questions.filter(qq => qq.quiz_id !== id);
    localDb.data.quiz_options = localDb.data.quiz_options.filter(o => !qIds.includes(o.question_id));
    localDb.save();
    return true;
  },

  // --- SECURE SERVER-SIDE EVALUATION OF QUIZ SUBMISSION ---
  async evaluateQuiz(quizId, answers) {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase.rpc('evaluate_quiz_submission', {
        p_quiz_id: quizId,
        p_answers: answers
      });
      if (error) {
        console.error('Supabase RPC evaluate_quiz_submission error:', error);
        throw new Error('Evaluation error: ' + error.message);
      }
      return data;
    }
    if (isProduction) {
      throw new Error('Quiz evaluation requires active Supabase cloud connection in production.');
    }

    const questions = localDb.data.quiz_questions.filter(q => q.quiz_id === quizId).sort((a, b) => a.display_order - b.display_order);
    let correctCount = 0;
    const results = questions.map(q => {
      const correctOpt = localDb.data.quiz_options.find(o => o.question_id === q.id && o.is_correct);
      const userSubmission = answers.find(a => a.question_id === q.id);
      const isCorrect = userSubmission && correctOpt && userSubmission.selected_option_id === correctOpt.id;
      if (isCorrect) correctCount++;
      return {
        question_id: q.id,
        selected_option_id: userSubmission?.selected_option_id || null,
        is_correct: isCorrect,
        correct_option_id: correctOpt?.id || null,
        explanation: q.explanation || ''
      };
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= 66;

    return {
      quiz_id: quizId,
      total_questions: questions.length,
      correct_count: correctCount,
      score_percentage: scorePercent,
      passed,
      feedback: passed
        ? 'Assessment Passed: You have demonstrated solid operational understanding.'
        : 'Review Required: Please review the operational explanations and retake the assessment.',
      results
    };
  },

  // --- HR TEAM MANAGEMENT ---
  async getTeamMembers() {
    if (isLiveConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw new Error('Failed to load team members: ' + error.message);
      return data || [];
    }
    if (isProduction) {
      throw new Error('Supabase cloud database is not configured in production.');
    }
    return [...localDb.data.profiles];
  },

  async saveTeamMember(memberData) {
    const now = new Date().toISOString();
    if (isLiveConfigured && supabase) {
      if (memberData.id) {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            full_name: memberData.full_name,
            role: memberData.role,
            is_active: memberData.is_active,
            updated_at: now
          })
          .eq('id', memberData.id)
          .select()
          .single();
        if (error) throw new Error('Failed to update profile: ' + error.message);
        return data;
      } else {
        // Step 1: Create user in Supabase Auth using isolated ephemeral client so admin session is NOT replaced
        const tempClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        });

        const initialPassword = memberData.password || 'Fusionsole@123';
        const { data: authData, error: authError } = await tempClient.auth.signUp({
          email: memberData.email,
          password: initialPassword,
          options: {
            data: {
              full_name: memberData.full_name,
              role: memberData.role || 'hr_staff'
            }
          }
        });

        if (authError) {
          throw new Error('Authentication signup error: ' + authError.message);
        }

        const newUserId = authData?.user?.id;
        if (!newUserId) {
          throw new Error('Could not obtain user ID from authentication. If this user is already registered in Supabase, please assign their role in SQL.');
        }

        // Step 2: Insert into public.profiles with the newly created auth UUID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: newUserId,
            full_name: memberData.full_name,
            email: memberData.email,
            role: memberData.role || 'hr_staff',
            is_active: memberData.is_active ?? true,
            created_at: now,
            updated_at: now
          }])
          .select()
          .single();

        if (profileError) {
          // If trigger already created the profile, update it instead
          if (profileError.code === '23505') {
            const { data: updatedProfile, error: updateErr } = await supabase
              .from('profiles')
              .update({
                full_name: memberData.full_name,
                role: memberData.role || 'hr_staff',
                is_active: memberData.is_active ?? true,
                updated_at: now
              })
              .eq('id', newUserId)
              .select()
              .single();
            if (updateErr) throw new Error('Failed to save profile: ' + updateErr.message);
            return updatedProfile;
          }
          throw new Error('Failed to create profile: ' + profileError.message);
        }
        return profileData;
      }
    }
    if (isProduction) {
      throw new Error('Database write error: Production requires active Supabase cloud connection.');
    }

    if (memberData.id) {
      const idx = localDb.data.profiles.findIndex(p => p.id === memberData.id);
      if (idx !== -1) {
        localDb.data.profiles[idx] = { ...localDb.data.profiles[idx], ...memberData, updated_at: now };
        localDb.save();
        return localDb.data.profiles[idx];
      }
    }
    const newMember = {
      id: 'user-' + Date.now(),
      full_name: memberData.full_name,
      email: memberData.email,
      role: memberData.role || 'hr_staff',
      is_active: memberData.is_active ?? true,
      created_at: now,
      updated_at: now
    };
    localDb.data.profiles.push(newMember);
    localDb.save();
    return newMember;
  },

  async toggleUserStatus(id, isActive) {
    if (isLiveConfigured && supabase) {
      const { error } = await supabase.from('profiles').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw new Error('Failed to toggle status: ' + error.message);
      return true;
    }
    if (isProduction) {
      throw new Error('Database update error: Production requires active Supabase cloud connection.');
    }

    const idx = localDb.data.profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      localDb.data.profiles[idx].is_active = isActive;
      localDb.data.profiles[idx].updated_at = new Date().toISOString();
      localDb.save();
      return true;
    }
    return false;
  },

  async deleteTeamMember(id) {
    if (isLiveConfigured && supabase) {
      const { data: admins } = await supabase.from('profiles').select('*').eq('role', 'admin').eq('is_active', true);
      const { data: target } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (target?.role === 'admin' && admins && admins.length <= 1) {
        throw new Error('Security Error: Cannot remove the last active administrator.');
      }
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw new Error('Failed to delete profile: ' + error.message);
      return true;
    }
    if (isProduction) {
      throw new Error('Database delete error: Production requires active Supabase cloud connection.');
    }

    const admins = localDb.data.profiles.filter(p => p.role === 'admin' && p.is_active);
    const target = localDb.data.profiles.find(p => p.id === id);
    if (target?.role === 'admin' && admins.length <= 1) {
      throw new Error('Security Error: Cannot remove the last active administrator.');
    }
    localDb.data.profiles = localDb.data.profiles.filter(p => p.id !== id);
    localDb.save();
    return true;
  },

  // --- DASHBOARD OVERVIEW METRICS ---
  async getDashboardStats() {
    const categories = await this.getCategories();
    const subjects = await this.getSubjects();
    const modules = await this.getModules();
    const quizzes = await this.getQuizzes();
    const team = await this.getTeamMembers();

    const publishedModules = modules.filter(m => m.status === 'published');
    const draftModules = modules.filter(m => m.status === 'draft');
    const archivedModules = modules.filter(m => m.status === 'archived');

    // Recent items
    const recentlyUpdated = [...modules].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 5);
    const draftsNeedingAttention = draftModules.slice(0, 6);

    return {
      totalCategories: categories.length,
      totalSubjects: subjects.length,
      totalModules: modules.length,
      publishedModules: publishedModules.length,
      draftModules: draftModules.length,
      archivedModules: archivedModules.length,
      totalQuizzes: quizzes.length,
      teamMembers: team.length,
      recentlyUpdated,
      draftsNeedingAttention
    };
  },

  // --- YOUTUBE URL PARSER & EMBED EXTRACTOR ---
  extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return '';
    const clean = url.trim();
    // Patterns supported:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    // VIDEO_ID directly
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = clean.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    // Direct 11-char ID check
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }
    return '';
  },

  getYouTubeEmbedUrl(idOrUrl) {
    const id = this.extractYouTubeId(idOrUrl);
    if (!id) return '';
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  }
};
