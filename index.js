window.addEventListener("DOMContentLoaded", () => {
  const globe = Globe()
    (document.getElementById('miniGlobe'))
    .globeImageUrl(null) // no earth texture
    .showGlobe(true)
    .globeColor("rgba(0, 0, 0, 0)") // fully transparent sphere
    .showGraticules(true)           // optional: lat/lon lines
    .showAtmosphere(true)
    .atmosphereColor('#88f')
    .atmosphereAltitude(0.1)
    .pointColor(() => '#ff5722')
    .pointAltitude(0.01)
    .pointRadius(0.25)
    .pointsData([
      { lat: 37.7749, lng: -122.4194 },
      { lat: 40.7128, lng: -74.0060 }
    ]);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;
});
