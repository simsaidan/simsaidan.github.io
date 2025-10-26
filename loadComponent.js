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

  // Get all navbar links (including dropdown)
  const links = document.querySelectorAll('.top-nav a');

  links.forEach(link => {
    // Compare without hash fragments
    const linkHref = link.href.split('#')[0];
    const currentPage = currentUrl.split('#')[0];

    if (linkHref === currentPage) {
      link.classList.add('active');
      // Optional: highlight dropdown parent
      const dropdown = link.closest('.dropdown');
      if (dropdown) {
        dropdown.querySelector('.dropbtn').classList.add('active');
      }
    }
  });
}
