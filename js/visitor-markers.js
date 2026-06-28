import { GEO_API_URL } from './supabase-config.js';

export function roundCoord(value) {
  return Math.round(value * 1000) / 1000;
}

export async function fetchVisitorCoords() {
  const res = await fetch(GEO_API_URL);
  if (!res.ok) {
    throw new Error(`Geo lookup failed: ${res.status}`);
  }
  const data = await res.json();
  const lat = parseFloat(data.latitude);
  const lng = parseFloat(data.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error('Geo lookup returned invalid coordinates');
  }
  return { lat, lng };
}

export async function addVisitorMarker(supabase, lat, lng) {
  const { error } = await supabase.from('markers').insert([
    { lat: roundCoord(lat), lng: roundCoord(lng) },
  ]);
  if (error && error.code === '23505') {
    console.log('Marker already exists for this location.');
  } else if (error) {
    console.error(error);
  }
}

export async function recordVisitorFromGeo(supabase) {
  const { lat, lng } = await fetchVisitorCoords();
  await addVisitorMarker(supabase, lat, lng);
}
