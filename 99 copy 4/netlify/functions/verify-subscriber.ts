// netlify/functions/verify-subscriber.ts
// Called by the frontend PaywallModal to check if a given PayPal email
// has an active subscription in Supabase. Returns { active: boolean }.

import type { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let email = '';
  try {
    const body = JSON.parse(event.body ?? '{}');
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!email) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'email required' }) };
  }

  const { data, error } = await supabase
    .from('subscribers')
    .select('status')
    .eq('paypal_email', email)
    .single();

  if (error || !data) {
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ active: false }) };
  }

  const active = data.status === 'active';
  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ active }) };
};
