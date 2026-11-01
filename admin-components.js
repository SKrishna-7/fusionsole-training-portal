/**
 * Fusionsole Admin Panel - Enterprise UI Components
 * Complete CMS management for Categories, Subjects, Training Modules, Quizzes, and HR Team.
 * Follows the Fusionsole corporate blue-and-white design system.
 */

import { dbService, isProduction } from './supabase.js';

// -----------------------------------------------------------------------------
// 1. ADMIN SHELL & NAVIGATION WRAPPER
// -----------------------------------------------------------------------------
export function renderAdminShell(activeSection, contentHtml, breadcrumbs = []) {
  const conn = dbService.getConnectionStatus();
  const connClass = conn.isLive ? 'status-live' : 'status-local';
  const connText = conn.isLive ? 'Supabase Connected' : 'Local DB Mode';

  const breadcrumbItems = [
    { label: 'Admin', url: '/admin' },
    ...breadcrumbs
  ].map((b, i, arr) => {
    if (i === arr.length - 1) {
      return `<li class="admin-crumb active">${b.label}</li>`;
    }
    return `<li class="admin-crumb"><a href="${b.url}">${b.label}</a><span class="crumb-sep">/</span></li>`;
  }).join('');

  return `
    <div class="admin-layout" id="adminApp">
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar" id="adminSidebar">
        <div class="admin-sidebar-header">
          <a href="/admin" class="admin-brand">
            <img src="/images/fusionsole-logo.png" alt="Fusionsole" class="admin-logo-img" />
            <span class="admin-portal-tag">ADMIN CMS</span>
          </a>
          <button type="button" class="admin-sidebar-close" id="closeSidebarBtn" aria-label="Close menu">&times;</button>
        </div>

        <div class="admin-sidebar-user">
          <div class="admin-avatar">HR</div>
          <div class="admin-user-info">
            <span class="admin-user-name" id="adminNavUserName">HR Administrator</span>
            <span class="admin-user-role" id="adminNavUserRole">Admin · L&amp;D Operations</span>
          </div>
        </div>

        <nav class="admin-nav" aria-label="Admin Navigation">
          <div class="admin-nav-group-label">LEARNING MANAGEMENT</div>
          <ul class="admin-nav-list">
            <li>
              <a href="/admin" class="admin-nav-link ${activeSection === 'overview' ? 'active' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>Overview</span>
              </a>
            </li>
            <li>
              <a href="/admin/categories" class="admin-nav-link ${activeSection === 'categories' ? 'active' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span>Categories</span>
              </a>
            </li>
            <li>
              <a href="/admin/subjects" class="admin-nav-link ${activeSection === 'subjects' ? 'active' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <span>Subjects</span>
              </a>
            </li>
            <li>
              <a href="/admin/modules" class="admin-nav-link ${activeSection === 'modules' ? 'active' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                <span>Training Modules</span>
                <span class="admin-nav-badge" id="navModuleCount">28</span>
              </a>
            </li>
            <li>
              <a href="/admin/quizzes" class="admin-nav-link ${activeSection === 'quizzes' ? 'active' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span>Quizzes</span>
              </a>
            </li>
          </ul>

          <div class="admin-nav-group-label" style="margin-top: 24px;">ADMINISTRATION</div>
          <ul class="admin-nav-list">
            <li>
              <a href="/admin/team" class="admin-nav-link ${activeSection === 'team' ? 'active' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>HR Team</span>
              </a>
            </li>
            <li>
              <a href="/admin/settings" class="admin-nav-link ${activeSection === 'settings' ? 'active' : ''}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>Settings</span>
              </a>
            </li>
          </ul>

          <div class="admin-sidebar-footer">
            <a href="/learning" class="btn btn-outline-sm btn-block public-portal-btn" target="_blank">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>View Learning Portal</span>
            </a>
          </div>
        </nav>
      </aside>

      <!-- Admin Main Wrapper -->
      <div class="admin-main">
        <!-- Top Navbar -->
        <header class="admin-topbar">
          <div class="admin-topbar-left">
            <button type="button" class="admin-mobile-toggle" id="openSidebarBtn" aria-label="Toggle navigation">
              <span></span><span></span><span></span>
            </button>
            <ol class="admin-breadcrumbs">${breadcrumbItems}</ol>
          </div>

          <div class="admin-topbar-right">
            <a href="/admin/settings" class="admin-conn-pill ${connClass}" title="${conn.mode}">
              <span class="conn-dot"></span>
              <span class="conn-label">${connText}</span>
            </a>

            <div class="admin-topbar-actions">
              <button type="button" id="adminLogoutBtn" class="btn btn-ghost-sm" title="Log out from Admin session">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Workspace Body -->
        <main class="admin-body">
          ${contentHtml}
        </main>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 2. OVERVIEW DASHBOARD VIEW (/admin)
// -----------------------------------------------------------------------------
export function renderDashboardOverview(stats) {
  const recentRows = stats.recentlyUpdated.map(m => `
    <tr>
      <td class="font-medium">${m.title}</td>
      <td><span class="badge badge-subtle">${m.category?.name || 'General'}</span></td>
      <td>${m.subject?.name || '<span class="text-muted">—</span>'}</td>
      <td><span class="status-pill status-${m.status}">${m.status.toUpperCase()}</span></td>
      <td class="text-muted text-sm">${new Date(m.updated_at).toLocaleDateString()}</td>
      <td class="text-right">
        <a href="/admin/modules/${m.id}/edit" class="btn-link">Edit</a>
      </td>
    </tr>
  `).join('');

  const draftCards = stats.draftsNeedingAttention.map(m => `
    <div class="draft-card">
      <div class="draft-card-header">
        <span class="badge badge-warning">DRAFT</span>
        <span class="draft-dept">${m.subject?.name || m.category?.name || 'Staff'}</span>
      </div>
      <h4 class="draft-title">${m.title}</h4>
      <p class="draft-desc">${m.description ? m.description.slice(0, 95) + '...' : 'Content draft awaiting final training material from HR.'}</p>
      <div class="draft-card-actions">
        <a href="/admin/modules/${m.id}/edit" class="btn btn-outline-sm btn-sm">Configure Content</a>
        <button type="button" class="btn btn-primary-sm btn-sm quick-publish-btn" data-id="${m.id}">Publish</button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow">EXECUTIVE METRICS</span>
          <h1 class="admin-page-title">Operations Overview</h1>
          <p class="admin-page-desc">Real-time database records across categories, subjects, manufacturing modules, and HR accounts.</p>
        </div>
        <div class="admin-header-actions">
          <a href="/admin/modules/new" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Create Module</span>
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Categories</span>
            <div class="stat-icon-wrap icon-blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
          </div>
          <div class="stat-value">${stats.totalCategories}</div>
          <div class="stat-meta">Staff &amp; Workers</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Manufacturing Subjects</span>
            <div class="stat-icon-wrap icon-blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
          <div class="stat-value">${stats.totalSubjects}</div>
          <div class="stat-meta">Stitching, Assembly, Cutting</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Total Modules</span>
            <div class="stat-icon-wrap icon-blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
          </div>
          <div class="stat-value">${stats.totalModules}</div>
          <div class="stat-meta">Curriculum total</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Published Courses</span>
            <div class="stat-icon-wrap icon-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div class="stat-value text-success">${stats.publishedModules}</div>
          <div class="stat-meta">Visible on public portal</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Draft Modules</span>
            <div class="stat-icon-wrap icon-amber">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>
          <div class="stat-value text-warning">${stats.draftModules}</div>
          <div class="stat-meta">Awaiting HR materials</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Active Quizzes</span>
            <div class="stat-icon-wrap icon-purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div class="stat-value">${stats.totalQuizzes}</div>
          <div class="stat-meta">Knowledge assessments</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">HR Team Members</span>
            <div class="stat-icon-wrap icon-blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div class="stat-value">${stats.teamMembers}</div>
          <div class="stat-meta">Active HR accounts</div>
        </div>
      </div>

      <!-- Action Required: Draft Modules -->
      <section class="admin-section" style="margin-top: 36px;">
        <div class="section-heading-row">
          <div>
            <h2 class="admin-section-title">Draft Modules Requiring Content</h2>
            <p class="admin-section-subtitle">Initial factory curriculum records initialized as drafts. Add training materials and publish when ready.</p>
          </div>
          <a href="/admin/modules?status=draft" class="btn btn-outline-sm">View All Drafts (${stats.draftModules})</a>
        </div>
        <div class="draft-cards-grid">
          ${draftCards.length ? draftCards : '<div class="empty-state-box">All curriculum modules are currently published.</div>'}
        </div>
      </section>

      <!-- Recently Updated Modules -->
      <section class="admin-section" style="margin-top: 36px;">
        <div class="section-heading-row">
          <div>
            <h2 class="admin-section-title">Recently Updated Modules</h2>
            <p class="admin-section-subtitle">Chronological record of recent modifications to learning content.</p>
          </div>
          <a href="/admin/modules" class="btn btn-outline-sm">Manage All Modules</a>
        </div>

        <div class="admin-table-card">
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Module Title</th>
                  <th>Category</th>
                  <th>Department / Subject</th>
                  <th>Status</th>
                  <th>Last Modified</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${recentRows}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 3. CATEGORIES MANAGEMENT VIEW (/admin/categories)
// -----------------------------------------------------------------------------
export function renderCategoriesList(categories) {
  const rows = categories.map(cat => `
    <tr>
      <td>
        <div class="cat-thumb-row">
          <img src="${cat.image_path || '/images/fusion-moulds.jpg'}" alt="${cat.name}" class="cat-table-thumb" />
          <div>
            <span class="font-semibold block">${cat.name}</span>
            <span class="text-muted text-xs">slug: /${cat.slug}</span>
          </div>
        </div>
      </td>
      <td class="text-muted">${cat.description ? cat.description.slice(0, 80) + '...' : '—'}</td>
      <td>
        <span class="order-badge">#${cat.display_order}</span>
      </td>
      <td>
        <span class="status-pill ${cat.is_active ? 'status-published' : 'status-archived'}">
          ${cat.is_active ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </td>
      <td class="text-right">
        <button type="button" class="btn-action edit-cat-btn" data-cat='${JSON.stringify(cat).replace(/'/g, "&apos;")}'>Edit</button>
        <button type="button" class="btn-action btn-action-danger delete-cat-btn" data-id="${cat.id}" data-name="${cat.name}">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow">CURRICULUM STRUCTURE</span>
          <h1 class="admin-page-title">Categories Management</h1>
          <p class="admin-page-desc">Manage top-level learning categories (Staff and Workers) and their public presentation.</p>
        </div>
        <div class="admin-header-actions">
          <button type="button" id="openCreateCatModalBtn" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Add Category</span>
          </button>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Display Order</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div class="admin-modal-overlay" id="categoryModal" style="display: none;">
      <div class="admin-modal-card">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" id="catModalTitle">Edit Category</h3>
          <button type="button" class="modal-close-btn" id="closeCatModalBtn">&times;</button>
        </div>
        <form id="categoryForm" class="admin-modal-form">
          <input type="hidden" id="catId" name="id" />
          
          <div class="form-group">
            <label for="catName" class="form-label">Category Name *</label>
            <input type="text" id="catName" name="name" class="form-input" required placeholder="e.g. Staff or Workers" />
          </div>

          <div class="form-group">
            <label for="catSlug" class="form-label">URL Slug *</label>
            <input type="text" id="catSlug" name="slug" class="form-input" required placeholder="e.g. staff or workers" />
            <span class="form-help">Unique route identifier (e.g. /learning/staff)</span>
          </div>

          <div class="form-group">
            <label for="catDescription" class="form-label">Description</label>
            <textarea id="catDescription" name="description" class="form-textarea" rows="3" placeholder="Summary shown on the Learning Centre overview page..."></textarea>
          </div>

          <div class="form-group">
            <label for="catImagePath" class="form-label">Image Path / URL</label>
            <input type="text" id="catImagePath" name="image_path" class="form-input" placeholder="/images/fusion-moulds.jpg" />
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label for="catOrder" class="form-label">Display Order</label>
              <input type="number" id="catOrder" name="display_order" class="form-input" value="1" min="1" />
            </div>
            <div class="form-group" style="display: flex; align-items: flex-end; padding-bottom: 8px;">
              <label class="form-checkbox-label">
                <input type="checkbox" id="catIsActive" name="is_active" checked />
                <span>Active (Visible on public portal)</span>
              </label>
            </div>
          </div>

          <div class="admin-modal-footer">
            <button type="button" class="btn btn-outline" id="cancelCatModalBtn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="saveCatBtn">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 4. SUBJECTS MANAGEMENT VIEW (/admin/subjects)
// -----------------------------------------------------------------------------
export function renderSubjectsList(subjects, categories) {
  const rows = subjects.map(sub => `
    <tr>
      <td>
        <div class="cat-thumb-row">
          <img src="${sub.image_path || '/images/fusion-lasting.jpg'}" alt="${sub.name}" class="cat-table-thumb" />
          <div>
            <span class="font-semibold block">${sub.name}</span>
            <span class="text-muted text-xs">slug: /learning/workers/${sub.slug}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="badge badge-subtle">${sub.category_name || 'Workers'}</span>
      </td>
      <td class="text-muted">${sub.description ? sub.description.slice(0, 75) + '...' : '—'}</td>
      <td><span class="order-badge">#${sub.display_order}</span></td>
      <td>
        <span class="status-pill ${sub.is_active ? 'status-published' : 'status-archived'}">
          ${sub.is_active ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </td>
      <td class="text-right">
        <button type="button" class="btn-action edit-sub-btn" data-sub='${JSON.stringify(sub).replace(/'/g, "&apos;")}'>Edit</button>
        <button type="button" class="btn-action btn-action-danger delete-sub-btn" data-id="${sub.id}" data-name="${sub.name}">Delete</button>
      </td>
    </tr>
  `).join('');

  const catOptions = categories.map(c => `
    <option value="${c.id}">${c.name}</option>
  `).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow">DEPARTMENT HIERARCHY</span>
          <h1 class="admin-page-title">Manufacturing Subjects</h1>
          <p class="admin-page-desc">Manage footwear manufacturing departments under Workers (Stitching, Assembly, Cutting).</p>
        </div>
        <div class="admin-header-actions">
          <button type="button" id="openCreateSubModalBtn" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Parent Category</th>
                <th>Description</th>
                <th>Display Order</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Subject Modal -->
    <div class="admin-modal-overlay" id="subjectModal" style="display: none;">
      <div class="admin-modal-card">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" id="subModalTitle">Edit Subject</h3>
          <button type="button" class="modal-close-btn" id="closeSubModalBtn">&times;</button>
        </div>
        <form id="subjectForm" class="admin-modal-form">
          <input type="hidden" id="subId" name="id" />

          <div class="form-group">
            <label for="subCategoryId" class="form-label">Parent Category *</label>
            <select id="subCategoryId" name="category_id" class="form-select" required>
              ${catOptions}
            </select>
          </div>

          <div class="form-group">
            <label for="subName" class="form-label">Subject Name *</label>
            <input type="text" id="subName" name="name" class="form-input" required placeholder="e.g. Stitching, Assembly, Cutting" />
          </div>

          <div class="form-group">
            <label for="subSlug" class="form-label">URL Slug *</label>
            <input type="text" id="subSlug" name="slug" class="form-input" required placeholder="e.g. stitching or assembly" />
          </div>

          <div class="form-group">
            <label for="subDescription" class="form-label">Description</label>
            <textarea id="subDescription" name="description" class="form-textarea" rows="3" placeholder="Overview of the department operations..."></textarea>
          </div>

          <div class="form-group">
            <label for="subImagePath" class="form-label">Image Path / URL</label>
            <input type="text" id="subImagePath" name="image_path" class="form-input" placeholder="/images/fusion-stitching.jpg" />
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label for="subOrder" class="form-label">Display Order</label>
              <input type="number" id="subOrder" name="display_order" class="form-input" value="1" min="1" />
            </div>
            <div class="form-group" style="display: flex; align-items: flex-end; padding-bottom: 8px;">
              <label class="form-checkbox-label">
                <input type="checkbox" id="subIsActive" name="is_active" checked />
                <span>Active (Visible on public portal)</span>
              </label>
            </div>
          </div>

          <div class="admin-modal-footer">
            <button type="button" class="btn btn-outline" id="cancelSubModalBtn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="saveSubBtn">Save Subject</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 5. TRAINING MODULES MANAGEMENT VIEW (/admin/modules)
// -----------------------------------------------------------------------------
export function renderModulesList(modules, categories, subjects, filters = {}) {
  const catOptions = categories.map(c => `<option value="${c.id}" ${filters.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');
  const subOptions = subjects.map(s => `<option value="${s.id}" ${filters.subjectId === s.id ? 'selected' : ''}>${s.name}</option>`).join('');

  const rows = modules.map(m => {
    const videoStatus = m.has_video 
      ? '<span class="status-indicator-tag tag-has-video">✓ Video Linked</span>' 
      : '<span class="status-indicator-tag tag-no-video">No Video</span>';
    const quizStatus = m.has_quiz 
      ? (m.quiz_published ? '<span class="status-indicator-tag tag-has-quiz">✓ Quiz Live</span>' : '<span class="status-indicator-tag tag-draft-quiz">Quiz Draft</span>')
      : '<span class="status-indicator-tag tag-no-quiz">No Quiz</span>';

    return `
      <tr data-id="${m.id}">
        <td>
          <div class="module-table-title-wrap">
            <span class="order-badge">#${String(m.display_order).padStart(2, '0')}</span>
            <div>
              <a href="/admin/modules/${m.id}/edit" class="font-semibold text-primary hover-underline">${m.title}</a>
              <span class="text-muted text-xs block">/${m.slug}</span>
            </div>
          </div>
        </td>
        <td><span class="badge badge-subtle">${m.category?.name || 'General'}</span></td>
        <td>${m.subject?.name || '<span class="text-muted">—</span>'}</td>
        <td>
          <div class="status-tag-stack">
            ${videoStatus}
            ${quizStatus}
          </div>
        </td>
        <td>
          <span class="status-pill status-${m.status}">
            ${m.status.toUpperCase()}
          </span>
        </td>
        <td class="text-muted text-xs">${new Date(m.updated_at).toLocaleDateString()}</td>
        <td class="text-right">
          <div class="action-btn-group">
            <a href="/admin/modules/${m.id}/edit" class="btn-action">Edit</a>
            <button type="button" class="btn-action toggle-publish-btn" data-id="${m.id}" data-status="${m.status}">
              ${m.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
            <button type="button" class="btn-action btn-action-danger delete-module-btn" data-id="${m.id}" data-title="${m.title}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow">FOOTWEAR CURRICULUM</span>
          <h1 class="admin-page-title">Training Modules (${modules.length})</h1>
          <p class="admin-page-desc">Complete control over training videos, operating instructions, objectives, and publication status.</p>
        </div>
        <div class="admin-header-actions">
          <a href="/admin/modules/new" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Create New Module</span>
          </a>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="admin-toolbar-card">
        <div class="toolbar-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="moduleSearchInput" class="toolbar-search-input" placeholder="Search module title or slug..." value="${filters.search || ''}" />
        </div>

        <div class="toolbar-filters">
          <select id="filterCategory" class="toolbar-select">
            <option value="">All Categories</option>
            ${catOptions}
          </select>

          <select id="filterSubject" class="toolbar-select">
            <option value="">All Subjects</option>
            ${subOptions}
          </select>

          <select id="filterStatus" class="toolbar-select">
            <option value="">All Statuses</option>
            <option value="draft" ${filters.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="published" ${filters.status === 'published' ? 'selected' : ''}>Published</option>
            <option value="archived" ${filters.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>

          ${(filters.search || filters.categoryId || filters.subjectId || filters.status) ? `
            <button type="button" id="clearModuleFiltersBtn" class="btn btn-ghost-sm">Clear Filters</button>
          ` : ''}
        </div>
      </div>

      <!-- Modules Table -->
      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-table" id="modulesTable">
            <thead>
              <tr>
                <th>Module Title &amp; Order</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Video &amp; Quiz</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows : `
                <tr>
                  <td colspan="7" class="text-center py-8 text-muted">
                    No modules found matching the selected filters.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 6. MODULE EDITOR FORM VIEW (/admin/modules/new & /admin/modules/:id/edit)
// -----------------------------------------------------------------------------
export function renderModuleEditor(moduleData = {}, categories = [], subjects = []) {
  const isEdit = Boolean(moduleData.id);
  const title = isEdit ? `Edit Module: ${moduleData.title}` : 'Create New Training Module';
  const ytId = moduleData.youtube_video_id || dbService.extractYouTubeId(moduleData.youtube_url || '');

  const catOptions = categories.map(c => `
    <option value="${c.id}" ${moduleData.category_id === c.id ? 'selected' : ''}>${c.name}</option>
  `).join('');

  const subOptions = subjects.map(s => `
    <option value="${s.id}" data-category-id="${s.category_id}" ${moduleData.subject_id === s.id ? 'selected' : ''}>
      ${s.name} (${s.category_name || 'Workers'})
    </option>
  `).join('');

  const objectives = Array.isArray(moduleData.learning_objectives) && moduleData.learning_objectives.length > 0
    ? moduleData.learning_objectives
    : ['Master operational techniques and machine settings.', 'Adhere to workshop safety protocols.'];

  const instructions = Array.isArray(moduleData.instructions) && moduleData.instructions.length > 0
    ? moduleData.instructions
    : ['Check raw materials and machine alignment before operating.'];

  const objectivesHtml = objectives.map((obj, i) => `
    <div class="repeater-item-row" data-index="${i}">
      <input type="text" name="learning_objectives[]" class="form-input repeater-input" value="${obj.replace(/"/g, '&quot;')}" placeholder="e.g. Master single-needle machine setup..." />
      <button type="button" class="btn-remove-repeater" aria-label="Remove objective">&times;</button>
    </div>
  `).join('');

  const instructionsHtml = instructions.map((inst, i) => `
    <div class="repeater-item-row" data-index="${i}">
      <input type="text" name="instructions[]" class="form-input repeater-input" value="${inst.replace(/"/g, '&quot;')}" placeholder="e.g. Verify needle size before starting run..." />
      <button type="button" class="btn-remove-repeater" aria-label="Remove instruction">&times;</button>
    </div>
  `).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow"><a href="/admin/modules" class="text-muted hover-underline">← Back to Modules</a></span>
          <h1 class="admin-page-title">${title}</h1>
          <p class="admin-page-desc">Define training video demonstrations, learning outcomes, and technical instructions.</p>
        </div>
        <div class="admin-header-actions">
          <a href="/admin/modules" class="btn btn-outline">Cancel</a>
          <button type="submit" form="moduleForm" class="btn btn-primary" id="saveModuleBtn">
            <span>Save Module</span>
          </button>
        </div>
      </div>

      <form id="moduleForm" class="editor-grid-layout">
        <!-- Main Form Column -->
        <div class="editor-main-col">
          <input type="hidden" id="moduleId" name="id" value="${moduleData.id || ''}" />

          <!-- Card 1: Core Identification -->
          <div class="admin-card editor-section-card">
            <h3 class="editor-card-title">Core Information</h3>
            
            <div class="form-group">
              <label for="moduleTitle" class="form-label">Module Title *</label>
              <input type="text" id="moduleTitle" name="title" class="form-input" required value="${moduleData.title || ''}" placeholder="e.g. S/N Stitching or Counter Moulding" />
            </div>

            <div class="form-group">
              <label for="moduleSlug" class="form-label">URL Slug *</label>
              <div class="slug-input-wrap">
                <span class="slug-prefix">/learning/.../</span>
                <input type="text" id="moduleSlug" name="slug" class="form-input" required value="${moduleData.slug || ''}" placeholder="sn-stitching" />
              </div>
              <span class="form-help">Automatically derived from title, or customized. Must be unique.</span>
            </div>

            <div class="form-group">
              <label for="moduleShortDesc" class="form-label">Short Description</label>
              <textarea id="moduleShortDesc" name="description" class="form-textarea" rows="2" placeholder="Brief summary shown on module listing cards...">${moduleData.description || ''}</textarea>
            </div>

            <div class="form-group">
              <label for="moduleOverview" class="form-label">Comprehensive Course Overview</label>
              <textarea id="moduleOverview" name="overview" class="form-textarea" rows="4" placeholder="Detailed manufacturing context and technical background...">${moduleData.overview || ''}</textarea>
            </div>
          </div>

          <!-- Card 2: YouTube Video Integration -->
          <div class="admin-card editor-section-card">
            <h3 class="editor-card-title">YouTube Training Demonstration</h3>
            <p class="form-help" style="margin-bottom: 16px;">
              Supports standard YouTube URLs (<code>youtube.com/watch?v=...</code>), short links (<code>youtu.be/...</code>), or embed links.
            </p>

            <div class="form-group">
              <label for="moduleYtUrl" class="form-label">YouTube Video URL</label>
              <input type="text" id="moduleYtUrl" name="youtube_url" class="form-input" value="${moduleData.youtube_url || ''}" placeholder="https://www.youtube.com/watch?v=..." />
              <input type="hidden" id="moduleYtId" name="youtube_video_id" value="${ytId}" />
            </div>

            <!-- Real-time Video Preview Container -->
            <div class="yt-preview-container" id="ytPreviewContainer">
              ${ytId ? `
                <div class="yt-preview-box">
                  <iframe 
                    src="https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1" 
                    title="YouTube Video Preview" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                  </iframe>
                  <div class="yt-preview-meta">
                    <span class="badge badge-success">✓ Valid Video ID: ${ytId}</span>
                  </div>
                </div>
              ` : `
                <div class="yt-empty-preview">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  <span>Enter a YouTube link above to preview video embed before saving</span>
                </div>
              `}
            </div>
          </div>

          <!-- Card 3: Learning Objectives Repeater -->
          <div class="admin-card editor-section-card">
            <div class="repeater-header-row">
              <h3 class="editor-card-title">Learning Objectives</h3>
              <button type="button" id="addObjectiveBtn" class="btn btn-outline-sm btn-sm">+ Add Objective</button>
            </div>
            <p class="form-help" style="margin-bottom: 12px;">Key operational competencies learners will achieve.</p>
            <div class="repeater-list" id="objectivesList">
              ${objectivesHtml}
            </div>
          </div>

          <!-- Card 4: Operating Instructions & Safety -->
          <div class="admin-card editor-section-card">
            <div class="repeater-header-row">
              <h3 class="editor-card-title">Operating Instructions &amp; Safety</h3>
              <button type="button" id="addInstructionBtn" class="btn btn-outline-sm btn-sm">+ Add Instruction</button>
            </div>
            <p class="form-help" style="margin-bottom: 12px;">Standard operating procedures (SOPs) and safety guidelines.</p>
            <div class="repeater-list" id="instructionsList">
              ${instructionsHtml}
            </div>
          </div>
        </div>

        <!-- Sidebar Meta Column -->
        <div class="editor-sidebar-col">
          <!-- Publishing Status Card -->
          <div class="admin-card meta-box">
            <h4 class="meta-box-title">Publishing &amp; Status</h4>
            
            <div class="form-group">
              <label for="moduleStatus" class="form-label">Publication Status</label>
              <select id="moduleStatus" name="status" class="form-select">
                <option value="draft" ${moduleData.status === 'draft' ? 'selected' : ''}>Draft (Hidden from Public)</option>
                <option value="published" ${moduleData.status === 'published' ? 'selected' : ''}>Published (Live for Learners)</option>
                <option value="archived" ${moduleData.status === 'archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>

            <div class="form-group">
              <label for="moduleOrder" class="form-label">Display Order</label>
              <input type="number" id="moduleOrder" name="display_order" class="form-input" value="${moduleData.display_order || 1}" min="1" />
              <span class="form-help">Sequence position on department listings.</span>
            </div>
          </div>

          <!-- Department Hierarchy Card -->
          <div class="admin-card meta-box">
            <h4 class="meta-box-title">Department Hierarchy</h4>

            <div class="form-group">
              <label for="moduleCategoryId" class="form-label">Category *</label>
              <select id="moduleCategoryId" name="category_id" class="form-select" required>
                ${catOptions}
              </select>
            </div>

            <div class="form-group" id="subjectSelectGroup">
              <label for="moduleSubjectId" class="form-label">Subject / Department *</label>
              <select id="moduleSubjectId" name="subject_id" class="form-select">
                <option value="">— None (Staff Induction) —</option>
                ${subOptions}
              </select>
              <span class="form-help" id="subjectHelpText">Workers modules require a valid subject. Staff induction does not.</span>
            </div>

            <div class="form-group">
              <label for="moduleThumbnail" class="form-label">Thumbnail Image</label>
              <input type="text" id="moduleThumbnail" name="thumbnail_path" class="form-input" value="${moduleData.thumbnail_path || ''}" placeholder="/images/fusion-stitching.jpg" />
            </div>
          </div>

          <!-- Quick Actions & Associated Quiz -->
          <div class="admin-card meta-box">
            <h4 class="meta-box-title">Knowledge Check</h4>
            <p class="text-sm text-muted" style="margin-bottom: 12px;">
              ${isEdit ? 'Every module can feature an interactive quiz assessment.' : 'Save this module first to configure its knowledge check assessment.'}
            </p>
            ${isEdit ? `
              <a href="/admin/quizzes/module/${moduleData.id}" class="btn btn-outline-sm btn-block">
                <span>Configure Module Quiz</span>
              </a>
            ` : ''}
          </div>
        </div>
      </form>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 7. QUIZZES MANAGEMENT VIEW (/admin/quizzes)
// -----------------------------------------------------------------------------
export function renderQuizzesList(quizzes) {
  const rows = quizzes.map(q => `
    <tr>
      <td>
        <span class="font-semibold block">${q.title}</span>
        <span class="text-muted text-xs">${q.description ? q.description.slice(0, 65) + '...' : 'No description'}</span>
      </td>
      <td>
        <span class="badge badge-subtle">${q.module_title || 'Unassigned'}</span>
      </td>
      <td>
        <span class="badge badge-primary">${q.question_count} Questions</span>
      </td>
      <td>
        <span class="status-pill ${q.is_published ? 'status-published' : 'status-draft'}">
          ${q.is_published ? 'PUBLISHED' : 'DRAFT'}
        </span>
      </td>
      <td class="text-muted text-xs">${new Date(q.updated_at).toLocaleDateString()}</td>
      <td class="text-right">
        <a href="/admin/quizzes/${q.id}/edit" class="btn-action">Edit Questions</a>
        <button type="button" class="btn-action preview-quiz-btn" data-id="${q.id}">Preview</button>
        <button type="button" class="btn-action btn-action-danger delete-quiz-btn" data-id="${q.id}" data-title="${q.title}">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow">ASSESSMENT REPOSITORY</span>
          <h1 class="admin-page-title">Knowledge Quizzes (${quizzes.length})</h1>
          <p class="admin-page-desc">Create and configure module knowledge checks, multiple choice options, and answers.</p>
        </div>
        <div class="admin-header-actions">
          <a href="/admin/quizzes/new" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Create Quiz</span>
          </a>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Associated Module</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows : `
                <tr>
                  <td colspan="6" class="text-center py-8 text-muted">
                    No quizzes found. Click "Create Quiz" to configure your first knowledge assessment.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 8. QUIZ & QUESTION BUILDER VIEW (/admin/quizzes/:id/edit & /admin/quizzes/new)
// -----------------------------------------------------------------------------
export function renderQuizBuilder(quizData = {}, modules = []) {
  const isEdit = Boolean(quizData.id);
  const title = isEdit ? `Edit Quiz: ${quizData.title}` : 'Create Knowledge Assessment';

  const moduleOptions = modules.map(m => `
    <option value="${m.id}" ${quizData.module_id === m.id ? 'selected' : ''}>
      ${m.title} (${m.subject?.name || m.category?.name || 'Staff'})
    </option>
  `).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow"><a href="/admin/quizzes" class="text-muted hover-underline">← Back to Quizzes</a></span>
          <h1 class="admin-page-title">${title}</h1>
          <p class="admin-page-desc">Configure question text, multiple answer choices, single correct answers, and explanations.</p>
        </div>
        <div class="admin-header-actions">
          <button type="button" id="previewCurrentQuizBtn" class="btn btn-outline">Preview Quiz</button>
          <button type="submit" form="quizBuilderForm" class="btn btn-primary" id="saveQuizBtn">
            <span>Save Quiz &amp; Questions</span>
          </button>
        </div>
      </div>

      <form id="quizBuilderForm" class="quiz-builder-layout">
        <input type="hidden" id="quizId" name="id" value="${quizData.id || ''}" />

        <!-- Quiz Metadata Card -->
        <div class="admin-card" style="margin-bottom: 24px;">
          <h3 class="editor-card-title">Quiz Details</h3>
          
          <div class="form-row-2">
            <div class="form-group">
              <label for="quizModuleId" class="form-label">Associated Training Module *</label>
              <select id="quizModuleId" name="module_id" class="form-select" required>
                <option value="">— Select Training Module —</option>
                ${moduleOptions}
              </select>
            </div>

            <div class="form-group">
              <label for="quizTitle" class="form-label">Quiz Assessment Title *</label>
              <input type="text" id="quizTitle" name="title" class="form-input" required value="${quizData.title || ''}" placeholder="e.g. S/N Stitching Knowledge Assessment" />
            </div>
          </div>

          <div class="form-group">
            <label for="quizDescription" class="form-label">Instructions / Description</label>
            <textarea id="quizDescription" name="description" class="form-textarea" rows="2" placeholder="Brief guidance for learners before starting the assessment...">${quizData.description || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-checkbox-label">
              <input type="checkbox" id="quizIsPublished" name="is_published" ${quizData.is_published ? 'checked' : ''} />
              <span><strong>Published</strong> (Make available to learners on the course detail page)</span>
            </label>
          </div>
        </div>

        <!-- Questions Builder Section -->
        <div class="questions-builder-header">
          <div>
            <h2 class="admin-section-title">Assessment Questions</h2>
            <p class="admin-section-subtitle">Each question requires at least 2 options and exactly 1 correct answer.</p>
          </div>
          <button type="button" id="addQuestionBtn" class="btn btn-primary-sm">+ Add Question</button>
        </div>

        <div class="questions-list-container" id="questionsContainer">
          <!-- Populated dynamically via JS -->
        </div>
      </form>
    </div>

    <!-- Quiz Live Preview Modal -->
    <div class="admin-modal-overlay" id="quizPreviewModal" style="display: none;">
      <div class="admin-modal-card quiz-preview-modal-card">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">Learner Experience Preview</h3>
          <button type="button" class="modal-close-btn" id="closeQuizPreviewBtn">&times;</button>
        </div>
        <div class="quiz-preview-body" id="quizPreviewBody">
          <!-- Rendered in learner styling -->
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 9. HR TEAM MANAGEMENT VIEW (/admin/team)
// -----------------------------------------------------------------------------
export function renderTeamManagement(members) {
  const rows = members.map(m => `
    <tr>
      <td>
        <div class="cat-thumb-row">
          <div class="admin-avatar">${m.full_name.slice(0, 2).toUpperCase()}</div>
          <div>
            <span class="font-semibold block">${m.full_name}</span>
            <span class="text-muted text-xs">${m.email}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="badge ${m.role === 'admin' ? 'badge-primary' : 'badge-subtle'}">
          ${m.role === 'admin' ? 'ADMINISTRATOR' : 'HR STAFF'}
        </span>
      </td>
      <td>
        <span class="status-pill ${m.is_active ? 'status-published' : 'status-archived'}">
          ${m.is_active ? 'ACTIVE' : 'DISABLED'}
        </span>
      </td>
      <td class="text-muted text-xs">${new Date(m.created_at).toLocaleDateString()}</td>
      <td class="text-right">
        <button type="button" class="btn-action edit-user-btn" data-user='${JSON.stringify(m).replace(/'/g, "&apos;")}'>Edit Role</button>
        <button type="button" class="btn-action toggle-user-btn" data-id="${m.id}" data-active="${m.is_active}">
          ${m.is_active ? 'Disable' : 'Enable'}
        </button>
        <button type="button" class="btn-action btn-action-danger delete-user-btn" data-id="${m.id}" data-name="${m.full_name}">Remove</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow">ACCESS CONTROL</span>
          <h1 class="admin-page-title">HR Team Management (${members.length})</h1>
          <p class="admin-page-desc">Manage administrative access and permissions for HR personnel (Free Tier ~10 accounts).</p>
        </div>
        <div class="admin-header-actions">
          <button type="button" id="openCreateUserModalBtn" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            <span>Invite HR Member</span>
          </button>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div class="admin-modal-overlay" id="userModal" style="display: none;">
      <div class="admin-modal-card">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" id="userModalTitle">Invite HR Member</h3>
          <button type="button" class="modal-close-btn" id="closeUserModalBtn">&times;</button>
        </div>
        <form id="userForm" class="admin-modal-form">
          <input type="hidden" id="userId" name="id" />

          <div class="form-group">
            <label for="userFullName" class="form-label">Full Name *</label>
            <input type="text" id="userFullName" name="full_name" class="form-input" required placeholder="e.g. Sarah Jenkins" />
          </div>

          <div class="form-group">
            <label for="userEmail" class="form-label">Corporate Email Address *</label>
            <input type="email" id="userEmail" name="email" class="form-input" required placeholder="sarah.jenkins@fusionsole.com" />
          </div>

          <div class="form-group">
            <label for="userRole" class="form-label">Permission Role *</label>
            <select id="userRole" name="role" class="form-select" required>
              <option value="hr_staff">HR Staff (Browse training, conduct quizzes, read-only)</option>
              <option value="admin">Administrator (Full CMS, module CRUD, quiz builder, team management)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-checkbox-label">
              <input type="checkbox" id="userIsActive" name="is_active" checked />
              <span>Account Active (Allowed to sign in)</span>
            </label>
          </div>

          <div class="admin-modal-footer">
            <button type="button" class="btn btn-outline" id="cancelUserModalBtn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="saveUserBtn">Save Account</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 10. SYSTEM SETTINGS & SUPABASE CONFIGURATION VIEW (/admin/settings)
// -----------------------------------------------------------------------------
export function renderSettingsView() {
  const conn = dbService.getConnectionStatus();

  return `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <span class="admin-page-eyebrow">PLATFORM CONFIGURATION</span>
          <h1 class="admin-page-title">System &amp; Database Settings</h1>
          <p class="admin-page-desc">Configure your Supabase PostgreSQL connection, authentication parameters, and manual backup routines.</p>
        </div>
      </div>

      <!-- Database Status Card -->
      <div class="admin-card" style="margin-bottom: 24px;">
        <h3 class="editor-card-title">Database Connection Status</h3>
        
        <div class="conn-status-display ${conn.isLive ? 'is-live' : 'is-local'}">
          <div class="conn-status-indicator">
            <span class="conn-pulse-dot"></span>
            <strong>${conn.mode}</strong>
          </div>
          <p class="text-sm text-muted" style="margin-top: 6px;">
            ${conn.isLive 
              ? 'Your application is connected to a live Supabase PostgreSQL database. All changes persist remotely with Row Level Security.' 
              : 'The application is running in persistent Local Database mode. All CRUD operations, quizzes, and modules are fully functional and persist to your browser storage. Connect your live Supabase project below whenever ready.'}
          </p>
        </div>

        <form id="supabaseConnectForm" style="margin-top: 24px;">
          <div class="form-group">
            <label for="cfgSupabaseUrl" class="form-label">Supabase Project URL</label>
            <input type="url" id="cfgSupabaseUrl" class="form-input" placeholder="https://your-project-id.supabase.co" value="${localStorage.getItem('FUSIONSOLE_SUPABASE_URL') || ''}" />
            <span class="form-help">Found in Supabase Dashboard -> Project Settings -> API -> Project URL</span>
          </div>

          <div class="form-group">
            <label for="cfgSupabaseKey" class="form-label">Supabase Anon / Public Key</label>
            <input type="password" id="cfgSupabaseKey" class="form-input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${localStorage.getItem('FUSIONSOLE_SUPABASE_ANON_KEY') || ''}" />
            <span class="form-help">Found in Supabase Dashboard -> Project Settings -> API -> Project API Keys (anon public)</span>
          </div>

          <div class="btn-row" style="display: flex; gap: 12px; margin-top: 16px;">
            <button type="submit" class="btn btn-primary" id="saveSupabaseCredsBtn">Save &amp; Test Connection</button>
            <button type="button" class="btn btn-outline" id="clearSupabaseCredsBtn">Reset to Local DB Mode</button>
          </div>
        </form>
      </div>

      <!-- Free Tier Operations & Manual Backup Card -->
      <div class="admin-card" style="margin-bottom: 24px;">
        <h3 class="editor-card-title">Supabase Free Tier Operations &amp; Backup Guide</h3>
        <p class="text-sm text-muted" style="margin-bottom: 16px;">
          The Supabase Free tier provides 500MB database storage and 1GB bandwidth, but <strong>does not provide automatic daily point-in-time recovery (PITR)</strong>. Follow these operational standards:
        </p>

        <div class="operations-grid">
          <div class="op-box">
            <h4 class="op-title">1. Database Export Routine</h4>
            <p class="op-text">Export database tables monthly using pg_dump or the Supabase Table Editor export button to keep local archival snapshots.</p>
          </div>

          <div class="op-box">
            <h4 class="op-title">2. Video Hosting (YouTube)</h4>
            <p class="op-text">Always host masterclass videos on YouTube (Unlisted). Never store raw video files in database storage to conserve bandwidth.</p>
          </div>

          <div class="op-box">
            <h4 class="op-title">3. Migrations in Version Control</h4>
            <p class="op-text">All SQL migrations are maintained in <code>/supabase/migrations/</code> for deterministic environment provisioning.</p>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <button type="button" class="btn btn-outline-sm" id="exportLocalDbBtn">Download Database JSON Export</button>
          <button type="button" class="btn btn-outline-sm" id="resetLocalDbBtn" style="color: #dc2626;">Reset Database to Initial 28 Modules</button>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 11. ADMIN LOGIN VIEW (/admin/login)
// -----------------------------------------------------------------------------
export function renderAdminLogin() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectParam = urlParams.get('redirect');
  const isLearningRedirect = redirectParam && decodeURIComponent(redirectParam).startsWith('/learning');

  const title = isLearningRedirect ? 'Learning Centre Access' : 'Sign In to Admin Portal';
  const subtitle = isLearningRedirect
    ? 'Access to factory training modules and standard operating procedures requires an active Fusionsole HR account.'
    : 'Enter your Fusionsole HR credentials to access content management.';
  const btnText = isLearningRedirect ? 'Sign In &amp; Continue to Module' : 'Sign In to Admin Panel';

  const defaultEmail = isProduction ? '' : 'admin@fusionsole.com';
  const defaultPassword = isProduction ? '' : 'password123';
  const helperNotice = isProduction
    ? `<p class="text-xs text-muted" style="color: #64748b;">Protected Enterprise System · Authorized Personnel Only</p>`
    : `<p class="text-xs text-muted">Default credentials for local testing: <code>admin@fusionsole.com</code> / <code>password123</code></p>`;

  return `
    <div class="admin-login-wrapper">
      <div class="admin-login-card">
        <div class="admin-login-brand">
          <img src="/images/fusionsole-logo.png" alt="Fusionsole Logo" class="admin-login-logo" />
          <span class="admin-login-portal-title">LEARNING &amp; DEVELOPMENT ADMIN</span>
        </div>

        <div class="admin-login-header">
          <h1 class="admin-login-title">${title}</h1>
          <p class="admin-login-subtitle">${subtitle}</p>
        </div>

        <form id="adminLoginForm" class="admin-login-form">
          <div id="loginAlertBox" class="alert-box alert-danger" style="display: none;"></div>

          <div class="form-group">
            <label for="loginEmail" class="form-label">Corporate Email</label>
            <input type="email" id="loginEmail" name="email" class="form-input" required value="${defaultEmail}" placeholder="admin@fusionsole.com" />
          </div>

          <div class="form-group">
            <label for="loginPassword" class="form-label">Password</label>
            <input type="password" id="loginPassword" name="password" class="form-input" required value="${defaultPassword}" placeholder="••••••••" />
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmitBtn">
            ${btnText}
          </button>
        </form>

        <div class="admin-login-footer">
          ${helperNotice}
          <div style="margin-top: 12px;">
            <a href="/" class="text-xs text-primary hover-underline">← Return to Fusionsole Homepage</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
