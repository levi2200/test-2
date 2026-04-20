import { useState } from 'react';
import { FREE_LIMIT_CONST, setProAccess } from '../lib/usage';
import { redeemAccessCode } from '../lib/userStore';

interface PaywallModalProps {
  onClose: () => void;
  onUnlocked: () => void;
}

const PAYPAL_LINK =
  'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0DW84387YH059613JNG74QAQ';

export default function PaywallModal({ onClose, onUnlocked }: PaywallModalProps) {
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Partner code state
  const [showPartnerCode, setShowPartnerCode] = useState(false);
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerError, setPartnerError] = useState('');
  const [partnerSuccess, setPartnerSuccess] = useState(false);

  function handleDemoUnlock() {
    setProAccess();
    onUnlocked();
  }

  function handlePartnerCodeSubmit() {
    const trimmed = partnerCode.trim().toUpperCase();
    if (!trimmed) {
      setPartnerError('Please enter your access code.');
      return;
    }
    const success = redeemAccessCode(trimmed);
    if (success) {
      setPartnerSuccess(true);
      setPartnerError('');
      setTimeout(() => onUnlocked(), 900);
    } else {
      setPartnerError('Invalid code. Please check with your admin.');
    }
  }

  async function handleEmailUnlock() {
    if (!email.trim()) {
      setEmailError('Please enter your PayPal email.');
      return;
    }
    setChecking(true);
    setEmailError('');
    try {
      const res = await fetch('/.netlify/functions/verify-subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.active) {
        setProAccess();
        onUnlocked();
      } else {
        setEmailError('No active subscription found for this email. Please subscribe first.');
      }
    } catch {
      setEmailError('Could not verify. Please check your connection and try again.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-8 animate-in"
        style={{ background: '#111', border: '1px solid #27272a' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: '#52525b' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#52525b')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Lock icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto"
          style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.25)',
          }}
        >
          <span className="text-3xl">🔒</span>
        </div>

        <h2 className="text-2xl font-black text-center mb-2">
          You've used your{' '}
          <span style={{ color: '#ef4444' }}>{FREE_LIMIT_CONST} free</span>{' '}
          prompts
        </h2>
        <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: '#71717a' }}>
          Upgrade to <strong className="text-white">Rethumb PRO</strong> for unlimited prompts,
          all styles, all niches, and all formats — forever.
        </p>

        {/* Plan card */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(127,0,0,0.2), #18181b)',
            border: '1px solid rgba(220,38,38,0.35)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-black text-xl text-white">PRO Plan</div>
              <div className="text-sm" style={{ color: '#71717a' }}>Unlimited everything</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">$2</div>
              <div className="text-xs" style={{ color: '#71717a' }}>/ month</div>
            </div>
          </div>

          <ul className="space-y-2 mb-5">
            {[
              '✅ Unlimited prompt generations',
              '✅ All 8 cinematic thumbnail styles',
              '✅ All 10 niches',
              '✅ All aspect ratios (16:9, 9:16, 1:1, 4:5)',
              '✅ Midjourney, DALL·E & Firefly modes',
              '✅ Safe mode filter',
              '✅ Priority updates',
            ].map((item) => (
              <li key={item} className="text-sm" style={{ color: '#d4d4d8' }}>
                {item}
              </li>
            ))}
          </ul>

          {/* PayPal button */}
          <a
            href={PAYPAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center block py-3.5 px-6 rounded-xl font-bold text-white transition-all pulse-red"
            style={{ background: '#dc2626' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#ef4444')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#dc2626')}
          >
            ⚡ Upgrade with PayPal — $2/mo
          </a>
        </div>

        {/* Already subscribed — email unlock */}
        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: '#18181b', border: '1px solid #27272a' }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: '#71717a' }}>
            Already subscribed? Enter your PayPal email to unlock PRO
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailUnlock()}
              placeholder="your@paypal.email"
              className="flex-1 rounded-lg px-3 py-2 text-sm text-white outline-none"
              style={{
                background: '#0f0f0f',
                border: '1px solid #3f3f46',
              }}
            />
            <button
              onClick={handleEmailUnlock}
              disabled={checking}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
              style={{ background: checking ? '#3f3f46' : '#22c55e', minWidth: '72px' }}
            >
              {checking ? '…' : 'Unlock'}
            </button>
          </div>
          {emailError && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{emailError}</p>
          )}
        </div>

        {/* Partner Code */}
        <div className="mb-3">
          <button
            onClick={() => { setShowPartnerCode(!showPartnerCode); setPartnerError(''); setPartnerCode(''); }}
            className="w-full text-center text-xs py-1 transition-colors"
            style={{ color: '#52525b' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#a1a1aa')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#52525b')}
          >
            🤝 Have a partner access code?
          </button>

          {showPartnerCode && (
            <div
              className="rounded-xl p-4 mt-2"
              style={{ background: '#18181b', border: '1px solid #27272a' }}
            >
              {partnerSuccess ? (
                <p className="text-center text-sm font-bold" style={{ color: '#22c55e' }}>
                  ✅ Access granted! Welcome, partner.
                </p>
              ) : (
                <>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#71717a' }}>
                    Enter your access code to unlock partner access
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={partnerCode}
                      onChange={(e) => { setPartnerCode(e.target.value); setPartnerError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handlePartnerCodeSubmit()}
                      placeholder="e.g. RTHM-AB12-CD34"
                      className="flex-1 rounded-lg px-3 py-2 text-sm text-white outline-none font-mono tracking-widest"
                      style={{
                        background: '#0f0f0f',
                        border: '1px solid #3f3f46',
                      }}
                    />
                    <button
                      onClick={handlePartnerCodeSubmit}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
                      style={{ background: '#7c3aed', minWidth: '72px' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#8b5cf6')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#7c3aed')}
                    >
                      Unlock
                    </button>
                  </div>
                  {partnerError && (
                    <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{partnerError}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Demo unlock */}
        <button
          onClick={handleDemoUnlock}
          className="w-full text-center text-xs py-2 transition-colors"
          style={{ color: '#3f3f46' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#71717a')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#3f3f46')}
        >
          [Demo] Unlock PRO locally for testing
        </button>
      </div>
    </div>
  );
}
