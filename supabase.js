/**
 * Fusionsole Learning Portal - Supabase Client & Data Service Layer
 * Supports both live Supabase PostgreSQL + Auth and offline-persistent Local DB mode.
 * Automatically synchronizes with local storage and respects RLS principles.
 */

import { createClient } from '@supabase/supabase-js';
import { subjectsData } from './learning-data.js';

export function isUUID(str) {
  return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

// -----------------------------------------------------------------------------
// 1. ENVIRONMENT CONFIGURATION & RESOLUTION
// -----------------------------------------------------------------------------
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const ENV_URL = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
const ENV_KEY = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Allow dynamic credentials via Admin Panel settings or localStorage
const memoryStore = new Map();
const safeStorage = (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function')
  ? localStorage
  : {
      getItem: (k) => memoryStore.has(k) ? memoryStore.get(k) : null,
      setItem: (k, v) => memoryStore.set(k, String(v)),
      removeItem: (k) => memoryStore.delete(k)
    };
const STORED_URL = safeStorage.getItem('FUSIONSOLE_SUPABASE_URL') || '';
const STORED_KEY = safeStorage.getItem('FUSIONSOLE_SUPABASE_ANON_KEY') || '';

export const SUPABASE_URL = STORED_URL || ENV_URL;
export const SUPABASE_ANON_KEY = STORED_KEY || ENV_KEY;

export const isLiveConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('http') && 
  !SUPABASE_URL.includes('your-project-id')
);

export const isProduction = Boolean(env.PROD);

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
    name: 'Induction',
    slug: 'staff',
    description: 'An introduction to Fusionsole, the workplace environment, company practices and essential information for newly joined staff.',
    image_path: '/images/banner-induction.jpg',
    display_order: 1,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'cat-workers-02',
    name: 'Workers training programe',
    slug: 'workers',
    description: 'Practical skill programmes covering manufacturing departments and footwear construction operations.',
    image_path: '/images/banner-workers.jpg',
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
    id: 'sub-lasting-04',
    category_id: 'cat-workers-02',
    name: 'Lasting',
    slug: 'lasting',
    description: 'Learn about shoe shaping, upper pulling, precision lasting operations and forming the 3D anatomical footwear structure.',
    image_path: '/images/fusion-lasting.jpg',
    display_order: 2,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'sub-assembly-02',
    category_id: 'cat-workers-02',
    name: 'Assembling',
    slug: 'assembly',
    description: 'Understand the operations involved in sole preparation, adhesive activation, sole attaching, inspection, and packaging.',
    image_path: '/images/program-training.jpg',
    display_order: 3,
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
    display_order: 4,
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  }
];

// 29 initial modules (2 Staff + 6 Stitching + 19 Assembly + 2 Cutting)
// All initial modules start as 'draft' until HR publishes them
const INITIAL_MODULES = [
  // Staff (2)
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
    thumbnail_path: '/images/banner-induction.jpg',
    display_order: 1,
    status: 'draft',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'mod-01b-worker-induction',
    category_id: 'cat-staff-01',
    subject_id: null,
    title: 'Worker Induction',
    slug: 'worker-induction',
    description: 'Essential orientation for production floor personnel covering shop floor safety, PPE protocols, machine zone awareness, and quality reporting.',
    overview: 'This mandatory worker induction module equips production team members with the operational and safety fundamentals necessary for working within our footwear manufacturing facilities.',
    learning_objectives: [
      'Comply with shop floor safety protocols, emergency stops, and designated transit zones.',
      'Demonstrate proper use of required Personal Protective Equipment (PPE) for footwear production.',
      'Understand factory shift handovers, attendance logging, and supervisor quality reporting lines.'
    ],
    instructions: [
      'Wear mandatory safety footwear, hair restraints, and eye protection at all times within active workshops.',
      'Inspect all machine guards, emergency shutoff switches, and ventilation hoods before starting any shift.',
      'Immediately halt machinery and notify the line supervisor if any equipment abnormality or safety defect is detected.'
    ],
    youtube_url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    youtube_video_id: 'ysz5S6PUM-U',
    thumbnail_path: '/images/banner-workers.jpg',
    display_order: 2,
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
  },
  {
    id: 'quiz-01b-worker-induction',
    module_id: 'mod-01b-worker-induction',
    title: 'Worker Induction Safety & Operations Assessment',
    description: 'Verification of workshop rules, machine safety, and shop floor standards for production personnel.',
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
  },
  // Worker Induction Questions
  {
    id: 'q-01b-worker-induction-1',
    quiz_id: 'quiz-01b-worker-induction',
    question_text: 'What is required before starting work on any production floor machinery?',
    display_order: 1,
    explanation: 'Workers must always inspect guards, verify emergency stops, and equip all mandatory PPE prior to operating any machinery.',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'q-01b-worker-induction-2',
    quiz_id: 'quiz-01b-worker-induction',
    question_text: 'If a worker spots an oil leak, damaged electrical wire, or malfunctioning needle on the line, what should they do?',
    display_order: 2,
    explanation: 'Safety and quality require immediate reporting of hazards or defects to the department supervisor.',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'q-01b-worker-induction-3',
    quiz_id: 'quiz-01b-worker-induction',
    question_text: 'Where must factory personnel and workers walk when navigating between workshops?',
    display_order: 3,
    explanation: 'All team members must use marked pedestrian walkways to prevent accidents with carts, forklifts, and moving equipment.',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  }
];

