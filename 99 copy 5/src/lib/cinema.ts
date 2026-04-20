// ═══════════════════════════════════════════════════════════════════════════════
// RETHUMB — SEMANTIC ANALYSIS ENGINE v2
// analyseTopic() reads the topic deeply before any prompt is built.
// ═══════════════════════════════════════════════════════════════════════════════

export interface SceneDef {
  location: string;
  bg: string;
  time?: string;
  atmosphere?: string;
}

export interface TopicAnalysis {
  activeModifiers: Record<string, boolean | string>;
  scene: SceneDef;
  expression: string;
  prop: string;
  colorGrade: string;
  lighting: string;
}

// ── RANDOM VARIATION ARRAYS (picked once per buildMasterPrompt call) ───────────

export const CAMERA_VARIATIONS = [
  'Shot on Sony A7 IV, 14mm ultra-wide fisheye lens, extreme barrel distortion, f/1.4',
  'Shot on RED Cinema camera, 12mm anamorphic, cinematic 2.39:1 compression, f/2.0',
  'Shot on Canon R5, 16mm ultra-wide, f/2.0, photojournalistic raw energy',
  'GoPro Hero 12 Black ultra-wide, extreme proximity to subject, fisheye look',
  'Shot on ARRI Alexa Mini, 18mm master prime, true cinema quality, f/1.8',
] as const;

export const LIGHTING_VARIATIONS = [
  'single hard key light from upper-left at 45 degrees creating Rembrandt shadow on far cheek',
  'golden hour backlight creating an intense glowing rim halo around the entire subject silhouette',
  'multiple colored practical lights in the environment creating complex mixed-color shadows',
  'single hard overhead theatrical spotlight, everything else in deep absolute shadow',
  'soft diffused large-source light from front creating luxury beauty lighting with no harsh shadows',
] as const;

export function randFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER ANALYSIS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

