function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      highlightActiveLink(); // Run after navbar is loaded
      setupMobileDropdownToggle(); // Enable dropdown click on touch devices
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

function highlightActiveLink() {
  const currentUrl = window.location.href;
  const currentPage = window.location.pathname.split('/').pop(); // e.g. "tiebreak.html" or ""

  // Don't highlight anything on index page or root
  if (currentPage === '' || currentPage === 'index.html') return;

  const links = document.querySelectorAll('.top-nav a');

  links.forEach(link => {
    const linkHref = link.href.split('#')[0];
    const linkPage = link.pathname.split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active');

      // Optional: highlight dropdown parent if inside one
      const dropdown = link.closest('.dropdown');
      if (dropdown) {
        dropdown.querySelector('.dropbtn').classList.add('active');
      }
    }
  });
}

function setupMobileDropdownToggle() {
  // Only bind click toggles when hover is not available (mobile/tablet).
  const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const shouldBindClick = !canHover || coarsePointer;
  if (!shouldBindClick) return;

  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropbtn');
    if (!btn) return;
    if (btn.dataset.dropdownBound === '1') return;
    btn.dataset.dropdownBound = '1';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Close other open dropdowns.
      document.querySelectorAll('.dropdown.show').forEach(d => {
        if (d !== dropdown) d.classList.remove('show');
      });

      dropdown.classList.toggle('show');
    });
  });

  // Click outside closes.
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.show').forEach(d => d.classList.remove('show'));
  });
}
