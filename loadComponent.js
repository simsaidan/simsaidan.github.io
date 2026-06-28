function loadComponent(id, file) {
  const container = document.getElementById(id);
  if (!container) {
    console.error(`loadComponent: element #${id} not found`);
    return Promise.reject(new Error(`Element #${id} not found`));
  }

  container.setAttribute('aria-busy', 'true');

  return fetch(file)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} loading ${file}`);
      }
      return res.text();
    })
    .then((data) => {
      container.innerHTML = data;
      container.removeAttribute('aria-busy');
      highlightActiveLink();
      setupMobileDropdownToggle();
      setupMobileNavMenu();
    })
    .catch((err) => {
      container.removeAttribute('aria-busy');
      container.innerHTML = '<p class="component-error">Navigation failed to load.</p>';
      console.error(`Error loading ${file}:`, err);
    });
}

function initSitePage() {
  loadComponent('navbar', 'components/navbar.html');
  loadComponent('footer', 'components/footer.html').then(setupFooter);
}

function initBlogPage() {
  initSitePage();
}

function setupFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const updatedEl = document.getElementById('footer-updated');
  if (updatedEl) {
    const modified = new Date(document.lastModified);
    updatedEl.dateTime = modified.toISOString().split('T')[0];
    updatedEl.textContent = modified.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop();

  if (currentPage === '' || currentPage === 'index.html') return;

  const links = document.querySelectorAll('.top-nav a');

  links.forEach((link) => {
    const linkPage = link.pathname.split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active');

      const dropdown = link.closest('.dropdown');
      if (dropdown) {
        dropdown.querySelector('.dropbtn').classList.add('active');
      }
    }
  });
}

function setupMobileDropdownToggle() {
  const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const shouldBindClick = !canHover || coarsePointer;
  if (!shouldBindClick) return;

  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector('.dropbtn');
    if (!btn) return;
    if (btn.dataset.dropdownBound === '1') return;
    btn.dataset.dropdownBound = '1';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll('.dropdown.show').forEach((d) => {
        if (d !== dropdown) d.classList.remove('show');
      });

      dropdown.classList.toggle('show');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.show').forEach((d) => d.classList.remove('show'));
  });
}

function setupMobileNavMenu() {
  const topNav = document.querySelector('.top-nav');
  const toggle = document.querySelector('.nav-menu-toggle');
  if (!topNav || !toggle) return;
  if (toggle.dataset.navMenuBound === '1') return;
  toggle.dataset.navMenuBound = '1';

  const closeMenu = () => {
    topNav.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = topNav.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!topNav.classList.contains('menu-open')) return;
    if (topNav.contains(e.target)) {
      if (e.target.closest('a')) {
        closeMenu();
      }
      return;
    }
    closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && topNav.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 769px)').matches) {
      closeMenu();
    }
  });
}
