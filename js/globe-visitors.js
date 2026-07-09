import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
import { addVisitorMarker, fetchVisitorCoords } from './visitor-markers.js';

const Globe = globalThis.Globe ?? window.Globe;

const GLOBE_SPIN_RAD_PER_SEC = 0.3;
const GLOBE_POV = { lat: 20, lng: 20, altitude: 5.2 };

const container = document.getElementById('globeContainer');
const sidebar = document.getElementById('right-sidebar');

let globe = null;
let spinAngle = 0;
let lastSpinTime = 0;
let animationFrameId = null;
let spinning = false;

function isSidebarVisible() {
  return sidebar && getComputedStyle(sidebar).display !== 'none';
}

function getGlobeDimensions() {
  if (!container || !isSidebarVisible()) return null;

  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width === 0 || height === 0) return null;

  return { width, height };
}

function resizeGlobe(instance = globe) {
  const activeGlobe = instance ?? globe;
  const dimensions = getGlobeDimensions();
  if (!activeGlobe || !dimensions) return;

  const { width, height } = dimensions;
  // Use globe.gl's sizing API so renderer, camera, and scene-container stay in sync.
  activeGlobe.width(width).height(height);
}

function spinGlobe(time) {
  if (!globe || !spinning) {
    animationFrameId = null;
    return;
  }

  if (lastSpinTime) {
    spinAngle += GLOBE_SPIN_RAD_PER_SEC * ((time - lastSpinTime) / 1000);
  }
  lastSpinTime = time;

  globe.controls().autoRotate = false;
  globe.pointOfView(
    {
      lat: GLOBE_POV.lat,
      lng: (spinAngle * 180) / Math.PI + GLOBE_POV.lng,
      altitude: GLOBE_POV.altitude,
    },
    0
  );

  animationFrameId = requestAnimationFrame(spinGlobe);
}

function positionGlobeContainer() {
  if (!container) return;
  container.style.left = '';
}

function createGlobe() {
  if (typeof Globe !== 'function' || !container || !isSidebarVisible()) return null;

  const dimensions = getGlobeDimensions();
  if (!dimensions) return null;

  const instance = Globe()(container)
    .width(dimensions.width)
    .height(dimensions.height)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-day.jpg')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png');

  instance.renderer().setClearColor(0x000000, 0);
  instance.scene().background = null;

  instance.camera().position.z = 1300;
  instance.camera().position.y += 50;
  instance.controls().target.set(0, 0, 0);
  instance.controls().update();

  resizeGlobe(instance);

  const resizeObserver = new ResizeObserver(() => resizeGlobe());
  resizeObserver.observe(container);

  spinning = true;
  lastSpinTime = 0;
  animationFrameId = requestAnimationFrame(spinGlobe);
  return instance;
}

async function loadAllMarkers(supabase) {
  const { data, error } = await supabase.from('markers').select('*');
  if (error) {
    console.error(error);
    return;
  }

  globe
    .pointColor(() => 'red')
    .pointAltitude(0.03)
    .pointRadius(0.5)
    .pointsData(data.map((row) => ({ lat: row.lat, lng: row.lng })));
}

function initSupabase() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function initVisitorMarkers() {
    try {
      const { lat, lng } = await fetchVisitorCoords();
      await addVisitorMarker(supabase, lat, lng);
    } catch (err) {
      console.error('Could not fetch location:', err);
    }
    await loadAllMarkers(supabase);
  }

  initVisitorMarkers();

  supabase
    .channel('realtime:public:markers')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'markers' }, (payload) => {
      const newPoint = { lat: payload.new.lat, lng: payload.new.lng };
      const currentData = globe.pointsData();
      globe.pointsData([...currentData, newPoint]);
    })
    .subscribe();
}

function tryInitGlobe() {
  if (globe) return;
  globe = createGlobe();
  if (globe) {
    initSupabase();
    return;
  }

  if (!container || container.dataset.globeRetry) return;
  container.dataset.globeRetry = '1';
  new ResizeObserver(() => tryInitGlobe()).observe(container);
}

function stopGlobeSpin() {
  spinning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  lastSpinTime = 0;
}

function startGlobeSpin() {
  if (!globe) return;
  stopGlobeSpin();
  spinning = true;
  animationFrameId = requestAnimationFrame(spinGlobe);
}

function onSidebarShown() {
  tryInitGlobe();
  positionGlobeContainer();
  requestAnimationFrame(() => {
    resizeGlobe();
    startGlobeSpin();
  });
}

export function initGlobeVisitors() {
  tryInitGlobe();
  window.addEventListener('load', () => {
    tryInitGlobe();
    positionGlobeContainer();
  });

  window.matchMedia('(min-width: 1371px)').addEventListener('change', (event) => {
    if (event.matches) {
      onSidebarShown();
    } else {
      stopGlobeSpin();
    }
  });
}
