import { useState, useEffect } from 'react';
import {
  getUser, setUserName, setUserPlan,
  resetCurrentUser, getUserUsage,
  getPartners, addPartner, removePartner,
  type Partner, type UserProfile,
} from '../lib/userStore';
import { FREE_LIMIT_CONST } from '../lib/usage';

interface AdminPanelProps {
  onClose: () => void;
}

const ADMIN_PASSPHRASE = 'yaM2006@';

// ── tiny helpers ─────────────────────────────────────────────────────────────
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// ── style tokens ─────────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  backdrop: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.94)',
    backdropFilter: 'blur(8px)',
  },
  modal: {
    position: 'relative' as const,
    zIndex: 10,
    width: '100%',
    maxWidth: '36rem',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    background: '#111',
    border: '1px solid #27272a',
    borderRadius: '1rem',
    padding: '2rem',
  },
  input: {
    width: '100%',
    background: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
  },
  btnRed: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '0.75rem',
    padding: '0.65rem 1.25rem',
    fontWeight: 700,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  btnGhost: {
    background: 'transparent',
    border: '1px solid #3f3f46',
    borderRadius: '0.75rem',
    padding: '0.65rem 1.25rem',
    color: '#a1a1aa',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tag: (color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    background: color + '1a',
    color,
    border: `1px solid ${color}33`,
  }),
};

