// ═══════════════════════════════════════════════════════════════════════════════
// RETHUMB — MASTER PROMPT BUILDER v2
// All styles are driven by analyseTopic() — no static templates.
// ═══════════════════════════════════════════════════════════════════════════════

import { analyseTopic, randFrom, CAMERA_VARIATIONS, LIGHTING_VARIATIONS } from './cinema';
export type { TopicAnalysis, SceneDef } from './cinema';

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
  | 'revenue'
  | 'documentary'
  | 'historical'
  | 'horror_suspense'
  | 'versus_battle'
  | 'fc_gaming'
  | 'wanted_thriller';

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

export type Format   = '16:9' | '9:16' | '1:1' | '4:5';
export type Platform = 'midjourney' | 'dalle' | 'firefly';

export interface StyleDef {
  id: StyleId;
  name: string;
  emoji: string;
  description: string;
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

function orientationLabel(fmt: Format): string {
  const map: Record<Format, string> = {
    '16:9': 'horizontal landscape orientation, 16:9 aspect ratio',
    '9:16': 'vertical portrait orientation, 9:16 aspect ratio',
    '1:1':  'square format, 1:1 aspect ratio',
    '4:5':  'portrait format, 4:5 aspect ratio',
  };
  return map[fmt];
}

const FACE_COMPOSITING = `FACE COMPOSITING: face front-facing, well and evenly lit, no heavy shadows on facial features, clean neutral skin tone — this face area will be replaced with custom face in post-production`;

// ═══════════════════════════════════════════════════════════════════════════════
// PART 5 — MASTER PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

export function buildMasterPrompt(topic: string, style: StyleId, niche: Niche, fmt: Format): string {
  const a   = analyseTopic(topic);
  const cam = randFrom(CAMERA_VARIATIONS);
  const ltv = randFrom(LIGHTING_VARIATIONS);
  const ori = orientationLabel(fmt);

  switch (style) {

    // ── MRBEAST ───────────────────────────────────────────────────────────────
    case 'mrbeast': return `Hyper-realistic cinematic YouTube thumbnail photograph.
VIDEO TITLE: "${topic}"

SUBJECT: Young male creator ${a.expression}. ${a.prop}. Wearing casual streetwear slightly disheveled suggesting they have been through something real.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
${a.scene.time ? `TIME: ${a.scene.time}` : ''}
${a.scene.atmosphere ? `ATMOSPHERE: ${a.scene.atmosphere}` : ''}

A bold hand-carved wooden or stone sign visible in the scene reading a short version of the video title.

LIGHTING: ${a.lighting} ${ltv}
COLOR GRADE: ${a.colorGrade}. Atmospheric dust particles and haze. Lens flare catching camera.
TECHNICAL: ${ori}. ${cam}. ISO 800 film grain.

--ar ${fmt} --v 6 --style raw --q 2`;

    // ── HUNTER / EXPOSE ───────────────────────────────────────────────────────
    case 'hunter': return `Hyper-realistic investigative YouTube thumbnail.
VIDEO TITLE: "${topic}"

SUBJECT: Creator with ${a.expression}, dark hoodie slightly pulled over head, thin-frame round glasses catching light, holding flashlight aimed at something shocking just off frame.
${FACE_COMPOSITING}

COMPOSITION: Perfect vertical split down center.
LEFT HALF: ${a.scene.bg} rendered dark and mysterious — heavy shadows, something ominous barely visible, the secret not yet revealed, related to "${topic}"
RIGHT HALF: Creator up close, hard spotlight from above, reacting to the discovery with ${a.expression}

GRAPHIC: Red circle highlight on key detail. Faint worn serif text "THE TRUTH" barely visible.
LIGHTING: Hard moody teal-orange cinematic grade. ${ltv}
COLOR GRADE: ${a.colorGrade}. Desaturated shadows. Paranoid investigative atmosphere.
TECHNICAL: ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── CAUGHT IN ACT ─────────────────────────────────────────────────────────
    case 'caught': return `Hyper-realistic high-tension "caught in the act" YouTube thumbnail.
VIDEO TITLE: "${topic}"

SUBJECT: Creator caught completely off-guard, mid-action, body turning toward camera as if interrupted. ${a.expression}. ${a.prop}. One hand raised to cover mouth instinctively.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — chaotic, blurred with motion, suggesting interrupted action. Red and blue flashing police lights or harsh overhead security spotlight cast a split-color wash across the entire environment.

LIGHTING: Harsh split — red gel left half of face and scene, blue gel right half. Bright overhead downward spotlight. Near-zero midtones. ${ltv}
COLOR GRADE: ${a.colorGrade}. Heavy vignette. Chromatic aberration on frame edges adds surveillance-camera authenticity.
TECHNICAL: Camera positioned slightly below eye level tilted up 15 degrees. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── SPLIT SCENE NIGHT ─────────────────────────────────────────────────────
    case 'splitnight': return `Hyper-realistic cinematic split-panel night mystery thumbnail.
VIDEO TITLE: "${topic}"

COMPOSITION: Image split by torn-paper / ripped photograph effect running diagonally from upper-left to lower-right. Two panels feel like separate photographs physically torn and placed together. The tear edge has rough fibers, slight curl, and depth shadow between panels.

LEFT PANEL — THE LOCATION:
${a.scene.bg}
Shot at night or in dramatic low light. Full moon partially obscured by moving clouds casting blue-silver ambient light. Mist or ground fog at low level. The place has weight and history — feels forbidden or restricted.

RIGHT PANEL — THE CREATOR:
${a.expression}. Flashlight pointed upward illuminating face from below — horror underglow. Dark hoodie. Finger pressed to lips in "shhh" gesture.

LIGHTING: Full moon as key light for location panel — cold blue-silver. Flashlight underglow for creator panel — warm amber. ${ltv}
COLOR GRADE: ${a.colorGrade}. Deep teal midnight atmosphere.
TECHNICAL: 24mm wide for location. 50mm portrait for creator. Both at f/1.4. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── DARK CONFESSION ───────────────────────────────────────────────────────
    case 'confession': return `Hyper-realistic intimate dark confession YouTube thumbnail.
VIDEO TITLE: "${topic}"

SUBJECT: Creator leaning extremely close to camera — almost whispering through the lens. ${a.expression}. One hand cupped near mouth as if shielding words. Holds a torn cardboard sign reading a short version of the video title. Dark plain clothing that falls into shadow below the collar.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — pushed almost to pure black by extreme single-source lighting. Wisps of smoke or fine particles catch the spotlight and give the darkness texture.

LIGHTING: Single spotlight from directly overhead at 90 degrees — hard top-light only. Strong shadows under brow bones, nose, and chin. Halo of light on crown of head. Everything below collarbone in complete darkness. ${ltv}
COLOR GRADE: ${a.colorGrade}. Maximum intimacy and claustrophobic presence.
TECHNICAL: Face fills 80% of frame. Camera at slight upward tilt 10 degrees. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── BEFORE vs AFTER ───────────────────────────────────────────────────────
    case 'beforeafter': return `Hyper-realistic dramatic transformation before/after YouTube thumbnail.
VIDEO TITLE: "${topic}"

COMPOSITION: Clean vertical split exactly down the center. LEFT = BEFORE. RIGHT = AFTER. Dividing line has a sharp lightning bolt energy crack running its length — jagged split with electric energy. Same real human on both sides.

LEFT PANEL (BEFORE):
Same creator — defeated posture, shoulders curved inward, head slightly down. Expression: complete devastation, tired eyes, no energy. Dull flat unflattering lighting. Cold desaturated blue-grey color world. Background: ${a.scene.bg} — shown in its most bleak uninspiring state.

RIGHT PANEL (AFTER):
Same creator — powerful upright confident stance. ${a.expression}. ${a.prop}. Strong flattering cinematic key light. Vibrant warm color world. Same background now shown at its most epic and alive.

LIGHTING: BEFORE: flat grey single weak frontal light. AFTER: ${a.lighting}. ${ltv}
COLOR GRADE: ${a.colorGrade}. "BEFORE" and "AFTER" labels physically integrated into each environment.
TECHNICAL: Clean studio composite. 50mm lens. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── OVERWHELMED ───────────────────────────────────────────────────────────
    case 'overwhelmed': return `Hyper-realistic overwhelming chaos reaction YouTube thumbnail.
VIDEO TITLE: "${topic}"

SUBJECT: Creator dead center of frame. ${a.expression}. Both hands pressed flat against cheeks — Home Alone pose at maximum physiological extent. Bright solid-color clothing — red, electric yellow, or cobalt blue.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — in total visual chaos. Dozens of topic-relevant objects flying outward in every direction like a detonating explosion behind the subject. Spinning objects, flying papers, erupting environmental elements. Bright warm burst of backlight from behind head creates halo of chaos energy.

LIGHTING: Bright high-key frontal flash-style light on subject. Warm explosive backlight. Slightly overexposed on purpose. ${ltv}
COLOR GRADE: ${a.colorGrade}. Maximum saturation. Background elements slightly motion-blurred from their outward trajectory.
TECHNICAL: Extreme fisheye warping curves background elements around subject. Face at exact geometric center. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw --q 2`;

    // ── REVENUE REVEAL ────────────────────────────────────────────────────────
    case 'revenue': return `Hyper-realistic wealth and revenue reveal YouTube thumbnail.
VIDEO TITLE: "${topic}"

SUBJECT: Creator positioned left of center, pointing toward floating financial data on the right. ${a.expression}. ${a.prop}. Well-dressed — clean fitted shirt or slim blazer. Relaxed powerful posture — someone who has already won.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
Bold dollar amounts, percentages, or revenue figures floating as physical 3D volumetric elements — glowing numbers with depth and light interaction. Rising bar charts or line graphs visible as backlit holographic elements. Money raining from above — physical paper bills catching warm light as they fall.

LIGHTING: ${a.lighting} Gold and emerald green light tones throughout. Numbers and charts emit their own glow. ${ltv}
COLOR GRADE: ${a.colorGrade}. Creator fills left 60%. Financial data fills right 40% and background.
TECHNICAL: ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── DOCUMENTARY ───────────────────────────────────────────────────────────
    case 'documentary': return `Hyper-realistic cinematic documentary-style YouTube thumbnail.
VIDEO TITLE: "${topic}"

SUBJECT: Creator in authentic documentary pose — slight handheld camera energy, caught in a real moment rather than posed. ${a.expression}. ${a.prop}. Clothing matches the investigation — field jacket or neutral urban wear.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
Evidence board or investigation wall partially visible — printed photographs, red string connecting points, handwritten notes, timestamps, classified stamps. Feels like the interior of an active investigation.

LIGHTING: Documentary-style soft available light mixed with one practical source — desk lamp or overhead fluorescent. ${ltv}
COLOR GRADE: ${a.colorGrade}. Slight handheld grain. Desaturated midtones. The grade of serious journalism.
TECHNICAL: 35mm lens, pulled focus that breathes slightly, naturalistic observational framing — feels witnessed not staged. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── HISTORICAL ────────────────────────────────────────────────────────────
    case 'historical': return `Hyper-realistic epic historical YouTube thumbnail.
VIDEO TITLE: "${topic}"

COMPOSITION: Split panel — historical recreation on one side, modern creator reacting on the other. The contrast between eras is the visual story.

HISTORICAL SIDE:
${a.scene.bg}
Epic scale, dramatic golden hour or stormy dramatic lighting. The weight of thousands of years of history visible in every element. Real historical detail — architecture, clothing, lighting all period-accurate.

CREATOR SIDE:
Modern creator with ${a.expression}. ${a.prop}. Expression of someone confronting the incomprehensible scale of history.
${FACE_COMPOSITING}

LIGHTING: Historical side — period-accurate dramatic natural light. Creator side — ${a.lighting}. ${ltv}
COLOR GRADE: ${a.colorGrade}. Atmospheric depth haze. The look of history brought to life.
TECHNICAL: ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── HORROR / SUSPENSE ─────────────────────────────────────────────────────
    case 'horror_suspense': return `Hyper-realistic horror suspense YouTube thumbnail.
VIDEO TITLE: "${topic}"

SUBJECT: Creator in extreme terror state. ${a.expression}. Body pressed against wall or caught recoiling backward. Pale skin, wide eyes, every hair on end. ${a.prop}.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg}
Something deeply wrong visible in the background — a shape in the darkness, a figure at a window, a door that shouldn't be open. The threat is implied not shown directly, making it more terrifying.

LIGHTING: Single cold moonlight source from above creating deep shadow pools. Something glowing unnaturally in the background. Absolute darkness in the corners. ${ltv}
COLOR GRADE: ${a.colorGrade}. Deep crushed blacks. Temperature pushed ice cold. Heavy grain suggesting fear.
TECHNICAL: Dutch tilt 15 degrees off horizontal creating visual unease baked into the geometry. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── VERSUS BATTLE ─────────────────────────────────────────────────────────
    case 'versus_battle': return `Hyper-realistic epic versus battle YouTube thumbnail.
VIDEO TITLE: "${topic}"

COMPOSITION: Two subjects facing each other from opposite sides of frame, separated by a dramatic center element — lightning bolt, fire wall, energy crack, or explosive force field splitting the image in two.

LEFT SIDE (CHALLENGER):
Creator — ${a.expression}. Aggressive energetic stance. ${a.prop}. Maximum competitive energy.
${FACE_COMPOSITING}

RIGHT SIDE (OPPONENT OR SUBJECT):
The opposing element — another creator, concept, or entity — equally powerful visual presence. Mirror energy to the left side but opposing color temperature.

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — intense arena or battleground atmosphere.
LIGHTING: Each side lit from their own direction — warm vs cool split. Center destruction element provides its own violent light. ${ltv}
COLOR GRADE: ${a.colorGrade}. Maximum contrast. The color of competition and conflict.
TECHNICAL: Perfect symmetrical composition with explosive center divider. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── FC GAMING ─────────────────────────────────────────────────────────────
    case 'fc_gaming': return `Hyper-realistic FC / FIFA gaming YouTube thumbnail.
VIDEO TITLE: "${topic}"

COMPOSITION: FUT card aesthetic — the creator or player presented in the iconic Ultimate Team card frame. Holographic foil effects, player stats visible on card face, pack-opening golden light explosion behind.

SUBJECT: Creator positioned as if they ARE the player card — powerful athletic stance. ${a.expression}. ${a.prop}. Kit colors matching the club or nation referenced in the topic.
${FACE_COMPOSITING}

BACKGROUND: ${a.scene.bg}
Neon gaming arena environment behind the card. Pack-opening golden light rays from above. Particle effects and digital data streaming. Other cards scattered and blurred in background.

LIGHTING: Dramatic pack-opening golden light from directly above — the light of a guaranteed TOTY pull. Electric blue and green neon from gaming arena below. ${ltv}
COLOR GRADE: ${a.colorGrade}. Holographic metallic sheen. Maximum saturation gaming energy.
TECHNICAL: ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // ── WANTED / THRILLER ─────────────────────────────────────────────────────
    case 'wanted_thriller': return `Hyper-realistic wanted poster thriller YouTube thumbnail.
VIDEO TITLE: "${topic}"

COMPOSITION: Aged wanted poster aesthetic — worn paper texture, printed photograph style, official stamp marks, reward amount in heavy serif type. But executed as a hyper-realistic photograph not a flat graphic.

SUBJECT: Creator photographed in the style of a mug shot or surveillance photo. ${a.expression}. ${a.prop}. Slightly disheveled — someone on the run or under investigation.
${FACE_COMPOSITING}

SETTING: ${a.scene.location}
BACKGROUND: ${a.scene.bg} — rendered as if a printed photograph behind worn paper. WANTED in massive distressed letters across the top.

LIGHTING: Harsh single-source surveillance lighting — unflattering, revealing, nowhere to hide. ${ltv}
COLOR GRADE: ${a.colorGrade}. Aged sepia-to-modern split — the paper is old, the danger is current. Heavy grain and distress.
TECHNICAL: Surveillance camera aesthetic — slight barrel distortion, date/time stamp visible, case number. ${ori}. ${cam}.

--ar ${fmt} --v 6 --style raw`;

    // DEFAULT
    default:
      return buildMasterPrompt(topic, 'mrbeast', niche, fmt);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 6 — SMART AUTO PICK
// ═══════════════════════════════════════════════════════════════════════════════

export function buildAutoPrompt(topic: string, niche: Niche, fmt: Format): string {
  const t = topic.toLowerCase();
  const a = analyseTopic(topic);
  const m = a.activeModifiers;

  // Check modifiers first
  if (m.decay || (m.hidden && String(m.energy) === 'terrified'))    return buildMasterPrompt(topic, 'horror_suspense', niche, fmt);
  if (m.hidden || m.exclusive)                                        return buildMasterPrompt(topic, 'hunter', niche, fmt);
  if (m.wealth && !m.negative)                                        return buildMasterPrompt(topic, 'revenue', niche, fmt);
  if (m.negative && m.positive)                                       return buildMasterPrompt(topic, 'beforeafter', niche, fmt);

  // Check keywords
  if (/fc|fifa|fut|pack|squad|formation/.test(t))                     return buildMasterPrompt(topic, 'fc_gaming', niche, fmt);
  if (/history|war|empire|medieval|dynasty/.test(t))                 return buildMasterPrompt(topic, 'historical', niche, fmt);
  if (/documentary|investigation|chess|evidence|conspiracy/.test(t)) return buildMasterPrompt(topic, 'documentary', niche, fmt);
  if (/wanted|missing|disappear|thriller|stalker/.test(t))           return buildMasterPrompt(topic, 'wanted_thriller', niche, fmt);
  if (/\bvs\b|versus|battle|challenge|1v1/.test(t))                  return buildMasterPrompt(topic, 'versus_battle', niche, fmt);
  if (/ghost|haunted|horror|demon|paranormal|cursed/.test(t))        return buildMasterPrompt(topic, 'horror_suspense', niche, fmt);
  if (/secret|expose|truth|hidden|caught|hack|leak|scandal/.test(t)) return buildMasterPrompt(topic, 'hunter', niche, fmt);
  if (/money|rich|million|earn|income|profit|revenue|salary/.test(t)) return buildMasterPrompt(topic, 'revenue', niche, fmt);
  if (/before|after|transform|glow|change|upgrade/.test(t))          return buildMasterPrompt(topic, 'beforeafter', niche, fmt);
  if (/confess|admit|sorry|regret|mistake|guilty/.test(t))           return buildMasterPrompt(topic, 'confession', niche, fmt);
  if (/night|private|trespass|forbidden|sneak|infiltrate/.test(t))   return buildMasterPrompt(topic, 'splitnight', niche, fmt);
  if (/survive|jungle|island|wild|amazon|africa|desert|mountain|space|boat/.test(t)) return buildMasterPrompt(topic, 'mrbeast', niche, fmt);

  return buildMasterPrompt(topic, 'mrbeast', niche, fmt);
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLE MAP — metadata for the UI style picker
// ═══════════════════════════════════════════════════════════════════════════════

export const STYLES_MAP: Record<StyleId, StyleDef> = {
  auto:           { id: 'auto',           name: 'Auto Pick',          emoji: '🤖', description: 'System picks the best style + all cinematic elements automatically' },
  mrbeast:        { id: 'mrbeast',        name: 'MrBeast Survival',   emoji: '🏆', description: 'Epic survival energy — wooden sign, golden drama, maximum scale' },
  hunter:         { id: 'hunter',         name: 'Hunter / Expose',    emoji: '🔍', description: 'Investigative exposé — split composition, dark secrets, THE TRUTH' },
  caught:         { id: 'caught',         name: 'Caught In Act',      emoji: '🚨', description: 'Startled, caught red-handed, police lights, maximum tension' },
  splitnight:     { id: 'splitnight',     name: 'Split Scene Night',  emoji: '🌙', description: 'Forbidden location — torn-panel diptych, moonlight, mystery' },
  confession:     { id: 'confession',     name: 'Dark Confession',    emoji: '🕯️', description: 'Intimate whisper, single spotlight, cardboard sign, confessional silence' },
  beforeafter:    { id: 'beforeafter',    name: 'Before vs After',    emoji: '⚡', description: 'Transformation split — dull to powerful, lightning bolt crack, same person two worlds' },
  overwhelmed:    { id: 'overwhelmed',    name: 'Overwhelmed',        emoji: '😱', description: 'Home Alone pose, chaos explosion, fisheye sensory overload' },
  revenue:        { id: 'revenue',        name: 'Revenue Reveal',     emoji: '💰', description: 'Wealth reveal — floating money, holographic charts, financial power' },
  documentary:    { id: 'documentary',    name: 'Documentary',        emoji: '📋', description: 'Evidence board, investigative field energy, serious journalism grade' },
  historical:     { id: 'historical',     name: 'Historical Epic',    emoji: '🏛️', description: 'Split panel — epic historical recreation vs modern creator reacting' },
  horror_suspense:{ id: 'horror_suspense',name: 'Horror Suspense',    emoji: '👻', description: 'Dutch tilt, cold moonlight, the threat implied in deep shadow' },
  versus_battle:  { id: 'versus_battle',  name: 'Versus Battle',      emoji: '⚔️', description: 'Epic two-sided battle — lightning split, warm vs cool, maximum conflict' },
  fc_gaming:      { id: 'fc_gaming',      name: 'FC Gaming',          emoji: '⚽', description: 'FUT card aesthetic — pack-opening light, holographic foil, gaming energy' },
  wanted_thriller:{ id: 'wanted_thriller',name: 'Wanted Thriller',    emoji: '🎯', description: 'Wanted poster aesthetic — surveillance photo, aged paper, on the run' },
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
