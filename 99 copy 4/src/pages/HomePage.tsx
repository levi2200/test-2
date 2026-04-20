import { useState, useRef, useCallback } from 'react';
import StyleCard from '../components/StyleCard';
import PaywallModal from '../components/PaywallModal';
import {
  STYLES_MAP,
  STYLES_LIST,
  NICHES,
  FORMATS,
  PLATFORMS,
  applySafeMode,
  getPlatformSuffix,
  FACE_LOCK,
  type StyleId,
  type Niche,
  type Format,
  type Platform,
} from '../lib/styles';
import { pickCinemaElements, pickCinemaElementsExcluding, type CinemaSelection } from '../lib/cinema';
import { canGenerate, incrementUsage, remainingFree } from '../lib/usage';
import { userHasUnlimitedAccess } from '../lib/userStore';

/* ── Style tokens ──────────────────────────────────────────────── */
const C = {
  card: { background: '#111', border: '1px solid #27272a', borderRadius: '1rem' },
  input: {
    background: '#18181b', border: '1px solid #3f3f46', color: '#fff',
    borderRadius: '0.75rem', padding: '0.75rem 1rem', width: '100%',
    outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem',
  },
  select: {
    background: '#18181b', border: '1px solid #3f3f46', color: '#fff',
    borderRadius: '0.75rem', padding: '0.75rem 1rem', width: '100%',
    outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
    appearance: 'none' as const, WebkitAppearance: 'none' as const,
  },
  label: {
    display: 'block', fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase' as const, letterSpacing: '0.08em',
    color: '#71717a', marginBottom: '0.5rem',
  },
  btnPrimary: {
    background: '#dc2626', color: '#fff', fontWeight: 700,
    padding: '0.875rem 2rem', borderRadius: '0.75rem', border: 'none',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    gap: '0.5rem', fontSize: '1rem', transition: 'background 0.15s',
  },
  btnCopy: (copied: boolean) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem',
    fontWeight: 600, cursor: 'pointer',
    border: copied ? '1px solid rgba(16,185,129,0.4)' : '1px solid #3f3f46',
    background: copied ? 'rgba(16,185,129,0.1)' : '#18181b',
    color: copied ? '#34d399' : '#d4d4d8', transition: 'all 0.15s',
  }),
  promptBox: {
    background: '#0a0a0a', border: '1px solid #27272a', borderRadius: '1rem',
    padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.82rem',
    color: '#e4e4e7', whiteSpace: 'pre-wrap' as const, lineHeight: 1.8,
    minHeight: '220px',
  },
  chip: (color: string) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    background: color, borderRadius: '0.4rem', padding: '0.2rem 0.55rem',
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
  }),
};