const INITIAL_OPTIONS = [
  // Q1 Staff
  { id: 'opt-q1-1', question_id: 'q-01-staff-induction-1', option_text: 'Achieving speed at the expense of process compliance', is_correct: false, display_order: 1 },
  { id: 'opt-q1-2', question_id: 'q-01-staff-induction-1', option_text: 'Building knowledge, developing skills, and upholding uncompromising product quality', is_correct: true, display_order: 2 },
  { id: 'opt-q1-3', question_id: 'q-01-staff-induction-1', option_text: 'Focusing solely on administrative targets rather than workshop safety', is_correct: false, display_order: 3 },
  { id: 'opt-q1-4', question_id: 'q-01-staff-induction-1', option_text: 'Limiting inter-departmental communication between staff and production teams', is_correct: false, display_order: 4 },
  // Q2 Staff
  { id: 'opt-q2-1', question_id: 'q-02-staff-induction-2', option_text: 'Using active mobile phones while walking near machines', is_correct: false, display_order: 1 },
  { id: 'opt-q2-2', question_id: 'q-02-staff-induction-2', option_text: 'Wearing designated personal protective equipment (PPE) and following marked safety walkways', is_correct: true, display_order: 2 },
  { id: 'opt-q2-3', question_id: 'q-02-staff-induction-2', option_text: 'Operating heavy industrial machinery without prior department authorization', is_correct: false, display_order: 3 },
  { id: 'opt-q2-4', question_id: 'q-02-staff-induction-2', option_text: 'Ignoring floor warning tape and machine safety cages', is_correct: false, display_order: 4 },
  // Q3 Staff
  { id: 'opt-q3-1', question_id: 'q-03-staff-induction-3', option_text: 'To their immediate department supervisor or the HR Learning & Development office', is_correct: true, display_order: 1 },
  { id: 'opt-q3-2', question_id: 'q-03-staff-induction-3', option_text: 'External social media groups', is_correct: false, display_order: 2 },
  { id: 'opt-q3-3', question_id: 'q-03-staff-induction-3', option_text: 'Leave questions unasked until annual reviews', is_correct: false, display_order: 3 },
  { id: 'opt-q3-4', question_id: 'q-03-staff-induction-3', option_text: 'To outside vendors visiting the loading docks', is_correct: false, display_order: 4 },

  // Worker Induction Q1
  { id: 'opt-w1-1', question_id: 'q-01b-worker-induction-1', option_text: 'Begin operation immediately without checking equipment', is_correct: false, display_order: 1 },
  { id: 'opt-w1-2', question_id: 'q-01b-worker-induction-1', option_text: 'Inspect machine guards, verify emergency stop functions, and equip required PPE', is_correct: true, display_order: 2 },
  { id: 'opt-w1-3', question_id: 'q-01b-worker-induction-1', option_text: 'Disable machine safety covers to speed up production', is_correct: false, display_order: 3 },
  { id: 'opt-w1-4', question_id: 'q-01b-worker-induction-1', option_text: 'Borrow another worker\'s badge to sign in', is_correct: false, display_order: 4 },
  // Worker Induction Q2
  { id: 'opt-w2-1', question_id: 'q-01b-worker-induction-2', option_text: 'Ignore it and continue working', is_correct: false, display_order: 1 },
  { id: 'opt-w2-2', question_id: 'q-01b-worker-induction-2', option_text: 'Attempt unauthorized electrical repairs alone', is_correct: false, display_order: 2 },
  { id: 'opt-w2-3', question_id: 'q-01b-worker-induction-2', option_text: 'Safely halt the equipment and immediately report the hazard to the line supervisor', is_correct: true, display_order: 3 },
  { id: 'opt-w2-4', question_id: 'q-01b-worker-induction-2', option_text: 'Leave the workstation without notifying anyone', is_correct: false, display_order: 4 },
  // Worker Induction Q3
  { id: 'opt-w3-1', question_id: 'q-01b-worker-induction-3', option_text: 'Directly across active conveyor lines', is_correct: false, display_order: 1 },
  { id: 'opt-w3-2', question_id: 'q-01b-worker-induction-3', option_text: 'Within designated, clearly marked safety walkways and pedestrian lanes', is_correct: true, display_order: 2 },
  { id: 'opt-w3-3', question_id: 'q-01b-worker-induction-3', option_text: 'Behind forklift loading docks', is_correct: false, display_order: 3 },
  { id: 'opt-w3-4', question_id: 'q-01b-worker-induction-3', option_text: 'Under suspended material hoists', is_correct: false, display_order: 4 }
];

