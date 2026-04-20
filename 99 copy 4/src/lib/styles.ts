// ═══════════════════════════════════════════════════════════════════════════════
// RETHUMB — STYLE ENGINE
// Each style template pulls dynamic cinema elements from the intelligence layer.
// ═══════════════════════════════════════════════════════════════════════════════

import { pickCinemaElements, type CinemaSelection } from './cinema';

// ── TYPES ──────────────────────────────────────────────────────────────────────

export type StyleId =
  | 'auto'
  | 'mrbeast'
  | 'hunter'
  | 'caught'
  | 'splitnight'
  | 'confession'
  | 'beforeafter'
  | 'overwhelmed'
  | 'revenue';

export type Niche =
  | 'general'
  | 'gaming'
  | 'finance'
  | 'fitness'
  | 'travel'
  | 'tech'
  | 'food'
  | 'education'
  | 'lifestyle'
  | 'drama';

export type Format = '16:9' | '9:16' | '1:1' | '4:5';
export type Platform = 'midjourney' | 'dalle' | 'firefly';

export interface StyleDef {
  id: StyleId;
  name: string;
  emoji: string;
  description: string;
  /** Pass pre-picked cinema as 4th arg to override internal picking (used by regenerate) */
  template: (topic: string, niche: Niche, fmt: Format, cinema?: CinemaSelection) => string;
  /** Exposed so the UI can show what was picked */
  lastCinema?: CinemaSelection;
}

// ── HELPERS ────────────────────────────────────────────────────────────────────

function fmtLabel(fmt: Format): string {
  const map: Record<Format, string> = {
    '16:9': 'YouTube thumbnail, horizontal 16:9 format',
    '9:16': 'Instagram Reels / TikTok cover, vertical 9:16 format',
    '1:1':  'Square social media post, 1:1 format',
    '4:5':  'Instagram portrait post, 4:5 format',
  };
  return map[fmt];
}

