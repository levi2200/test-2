import { useState } from 'react';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import HomePage from './pages/HomePage';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar onAdminClick={() => setShowAdmin(true)} />
      <HomePage />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #18181b', marginTop: '4rem', padding: '2rem 1.25rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.875rem', color: '#3f3f46' }}>
          <span style={{ fontWeight: 900, color: '#71717a' }}>
            Re<span style={{ color: '#dc2626' }}>thumb</span>
          </span>
          <span>Professional YouTube thumbnail prompt generator</span>
          <a
            href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0DW84387YH059613JNG74QAQ"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ef4444', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f87171')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
          >
            ⚡ Upgrade to PRO
          </a>
        </div>
      </footer>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