/* ── Cinema Panel ──────────────────────────────────────────────── */
function CinemaDebugPanel({
  cinema,
  regenFlash,
  regenCount,
}: {
  cinema: CinemaSelection;
  regenFlash: boolean;
  regenCount: number;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      ...C.card,
      overflow: 'hidden',
      marginTop: '0.75rem',
      transition: 'box-shadow 0.3s, border-color 0.3s',
      boxShadow: regenFlash ? '0 0 0 2px rgba(220,38,38,0.4), 0 0 20px rgba(220,38,38,0.1)' : 'none',
      borderColor: regenFlash ? 'rgba(220,38,38,0.4)' : '#27272a',
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.85rem 1.1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#dc2626', letterSpacing: '0.1em' }}>
            🎬 CINEMA INTELLIGENCE
          </span>
          {regenCount > 0 ? (
            <span style={{
              fontSize: '0.62rem', fontWeight: 800, color: '#f87171',
              background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)',
              padding: '0.15rem 0.5rem', borderRadius: '9999px', letterSpacing: '0.05em',
            }}>
              ↺ RESHUFFLED #{regenCount}
            </span>
          ) : (
            <span style={{ fontSize: '0.65rem', color: '#52525b', fontWeight: 500 }}>
              — auto-selected for your topic
            </span>
          )}
        </div>
        <span style={{ color: '#52525b', fontSize: '0.75rem', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>

      {open && (
        <div style={{ padding: '0 1.1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Background — full-width banner, topic-derived */}
          <div style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '0.6rem',
            padding: '0.75rem 1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1rem' }}>🌍</span>
              <span style={C.chip('rgba(16,185,129,0.15)')}>
                <span style={{ color: '#34d399' }}>BACKGROUND</span>
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981' }}>{cinema.background.label}</span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.58rem', fontWeight: 800, color: '#34d399',
                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                padding: '0.1rem 0.45rem', borderRadius: '9999px', letterSpacing: '0.08em',
              }}>📍 TOPIC-DERIVED</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#a1a1aa', lineHeight: 1.65, margin: 0 }}>
              {cinema.background.prompt.slice(0, 220)}…
            </p>
          </div>

          {/* 4-column grid for the other elements */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.6rem' }}>

            {/* Expression */}
            <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '0.6rem', padding: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '1rem' }}>😮</span>
                <span style={C.chip('rgba(220,38,38,0.15)')}>
                  <span style={{ color: '#f87171' }}>EXPRESSION</span>
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#dc2626', marginLeft: 'auto' }}>{cinema.expression.label}</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#71717a', lineHeight: 1.6, margin: 0 }}>
                {cinema.expression.prompt.slice(0, 120)}…
              </p>
            </div>

            {/* Camera */}
            <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.6rem', padding: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '1rem' }}>📷</span>
                <span style={C.chip('rgba(59,130,246,0.15)')}>
                  <span style={{ color: '#60a5fa' }}>CAMERA ANGLE</span>
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', marginLeft: 'auto' }}>{cinema.camera.label}</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#71717a', lineHeight: 1.6, margin: 0 }}>
                {cinema.camera.prompt.slice(0, 120)}…
              </p>
            </div>

            {/* Text in Environment */}
            <div style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '0.6rem', padding: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '1rem' }}>✍️</span>
                <span style={C.chip('rgba(234,179,8,0.15)')}>
                  <span style={{ color: '#facc15' }}>TEXT IN SCENE</span>
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#eab308', marginLeft: 'auto' }}>{cinema.textEnv.label}</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#71717a', lineHeight: 1.6, margin: 0 }}>
                {cinema.textEnv.prompt.slice(0, 120)}…
              </p>
            </div>

            {/* Color Grade */}
            <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '0.6rem', padding: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '1rem' }}>🎨</span>
                <span style={C.chip('rgba(168,85,247,0.15)')}>
                  <span style={{ color: '#c084fc' }}>COLOR GRADE</span>
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#a855f7', marginLeft: 'auto' }}>{cinema.colorGrade.label}</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#71717a', lineHeight: 1.6, margin: 0 }}>
                {cinema.colorGrade.prompt.slice(0, 120)}…
              </p>
            </div>

          </div>

          <p style={{ fontSize: '0.67rem', color: '#3f3f46', margin: 0, textAlign: 'center' }}>
            Background is read directly from your topic. All 5 elements matched via keyword intelligence — not random, not static.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleId>('auto');
  const [niche, setNiche] = useState<Niche>('general');
  const [format, setFormat] = useState<Format>('16:9');
  const [platform, setPlatform] = useState<Platform>('midjourney');
  const [safeMode, setSafeMode] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [cinema, setCinema] = useState<CinemaSelection | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(() => remainingFree());
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenCount, setRegenCount] = useState(0);        // how many times regenerated
  const [regenFlash, setRegenFlash] = useState(false);    // triggers flash animation
  // Track the resolved style used (so regen can use same style)
  const [resolvedStyle, setResolvedStyle] = useState<StyleId>('mrbeast');

  const promptRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(() => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      // Resolve actual style (auto delegates internally)
      // Resolve the actual style (auto delegates internally)
      const computedStyle: StyleId =
        selectedStyle === 'auto'
          ? ((): StyleId => {
              const t = topic.toLowerCase();
              if (/survive|day|jungle|island|wild|challenge/.test(t)) return 'mrbeast';
              if (/secret|truth|expos|inside|reveal|hidden|leak/.test(t)) return 'hunter';
              if (/million|money|earn|income|rich|profit|revenue/.test(t)) return 'revenue';
              if (/transform|before|after|change|glow|upgrade/.test(t)) return 'beforeafter';
              if (/night|private|sneak|trespass|abandon|ghost|forbidden/.test(t)) return 'splitnight';
              if (/caught|arrest|police|security/.test(t)) return 'caught';
              if (/confess|admit|sorry|regret|mistake/.test(t)) return 'confession';
              if (/overwhelm|chaos|too much|everything|100/.test(t)) return 'overwhelmed';
              return 'mrbeast';
            })()
          : selectedStyle;

      const cinemaResult = pickCinemaElements(topic.trim(), computedStyle, niche);
      const styleDef = STYLES_MAP[selectedStyle] || STYLES_MAP.auto;
      let result = styleDef.template(topic.trim(), niche, format, cinemaResult);

      if (safeMode) result = applySafeMode(result);
      result += FACE_LOCK;
      result += getPlatformSuffix(platform);

      setCinema(cinemaResult);
      setResolvedStyle(computedStyle);
      setRegenCount(0); // reset regen counter on fresh generate

      console.log('[Rethumb Cinema Debug]', {
        topic,
        style: computedStyle,
        niche,
        format,
        platform,
        expression: cinemaResult.expression.label,
        camera: cinemaResult.camera.label,
        textEnv: cinemaResult.textEnv.label,
        colorGrade: cinemaResult.colorGrade.label,
        fullPrompt: result,
      });

      if (canGenerate()) {
        const newCount = incrementUsage();
        setPrompt('Generate ' + result);
        setShowPrompt(true);
        setIsBlurred(false);
        setRemaining(Math.max(0, 3 - newCount));
      } else {
        setPrompt('Generate ' + result);
        setShowPrompt(true);
        setIsBlurred(true);
        setShowPaywall(true);
      }

      setIsGenerating(false);
      setTimeout(() => promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
    }, 700);
  }, [topic, selectedStyle, niche, format, platform, safeMode]);

  function handleCopy() {
    if (!prompt || isBlurred) return;
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  function handleProUnlocked() {
    setShowPaywall(false);
    setIsBlurred(false);
    setRemaining(Infinity);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate();
  }

  /** Regenerate: reshuffles ALL 4 cinema elements, never repeats prev combo.
   *  Does NOT cost a free credit — it's a variation on the same generation. */
  function handleRegenerate() {
    if (!cinema || isRegenerating || isBlurred) return;
    setIsRegenerating(true);

    setTimeout(() => {
      // Pick a completely different cinema combo
      const newCinema = pickCinemaElementsExcluding(cinema, topic.trim(), resolvedStyle, niche);
      setCinema(newCinema);
      setRegenCount((c) => c + 1);

      // Rebuild the prompt with the new cinema elements injected
      const styleDef = STYLES_MAP[resolvedStyle] || STYLES_MAP.auto;
      let result = styleDef.template(topic.trim(), niche, format, newCinema);
      if (safeMode) result = applySafeMode(result);
      result += FACE_LOCK;
      result += getPlatformSuffix(platform);

      setPrompt('Generate ' + result);

      // Flash the panel to signal a change
      setRegenFlash(true);
      setTimeout(() => setRegenFlash(false), 600);

      setIsRegenerating(false);

      console.log('[Rethumb Regenerate]', {
        variation: regenCount + 1,
        newExpression:  newCinema.expression.label,
        newCamera:      newCinema.camera.label,
        newTextEnv:     newCinema.textEnv.label,
        newColorGrade:  newCinema.colorGrade.label,
      });
    }, 450);
  }

  const isPro = userHasUnlimitedAccess();

  return (
    <main style={{ maxWidth: '76rem', margin: '0 auto', padding: '2.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.9rem', borderRadius: '9999px', marginBottom: '1.25rem' }}>
          <span style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '9999px', animation: 'pulseRed 2s infinite' }} />
          Thumbnail Prompt Generator
        </div>

        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
          Turn your idea into a{' '}
          <span className="text-gradient">cinematic prompt</span>
        </h1>

        <p style={{ color: '#71717a', fontSize: '1.05rem', maxWidth: '42rem', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
          The system auto-selects the perfect <strong style={{ color: '#d4d4d8' }}>expression</strong>, <strong style={{ color: '#d4d4d8' }}>camera angle</strong>, <strong style={{ color: '#d4d4d8' }}>text style</strong>, and <strong style={{ color: '#d4d4d8' }}>color grade</strong> based on your topic — not templates, real intelligence.
        </p>

        {/* Usage pill */}
        {!isPro ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#18181b', border: '1px solid #27272a', borderRadius: '9999px', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <span style={{ color: '#71717a' }}>Free prompts remaining:</span>
            <span style={{ fontWeight: 700, color: remaining === 0 ? '#f87171' : remaining === 1 ? '#fbbf24' : '#34d399' }}>
              {remaining}/3
            </span>
            <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '9999px', background: i < (3 - remaining) ? '#ef4444' : '#3f3f46', transition: 'background 0.3s' }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', fontSize: '0.875rem', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '9999px' }}>
            ⚡ PRO — Unlimited prompts active
          </div>
        )}
      </section>

      {/* ── INTELLIGENCE LEGEND ──────────────────────────────────── */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
          {[
            { icon: '😮', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)', label: 'Expression', count: '20', desc: 'Face states' },
            { icon: '📷', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', label: 'Camera Angle', count: '12', desc: 'Shot types' },
            { icon: '✍️', color: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)', label: 'Text in Scene', count: '12', desc: 'Env. styles' },
            { icon: '🎨', color: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', label: 'Color Grade', count: '14', desc: 'Cinematic LUTs' },
          ].map(({ icon, color, bg, border, label, count, desc }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color }}>{count}</span>
                  <span style={{ fontSize: '0.65rem', color, fontWeight: 700, opacity: 0.7 }}>{desc}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.72rem', color: '#3f3f46', textAlign: 'center', marginTop: '0.6rem' }}>
          All 4 elements are auto-selected per topic — zero static prompts, zero repetition.
        </p>
      </section>

      {/* ── STYLE PICKER ─────────────────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>Choose a Style</h2>
          <span style={{ background: '#27272a', color: '#71717a', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #3f3f46' }}>
            {STYLES_LIST.length} styles
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '0.75rem' }}>
          {STYLES_LIST.map((style) => (
            <StyleCard key={style.id} style={style} selected={selectedStyle === style.id} onSelect={(id) => setSelectedStyle(id as StyleId)} />
          ))}
        </div>
      </section>

      {/* ── INPUTS ───────────────────────────────────────────────── */}
      <section style={{ ...C.card, padding: '1.75rem' }}>

        {/* Topic */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={C.label}>Your Video Topic / Title</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I Survived 100 Days in the Amazon Jungle..."
            rows={3}
            style={{ ...C.input, resize: 'none', lineHeight: 1.65 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#dc2626')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#3f3f46')}
          />
          <p style={{ fontSize: '0.72rem', color: '#3f3f46', marginTop: '0.4rem' }}>
            Tip: Press <kbd style={{ background: '#27272a', color: '#71717a', padding: '0 4px', borderRadius: 4, fontSize: '0.7rem' }}>Ctrl+Enter</kbd> to generate instantly
          </p>
        </div>

        {/* Selects */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Niche / Category', value: niche, onChange: (v: string) => setNiche(v as Niche), options: NICHES },
            { label: 'Aspect Ratio', value: format, onChange: (v: string) => setFormat(v as Format), options: FORMATS },
            { label: 'AI Platform', value: platform, onChange: (v: string) => setPlatform(v as Platform), options: PLATFORMS },
          ].map(({ label, value, onChange, options }) => (
            <div key={label}>
              <label style={C.label}>{label}</label>
              <div style={{ position: 'relative' }}>
                <select value={value} onChange={(e) => onChange(e.target.value)} style={C.select}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#dc2626')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#3f3f46')}
                >
                  {options.map((o: { value: string; label: string }) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#52525b' }}>▾</div>
              </div>
            </div>
          ))}
        </div>

        {/* Safe mode + Generate */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }} onClick={() => setSafeMode(!safeMode)}>
              <div style={{ width: 44, height: 24, borderRadius: '9999px', background: safeMode ? '#dc2626' : '#3f3f46', transition: 'background 0.2s' }} />
              <div style={{ position: 'absolute', top: 4, left: 4, width: 16, height: 16, borderRadius: '9999px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)', transition: 'transform 0.2s', transform: safeMode ? 'translateX(20px)' : 'translateX(0)' }} />
            </div>
            <span style={{ fontSize: '0.875rem', color: '#a1a1aa', userSelect: 'none' }}>
              Safe Mode <span style={{ marginLeft: 6, fontSize: '0.72rem', color: '#52525b' }}>(filter flagged words)</span>
            </span>
          </label>

          <button
            onClick={generate}
            disabled={isGenerating || !topic.trim()}
            className="glow-red"
            style={{ ...C.btnPrimary, marginLeft: 'auto', opacity: isGenerating || !topic.trim() ? 0.45 : 1, cursor: isGenerating || !topic.trim() ? 'not-allowed' : 'pointer' }}
            onMouseEnter={(e) => { if (!isGenerating && topic.trim()) (e.currentTarget as HTMLElement).style.background = '#ef4444'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#dc2626'; }}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin" style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing topic…
              </>
            ) : (
              <>
                <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Prompt
              </>
            )}
          </button>
        </div>
      </section>

      {/* ── PROMPT OUTPUT ────────────────────────────────────────── */}
      {showPrompt && (
        <section className="animate-in" ref={promptRef}>

          {/* Cinema debug panel */}
          {cinema && !isBlurred && <CinemaDebugPanel cinema={cinema} regenFlash={regenFlash} regenCount={regenCount} />}

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 0 0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>Your Prompt</h2>
              {[selectedStyle, format, niche].map((tag) => (
                <span key={tag} style={{ background: '#1c1c1c', color: '#71717a', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #27272a', textTransform: 'capitalize' }}>
                  {tag}
                </span>
              ))}
              {regenCount > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '9999px', letterSpacing: '0.05em' }}>
                  ↺ Variation #{regenCount}
                </span>
              )}
            </div>

            {/* Action buttons row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Regenerate button — only visible after first generation, not blurred */}
              {!isBlurred && (
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  title="Didn't like it? Reshuffle all 4 cinema elements for a completely different variation"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 0.9rem', borderRadius: '0.75rem', fontSize: '0.82rem',
                    fontWeight: 700, cursor: isRegenerating ? 'not-allowed' : 'pointer',
                    border: '1px solid rgba(220,38,38,0.35)',
                    background: isRegenerating ? 'rgba(220,38,38,0.05)' : 'rgba(220,38,38,0.1)',
                    color: isRegenerating ? '#52525b' : '#f87171',
                    transition: 'all 0.15s',
                    opacity: isRegenerating ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => { if (!isRegenerating) { (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.2)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,38,38,0.6)'; }}}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,38,38,0.35)'; }}
                >
                  {isRegenerating ? (
                    <>
                      <svg className="animate-spin" style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Reshuffling…
                    </>
                  ) : (
                    <>
                      <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </>
                  )}
                </button>
              )}

              <button onClick={handleCopy} disabled={isBlurred} style={C.btnCopy(copied)}>
                {copied ? (
                  <>
                    <svg style={{ width: 15, height: 15 }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt box */}
          <div style={{ position: 'relative' }}>
            <div style={{
              ...C.promptBox,
              filter: isBlurred ? 'blur(7px)' : 'none',
              userSelect: isBlurred ? 'none' : 'auto',
              pointerEvents: isBlurred ? 'none' : 'auto',
              transition: 'filter 0.3s, box-shadow 0.3s, border-color 0.3s',
              boxShadow: regenFlash ? '0 0 0 2px rgba(220,38,38,0.5), 0 0 24px rgba(220,38,38,0.15)' : 'none',
              borderColor: regenFlash ? 'rgba(220,38,38,0.4)' : '#27272a',
            }}>
              {prompt}
            </div>

            {isBlurred && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                  <p style={{ fontWeight: 700, color: '#fff' }}>Free limit reached</p>
                  <p style={{ color: '#71717a', fontSize: '0.875rem', marginTop: '0.25rem' }}>Upgrade to PRO to see & copy all prompts</p>
                </div>
                <button onClick={() => setShowPaywall(true)} className="pulse-red" style={{ ...C.btnPrimary, fontSize: '0.9rem' }}>
                  ⚡ Unlock PRO — $9/mo
                </button>
              </div>
            )}
          </div>

          {/* Platform hint */}
          {!isBlurred && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(255,255,255,0.025)', border: '1px solid #27272a', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem', marginTop: 1 }}>💡</span>
              <div style={{ fontSize: '0.875rem', color: '#71717a', lineHeight: 1.6 }}>
                <strong style={{ color: '#d4d4d8' }}>How to use:</strong> Copy and paste directly into{' '}
                <strong style={{ color: '#fff' }}>{platform === 'midjourney' ? 'Midjourney /imagine' : platform === 'dalle' ? 'GPT-4o / DALL·E 3' : "Adobe Firefly's text-to-image"}</strong>.
                The prompt contains structured sections — the AI reads all of them.
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── HOW IT WORKS (empty state) ──────────────────────────── */}
      {!showPrompt && (
        <section>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#3f3f46', textAlign: 'center', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>How the intelligence works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { step: '01', icon: '✏️', title: 'You type your topic', desc: 'Type your video title or concept. The more specific the better — keywords drive the intelligence engine.' },
              { step: '02', icon: '🧠', title: 'System analyzes keywords', desc: 'Your topic is scored against 4 libraries: expressions, camera angles, text styles, and color grades.' },
              { step: '03', icon: '🎬', title: 'Best match is selected', desc: 'Each library picks its highest-scoring element — the combo is unique to your specific topic every time.' },
              { step: '04', icon: '⚡', title: 'Full prompt is built', desc: 'All 4 elements + your chosen style, niche, and format are assembled into a structured cinematic prompt.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ ...C.card, padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#dc2626', fontFamily: 'monospace' }}>{step}</span>
                  <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                </div>
                <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{title}</h3>
                <p style={{ fontSize: '0.825rem', color: '#52525b', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PAYWALL ──────────────────────────────────────────────── */}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onUnlocked={handleProUnlocked} />}
    </main>
  );
}