function nicheDetail(niche: Niche): string {
  const map: Record<Niche, string> = {
    general:   '',
    gaming:    'Gaming setup with RGB lighting and monitor glow subtly visible.',
    finance:   'Stock charts, dollar signs, and luxury wealth symbols layered in background.',
    fitness:   'Athletic gear, gym equipment, or outdoor workout terrain visible.',
    travel:    'Iconic landmark or unmistakably exotic foreign location fills background.',
    tech:      'Futuristic holographic UI elements, floating data, or circuit-board patterns.',
    food:      'Vibrant, glistening food props with steam or drip — maximum appetite appeal.',
    education: 'Books, chalkboard equations, or clean academic environment in background.',
    lifestyle: 'Penthouse, yacht deck, or designer interior — aspirational luxury setting.',
    drama:     'Theatrical, high-contrast, cinematic atmosphere with moody environmental lighting.',
  };
  return map[niche];
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO PICK
// ═══════════════════════════════════════════════════════════════════════════════

function buildAutoPrompt(topic: string, niche: Niche, fmt: Format): string {
  const t = topic.toLowerCase();
  if (/survive|day|jungle|island|wild|challenge|days?/.test(t))
    return STYLES_MAP.mrbeast.template(topic, niche, fmt);
  if (/secret|truth|expos[eé]|inside|reveal|hidden|leak/.test(t))
    return STYLES_MAP.hunter.template(topic, niche, fmt);
  if (/million|money|earn|income|rich|profit|revenue|salary/.test(t))
    return STYLES_MAP.revenue.template(topic, niche, fmt);
  if (/transform|before|after|change|glow|upgrade/.test(t))
    return STYLES_MAP.beforeafter.template(topic, niche, fmt);
  if (/night|private|sneak|trespass|abandon|ghost|forbidden/.test(t))
    return STYLES_MAP.splitnight.template(topic, niche, fmt);
  if (/caught|arrest|police|security/.test(t))
    return STYLES_MAP.caught.template(topic, niche, fmt);
  if (/confess|admit|sorry|regret|mistake/.test(t))
    return STYLES_MAP.confession.template(topic, niche, fmt);
  if (/overwhelm|chaos|too much|everything|100/.test(t))
    return STYLES_MAP.overwhelmed.template(topic, niche, fmt);
  return STYLES_MAP.mrbeast.template(topic, niche, fmt);
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE MAP — each template is fully dynamic via pickCinemaElements()
// ═══════════════════════════════════════════════════════════════════════════════

export const STYLES_MAP: Record<StyleId, StyleDef> = {

  // ── AUTO ──────────────────────────────────────────────────────────────────
  auto: {
    id: 'auto',
    name: 'Auto Pick',
    emoji: '🤖',
    description: 'System picks the best style + all cinematic elements automatically',
    template: (topic, niche, fmt) => buildAutoPrompt(topic, niche, fmt),
  },

  // ── MRBEAST SURVIVAL ──────────────────────────────────────────────────────
  mrbeast: {
    id: 'mrbeast',
    name: 'MrBeast Survival',
    emoji: '🏆',
    description: 'Epic survival energy — fisheye chaos, golden drama, maximum scale',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'mrbeast', niche);
      STYLES_MAP.mrbeast.lastCinema = c;
      return `${fmtLabel(fmt)} — cinematic survival-challenge thumbnail for: "${topic}".

━━━ SUBJECT & EXPRESSION ━━━
Young male creator positioned just left of center. Expression: ${c.expression.prompt}
Bright casual clothing — oversized hoodie or bold color tee. Both hands either raised outward or one pointing directly at camera. Subject is the sharpest element in the entire frame.
${nicheDetail(niche)}

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ BACKGROUND (derived from topic) ━━━
${c.background.prompt}
Strong epic sense of scale — subject appears small against the vast environment. Dust particles, volumetric light rays, atmospheric depth haze separate the subject from the world behind them.

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}

━━━ LIGHTING ━━━
Golden hour sunlight blazing from camera-left or from directly behind subject, creating powerful warm rim light that separates them from background. Background sky filled with dramatic storm clouds partially lit by setting sun. Deep contrast between lit subject and shadowed environment.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ COMPOSITION ━━━
Subject fills left 55% of frame. Right side opens to the background environment. Strong diagonal tension from foreground to background horizon. Motion energy in the frame even in a still image. --ar ${fmt} --v 6.1 --style raw --q 2`;
    },
  },

  // ── HUNTER / EXPOSE ───────────────────────────────────────────────────────
  hunter: {
    id: 'hunter',
    name: 'Hunter / Expose',
    emoji: '🔍',
    description: 'Investigative exposé — dark secrets, evidence, confrontation energy',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'hunter', niche);
      STYLES_MAP.hunter.lastCinema = c;
      return `${fmtLabel(fmt)} — investigative exposé thumbnail for: "${topic}".

━━━ SUBJECT & EXPRESSION ━━━
Creator positioned slightly left of center, slightly angled toward camera. Expression: ${c.expression.prompt}
Dark hoodie or grey jacket. Holding a lit flashlight pointed off-camera, or gripping a manila evidence folder. Glasses optional but add investigative credibility.
${nicheDetail(niche)}

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ BACKGROUND (derived from topic) ━━━
${c.background.prompt}
Background split in two: left side deep shadowy mysterious environment matching the topic, right side partially reveals glowing secret or evidence. Red graphic circle or arrow pointing at something critical. Scene feels like a live investigation.

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}

━━━ LIGHTING ━━━
Single dramatic spotlight from upper-left at roughly 45 degrees, deep hard shadows on right side of face. Subtle teal underglow from below suggesting screen or environment light. Atmospheric haze between subject and background. Flashlight creates practical warm cone of light in scene.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ COMPOSITION ━━━
Creator left of center, negative space on right side contains the revealed element. Strong diagonal tension from lower-left to upper-right. Upper-right text zone available for title. --ar ${fmt}`;
    },
  },

  // ── CAUGHT IN ACT ─────────────────────────────────────────────────────────
  caught: {
    id: 'caught',
    name: 'Caught In Act',
    emoji: '🚨',
    description: 'Startled, caught red-handed, police lights, maximum tension',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'caught', niche);
      STYLES_MAP.caught.lastCinema = c;
      return `${fmtLabel(fmt)} — high-tension "caught in the act" thumbnail for: "${topic}".

━━━ SUBJECT & EXPRESSION ━━━
Creator caught completely off-guard, mid-action, body turning toward camera as if interrupted. Expression: ${c.expression.prompt}
One hand raised to cover mouth instinctively. Clothing matches activity — could be casual or action gear. Subject fills 65% of frame.
${nicheDetail(niche)}

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ BACKGROUND (derived from topic) ━━━
${c.background.prompt}
Background is chaotic, blurred with motion, suggesting interrupted action mid-scene. Red and blue flashing police lights or harsh overhead security spotlight cast a split-color wash across the entire environment.

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}

━━━ LIGHTING ━━━
Harsh split lighting — red gel light on left half of face and scene, blue gel on right half. Bright overhead downward spotlight creating dramatic below-nose shadows. Near-zero midtones — only highlights and deep shadow. This is the most extreme lighting contrast in any style.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ COMPOSITION ━━━
Camera positioned slightly below eye level tilted up 15 degrees — creates authority and menace. Subject fills frame aggressively. Slight chromatic aberration on frame edges adds surveillance-camera authenticity. --ar ${fmt}`;
    },
  },

  // ── SPLIT SCENE NIGHT ─────────────────────────────────────────────────────
  splitnight: {
    id: 'splitnight',
    name: 'Split Scene Night',
    emoji: '🌙',
    description: 'Forbidden location — torn-panel diptych, moonlight, mystery',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'splitnight', niche);
      STYLES_MAP.splitnight.lastCinema = c;
      return `${fmtLabel(fmt)} — cinematic split-panel night mystery thumbnail for: "${topic}".

━━━ COMPOSITION STRUCTURE ━━━
Image split by torn-paper / ripped photograph effect running diagonally from upper-left to lower-right. Two panels feel like separate photographs physically torn and placed together. The tear edge has rough fibers, slight curl, and depth shadow between panels.
${nicheDetail(niche)}

━━━ LEFT PANEL — THE LOCATION ━━━
${c.background.prompt}
Shot at night or in dramatic low light. Full moon partially obscured by moving clouds casting blue-silver ambient light. Mist or ground fog at low level. Practical location signs integrated physically into the environment. The place has weight and history — feels forbidden or restricted.

━━━ RIGHT PANEL — THE CREATOR ━━━
Expression: ${c.expression.prompt}
Flashlight pointed upward illuminating face from below — horror underglow. Round glasses. Dark hoodie. Finger pressed to lips in "shhh" gesture or whispering pose. Seems to be physically at the location shown in the left panel.

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}
Text element physically integrated into the location panel — not a digital overlay.

━━━ LIGHTING ━━━
Full moon as key light for location panel — cold blue-silver. Flashlight underglow as key for creator panel — warm amber. Deep shadows in both panels. Atmospheric fog catches both light sources and makes them volumetric.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ TECHNICAL ━━━
Two composite exposures blended at the torn seam. 24mm wide for location. 50mm portrait for creator. Both at f/1.4. --ar ${fmt}`;
    },
  },

  // ── DARK CONFESSION ───────────────────────────────────────────────────────
  confession: {
    id: 'confession',
    name: 'Dark Confession',
    emoji: '🕯️',
    description: 'Intimate whisper, single spotlight, confessional silence',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'confession', niche);
      STYLES_MAP.confession.lastCinema = c;
      return `${fmtLabel(fmt)} — intimate dark confession thumbnail for: "${topic}".

━━━ SUBJECT & EXPRESSION ━━━
Creator leaning extremely close to camera — almost whispering through the lens into the viewer's ear. Expression: ${c.expression.prompt}
One hand cupped near mouth as if shielding words from being overheard. Holds a torn cardboard or paper sign with the core topic in 2–3 words — this sign is the TEXT element. Dark, plain clothing that falls into shadow below the collar.
${nicheDetail(niche)}

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ BACKGROUND (derived from topic) ━━━
${c.background.prompt}
The environment is barely visible — pushed almost to pure black by the extreme single-source lighting. Wisps of smoke or fine atmospheric particles catch the spotlight and give the darkness texture. The background exists only as a hint, never competing with the face.

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}
The physical text element (sign, paper, cardboard) is held by the subject or visible in the frame — the writing is part of the physical world, not a graphic overlay.

━━━ LIGHTING ━━━
Single spotlight from directly overhead at 90 degrees — hard top-light only. Strong shadows under brow bones, nose, and chin. Halo of light on crown of head. Everything below the collarbone falls into complete darkness. Zero fill light. The face is an island of light in total darkness.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ COMPOSITION ━━━
Face fills 80% of frame. Camera at slight upward tilt (10 degrees below eye level). Background pushed to near-black. Maximum intimacy and claustrophobic presence. --ar ${fmt}`;
    },
  },

  // ── BEFORE vs AFTER ───────────────────────────────────────────────────────
  beforeafter: {
    id: 'beforeafter',
    name: 'Before vs After',
    emoji: '⚡',
    description: 'Transformation split — dull to powerful, same person two worlds',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'beforeafter', niche);
      STYLES_MAP.beforeafter.lastCinema = c;
      return `${fmtLabel(fmt)} — dramatic transformation before/after thumbnail for: "${topic}".

━━━ COMPOSITION STRUCTURE ━━━
Clean vertical split exactly down the center. LEFT = BEFORE. RIGHT = AFTER. The dividing line has a sharp lightning bolt or energy crack running its length — not a simple straight cut but a jagged split with electric energy. Same real human on both sides for authenticity.
${nicheDetail(niche)}

━━━ LEFT PANEL (BEFORE) ━━━
Same creator — defeated posture, shoulders curved inward, head slightly down. Expression: devastated or defeated — brows crushed together, tired eyes, no energy. Dull, flat, unflattering lighting. Cold desaturated blue-grey color world. Background: ${c.background.prompt} — shown in its most bleak, uninspiring state. Old or plain clothing. Everything here says "before the change."

━━━ RIGHT PANEL (AFTER) ━━━
Same creator — powerful upright confident stance. Expression: ${c.expression.prompt}
Strong flattering cinematic key light. Vibrant warm color world. Same background as BEFORE but now shown at its most epic, vibrant, and alive — transformed alongside the person. Better clothing, perfect posture, maximum energy.
${niche === 'finance' ? 'AFTER side: money symbols, rising charts, and luxury elements subtly visible.' : ''}

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}
"BEFORE" label physically integrated into the left environment. "AFTER" label physically integrated into the right environment — both as part of the scene, not graphic overlays.

━━━ LIGHTING ━━━
BEFORE: flat, grey, depressing — single weak frontal light, no rim, no drama.
AFTER: golden warm cinematic — strong key from upper-left, bright hair light from above, warm rim light from behind.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ TECHNICAL ━━━
Clean studio composite. 50mm lens. Perfect framing symmetry between panels. --ar ${fmt}`;
    },
  },

  // ── OVERWHELMED ───────────────────────────────────────────────────────────
  overwhelmed: {
    id: 'overwhelmed',
    name: 'Overwhelmed',
    emoji: '😱',
    description: 'Home Alone pose, chaos explosion, fisheye sensory overload',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'overwhelmed', niche);
      STYLES_MAP.overwhelmed.lastCinema = c;
      return `${fmtLabel(fmt)} — overwhelming chaos reaction thumbnail for: "${topic}".

━━━ SUBJECT & EXPRESSION ━━━
Creator dead center of frame. Expression: ${c.expression.prompt}
Bright solid-color clothing — red, electric yellow, or cobalt blue. Subject is the sharpest, brightest element. The face radiates peak panic.
${nicheDetail(niche)}

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ BACKGROUND (derived from topic) ━━━
${c.background.prompt}
The environment is in a state of total visual chaos — dozens of topic-relevant objects, symbols, icons, and elements from this specific location flying outward in every direction like a detonating explosion behind the subject. Spinning objects, flying papers, erupting environmental elements. Bright warm burst of backlight from directly behind head creates a halo of chaos energy that silhouettes outward debris.

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}

━━━ LIGHTING ━━━
Bright high-key frontal flash-style light on subject making them pop hyperbolically against chaotic background. Warm explosive backlight. High key — slightly overexposed on purpose. Background elements slightly motion-blurred from their outward trajectory.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ COMPOSITION ━━━
Extreme fisheye warping curves background elements around subject. Face at exact geometric center. Background chaos radiates outward from that center point. Foreground elements appear disproportionately large from lens distortion. --ar ${fmt}`;
    },
  },

  // ── REVENUE REVEAL ────────────────────────────────────────────────────────
  revenue: {
    id: 'revenue',
    name: 'Revenue Reveal',
    emoji: '💰',
    description: 'Wealth reveal — money, luxury, smug confidence, financial power',
    template: (topic, niche, fmt, cinema) => {
      const c = cinema ?? pickCinemaElements(topic, 'revenue', niche);
      STYLES_MAP.revenue.lastCinema = c;
      return `${fmtLabel(fmt)} — wealth and revenue reveal thumbnail for: "${topic}".

━━━ SUBJECT & EXPRESSION ━━━
Creator positioned left of center, pointing toward floating financial data on the right. Expression: ${c.expression.prompt}
Well-dressed — clean fitted shirt or slim blazer. Relaxed, powerful posture — this is someone who has already won.
${nicheDetail(niche)}

━━━ CAMERA ━━━
${c.camera.prompt}

━━━ BACKGROUND (derived from topic) ━━━
${c.background.prompt}
Bold dollar amounts, percentages, or revenue figures ($10,000 / $1,000,000 / +847%) floating as physical 3D volumetric elements in front of the background — glowing numbers with depth and light interaction. Rising bar charts or line graphs visible as backlit holographic elements layered over the environment.
${niche === 'finance' ? 'Stock ticker data and candlestick chart patterns glow in background.' : ''}
Money raining from above — physical paper bills catching warm light as they fall through the scene.

━━━ TEXT IN ENVIRONMENT ━━━
${c.textEnv.prompt}

━━━ LIGHTING ━━━
Clean strong warm key light from upper-left. Bright confident commercial lighting. Slight rim light from behind separating creator from background. Gold and emerald green light tones throughout scene. Numbers and charts emit their own glow back into the environment.

━━━ COLOR GRADE ━━━
${c.colorGrade.prompt}

━━━ COMPOSITION ━━━
Creator fills left 60% of frame. Financial data, numbers, money fills right 40% and background. The hero text/number element positioned upper-right corner. Scale implies real wealth. --ar ${fmt}`;
    },
  },

};

