/**
 * Fusionsole Learning Platform - Main Application Controller & Router
 * Connects the public Learning Centre to the database service layer and provides
 * a full enterprise Admin Panel (CMS) for managing Categories, Subjects, Modules, Quizzes, and HR Team.
 */

import { dbService } from './supabase.js';
import {
  renderLearningCenterPage,
  renderStaffLandingPage,
  renderWorkersLandingPage,
  renderSubjectDetailPage,
  renderCourseDetailPage
} from './learning-components.js';

import {
  renderAdminShell,
  renderDashboardOverview,
  renderCategoriesList,
  renderSubjectsList,
  renderModulesList,
  renderModuleEditor,
  renderQuizzesList,
  renderQuizBuilder,
  renderTeamManagement,
  renderSettingsView,
  renderAdminLogin
} from './admin-components.js';

document.addEventListener('DOMContentLoaded', async () => {
  // -----------------------------------------------------------
  // 1. Core DOM Views & Navigation
  // -----------------------------------------------------------
  const homeView = document.getElementById('home-view');
  const learningView = document.getElementById('learning-view');
  const adminView = document.getElementById('admin-view');
  const siteHeader = document.getElementById('header');
  const siteFooter = document.getElementById('contact');
  const mainNav = document.querySelector('.main-navigation');
  const mobileBtn = document.getElementById('mobileMenuBtn');

  // Filter state for modules listing
  let moduleFilters = {
    search: '',
    categoryId: '',
    subjectId: '',
    status: ''
  };

  // -----------------------------------------------------------
  // 2. Program Accordion for Homepage Section 5
  // -----------------------------------------------------------
  const programData = {
    induction: {
      title: 'Staff Induction',
      desc: 'An introduction to Fusionsole, the workplace environment, company practices and essential information for newly joined staff.',
      image: '/images/fusion-moulds.jpg',
      alt: 'Fusionsole workplace environment and footwear lasting moulds',
      url: '/learning/staff'
    },
    cutting: {
      title: 'Cutting Department',
      desc: 'An introduction to material preparation, cutting operations and the processes involved in preparing footwear components.',
      image: '/images/fusion-moulds.jpg',
      alt: 'Footwear component patterns and preparation',
      url: '/learning/workers/cutting'
    },
    stitching: {
      title: 'Stitching Department',
      desc: 'Understand stitching operations, equipment, component joining and the importance of quality throughout the process.',
      image: '/images/fusion-stitching.jpg',
      alt: 'Footwear upper stitching operation on industrial machinery',
      url: '/learning/workers/stitching'
    },
    lasting: {
      title: 'Lasting Department',
      desc: 'Learn about shoe shaping, lasting operations and the processes involved in forming the footwear structure.',
      image: '/images/fusion-lasting.jpg',
      alt: 'Shoe lasting and sole bonding craftsmanship',
      url: '/learning/workers/assembly'
    },
    finishing: {
      title: 'Finishing & Packing',
      desc: 'Understand the finishing process, quality inspection, product presentation and packaging procedures.',
      image: '/images/fusion-lasting.jpg',
      alt: 'Footwear finishing and quality inspection',
      url: '/learning/workers/assembly'
    }
  };

  const accordionItems = document.querySelectorAll('.accordion-item');
  const programTitle = document.getElementById('programTitle');
  const programDesc = document.getElementById('programDesc');
  const programImage = document.getElementById('programImage');
  const programDetailBtn = document.getElementById('programDetailBtn');

  accordionItems.forEach(item => {
    item.addEventListener('click', () => {
      const programKey = item.getAttribute('data-program');
      if (!programKey || !programData[programKey]) return;

      accordionItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const data = programData[programKey];
      if (programTitle) programTitle.textContent = data.title;
      if (programDesc) programDesc.textContent = data.desc;
      if (programImage) {
        programImage.src = data.image;
        programImage.alt = data.alt;
      }
      if (programDetailBtn) {
        programDetailBtn.setAttribute('href', data.url);
      }
    });
  });

  // Mobile Navigation Menu Toggle
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      mainNav.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileBtn.contains(e.target) && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
      }
    });
  }

  // -----------------------------------------------------------
  // 3. Client-Side Router
  // -----------------------------------------------------------
  async function handleRoute() {
    try {
      let rawPath = window.location.pathname.toLowerCase().trim();
      if (rawPath.length > 1 && rawPath.endsWith('/')) {
        rawPath = rawPath.slice(0, -1);
      }

      const parts = rawPath.split('/').filter(Boolean);

      // =========================================================
      // ROUTE GROUP A: ADMIN PANEL (/admin/*)
      // =========================================================
      if (parts.length > 0 && parts[0] === 'admin') {
        // Hide public site headers/footers for focused enterprise experience
        if (siteHeader) siteHeader.style.display = 'none';
        if (siteFooter) siteFooter.style.display = 'none';
        if (homeView) homeView.style.display = 'none';
        if (learningView) learningView.style.display = 'none';
        if (adminView) {
          adminView.style.display = 'block';
        }

        // Route: /admin/login
        if (parts.length === 2 && parts[1] === 'login') {
          adminView.innerHTML = renderAdminLogin();
          document.title = 'Sign In · Fusionsole Admin Portal';
          bindAdminLoginInteractions();
          return;
        }

        // Check Authentication
        const currentUser = await dbService.getCurrentUser();

        // If not authenticated or not active, redirect to /admin/login
        if (!currentUser || !currentUser.is_active) {
          const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.history.pushState({}, '', `/admin/login?redirect=${redirectUrl}`);
          handleRoute();
          return;
        }

      // Route: /admin or /admin/overview
      if (parts.length === 1 || (parts.length === 2 && parts[1] === 'overview')) {
        const stats = await dbService.getDashboardStats();
        adminView.innerHTML = renderAdminShell('overview', renderDashboardOverview(stats), [
          { label: 'Overview', url: '/admin' }
        ]);
        document.title = 'Admin Operations Dashboard · Fusionsole';
        bindAdminShellInteractions();
        bindDashboardInteractions();
        return;
      }

      // Route: /admin/categories
      if (parts.length === 2 && parts[1] === 'categories') {
        const categories = await dbService.getCategories();
        adminView.innerHTML = renderAdminShell('categories', renderCategoriesList(categories), [
          { label: 'Categories', url: '/admin/categories' }
        ]);
        document.title = 'Categories Management · Fusionsole Admin';
        bindAdminShellInteractions();
        bindCategoriesInteractions();
        return;
      }

      // Route: /admin/subjects
      if (parts.length === 2 && parts[1] === 'subjects') {
        const subjects = await dbService.getSubjects();
        const categories = await dbService.getCategories();
        adminView.innerHTML = renderAdminShell('subjects', renderSubjectsList(subjects, categories), [
          { label: 'Subjects', url: '/admin/subjects' }
        ]);
        document.title = 'Manufacturing Subjects · Fusionsole Admin';
        bindAdminShellInteractions();
        bindSubjectsInteractions();
        return;
      }

      // Route: /admin/modules/new (Create Module)
      if (parts.length === 3 && parts[1] === 'modules' && parts[2] === 'new') {
        const categories = await dbService.getCategories();
        const subjects = await dbService.getSubjects();
        adminView.innerHTML = renderAdminShell('modules', renderModuleEditor({}, categories, subjects), [
          { label: 'Modules', url: '/admin/modules' },
          { label: 'New Module', url: '/admin/modules/new' }
        ]);
        document.title = 'Create Training Module · Fusionsole Admin';
        bindAdminShellInteractions();
        bindModuleEditorInteractions();
        return;
      }

      // Route: /admin/modules/:id/edit (Edit Module)
      if (parts.length === 4 && parts[1] === 'modules' && parts[3] === 'edit') {
        const moduleId = parts[2];
        const moduleData = await dbService.getModuleById(moduleId);
        if (!moduleData) {
          alert('Module record not found.');
          window.history.pushState({}, '', '/admin/modules');
          handleRoute();
          return;
        }
        const categories = await dbService.getCategories();
        const subjects = await dbService.getSubjects();
        adminView.innerHTML = renderAdminShell('modules', renderModuleEditor(moduleData, categories, subjects), [
          { label: 'Modules', url: '/admin/modules' },
          { label: `Edit: ${moduleData.title}`, url: `/admin/modules/${moduleId}/edit` }
        ]);
        document.title = `Edit ${moduleData.title} · Fusionsole Admin`;
        bindAdminShellInteractions();
        bindModuleEditorInteractions();
        return;
      }

      // Route: /admin/modules (Module Listing)
      if (parts.length === 2 && parts[1] === 'modules') {
        // Read URL query params if any
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('status')) moduleFilters.status = urlParams.get('status');

        const modules = await dbService.getModules(moduleFilters);
        const categories = await dbService.getCategories();
        const subjects = await dbService.getSubjects();
        adminView.innerHTML = renderAdminShell('modules', renderModulesList(modules, categories, subjects, moduleFilters), [
          { label: 'Training Modules', url: '/admin/modules' }
        ]);
        document.title = 'Training Modules Management · Fusionsole Admin';
        bindAdminShellInteractions();
        bindModulesListInteractions();
        return;
      }

      // Route: /admin/quizzes/new (Create Quiz)
      if (parts.length === 3 && parts[1] === 'quizzes' && parts[2] === 'new') {
        const modules = await dbService.getModules();
        adminView.innerHTML = renderAdminShell('quizzes', renderQuizBuilder({}, modules), [
          { label: 'Quizzes', url: '/admin/quizzes' },
          { label: 'New Assessment', url: '/admin/quizzes/new' }
        ]);
        document.title = 'Create Quiz Assessment · Fusionsole Admin';
        bindAdminShellInteractions();
        bindQuizBuilderInteractions();
        return;
      }

      // Route: /admin/quizzes/module/:moduleId (Quiz by Module ID)
      if (parts.length === 4 && parts[1] === 'quizzes' && parts[2] === 'module') {
        const moduleId = parts[3];
        const existingQuiz = await dbService.getQuizByModuleId(moduleId, true);
        const modules = await dbService.getModules();
        const targetModule = modules.find(m => m.id === moduleId);

        const initialQuizData = existingQuiz || {
          module_id: moduleId,
          title: targetModule ? `${targetModule.title} Knowledge Check` : 'Knowledge Check',
          description: 'Assess key competencies and safety standards.',
          is_published: false
        };

        adminView.innerHTML = renderAdminShell('quizzes', renderQuizBuilder(initialQuizData, modules), [
          { label: 'Quizzes', url: '/admin/quizzes' },
          { label: targetModule ? targetModule.title : 'Module Quiz', url: '#' }
        ]);
        document.title = 'Configure Quiz Assessment · Fusionsole Admin';
        bindAdminShellInteractions();
        bindQuizBuilderInteractions(existingQuiz?.questions || []);
        return;
      }

      // Route: /admin/quizzes/:id/edit (Edit Quiz)
      if (parts.length === 4 && parts[1] === 'quizzes' && parts[3] === 'edit') {
        const quizId = parts[2];
        const quizData = await dbService.getQuizById(quizId);
        if (!quizData) {
          alert('Quiz not found.');
          window.history.pushState({}, '', '/admin/quizzes');
          handleRoute();
          return;
        }
        const modules = await dbService.getModules();
        adminView.innerHTML = renderAdminShell('quizzes', renderQuizBuilder(quizData, modules), [
          { label: 'Quizzes', url: '/admin/quizzes' },
          { label: `Edit: ${quizData.title}`, url: `/admin/quizzes/${quizId}/edit` }
        ]);
        document.title = `Edit Quiz · Fusionsole Admin`;
        bindAdminShellInteractions();
        bindQuizBuilderInteractions(quizData.questions || []);
        return;
      }

      // Route: /admin/quizzes (Quiz Listing)
      if (parts.length === 2 && parts[1] === 'quizzes') {
        const quizzes = await dbService.getQuizzes();
        adminView.innerHTML = renderAdminShell('quizzes', renderQuizzesList(quizzes), [
          { label: 'Knowledge Quizzes', url: '/admin/quizzes' }
        ]);
        document.title = 'Knowledge Quizzes · Fusionsole Admin';
        bindAdminShellInteractions();
        bindQuizzesListInteractions();
        return;
      }

      // Route: /admin/team (HR Team Management)
      if (parts.length === 2 && parts[1] === 'team') {
        const team = await dbService.getTeamMembers();
        adminView.innerHTML = renderAdminShell('team', renderTeamManagement(team), [
          { label: 'HR Team', url: '/admin/team' }
        ]);
        document.title = 'HR Team Access Control · Fusionsole Admin';
        bindAdminShellInteractions();
        bindTeamInteractions();
        return;
      }

      // Route: /admin/settings (System & Supabase Settings)
      if (parts.length === 2 && parts[1] === 'settings') {
        adminView.innerHTML = renderAdminShell('settings', renderSettingsView(), [
          { label: 'Settings', url: '/admin/settings' }
        ]);
        document.title = 'Platform Settings · Fusionsole Admin';
        bindAdminShellInteractions();
        bindSettingsInteractions();
        return;
      }

      // Fallback Admin
      window.history.pushState({}, '', '/admin');
      handleRoute();
      return;
    }

    // =========================================================
    // PUBLIC CONSUMER PORTAL & LEARNING CENTRE
    // =========================================================
    if (siteHeader) siteHeader.style.display = 'block';
    if (siteFooter) siteFooter.style.display = 'block';
    if (adminView) {
      adminView.style.display = 'none';
      adminView.innerHTML = '';
    }

    // Update header login button based on auth state
    const authUser = await dbService.getCurrentUser();
    const loginBtn = document.querySelector('.header-actions .login-btn');
    if (loginBtn) {
      if (authUser && authUser.is_active) {
        loginBtn.textContent = 'Admin Portal';
        loginBtn.href = '/admin';
      } else {
        loginBtn.textContent = 'Log in';
        loginBtn.href = '/admin/login';
      }
    }

    // Route: Homepage ("/" or empty) - Fully public
    if (parts.length === 0 || parts[0] !== 'learning') {
      if (homeView) homeView.style.display = 'block';
      if (learningView) {
        learningView.style.display = 'none';
        learningView.innerHTML = '';
      }
      document.title = 'Fusionsole · Footwear Manufacturing Learning Platform';
      
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 50);
        }
      }
      return;
    }

    // All routes under /learning - Require authenticated, active HR account
    if (!authUser || !authUser.is_active) {
      const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.history.pushState({}, '', `/admin/login?redirect=${redirectUrl}`);
      handleRoute();
      return;
    }

    if (homeView) homeView.style.display = 'none';
    if (learningView) learningView.style.display = 'block';

    // Route: /learning
    if (parts.length === 1 && parts[0] === 'learning') {
      const activeCats = await dbService.getCategories(true);
      learningView.innerHTML = renderLearningCenterPage(activeCats);
      document.title = 'Learning Centre · Fusionsole';
      return;
    }

    // Route: /learning/staff
    if (parts.length === 2 && parts[0] === 'learning' && parts[1] === 'staff') {
      const staffModule = await dbService.getModuleBySlug('staff-induction');
      learningView.innerHTML = renderStaffLandingPage(staffModule);
      document.title = 'Staff Induction · Fusionsole Learning Centre';
      return;
    }

    // Route: /learning/staff/:slug
    if (parts.length === 3 && parts[0] === 'learning' && parts[1] === 'staff') {
      const slug = parts[2];
      const moduleData = await dbService.getModuleBySlug(slug);
      if (!moduleData) {
        renderNotFound(`Induction module "${slug}" was not found.`);
        return;
      }
      const staffCat = { id: 'staff', name: 'Staff', slug: 'staff', image_path: '/images/fusion-moulds.jpg' };
      const quizData = await dbService.getQuizByModuleId(moduleData.id, false);
      learningView.innerHTML = renderCourseDetailPage(staffCat, moduleData, quizData);
      document.title = `${moduleData.title} · Staff Induction · Fusionsole`;
      bindCoursePageInteractions(quizData);
      return;
    }

    // Route: /learning/workers
    if (parts.length === 2 && parts[0] === 'learning' && parts[1] === 'workers') {
      const activeSubs = await dbService.getSubjects(true);
      learningView.innerHTML = renderWorkersLandingPage(activeSubs);
      document.title = 'Workers Training Programme · Fusionsole';
      return;
    }

    // Route: /learning/workers/:subject
    if (parts.length === 3 && parts[0] === 'learning' && parts[1] === 'workers') {
      const subjectSlug = parts[2];
      const subject = await dbService.getSubjectBySlug(subjectSlug);
      if (subject) {
        const modules = await dbService.getModules({ subjectId: subject.id, status: 'published' });
        learningView.innerHTML = renderSubjectDetailPage(subject, modules);
        document.title = `${subject.name} Department Modules · Fusionsole`;
      } else {
        renderNotFound(`Department "${subjectSlug}" was not found.`);
      }
      return;
    }

    // Route: /learning/workers/:subject/:slug
    if (parts.length === 4 && parts[0] === 'learning' && parts[1] === 'workers') {
      const subjectSlug = parts[2];
      const moduleSlug = parts[3];
      const subject = await dbService.getSubjectBySlug(subjectSlug);
      const moduleData = await dbService.getModuleBySlug(moduleSlug);

      if (subject && moduleData) {
        const quizData = await dbService.getQuizByModuleId(moduleData.id, false);
        learningView.innerHTML = renderCourseDetailPage(subject, moduleData, quizData);
        document.title = `${moduleData.title} · ${subject.name} · Fusionsole`;
        bindCoursePageInteractions(quizData);
      } else {
        renderNotFound(`The requested module "${moduleSlug}" was not found in ${subjectSlug}.`);
      }
      return;
    }

    // Fallback 404
    renderNotFound('The requested learning resource was not found.');
    } catch (err) {
      console.error('Route error:', err);
      renderDbError(err);
    }
  }

  function renderDbError(err) {
    const errorMsg = err.message || 'Unable to connect to the Supabase database.';
    const container = adminView && adminView.style.display !== 'none' ? adminView : (learningView || document.getElementById('main-content'));
    if (!container) return;

    if (siteHeader) siteHeader.style.display = 'block';
    if (siteFooter) siteFooter.style.display = 'block';
    if (homeView) homeView.style.display = 'none';
    if (adminView && container !== adminView) adminView.style.display = 'none';
    if (learningView && container !== learningView) learningView.style.display = 'none';
    container.style.display = 'block';

    container.innerHTML = `
      <div class="db-error-banner-container">
        <div class="db-error-card">
          <div class="db-error-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 class="db-error-title">Database Connection Required</h2>
          <p class="db-error-message">
            ${errorMsg}
          </p>
          <div class="db-error-actions">
            <button onclick="window.location.reload()" class="btn btn-primary">Retry Connection</button>
            <a href="/" class="btn btn-secondary">Return to Homepage</a>
          </div>
        </div>
      </div>
    `;
    document.title = 'Database Connection Error · Fusionsole';
  }

  function renderNotFound(message) {
    if (learningView) {
      learningView.innerHTML = `
        <div class="learning-page-wrapper">
          <div class="container" style="padding: 100px 24px; text-align: center;">
            <span class="learning-eyebrow-pill">PAGE NOT FOUND</span>
            <h1 class="learning-page-title" style="margin-top: 16px;">Learning Resource Not Found</h1>
            <p class="learning-page-description" style="margin: 0 auto 32px; max-width: 520px;">
              ${message}
            </p>
            <a href="/learning" class="btn btn-primary btn-lg">Back to Learning Centre</a>
          </div>
        </div>
      `;
    }
  }

  // -----------------------------------------------------------
  // 4. Learner Course Page Interactivity (Video & Secure Quiz)
  // -----------------------------------------------------------
  function bindCoursePageInteractions(quizData) {
    // Video Embed
    const playBtn = document.getElementById('playVideoBtn');
    const videoContainer = document.getElementById('videoContainer');
    if (playBtn && videoContainer) {
      playBtn.addEventListener('click', () => {
        const ytId = videoContainer.getAttribute('data-video-id');
        if (ytId) {
          videoContainer.innerHTML = `
            <iframe 
              class="video-iframe-embed" 
              src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1" 
              title="Fusionsole Footwear Training Video" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          `;
        } else {
          alert('Training video demonstration is currently being prepared by the HR team.');
        }
      });
    }

    // Radio selection UI enhancement
    const quizLabels = document.querySelectorAll('.quiz-option-label');
    quizLabels.forEach(label => {
      label.addEventListener('click', function() {
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        const parentList = this.closest('.question-options-list');
        if (parentList) {
          parentList.querySelectorAll('.quiz-option-label').forEach(l => l.classList.remove('is-selected'));
          this.classList.add('is-selected');
        }
      });
    });

    // Secure Quiz Submission
    const submitBtn = document.getElementById('submitQuizBtn');
    const quizForm = document.getElementById('courseQuizForm');
    const resultBanner = document.getElementById('quizResultBanner');

    if (submitBtn && quizForm && quizData) {
      submitBtn.addEventListener('click', async () => {
        const quizId = quizForm.getAttribute('data-quiz-id');
        const questionCards = quizForm.querySelectorAll('.quiz-question-card');
        const answers = [];

        // Check completion
        for (const card of questionCards) {
          const qId = card.getAttribute('data-question-id');
          const checkedRadio = card.querySelector(`input[name="quiz_q_${qId}"]:checked`);
          if (!checkedRadio) {
            alert(`Please complete all assessment questions before submitting.`);
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
          answers.push({
            question_id: qId,
            selected_option_id: checkedRadio.value
          });
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Evaluating Answers...';

        try {
          // Call database evaluation (server-side RPC or secure local evaluator)
          const evalResult = await dbService.evaluateQuiz(quizId, answers);

          // Render Feedback for each question
          evalResult.results.forEach(res => {
            const card = document.getElementById(`quizQuestion_${res.question_id}`);
            if (!card) return;

            const options = card.querySelectorAll('.quiz-option-label');
            const feedbackBox = document.getElementById(`quizFeedback_${res.question_id}`);

            options.forEach(opt => {
              opt.classList.remove('is-selected', 'is-correct', 'is-incorrect');
              const optId = opt.getAttribute('data-optid');
              if (optId === res.correct_option_id) {
                opt.classList.add('is-correct');
              } else if (optId === res.selected_option_id && !res.is_correct) {
                opt.classList.add('is-incorrect');
              }
            });

            if (feedbackBox) {
              feedbackBox.style.display = 'block';
              if (res.is_correct) {
                feedbackBox.className = 'quiz-feedback-box is-correct';
                feedbackBox.innerHTML = `<strong>✓ Correct:</strong> ${res.explanation || 'Operational standard verified.'}`;
              } else {
                feedbackBox.className = 'quiz-feedback-box is-incorrect';
                feedbackBox.innerHTML = `<strong>✕ Incorrect:</strong> ${res.explanation || 'Please review standard operating procedures.'}`;
              }
            }
          });

          // Display Score Banner
          if (resultBanner) {
            resultBanner.style.display = 'block';
            resultBanner.className = `quiz-result-banner ${evalResult.passed ? 'passed' : 'failed'}`;
            resultBanner.innerHTML = `
              <div class="quiz-result-score">${evalResult.correct_count} / ${evalResult.total_questions} Correct (${evalResult.score_percentage}%)</div>
              <p class="quiz-result-text">
                ${evalResult.feedback}
              </p>
              <button type="button" id="retakeBtn" class="btn btn-outline-sm retake-btn" style="margin-top: 12px;">
                Retake Assessment
              </button>
            `;

            document.getElementById('retakeBtn')?.addEventListener('click', () => {
              quizForm.reset();
              resultBanner.style.display = 'none';
              questionCards.forEach(c => {
                c.querySelectorAll('.quiz-option-label').forEach(opt => {
                  opt.classList.remove('is-selected', 'is-correct', 'is-incorrect');
                });
                const fBox = c.querySelector('.quiz-feedback-box');
                if (fBox) fBox.style.display = 'none';
              });
              questionCards[0]?.scrollIntoView({ behavior: 'smooth' });
            });

            resultBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } catch (err) {
          alert('Error evaluating assessment: ' + err.message);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Answers';
        }
      });
    }
  }

  // -----------------------------------------------------------
  // 5. Admin Panel Event Handlers & Interactivity
  // -----------------------------------------------------------
  function bindAdminShellInteractions() {
    const sidebar = document.getElementById('adminSidebar');
    const openBtn = document.getElementById('openSidebarBtn');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const logoutBtn = document.getElementById('adminLogoutBtn');

    if (openBtn && sidebar) {
      openBtn.addEventListener('click', () => sidebar.classList.add('is-open'));
    }
    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => sidebar.classList.remove('is-open'));
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await dbService.signOut();
        window.history.pushState({}, '', '/admin/login');
        handleRoute();
      });
    }

    // Populate user profile info in navbar
    dbService.getCurrentUser().then(user => {
      const nameEl = document.getElementById('adminNavUserName');
      const roleEl = document.getElementById('adminNavUserRole');
      if (nameEl && user) nameEl.textContent = user.full_name;
      if (roleEl && user) roleEl.textContent = user.role === 'admin' ? 'Administrator' : 'HR Staff';
    });
  }

  function bindAdminLoginInteractions() {
    const form = document.getElementById('adminLoginForm');
    const alertBox = document.getElementById('loginAlertBox');
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying credentials...';
        if (alertBox) alertBox.style.display = 'none';

        try {
          await dbService.signIn(email, password);
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get('redirect');
          const target = redirectParam ? decodeURIComponent(redirectParam) : '/admin';
          window.history.pushState({}, '', target);
          handleRoute();
        } catch (err) {
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.textContent = err.message || 'Invalid email or password.';
          }
        } finally {
          submitBtn.disabled = false;
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get('redirect');
          const isLearning = redirectParam && decodeURIComponent(redirectParam).startsWith('/learning');
          submitBtn.textContent = isLearning ? 'Sign In & Continue to Module' : 'Sign In to Admin Panel';
        }
      });
    }
  }

  function bindDashboardInteractions() {
    // Quick publish buttons
    document.querySelectorAll('.quick-publish-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        try {
          await dbService.saveModule({ id, status: 'published' });
          handleRoute();
        } catch (e) {
          alert('Failed to publish: ' + e.message);
        }
      });
    });
  }

  function bindCategoriesInteractions() {
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');
    const openBtn = document.getElementById('openCreateCatModalBtn');
    const closeBtn = document.getElementById('closeCatModalBtn');
    const cancelBtn = document.getElementById('cancelCatModalBtn');
    const modalTitle = document.getElementById('catModalTitle');

    const showModal = (cat = null) => {
      form.reset();
      if (cat) {
        modalTitle.textContent = 'Edit Category: ' + cat.name;
        document.getElementById('catId').value = cat.id;
        document.getElementById('catName').value = cat.name;
        document.getElementById('catSlug').value = cat.slug;
        document.getElementById('catDescription').value = cat.description || '';
        document.getElementById('catImagePath').value = cat.image_path || '';
        document.getElementById('catOrder').value = cat.display_order || 1;
        document.getElementById('catIsActive').checked = cat.is_active;
      } else {
        modalTitle.textContent = 'Add Category';
        document.getElementById('catId').value = '';
        document.getElementById('catOrder').value = 1;
        document.getElementById('catIsActive').checked = true;
      }
      modal.style.display = 'flex';
    };

    const hideModal = () => { modal.style.display = 'none'; };

    openBtn?.addEventListener('click', () => showModal());
    closeBtn?.addEventListener('click', hideModal);
    cancelBtn?.addEventListener('click', hideModal);

    // Edit button clicks
    document.querySelectorAll('.edit-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = JSON.parse(btn.getAttribute('data-cat'));
        showModal(cat);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-cat-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        if (confirm(`Are you sure you want to delete category "${name}"? Dependent content will be checked.`)) {
          try {
            await dbService.deleteCategory(id);
            handleRoute();
          } catch (err) {
            alert(err.message);
          }
        }
      });
    });

    // Save form submit
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('catId').value;
      const data = {
        name: document.getElementById('catName').value.trim(),
        slug: document.getElementById('catSlug').value.trim(),
        description: document.getElementById('catDescription').value.trim(),
        image_path: document.getElementById('catImagePath').value.trim(),
        display_order: Number(document.getElementById('catOrder').value) || 1,
        is_active: document.getElementById('catIsActive').checked
      };
      if (id) data.id = id;

      try {
        await dbService.saveCategory(data);
        hideModal();
        handleRoute();
      } catch (err) {
        alert('Failed to save category: ' + err.message);
      }
    });
  }

  function bindSubjectsInteractions() {
    const modal = document.getElementById('subjectModal');
    const form = document.getElementById('subjectForm');
    const openBtn = document.getElementById('openCreateSubModalBtn');
    const closeBtn = document.getElementById('closeSubModalBtn');
    const cancelBtn = document.getElementById('cancelSubModalBtn');
    const modalTitle = document.getElementById('subModalTitle');

    const showModal = (sub = null) => {
      form.reset();
      if (sub) {
        modalTitle.textContent = 'Edit Subject: ' + sub.name;
        document.getElementById('subId').value = sub.id;
        document.getElementById('subCategoryId').value = sub.category_id;
        document.getElementById('subName').value = sub.name;
        document.getElementById('subSlug').value = sub.slug;
        document.getElementById('subDescription').value = sub.description || '';
        document.getElementById('subImagePath').value = sub.image_path || '';
        document.getElementById('subOrder').value = sub.display_order || 1;
        document.getElementById('subIsActive').checked = sub.is_active;
      } else {
        modalTitle.textContent = 'Add Subject';
        document.getElementById('subId').value = '';
        document.getElementById('subOrder').value = 1;
        document.getElementById('subIsActive').checked = true;
      }
      modal.style.display = 'flex';
    };

    const hideModal = () => { modal.style.display = 'none'; };

    openBtn?.addEventListener('click', () => showModal());
    closeBtn?.addEventListener('click', hideModal);
    cancelBtn?.addEventListener('click', hideModal);

    document.querySelectorAll('.edit-sub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = JSON.parse(btn.getAttribute('data-sub'));
        showModal(sub);
      });
    });

    document.querySelectorAll('.delete-sub-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        if (confirm(`Are you sure you want to delete subject "${name}"? Modules assigned to it will prevent deletion.`)) {
          try {
            await dbService.deleteSubject(id);
            handleRoute();
          } catch (err) {
            alert(err.message);
          }
        }
      });
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('subId').value;
      const data = {
        category_id: document.getElementById('subCategoryId').value,
        name: document.getElementById('subName').value.trim(),
        slug: document.getElementById('subSlug').value.trim(),
        description: document.getElementById('subDescription').value.trim(),
        image_path: document.getElementById('subImagePath').value.trim(),
        display_order: Number(document.getElementById('subOrder').value) || 1,
        is_active: document.getElementById('subIsActive').checked
      };
      if (id) data.id = id;

      try {
        await dbService.saveSubject(data);
        hideModal();
        handleRoute();
      } catch (err) {
        alert('Failed to save subject: ' + err.message);
      }
    });
  }

  function bindModulesListInteractions() {
    const searchInput = document.getElementById('moduleSearchInput');
    const filterCat = document.getElementById('filterCategory');
    const filterSub = document.getElementById('filterSubject');
    const filterStatus = document.getElementById('filterStatus');
    const clearBtn = document.getElementById('clearModuleFiltersBtn');

    searchInput?.addEventListener('input', (e) => {
      moduleFilters.search = e.target.value;
      handleRoute();
    });

    filterCat?.addEventListener('change', (e) => {
      moduleFilters.categoryId = e.target.value;
      handleRoute();
    });

    filterSub?.addEventListener('change', (e) => {
      moduleFilters.subjectId = e.target.value;
      handleRoute();
    });

    filterStatus?.addEventListener('change', (e) => {
      moduleFilters.status = e.target.value;
      handleRoute();
    });

    clearBtn?.addEventListener('click', () => {
      moduleFilters = { search: '', categoryId: '', subjectId: '', status: '' };
      window.history.pushState({}, '', '/admin/modules');
      handleRoute();
    });

    // Toggle publish
    document.querySelectorAll('.toggle-publish-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const currentStatus = btn.getAttribute('data-status');
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        try {
          await dbService.saveModule({ id, status: newStatus });
          handleRoute();
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    });

    // Delete module
    document.querySelectorAll('.delete-module-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        if (confirm(`Are you sure you want to delete module "${title}"? This cannot be undone.`)) {
          try {
            await dbService.deleteModule(id);
            handleRoute();
          } catch (err) {
            alert('Error deleting: ' + err.message);
          }
        }
      });
    });
  }

  function bindModuleEditorInteractions() {
    const titleInput = document.getElementById('moduleTitle');
    const slugInput = document.getElementById('moduleSlug');
    const ytUrlInput = document.getElementById('moduleYtUrl');
    const ytIdInput = document.getElementById('moduleYtId');
    const ytPreviewContainer = document.getElementById('ytPreviewContainer');
    const catSelect = document.getElementById('moduleCategoryId');
    const subSelect = document.getElementById('moduleSubjectId');
    const subHelp = document.getElementById('subjectHelpText');
    const form = document.getElementById('moduleForm');

    // Auto-generate slug from title if slug not manually customized
    let slugTouched = Boolean(slugInput.value);
    slugInput?.addEventListener('input', () => { slugTouched = true; });
    titleInput?.addEventListener('input', (e) => {
      if (!slugTouched) {
        slugInput.value = e.target.value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    });

    // Live YouTube URL Validation & Preview
    ytUrlInput?.addEventListener('input', (e) => {
      const url = e.target.value;
      const extractedId = dbService.extractYouTubeId(url);
      ytIdInput.value = extractedId;

      if (extractedId) {
        ytPreviewContainer.innerHTML = `
          <div class="yt-preview-box">
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${extractedId}?rel=0&modestbranding=1" 
              title="YouTube Video Preview" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
            <div class="yt-preview-meta">
              <span class="badge badge-success">✓ Valid Video ID: ${extractedId}</span>
            </div>
          </div>
        `;
      } else {
        ytPreviewContainer.innerHTML = `
          <div class="yt-empty-preview">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            <span>Enter a valid YouTube URL (e.g. youtube.com/watch?v=... or youtu.be/...)</span>
          </div>
        `;
      }
    });

    // Category / Subject dependency (Workers REQUIRES subject; Staff does not)
    const updateSubjectRequirement = () => {
      const selectedCatOption = catSelect?.options[catSelect.selectedIndex];
      const isWorkers = selectedCatOption?.text.toLowerCase().includes('worker');
      if (subSelect && subHelp) {
        if (isWorkers) {
          subSelect.required = true;
          subHelp.textContent = 'Workers modules require a valid manufacturing subject (Stitching, Assembly, Cutting).';
          subHelp.style.color = '#1e40af';
        } else {
          subSelect.required = false;
          subHelp.textContent = 'Staff induction modules do not require a manufacturing subject.';
          subHelp.style.color = '#64748b';
        }
      }
    };
    catSelect?.addEventListener('change', updateSubjectRequirement);
    updateSubjectRequirement();

    // Repeater: Objectives
    const objList = document.getElementById('objectivesList');
    document.getElementById('addObjectiveBtn')?.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'repeater-item-row';
      row.innerHTML = `
        <input type="text" name="learning_objectives[]" class="form-input repeater-input" placeholder="e.g. Master operational procedures..." />
        <button type="button" class="btn-remove-repeater">&times;</button>
      `;
      objList.appendChild(row);
    });

    // Repeater: Instructions
    const instList = document.getElementById('instructionsList');
    document.getElementById('addInstructionBtn')?.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'repeater-item-row';
      row.innerHTML = `
        <input type="text" name="instructions[]" class="form-input repeater-input" placeholder="e.g. Inspect machine guards before starting..." />
        <button type="button" class="btn-remove-repeater">&times;</button>
      `;
      instList.appendChild(row);
    });

    // Remove buttons for repeaters
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove-repeater')) {
        const row = e.target.closest('.repeater-item-row');
        if (row) row.remove();
      }
    });

    // Form Submit
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('moduleId').value;
      const objectives = Array.from(document.querySelectorAll('input[name="learning_objectives[]"]'))
        .map(input => input.value.trim())
        .filter(Boolean);
      const instructions = Array.from(document.querySelectorAll('input[name="instructions[]"]'))
        .map(input => input.value.trim())
        .filter(Boolean);

      const data = {
        title: titleInput.value.trim(),
        slug: slugInput.value.trim(),
        description: document.getElementById('moduleShortDesc').value.trim(),
        overview: document.getElementById('moduleOverview').value.trim(),
        youtube_url: ytUrlInput.value.trim(),
        youtube_video_id: ytIdInput.value.trim(),
        thumbnail_path: document.getElementById('moduleThumbnail').value.trim(),
        status: document.getElementById('moduleStatus').value,
        display_order: Number(document.getElementById('moduleOrder').value) || 1,
        category_id: catSelect.value,
        subject_id: subSelect.value || null,
        learning_objectives: objectives,
        instructions: instructions
      };

      if (id) data.id = id;

      try {
        await dbService.saveModule(data);
        alert('Module saved successfully!');
        window.history.pushState({}, '', '/admin/modules');
        handleRoute();
      } catch (err) {
        alert('Failed to save module: ' + err.message);
      }
    });
  }

  function bindQuizzesListInteractions() {
    document.querySelectorAll('.preview-quiz-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const quiz = await dbService.getQuizById(id);
        if (quiz) {
          openQuizPreviewModal(quiz);
        }
      });
    });

    document.querySelectorAll('.delete-quiz-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        if (confirm(`Are you sure you want to delete quiz "${title}"?`)) {
          await dbService.deleteQuiz(id);
          handleRoute();
        }
      });
    });
  }

  function bindQuizBuilderInteractions(initialQuestions = []) {
    const container = document.getElementById('questionsContainer');
    const addQBtn = document.getElementById('addQuestionBtn');
    const form = document.getElementById('quizBuilderForm');
    const previewBtn = document.getElementById('previewCurrentQuizBtn');

    let questionsState = initialQuestions.length > 0 
      ? JSON.parse(JSON.stringify(initialQuestions))
      : [
          {
            id: 'q-tmp-1',
            question_text: 'Sample operational question',
            explanation: 'Operational rationale for the correct answer.',
            options: [
              { id: 'opt-tmp-1', option_text: 'Option A description', is_correct: true },
              { id: 'opt-tmp-2', option_text: 'Option B description', is_correct: false },
              { id: 'opt-tmp-3', option_text: 'Option C description', is_correct: false },
              { id: 'opt-tmp-4', option_text: 'Option D description', is_correct: false }
            ]
          }
        ];

    const renderQuestionCards = () => {
      if (!container) return;
      container.innerHTML = questionsState.map((q, qIdx) => {
        const optionsHtml = q.options.map((opt, optIdx) => `
          <div class="option-builder-row ${opt.is_correct ? 'is-correct-row' : ''}">
            <label class="correct-radio-label">
              <input type="radio" name="q_correct_${qIdx}" value="${optIdx}" ${opt.is_correct ? 'checked' : ''} class="mark-correct-radio" data-qidx="${qIdx}" data-optidx="${optIdx}" />
              <span>${opt.is_correct ? '✓ Correct Answer' : 'Mark Correct'}</span>
            </label>
            <input type="text" class="form-input opt-text-input" value="${(opt.option_text || '').replace(/"/g, '&quot;')}" placeholder="Enter answer option text..." data-qidx="${qIdx}" data-optidx="${optIdx}" required />
            ${q.options.length > 2 ? `
              <button type="button" class="btn-remove-repeater remove-option-btn" data-qidx="${qIdx}" data-optidx="${optIdx}" title="Remove this option">&times;</button>
            ` : ''}
          </div>
        `).join('');

        return `
          <div class="question-builder-card" data-qidx="${qIdx}">
            <div class="question-card-top">
              <span class="question-num-tag">Question ${qIdx + 1}</span>
              ${questionsState.length > 1 ? `
                <button type="button" class="btn btn-outline-sm btn-sm remove-question-btn" data-qidx="${qIdx}" style="color: #dc2626;">Delete Question</button>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">Question Text *</label>
              <input type="text" class="form-input q-text-input" value="${(q.question_text || '').replace(/"/g, '&quot;')}" placeholder="e.g. What is the mandatory PPE standard when operating this machine?" data-qidx="${qIdx}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Answer Options (Mark exactly 1 correct answer)</label>
              <div class="options-builder-list">
                ${optionsHtml}
              </div>
              <button type="button" class="btn btn-outline-sm btn-sm add-option-btn" data-qidx="${qIdx}">+ Add Answer Option</button>
            </div>

            <div class="form-group" style="margin-top: 12px;">
              <label class="form-label">Explanation / Rationale (Displayed after submission)</label>
              <textarea class="form-textarea q-expl-input" rows="2" placeholder="Explain why the correct answer is standard procedure..." data-qidx="${qIdx}">${q.explanation || ''}</textarea>
            </div>
          </div>
        `;
      }).join('');
    };

    renderQuestionCards();

    // Add question
    addQBtn?.addEventListener('click', () => {
      questionsState.push({
        id: 'q-tmp-' + Date.now(),
        question_text: '',
        explanation: '',
        options: [
          { id: 'opt-' + Date.now() + '-1', option_text: '', is_correct: true },
          { id: 'opt-' + Date.now() + '-2', option_text: '', is_correct: false },
          { id: 'opt-' + Date.now() + '-3', option_text: '', is_correct: false },
          { id: 'opt-' + Date.now() + '-4', option_text: '', is_correct: false }
        ]
      });
      renderQuestionCards();
    });

    // Delegate Question container interactions
    container?.addEventListener('click', (e) => {
      // Remove question
      const removeQBtn = e.target.closest('.remove-question-btn');
      if (removeQBtn) {
        const qIdx = parseInt(removeQBtn.getAttribute('data-qidx'), 10);
        questionsState.splice(qIdx, 1);
        renderQuestionCards();
        return;
      }

      // Add option
      const addOptBtn = e.target.closest('.add-option-btn');
      if (addOptBtn) {
        const qIdx = parseInt(addOptBtn.getAttribute('data-qidx'), 10);
        questionsState[qIdx].options.push({
          id: 'opt-' + Date.now(),
          option_text: '',
          is_correct: false
        });
        renderQuestionCards();
        return;
      }

      // Remove option
      const removeOptBtn = e.target.closest('.remove-option-btn');
      if (removeOptBtn) {
        const qIdx = parseInt(removeOptBtn.getAttribute('data-qidx'), 10);
        const optIdx = parseInt(removeOptBtn.getAttribute('data-optidx'), 10);
        const wasCorrect = questionsState[qIdx].options[optIdx].is_correct;
        questionsState[qIdx].options.splice(optIdx, 1);
        if (wasCorrect && questionsState[qIdx].options.length > 0) {
          questionsState[qIdx].options[0].is_correct = true;
        }
        renderQuestionCards();
        return;
      }
    });

    // Radio button mark correct change
    container?.addEventListener('change', (e) => {
      if (e.target.classList.contains('mark-correct-radio')) {
        const qIdx = parseInt(e.target.getAttribute('data-qidx'), 10);
        const optIdx = parseInt(e.target.getAttribute('data-optidx'), 10);
        questionsState[qIdx].options.forEach((opt, idx) => {
          opt.is_correct = (idx === optIdx);
        });
        renderQuestionCards();
      }
    });

    // Synchronize inputs on blur/input
    container?.addEventListener('input', (e) => {
      if (e.target.classList.contains('q-text-input')) {
        const qIdx = parseInt(e.target.getAttribute('data-qidx'), 10);
        questionsState[qIdx].question_text = e.target.value;
      } else if (e.target.classList.contains('opt-text-input')) {
        const qIdx = parseInt(e.target.getAttribute('data-qidx'), 10);
        const optIdx = parseInt(e.target.getAttribute('data-optidx'), 10);
        questionsState[qIdx].options[optIdx].option_text = e.target.value;
      } else if (e.target.classList.contains('q-expl-input')) {
        const qIdx = parseInt(e.target.getAttribute('data-qidx'), 10);
        questionsState[qIdx].explanation = e.target.value;
      }
    });

    // Save Quiz Form Submit
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const quizId = document.getElementById('quizId').value;
      const quizData = {
        id: quizId || undefined,
        module_id: document.getElementById('quizModuleId').value,
        title: document.getElementById('quizTitle').value.trim(),
        description: document.getElementById('quizDescription').value.trim(),
        is_published: document.getElementById('quizIsPublished').checked
      };

      try {
        await dbService.saveQuiz(quizData, questionsState);
        alert('Quiz & Assessment Questions saved successfully!');
        window.history.pushState({}, '', '/admin/quizzes');
        handleRoute();
      } catch (err) {
        alert('Validation Error: ' + err.message);
      }
    });

    // Preview Current Quiz
    previewBtn?.addEventListener('click', () => {
      const mockQuiz = {
        title: document.getElementById('quizTitle').value || 'Quiz Preview',
        description: document.getElementById('quizDescription').value || '',
        questions: questionsState
      };
      openQuizPreviewModal(mockQuiz);
    });
  }

  function openQuizPreviewModal(quiz) {
    const modal = document.getElementById('quizPreviewModal');
    const body = document.getElementById('quizPreviewBody');
    const closeBtn = document.getElementById('closeQuizPreviewBtn');
    if (!modal || !body) return;

    const questionsHtml = (quiz.questions || []).map((q, idx) => `
      <div class="quiz-question-card" style="margin-bottom: 20px;">
        <div class="question-header">
          <span class="question-index-pill">Question ${idx + 1} of ${quiz.questions.length}</span>
        </div>
        <h4 class="question-title">${q.question_text}</h4>
        <div class="question-options-list">
          ${q.options.map((opt, oIdx) => `
            <label class="quiz-option-label ${opt.is_correct ? 'is-correct' : ''}">
              <input type="radio" name="preview_q_${idx}" value="${oIdx}" />
              <span class="quiz-option-radio-mark"></span>
              <span class="quiz-option-text">${opt.option_text}</span>
              ${opt.is_correct ? '<span class="badge badge-success" style="margin-left: auto;">Correct Key</span>' : ''}
            </label>
          `).join('')}
        </div>
        ${q.explanation ? `<div class="quiz-feedback-box is-correct" style="display: block; margin-top: 8px;"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
      </div>
    `).join('');

    body.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a;">${quiz.title}</h2>
        <p style="color: #64748b; font-size: 0.875rem;">${quiz.description || 'Previewing quiz as configured.'}</p>
      </div>
      <div class="quiz-form-body">
        ${questionsHtml}
      </div>
    `;

    modal.style.display = 'flex';
    closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; }, { once: true });
  }

  function bindTeamInteractions() {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const openBtn = document.getElementById('openCreateUserModalBtn');
    const closeBtn = document.getElementById('closeUserModalBtn');
    const cancelBtn = document.getElementById('cancelUserModalBtn');
    const modalTitle = document.getElementById('userModalTitle');

    const showModal = (user = null) => {
      form.reset();
      if (user) {
        modalTitle.textContent = 'Edit HR Member: ' + user.full_name;
        document.getElementById('userId').value = user.id;
        document.getElementById('userFullName').value = user.full_name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userIsActive').checked = user.is_active;
      } else {
        modalTitle.textContent = 'Invite HR Member';
        document.getElementById('userId').value = '';
        document.getElementById('userIsActive').checked = true;
      }
      modal.style.display = 'flex';
    };

    const hideModal = () => { modal.style.display = 'none'; };

    openBtn?.addEventListener('click', () => showModal());
    closeBtn?.addEventListener('click', hideModal);
    cancelBtn?.addEventListener('click', hideModal);

    document.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = JSON.parse(btn.getAttribute('data-user'));
        showModal(user);
      });
    });

    document.querySelectorAll('.toggle-user-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const active = btn.getAttribute('data-active') === 'true';
        await dbService.toggleUserStatus(id, !active);
        handleRoute();
      });
    });

    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        if (confirm(`Are you sure you want to remove ${name} from the HR team?`)) {
          try {
            await dbService.deleteTeamMember(id);
            handleRoute();
          } catch (e) {
            alert(e.message);
          }
        }
      });
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('userId').value;
      const data = {
        full_name: document.getElementById('userFullName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        role: document.getElementById('userRole').value,
        is_active: document.getElementById('userIsActive').checked
      };
      if (id) data.id = id;

      try {
        await dbService.saveTeamMember(data);
        hideModal();
        handleRoute();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  function bindSettingsInteractions() {
    const connForm = document.getElementById('supabaseConnectForm');
    const clearBtn = document.getElementById('clearSupabaseCredsBtn');
    const exportBtn = document.getElementById('exportLocalDbBtn');
    const resetBtn = document.getElementById('resetLocalDbBtn');

    connForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = document.getElementById('cfgSupabaseUrl').value.trim();
      const key = document.getElementById('cfgSupabaseKey').value.trim();

      if (url && key) {
        localStorage.setItem('FUSIONSOLE_SUPABASE_URL', url);
        localStorage.setItem('FUSIONSOLE_SUPABASE_ANON_KEY', key);
        alert('Supabase credentials saved. Reloading application to initialize PostgreSQL connection...');
        window.location.reload();
      } else {
        alert('Please enter both Supabase URL and Anon Key.');
      }
    });

    clearBtn?.addEventListener('click', () => {
      localStorage.removeItem('FUSIONSOLE_SUPABASE_URL');
      localStorage.removeItem('FUSIONSOLE_SUPABASE_ANON_KEY');
      alert('Reset to Local Database mode. Reloading...');
      window.location.reload();
    });

    exportBtn?.addEventListener('click', () => {
      const exportData = {
        timestamp: new Date().toISOString(),
        database: 'Fusionsole Learning Platform',
        version: '2.0.0',
        tables: {
          categories: dbService.getCategories(),
          subjects: dbService.getSubjects(),
          modules: dbService.getModules(),
          quizzes: dbService.getQuizzes()
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `fusionsole_db_export_${Date.now()}.json`;
      a.click();
    });

    resetBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the database to the initial 28 factory modules and seed state? Any custom modules will be cleared.')) {
        localStorage.removeItem('FUSIONSOLE_LOCAL_DB_V2');
        alert('Database reset to initial 28 modules. Reloading...');
        window.location.reload();
      }
    });
  }

  // -----------------------------------------------------------
  // 6. Global Link Interceptor (Single Page Navigation)
  // -----------------------------------------------------------
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
      return;
    }

    // Homepage Anchor Links
    if (href.startsWith('#')) {
      e.preventDefault();
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.history.pushState({}, '', '/' + href);
        handleRoute();
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
      if (mainNav && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
      }
      return;
    }

    // SPA Internal Route Links (e.g. /learning, /admin, /admin/modules, etc.)
    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      handleRoute();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (mainNav && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
      }
    }
  });

  window.addEventListener('popstate', handleRoute);

  // Initial Route Execution on page load
  await handleRoute();
});
