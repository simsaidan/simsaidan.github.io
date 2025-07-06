window.addEventListener("DOMContentLoaded", () => {
  const globe = Globe()
    (document.getElementById('miniGlobe'))
    .globeImageUrl(null) // removes earth texture
    .bumpImageUrl(null)
    .showGlobe(true)
    .globeColor('rgba(255,255,255,0.05)') // faint ghost sphere
    .showGraticules(true)
    .backgroundColor(null)
    .showAtmosphere(true)
    .atmosphereColor('#00aaff')
    .atmosphereAltitude(0.15)
    .pointAltitude(0.02)
    .pointColor(() => '#ff5722')
    .pointsData([
      { lat: 37.7749, lng: -122.4194 },
      { lat: 40.7128, lng: -74.0060 }
    ]);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.6;
});