export function analyseTopic(topic: string): TopicAnalysis {
  const t = topic.toLowerCase();

  // ── PART 1: ADJECTIVE MODIFIERS ─────────────────────────────────────────────
  const m: Record<string, boolean | string> = {};
  if (/luxury|luxurious|expensive/.test(t))  Object.assign(m, { wealth: true, energy: 'controlled', prestige: true });
  if (/\bprivate\b/.test(t))                 Object.assign(m, { exclusive: true, energy: 'secretive' });
  if (/abandoned|haunted/.test(t))           Object.assign(m, { decay: true, energy: 'terrified' });
  if (/biggest|giant/.test(t))              Object.assign(m, { scale: 'massive', energy: 'explosive' });
  if (/worst|ugly|broke/.test(t))           Object.assign(m, { negative: true, energy: 'devastated' });
  if (/best|amazing|insane|crazy/.test(t))  Object.assign(m, { positive: true, energy: 'explosive' });
  if (/secret|hidden|fake/.test(t))         Object.assign(m, { hidden: true, energy: 'suspicious' });
  if (/impossible|viral/.test(t))           Object.assign(m, { extreme: true, energy: 'disbelief' });
  if (/dangerous|risk/.test(t))             Object.assign(m, { risk: true, energy: 'fear' });
  if (/ancient|historical/.test(t))         Object.assign(m, { historical: true, energy: 'awe' });
  if (/\brich\b|wealthy/.test(t))           Object.assign(m, { wealth: true, energy: 'triumphant' });
  if (/\blost\b|\balone\b/.test(t))         Object.assign(m, { negative: true, energy: 'isolated' });
  if (/\bfirst\b|\bnew\b/.test(t))          Object.assign(m, { milestone: true, energy: 'nervous' });
  if (/\blast\b/.test(t))                   Object.assign(m, { ending: true, energy: 'emotional' });

  // ── PART 2: SCENE DETECTOR ──────────────────────────────────────────────────
  function detectScene(): SceneDef {
    // WATER / BOAT
    if (/boat|yacht|ship|harbour|sea|ocean|cruise/.test(t)) {
      if (m.wealth || m.prestige || /yacht|private/.test(t))
        return { location: 'deck of an enormous luxury superyacht at golden hour', bg: 'Mediterranean sea to horizon, deep azure water, polished teak deck, chrome railings, other yachts in distance, white coastal buildings', time: 'golden hour amber sun low on horizon', atmosphere: 'absolute luxury, sea breeze, wealth made physical' };
      if (/harbour|dock|port/.test(t))
        return { location: 'busy harbour dock', bg: 'rows of boats moored, ropes and rigging, seagulls, weathered wood, lighthouse in distance, dramatic sky', atmosphere: 'salty maritime, real and weathered' };
      return { location: 'bow of a boat on open water', bg: 'vast open ocean surrounding the boat, horizon infinite, waves breaking on hull', atmosphere: 'freedom, open water, adventure' };
    }
    // SPACE / ROCKET
    if (/space|rocket|nasa|moon|mars|orbit|launch/.test(t)) {
      if (/launch|rocket|liftoff/.test(t))
        return { location: 'rocket launch site at night', bg: 'enormous rocket igniting all engines, massive clouds of fire and steam, night sky lit orange and white, launch tower visible, crowds in distance', atmosphere: 'earth-shaking power, historic moment, fire and smoke' };
      return { location: 'in outer space', bg: 'vast black space, curve of a planet below, Milky Way stretching across sky, distant nebulae in purple and blue', atmosphere: 'infinite, weightless, scale beyond comprehension' };
    }
    // JUNGLE / SURVIVAL
    if (/jungle|amazon|rainforest|survive|survival|wild/.test(t)) {
      if (/africa|safari|savanna|lion|elephant/.test(t))
        return { location: 'African savanna at sunset', bg: 'vast African savanna, golden grasslands, acacia trees silhouetted against blood-orange sunset, herd of elephants crossing, pride of lions in golden grass, Kilimanjaro through heat haze', time: 'blood orange African sunset', atmosphere: 'primal Africa, raw nature' };
      return { location: 'deep Amazon rainforest', bg: 'impossibly dense Amazon, ancient trees 80 meters tall, canopy so thick only golden shafts penetrate, exotic birds, narrow path disappearing into green darkness, mist and haze', time: 'golden shafts through canopy', atmosphere: 'primal wilderness, survival' };
    }
    // UNDERWATER
    if (/underwater|diving|sunken|atlantis|coral|deep sea/.test(t))
      return { location: 'deep underwater ruins', bg: 'ruins of ancient sunken civilization, massive stone columns covered in coral, bioluminescent creatures glowing electric blue and purple, treasure chests spilling gold, enormous sharks circling above, sun rays from surface far above', atmosphere: 'ancient mystery, the deep, otherworldly beauty' };
    // DESERT
    if (/desert|sahara|sand|dune/.test(t)) {
      if (/oasis/.test(t))
        return { location: 'stunning oasis in the Sahara', bg: 'stunning oasis in endless Sahara, date palms, perfectly still turquoise pool, dunes towering in every direction, camel caravan in background, desert sunset', atmosphere: 'life in the void, precious water, desert magic' };
      return { location: 'endless Sahara Desert', bg: 'endless Sahara, towering dunes with dramatic shadows, heat shimmer, bleached harsh sun, no life visible, figure dwarfed by the scale', atmosphere: 'vast emptiness, human insignificance, brutal beauty' };
    }
    // MOUNTAIN
    if (/mountain|everest|summit|climb|peak|glacier/.test(t))
      return { location: 'brutal mountain summit in blizzard', bg: 'brutal icy mountain summit in howling blizzard, wind-driven snow, world dropping away thousands of meters in every direction, smaller peaks visible through storm clouds below, dramatic shafts of light breaking through', atmosphere: 'extreme altitude, human endurance, the top of the world' };
    // CITY
    if (/city|urban|skyscraper|new york|paris|london|tokyo|dubai/.test(t)) {
      const cm = t.match(/new york|paris|london|tokyo|dubai|chicago|miami/);
      const cn = cm ? cm[0] : 'the city';
      if (m.wealth || m.prestige)
        return { location: `rooftop of luxury skyscraper in ${cn}`, bg: 'rooftop of luxury skyscraper, city at golden hour, thousands of glass windows catching light, helicopter pad nearby, infinity pool, the wealth of the city below', atmosphere: 'power, elevation, the world beneath your feet' };
      return { location: `streets of ${cn}`, bg: 'streets of the city, iconic architecture, busy urban energy, cinematic city atmosphere', atmosphere: 'urban energy, city life, metropolitan drama' };
    }
    // ANCIENT / RUINS
    if (/ancient|pyramid|egypt|rome|temple|castle|medieval/.test(t)) {
      const lm = t.match(/pyramid|colosseum|parthenon|stonehenge|angkor wat|machu picchu|great wall/);
      const landmark = lm ? lm[0] : 'ancient ruins';
      return { location: `${landmark} at golden hour`, bg: `the ${landmark} at golden hour, dramatic storm clouds, weight of thousands of years of history, tourists dwarfed by scale, golden light on ancient stone`, atmosphere: 'ancient history, civilizations past, the weight of time' };
    }
    // MONEY / WEALTH
    if (/money|million|rich|invest|crypto|trading|profit/.test(t))
      return { location: 'opulent luxury penthouse', bg: 'opulent luxury penthouse, floor-to-ceiling glass overlooking glittering city at night, marble floors, gold accents, chandelier, stacks of cash and gold bars, stock screens showing massive gains', atmosphere: 'extreme wealth, financial power, success materialized' };
    // HORROR / HAUNTED
    if (/ghost|haunted|horror|demon|paranormal|curse/.test(t))
      return { location: 'decrepit Victorian mansion at midnight', bg: 'decrepit Victorian mansion at midnight, full blood moon, every window glowing yellow, ghostly silhouette in attic window, dead gnarled trees, knee-height ground fog, wrought iron cemetery gate', time: 'midnight', atmosphere: 'pure dread, the supernatural, ancient evil' };
    // GAMING / ESPORTS
    if (/game|gaming|esports|stream|tournament/.test(t))
      return { location: 'professional esports arena', bg: 'professional esports arena, thousands of fans in darkness, massive screens showing the game, neon purple and blue lighting, championship trophy visible, electric crowd energy', atmosphere: 'competitive gaming, electric arena, championship stakes' };
    // FOOD
    if (/food|cook|chef|restaurant|kitchen/.test(t)) {
      if (m.wealth || m.prestige)
        return { location: 'Michelin-starred kitchen', bg: 'Michelin-starred kitchen, flames from a pan, gleaming stainless steel, chef brigade working, elegant plating station, fine dining theatre', atmosphere: 'culinary excellence, the art of food, Michelin perfection' };
      return { location: 'dramatic kitchen in full chaos', bg: 'dramatic kitchen with flames, colorful ingredients, steam rising, the chaos and beauty of cooking at full intensity', atmosphere: 'culinary passion, food as art, kitchen energy' };
    }
    // TECH / AI
    if (/tech|ai|robot|code|coding|hack|cyber|matrix/.test(t)) {
      if (/hack|cyber|dark web/.test(t))
        return { location: 'dark server room', bg: 'dark server room, green code cascading on multiple monitors, holographic interfaces, red warning lights, Matrix digital rain', atmosphere: 'digital underground, hacker culture, information warfare' };
      return { location: 'futuristic laboratory', bg: 'futuristic laboratory, holographic displays showing data, cool blue neon, transparent screens, robotic arms, the feeling of the near future already here', atmosphere: 'technological wonder, the near future, human ingenuity' };
    }
    // SCHOOL / EDUCATION
    if (/school|university|exam|graduate|degree/.test(t))
      return { location: 'grand university campus', bg: 'grand university campus, ivy-covered stone buildings, students in background, towering library bookshelves, graduation ceremony atmosphere', atmosphere: 'academic excellence, knowledge, achievement' };
    // SPORTS / GYM
    if (/gym|fitness|boxing|fight|sport|athlete|marathon/.test(t)) {
      if (/boxing|fight|mma/.test(t))
        return { location: 'packed professional boxing arena', bg: 'packed professional boxing arena, thousands in darkness, single spotlight on the ring, championship belt on corner post, historic fight energy', atmosphere: 'combat sports, championship stakes, warrior energy' };
      return { location: 'professional sports facility', bg: 'professional sports facility, dramatic event lighting, crowds, championship atmosphere', atmosphere: 'athletic excellence, competition, peak performance' };
    }
    // DEFAULT — verb-based fallback
    const vm = t.match(/\b(went|found|bought|won|lost|survived|made|built)\b/);
    if (vm) {
      const verbScenes: Record<string, SceneDef> = {
        went:     { location: 'dramatic cinematic journey environment', bg: 'sweeping cinematic landscape that matches the journey, dramatic lighting, vast scale, the atmosphere of a real adventure', atmosphere: 'journey, discovery, the road ahead' },
        found:    { location: 'site of an incredible discovery', bg: 'dramatic discovery environment, mysterious light falling on something incredible, the moment of revelation captured in the surroundings', atmosphere: 'discovery, revelation, the impossible found' },
        bought:   { location: 'impressive acquisition environment', bg: 'aspirational setting showing what was acquired, sleek and impressive, the atmosphere of a significant purchase', atmosphere: 'acquisition, status, the prize' },
        won:      { location: 'championship victory environment', bg: 'victory environment with celebration atmosphere, confetti, trophy light, the air of triumph visible in the surroundings', atmosphere: 'victory, triumph, earning it' },
        lost:     { location: 'dramatic loss environment', bg: 'emotionally heavy environment, dark and weight-bearing, the atmosphere of something significant ending', atmosphere: 'loss, the end of something, weight' },
        survived: { location: 'post-survival dramatic landscape', bg: 'raw survival environment, evidence of the ordeal visible everywhere, the atmosphere of barely making it through', atmosphere: 'survival, relief, made it' },
        made:     { location: 'creation environment', bg: 'dramatic creation space showing what was built or made, impressive scale, the satisfaction of creation in the atmosphere', atmosphere: 'creation, pride, building something real' },
        built:    { location: 'impressive construction environment', bg: 'dramatic build environment, scale and achievement visible, the atmosphere of something great being brought into existence', atmosphere: 'construction, scale, achievement' },
      };
      return verbScenes[vm[1]] || { location: 'dramatic cinematic environment', bg: 'sweeping cinematic landscape, dramatic golden hour lighting, vast scale, atmospheric depth haze', atmosphere: 'cinematic drama' };
    }
    return { location: 'dramatic cinematic environment', bg: 'sweeping cinematic landscape, dramatic golden hour lighting, vast scale, atmospheric depth haze, the perfect backdrop for maximum visual impact', time: 'golden hour', atmosphere: 'cinematic drama, visual impact, maximum engagement' };
  }

  // ── PART 3: EXPRESSION DETECTOR ─────────────────────────────────────────────
  function detectExpression(): string {
    const energy = m.energy as string | undefined;
    if (m.prestige && energy === 'controlled')
      return 'controlled confident satisfaction — slight knowing smile, eyes calm and powerful, chin slightly raised, the expression of someone who has already won before the game began';
    if (energy === 'terrified')
      return 'genuine primal terror — eyes blown impossibly wide with visible whites all around the iris, mouth open in a silent scream, body caught recoiling backward, every muscle frozen in fight-or-flight';
    if (energy === 'devastated')
      return 'complete devastation — head dropped forward, eyes hollow and glassy, mouth slightly open, the expression of someone who just lost everything, shoulders collapsed inward carrying the weight';
    if (energy === 'suspicious')
      return 'sharp calculating suspicious look — one eyebrow raised sharply and independently, slight smirk at corner of mouth, eyes narrowed and scanning, the face of someone who knows what others do not';
    if (energy === 'euphoric')
      return 'pure explosive euphoric joy — the absolute biggest smile possible, eyes squeezed shut in happiness, head thrown back, arms thrown wide, every single cell in the body celebrating';
    if (energy === 'disbelief')
      return 'complete and total disbelief and awe — jaw dropped as far as anatomically possible, eyes wide and glassy, both hands pressed flat against both cheeks, the Home Alone expression pushed to the physiological maximum';
    if (energy === 'wonder')
      return 'genuine reverent wonder — eyes soft and wide, mouth slightly open, a quiet reverence in the expression, the face of someone seeing something truly beautiful for the very first time';
    if (energy === 'triumphant')
      return 'triumphant championship victory — fist raised to the sky, massive open grin showing all teeth, chest puffed out, veins visible in raised fist, the face of absolute conquest';
    if (energy === 'awe')
      return 'overwhelmed by incomprehensible historical scale — mouth slightly open, eyes soft and wide taking in something ancient and enormous, a reverent silence in the expression';
    if (/survive|danger|attack|escape|chase|bite/.test(t))
      return 'extreme primal survival shock — mouth gaping wide open revealing full teeth and tongue, eyes bulging outward with whites visible completely around the iris, neck muscles strained, body caught mid-recoil from something threatening';
    if (/won|champion|record|trophy|gold medal/.test(t))
      return 'explosive victory celebration — screaming with joy, fist pumped to sky, tears of happiness possible, the face of someone who just proved every doubter wrong';
    if (/lost|fail|disaster|broke|bankrupt/.test(t))
      return 'complete collapse — head buried in both hands, shoulders shaking, the physical manifestation of failure visible in every muscle';
    if (/found|discover|uncover|reveal/.test(t))
      return 'stunned discovery — mouth open in perfect O shape, eyes locked wide on something incredible, one hand raising slowly to mouth in stunned disbelief';
    if (/bought|received|unbox/.test(t))
      return 'excited reveal energy — bright eyes, huge smile, hands gesturing toward item, barely containing the electricity of showing everyone';
    if (/confess|truth|honest|real talk/.test(t))
      return 'serious direct confessional — unblinking direct eye contact with camera, jaw set, the gravity and weight of someone about to say something that truly matters';
    return 'wide open mouth expression of maximum shock and excitement, one arm extending fully toward camera, eyes blown wide, the archetypal viral YouTube expression';
  }

  // ── PART 4a: PROP DETECTOR ───────────────────────────────────────────────────
  function detectProp(): string {
    if (/boat|yacht/.test(t))      return m.wealth ? 'holding a champagne flute on the yacht deck' : 'gripping the boat railing as spray hits';
    if (/rocket|space/.test(t))    return 'pointing dramatically at the launch vehicle or holding a model rocket with sparks';
    if (/money|cash|rich|million/.test(t)) return 'holding an enormous fanned stack of cash toward camera OR pointing at floating money raining down';
    if (/food|cook|chef/.test(t))  return 'holding an absurdly oversized version of the food item toward camera';
    if (/snake|animal|creature/.test(t)) return 'gripping a large threatening creature that lunges toward camera';
    if (/car|vehicle|drive/.test(t)) return 'holding car keys dangling dramatically toward camera';
    if (/trophy|medal|won|champion/.test(t)) return 'holding championship trophy raised above head OR gold medal displayed toward camera';
    if (/phone|app|tech|ai/.test(t)) return 'thrusting a glowing phone screen dramatically toward camera showing something shocking';
    if (/map|explore|travel/.test(t)) return 'holding a crumpled weathered map OR pointing at something incredible in the distance';
    return 'pointing dramatically with one fully extended arm directly at camera';
  }

  // ── PART 4b: COLOR GRADE DETECTOR ───────────────────────────────────────────
  function detectColorGrade(): string {
    if (m.wealth || m.prestige)   return 'rich warm gold and deep velvet black luxury grade — muted desaturated midtones, deep crushed shadows, warm amber highlights, the color of expensive things';
    if (/haunted|ghost|horror/.test(t)) return 'desaturated cold horror grade — blue-green shadows, pale drained skin tones, deep crushed blacks, slight green tint like night vision, heavy film grain';
    if (/space|underwater|cave/.test(t)) return 'deep blue-purple otherworldly grade — cool dark shadows, cyan and purple bioluminescent highlights, the color of places beyond human reach';
    if (/africa|desert|survival|jungle/.test(t)) return 'extreme warm golden-amber National Geographic grade — pushed warm tones, orange shadows, the look of adventure and survival';
    if (/money|wealth|finance/.test(t)) return 'gold and emerald luxury grade — warm gold highlights, deep green accents, the color palette of money and power';
    if (/night|secret|trespass|forbidden/.test(t)) return 'deep teal-blue midnight grade — cold shadows, silver moonlight, the cinematic blue of midnight secrets';
    if (/gaming|neon|esports/.test(t)) return 'hyper-saturated neon gaming grade — electric purple, blue, green neon against deep black, maximum saturation';
    return 'extreme warm golden-orange cinematic grade — maximum saturation, high contrast, golden hour feel, atmospheric dust particles in the air';
  }

  // ── PART 4c: LIGHTING DETECTOR ──────────────────────────────────────────────
  function detectLighting(): string {
    if (m.wealth || m.prestige) return 'multiple controlled studio sources — luxury commercial photography lighting, warm key from above-left at 45 degrees, subtle cool fill from right creating perfect separation';
    if (/night|dark|horror/.test(t)) return 'single hard theatrical spotlight from directly above creating dramatic pool of light with absolute darkness surrounding it, cold moonlight rim light on edges';
    if (/jungle|nature|forest/.test(t)) return 'dappled golden hour light piercing through canopy at 45 degrees, atmospheric haze with visible god rays, warm reflected fill from the foliage';
    if (/space|underwater/.test(t)) return 'single directional cold light from one side creating deep dramatic shadow on opposite side, ambient bioluminescent or starfield glow';
    if (/desert|africa/.test(t)) return 'brutal overhead sun OR golden hour backlight creating long dramatic shadows and intense warm rim light on everything';
    return 'dramatic golden hour backlight from upper-left creating god rays through atmospheric haze and intense rim light on the subject separating them from background';
  }

  return {
    activeModifiers: m,
    scene: detectScene(),
    expression: detectExpression(),
    prop: detectProp(),
    colorGrade: detectColorGrade(),
    lighting: detectLighting(),
  };
}
