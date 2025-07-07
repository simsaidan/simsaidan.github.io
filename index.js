window.addEventListener('DOMContentLoaded', () => {
  const globeContainer = document.getElementById('globeViz');
  if (!globeContainer) return;

  // Create the globe with no base or atmosphere
  const globe = Globe()(globeContainer)
    .backgroundColor('rgba(0,0,0,0)')
    .showGlobe(true)
    .showAtmosphere(false);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;

  fetch('https://cdn.jsdelivr.net/npm/world-atlas/land-110m.json')
    .then(res => res.json())
    .then(landTopo => {
      globe
        .polygonsData(topojson.feature(landTopo, landTopo.objects.land).features)
        .polygonCapMaterial(new THREE.MeshLambertMaterial({ color: 'darkslategrey', side: THREE.DoubleSide }))
        .polygonSideColor(() => 'rgba(0,0,0,0)');
    });
});