// ═══════════════════════════════════════════════════════════════════════════════
// RETHUMB — CINEMA INTELLIGENCE ENGINE
// Dynamically selects: Expression · Camera Angle · Text-in-Environment · Color Grade
// based on topic keywords, style, and niche.
// ═══════════════════════════════════════════════════════════════════════════════

import type { StyleId, Niche } from './styles';

// ── TYPES ──────────────────────────────────────────────────────────────────────

export interface ExpressionDef {
  id: string;
  label: string;
  /** Full description used inside the prompt */
  prompt: string;
  /** Keywords that trigger this expression */
  triggers: RegExp;
}

export interface CameraAngleDef {
  id: string;
  label: string;
  prompt: string;
  triggers: RegExp;
}

export interface TextEnvDef {
  id: string;
  label: string;
  /** How the text is physically integrated into the scene */
  prompt: string;
  triggers: RegExp;
}

export interface ColorGradeDef {
  id: string;
  label: string;
  prompt: string;
  /** Styles this grade fits best */
  fitStyles: StyleId[];
  /** Niches this grade fits best */
  fitNiches: Niche[];
  triggers: RegExp;
}

export interface BackgroundDef {
  id: string;
  label: string;
  /** Full description injected into the ━━━ ENVIRONMENT ━━━ block */
  prompt: string;
  /** Keywords in the topic that map to this background */
  triggers: RegExp;
}

