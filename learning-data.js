/**
 * Fusionsole Learning Centre - Data Store
 * Contains metadata, module listings, course content, and quiz definitions
 * for Staff Induction and the three manufacturing subjects (Stitching, Assembly, Cutting).
 */

export const subjectsData = {
  staff: {
    id: 'staff',
    name: 'Staff',
    route: '/learning/staff',
    badge: 'STAFF & WORKER INDUCTION',
    headline: 'Staff & Worker Induction',
    description: 'An introduction to Fusionsole, the workplace environment, company practices and essential safety information for newly joined staff and production workers.',
    image: '/images/fusion-moulds.jpg',
    modulesCount: 2,
    previewItems: ['Staff Induction', 'Worker Induction', 'Workplace Safety & Standards'],
    modules: [
      {
        id: 'mod-01-staff-induction',
        slug: 'staff-induction',
        number: 1,
        title: 'Staff Induction',
        shortDesc: 'Get introduced to our workplace culture, organizational values, facility layout, safety protocols, and company operational standards.',
        videoTitle: 'Fusionsole Staff Orientation & Operations Overview',
        overview: 'This foundational induction module is designed to provide all newly joined staff members with a clear understanding of Fusionsole as a premier footwear manufacturing organization. You will learn about our operational history, quality commitment, facility safety guidelines, workplace conduct expectations, and the communication channels available to support your career development.',
        objectives: [
          'Understand Fusionsole organizational mission, operational values, and company history.',
          'Identify key facility safety regulations, emergency exits, and workplace health practices.',
          'Learn HR policies, attendance systems, compliance protocols, and employee communication channels.'
        ],
        instructions: [
          'Review all organizational guidelines and complete your induction checklist with HR within week one.',
          'Ensure adherence to personal protective equipment (PPE) requirements when walking production areas.',
          'Report any safety hazards or facility concerns immediately to your department supervisor.'
        ],
        quiz: [
          {
            question: 'What is the primary commitment that guides everyday operations across all Fusionsole facilities?',
            options: [
              'Achieving speed at the expense of process compliance',
              'Building knowledge, developing skills, and upholding uncompromising product quality',
              'Focusing solely on administrative targets rather than workshop safety',
              'Limiting inter-departmental communication between staff and production teams'
            ],
            correctIndex: 1,
            explanation: 'Fusionsole emphasizes that crafting quality begins with skilled people who understand their work and collaborate with mutual respect.'
          },
          {
            question: 'When visiting or transitioning through production floor departments, what is mandatory for all staff members?',
            options: [
              'Using active mobile phones while walking near machines',
              'Wearing designated personal protective equipment (PPE) and following marked safety walkways',
              'Operating heavy industrial machinery without prior department authorization',
              'Ignoring floor warning tape and machine safety cages'
            ],
            correctIndex: 1,
            explanation: 'Safety is paramount. All team members must adhere to PPE protocols and remain within marked pedestrian transit lines on the factory floor.'
          },
          {
            question: 'Where should staff members direct general operational questions or HR checklist submissions?',
            options: [
              'To their immediate department supervisor or the HR Learning & Development office',
              'External social media groups',
              'Leave questions unasked until annual reviews',
              'To outside vendors visiting the loading docks'
            ],
            correctIndex: 0,
            explanation: 'Department supervisors and the HR Learning team are always available to assist new personnel with questions and checklist verifications.'
          }
        ]
      },
      {
        id: 'mod-01b-worker-induction',
        slug: 'worker-induction',
        number: 2,
        title: 'Worker Induction',
        shortDesc: 'Essential orientation for production floor personnel covering shop floor safety, PPE protocols, machine zone awareness, and quality reporting.',
        videoTitle: 'Fusionsole Production Floor & Worker Safety Orientation',
        overview: 'This mandatory worker induction module equips production team members with the operational and safety fundamentals necessary for working within our footwear manufacturing facilities. You will learn safety walkway rules, personal protective equipment (PPE) requirements, machine guard inspection, shift handover procedures, and the quality reporting chain.',
        objectives: [
          'Comply with shop floor safety protocols, emergency stops, and designated transit zones.',
          'Demonstrate proper use of required Personal Protective Equipment (PPE) for footwear production.',
          'Understand factory shift handovers, attendance logging, and supervisor quality reporting lines.'
        ],
        instructions: [
          'Wear mandatory safety footwear, hair restraints, and eye protection at all times within active workshops.',
          'Inspect all machine guards, emergency shutoff switches, and ventilation hoods before starting any shift.',
          'Immediately halt machinery and notify the line supervisor if any equipment abnormality or safety defect is detected.'
        ],
        quiz: [
          {
            question: 'What is required before starting work on any production floor machinery?',
            options: [
              'Begin operation immediately without checking equipment',
              'Inspect machine guards, verify emergency stop functions, and equip required PPE',
              'Disable machine safety covers to speed up production',
              'Borrow another worker\'s badge to sign in'
            ],
            correctIndex: 1,
            explanation: 'Workers must always inspect guards, verify emergency stops, and equip all mandatory PPE prior to operating any machinery.'
          },
          {
            question: 'If a worker spots an oil leak, damaged electrical wire, or malfunctioning needle on the line, what should they do?',
            options: [
              'Ignore it and continue working',
              'Attempt unauthorized electrical repairs alone',
              'Safely halt the equipment and immediately report the hazard to the line supervisor',
              'Leave the workstation without notifying anyone'
            ],
            correctIndex: 2,
            explanation: 'Safety and quality require immediate reporting of hazards or defects to the department supervisor.'
          },
          {
            question: 'Where must factory personnel and workers walk when navigating between workshops?',
            options: [
              'Directly across active conveyor lines',
              'Within designated, clearly marked safety walkways and pedestrian lanes',
              'Behind forklift loading docks',
              'Under suspended material hoists'
            ],
            correctIndex: 1,
            explanation: 'All team members must use marked pedestrian walkways to prevent accidents with carts, forklifts, and moving equipment.'
          }
        ]
      }
    ]
  },

  stitching: {
    id: 'stitching',
    name: 'Stitching',
    fullName: 'Stitching Department',
    route: '/learning/workers/stitching',
    badge: 'WORKER TRAINING / STITCHING',
    headline: 'Stitching Department',
    description: 'Understand the stitching processes, operations and techniques involved in footwear manufacturing.',
    image: '/images/fusion-stitching.jpg',
    modulesCount: 6,
    previewItems: ['S/N Stitching', 'D/N Stitching', 'C/S Stitching', 'Binding Stitching', 'Zig Zag Stitching', 'Flat Stitching'],
    modules: [
      {
        slug: 'sn-stitching',
        number: 1,
        title: 'S/N Stitching',
        shortDesc: 'Single Needle stitching operations for precision seam joining and shoe upper contour construction.',
        overview: 'Single Needle (S/N) stitching is one of the most critical foundational operations in the footwear upper preparation. In this module, workers learn proper machine tensioning, needle selection, edge margin maintenance, and smooth seam execution across varying leather and synthetic upper components.',
        objectives: [
          'Master single-needle machine setup, thread tension adjustment, and feed dog calibration.',
          'Execute consistent stitch pitch and precise margin distances from cut component edges.',
          'Identify common stitch defects such as thread breakage, skipped stitches, and seam puckering.'
        ],
        instructions: [
          'Always verify needle sharpness and size (typically #16-#18 for heavy upper leathers) before starting a run.',
          'Maintain a stable 2.0mm to 2.5mm margin from the edge unless blueprint specifications dictate otherwise.',
          'Inspect the bobbin case tension at every color or thread spool changeover.'
        ],
        quiz: [
          {
            question: 'What is the primary function of Single Needle (S/N) stitching in upper assembly?',
            options: [
              'Joining components with a single reinforced precision seam along specified edge contours',
              'Punching eyelet holes for shoe laces',
              'Attaching outer rubber outsoles to the lasting board',
              'Drying solvent-based adhesives in an oven'
            ],
            correctIndex: 0,
            explanation: 'S/N stitching is dedicated to clean, precision linear and contour seam joining for upper panels.'
          },
          {
            question: 'What immediate step must an operator take if thread looping is detected on the underside of the seam?',
            options: [
              'Increase sewing speed to outpace the thread guide',
              'Inspect and adjust upper thread tension or re-thread the tension discs properly',
              'Hammer the seam flat on an iron anvil',
              'Discard the entire component batch without checking'
            ],
            correctIndex: 1,
            explanation: 'Underside thread looping usually indicates loose upper tension or incorrect thread routing through the tension discs.'
          },
          {
            question: 'Why must needle condition be verified at the beginning of each production shift?',
            options: [
              'Dull or burred needles cause material tearing, skipped stitches, and uneven seam lines',
              'Needles change color every 24 hours naturally',
              'Machine motors only run when new needles are present',
              'To calculate daily electricity consumption'
            ],
            correctIndex: 0,
            explanation: 'Burred or blunt needles pierce leather unevenly, causing permanent cosmetic damage and weakened structural seams.'
          }
        ]
      },
      {
        slug: 'dn-stitching',
        number: 2,
        title: 'D/N Stitching',
        shortDesc: 'Double Needle stitching for parallel reinforced seams and decorative structural lines.',
        overview: 'Double Needle (D/N) machines utilize two needles driven synchronously to produce perfectly spaced parallel seam tracks. This operation provides structural reinforcement on stress points (e.g., eyelet facings and heel counters) while enhancing cosmetic appeal.',
        objectives: [
          'Understand gauge width settings and dual needle alignment procedures.',
          'Maintain equal thread feed balance across both needles during high-speed seam runs.',
          'Navigate sharp curves and intersecting panels without needle deflection or unequal pitch.'
        ],
        instructions: [
          'Check that both needles are inserted at identical heights and firmly fastened into the needle clamp.',
          'Ensure dual thread guides do not cross or tangle behind the head mechanism.',
          'Slow down on curved heel seams to prevent inner seam crowding.'
        ],
        quiz: [
          {
            question: 'What is the key advantage of Double Needle (D/N) stitching on footwear uppers?',
            options: [
              'It produces two parallel seams simultaneously with consistent spacing and enhanced tensile strength',
              'It eliminates the need for thread bobbins completely',
              'It cures heat-activated adhesives automatically',
              'It trims excess leather along the sole line'
            ],
            correctIndex: 0,
            explanation: 'Double Needle stitching delivers dual parallel lines with uniform spacing, doubling seam reinforcement in one pass.'
          },
          {
            question: 'What happens if one needle in a D/N setup is inserted slightly lower than the other?',
            options: [
              'The machine runs twice as fast',
              'Uneven loop catching occurs, resulting in skipped stitches on the lower needle',
              'Both needles automatically adjust their own clamp',
              'The leather becomes waterproof'
            ],
            correctIndex: 1,
            explanation: 'Unequal needle heights lead to timing discrepancies with the rotary hook, causing severe stitch skipping.'
          },
          {
            question: 'Which areas of a shoe upper frequently require D/N reinforcement stitching?',
            options: [
              'Insole cardboard base',
              'Eyelet stays, quarter overlays, and heel counter joins',
              'Shoelace tips',
              'Bottom tread ribs'
            ],
            correctIndex: 1,
            explanation: 'High-strain zones like eyelet stays and heel counters rely heavily on D/N parallel stitching for durability.'
          }
        ]
      },
      {
        slug: 'cs-stitching',
        number: 3,
        title: 'C/S Stitching',
        shortDesc: 'Chain Stitch operations for flexible, high-elasticity seams on lining and collar components.',
        overview: 'Chain Stitch (C/S) sewing forms an interconnected loop chain on the reverse side of the workpiece. Because the chain structure naturally stretches with mechanical flex, C/S stitching is essential for padded collars, tongue gussets, and flexible internal linings.',
        objectives: [
          'Operate chain stitch looper systems and thread looper mechanisms accurately.',
          'Calibrate loop tension to allow elasticity without loose or dangling threads.',
          'Properly backtack or lock chain endings to prevent unraveling.'
        ],
        instructions: [
          'Never pull the material backwards out of a chain stitch machine while the looper is engaged.',
          'Always secure the trailing chain thread at panel intersections to prevent run-backs.',
          'Regularly clean the looper area of lint, leather dust, and thread fragments.'
        ],
        quiz: [
          {
            question: 'What characteristic makes Chain Stitch (C/S) particularly suited for collar linings?',
            options: [
              'It is completely rigid and cannot flex',
              'Its looped structure provides natural stretch and flexibility without snapping threads under foot insertion strain',
              'It uses metal wire instead of synthetic thread',
              'It adheres without using a needle'
            ],
            correctIndex: 1,
            explanation: 'The chain loop mechanism accommodates dynamic stretch and movement in flexible areas like padded collars.'
          },
          {
            question: 'Why must the termination of a chain stitch seam be carefully secured or back-tacked?',
            options: [
              'Chain stitches can unravel rapidly if the final loop is left loose and pulled',
              'To change the thread color automatically',
              'To heat-seal the leather',
              'Chain stitches never need securing'
            ],
            correctIndex: 0,
            explanation: 'A chain stitch can unravel in seconds if the end loop is loose; securing the termination lock is mandatory.'
          },
          {
            question: 'Which mechanism replaces the traditional bobbin in standard chain stitch machines?',
            options: [
              'An oscillating looper mechanism that feeds lower thread continuously from a spool',
              'An adhesive glue reservoir',
              'A laser cutting beam',
              'A rotary cutter wheel'
            ],
            correctIndex: 0,
            explanation: 'Chain stitch machines use an active looper that takes thread directly from large spools rather than small wound bobbins.'
          }
        ]
      },
      {
        slug: 'binding-stitching',
        number: 4,
        title: 'Binding Stitching',
        shortDesc: 'Edge binding tape application to protect and finish raw leather and fabric edges.',
        overview: 'Binding stitching involves folding protective textile tape or synthetic piping over raw upper edges and stitching it cleanly in a single automated pass. This protects cut edges from fraying and ensures a comfortable, premium edge finish.',
        objectives: [
          'Install and calibrate edge folding attachments and folder guides.',
          'Ensure tape tension is uniform to prevent puckered or wavy edge contours.',
          'Align top and bottom tape widths symmetrically on both sides of the material.'
        ],
        instructions: [
          'Ensure the binding tape sits centered in the feeding folder before initiating sewing.',
          'Maintain steady forward guide pressure around rounded tongue and top-line collar curves.',
          'Check that the stitch line penetrates both top and bottom tape folds securely.'
        ],
        quiz: [
          {
            question: 'What is the primary purpose of the edge binding operation in footwear manufacturing?',
            options: [
              'To encase raw material edges, prevent fraying, and deliver a smooth, skin-friendly perimeter',
              'To attach the rubber outsole',
              'To drill ventilation eyelets',
              'To measure shoe sizes'
            ],
            correctIndex: 0,
            explanation: 'Binding covers raw cut edges to prevent delamination/fraying and delivers a smooth perimeter finish.'
          },
          {
            question: 'What causes wavy or rippled edges after binding stitching?',
            options: [
              'Binding tape fed with excessive stretch or uneven manual feeding pressure',
              'Using high quality thread',
              'The machine running too quietly',
              'Having clean needles'
            ],
            correctIndex: 0,
            explanation: 'If the tape is stretched too tight when entering the folder, it will relax afterwards, creating wavy, rippled edges.'
          },
          {
            question: 'How should an operator handle sharp convex or concave curves during binding?',
            options: [
              'Accelerate machine speed to max',
              'Ease the material slowly through the guide folder, feeding slack around the curve without pulling',
              'Cut the tape completely and restart after the curve',
              'Skip the curved section'
            ],
            correctIndex: 1,
            explanation: 'Guiding the material smoothly and without tension around curves ensures the tape wraps cleanly without bunching.'
          }
        ]
      },
      {
        slug: 'zig-zag-stitching',
        number: 5,
        title: 'Zig Zag Stitching',
        shortDesc: 'Elastic backseam and edge abutment joining with side-to-side needle oscillation.',
        overview: 'Zig Zag stitching uses alternating lateral needle penetration to join butted edges (such as heel seams and tongue linings) without overlapping bulk, while providing superior lateral flexibility under foot flexion.',
        objectives: [
          'Calibrate zig-zag stitch width (amplitude) and forward stitch pitch.',
          'Achieve smooth edge-to-edge butting without overlapping or gaps between panels.',
          'Prevent edge curling when stitching lightweight stretch fabrics and mesh linings.'
        ],
        instructions: [
          'Ensure the needle penetration alternates evenly across the center seam line (50% left, 50% right).',
          'Use correct presser foot tension so panels do not crawl over one another.',
          'Verify thread tension is moderate to avoid gathering the joined edge.'
        ],
        quiz: [
          {
            question: 'When is a zig-zag butted seam preferred over a standard overlapping lap seam?',
            options: [
              'When zero bulk is required on internal touchpoints like heel seams and tongue linings',
              'When attaching the thickest bottom rubber soles',
              'When creating waterproof boot seams',
              'Only when thread runs out'
            ],
            correctIndex: 0,
            explanation: 'Butted zig-zag seams join pieces edge-to-edge without overlapping layers, eliminating bulky pressure points against the wearer foot.'
          },
          {
            question: 'What is the consequence if the zig-zag stitch width is calibrated too narrow on butted panels?',
            options: [
              'The seam will have insufficient bite into the material and pull apart under tension',
              'The seam will become too rigid',
              'The machine will overheat instantly',
              'The thread will turn black'
            ],
            correctIndex: 0,
            explanation: 'Too narrow an amplitude means the needle barely catches the edge of each piece, risking seam failure under tension.'
          },
          {
            question: 'How is proper alignment maintained when butting two pieces together under the foot?',
            options: [
              'Using a center seam guide on the presser foot to keep both pieces centered under the needle',
              'By sewing with eyes closed',
              'By gluing both pieces together with wood cement',
              'By pulling the left side harder than the right side'
            ],
            correctIndex: 0,
            explanation: 'A presser foot with a central guide fin keeps the butted seam perfectly aligned with the oscillating needle.'
          }
        ]
      },
      {
        slug: 'flat-stitching',
        number: 6,
        title: 'Flat Stitching',
        shortDesc: 'Flat bed machine operations for linear panel joining, strap attachment, and logo embroidery.',
        overview: 'Flat bed stitching utilizes a horizontal bed table surface, providing maximum support for large flat components before three-dimensional lasting. It is ideal for vamp construction, mudguard assembly, and structural branding placement.',
        objectives: [
          'Handle flat component manipulation on horizontal bed sewing tables.',
          'Ensure smooth feeding of layered composite materials (leather, foam, mesh, tricot).',
          'Follow intricate pattern markings accurately to ensure symmetrical pair assembly.'
        ],
        instructions: [
          'Keep the entire workpiece supported on the table to avoid drag that causes uneven stitch length.',
          'Align reference silver-pen registration notches before lowering the presser foot.',
          'Trim trailing thread tails flush after finishing each component piece.'
        ],
        quiz: [
          {
            question: 'What makes flat bed stitching ideal for initial upper sub-assembly?',
            options: [
              'The large horizontal work table supports the entire flat panel weight, preventing distortion during sewing',
              'It automatically cuts the shoe components',
              'It does not require electrical power',
              'It can only stitch round items'
            ],
            correctIndex: 0,
            explanation: 'The flat surface supports large, flat cut pieces smoothly without drag or gravitational pull distorting the seam.'
          },
          {
            question: 'What do registration notches on cut leather components indicate to the flat stitching operator?',
            options: [
              'Alignment markers showing where mating panels must correspond to ensure pair symmetry',
              'Random manufacturing flaws to be trimmed off',
              'Barcode price tags',
              'Where to discard the leather'
            ],
            correctIndex: 0,
            explanation: 'Registration notches ensure that left and right components match blueprints identically when joined.'
          },
          {
            question: 'What is the correct protocol before beginning a production run of flat stitched vamps?',
            options: [
              'Test stitch on scrap material of identical thickness to verify stitch length, tension, and appearance',
              'Immediately sew the final customer batch without checks',
              'Turn off all room lighting',
              'Change the motor voltage'
            ],
            correctIndex: 0,
            explanation: 'A test stitch run on matching material scrap confirms that machine tension and stitch pitch meet specification.'
          }
        ]
      }
    ]
  },

  assembly: {
    id: 'assembly',
    name: 'Assembly',
    fullName: 'Assembly Department',
    route: '/learning/workers/assembly',
    badge: 'WORKER TRAINING / ASSEMBLY',
    headline: 'Assembly Department',
    description: 'Understand the operations involved in shaping, assembling, finishing and preparing footwear products.',
    image: '/images/fusion-lasting.jpg',
    modulesCount: 19,
    previewItems: ['Counter Moulding', 'Stroble Stitching', 'Lasting', 'Lace', 'Seed Lasting', 'Sole Attaching', 'Packing (+12 more)'],
    modules: [
      { slug: 'counter-moulding', number: 1, title: 'Counter Moulding', shortDesc: 'Pre-forming thermoplastic heel counters under heat and pneumatic pressure.' },
      { slug: 'stroble-stitching', number: 2, title: 'Stroble Stitching', shortDesc: 'Stitching the insole sock directly to the bottom perimeter of the shoe upper.' },
      { slug: 'lasting', number: 3, title: 'Lasting', shortDesc: 'Pulling and securing the shoe upper over the shoe last to form the 3D anatomical shape.' },
      { slug: 'lace', number: 4, title: 'Lace', shortDesc: 'Threading laces through eyelets and setting tongue positioning prior to toe lasting.' },
      { slug: 'seed-lasting', number: 5, title: 'Seed Lasting', shortDesc: 'Precision tacking and shaping around the toe spring and waist curvatures.' },
      { slug: 'marking', number: 6, title: 'Marking', shortDesc: 'Tracing sole bonding perimeter lines accurately onto the lasted upper surface.' },
      { slug: 'roufing', number: 7, title: 'Roufing', shortDesc: 'Mechanical abrasion of lasted bottom leather to expose open fiber for adhesive penetration.' },
      { slug: 'sole-wash', number: 8, title: 'Sole Wash', shortDesc: 'Chemical solvent degreasing of outsole bonding channels to eliminate mould release agents.' },
      { slug: 'upper-wash', number: 9, title: 'Upper Wash', shortDesc: 'Applying cleaning primers to the roughed upper margins to activate surface adhesion.' },
      { slug: 'sole-pasting', number: 10, title: 'Sole Pasting', shortDesc: 'Uniform application of polyurethane adhesive coating across the outsole bonding bed.' },
      { slug: 'upper-pasting', number: 11, title: 'Upper Pasting', shortDesc: 'Precision brush application of adhesive within designated roughed boundary lines.' },
      { slug: 'sole-attaching', number: 12, title: 'Sole Attaching', shortDesc: 'Mating heated sole and upper followed by pneumatic pressing in diaphragm press machines.' },
      { slug: 'edge-cleaning', number: 13, title: 'Edge Cleaning', shortDesc: 'Careful removal of micro-adhesive flash along feather edge lines using crepe rubber.' },
      { slug: 'd-lasting', number: 14, title: 'D Lasting', shortDesc: 'Mechanized de-lasting extraction of the solid shoe last from the finished bonded shoe.' },
      { slug: 'stuffing', number: 15, title: 'Stuffing', shortDesc: 'Inserting shape-holding acid-free paper tissue to protect toe volume during transport.' },
      { slug: 'socks-inserting', number: 16, title: 'Socks Inserting', shortDesc: 'Fitting cushioned footbed insocks smoothly into the interior foot cavity.' },
      { slug: 'checking', number: 17, title: 'Checking', shortDesc: 'Rigorous 100% quality inspection checking symmetry, bond line integrity, and finish.' },
      { slug: 'packing', number: 18, title: 'Packing', shortDesc: 'Wrapping footwear pairs in protective tissue and packing into branded retail cartons.' },
      { slug: 'foxing', number: 19, title: 'Foxing', shortDesc: 'Applying perimeter rubber foxing tape on vulcanized and casual footwear models.' }
    ].map(m => ({
      ...m,
      overview: `${m.title} is an indispensable phase within the Fusionsole Assembly Department. Workers operating in this department must master precision equipment handling, temperature control, adhesive timing, and quality inspection to ensure structurally sound, durable footwear.`,
      objectives: [
        `Understand the specific operational standard for ${m.title} within the production line.`,
        'Identify proper equipment settings, safety guidelines, and material handling techniques.',
        'Detect, prevent, and correct defects prior to passing the footwear to the next workstation.'
      ],
      instructions: [
        `Follow standard operating procedure (SOP) cards mounted at the ${m.title} workstation.`,
        'Verify tool sharpness, temperature gauges, or pneumatic pressure settings before every shift.',
        'Perform visual quality check on 100% of pieces processed through your station.'
      ],
      quiz: [
        {
          question: `What is the primary quality objective during the ${m.title} operation?`,
          options: [
            'Executing the process strictly according to technical specifications and safety parameters',
            'Skipping inspection steps to maximize unit throughput',
            'Applying random temperatures without checking thermometers',
            'Altering machine settings without supervisor signoff'
          ],
          correctIndex: 0,
          explanation: `In the Assembly Department, rigorous adherence to technical standards during ${m.title} is fundamental to footwear longevity.`
        },
        {
          question: 'What action should an assembly worker take if a defective component is identified at their station?',
          options: [
            'Push it forward to the next workstation anyway',
            'Segregate the defective piece in the yellow rework bin and notify the line supervisor immediately',
            'Cover the defect with packaging tape',
            'Throw the item away without recording it'
          ],
          correctIndex: 1,
          explanation: 'Quality control requires immediate segregation of defects to prevent compound errors further down the assembly conveyor.'
        },
        {
          question: 'Why are clean hands and clean tools essential during assembly operations?',
          options: [
            'Contaminants like oil or dust weaken adhesive bonding and stain finished footwear materials',
            'Tools only function when polished with wax',
            'To reduce factory room humidity',
            'There is no reason'
          ],
          correctIndex: 0,
          explanation: 'Dust, moisture, or grease on bonding surfaces drastically reduces adhesive bond strength, leading to premature sole delamination.'
        }
      ]
    }))
  },

  cutting: {
    id: 'cutting',
    name: 'Cutting',
    fullName: 'Cutting Department',
    route: '/learning/workers/cutting',
    badge: 'WORKER TRAINING / CUTTING',
    headline: 'Cutting Department',
    description: 'Learn about the initial material cutting operations involved in preparing footwear components.',
    image: '/images/fusion-moulds.jpg',
    modulesCount: 2,
    previewItems: ['Beam Cutting', 'Normal Cutting'],
    modules: [
      {
        slug: 'beam-cutting',
        number: 1,
        title: 'Beam Cutting',
        shortDesc: 'Operating hydraulic beam press machinery for high-volume multi-layer die cutting.',
        overview: 'Beam cutting utilizes hydraulic beam press systems with dual safety interlocks to cut large quantities of synthetic fabrics, foams, and lining materials simultaneously. Operators learn cutting die nesting, stroke depth adjustment, and cutting block maintenance.',
        objectives: [
          'Understand hydraulic beam press controls, dual-hand safety interlocks, and pressure settings.',
          'Execute tight nesting layouts on multi-layer fabrics to maximize material yield and minimize scrap.',
          'Inspect cutting die cutting edges for sharpness, burrs, and ejection sponge condition.'
        ],
        instructions: [
          'Never place hands underneath the moving beam; always use two-hand synchronous button controls.',
          'Check beam balance and cutting depth so dies penetrate clean through all layers without damaging the nylon board.',
          'Rotate the nylon cutting pad periodically to prevent localized groove wear.'
        ],
        quiz: [
          {
            question: 'What is the mandatory safety rule when operating a hydraulic beam cutting press?',
            options: [
              'Both hands must remain on the dual safety operating buttons during the downward stroke',
              'One hand should hold the cutting die while the other presses the pedal',
              'Operating buttons may be taped down for continuous cycles',
              'Safety guards may be removed for faster loading'
            ],
            correctIndex: 0,
            explanation: 'Dual-hand synchronous buttons ensure that the operator hands are completely clear of the descending beam area at all times.'
          },
          {
            question: 'Why is computerized or strategic die nesting crucial in the cutting department?',
            options: [
              'It maximizes material utilization and dramatically minimizes waste scrap in raw materials',
              'It makes the machine cut faster automatically',
              'It changes the color of synthetic fabrics',
              'It reduces the number of shoes produced'
            ],
            correctIndex: 0,
            explanation: 'Efficient nesting aligns pattern shapes to minimize gaps between cut parts, directly reducing expensive material waste.'
          },
          {
            question: 'What is the consequence of setting excessive cutting stroke depth on a beam press?',
            options: [
              'Cutting dies penetrate too deeply into the nylon board, dulling the dies and grooving the cutting board',
              'The fabric layers become softer',
              'The press runs backwards',
              'No consequences'
            ],
            correctIndex: 0,
            explanation: 'Excessive depth drives die blades deep into the sacrificial nylon board, damaging dies and causing ragged cut edges.'
          }
        ]
      },
      {
        slug: 'normal-cutting',
        number: 2,
        title: 'Normal Cutting',
        shortDesc: 'Manual and clicking press operations for genuine leather hide grading and directional grain cutting.',
        overview: 'Normal cutting involves swinging arm clicking presses or precision manual cutting of natural leather hides. Because natural leather has directional stretch, varying grain density, and surface imperfections, cutters must inspect, grade, and orient patterns along optimal lines of stretch.',
        objectives: [
          'Evaluate natural leather hides for grain direction, stretch orientation, and natural flaws.',
          'Operate swinging arm clicking presses safely with single-action controls.',
          'Ensure symmetrical pairing of left and right footwear components with matching color and grain texture.'
        ],
        instructions: [
          'Always position pattern pieces so that the tightest line of stretch runs lengthwise along the shoe last.',
          'Avoid placing visible vamp components over flanky, loose-fiber belly sections of the hide.',
          'Clear clicking arm swing path before triggering cutting cycle.'
        ],
        quiz: [
          {
            question: 'Why must leather grain direction and stretch lines be analyzed before cutting shoe uppers?',
            options: [
              'Uppers must have minimal stretch lengthwise to hold lasting shape while allowing lateral comfort stretch across the ball of the foot',
              'Leather has no directional stretch',
              'To match the color of the cutting table',
              'Only for aesthetic reasons'
            ],
            correctIndex: 0,
            explanation: 'Correct stretch orientation ensures shoes maintain structural length when lasted while conforming to the wearer foot in width.'
          },
          {
            question: 'Which area of a natural cattle hide has the tightest fiber density and is best for high-grade vamps?',
            options: [
              'The butt and bend area along the spine',
              'The loose belly and flank area',
              'The extreme edge of the shanks',
              'The outer tail flap'
            ],
            correctIndex: 0,
            explanation: 'The butt and bend area along the spine offers the dense, uniform fiber structure required for prime vamp components.'
          },
          {
            question: 'What is the required standard for pairing cut components for a single pair of shoes?',
            options: [
              'Both left and right components must match in color shade, grain texture, and thickness',
              'Any random pieces may be grouped together',
              'Left and right should always be cut from completely different hides',
              'Thickness differences of 50% are acceptable'
            ],
            correctIndex: 0,
            explanation: 'Pairs must be cut together to guarantee identical color shade, grain appearance, and tactile thickness.'
          }
        ]
      }
    ]
  }
};