export const STYLES_LIST: StyleDef[] = Object.values(STYLES_MAP);

// ═══════════════════════════════════════════════════════════════════════════════
// SAFE MODE
// ═══════════════════════════════════════════════════════════════════════════════

const SAFE_MAP: Record<string, string> = {
  gun: 'tool', shoot: 'launch', kill: 'stop', blood: 'paint',
  dead: 'empty', death: 'end', bomb: 'device', weapon: 'object',
  hack: 'code', drug: 'supplement', sex: 'relationship', nude: 'plain',
};

export function applySafeMode(prompt: string): string {
  let p = prompt;
  Object.entries(SAFE_MAP).forEach(([word, replacement]) => {
    p = p.replace(new RegExp(`\\b${word}\\b`, 'gi'), replacement);
  });
  return p;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FACE PRESERVATION DIRECTIVE
// Appended to every prompt — instructs the AI not to alter facial identity.
// ═══════════════════════════════════════════════════════════════════════════════

export const FACE_LOCK = `
━━━ CRITICAL — FACE & IDENTITY PRESERVATION ━━━
If a reference photo is provided: preserve the subject's exact facial identity, bone structure, skin tone, and facial features with absolute fidelity. Do NOT alter, idealize, retouch, or change the face in any way. The face must be a photorealistic match to the reference. Only the expression (as described above), lighting, and environment should change — never the underlying facial anatomy or identity.`;

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORM SUFFIX
// ═══════════════════════════════════════════════════════════════════════════════

export function getPlatformSuffix(platform: Platform): string {
  if (platform === 'midjourney')
    return '\n\n--no text, watermark, logo, signature unless described above\n--cref [your reference image URL here] --cw 100';
  if (platform === 'firefly')
    return '\n\nStyle: photorealistic, cinematic, no graphic text overlays, professional photography. Match subject face exactly to reference image.';
  return '\n\nGenerate as a photorealistic cinematic image. No watermarks or UI elements unless described above. Match subject face exactly to any provided reference.';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DROPDOWN DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const NICHES: { value: Niche; label: string }[] = [
  { value: 'general',   label: '🌐 General'   },
  { value: 'gaming',    label: '🎮 Gaming'     },
  { value: 'finance',   label: '💰 Finance'    },
  { value: 'fitness',   label: '💪 Fitness'    },
  { value: 'travel',    label: '✈️ Travel'     },
  { value: 'tech',      label: '💻 Tech'       },
  { value: 'food',      label: '🍕 Food'       },
  { value: 'education', label: '📚 Education'  },
  { value: 'lifestyle', label: '✨ Lifestyle'   },
  { value: 'drama',     label: '🎭 Drama'      },
];

export const FORMATS: { value: Format; label: string }[] = [
  { value: '16:9', label: '16:9 — YouTube'       },
  { value: '9:16', label: '9:16 — Reels / TikTok' },
  { value: '1:1',  label: '1:1 — Square'          },
  { value: '4:5',  label: '4:5 — Instagram'        },
];

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'midjourney', label: 'Midjourney'      },
  { value: 'dalle',      label: 'DALL·E / GPT-4o' },
  { value: 'firefly',    label: 'Adobe Firefly'   },
];
