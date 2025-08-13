import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// ---------- Globe Setup ----------
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

// Zoom out and center
globe.camera().position.z = 1300;
camera.position.y += 50;
globe.controls().target.set(0, 0, 0);
globe.controls().update();

// Spin the globe
let angle = 0;
setInterval(() => {
  angle += 0.009;
  globe.controls().autoRotate = false;
  globe.pointOfView({ lat: 0, lng: angle * 180 / Math.PI + 20, altitude: 5.2 }, 0);
}, 30);

window.addEventListener('load', () => {
  const pageWidth = window.innerWidth;        // Get page width
  const desiredWidth = -1 * pageWidth + 795;
  const myglobe = document.getElementById('globeContainer');
  myblobe.style.left = desiredWidth + 'px';   // Set width dynamically
});

// ---------- Supabase Setup ----------
const SUPABASE_URL = 'https://fivdlwpvvysahzxtnnej.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdmRsd3B2dnlzYWh6eHRubmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Njc4NzAsImV4cCI6MjA3MDQ0Mzg3MH0.JvzGYMnZMJul2kUxE1hunbGIoOcQ_dfdhAjSb6IOk5w'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Load all markers from DB
async function loadAllMarkers() {
  const { data, error } = await supabase.from('markers').select('*');
  if (error) {
    console.error(error);
    return;
  }

  globe
    .pointColor(() => 'red')
    .pointAltitude(0.03)
    .pointRadius(0.5)
    .pointsData(data.map(row => ({ lat: row.lat, lng: row.lng })));
}

// Add visitor location to DB
function roundCoord(value) {
  return Math.round(value * 1000) / 1000; // 3 decimal places
}

async function addVisitorLocation(lat, lng) {
  const rLat = roundCoord(lat);
  const rLng = roundCoord(lng);
  const { error } = await supabase.from('markers').insert([{ lat: rLat, lng: rLng }]);
  if (error && error.code === '23505') {
    console.log('Marker already exists for this location.');
  } else if (error) {
    console.error(error);
  }
}

// Get visitor location via IP API, save to DB, then load all markers
fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then(async location => {
    const lat = location.latitude;
    const lng = location.longitude;
    await addVisitorLocation(lat, lng);
    await loadAllMarkers();
  })
  .catch(err => console.error('Could not fetch location:', err));

// ---------- Optional: Realtime Updates ----------
supabase.channel('realtime:public:markers')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'markers' }, payload => {
    const newPoint = { lat: payload.new.lat, lng: payload.new.lng };
    const currentData = globe.pointsData();
    globe.pointsData([...currentData, newPoint]);
  })
  .subscribe();