type Tab = 'overview' | 'partners' | 'user';

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passInput, setPassInput]         = useState('');
  const [error, setError]                 = useState('');
  const [toast, setToast]                 = useState('');
  const [tab, setTab]                     = useState<Tab>('overview');

  // overview
  const [user, setUser]   = useState<UserProfile>(getUser());
  const [usage, setUsage] = useState(getUserUsage());

  // partners tab
  const [partners, setPartners]       = useState<Partner[]>(getPartners());
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerNote, setNewPartnerNote] = useState('');

  // user tab
  const [editName, setEditName] = useState(getUser().name);

  useEffect(() => {
    if (authenticated) {
      refresh();
    }
  }, [authenticated, tab]);

  function refresh() {
    const u = getUser();
    setUser(u);
    setUsage(getUserUsage());
    setPartners(getPartners());
    setEditName(u.name);
  }

  function showToast(msg: string, duration = 2800) {
    setToast(msg);
    setTimeout(() => setToast(''), duration);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passInput === ADMIN_PASSPHRASE) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Wrong password. Try again.');
      setPassInput('');
    }
  }

  // ── Overview actions ───────────────────────────────────────────────────────
  function handleGrantPro() {
    setUserPlan('pro');
    refresh();
    showToast('✅ PRO access granted for this device.');
  }

  function handleGrantPartner() {
    setUserPlan('partner');
    refresh();
    showToast('✅ Partner access granted for this device.');
  }

  function handleReset() {
    resetCurrentUser();
    refresh();
    showToast('🔄 Usage & plan reset to FREE.');
  }

  // ── User tab actions ───────────────────────────────────────────────────────
  function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setUserName(editName);
    refresh();
    showToast('✅ Name saved. Will persist across sessions.');
  }

  // ── Partners tab actions ───────────────────────────────────────────────────
  function handleAddPartner(e: React.FormEvent) {
    e.preventDefault();
    if (!newPartnerName.trim()) { showToast('⚠️ Enter a partner name.'); return; }
    addPartner(newPartnerName, newPartnerNote);
    setNewPartnerName('');
    setNewPartnerNote('');
    refresh();
    showToast(`✅ Partner "${newPartnerName.trim()}" added.`);
  }

  function handleRemovePartner(p: Partner) {
    removePartner(p.id);
    refresh();
    showToast(`🗑 "${p.name}" removed from partners.`);
  }

  // ── Plan color ────────────────────────────────────────────────────────────
  const planColors: Record<string, string> = {
    free: '#71717a',
    pro: '#60a5fa',
    partner: '#c084fc',
    admin: '#f87171',
  };

  const planColor = planColors[user.plan] || '#71717a';

  // ── TABS ─────────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview',  icon: '📊' },
    { id: 'partners', label: 'Partners',  icon: '🤝' },
    { id: 'user',     label: 'User',      icon: '👤' },
  ];

  return (
    <div style={S.overlay}>
      <div style={S.backdrop} onClick={onClose} />

      <div style={S.modal}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer', color: '#52525b',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#52525b'}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
            background: '#1c1c1e', border: '1px solid #3f3f46',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>🛡️</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>Admin Panel</div>
            <div style={{ fontSize: '0.7rem', color: '#52525b' }}>Rethumb internal controls</div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'center',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#34d399',
          }}>
            {toast}
          </div>
        )}

        {/* ── Login ── */}
        {!authenticated ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', marginBottom: '0.5rem' }}>
                Admin Password
              </label>
              <input
                type="password"
                value={passInput}
                onChange={e => setPassInput(e.target.value)}
                placeholder="Enter password"
                style={S.input}
                autoFocus
              />
            </div>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
            <button type="submit" style={{ ...S.btnRed, padding: '0.85rem' }}>
              Authenticate
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#3f3f46', margin: 0 }}>
              Restricted access. Authorized personnel only.
            </p>
          </form>
        ) : (
          /* ── Dashboard ── */
          <div>
            {/* Tab bar */}
            <div style={{
              display: 'flex', gap: '0.25rem',
              background: '#18181b', borderRadius: '0.75rem',
              padding: '0.25rem', marginBottom: '1.5rem',
            }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '0.6rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    transition: 'all 0.15s',
                    background: tab === t.id ? '#dc2626' : 'transparent',
                    color: tab === t.id ? '#fff' : '#71717a',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Current device stats */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #27272a',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.75rem' }}>
                    Current Device
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {[
                      { label: 'Prompts Used', value: usage },
                      { label: 'Free Limit',   value: FREE_LIMIT_CONST },
                      { label: 'Plan',         value: user.plan.toUpperCase(), color: planColor },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '0.75rem',
                        padding: '0.875rem',
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: color || '#fff' }}>{value}</div>
                        <div style={{ fontSize: '0.65rem', color: '#52525b', marginTop: '0.25rem' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {user.name && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#71717a' }}>
                      Logged as: <span style={{ color: '#fff', fontWeight: 700 }}>{user.name}</span>
                      <span style={{ ...S.tag('#c084fc'), marginLeft: '0.5rem' }}>
                        ID: {user.id.slice(0, 12)}…
                      </span>
                    </div>
                  )}

                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#3f3f46' }}>
                    Member since {fmt(user.createdAt)}
                  </div>
                </div>

                {/* Role reference */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #27272a',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.75rem' }}>
                    Role System
                  </div>
                  {[
                    { role: 'free',    desc: '3 prompts limit',              color: '#71717a' },
                    { role: 'pro',     desc: 'Unlimited — paid subscriber',   color: '#60a5fa' },
                    { role: 'partner', desc: 'Unlimited — no payment needed', color: '#c084fc' },
                    { role: 'admin',   desc: 'Full access + admin panel',     color: '#f87171' },
                  ].map(({ role, desc, color }) => (
                    <div key={role} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1c1c1e' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color }}>{role}</span>
                      <span style={{ fontSize: '0.75rem', color: '#52525b' }}>{desc}</span>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <button
                    style={{ ...S.btnRed, padding: '0.85rem', width: '100%' }}
                    onClick={handleGrantPro}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#ef4444'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#dc2626'}
                  >
                    ⚡ Grant PRO — This Device
                  </button>
                  <button
                    style={{ ...S.btnGhost, width: '100%' }}
                    onClick={handleGrantPartner}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#c084fc'; el.style.color = '#c084fc'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#3f3f46'; el.style.color = '#a1a1aa'; }}
                  >
                    🤝 Grant Partner Access — This Device
                  </button>
                  <button
                    style={{ ...S.btnGhost, width: '100%' }}
                    onClick={handleReset}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#dc2626'; el.style.color = '#f87171'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#3f3f46'; el.style.color = '#a1a1aa'; }}
                  >
                    🔄 Reset Usage + Plan to FREE
                  </button>
                </div>
              </div>
            )}

            {/* ── PARTNERS TAB ── */}
            {tab === 'partners' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Add partner form */}
                <div style={{
                  background: 'rgba(192,132,252,0.06)',
                  border: '1px solid rgba(192,132,252,0.2)',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c084fc', marginBottom: '0.75rem' }}>
                    ✚ Add New Partner
                  </div>
                  <form onSubmit={handleAddPartner} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <input
                      type="text"
                      value={newPartnerName}
                      onChange={e => setNewPartnerName(e.target.value)}
                      placeholder="Partner name (e.g. John Doe)"
                      style={S.input}
                      required
                    />
                    <input
                      type="text"
                      value={newPartnerNote}
                      onChange={e => setNewPartnerNote(e.target.value)}
                      placeholder="Note / channel / deal (optional)"
                      style={S.input}
                    />
                    <button
                      type="submit"
                      style={{
                        ...S.btnRed,
                        background: '#7c3aed',
                        width: '100%',
                        padding: '0.75rem',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#8b5cf6'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#7c3aed'}
                    >
                      🤝 Add Partner (No Payment Required)
                    </button>
                  </form>
                </div>

                {/* Partners list */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #27272a',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b' }}>
                      Active Partners
                    </div>
                    <div style={S.tag('#c084fc')}>
                      {partners.length} partner{partners.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {partners.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: '#3f3f46', fontSize: '0.85rem' }}>
                      No partners yet. Add one above ↑
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {partners.map(p => (
                        <div
                          key={p.id}
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid #27272a',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1rem',
                          }}
                        >
                          {/* Name row */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '0.1rem' }}>
                                {p.name}
                                <span style={{ ...S.tag('#c084fc'), marginLeft: '0.5rem' }}>partner</span>
                              </div>
                              {p.note && (
                                <div style={{ fontSize: '0.72rem', color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {p.note}
                                </div>
                              )}
                              <div style={{ fontSize: '0.65rem', color: '#3f3f46', marginTop: '0.2rem' }}>
                                Added {fmt(p.addedAt)} · ID: {p.id.slice(0, 10)}…
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemovePartner(p)}
                              title="Remove partner"
                              style={{
                                flexShrink: 0,
                                background: 'rgba(220,38,38,0.1)',
                                border: '1px solid rgba(220,38,38,0.2)',
                                borderRadius: '0.5rem',
                                padding: '0.4rem 0.65rem',
                                color: '#f87171',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(220,38,38,0.25)'; el.style.borderColor = '#dc2626'; }}
                              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(220,38,38,0.1)'; el.style.borderColor = 'rgba(220,38,38,0.2)'; }}
                            >
                              🗑 Remove
                            </button>
                          </div>

                          {/* Access code row */}
                          {p.accessCode && (
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              marginTop: '0.6rem', paddingTop: '0.6rem',
                              borderTop: '1px solid #27272a', gap: '0.5rem',
                            }}>
                              <div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.2rem' }}>
                                  Access Code (share privately)
                                </div>
                                <code style={{
                                  fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em',
                                  color: '#c084fc', background: 'rgba(192,132,252,0.1)',
                                  padding: '0.2rem 0.5rem', borderRadius: '0.35rem',
                                  border: '1px solid rgba(192,132,252,0.2)',
                                }}>
                                  {p.accessCode}
                                </code>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(p.accessCode).then(() => showToast(`📋 Code for "${p.name}" copied!`));
                                }}
                                title="Copy access code"
                                style={{
                                  flexShrink: 0,
                                  background: 'rgba(192,132,252,0.1)',
                                  border: '1px solid rgba(192,132,252,0.25)',
                                  borderRadius: '0.5rem',
                                  padding: '0.4rem 0.75rem',
                                  color: '#c084fc',
                                  cursor: 'pointer',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(192,132,252,0.25)'; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(192,132,252,0.1)'; }}
                              >
                                📋 Copy
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#3f3f46', margin: 0 }}>
                  Partners get unlimited access. Stored locally in this browser.
                </p>
              </div>
            )}

            {/* ── USER TAB ── */}
            {tab === 'user' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Identity card */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #27272a',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.75rem' }}>
                    Persistent Identity (this device)
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#71717a' }}>User ID</span>
                      <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.75rem' }}>{user.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#71717a' }}>Name</span>
                      <span style={{ color: '#fff', fontWeight: 700 }}>{user.name || '— not set —'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#71717a' }}>Plan</span>
                      <span style={{ color: planColor, fontWeight: 700 }}>{user.plan.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#71717a' }}>Usage</span>
                      <span style={{ color: '#fff' }}>{usage} / {user.plan === 'free' ? FREE_LIMIT_CONST : '∞'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#71717a' }}>Member since</span>
                      <span style={{ color: '#fff' }}>{fmt(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Set name form */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #27272a',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.75rem' }}>
                    ✏️ Set Display Name
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#71717a', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    Name is saved locally. Once set, users don't need to re-enter it — it persists across sessions on this device.
                  </p>
                  <form onSubmit={handleSaveName} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Enter your name"
                      style={{ ...S.input, flex: 1 }}
                    />
                    <button type="submit" style={{ ...S.btnRed, whiteSpace: 'nowrap' }}>
                      Save
                    </button>
                  </form>
                </div>

                {/* Persistence note */}
                <div style={{
                  background: 'rgba(96,165,250,0.06)',
                  border: '1px solid rgba(96,165,250,0.15)',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  fontSize: '0.78rem',
                  color: '#93c5fd',
                  lineHeight: 1.6,
                }}>
                  <strong>How persistence works:</strong><br />
                  A unique User ID is generated on first visit and stored in <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: '4px' }}>localStorage</code>.
                  Name, plan, and usage count are all tied to this ID.
                  Users never need to enter an email — they're recognized automatically on return visits.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