const INITIAL_TEAM = [
  {
    id: 'user-admin-01',
    full_name: 'Admin',
    email: 'admin@fusionsole.com',
    role: 'admin',
    is_active: true,
    created_at: '2026-10-15T09:00:00Z',
    updated_at: '2026-11-01T08:00:00Z'
  },
  {
    id: 'user-admin-02',
    full_name: 'Lead Operations Administrator',
    email: 'fusionadmin@fusionsole.com',
    role: 'admin',
    is_active: true,
    created_at: '2026-11-01T08:00:00Z',
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
    const raw = safeStorage.getItem(this.storageKey);
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

        // Migrate any legacy "Elena Rostova" names to "Admin"
        let migratedElena = false;
        this.data.profiles.forEach(p => {
          if (p.full_name === 'Elena Rostova') {
            p.full_name = 'Admin';
            migratedElena = true;
          }
        });

        // Ensure all default administrative and HR team accounts exist
        INITIAL_TEAM.forEach(t => {
          if (!this.data.profiles.some(p => p.email.toLowerCase() === t.email.toLowerCase())) {
            this.data.profiles.push(t);
          }
        });

        // Migrate auth session if storing legacy Elena Rostova
        const authRaw = safeStorage.getItem(this.authKey);
        if (authRaw) {
          try {
            const authUser = JSON.parse(authRaw);
            if (authUser && authUser.full_name === 'Elena Rostova') {
              authUser.full_name = 'Admin';
              safeStorage.setItem(this.authKey, JSON.stringify(authUser));
            }
          } catch (e) {}
        }

        // Ensure categories use updated banners and names
        if (this.data.categories) {
          this.data.categories.forEach(c => {
            if (c.slug === 'workers') {
              c.name = 'Workers training programe';
              c.image_path = '/images/banner-workers.jpg';
            }
            if (c.slug === 'staff') {
              c.name = 'Induction';
              c.image_path = '/images/banner-induction.jpg';
            }
          });
          this.save();
        }

        // Ensure manufacturing subjects: purge any staff/worker induction and ensure Lasting & Assembling exist
        if (this.data.subjects) {
          this.data.subjects = this.data.subjects.filter(s => {
            const name = (s.name || '').toLowerCase();
            const slug = (s.slug || '').toLowerCase();
            return !name.includes('induction') && !slug.includes('induction') && !name.includes('staff') && !slug.includes('staff');
          });

          if (!this.data.subjects.some(s => s.slug === 'lasting')) {
            const lastingSub = INITIAL_SUBJECTS.find(s => s.slug === 'lasting');
            if (lastingSub) this.data.subjects.push(lastingSub);
          }

          const assemSub = this.data.subjects.find(s => s.slug === 'assembly' || s.slug === 'assembling');
          if (assemSub) {
            assemSub.name = 'Assembling';
            assemSub.slug = 'assembly';
            assemSub.description = 'Understand the operations involved in sole preparation, adhesive activation, sole attaching, inspection, and packaging.';
          }
          this.save();
        }

        // Ensure induction module banners are updated
        if (this.data.modules) {
          const modStaff = this.data.modules.find(m => m.slug === 'staff-induction');
          if (modStaff) modStaff.thumbnail_path = '/images/banner-induction.jpg';
          const modWorker = this.data.modules.find(m => m.slug === 'worker-induction');
          if (modWorker) modWorker.thumbnail_path = '/images/banner-workers.jpg';
          this.save();
        }

        // Ensure worker-induction module & quiz exist in local storage
        if (!this.data.modules.some(m => m.slug === 'worker-induction')) {
          const wMod = INITIAL_MODULES.find(m => m.slug === 'worker-induction');
          if (wMod) this.data.modules.push(wMod);
        }
        if (!this.data.quizzes.some(q => q.id === 'quiz-01b-worker-induction')) {
          const wQuiz = INITIAL_QUIZZES.find(q => q.id === 'quiz-01b-worker-induction');
          if (wQuiz) {
            this.data.quizzes.push(wQuiz);
            const wQuestions = INITIAL_QUESTIONS.filter(q => q.quiz_id === 'quiz-01b-worker-induction');
            this.data.quiz_questions.push(...wQuestions);
            const qIds = wQuestions.map(q => q.id);
            const wOptions = INITIAL_OPTIONS.filter(o => qIds.includes(o.question_id));
            this.data.quiz_options.push(...wOptions);
          }
        }
        this.save();
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
    safeStorage.setItem(this.storageKey, JSON.stringify(this.data));
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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && !error) {
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
            full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Admin',
            role: profile?.role || 'admin',
            is_active: profile?.is_active ?? true
          };
        }
      } catch (err) {
        console.warn('Supabase getSession notice:', err);
      }
    }

    // Local / Development session fallback
    const raw = safeStorage.getItem('FUSIONSOLE_CURRENT_AUTH_USER');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) {
          if (parsed.full_name === 'Elena Rostova') {
            parsed.full_name = 'Admin';
            safeStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(parsed));
          }
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  async signIn(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. If Supabase is live, attempt Supabase Auth first
    if (isLiveConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (!error && data?.session) {
          const user = await this.getCurrentUser();
          if (user && !user.is_active) {
            await supabase.auth.signOut();
            throw new Error('This HR account is currently disabled. Please contact system admin.');
          }
          safeStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(user));
          return user;
        }

        // If user does not exist in remote Supabase, attempt automatic signup bootstrap
        if (error && (error.status === 400 || error.message?.includes('Invalid login credentials'))) {
          console.log('Attempting automatic Supabase admin bootstrap for:', cleanEmail);
          const { data: suData, error: suErr } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: cleanEmail.startsWith('admin') ? 'Admin' : 'Administrator',
                role: 'admin'
              }
            }
          });

          if (!suErr && suData?.session) {
            try {
              await supabase.from('profiles').upsert({
                id: suData.user.id,
                full_name: cleanEmail.startsWith('admin') ? 'Admin' : 'Administrator',
                email: cleanEmail,
                role: 'admin',
                is_active: true
              });
            } catch (pErr) {}

            const user = await this.getCurrentUser();
            safeStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(user));
            return user;
          }
        }
      } catch (liveErr) {
        console.warn('Supabase live auth attempt notice:', liveErr.message);
      }
    }

    // 2. Check local database profiles (Admin, Lead Ops Admin, and any registered local admins)
    let found = localDb.data.profiles.find(p => p.email.toLowerCase() === cleanEmail);

    // If not found, but trying to log in as default admin accounts
    if (!found && (cleanEmail === 'admin@fusionsole.com' || cleanEmail === 'fusionadmin@fusionsole.com')) {
      found = {
        id: 'user-admin-' + Date.now(),
        full_name: cleanEmail === 'admin@fusionsole.com' ? 'Admin' : 'Lead Operations Administrator',
        email: cleanEmail,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localDb.data.profiles.push(found);
      localDb.save();
    }

    if (found) {
      if (!found.is_active) {
        throw new Error('This HR account is currently disabled. Please contact system admin.');
      }
      safeStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(found));
      return found;
    }

    throw new Error('Invalid email or password. Use admin@fusionsole.com / password123 or register a new admin account above.');
  },

  async signUpAdmin({ full_name, email, password }) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid corporate email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    const cleanName = (full_name && full_name.trim()) || 'Administrator';
    const cleanEmail = email.trim().toLowerCase();

    // Create local profile immediately
    let localProfile = localDb.data.profiles.find(p => p.email.toLowerCase() === cleanEmail);
    if (!localProfile) {
      localProfile = {
        id: 'user-admin-' + Date.now(),
        full_name: cleanName,
        email: cleanEmail,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localDb.data.profiles.unshift(localProfile);
      localDb.save();
    }

    safeStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(localProfile));

    // Also register in Supabase Auth if connected
    if (isLiveConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              role: 'admin'
            }
          }
        });

        if (!error && data?.user) {
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: cleanName,
              email: cleanEmail,
              role: 'admin',
              is_active: true,
              updated_at: new Date().toISOString()
            });
          } catch (pErr) {}

          if (data.session) {
            const liveUser = await this.getCurrentUser();
            if (liveUser) {
              safeStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(liveUser));
              return liveUser;
            }
          }
        }
      } catch (sbErr) {
        console.warn('Supabase cloud signup note (offline/local profile active):', sbErr.message);
      }
    }

    return localProfile;
  },

  async signOut() {
    if (isLiveConfigured && supabase) {
      await supabase.auth.signOut();
    }
    safeStorage.removeItem('FUSIONSOLE_CURRENT_AUTH_USER');
  },

  async updateAdminProfile(newName) {
    const cleanName = (newName && newName.trim()) || 'Admin';
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No active admin session found.');
    currentUser.full_name = cleanName;

    // 1. If Supabase cloud is configured, update public.profiles & user metadata
    if (isLiveConfigured && supabase) {
      if (currentUser.id && isUUID(currentUser.id)) {
        try {
          await supabase
            .from('profiles')
            .update({
              full_name: cleanName,
              updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);
        } catch (e) {
          console.warn('Supabase profile update warning:', e);
        }
      }
      try {
        await supabase.auth.updateUser({
          data: { full_name: cleanName }
        });
      } catch (authErr) {
        console.warn('Supabase auth metadata update warning:', authErr);
      }
    }

    // 2. Update local database profiles
    const idx = localDb.data.profiles.findIndex(p => 
      p.id === currentUser.id || 
      (p.email && currentUser.email && p.email.toLowerCase() === currentUser.email.toLowerCase())
    );
    if (idx !== -1) {
      localDb.data.profiles[idx].full_name = cleanName;
      localDb.data.profiles[idx].updated_at = new Date().toISOString();
      localDb.save();
    }

    // 3. Update session storage
    safeStorage.setItem('FUSIONSOLE_CURRENT_AUTH_USER', JSON.stringify(currentUser));
    return currentUser;
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
    let remoteData = null;
    if (isLiveConfigured && supabase) {
      try {
        if (categoryData.id && isUUID(categoryData.id)) {
          const { data, error } = await supabase.from('categories').update({ ...categoryData, updated_at: now }).eq('id', categoryData.id).select().single();
          if (error) console.warn('Supabase update category note:', error.message);
          else remoteData = data;
        } else {
          const { id, ...insertData } = categoryData;
          const { data, error } = await supabase.from('categories').insert([{ ...insertData, created_at: now, updated_at: now }]).select().single();
          if (error) console.warn('Supabase create category note:', error.message);
          else remoteData = data;
        }
      } catch (err) {
        console.warn('Supabase category write notice:', err);
      }
    }

    if (categoryData.id) {
      const idx = localDb.data.categories.findIndex(c => c.id === categoryData.id);
      if (idx !== -1) {
        localDb.data.categories[idx] = { ...localDb.data.categories[idx], ...categoryData, updated_at: now };
        localDb.save();
        return remoteData || localDb.data.categories[idx];
      }
    }
    const newCat = {
      id: remoteData?.id || ('cat-' + Date.now()),
      ...categoryData,
      display_order: Number(categoryData.display_order) || localDb.data.categories.length + 1,
      is_active: categoryData.is_active ?? true,
      created_at: now,
      updated_at: now
    };
    localDb.data.categories.push(newCat);
    localDb.save();
    return remoteData || newCat;
  },

  async deleteCategory(id) {
    if (isLiveConfigured && supabase && isUUID(id)) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw new Error('Failed to delete category: ' + error.message);
      return true;
    }
    if (isProduction && !localDb.data.categories.length) {
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
    let list = [];
    if (isLiveConfigured && supabase) {
      try {
        let query = supabase.from('subjects').select('*, categories(name)').order('display_order', { ascending: true });
        if (onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data) {
          list = data.map(s => ({
            ...s,
            category_name: s.categories?.name || 'Unknown'
          }));
        }
      } catch (e) {
        console.warn('Supabase getSubjects fallback to local:', e);
      }
    }

    if (!list || list.length === 0) {
      if (isProduction && !localDb.data.subjects.length) {
        throw new Error('Supabase cloud database is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloudflare Pages.');
      }
      list = localDb.data.subjects.map(s => {
        const cat = localDb.data.categories.find(c => c.id === s.category_id);
        return { ...s, category_name: cat ? cat.name : 'Unknown' };
      });
      if (onlyActive) list = list.filter(s => s.is_active);
    }

    // Explicitly purge any accidental induction or staff entries from manufacturing subjects
    list = list.filter(s => {
      const name = (s.name || '').toLowerCase();
      const slug = (s.slug || '').toLowerCase();
      return !name.includes('induction') && !slug.includes('induction') && !name.includes('staff') && !slug.includes('staff');
    });

    // Ensure Lasting exists in returned subjects
    if (!list.some(s => s.slug === 'lasting')) {
      list.push({
        id: 'sub-lasting-04',
        category_id: 'cat-workers-02',
        name: 'Lasting',
        slug: 'lasting',
        description: 'Learn about shoe shaping, upper pulling, precision lasting operations and forming the 3D anatomical footwear structure.',
        image_path: '/images/fusion-lasting.jpg',
        display_order: 2,
        is_active: true
      });
    }

    return list.sort((a, b) => (a.display_order || 1) - (b.display_order || 1));
  },

  async getSubjectBySlug(slug) {
    const cleanSlug = (slug || '').toLowerCase().trim();

    // Check specific lasting handling
    if (cleanSlug === 'lasting') {
      let found = null;
      if (isLiveConfigured && supabase) {
        try {
          const { data } = await supabase.from('subjects').select('*, categories(*)').eq('slug', 'lasting').single();
          if (data) found = data;
        } catch (e) {}
      }
      if (!found) {
        found = localDb.data.subjects.find(s => s.slug === 'lasting');
      }
      if (!found) {
        found = {
          id: 'sub-lasting-04',
          category_id: 'cat-workers-02',
          name: 'Lasting',
          slug: 'lasting',
          description: 'Learn about shoe shaping, upper pulling, precision lasting operations and forming the 3D anatomical footwear structure.',
          image_path: '/images/fusion-lasting.jpg',
          display_order: 2,
          is_active: true
        };
      }
      return found;
    }

    // Check assembling / assembly
    if (cleanSlug === 'assembling' || cleanSlug === 'assembly') {
      let found = null;
      if (isLiveConfigured && supabase) {
        try {
          const { data } = await supabase.from('subjects').select('*, categories(*)').in('slug', ['assembly', 'assembling']).limit(1).single();
          if (data) found = data;
        } catch (e) {}
      }
      if (!found) {
        found = localDb.data.subjects.find(s => s.slug === 'assembly' || s.slug === 'assembling');
      }
      if (!found) {
        found = {
          id: 'sub-assembly-02',
          category_id: 'cat-workers-02',
          name: 'Assembling',
          slug: 'assembly',
          description: 'Understand the operations involved in sole preparation, adhesive activation, sole attaching, inspection, and packaging.',
          image_path: '/images/program-training.jpg',
          display_order: 3,
          is_active: true
        };
      }
      return { ...found, name: 'Assembling', slug: 'assembly' };
    }

    if (isLiveConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('subjects').select('*, categories(*)').eq('slug', cleanSlug).single();
        if (!error && data) return data;
      } catch (err) {}
    }
    return localDb.data.subjects.find(s => s.slug === cleanSlug) || null;
  },

  async saveSubject(subjectData) {
    const now = new Date().toISOString();
    let remoteData = null;
    if (isLiveConfigured && supabase) {
      try {
        if (subjectData.id && isUUID(subjectData.id)) {
          const { data, error } = await supabase.from('subjects').update({ ...subjectData, updated_at: now }).eq('id', subjectData.id).select().single();
          if (error) console.warn('Supabase update subject note:', error.message);
          else remoteData = data;
        } else {
          const { id, ...insertData } = subjectData;
          const { data, error } = await supabase.from('subjects').insert([{ ...insertData, created_at: now, updated_at: now }]).select().single();
          if (error) console.warn('Supabase create subject note:', error.message);
          else remoteData = data;
        }
      } catch (err) {
        console.warn('Supabase subject write notice:', err);
      }
    }

    if (subjectData.id) {
      const idx = localDb.data.subjects.findIndex(s => s.id === subjectData.id);
      if (idx !== -1) {
        localDb.data.subjects[idx] = { ...localDb.data.subjects[idx], ...subjectData, updated_at: now };
        localDb.save();
        return remoteData || localDb.data.subjects[idx];
      }
    }
    const newSub = {
      id: remoteData?.id || ('sub-' + Date.now()),
      ...subjectData,
      display_order: Number(subjectData.display_order) || localDb.data.subjects.length + 1,
      is_active: subjectData.is_active ?? true,
      created_at: now,
      updated_at: now
    };
    localDb.data.subjects.push(newSub);
    localDb.save();
    return remoteData || newSub;
  },

  async deleteSubject(id) {
    if (isLiveConfigured && supabase && isUUID(id)) {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) throw new Error('Failed to delete subject: ' + error.message);
      return true;
    }
    if (isProduction && !localDb.data.subjects.length) {
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
      if (filters.categoryId) {
        if (isUUID(filters.categoryId)) {
          query = query.eq('category_id', filters.categoryId);
        } else {
          const cat = await this.getCategoryBySlug(filters.categoryId);
          if (cat && isUUID(cat.id)) {
            query = query.eq('category_id', cat.id);
          }
        }
      }
      if (filters.subjectId) {
        if (isUUID(filters.subjectId)) {
          query = query.eq('subject_id', filters.subjectId);
        } else {
          const sub = await this.getSubjectBySlug(filters.subjectId);
          if (sub && isUUID(sub.id)) {
            query = query.eq('subject_id', sub.id);
          }
        }
      }
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
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('*, categories(*), subjects(*)')
          .eq('slug', slug)
          .single();
        if (error && error.code !== 'PGRST116') {
          console.warn('Failed to load module by slug from Supabase:', error.message);
        } else if (data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getModuleBySlug exception:', err);
      }
    }

    const m = localDb.data.modules.find(mod => mod.slug === slug);
    if (m) {
      const cat = localDb.data.categories.find(c => c.id === m.category_id);
      const sub = localDb.data.subjects.find(s => s.id === m.subject_id);
      return {
        ...m,
        categories: cat || null,
        subjects: sub || null
      };
    }

    if (typeof subjectsData === 'object' && subjectsData !== null) {
      for (const catKey of Object.keys(subjectsData)) {
        const group = subjectsData[catKey];
        if (group && Array.isArray(group.modules)) {
          const found = group.modules.find(mod => mod.slug === slug);
          if (found) {
            return {
              ...found,
              categories: { id: group.id, name: group.name, slug: group.id },
              subjects: null
            };
          }
        }
      }
    }

    return null;
  },

  async getModuleById(id) {
    if (isLiveConfigured && supabase && isUUID(id)) {
      try {
        const { data, error } = await supabase.from('modules').select('*').eq('id', id).single();
        if (error && error.code !== 'PGRST116') {
          console.warn('Failed to load module from Supabase: ' + error.message);
        } else if (data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getModuleById exception:', err);
      }
    }

    const localMod = localDb.data.modules.find(m => m.id === id || m.slug === id);
    if (localMod) return localMod;

    if (typeof subjectsData === 'object' && subjectsData !== null) {
      for (const catKey of Object.keys(subjectsData)) {
        const group = subjectsData[catKey];
        if (group && Array.isArray(group.modules)) {
          const found = group.modules.find(m => m.id === id || m.slug === id);
          if (found) return found;
        }
      }
    }

    return null;
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

    let remoteData = null;
    if (isLiveConfigured && supabase) {
      try {
        if (cleanData.id && isUUID(cleanData.id)) {
          const { data, error } = await supabase.from('modules').update(cleanData).eq('id', cleanData.id).select().single();
          if (error) console.warn('Supabase update module note:', error.message);
          else remoteData = data;
        } else {
          const { id, ...insertData } = cleanData;
          const { data, error } = await supabase.from('modules').insert([{ ...insertData, created_at: now }]).select().single();
          if (error) console.warn('Supabase create module note:', error.message);
          else remoteData = data;
        }
      } catch (err) {
        console.warn('Supabase module write notice:', err);
      }
    }

    if (cleanData.id) {
      const idx = localDb.data.modules.findIndex(m => m.id === cleanData.id);
      if (idx !== -1) {
        localDb.data.modules[idx] = { ...localDb.data.modules[idx], ...cleanData };
        localDb.save();
        return remoteData || localDb.data.modules[idx];
      }
    }

    const newMod = {
      id: remoteData?.id || ('mod-' + Date.now()),
      ...cleanData,
      status: cleanData.status || 'draft',
      created_at: now
    };
    localDb.data.modules.push(newMod);
    localDb.save();
    return remoteData || newMod;
  },

  async deleteModule(id) {
    if (isLiveConfigured && supabase && isUUID(id)) {
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
        if (isUUID(orderedIds[i])) {
          const { error } = await supabase.from('modules').update({ display_order: i + 1 }).eq('id', orderedIds[i]);
          if (error) console.warn('Failed to reorder module in Supabase:', error.message);
        }
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
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*, modules(title, slug, status), quiz_questions(id)');
        if (error) {
          console.warn('Failed to load quizzes from Supabase:', error.message);
        } else if (data) {
          return data.map(q => ({
            ...q,
            module_title: q.modules?.title || 'Unassigned',
            module_slug: q.modules?.slug || '',
            question_count: q.quiz_questions?.length || 0
          }));
        }
      } catch (err) {
        console.warn('Supabase getQuizzes exception:', err);
      }
    }
    if (isProduction && !localDb.data.quizzes.length) {
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
    if (isLiveConfigured && supabase && isUUID(moduleId)) {
      try {
        const { data: qData, error: qErr } = await supabase.from('quizzes').select('*').eq('module_id', moduleId).single();
        if (qErr && qErr.code !== 'PGRST116') {
          console.warn('Failed to load quiz from Supabase:', qErr.message);
        } else if (qData) {
          const { data: qList, error: listErr } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', qData.id)
            .order('display_order', { ascending: true });
          if (listErr) {
            console.warn('Failed to load quiz questions from Supabase:', listErr.message);
          } else {
            const questions = await Promise.all((qList || []).map(async (q) => {
              const { data: opts, error: optErr } = await supabase
                .from(includeAnswers ? 'quiz_options' : 'learner_quiz_options')
                .select('*')
                .eq('question_id', q.id)
                .order('display_order', { ascending: true });
              if (optErr) console.warn('Failed to load quiz options from Supabase:', optErr.message);
              return { ...q, options: opts || [] };
            }));
            return { ...qData, questions };
          }
        }
      } catch (err) {
        console.warn('Supabase getQuizByModuleId exception, checking fallback:', err);
      }
    }

    // Fallback: localDb and subjectsData
    return this.getLocalQuizByModuleId(moduleId, includeAnswers);
  },

  getLocalQuizByModuleId(moduleId, includeAnswers = false) {
    if (!moduleId) return null;

    // 1. Direct match in localDb.data.quizzes by module_id or id
    let quiz = localDb.data.quizzes.find(q => q.module_id === moduleId || q.id === moduleId);

    // 2. If not found, check if moduleId matches a module slug or ID in localDb
    if (!quiz) {
      const mod = localDb.data.modules.find(m => m.slug === moduleId || m.id === moduleId);
      if (mod) {
        quiz = localDb.data.quizzes.find(q => q.module_id === mod.id);
      }
    }

    if (quiz) {
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
    }

    // 3. Fallback: check subjectsData for built-in quizzes
    if (typeof subjectsData === 'object' && subjectsData !== null) {
      for (const key of Object.keys(subjectsData)) {
        const group = subjectsData[key];
        if (group && Array.isArray(group.modules)) {
          const targetMod = group.modules.find(m => 
            m.id === moduleId || 
            m.slug === moduleId || 
            (typeof moduleId === 'string' && (moduleId.includes(m.slug) || m.slug.includes(moduleId)))
          );

          if (targetMod && Array.isArray(targetMod.quiz) && targetMod.quiz.length > 0) {
            const quizId = `quiz-${targetMod.slug}`;
            const questions = targetMod.quiz.map((q, qIdx) => {
              const qId = `q-${targetMod.slug}-${qIdx + 1}`;
              const opts = q.options.map((optText, optIdx) => {
                const optId = `opt-${targetMod.slug}-${qIdx + 1}-${optIdx + 1}`;
                const optionObj = {
                  id: optId,
                  question_id: qId,
                  option_text: optText,
                  display_order: optIdx + 1
                };
                if (includeAnswers) {
                  optionObj.is_correct = optIdx === q.correctIndex;
                }
                return optionObj;
              });

              return {
                id: qId,
                quiz_id: quizId,
                question_text: q.question,
                display_order: qIdx + 1,
                explanation: q.explanation || '',
                options: opts
              };
            });

            return {
              id: quizId,
              module_id: targetMod.id,
              title: `${targetMod.title} Assessment`,
              description: targetMod.shortDesc || 'Verification of operational and safety standards.',
              is_published: true,
              questions
            };
          }
        }
      }
    }

    return null;
  },

  async getQuizById(id) {
    if (isLiveConfigured && supabase && isUUID(id)) {
      try {
        const { data: qData, error: qErr } = await supabase.from('quizzes').select('*, modules(*)').eq('id', id).single();
        if (qErr && qErr.code !== 'PGRST116') {
          console.warn('Failed to load quiz from Supabase:', qErr.message);
        } else if (qData) {
          const { data: qList, error: listErr } = await supabase.from('quiz_questions').select('*').eq('quiz_id', id).order('display_order', { ascending: true });
          if (listErr) {
            console.warn('Failed to load questions:', listErr.message);
          } else {
            const questions = await Promise.all((qList || []).map(async (q) => {
              const { data: opts, error: optErr } = await supabase.from('quiz_options').select('*').eq('question_id', q.id).order('display_order', { ascending: true });
              if (optErr) console.warn('Failed to load options:', optErr.message);
              return { ...q, options: opts || [] };
            }));
            return { ...qData, questions };
          }
        }
      } catch (err) {
        console.warn('Supabase getQuizById exception:', err);
      }
    }

    const quiz = localDb.data.quizzes.find(q => q.id === id);
    if (!quiz) {
      return this.getLocalQuizByModuleId(id, true);
    }

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
      if (quizId && isUUID(quizId)) {
        const { error: updErr } = await supabase.from('quizzes').update({
          title: quizData.title,
          description: quizData.description || '',
          is_published: quizData.is_published,
          updated_at: now
        }).eq('id', quizId);
        if (updErr) throw new Error('Failed to update quiz: ' + updErr.message);
      } else if (isUUID(quizData.module_id)) {
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

      if (quizId && isUUID(quizId) && questionsWithOpts.length > 0) {
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
        return quizId;
      }
    }
    if (isProduction && !localDb.data.quizzes.length) {
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
    if (isLiveConfigured && supabase && isUUID(id)) {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) throw new Error('Failed to delete quiz: ' + error.message);
      return true;
    }
    if (isProduction && !localDb.data.quizzes.length) {
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
    if (isLiveConfigured && supabase && isUUID(quizId)) {
      try {
        const { data, error } = await supabase.rpc('evaluate_quiz_submission', {
          p_quiz_id: quizId,
          p_answers: answers
        });
        if (error) {
          console.warn('Supabase RPC evaluate_quiz_submission error, falling back to local evaluation:', error);
        } else if (data) {
          return data;
        }
      } catch (rpcErr) {
        console.warn('RPC evaluation exception, falling back to local evaluation:', rpcErr);
      }
    }

    let questions = localDb.data.quiz_questions.filter(q => q.quiz_id === quizId).sort((a, b) => a.display_order - b.display_order);
    let options = localDb.data.quiz_options;

    // If not found in localDb, check subjectsData for staff/worker induction quizzes
    if (questions.length === 0 && typeof subjectsData === 'object' && subjectsData !== null) {
      for (const catKey of Object.keys(subjectsData)) {
        const cat = subjectsData[catKey];
        if (cat && Array.isArray(cat.modules)) {
          for (const mod of cat.modules) {
            if (mod.quiz && (quizId.includes(mod.slug) || quizId === `quiz-${mod.slug}` || quizId === mod.id)) {
              questions = mod.quiz.map((q, qIdx) => ({
                id: `q-${mod.slug}-${qIdx + 1}`,
                quiz_id: quizId,
                question_text: q.question,
                display_order: qIdx + 1,
                explanation: q.explanation || ''
              }));
              options = [];
              mod.quiz.forEach((q, qIdx) => {
                const qId = `q-${mod.slug}-${qIdx + 1}`;
                q.options.forEach((optText, optIdx) => {
                  options.push({
                    id: `opt-${mod.slug}-${qIdx + 1}-${optIdx + 1}`,
                    question_id: qId,
                    option_text: optText,
                    is_correct: optIdx === q.correctIndex,
                    display_order: optIdx + 1
                  });
                });
              });
              break;
            }
          }
        }
        if (questions.length > 0) break;
      }
    }

    if (questions.length === 0) {
      throw new Error('Quiz evaluation failed: Quiz questions not found.');
    }

    let correctCount = 0;
    const results = questions.map(q => {
      const correctOpt = options.find(o => o.question_id === q.id && o.is_correct);
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
