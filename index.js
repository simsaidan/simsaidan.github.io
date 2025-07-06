window.addEventListener('DOMContentLoaded', () => {
  // Only create globe if the globeViz div exists
  const globeContainer = document.getElementById('globeViz');
  if (globeContainer) {
    const globe = Globe()
      (globeContainer)
      .globeImageUrl(null)           // No surface image: hollow
      .showGraticules(true)          // Show latitude/longitude lines
      .graticuleColor('#4b9cd3')     // Customize grid color if you want
      .atmosphereColor('rgba(0,0,0,0)') // No atmosphere
      .atmosphereAltitude(0)
      .backgroundColor('rgba(0,0,0,0)'); // Transparent background
  }
});