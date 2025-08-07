window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globeContainer');

  const globe = Globe()(container)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');

  // Transparent background
  globe.renderer().setClearColor(0x000000, 0);
  globe.scene().background = null;

  // Force canvas to fit container
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  globe.renderer().setSize(width, height);
  globe.camera().aspect = width / height;
  globe.camera().updateProjectionMatrix();

  // Manually zoom out and center the globe
  globe.camera().position.z = 800;
  globe.camera().position.y = 300;
  globe.controls().target.set(0, 0, 0);
  globe.controls().update();

  // Spin the globe
  let angle = 0;
  setInterval(() => {
    angle += 0.004;
    globe.controls().autoRotate = false;
    globe.pointOfView({ lat: 20, lng: angle * 180 / Math.PI, altitude: 5.2 }, 0);
  }, 30);
});