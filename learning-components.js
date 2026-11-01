/**
 * Fusionsole Learning Centre - Dynamic Reusable Component Renderers
 * Pure UI renderers for Breadcrumbs, Main Learning Centre, Workers Landing,
 * Staff Landing, Subject Module Listings, and Individual Course Detail Pages.
 * Connected to live/local database records while preserving the exact original styling.
 */

import { subjectsData } from './learning-data.js';
import { dbService } from './supabase.js';

export function renderBreadcrumbs(crumbs) {
  const items = crumbs.map((crumb, idx) => {
    const isLast = idx === crumbs.length - 1;
    if (isLast) {
      return `<li class="breadcrumb-item active" aria-current="page">${crumb.label}</li>`;
    }
    return `
      <li class="breadcrumb-item">
        <a href="${crumb.url}" class="breadcrumb-link">${crumb.label}</a>
        <span class="breadcrumb-separator">/</span>
      </li>
    `;
  }).join('');

  return `
    <nav class="learning-breadcrumbs-nav" aria-label="Breadcrumb">
      <div class="container">
        <ol class="breadcrumb-list">${items}</ol>
      </div>
    </nav>
  `;
}

// -----------------------------------------------------------------------------
// 1. LEARNING CENTRE OVERVIEW
// -----------------------------------------------------------------------------
export function renderLearningCenterPage(categories = null) {
  const breadcrumbs = renderBreadcrumbs([
    { label: 'Home', url: '/' },
    { label: 'Learning Centre', url: '/learning' }
  ]);

  // Fallback if categories not yet fetched
  const cats = categories || [
    {
      name: 'Staff',
      slug: 'staff',
      description: 'Get introduced to Fusionsole, understand the workplace environment and learn the essential information needed to begin your journey with the company.',
      image_path: '/images/fusion-moulds.jpg',
      badge: 'STAFF INDUCTION',
      meta: '1 Core Module',
      tags: ['Company Overview', 'Workplace Safety', 'HR Standards']
    },
    {
      name: 'Workers',
      slug: 'workers',
      description: 'Explore footwear manufacturing processes and understand the different operations involved in producing quality footwear.',
      image_path: '/images/fusion-stitching.jpg',
      badge: 'MANUFACTURING TRAINING',
      meta: '27 Total Modules · 3 Departments',
      tags: ['Stitching', 'Assembly', 'Cutting']
    }
  ];

  const cardsHtml = cats.map((cat, idx) => {
    const isStaff = cat.slug === 'staff';
    const numStr = String(idx + 1).padStart(2, '0');
    const badgeText = isStaff ? 'STAFF INDUCTION' : 'MANUFACTURING TRAINING';
    const badgeClass = isStaff ? 'tag-blue' : 'tag-green';
    const targetUrl = `/learning/${cat.slug}`;
    const btnLabel = isStaff ? 'Explore Induction' : 'Explore Training';

    return `
      <article class="category-editorial-card">
        <div class="category-card-media">
          <img src="${cat.image_path || '/images/fusion-moulds.jpg'}" alt="${cat.name} learning programme" loading="lazy" />
          <div class="category-card-badge">
            <span class="tag ${badgeClass}">${badgeText}</span>
          </div>
        </div>
        <div class="category-card-body">
          <div class="category-meta-line">
            <span class="category-index-num">CATEGORY ${numStr}</span>
            <span class="category-duration">${isStaff ? '1 Core Module' : '3 Manufacturing Departments'}</span>
          </div>
          <h2 class="category-card-title">${cat.name}</h2>
          <p class="category-card-text">
            ${cat.description || 'Explore learning programmes and workplace operational standards.'}
          </p>
          <div class="category-preview-tags">
            ${isStaff 
              ? '<span class="preview-tag">Company Overview</span><span class="preview-tag">Workplace Safety</span><span class="preview-tag">HR Standards</span>'
              : '<span class="preview-tag">Stitching</span><span class="preview-tag">Assembly</span><span class="preview-tag">Cutting</span>'}
          </div>
          <div class="category-card-action">
            <a href="${targetUrl}" class="btn btn-primary category-btn">
              <span>${btnLabel}</span>
              <span class="btn-icon-circle">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9L9 3M9 3H4.5M9 3V7.5"/></svg>
              </span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="learning-page-wrapper">
      ${breadcrumbs}

      <!-- Page Intro Header -->
      <section class="learning-hero-header">
        <div class="container">
          <div class="learning-header-content">
            <span class="learning-eyebrow-pill">FUSIONSOLE LEARNING &amp; DEVELOPMENT</span>
            <h1 class="learning-page-title">Learning Centre</h1>
            <p class="learning-page-description">
              Explore the learning programmes designed to introduce employees to Fusionsole, our workplace and the processes behind our footwear manufacturing operations.
            </p>
          </div>
        </div>
      </section>

      <!-- Category Selection Grid -->
      <section class="learning-categories-section">
        <div class="container">
          <div class="categories-editorial-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 2. STAFF LANDING PAGE
// -----------------------------------------------------------------------------
export function renderStaffLandingPage(moduleRecord = null) {
  const staff = subjectsData.staff;
  const breadcrumbs = renderBreadcrumbs([
    { label: 'Home', url: '/' },
    { label: 'Learning Centre', url: '/learning' },
    { label: 'Staff', url: '/learning/staff' }
  ]);

  const modTitle = moduleRecord?.title || 'Staff Induction';
  const modDesc = moduleRecord?.description || staff.description;
  const modSlug = moduleRecord?.slug || 'staff-induction';

  return `
    <div class="learning-page-wrapper">
      ${breadcrumbs}

      <!-- Page Intro Header -->
      <section class="learning-hero-header">
        <div class="container">
          <div class="learning-header-content">
            <span class="learning-eyebrow-pill">${staff.badge}</span>
            <h1 class="learning-page-title">${staff.headline}</h1>
            <p class="learning-page-description">${staff.description}</p>
          </div>
        </div>
      </section>

      <!-- Staff Module Section -->
      <section class="modules-listing-section">
        <div class="container">
          <div class="modules-section-meta">
            <h2 class="modules-section-heading">Induction Curriculum</h2>
            <span class="modules-count-badge">1 Core Induction Module</span>
          </div>

          <div class="staff-module-spotlight">
            <div class="spotlight-card">
              <div class="spotlight-media">
                <img src="/images/fusion-moulds.jpg" alt="Fusionsole factory floor and company induction" />
                <div class="spotlight-video-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  <span>Video &amp; Assessment</span>
                </div>
              </div>
              <div class="spotlight-content">
                <div class="module-number-pill">MODULE 01</div>
                <h3 class="spotlight-title">${modTitle}</h3>
                <p class="spotlight-desc">
                  ${modDesc}
                </p>
                <div class="spotlight-checklist">
                  <div class="check-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#1e40af" stroke-width="2"><path d="M4 10l4 4 8-8"/></svg>
                    <span>Company mission, history &amp; manufacturing standards</span>
                  </div>
                  <div class="check-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#1e40af" stroke-width="2"><path d="M4 10l4 4 8-8"/></svg>
                    <span>Workplace health, safety protocols &amp; factory walking lanes</span>
                  </div>
                  <div class="check-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#1e40af" stroke-width="2"><path d="M4 10l4 4 8-8"/></svg>
                    <span>HR guidelines, employee benefits &amp; communication channels</span>
                  </div>
                </div>
                <div class="spotlight-action">
                  <a href="/learning/staff/${modSlug}" class="btn btn-primary btn-lg">
                    <span>View Module &amp; Start Induction</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 3. WORKERS LANDING PAGE (List of Manufacturing Departments)
// -----------------------------------------------------------------------------
export function renderWorkersLandingPage(subjectsList = null) {
  const breadcrumbs = renderBreadcrumbs([
    { label: 'Home', url: '/' },
    { label: 'Learning Centre', url: '/learning' },
    { label: 'Workers', url: '/learning/workers' }
  ]);

  const defaultSubs = [
    {
      slug: 'stitching',
      name: 'Stitching',
      description: 'Understand the stitching processes, operations and techniques involved in footwear manufacturing.',
      image_path: '/images/fusion-stitching.jpg',
      preview: ['S/N Stitching', 'D/N Stitching', 'C/S Stitching', '+3 more']
    },
    {
      slug: 'assembly',
      name: 'Assembly',
      description: 'Understand the operations involved in shaping, assembling, finishing and preparing footwear products.',
      image_path: '/images/fusion-lasting.jpg',
      preview: ['Counter Moulding', 'Lasting', 'Sole Attaching', '+16 more']
    },
    {
      slug: 'cutting',
      name: 'Cutting',
      description: 'Learn about the initial material cutting operations involved in preparing footwear components.',
      image_path: '/images/fusion-moulds.jpg',
      preview: ['Beam Cutting', 'Normal Cutting']
    }
  ];

  const subs = subjectsList || defaultSubs;

  const subjectsHtml = subs.map((sub, idx) => {
    const numStr = String(idx + 1).padStart(2, '0');
    const isReverse = idx % 2 === 1 ? 'subject-row-reverse' : '';
    const linkUrl = `/learning/workers/${sub.slug}`;

    return `
      <article class="subject-editorial-row ${isReverse}">
        <div class="subject-row-content">
          <div class="subject-index-header">
            <span class="subject-num">${numStr}</span>
            <span class="subject-meta-pill">Manufacturing Department</span>
          </div>
          <h2 class="subject-row-title">${sub.name}</h2>
          <p class="subject-row-desc">
            ${sub.description || 'Footwear operational processes and manufacturing techniques.'}
          </p>
          <div class="subject-processes-preview">
            <span class="preview-label">Operations:</span>
            <div class="preview-chips-row">
              <span class="chip">${sub.name} Core Process</span>
              <span class="chip">SOP &amp; Safety</span>
              <span class="chip">Quality Check</span>
            </div>
          </div>
          <div class="subject-row-action">
            <a href="${linkUrl}" class="btn btn-primary">
              <span>Explore ${sub.name}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </a>
          </div>
        </div>
        <div class="subject-row-media">
          <img src="${sub.image_path || '/images/fusion-stitching.jpg'}" alt="${sub.name} footwear manufacturing operations" loading="lazy" />
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="learning-page-wrapper">
      ${breadcrumbs}

      <!-- Header -->
      <section class="learning-hero-header">
        <div class="container">
          <div class="learning-header-content">
            <span class="learning-eyebrow-pill">WORKERS TRAINING PROGRAMME</span>
            <h1 class="learning-page-title">Manufacturing Training</h1>
            <p class="learning-page-description">
              Explore footwear manufacturing processes and understand the specific operations involved in stitching, lasting, assembling, and finishing quality shoes.
            </p>
          </div>
        </div>
      </section>

      <!-- Department Rows -->
      <section class="workers-subjects-section">
        <div class="container">
          <div class="subjects-editorial-stack">
            ${subjectsHtml}
          </div>
        </div>
      </section>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 4. SUBJECT DETAIL PAGE (Module Listings for Stitching, Assembly, Cutting)
// -----------------------------------------------------------------------------
export function renderSubjectDetailPage(subject, modulesList = null) {
  if (!subject) return '<div class="container py-12">Department not found.</div>';

  const breadcrumbs = renderBreadcrumbs([
    { label: 'Home', url: '/' },
    { label: 'Learning Centre', url: '/learning' },
    { label: 'Workers', url: '/learning/workers' },
    { label: subject.name, url: `/learning/workers/${subject.slug}` }
  ]);

  const rawModules = modulesList || subject.modules || [];
  // Only display published modules on public portal
  const publishedModules = rawModules.filter(m => m.status === 'published' || m.status === undefined);

  let modulesHtml = '';
  if (publishedModules.length === 0) {
    modulesHtml = `
      <div class="empty-modules-notice" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 48px 24px; text-align: center;">
        <span class="learning-eyebrow-pill" style="margin-bottom: 12px; display: inline-block;">CURRICULUM IN PREPARATION</span>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Training Modules Coming Soon</h3>
        <p style="font-size: 0.9375rem; color: #64748b; max-width: 520px; margin: 0 auto 24px;">
          The ${subject.name} curriculum modules are currently in draft review by the HR Training team. Authorized administrators can publish them in the Admin Panel.
        </p>
        <a href="/admin/modules" class="btn btn-outline-sm">Open Admin Module CMS</a>
      </div>
    `;
  } else {
    modulesHtml = publishedModules.map((mod, idx) => {
      const numFormatted = String(mod.display_order || idx + 1).padStart(2, '0');
      const courseUrl = `/learning/workers/${subject.slug}/${mod.slug}`;

      return `
        <div class="module-editorial-card">
          <div class="module-card-left">
            <span class="module-card-number">${numFormatted}</span>
            <div class="module-card-info">
              <h3 class="module-card-title">${mod.title}</h3>
              <p class="module-card-summary">${mod.description || mod.shortDesc || 'Comprehensive operating instruction and demonstration.'}</p>
            </div>
          </div>
          <div class="module-card-right">
            <div class="module-card-meta">
              <span class="meta-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Video Tutorial</span>
              <span class="meta-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> Knowledge Check</span>
            </div>
            <a href="${courseUrl}" class="btn btn-outline-sm module-view-btn">
              <span>View Module</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  return `
    <div class="learning-page-wrapper">
      ${breadcrumbs}

      <!-- Subject Header -->
      <section class="learning-hero-header">
        <div class="container">
          <div class="learning-header-content">
            <span class="learning-eyebrow-pill">WORKER TRAINING / ${subject.name.toUpperCase()}</span>
            <h1 class="learning-page-title">${subject.name} Department</h1>
            <p class="learning-page-description">${subject.description || 'Master standard operating procedures and technical processes.'}</p>
          </div>
        </div>
      </section>

      <!-- Modules Listing -->
      <section class="modules-listing-section">
        <div class="container">
          <div class="modules-section-meta">
            <h2 class="modules-section-heading">Department Curriculum</h2>
            <span class="modules-count-badge">${publishedModules.length} Active Modules</span>
          </div>

          <div class="modules-list-container">
            ${modulesHtml}
          </div>
        </div>
      </section>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 5. COURSE DETAIL PAGE (TV-First Player, SOPs, Knowledge Check)
// -----------------------------------------------------------------------------
export function renderCourseDetailPage(subjectOrCategory, moduleData, quizData = null) {
  if (!moduleData) return '<div class="container py-12">Module not found.</div>';

  const isStaff = subjectOrCategory.slug === 'staff' || subjectOrCategory.id === 'staff';
  const subjectName = subjectOrCategory.name || (isStaff ? 'Staff' : 'Manufacturing');
  const subjectRoute = isStaff ? '/learning/staff' : `/learning/workers/${subjectOrCategory.slug}`;
  const numFormatted = String(moduleData.display_order || 1).padStart(2, '0');

  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Learning Centre', url: '/learning' }
  ];
  if (isStaff) {
    breadcrumbItems.push({ label: 'Staff', url: '/learning/staff' });
  } else {
    breadcrumbItems.push({ label: 'Workers', url: '/learning/workers' });
    breadcrumbItems.push({ label: subjectName, url: subjectRoute });
  }
  breadcrumbItems.push({ label: moduleData.title, url: `${subjectRoute}/${moduleData.slug}` });
  const breadcrumbs = renderBreadcrumbs(breadcrumbItems);

  // Parse objectives & instructions
  const objectives = Array.isArray(moduleData.learning_objectives) ? moduleData.learning_objectives : [];
  const instructions = Array.isArray(moduleData.instructions) ? moduleData.instructions : [];

  const objectivesHtml = objectives.length ? objectives.map(obj => `
    <li>
      <span class="check-bullet"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#1e40af" stroke-width="2.2"><path d="M4 10l4 4 8-8"/></svg></span>
      <span>${obj}</span>
    </li>
  `).join('') : '<li><span>Master the operational procedures and safety requirements for this station.</span></li>';

  const instructionsHtml = instructions.length ? instructions.map(inst => `
    <li>
      <span class="bullet-dot">•</span>
      <span>${inst}</span>
    </li>
  `).join('') : '<li><span>Ensure adherence to designated personal protective equipment and machine guards.</span></li>';

  // Video resolution
  const ytId = moduleData.youtube_video_id || dbService.extractYouTubeId(moduleData.youtube_url || '');

  // Render Quiz Questions safely (No is_correct exposed!)
  let quizSectionHtml = '';
  if (quizData && quizData.questions && quizData.questions.length > 0) {
    const questionsHtml = quizData.questions.map((q, qIndex) => {
      const qNum = qIndex + 1;
      const optionsHtml = q.options.map((opt, optIndex) => `
        <label class="quiz-option-label" data-qid="${q.id}" data-optid="${opt.id}">
          <input type="radio" name="quiz_q_${q.id}" value="${opt.id}" class="quiz-radio-input" />
          <span class="quiz-option-radio-mark"></span>
          <span class="quiz-option-text">${opt.option_text}</span>
        </label>
      `).join('');

      return `
        <div class="quiz-question-card" id="quizQuestion_${q.id}" data-question-id="${q.id}">
          <div class="question-header">
            <span class="question-index-pill">Question ${qNum} of ${quizData.questions.length}</span>
          </div>
          <h4 class="question-title">${q.question_text}</h4>
          <div class="question-options-list">
            ${optionsHtml}
          </div>
          <div class="quiz-feedback-box" id="quizFeedback_${q.id}" style="display: none;"></div>
        </div>
      `;
    }).join('');

    quizSectionHtml = `
      <section class="knowledge-check-section" id="knowledgeCheck">
        <div class="container">
          <div class="quiz-wrapper-card">
            <div class="quiz-header-area">
              <div class="quiz-badge-wrap">
                <span class="tag tag-blue">PRACTICAL ASSESSMENT</span>
              </div>
              <h2 class="quiz-main-title">${quizData.title || 'Knowledge Check'}</h2>
              <p class="quiz-sub-desc">
                ${quizData.description || 'Test your understanding of this training session. Review the question scenarios carefully and select the best answer for each question.'}
              </p>
            </div>

            <!-- Quiz Questions Form -->
            <form id="courseQuizForm" class="quiz-form-body" data-quiz-id="${quizData.id}">
              <div class="quiz-questions-stack">
                ${questionsHtml}
              </div>

              <div class="quiz-action-bar">
                <button type="button" id="submitQuizBtn" class="btn btn-primary btn-lg quiz-submit-btn">
                  Submit Answers
                </button>
                <div id="quizResultBanner" class="quiz-result-banner" style="display: none;"></div>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  } else {
    quizSectionHtml = `
      <section class="knowledge-check-section" id="knowledgeCheck">
        <div class="container">
          <div class="quiz-wrapper-card" style="text-align: center; padding: 40px 24px;">
            <div class="quiz-badge-wrap" style="justify-content: center;">
              <span class="tag tag-subtle">ASSESSMENT PENDING</span>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 12px 0 8px;">Knowledge Check in Preparation</h3>
            <p style="font-size: 0.875rem; color: #64748b; max-width: 500px; margin: 0 auto;">
              The practical knowledge assessment for this training module is currently being finalized by the HR department.
            </p>
          </div>
        </div>
      </section>
    `;
  }

  return `
    <div class="learning-page-wrapper course-detail-page">
      ${breadcrumbs}

      <!-- Course Header -->
      <section class="course-header-section">
        <div class="container">
          <div class="course-header-box">
            <div class="course-eyebrow-row">
              <span class="course-eyebrow">${subjectName.toUpperCase()} · MODULE ${numFormatted}</span>
              <span class="course-department-tag">${subjectName}</span>
            </div>
            <h1 class="course-main-title">${moduleData.title}</h1>
            <p class="course-main-desc">
              ${moduleData.description || moduleData.shortDesc || 'Explore the process and understand the operations involved in this stage of footwear manufacturing.'}
            </p>
          </div>
        </div>
      </section>

      <!-- Video Player Section (TV-First Large Screen Focus) -->
      <section class="course-video-section">
        <div class="container">
          <div class="tv-video-container">
            <div class="video-player-frame" id="videoContainer" data-video-id="${ytId}">
              <div class="video-placeholder-backdrop">
                <img src="${moduleData.thumbnail_path || subjectOrCategory.image_path || '/images/fusion-stitching.jpg'}" alt="${moduleData.title} training demonstration" class="video-poster-img" />
                <div class="video-overlay-gradient"></div>
                <div class="video-play-center" id="playVideoBtn" role="button" aria-label="Play training demonstration video">
                  <div class="video-play-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <span class="video-play-label">${ytId ? 'Play Training Video (16:9 HD)' : 'Training Video In Preparation'}</span>
                </div>
                <div class="video-info-bar">
                  <span class="video-tag">Fusionsole Production Masterclass</span>
                  <span class="video-title-overlay">${moduleData.title} · Standard Operating Procedure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Course Information: About This Process -->
      <section class="course-info-section">
        <div class="container">
          <div class="course-info-grid">
            
            <div class="course-info-main">
              <h2 class="course-section-title">About This Process</h2>
              <p class="course-overview-p">${moduleData.overview || moduleData.description || 'Detailed operational guidance for this manufacturing process.'}</p>

              <div class="course-sub-block">
                <h3 class="course-sub-heading">Learning Objectives</h3>
                <ul class="course-objectives-list">
                  ${objectivesHtml}
                </ul>
              </div>

              <div class="course-sub-block">
                <h3 class="course-sub-heading">Important Instructions &amp; Safety</h3>
                <ul class="course-instructions-list">
                  ${instructionsHtml}
                </ul>
              </div>
            </div>

            <div class="course-info-sidebar">
              <div class="course-meta-sidebar-card">
                <h3 class="sidebar-meta-title">Module Summary</h3>
                <div class="meta-row-item">
                  <span class="meta-item-label">Department</span>
                  <span class="meta-item-value">${subjectName}</span>
                </div>
                <div class="meta-row-item">
                  <span class="meta-item-label">Module Sequence</span>
                  <span class="meta-item-value">#${numFormatted}</span>
                </div>
                <div class="meta-row-item">
                  <span class="meta-item-label">Delivery Format</span>
                  <span class="meta-item-value">Video &amp; Practical Assessment</span>
                </div>
                <div class="meta-row-item">
                  <span class="meta-item-label">Verification</span>
                  <span class="meta-item-value">Knowledge Check Required</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Knowledge Check Assessment Section -->
      ${quizSectionHtml}

      <!-- Module Navigation: Return to Department -->
      <section class="module-nav-section">
        <div class="container">
          <div class="module-nav-bar" style="justify-content: center;">
            <div class="nav-center-wrap">
              <a href="${subjectRoute}" class="btn btn-outline-sm back-to-subject-btn">
                <span>← Back to ${subjectName} Curriculum</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}
