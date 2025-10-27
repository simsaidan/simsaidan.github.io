function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      highlightActiveLink(); // Run after navbar is loaded
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