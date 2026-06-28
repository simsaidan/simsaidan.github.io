import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
import { recordVisitorFromGeo } from './visitor-markers.js';

recordVisitorFromGeo(createClient(SUPABASE_URL, SUPABASE_ANON_KEY)).catch((err) =>
  console.error('Could not fetch location:', err)
);
