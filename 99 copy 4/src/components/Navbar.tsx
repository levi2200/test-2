import { useState, useEffect } from 'react';
import { getUser, type UserPlan } from '../lib/userStore';

interface NavbarProps {
  onAdminClick: () => void;
}

const planBadge: Record<UserPlan, { label: string; color: string; bg: string; border: string }> = {
  free:    { label: 'Free Trial', color: '#f87171', bg: 'rgba(220,38,38,0.12)',    border: 'rgba(220,38,38,0.25)'    },
  pro:     { label: '⚡ PRO',     color: '#34d399', bg: 'rgba(16,185,129,0.12)',   border: 'rgba(16,185,129,0.25)'   },
  partner: { label: '🤝 Partner', color: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.25)'  },
  admin:   { label: '🛡 Admin',   color: '#f87171', bg: 'rgba(220,38,38,0.15)',    border: 'rgba(220,38,38,0.35)'    },
};

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [user, setUser] = useState(getUser());

  // Re-read on focus so badge updates after admin panel closes
  useEffect(() => {
    function onFocus() { setUser(getUser()); }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const badge = planBadge[user.plan] ?? planBadge.free;

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(39,39,42,0.7)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center glow-red"
            style={{ background: '#dc2626' }}
          >
            <span className="text-white font-black text-sm">RT</span>
          </div>
          <span className="font-black text-xl tracking-tight">
            Re<span style={{ color: '#ef4444' }}>thumb</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* User name if set */}
          {user.name && (
            <span style={{ fontSize: '0.8rem', color: '#71717a', fontWeight: 500 }}>
              {user.name}
            </span>
          )}

          {/* Plan badge */}
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
            }}
          >
            {badge.label}
          </span>

          {/* Admin trigger */}
          <button
            onClick={onAdminClick}
            className="text-xs font-medium px-2 py-1 rounded transition-colors"
            style={{ color: '#52525b', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a1a1aa'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#52525b'}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
