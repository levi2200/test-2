// netlify/functions/paypal-webhook.ts
// Handles PayPal IPN (Instant Payment Notification) — no API keys required.
// Configure the IPN URL in your PayPal Account:
//   paypal.com → Settings (⚙️) → Notifications → Instant payment notifications
//   → Set URL to: https://YOUR-SITE.netlify.app/.netlify/functions/paypal-webhook

import type { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PayPal IPN verification endpoints
const IPN_VERIFY_URL = 'https://ipnpb.paypal.com/cgi-bin/webscr';
// Use sandbox for testing: 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr'

// Subscription statuses that mean the user should have PRO access
const ACTIVE_STATUSES = new Set(['Active', 'Created', 'Reactivated']);

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const rawBody = event.body ?? '';

  // ── Step 1: Echo back to PayPal for verification ──────────────────────────
  const verifyBody = 'cmd=_notify-validate&' + rawBody;
  let verifyResult = '';
  try {
    const verifyRes = await fetch(IPN_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'rethumb-ipn-handler/1.0',
      },
      body: verifyBody,
    });
    verifyResult = await verifyRes.text();
  } catch (err) {
    console.error('IPN verification fetch failed:', err);
    return { statusCode: 500, body: 'Verification request failed' };
  }

  if (verifyResult !== 'VERIFIED') {
    console.warn('IPN not verified. PayPal returned:', verifyResult);
    return { statusCode: 400, body: 'IPN not verified' };
  }

  // ── Step 2: Parse IPN params ──────────────────────────────────────────────
  const params = new URLSearchParams(rawBody);
  const txnType       = params.get('txn_type') ?? '';
  const subscrId      = params.get('subscr_id') ?? '';        // subscription ID
  const payerEmail    = (params.get('payer_email') ?? '').toLowerCase();
  const subscriptionStatus = params.get('subscr_signup_id') ?? '';

  console.log(`IPN event: ${txnType}, subscr_id: ${subscrId}, email: ${payerEmail}`);

  // ── Step 3: Handle subscription lifecycle events ──────────────────────────
  if (txnType === 'subscr_signup' || txnType === 'subscr_payment') {
    // New subscription or recurring payment — activate
    if (!payerEmail) {
      console.error('No payer_email in IPN, skipping');
      return { statusCode: 200, body: 'OK' };
    }
    const { error } = await supabase.from('subscribers').upsert(
      {
        paypal_email: payerEmail,
        paypal_subscription_id: subscrId,
        status: 'active',
      },
      { onConflict: 'paypal_email' }
    );
    if (error) console.error('Supabase upsert error:', error.message);
  }

  if (txnType === 'subscr_cancel' || txnType === 'subscr_eot' || txnType === 'subscr_failed') {
    // Cancelled, end-of-term, or failed payment — deactivate
    const { error } = await supabase
      .from('subscribers')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('paypal_subscription_id', subscrId);
    if (error) console.error('Supabase update error:', error.message);
  }

  return { statusCode: 200, body: 'OK' };
};