export interface CinemaSelection {
  expression: ExpressionDef;
  camera: CameraAngleDef;
  textEnv: TextEnvDef;
  colorGrade: ColorGradeDef;
  background: BackgroundDef;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. EXPRESSION LIBRARY — 20 distinct face states
// ═══════════════════════════════════════════════════════════════════════════════

export const EXPRESSIONS: ExpressionDef[] = [
  {
    id: 'peak_shock',
    label: 'Peak Shock',
    prompt:
      'mouth hanging completely open in peak shock, eyes blown wide, brows shot up to forehead, cheeks pulled taut — pure "I cannot believe this" energy, veins of tension visible at temples',
    triggers: /shock|unbeliev|insane|crazy|omg|holy|impossible|viral|record|broke|disaster|explod/i,
  },
  {
    id: 'smug_reveal',
    label: 'Smug Reveal',
    prompt:
      'slow smug half-smile with one eyebrow raised — the "I already knew this would happen" expression, slight chin tilt upward, eyes narrowed with controlled superiority, corner of lips barely restrained',
    triggers: /reveal|secret|truth|knew|told you|win|beat|proof|finally|confirm|expose/i,
  },
  {
    id: 'intense_focus',
    label: 'Intense Focus',
    prompt:
      'locked-in intense focus — eyes narrowed to a determined squint, jaw set hard, slight forward lean of the head, zero distraction energy, competitive fire behind the eyes',
    triggers: /survive|challenge|100 day|days?|build|craft|last|endure|compete|test|trial|beat/i,
  },
  {
    id: 'pure_terror',
    label: 'Pure Terror',
    prompt:
      'genuine terror etched across face — eyes stretched impossibly wide with white showing all around, mouth open in a silent scream, both hands raised defensively, shoulders hunched, pure fight-or-flight panic',
    triggers: /terrif|horror|scare|haunt|ghost|demon|monster|dark|alone|escape|run|chased|danger/i,
  },
  {
    id: 'hysterical_laugh',
    label: 'Hysterical Laugh',
    prompt:
      'erupting in uncontrollable laughter — head thrown back, eyes completely shut from cheek muscles, mouth wide in pure joy, one hand slapping knee, body slightly doubled over, teeth fully visible',
    triggers: /funny|hilarious|prank|fail|laugh|comedy|joke|roast|embarrass|reaction|troll/i,
  },
  {
    id: 'guilty_whisper',
    label: 'Guilty Whisper',
    prompt:
      'leaning forward conspiratorially, one hand cupped at the side of mouth, eyes darting slightly sideways — guarded, secretive, conflicted expression as if sharing something they shouldn\'t, slight guilt pulling at the brows',
    triggers: /confess|admit|wrong|mistake|sorry|regret|never told|private|truth about|dark secret/i,
  },
  {
    id: 'disbelief_stare',
    label: 'Disbelief Stare',
    prompt:
      'dead-eyed thousand-yard stare of pure disbelief — mouth slightly ajar, brows furrowed in processing, one hand raised to temple, completely frozen in the moment of realization, "this cannot be real" written across entire face',
    triggers: /wait|what|really|actually|how|why|found|discover|realized|turns out|plot twist/i,
  },
  {
    id: 'triumphant_flex',
    label: 'Triumphant',
    prompt:
      'triumphant power pose — chin lifted, broad chest-forward stance, slight victorious smirk, eyes gleaming with quiet confidence, the expression of someone who just won something significant and knows it',
    triggers: /win|won|champion|first place|best|beat|dominate|success|achieve|finally|accomplish/i,
  },
  {
    id: 'scheming_grin',
    label: 'Scheming Grin',
    prompt:
      'slow scheming grin spreading across face — eyebrows raised with mischievous intent, eyes darting playfully, slight head tilt of someone whose plan is coming together perfectly, "oh this is going to be good" energy',
    triggers: /plan|trick|hack|cheat|shortcut|strategy|sneak|secret method|way to|how i/i,
  },
  {
    id: 'devastated_breakdown',
    label: 'Devastated',
    prompt:
      'visibly devastated — brows crushed together in grief, eyes glistening and red-rimmed, mouth turned sharply downward, chin slightly trembling, hands covering part of face, the weight of a real emotional moment',
    triggers: /lost|fail|broke|gone|end|over|worst|terrible|ruin|destroy|collapse|bankrupt|quit/i,
  },
  {
    id: 'excited_point',
    label: 'Excited Point',
    prompt:
      'bouncing with infectious excitement — pointing directly into camera lens with both index fingers, full megawatt smile showing all teeth, eyes crinkled from genuine joy, leaning slightly forward as if sharing the best news ever',
    triggers: /new|launch|just|announ|got|made|got paid|earned|big news|update|release|drop/i,
  },
  {
    id: 'calculated_cold',
    label: 'Cold & Calculated',
    prompt:
      'cold, calculated expression — absolutely neutral face with eyes tracking the camera like a predator, jaw muscles slightly flexed, stillness that radiates controlled power, not a single emotion leaking through the composed mask',
    triggers: /million|money|income|rich|invest|trade|business|profit|wealth|finance|earn/i,
  },
  {
    id: 'jaw_drop',
    label: 'Jaw Drop',
    prompt:
      'jaw physically dropped in exaggerated disbelief — bottom jaw hanging loose, eyes wide and blinking, one hand pointing at something off-camera, the expression of someone who just witnessed something that broke their brain',
    triggers: /look at|check|see this|found|wtf|no way|you won\'t believe|insane|biggest|largest/i,
  },
  {
    id: 'defiant_stare',
    label: 'Defiant Stare',
    prompt:
      'unwavering defiant stare directly into lens — arms crossed firmly across chest, slight forward lean, jaw jutted out, eyes burning with conviction, the posture and expression of someone who will not back down under any pressure',
    triggers: /against|vs|fight|battle|defend|protect|stand|refuse|never|they said|haters|doubt/i,
  },
  {
    id: 'overwhelmed_hands',
    label: 'Overwhelmed',
    prompt:
      'both hands pressed flat against cheeks in the iconic "Home Alone" overwhelmed pose, eyes stretched as wide as anatomically possible, mouth open in absolute peak panic — total sensory overload written across every feature',
    triggers: /overwhelm|too much|so many|everything|chaos|crazy amount|impossible amount|100/i,
  },
  {
    id: 'sly_look',
    label: 'Sly Side-Eye',
    prompt:
      'slow deliberate side-eye — eyes cutting sharply to one side while the face stays forward, slight smirk tugging at one corner of mouth, raised single brow, the expression of someone watching a situation unfold exactly as predicted',
    triggers: /drama|tea|gossip|situation|you saw|watch|observe|notice|caught|spotted/i,
  },
  {
    id: 'proud_chest',
    label: 'Proud & Confident',
    prompt:
      'open proud stance with chest forward and head high, warm genuine smile — not arrogant but deeply self-assured, the expression of someone proud of real accomplishment, radiating earned confidence and warmth',
    triggers: /proud|built|made|created|transform|glow up|journey|progress|months|year/i,
  },
  {
    id: 'eyebrow_raise',
    label: 'Skeptical Eyebrow',
    prompt:
      'single eyebrow raised sky-high in maximum skepticism, arms loosely crossed, slight tilt of head — the perfect "really? we\'re doing this?" expression that instantly communicates calling out nonsense, dry wit behind the eyes',
    triggers: /really|seriously|actually|is this|they|people|everyone|claim|say|lie|fake|myth/i,
  },
  {
    id: 'power_silence',
    label: 'Power Silence',
    prompt:
      'absolute composed silence — face completely still, eyes holding direct camera contact with quiet intensity, slight relaxed set of the jaw, the stillness of someone who has nothing to prove and knows everything you need to know',
    triggers: /silent|quiet|alone|empty|abandoned|still|peace|meditat|zero|nothing|void/i,
  },
  {
    id: 'rage_face',
    label: 'Rage & Anger',
    prompt:
      'barely contained volcanic rage — jaw clenched so tight the muscles bulge, eyes narrowed to burning slits, nostrils flared, veins subtly visible at temples, fists balled at sides, every feature pulled into controlled fury',
    triggers: /angry|rage|furious|mad|unacceptable|enough|stop|they did|betrayed|scam|ripped off/i,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CAMERA ANGLE LIBRARY — 12 distinct angles
// ═══════════════════════════════════════════════════════════════════════════════

export const CAMERA_ANGLES: CameraAngleDef[] = [
  {
    id: 'ultra_wide_fisheye',
    label: 'Ultra-Wide Fisheye',
    prompt:
      'shot on 8–14mm ultra-wide fisheye lens, extreme barrel distortion curves the environment dramatically around subject, foreground face appears massive and close while background bends away in all directions, claustrophobic intimacy despite wide environment, heavy vignette on edges',
    triggers: /survive|jungle|island|wild|extreme|chaos|overwhelming|fisheye|wide/i,
  },
  {
    id: 'cinematic_low_angle',
    label: 'Cinematic Low Angle',
    prompt:
      'camera positioned below subject eye level shooting upward at roughly 20–30 degrees — subject towers into frame with power and dominance, dramatic sky or ceiling visible above, makes even average-sized subjects appear monumental and commanding',
    triggers: /power|dominate|giant|biggest|massive|tower|rule|king|champion|beat|win|triumph/i,
  },
  {
    id: 'extreme_close_up',
    label: 'Extreme Close-Up (ECU)',
    prompt:
      '85–135mm telephoto portrait lens pushed in tight — frame crops from just above eyebrows to just below chin, face fills the entire image, every texture of skin and micro-expression visible, bokeh background dissolves into smooth abstract color, maximum emotional intensity and intimacy',
    triggers: /confess|whisper|secret|tell|admit|guilt|close|intimate|emotion|truth|personal/i,
  },
  {
    id: 'dutch_angle',
    label: 'Dutch Tilt',
    prompt:
      'camera rotated 15–25 degrees off horizontal axis creating a deliberate diagonal tilt — visual unease and psychological tension baked into the frame geometry, subject appears slightly off-balance, the world feels tilted and unstable, classic thriller and horror framing technique',
    triggers: /horror|scary|unstable|wrong|broken|crisis|panic|terror|threat|danger|chaos|weird/i,
  },
  {
    id: 'over_shoulder',
    label: 'Over-the-Shoulder',
    prompt:
      '50mm lens, camera positioned just over the subject\'s shoulder — we see what they see, a strong silhouette of shoulder and head edge frames the shot, pulling viewer into the subject\'s perspective as a participant rather than observer, cinematic two-world composition',
    triggers: /watch|observe|looking at|discover|found|entering|approaching|arriving|sneaking/i,
  },
  {
    id: 'aerial_god_view',
    label: "Bird's Eye / God View",
    prompt:
      "camera directly overhead, fully top-down 90-degree God's-eye view — subject looks up into lens from directly below, dramatic symmetrical composition, all background becomes a flat design element beneath the subject, rare and arresting perspective that immediately stops the scroll",
    triggers: /above|overview|top|map|plan|strategy|whole|entire|everything|scale|size|massive/i,
  },
  {
    id: 'handheld_doc',
    label: 'Handheld Documentary',
    prompt:
      '24–35mm lens, slight intentional camera shake suggesting live handheld documentary capture, pulled focus that breathes slightly, naturalistic observational framing as if catching a real moment unposed, gritty authenticity — feels witnessed not staged',
    triggers: /real|caught|actual|true|documentary|inside|behind|day in life|follow|watch/i,
  },
  {
    id: 'symmetrical_center',
    label: 'Perfect Symmetry',
    prompt:
      '35–50mm prime lens, subject locked perfectly on the exact center axis of frame, left and right sides of background mirror each other precisely, Kubrick-style composition that feels architectural and deliberate, mathematically balanced visual weight, powerful stillness',
    triggers: /perfect|symmetr|equal|balance|center|middle|vs|compare|split|before after|both/i,
  },
  {
    id: 'worm_eye',
    label: "Worm's Eye View",
    prompt:
      'camera placed at ground level shooting steeply upward — subject looms over viewer like a colossus, sky fills the upper 40% of frame, extreme forced perspective makes them appear superhuman in scale, legs appear massive in foreground while torso and face recede into sky',
    triggers: /huge|giant|legend|greatness|tall|above|over|larger than life|incredible|unreal/i,
  },
  {
    id: 'split_diopter',
    label: 'Split Focus Diopter',
    prompt:
      'split diopter lens effect — two subjects at vastly different distances from camera are BOTH in sharp focus simultaneously, foreground object crystal clear on one half of frame while distant subject equally sharp on other half, creates an eerie impossible-focus cinematic depth',
    triggers: /two|both|split|between|choice|vs|conflict|dual|comparison|near far|distance/i,
  },
  {
    id: 'selfie_pov',
    label: 'Selfie / Creator POV',
    prompt:
      '16mm wide lens held at arm\'s length creator-selfie angle, slight upward tilt as if holding phone above, slight motion energy in the frame, authentic "I\'m in the moment" energy, environment visible dramatically behind and around subject, natural creator-to-audience direct connection',
    triggers: /i went|i did|i tried|i found|i built|i made|my|me|selfie|creator|vlog/i,
  },
  {
    id: 'rack_focus',
    label: 'Rack Focus Drama',
    prompt:
      'shallow f/1.2–1.4 depth of field, intentional rack focus — sharp subject in foreground while a blurred mysterious element in the background pulls the eye, or vice versa, the out-of-focus element is still compositionally readable, creates layered storytelling depth within a single frame',
    triggers: /background|hidden|behind|mystery|blur|layer|depth|focus|bokeh|reveal in/i,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3. TEXT-IN-ENVIRONMENT LIBRARY — how words become part of the physical world
// ═══════════════════════════════════════════════════════════════════════════════

export const TEXT_ENVIRONMENTS: TextEnvDef[] = [
  {
    id: 'graffiti_wall',
    label: 'Graffiti on Wall',
    prompt:
      'topic title spray-painted as large bold graffiti directly onto a brick or concrete wall in the background — paint drips running from letters, rough spray edges, integrated as if it was actually painted there, not a graphic overlay but a real physical element in the scene',
    triggers: /street|urban|city|underground|culture|real|grunge|raw|truth|rebel/i,
  },
  {
    id: 'wooden_sign',
    label: 'Rustic Wooden Sign',
    prompt:
      'hand-carved or hand-painted wooden sign with rough edges planted in the ground or hanging in the background — letters burned or painted onto weathered wood planks, natural environment setting, sign feels genuinely found in the real location rather than added',
    triggers: /survive|nature|island|forest|jungle|wild|camp|outdoor|trail|explore|adventure/i,
  },
  {
    id: 'neon_glow',
    label: 'Neon Sign',
    prompt:
      'key topic word glowing as a practical neon tube sign mounted on the wall behind the subject — actual light source casting colored neon glow onto the environment and spilling onto subject\'s face and shoulders, buzzing neon energy, tubes visible as physical glass objects',
    triggers: /night|club|bar|glow|neon|city|late|dark|party|vegas|luxury|vibe|aesthetic/i,
  },
  {
    id: 'projection_light',
    label: 'Projected Text',
    prompt:
      'topic text projected from an unseen projector as a beam of white or colored light across the scene — words form on the subject\'s body, the wall behind them, or the floor, light rays visible in the air through atmospheric haze, the text has physical light weight and presence',
    triggers: /present|show|reveal|announce|launch|proof|evidence|data|project|display/i,
  },
  {
    id: 'torn_tape',
    label: 'Torn Paper & Tape',
    prompt:
      'words written on torn paper scraps, torn newspaper headlines, or cardboard pieces pinned or taped to surfaces in the background — edges ragged and ripped, tape visible at corners, arranged urgently as if by someone piecing together information, chaotic evidence-board energy',
    triggers: /evidence|clue|mystery|solve|piece|together|note|found|case|truth|detective|investigate/i,
  },
  {
    id: 'chalk_ground',
    label: 'Chalk on Ground',
    prompt:
      'key text chalked in massive letters on the ground or pavement beneath/around the subject — camera angle reveals the chalk lettering integrated into the floor of the environment, smudges and imperfections make it feel genuinely drawn by hand, not digitally added',
    triggers: /draw|art|create|build|school|teach|ground|floor|path|road|journey/i,
  },
  {
    id: 'banner_flag',
    label: 'Physical Banner/Flag',
    prompt:
      'fabric banner or flag hung in the background displaying the core text — cloth wrinkles, folds, and drapes naturally, edges slightly frayed, fabric catches light and creates subtle shadow patterns, feels like a real hung banner at the real location, not a graphic',
    triggers: /event|contest|competition|championship|game|tournament|winner|award|official/i,
  },
  {
    id: 'smoke_text',
    label: 'Text in Smoke/Steam',
    prompt:
      'key word or number formed in drifting smoke, steam, or cloud particles — letters visible as shaped voids or densities in the atmospheric element, backlit dramatically so the smoke is luminous, ephemeral and dreamlike yet clearly readable, dissipating at the edges',
    triggers: /mystery|secret|disappear|reveal|magic|appear|hidden|summon|spiritual|beyond|dream/i,
  },
  {
    id: 'screen_monitor',
    label: 'Screen / Monitor Display',
    prompt:
      'key data, numbers, or text displayed on a practical screen, monitor, or digital display visible in the background — screen glow lights the environment with blue-white light, content clearly readable on screen, feels like the subject is working with or referencing this live data',
    triggers: /data|tech|code|screen|monitor|computer|stats|number|figure|metric|analytics|track/i,
  },
  {
    id: 'burned_scorched',
    label: 'Burned / Scorched Text',
    prompt:
      'topic text scorched or burned into a surface in the environment — charred black letterforms with glowing orange ember edges still faintly hot, smoke wisps rising from the letters, the text feels urgent and irreversible, a warning or mark that cannot be undone',
    triggers: /fire|burn|hot|blaze|heat|forge|make|permanent|branded|destroy|end|final/i,
  },
  {
    id: 'ice_carved',
    label: 'Carved in Ice',
    prompt:
      'text carved or etched into ice or frost — letters cut into transparent blue-white ice, internal reflections and light refraction inside the carved channels, breath-cold steam rising nearby, the cold physicality of the lettering matches a stark frozen environment',
    triggers: /cold|frozen|ice|winter|snow|arctic|blizzard|freeze|chill|cool|north/i,
  },
  {
    id: 'sticker_label',
    label: 'Label / Sticker Slap',
    prompt:
      'hand-applied sticker, label, or masking tape with handwritten or printed text slapped onto a surface in the scene — slightly crooked application, edges starting to peel at corners, adhesive texture visible, the informality and urgency of someone marking something important',
    triggers: /label|mark|tag|notice|warning|caution|important|rated|tier|rank|level/i,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 4. COLOR GRADE LIBRARY — 14 cinematic grades
// ═══════════════════════════════════════════════════════════════════════════════

export const COLOR_GRADES: ColorGradeDef[] = [
  {
    id: 'golden_viral',
    label: 'Golden Viral',
    prompt:
      'golden hour viral grade — heavy warm orange-amber push in highlights, skin tones burn amber-gold, shadows retain rich deep chocolate brown, saturation cranked +40 overall, blues in shadows only for contrast punch, the exact grade that makes thumbnails impossible to scroll past on mobile',
    fitStyles: ['mrbeast', 'overwhelmed'],
    fitNiches: ['travel', 'general'],
    triggers: /golden hour|warm grade|viral grade|amber glow|hype color|sun-drenched/i,
  },
  {
    id: 'teal_orange_noir',
    label: 'Teal & Orange Noir',
    prompt:
      'Hollywood teal-and-orange split-tone grade — skin tones pushed strongly toward warm orange while all shadows and backgrounds shift into deep teal and cyan, heavy vignette darkening edges to black, midtones slightly desaturated to make the split more dramatic, filmic grain overlay at 15% opacity',
    fitStyles: ['hunter', 'splitnight', 'caught'],
    fitNiches: ['drama', 'gaming'],
    triggers: /mystery|expose|secret|investigate|dark|night|shadow|teal|cinematic|film/i,
  },
  {
    id: 'hypersaturated_pop',
    label: 'Hypersaturated Pop',
    prompt:
      'maximum saturation comic-book grade — every primary color pushed to near-neon intensity, reds are bleeding scarlet, blues are electric cobalt, yellows are pure lemon chrome, blacks crushed to true black, zero grey midtones, image has the punchy flat pop of printed comic book color applied to photorealistic photo',
    fitStyles: ['overwhelmed', 'mrbeast'],
    fitNiches: ['gaming', 'food'],
    triggers: /color|bright|fun|gaming|cartoon|vibrant|pop|energetic|excited|kids/i,
  },
  {
    id: 'money_green_gold',
    label: 'Money: Green & Gold',
    prompt:
      'luxury wealth grade — emerald money-green in the shadows building to rich gold in the highlights, skin tones pulled warm with a yellow-gold cast, deep near-black blacks suggesting exclusivity, bright specular highlights appearing almost metallic, slight green haze in out-of-focus background areas like currency printing',
    fitStyles: ['revenue'],
    fitNiches: ['finance'],
    triggers: /money|rich|million|wealth|income|profit|invest|gold|luxury|earn|salary/i,
  },
  {
    id: 'cold_steel_blue',
    label: 'Cold Steel Blue',
    prompt:
      'cold corporate steel grade — desaturated to roughly 60% of original saturation, strong blue-teal push throughout all tones, skin looks slightly clinical and pale, blacks shift toward blue-black, pure whites remain clean, the grade of surveillance footage, tech interfaces, and calculated intelligence — emotionally cold, factually precise',
    fitStyles: ['hunter', 'confession'],
    fitNiches: ['tech', 'finance'],
    triggers: /tech|code|ai|robot|system|algorithm|data|cold|calculated|serious|professional/i,
  },
  {
    id: 'blood_red_black',
    label: 'Blood Red & Black',
    prompt:
      'high-drama crimson grade — deep blacks everywhere with aggressive red channel push, skin takes on slight reddish heat, shadows go near-pure black with only red frequencies surviving, single bright elements pop against the darkness with intense red rim light, the grade of danger, urgency, and maximum stakes drama',
    fitStyles: ['caught', 'confession'],
    fitNiches: ['drama', 'gaming'],
    triggers: /danger|urgent|crisis|alert|caught|arrest|police|crime|war|battle|fight/i,
  },
  {
    id: 'desaturated_film',
    label: 'Desaturated Film Grain',
    prompt:
      'arthouse desaturated grade — saturation pulled to 30-40%, strong film grain overlay at 25% opacity, slight halation glow around bright areas, muted palette with soft lifted blacks (not crushed), colors exist as pale ghosts of themselves, the grade of serious documentary filmmaking and emotional raw authenticity',
    fitStyles: ['confession', 'splitnight'],
    fitNiches: ['drama', 'education'],
    triggers: /confess|admit|real|true|personal|emotion|deep|serious|sad|lost|fail|sorry/i,
  },
  {
    id: 'neon_cyberpunk',
    label: 'Neon Cyberpunk',
    prompt:
      'cyberpunk neon grade — environment goes near-black while individual neon light sources (pink, purple, cyan, electric blue) bleed and flare aggressively, skin lit by multiple colored practical sources creating split-tone faces, chromatic aberration on edges, heavy bloom around all light sources, RGB smoke in the air',
    fitStyles: ['splitnight', 'hunter'],
    fitNiches: ['gaming', 'tech'],
    triggers: /cyber|neon|future|tech|gaming|rgb|night|club|hacker|code|glitch|digital/i,
  },
  {
    id: 'vintage_analog',
    label: 'Vintage Analog',
    prompt:
      'vintage analog film grade — warm faded tones with lifted shadows (blacks never go fully black), yellowed highlights, slight magenta push in midtones, heavy visible grain structure, color bleeding at edges, horizontal scan lines barely visible, vignette with the uneven light fall-off of a real vintage lens wide open',
    fitStyles: ['beforeafter', 'confession'],
    fitNiches: ['lifestyle', 'food'],
    triggers: /old|vintage|retro|classic|back|nostalgic|remember|90s|2000s|throwback|film/i,
  },
  {
    id: 'arctic_white',
    label: 'Arctic White Overexposed',
    prompt:
      'arctic overexposed grade — image pushed slightly overexposed so whites blow out cleanly, environment feels bleached and starkly clinical, cool 5500K neutral light throughout, shadows exist only as pale blue-grey suggestions, skin appears pristine and flawless, the grade of clean reveals, product launches, and before/after transformations',
    fitStyles: ['beforeafter'],
    fitNiches: ['fitness', 'education'],
    triggers: /clean|fresh|new|launch|reveal|transform|after|upgrade|glow|white|pure/i,
  },
  {
    id: 'forest_earth',
    label: 'Forest Earthy Green',
    prompt:
      'deep earthy forest grade — green channel boosted in shadows and midtones suggesting dense foliage and damp earth, highlights remain warm amber from filtered sunlight, skin takes on a slightly verdant cast in shadow areas, heavy atmospheric haze in background, the grade of deep wilderness, survival, and natural immersion',
    fitStyles: ['mrbeast', 'splitnight'],
    fitNiches: ['travel', 'fitness'],
    triggers: /forest|jungle|nature|wild|survive|outdoor|camp|hike|trail|green|earth|island/i,
  },
  {
    id: 'sunset_drama',
    label: 'Sunset Drama',
    prompt:
      'cinematic sunset drama grade — sky burns orange-red-purple in a gradient of dying light, subjects are rim-lit in warm golden fire from behind, foreground elements drop into deep dramatic silhouette or near-silhouette, the horizon becomes a band of pure light, atmosphere heavy with golden-hour particles and dust, the grade of epic finales and high-emotion moments',
    fitStyles: ['mrbeast', 'beforeafter'],
    fitNiches: ['travel', 'lifestyle'],
    triggers: /epic|finale|end|last|final|sunset|horizon|journey|complete|finish|arrive/i,
  },
  {
    id: 'industrial_grit',
    label: 'Industrial Grit',
    prompt:
      'gritty industrial grade — heavy desaturation in the blue and green channels leaving only warm skin tones and rust browns, heavy texture overlay suggesting concrete and metal, crushed blacks with strong noise in the shadows, the grade of hard work, blue-collar reality, underground truth, and no-filter honesty',
    fitStyles: ['caught', 'hunter'],
    fitNiches: ['fitness', 'drama'],
    triggers: /hard|work|grind|real|raw|hustle|underground|truth|honest|exposed|grit|tough/i,
  },
  {
    id: 'dreamy_pastel',
    label: 'Dreamy Pastel',
    prompt:
      'soft dreamy pastel grade — all colors shifted toward their pastel equivalents, heavy haze and softness throughout, lifted blacks creating an airy feel, skin practically glows with a soft ethereal quality, background bokeh dissolves into smooth pastel color clouds, the grade of aspirational lifestyle, beauty content, and elevated aesthetic thumbnails',
    fitStyles: ['beforeafter'],
    fitNiches: ['lifestyle', 'food'],
    triggers: /dream|soft|beauty|aesthetic|pretty|cute|girly|fashion|style|pink|pastel|nice/i,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 5. BACKGROUND LIBRARY — 40 real environments read from the topic
// ═══════════════════════════════════════════════════════════════════════════════

export const BACKGROUNDS: BackgroundDef[] = [

  // ── FITNESS & GYM ──────────────────────────────────────────────────────────
  {
    id: 'gym_iron',
    label: 'Iron Gym Floor',
    prompt: 'heavy iron gym floor — rows of barbells and weight plates racked along mirrored walls, chalk dust floating in shafts of industrial overhead light, squat racks and bench press stations visible mid-ground, rubber floor mats with dried sweat, cinematic depth of field blurs the equipment into a gritty bokeh of metal and iron',
    triggers: /gym|workout|lift|weight|barbell|squat|bench|iron|muscle|gains|training|fitness|exercise|rep|set|deadlift/i,
  },
  {
    id: 'boxing_ring',
    label: 'Boxing Ring',
    prompt: 'professional boxing ring under hard venue spotlights — red corner ropes casting colored shadows on white canvas, crowd blur in stadium darkness behind the ropes, corner stools and water buckets visible, ring canvas scuffed and worn from real fights, the air carries the energy of a sold-out arena',
    triggers: /box|fight|ring|punch|knockout|mma|ufc|martial art|combat|sparring|glove/i,
  },
  {
    id: 'outdoor_track',
    label: 'Running Track / Stadium',
    prompt: 'professional athletic track and field stadium — lanes marked in crisp white paint on red rubber surface, stadium seating rising behind, late afternoon sunlight casting long diagonal shadows across the lanes, finish line tape visible in the foreground, the atmosphere of a championship meet',
    triggers: /run|marathon|sprint|track|race|cardio|jog|athlete|mile|5k|cross country/i,
  },

  // ── MONEY & FINANCE ─────────────────────────────────────────────────────────
  {
    id: 'penthouse_city',
    label: 'Penthouse / City Skyline',
    prompt: 'luxury penthouse floor-to-ceiling glass windows overlooking a glittering city skyline at night — skyscraper lights stretch to the horizon, light pollution creates a warm amber haze above the city, interior marble floor reflects the window glow, a single designer chair or trading desk visible, the atmosphere of extreme private wealth',
    triggers: /million|rich|wealth|luxury|penthouse|success|income|profit|revenue|salary|boss|ceo|entrepreneur/i,
  },
  {
    id: 'private_jet',
    label: 'Private Jet Interior',
    prompt: 'private jet interior — cream leather recliners, polished burled wood accents, oval windows showing clouds and blue sky far below, golden reading lights, thick carpet, absolute silence implied by the insulated luxury environment, atmosphere of unlimited access and exclusive travel',
    triggers: /private jet|fly|travel rich|millionaire|billionaire|success|wealthy/i,
  },
  {
    id: 'stock_trading_floor',
    label: 'Trading Floor / Multiple Screens',
    prompt: 'dimly lit trading station with a wall of multiple monitors — green and red candlestick charts scrolling in real-time, stock tickers reflecting across eyeglasses, keyboard and mouse in sharp foreground, data flooding every screen, the blue-white light of information overload illuminating the face from multiple angles',
    triggers: /stock|trade|invest|crypto|market|portfolio|chart|option|forex|bitcoin|eth|coin|finance|money/i,
  },

  // ── TRAVEL & ADVENTURE ──────────────────────────────────────────────────────
  {
    id: 'mountain_peak',
    label: 'Mountain Summit',
    prompt: 'dramatic mountain summit at golden hour — rocky peak rising above a sea of clouds, distant mountain ranges layered in atmospheric haze, sun burning just above the horizon painting everything amber and violet, thin air mist visible, the scale is genuinely epic and humbling, wind-blown atmosphere',
    triggers: /mountain|peak|summit|hike|climb|altitude|everest|alps|trek|expedition/i,
  },
  {
    id: 'tropical_beach',
    label: 'Tropical Beach Paradise',
    prompt: 'pristine tropical beach at golden hour — turquoise water impossibly clear showing the sandy bottom, coconut palms leaning over white sand, waves breaking softly at the tide line, dramatic sunset painting the sky in tangerine and magenta, the atmosphere of a place most people only dream of visiting',
    triggers: /beach|ocean|tropical|island|paradise|bali|maldives|hawaii|coast|sea|surf/i,
  },
  {
    id: 'city_rooftop',
    label: 'City Rooftop at Night',
    prompt: 'urban rooftop at night — city grid of lights stretching in every direction below, water towers and HVAC units create urban texture, low clouds glow orange from city light pollution, helicopter light trails in the middle distance, the feeling of standing above the world on a secret ledge only accessible to those who know where to look',
    triggers: /city|urban|rooftop|street|downtown|new york|la|london|tokyo|paris|chicago/i,
  },
  {
    id: 'desert_landscape',
    label: 'Desert Dunes',
    prompt: 'vast desert landscape at magic hour — enormous sand dunes cast long purple shadows on the windward side while the crests burn amber-gold in the dying light, heat shimmer at the horizon, the scale is inhuman and silent, dust devils in the far distance, perfectly textured sand ripples in the foreground',
    triggers: /desert|sand|dune|sahara|arizona|dry|heat|hot|barren|wasteland|middle east/i,
  },
  {
    id: 'ancient_ruins',
    label: 'Ancient Ruins / Archaeological Site',
    prompt: 'ancient stone ruins at dawn — massive carved columns partially collapsed, vines reclaiming carved stonework, morning mist threading between ancient walls, birds disturbed into flight, golden sunrise light catching dust motes in the air, the weight of thousands of years visible in every weathered stone surface',
    triggers: /ruins|ancient|history|pyramid|temple|rome|greece|egypt|artifact|archaeological|old/i,
  },
  {
    id: 'forest_deep',
    label: 'Deep Forest / Jungle',
    prompt: 'deep dense forest — old-growth tree trunks rising 30 meters before their canopy closes overhead, shafts of green-filtered light pierce the canopy at steep angles, ferns and undergrowth at ground level, mist hanging between trunks, the sound of the forest implied by the visual density, a place humans rarely reach',
    triggers: /forest|jungle|woods|rainforest|tree|wild|nature|camp|hiking|trail|amazon/i,
  },
  {
    id: 'survival_island',
    label: 'Survival Island / Stranded',
    prompt: 'remote uninhabited island — jagged rocky coastline with waves crashing, makeshift shelter of palm branches visible, signal fire smoke rising in the background, dense impenetrable jungle rising behind a narrow strip of sand, the sky shows incoming weather, the atmosphere of genuine isolation with zero help coming',
    triggers: /island|stranded|survive|alone|deserted|castaway|last|wilderness|SOS/i,
  },
  {
    id: 'underground_cave',
    label: 'Underground Cave / Cavern',
    prompt: 'massive underground limestone cavern — stalactites hang from vaulted ceilings 20 meters above, an underground lake perfectly reflects the cave formations, headlamp beams cut through absolute darkness, water drips echo, bioluminescent fungi cast faint blue glow on wet cave walls, the weight of the earth above is palpable',
    triggers: /cave|cavern|underground|tunnel|mine|spelunk|under|beneath|below|bunker/i,
  },

  // ── TECH & DIGITAL ──────────────────────────────────────────────────────────
  {
    id: 'server_room',
    label: 'Server Room / Data Center',
    prompt: 'massive enterprise server room — rows of illuminated server racks stretching to a vanishing point, blue and white LED status lights blinking in patterns, cold air systems humming, cable management creating visual texture between racks, the floor is raised with data cables running beneath, the space feels like the physical body of the internet',
    triggers: /server|data|cloud|ai|tech|computer|code|software|system|network|infrastructure|hack/i,
  },
  {
    id: 'futuristic_lab',
    label: 'Futuristic Research Lab',
    prompt: 'ultra-clean white futuristic research laboratory — holographic data displays floating in mid-air, scientists in clean-room suits visible in deep background, chemical equipment lit from within by blue-white light, central work surface glowing, the atmosphere of technology 20 years ahead of public knowledge, government facility energy',
    triggers: /lab|research|science|experiment|test|future|technology|invention|discover|robot|ai|machine/i,
  },
  {
    id: 'gaming_setup',
    label: 'Gaming Setup / Battle Station',
    prompt: 'premium gaming battle station in darkness — three ultra-wide monitors glowing with game visuals, RGB lighting underneath desk and on PC components illuminating the ceiling and floor in waves of color, mechanical keyboard and mouse on desk mat, gaming chair in the hero position, the room lit almost entirely by screen glow and LED strips, maximum setup energy',
    triggers: /gaming|game|stream|twitch|youtube|battle station|setup|pc|console|playstation|xbox|fortnite|minecraft/i,
  },
  {
    id: 'neon_city_night',
    label: 'Neon City / Cyberpunk Street',
    prompt: 'rain-soaked cyberpunk city street at night — neon signs in multiple languages reflect in puddles on the ground, steam rising from grates, dense urban architecture above creating a canyon of glowing signs, delivery drones visible in the mid-distance, the atmosphere of a city that never sleeps and never feels truly safe',
    triggers: /cyber|neon|future|night|rain|dark|underground|hacker|digital|glitch|vr|matrix/i,
  },

  // ── EDUCATION & KNOWLEDGE ───────────────────────────────────────────────────
  {
    id: 'library_grand',
    label: 'Grand Library',
    prompt: 'vast historic grand library — floor-to-ceiling bookshelves rising four stories with rolling wooden ladders on brass rails, vaulted painted ceiling above, reading tables with green-glass banker lamps glowing warm, afternoon light through arched windows creating cathedral-like atmosphere, the weight of accumulated human knowledge visible everywhere',
    triggers: /library|book|read|study|learn|knowledge|education|university|school|academic|research|scholar/i,
  },
  {
    id: 'classroom_chalkboard',
    label: 'Classroom / Lecture Hall',
    prompt: 'university lecture hall — tiered wooden seating rising steeply, a massive green chalkboard wall at the front covered in equations and diagrams, overhead fluorescent lights mixing with chalk dust in the air, the scale of the room makes the individual feel small against accumulated knowledge',
    triggers: /class|school|teach|learn|lesson|lecture|tutorial|course|grade|student|professor|skill/i,
  },

  // ── FOOD & RESTAURANT ───────────────────────────────────────────────────────
  {
    id: 'restaurant_kitchen',
    label: 'Professional Kitchen',
    prompt: 'professional restaurant kitchen in full service — stainless steel surfaces reflecting overhead strip lighting, pans on flaming gas burners with cook fire visible, steam rising from multiple pots, chef whites and activity blurred in background, the controlled chaos of a real kitchen during dinner service, every surface marked by professional use',
    triggers: /kitchen|cook|chef|restaurant|food|recipe|meal|bake|grill|fry|dish|eat/i,
  },
  {
    id: 'street_food_market',
    label: 'Street Food Market',
    prompt: 'vibrant street food market at dusk — vendor stalls with colorful awnings, woks and open grills producing dramatic flames and smoke, strings of bare bulb lights overhead, crowds of people at stalls in soft focus behind, steam from noodle pots, the sensory overload of a real Asian night market or Latin street fair',
    triggers: /street food|market|food court|festival|fair|outdoor eat|vendor|food stall/i,
  },

  // ── DRAMATIC / MYSTERIOUS ───────────────────────────────────────────────────
  {
    id: 'abandoned_building',
    label: 'Abandoned / Derelict Building',
    prompt: 'massive derelict abandoned industrial building — broken skylights letting shafts of dusty light fall through to a rubble-covered floor, graffiti covering every accessible surface, pigeon feathers and broken glass, structural steel exposed where cladding has collapsed, nature beginning to reclaim the interior with vines, the silence of a place that once had thousands of people in it',
    triggers: /abandon|derelict|empty|left|forgotten|ghost|haunted|ruin|decay|old building|warehouse/i,
  },
  {
    id: 'hospital_corridor',
    label: 'Hospital Corridor',
    prompt: 'long sterile hospital corridor — fluorescent overhead lights create a white tunnel effect with slight flicker, linoleum floors reflect the clinical light, a gurney parked against the wall, double doors at the far end letting a sliver of different light through, the unnerving quiet of an empty medical hallway at night, the smell of antiseptic almost visible in the sharp lighting',
    triggers: /hospital|medical|health|doctor|surgery|clinic|emergency|patient|sick|injury/i,
  },
  {
    id: 'police_interrogation',
    label: 'Police Interrogation Room',
    prompt: 'bare concrete police interrogation room — single bare bulb hanging over a metal table and two chairs, one-way mirror window on the far wall with suggested observers behind, scuff marks on the floor from previous occupants, the table surface marked from years of use, harsh single-source shadow on every surface, total psychological pressure in every design element',
    triggers: /caught|arrested|police|interrogat|guilty|crime|confession|exposed|evidence|caught on camera/i,
  },
  {
    id: 'dark_alley',
    label: 'Dark Urban Alley',
    prompt: 'narrow urban back alley at night — single sodium-vapor streetlight at the far end creating a pool of amber in otherwise complete darkness, wet cobblestones reflecting the light, fire escape ladders climbing brick walls on either side, discarded cardboard and waste bins creating depth markers, mist at ground level, the atmosphere of a place where things happen off the record',
    triggers: /alley|dark|night|shadow|secret|underground|hidden|crime|back street|off record/i,
  },

  // ── SPORTS & COMPETITION ────────────────────────────────────────────────────
  {
    id: 'soccer_stadium',
    label: 'Football / Soccer Stadium',
    prompt: 'massive football stadium at night under floodlights — bright LED stadium lights create a perfectly lit green pitch surrounded by 80,000 seats, the crowd a sea of colored movement in the stands, fog rolling over the pitch from cold night air meeting stadium heat, the electric atmosphere of a sold-out night match visible in every frame element',
    triggers: /football|soccer|stadium|sport|match|goal|field|pitch|player|team|champion|world cup/i,
  },
  {
    id: 'basketball_court',
    label: 'Basketball Court',
    prompt: 'professional NBA-style basketball court — hardwood floor reflecting arena spotlights, three-point line and key markings in crisp paint, basket and backboard above center, stadium seating rising in all directions with spectator blur, the squeak of sneakers on wax implied, broadcast cameras visible in the corners, maximum arena energy',
    triggers: /basketball|nba|court|hoop|slam dunk|lebron|ball|dribble|three point/i,
  },

  // ── MOTIVATION / MINDSET ────────────────────────────────────────────────────
  {
    id: 'sunrise_horizon',
    label: 'Sunrise / Epic Horizon',
    prompt: 'vast open horizon at sunrise — the sun just cresting the earth\'s curve, light rays fanning out in every direction through morning haze, foreground landscape in deep silhouette, the first light of a new day splitting darkness with warm gold, the sky a gradient from deep purple to blue to orange to pure white at the sun\'s position, endless possibility in every visual element',
    triggers: /morning|sunrise|new day|start|begin|journey|motivation|inspire|goal|future|hope|dream/i,
  },
  {
    id: 'empty_road',
    label: 'Lone Road / Long Journey',
    prompt: 'single straight road disappearing to the horizon through vast empty landscape — highway lines converge to a vanishing point, the road elevated above surrounding terrain, storm clouds building ahead while sunlight breaks through from behind, the loneliness and determination of a solo journey with no clear endpoint yet, the distance is real',
    triggers: /journey|road|path|alone|solo|destination|travel|far|distance|life path|chapter/i,
  },

  // ── HOME & EVERYDAY ─────────────────────────────────────────────────────────
  {
    id: 'cozy_room',
    label: 'Cozy Home / Living Room',
    prompt: 'warmly lit cozy living space — practical lamps creating pools of amber light, bookshelves and personal items giving personality to the background, soft textures on furniture, a window showing evening light or rain, plants and lived-in details making the space feel genuinely human and comfortable, the background of someone real sharing something real',
    triggers: /home|house|room|apartment|cozy|personal|life|day|routine|vlog|diary|real life/i,
  },
  {
    id: 'garage_workshop',
    label: 'Garage / Workshop',
    prompt: 'functional garage workshop — pegboard walls covered in organized tools, workbench with project material under bright shop lights, vehicle partially visible in deep background, concrete floor with oil stains from real use, extension cords and equipment giving the space grit and authenticity, the workshop of someone who builds real things',
    triggers: /build|make|diy|create|craft|workshop|garage|project|construct|fix|repair|woodwork|mechanic/i,
  },

  // ── ENTERTAINMENT & PERFORMANCE ─────────────────────────────────────────────
  {
    id: 'concert_stage',
    label: 'Concert Stage / Arena',
    prompt: 'massive concert stage at peak performance moment — enormous LED video wall backdrop showing abstract visuals, follow-spot lights cutting through atmospheric haze from multiple directions, crowd of thousands in the foreground as a sea of phone screens and waving arms, professional stage set with truss rigging above, the scale of a real sold-out arena performance',
    triggers: /concert|music|stage|performance|show|tour|artist|sing|band|festival|live music/i,
  },
  {
    id: 'movie_set',
    label: 'Film / Movie Set',
    prompt: 'active professional movie production set — massive key light on C-stand in foreground, reflector boards and grip equipment, camera crane visible in mid-ground, script supervisor at a monitor, the organized controlled chaos of a real film production, high-end cinema cameras and lenses visible, the atmosphere of serious filmmaking at scale',
    triggers: /film|movie|cinema|production|direct|actor|shoot|scene|behind scenes|set/i,
  },

  // ── WEATHER & EXTREME CONDITIONS ────────────────────────────────────────────
  {
    id: 'storm_clouds',
    label: 'Epic Storm / Lightning',
    prompt: 'dramatic supercell thunderstorm — enormous anvil cloud formation filling the sky with a rotating wall cloud visible at the base, lightning forks visible in the cloud structures, the ground beneath in deep shadow while cloud tops are lit by late sun, green-tinged atmosphere suggesting extreme weather, the primal power of a genuine severe weather event',
    triggers: /storm|thunder|lightning|rain|extreme|disaster|hurricane|tornado|weather|flood/i,
  },
  {
    id: 'snow_blizzard',
    label: 'Snow / Blizzard / Arctic',
    prompt: 'arctic blizzard environment — driving horizontal snow reduces visibility to 10 meters, ice and snow cover every surface, frosted trees barely visible through the whiteout, the ground and sky almost indistinguishable in the whiteout conditions, the cold is a physical presence in every element, survival instinct triggered by the environment alone',
    triggers: /snow|blizzard|arctic|winter|cold|ice|frozen|north|polar|freeze|tundra/i,
  },
  {
    id: 'volcano_fire',
    label: 'Volcano / Fire / Lava',
    prompt: 'active volcanic landscape — rivers of molten orange-red lava flowing across black basalt rock, steam and toxic gas clouds rising where lava meets water, the sky glowing orange-red from the volcano\'s own light, the heat shimmer making distant elements waver, the entire scene lit by the lava\'s own intense warm glow, maximum elemental drama',
    triggers: /volcano|lava|fire|explosion|blast|erupt|extreme|heat|burn|flames|inferno/i,
  },

  // ── GENERIC FALLBACKS ────────────────────────────────────────────────────────
  {
    id: 'studio_dark',
    label: 'Dark Studio Void',
    prompt: 'pure professional dark studio — seamless black background paper extending from floor to mid-frame, subject entirely lit by controlled artificial sources with zero environment distraction, the infinite black void creates maximum subject contrast and isolates the person as the sole visual element, minimalist power',
    triggers: /studio|clean|minimal|simple|plain|dark|black background|void|just me/i,
  },
  {
    id: 'cinematic_wide',
    label: 'Cinematic Wide Environment',
    prompt: 'cinematic wide-angle environment shot — vast location chosen to match the topic scale, dramatic sky occupying the upper third of frame, the environment itself tells the story before the subject is even processed, atmospheric depth haze separates foreground and background into distinct visual planes, golden hour light from camera-left gives the scene genuine cinematic weight',
    triggers: /epic|cinematic|big|massive|huge|incredible|wide|vast|scale/i,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SMART SELECTOR — picks best combo from topic + style + niche
// ═══════════════════════════════════════════════════════════════════════════════

/** Pick randomly from an array */
function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Score then pick — when multiple items tie for the top score,
 * pick RANDOMLY among the tied winners so results vary every time.
 * fallbackPool: indices to randomly choose from when nothing matches.
 */
function pickBest<T extends { triggers: RegExp }>(
  library: T[],
  topic: string,
  fallbackPool: number[] = [0, 1, 2, 3, 4]
): T {
  const scored = library.map((item, idx) => ({
    item,
    idx,
    score: item.triggers.test(topic) ? 10 : 0,
  }));

  const maxScore = Math.max(...scored.map((s) => s.score));

  // Nothing matched → random from the fallback pool
  if (maxScore === 0) {
    const pool = fallbackPool
      .filter((i) => i < library.length)
      .map((i) => library[i]);
    return randFrom(pool);
  }

  // Pick randomly among ALL tied top-scorers
  const topTied = scored.filter((s) => s.score === maxScore).map((s) => s.item);
  return randFrom(topTied);
}

/**
 * Color grade scoring:
 *   topic trigger match  → 10 pts
 *   style fit            →  6 pts
 *   niche fit            →  4 pts
 *
 * Ties broken randomly so the same input can yield different grades
 * across generations (remix energy).
 */
function pickColorGrade(
  topic: string,
  style: StyleId,
  niche: Niche
): ColorGradeDef {
  const scored = COLOR_GRADES.map((g) => {
    let score = 0;
    if (g.triggers.test(topic))      score += 10;
    if (g.fitStyles.includes(style)) score += 6;
    if (g.fitNiches.includes(niche)) score += 4;
    return { grade: g, score };
  });

  const maxScore = Math.max(...scored.map((s) => s.score));

  // Absolutely nothing matched → random grade (never default to golden_viral alone)
  if (maxScore === 0) return randFrom(COLOR_GRADES);

  // Random among tied top scorers
  const topTied = scored.filter((s) => s.score === maxScore).map((s) => s.grade);
  return randFrom(topTied);
}

/**
 * Spread fallback pools across the full library so every element type
 * can show ANY of its items when keywords don't match — real variety.
 */
export function pickCinemaElements(
  topic: string,
  style: StyleId,
  niche: Niche
): CinemaSelection {
  // fallbackPools span the full library — random spread on no-match
  const exprPool   = Array.from({ length: EXPRESSIONS.length },      (_, i) => i);
  const camPool    = Array.from({ length: CAMERA_ANGLES.length },     (_, i) => i);
  const textPool   = Array.from({ length: TEXT_ENVIRONMENTS.length }, (_, i) => i);
  const bgPool     = Array.from({ length: BACKGROUNDS.length },       (_, i) => i);

  const expression  = pickBest(EXPRESSIONS,       topic, exprPool);
  const camera      = pickBest(CAMERA_ANGLES,     topic, camPool);
  const textEnv     = pickBest(TEXT_ENVIRONMENTS, topic, textPool);
  const colorGrade  = pickColorGrade(topic, style, niche);
  const background  = pickBest(BACKGROUNDS,       topic, bgPool);

  console.log('[Cinema] Picked:', {
    expression:  expression.label,
    camera:      camera.label,
    textEnv:     textEnv.label,
    colorGrade:  colorGrade.label,
    background:  background.label,
    scores: {
      exprTriggerHit:  expression.triggers.test(topic),
      camTriggerHit:   camera.triggers.test(topic),
      textTriggerHit:  textEnv.triggers.test(topic),
      bgTriggerHit:    background.triggers.test(topic),
    },
  });

  return { expression, camera, textEnv, colorGrade, background };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. REGENERATE — picks a DIFFERENT combo, never repeating prev selection
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Like pickBest but excludes one specific id from winning.
 * Falls through to the next best tier or a random non-excluded item.
 */
function pickBestExcluding<T extends { id: string; triggers: RegExp }>(
  library: T[],
  topic: string,
  excludeId: string
): T {
  const eligible = library.filter((item) => item.id !== excludeId);
  if (eligible.length === 0) return library[0]; // safety: only 1 item total

  const scored = eligible.map((item) => ({
    item,
    score: item.triggers.test(topic) ? 10 : 0,
  }));

  const maxScore = Math.max(...scored.map((s) => s.score));

  if (maxScore === 0) return randFrom(eligible);

  const topTied = scored.filter((s) => s.score === maxScore).map((s) => s.item);
  return randFrom(topTied);
}

function pickColorGradeExcluding(
  topic: string,
  style: StyleId,
  niche: Niche,
  excludeId: string
): ColorGradeDef {
  const eligible = COLOR_GRADES.filter((g) => g.id !== excludeId);
  if (eligible.length === 0) return COLOR_GRADES[0];

  const scored = eligible.map((g) => {
    let score = 0;
    if (g.triggers.test(topic))      score += 10;
    if (g.fitStyles.includes(style)) score += 6;
    if (g.fitNiches.includes(niche)) score += 4;
    return { grade: g, score };
  });

  const maxScore = Math.max(...scored.map((s) => s.score));
  if (maxScore === 0) return randFrom(eligible);

  const topTied = scored.filter((s) => s.score === maxScore).map((s) => s.grade);
  return randFrom(topTied);
}

/**
 * Regenerate: guaranteed to return a DIFFERENT combo from `prev`.
 * Every one of the 4 elements is forced to be a different id than before.
 */
export function pickCinemaElementsExcluding(
  prev: CinemaSelection,
  topic: string,
  style: StyleId,
  niche: Niche
): CinemaSelection {
  const expression = pickBestExcluding(EXPRESSIONS,       topic, prev.expression.id);
  const camera     = pickBestExcluding(CAMERA_ANGLES,     topic, prev.camera.id);
  const textEnv    = pickBestExcluding(TEXT_ENVIRONMENTS, topic, prev.textEnv.id);
  const colorGrade = pickColorGradeExcluding(topic, style, niche, prev.colorGrade.id);
  const background = pickBestExcluding(BACKGROUNDS,       topic, prev.background.id);

  console.log('[Cinema Regenerate] Excluded prev:', {
    wasExpression:  prev.expression.label,
    wasCamera:      prev.camera.label,
    wasTextEnv:     prev.textEnv.label,
    wasColorGrade:  prev.colorGrade.label,
    wasBackground:  prev.background.label,
  });
  console.log('[Cinema Regenerate] New pick:', {
    expression:  expression.label,
    camera:      camera.label,
    textEnv:     textEnv.label,
    colorGrade:  colorGrade.label,
    background:  background.label,
  });

  return { expression, camera, textEnv, colorGrade, background };
}
