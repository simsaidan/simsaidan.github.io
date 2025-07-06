const contactGlobe = Globe()
  (document.getElementById('miniGlobe'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .pointColor(() => '#ff5722')
  .pointAltitude(0.01)
  .pointRadius(0.25)
  .pointsData([
    { lat: 37.7749, lng: -122.4194 }, // SF
    { lat: 40.7128, lng: -74.0060 }   // NY
  ]);

contactGlobe.controls().autoRotate = true;
contactGlobe.controls().autoRotateSpeed = 0.5;
