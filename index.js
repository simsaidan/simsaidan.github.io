window.addEventListener('DOMContentLoaded', () => {
  const globeContainer = document.getElementById('globeViz');
  if (!globeContainer) return;

  const world = Globe()
    (globeContainer)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg');

  // Make the globe spin
  let angle = 0;
  setInterval(() => {
    angle += 0.0015;
    world.controls().autoRotate = false;
    world.pointOfView({ lat: 0, lng: angle * 180 / Math.PI }, 0);
  }, 30);
});