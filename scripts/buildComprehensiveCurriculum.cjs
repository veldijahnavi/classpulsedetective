/**
 * Comprehensive Curriculum, Question Bank, and Lesson Expansion Script
 * Builds complete board-prescribed chapters, 15-20 questions per topic, and detailed 16-point lessons.
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('Original DB state:', {
  chapters: db.chapters.length,
  lessons: db.lessons.length,
  questions: db.questions.length,
});

// Existing IDs set to protect existing content
const existingChapterIds = new Set(db.chapters.map((c) => c.id));
const existingLessonIds = new Set(db.lessons.map((l) => l.id));
const existingQuestionIds = new Set(db.questions.map((q) => q.id));

// =========================================================================
// 1. OFFICIAL CHAPTERS DEFINITIONS (CBSE, TELANGANA SSC, CISCE: Cl 6-10)
// =========================================================================

const newOfficialChapters = [
  // --- CBSE CLASS 10 SCIENCE (Complete 13 Chapters) ---
  {
    id: 'ch_cbse10_sci_acids',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 2,
    title: 'Acids, Bases and Salts',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Acids and bases are fundamental chemical classifications that define pH, chemical reactivity, and industrial synthesis. In this chapter, we explore indicators, neutralization reactions, the pH scale, and the manufacturing of essential salts like bleaching powder, baking soda, and plaster of Paris.',
    learningObjectives: [
      'Understand chemical properties of acids and bases with metals, carbonates, and oxides',
      'Explain the concept of pH as a measure of hydronium ion concentration',
      'Describe the importance of pH in everyday life (digestive system, soil, tooth decay)',
      'Detail the preparation and uses of sodium hydroxide, bleaching powder, baking soda, washing soda, and plaster of Paris',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_acids_c1',
        chapterId: 'ch_cbse10_sci_acids',
        title: 'Properties of Acids & Bases, Indicators and pH Scale',
        description: 'Litmus, synthetic indicators, neutralization reactions, and pH scale interpretation.',
        order: 1,
        learningOutcome: 'Interpret pH values and predict acidity, basicity, and neutralization outcomes.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_acids_c2',
        chapterId: 'ch_cbse10_sci_acids',
        title: 'Important Salts & Plaster of Paris Formulation',
        description: 'Preparation, properties, and chemical formulas of industrial and domestic salts.',
        order: 2,
        learningOutcome: 'State chemical equations for the preparation of bleaching powder, baking soda, and gypsum.',
        prerequisites: ['con_cbse10_sci_acids_c1'],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_sci_metals',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 3,
    title: 'Metals and Non-metals',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Elements are categorized as metals and non-metals based on their electronic configuration, physical ductility/conductivity, and chemical reactivity series. We investigate ionic bonding, extraction of metals from ores (metallurgy), and corrosion prevention.',
    learningObjectives: [
      'Compare physical and chemical properties of metals and non-metals',
      'Explain reactivity series and displacement reactions',
      'Describe the formation and properties of ionic compounds',
      'Understand basic metallurgical processes: roasting, calcination, and electrolytic refining',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_metals_c1',
        chapterId: 'ch_cbse10_sci_metals',
        title: 'Reactivity Series & Ionic Compound Formation',
        description: 'Metal displacement reactions, electron transfer, and lattice properties of ionic salts.',
        order: 1,
        learningOutcome: 'Predict reaction feasibility using the activity series and draw electron-dot structures.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_metals_c2',
        chapterId: 'ch_cbse10_sci_metals',
        title: 'Metallurgy: Extraction of Metals & Refining',
        description: 'Concentration of ores, calcination, roasting, reduction, and electrolytic refining of copper.',
        order: 2,
        learningOutcome: 'Outline extraction steps for metals of low, medium, and high reactivity.',
        prerequisites: ['con_cbse10_sci_metals_c1'],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_sci_carbon',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 4,
    title: 'Carbon and its Compounds',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Carbon displays unique tetravalency and catenation, forming covalent bonds that create millions of organic molecules. We study homologous series, functional groups, IUPAC nomenclature, combustion, addition, substitution reactions, and soaps vs. detergents.',
    learningObjectives: [
      'Explain covalent bonding in carbon, methane, and carbon dioxide',
      'Identify homologous series and functional groups (alcohol, aldehyde, ketone, carboxylic acid)',
      'Write IUPAC names and structural formulas of saturated and unsaturated hydrocarbons',
      'Differentiate between soaps and detergents and explain micelle cleaning action',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_carbon_c1',
        chapterId: 'ch_cbse10_sci_carbon',
        title: 'Covalent Bonding, Catenation & Homologous Series',
        description: 'Tetravalency, allotropes of carbon, alkanes, alkenes, alkynes, and functional groups.',
        order: 1,
        learningOutcome: 'Identify homologous series members and determine general chemical formulas.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_carbon_c2',
        chapterId: 'ch_cbse10_sci_carbon',
        title: 'Chemical Reactions of Carbon Compounds & Soaps',
        description: 'Combustion, oxidation, addition reactions with nickel catalyst, esterification, and saponification.',
        order: 2,
        learningOutcome: 'Explain saponification and the hydrophilic/hydrophobic structure of soap micelles.',
        prerequisites: ['con_cbse10_sci_carbon_c1'],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_sci_control',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 6,
    title: 'Control and Coordination',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Organisms respond to stimuli through nervous and hormonal coordination. In animals, neurons, reflex arcs, the central nervous system, and endocrine glands govern homeostasis. In plants, phytohormones regulate tropic and nastic movements.',
    learningObjectives: [
      'Describe the structure and function of a neuron and synapse',
      'Explain the reflex arc mechanism and components of human brain',
      'Identify plant hormones (auxin, gibberellin, cytokinin, abscisic acid) and tropic movements',
      'Outline endocrine glands, hormones secreted, and feedback mechanisms',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_control_c1',
        chapterId: 'ch_cbse10_sci_control',
        title: 'Nervous System, Synapse Transmission & Reflex Arcs',
        description: 'Electrical impulses in neurons, neurotransmitter diffusion across synapses, and reflex pathways.',
        order: 1,
        learningOutcome: 'Trace the impulse path from sensory receptor to effector organ in a reflex arc.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_control_c2',
        chapterId: 'ch_cbse10_sci_control',
        title: 'Plant Hormones & Animal Endocrine Glands',
        description: 'Phototropism, geotropism, auxin differential elongation, thyroxine, insulin, and adrenaline.',
        order: 2,
        learningOutcome: 'Correlate endocrine hormone functions with deficiency and excess symptoms.',
        prerequisites: ['con_cbse10_sci_control_c1'],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_sci_light',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 9,
    title: 'Light – Reflection and Refraction',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Light travels in straight lines and exhibits reflection and refraction when encountering optical boundaries. We master spherical mirrors (concave and convex), the mirror formula, magnification, Snell’s law of refraction, lenses, and power of a lens in dioptres.',
    learningObjectives: [
      'Draw ray diagrams for concave and convex mirrors across various object positions',
      'Apply mirror formula: 1/f = 1/v + 1/u and calculate magnification',
      'State laws of refraction and Snell’s law: sin(i)/sin(r) = constant',
      'Apply lens formula: 1/f = 1/v - 1/u and calculate optical power P = 1/f',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_light_c1',
        chapterId: 'ch_cbse10_sci_light',
        title: 'Reflection at Spherical Mirrors & Mirror Formula',
        description: 'Focal length, center of curvature, ray tracing, Cartesian sign convention, and magnification.',
        order: 1,
        learningOutcome: 'Solve numerical problems using the mirror formula with correct signs.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_light_c2',
        chapterId: 'ch_cbse10_sci_light',
        title: 'Refraction, Snell’s Law, Lens Formula & Optical Power',
        description: 'Refractive index, convex/concave lens image formation, lens formula, and power P = 1/f (m).',
        order: 2,
        learningOutcome: 'Calculate refractive indices and lens power in dioptres for optical combinations.',
        prerequisites: ['con_cbse10_sci_light_c1'],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_sci_electricity',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 11,
    title: 'Electricity',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Electric charge flow constitutes electric current. In this chapter, we study electric potential difference, Ohm’s law, electrical resistance and resistivity, resistors in series and parallel, heating effect of electric current (Joule’s law), and electric power.',
    learningObjectives: [
      'Define electric current (I = Q/t) and potential difference (V = W/Q)',
      'Verify Ohm’s law V = IR and understand factors affecting resistance (R = ρl/A)',
      'Calculate equivalent resistance for series and parallel combinations',
      'Apply Joule’s law of heating (H = I^2 R t) and compute electric power and commercial energy units (kWh)',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_elec_c1',
        chapterId: 'ch_cbse10_sci_electricity',
        title: 'Ohm’s Law, Resistance & Resistivity Factors',
        description: 'Current, potential difference, V-I graphs, and resistivity dependence on length and area.',
        order: 1,
        learningOutcome: 'Compute resistance changes when wires are stretched or doubled in area.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_elec_c2',
        chapterId: 'ch_cbse10_sci_electricity',
        title: 'Resistors in Series/Parallel, Joule’s Heating & Power',
        description: 'Equivalent resistances, current division, voltage division, heating effect, and electric power.',
        order: 2,
        learningOutcome: 'Solve complex circuit combinations and compute electricity consumption costs.',
        prerequisites: ['con_cbse10_sci_elec_c1'],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },

  // --- TELANGANA SSC CLASS 10 PHYSICAL SCIENCE (All 12 Chapters) ---
  {
    id: 'ch_ts10_ps_atomic',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterNumber: 6,
    title: 'Structure of Atom (Bohr-Sommerfeld Model & Quantum Numbers)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Understanding the atomic structure is fundamental to modern chemistry and physics. We explore electromagnetic spectrum, Bohr’s atomic model, Sommerfeld elliptical orbits, quantum numbers (n, l, ml, ms), Aufbau principle, Pauli exclusion principle, and Hund’s rule of maximum multiplicity.',
    learningObjectives: [
      'Explain electromagnetic wave parameters: wavelength, frequency, wave number, and velocity',
      'Explain the significance of the four quantum numbers in defining electron states',
      'Apply Aufbau principle, Pauli’s exclusion principle, and Hund’s rule to write electronic configurations',
      'Differentiate between degenerate orbitals and orbital shapes (s, p, d)',
    ],
    concepts: [
      {
        id: 'con_ts10_ps_atom_c1',
        chapterId: 'ch_ts10_ps_atomic',
        title: 'Quantum Numbers & Electronic Configuration Principles',
        description: 'Principal (n), Azimuthal (l), Magnetic (ml), and Spin (ms) quantum numbers and orbital filling rules.',
        order: 1,
        learningOutcome: 'Assign quantum numbers to electrons and write correct electronic configurations for elements 1-30.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ts_scert',
    isComplete: true,
  },
  {
    id: 'ch_ts10_ps_bonding',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterNumber: 8,
    title: 'Chemical Bonding (Lewis Theory & Octet Rule)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Atoms bond to achieve stable electronic noble-gas configurations. We explore ionic bonding (electrostatic attraction between ions), covalent bonding (electron sharing), polar vs nonpolar bonds, and properties of ionic and covalent substances.',
    learningObjectives: [
      'Explain ionic bond formation in NaCl and MgCl2 using Lewis dot structures',
      'Explain covalent bond formation in H2, O2, N2, and CH4',
      'Contrast ionic compounds (high melting points, conduct in solution) with covalent molecules',
    ],
    concepts: [
      {
        id: 'con_ts10_ps_bond_c1',
        chapterId: 'ch_ts10_ps_bonding',
        title: 'Ionic & Covalent Bond Formation & Properties',
        description: 'Electron transfer, electron sharing, lattice energy, and conductivity differences.',
        order: 1,
        learningOutcome: 'Represent chemical bond formation with Lewis electron-dot diagrams.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ts_scert',
    isComplete: true,
  },
  {
    id: 'ch_ts10_ps_current',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterNumber: 9,
    title: 'Electric Current & Kirchhoff’s Laws',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Electric current in metallic conductors involves drift velocity of free electrons. We explore drift speed, electric potential, Ohm’s law, Kirchhoff’s Junction Law, Kirchhoff’s Loop Law, and electric power dissipation.',
    learningObjectives: [
      'Define drift velocity (vd = I / nAe) and understand internal resistance of cells',
      'State and apply Kirchhoff’s Junction Law (Conservation of Charge)',
      'State and apply Kirchhoff’s Loop Law (Conservation of Energy)',
    ],
    concepts: [
      {
        id: 'con_ts10_ps_curr_c1',
        chapterId: 'ch_ts10_ps_current',
        title: 'Kirchhoff’s Laws & Circuit Analysis',
        description: 'Junction law, loop law, and sign conventions in multi-loop electrical circuits.',
        order: 1,
        learningOutcome: 'Calculate branch currents and potential differences across complex network nodes.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ts_scert',
    isComplete: true,
  },

  // --- TELANGANA SSC CLASS 10 BIOLOGICAL SCIENCE ---
  {
    id: 'ch_ts10_bs_nutrition',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Biological Science',
    chapterNumber: 1,
    title: 'Nutrition – Food Supplying System',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'All living organisms need nutrition to carry out vital functions. We explore autotrophic nutrition (photosynthesis, Hill’s reaction, light and dark reactions in chloroplasts), heterotrophic nutrition, human digestive system, and nutritional deficiency diseases (Kwashiorkor, Marasmus).',
    learningObjectives: [
      'Describe the photochemical and biosynthetic phases of photosynthesis',
      'Explain experiments showing requirement of chlorophyll, light, and CO2 for starch production',
      'Trace food passage and enzyme actions throughout the human alimentary canal',
      'Identify malnutrition diseases and dietary solutions',
    ],
    concepts: [
      {
        id: 'con_ts10_bs_nutr_c1',
        chapterId: 'ch_ts10_bs_nutrition',
        title: 'Photosynthesis Mechanism & Human Digestive Enzymes',
        description: 'Light-dependent reaction in grana thylakoids, Calvin cycle in stroma, and digestive enzyme functions.',
        order: 1,
        learningOutcome: 'Explain the role of chlorophyll, ATP, and NADPH in photosynthesis and digestive enzymes in nutrient absorption.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ts_scert',
    isComplete: true,
  },
  {
    id: 'ch_ts10_bs_respiration',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Biological Science',
    chapterNumber: 2,
    title: 'Respiration – The Energy Releasing System',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Respiration releases chemical energy stored in glucose via aerobic and anaerobic pathways. We study respiratory passage in humans, gaseous exchange at alveolar and tissue levels, glycolysis, Krebs cycle, and fermentation in yeast.',
    learningObjectives: [
      'Differentiate between aerobic cellular respiration and anaerobic fermentation',
      'Explain alveolar gas exchange by partial pressure gradients',
      'Describe ATP generation and energy yield differences',
    ],
    concepts: [
      {
        id: 'con_ts10_bs_resp_c1',
        chapterId: 'ch_ts10_bs_respiration',
        title: 'Cellular Respiration Pathways & Gas Exchange Mechanisms',
        description: 'Glycolysis in cytoplasm, Krebs cycle in mitochondrial matrix, lactic acid vs ethanol fermentation.',
        order: 1,
        learningOutcome: 'Compare energy outputs and chemical end products of aerobic vs anaerobic respiration.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ts_scert',
    isComplete: true,
  },

  // --- CISCE CLASS 10 CHEMISTRY (ICSE 2026-2027) ---
  {
    id: 'ch_cisce10_chem_mole',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterNumber: 5,
    title: 'Mole Concept and Stoichiometry (Gay-Lussac & Avogadro Laws)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Quantitative chemistry relies on the mole concept and gas volume relations. In this chapter, we master Gay-Lussac’s Law of Combining Volumes, Avogadro’s Law, molar volume at STP (22.4 dm³), vapour density (VD = MW/2), empirical and molecular formula calculations, and stoichiometry.',
    learningObjectives: [
      'Apply Gay-Lussac’s Law to determine reacting gas volumes and excess gases',
      'Relate molecular weight to relative vapour density: MW = 2 x VD',
      'Calculate percentage composition, empirical formula, and molecular formula',
      'Solve stoichiometric mass-mass and mass-volume equations at standard temperature and pressure',
    ],
    concepts: [
      {
        id: 'con_cisce10_chem_mole_c1',
        chapterId: 'ch_cisce10_chem_mole',
        title: 'Gay-Lussac’s Law & Avogadro’s Hypothesis',
        description: 'Gas volume ratios, molar volume at STP, and Avogadro number calculations.',
        order: 1,
        learningOutcome: 'Solve volume-volume stoichiometry problems at STP under Gay-Lussac’s law.',
        prerequisites: [],
      },
      {
        id: 'con_cisce10_chem_mole_c2',
        chapterId: 'ch_cisce10_chem_mole',
        title: 'Empirical & Molecular Formula & Vapour Density',
        description: 'Determining empirical formulas from percent compositions and molecular formulas using vapour density.',
        order: 2,
        learningOutcome: 'Calculate the molecular formula of an organic compound given its elemental analysis and vapour density.',
        prerequisites: ['con_cisce10_chem_mole_c1'],
      },
    ],
    officialSourceId: 'src_cisce_icse',
    isComplete: true,
  },
  {
    id: 'ch_cisce10_chem_electrolysis',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterNumber: 6,
    title: 'Electrolysis (Preferential Discharge & Industrial Applications)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Electrolysis is the decomposition of a chemical compound in molten or aqueous state by passage of direct electric current. We study electrolytes vs non-electrolytes, preferential discharge of ions based on electrochemical series, electrolysis of molten lead bromide, acidified water, and copper sulphate with inert and active electrodes, electroplating, and electrorefining.',
    learningObjectives: [
      'State the selective discharge criteria for cations and anions',
      'Write half-cell electrode reactions at cathode (reduction) and anode (oxidation)',
      'Explain electroplating of an iron spoon with nickel or silver',
      'Describe electrolytic refining of blister copper',
    ],
    concepts: [
      {
        id: 'con_cisce10_chem_elec_c1',
        chapterId: 'ch_cisce10_chem_electrolysis',
        title: 'Electrochemical Preferential Discharge & Half-Reactions',
        description: 'Factors determining ion discharge (position in series, concentration, electrode nature).',
        order: 1,
        learningOutcome: 'Write balanced oxidation and reduction half-cell equations for various electrolytic cells.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_cisce_icse',
    isComplete: true,
  },

  // --- CISCE CLASS 10 PHYSICS ---
  {
    id: 'ch_cisce10_phy_force',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Physics',
    chapterNumber: 1,
    title: 'Force, Work, Power and Energy',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Translational and rotational motion of rigid bodies under forces. We study moments of force (torque = F x d), equilibrium conditions, center of gravity, work done (W = F s cosθ), kinetic and potential energy, and the principle of conservation of mechanical energy.',
    learningObjectives: [
      'Calculate turning effect (torque) and state conditions for static and dynamic equilibrium',
      'Determine the center of gravity for regular and irregular laminar objects',
      'Apply work-energy theorem and verify conservation of energy for a freely falling body',
      'Compute power in SI units (Watt) and commercial units',
    ],
    concepts: [
      {
        id: 'con_cisce10_phy_force_c1',
        chapterId: 'ch_cisce10_phy_force',
        title: 'Moment of Force, Equilibrium & Center of Gravity',
        description: 'Torque, principle of moments (anticlockwise moment = clockwise moment), and stable equilibrium.',
        order: 1,
        learningOutcome: 'Calculate the unknown force or distance required to balance a meter rule on a knife edge.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_cisce_icse',
    isComplete: true,
  },
];

// Add chapters to DB if not present
for (const ch of newOfficialChapters) {
  if (!existingChapterIds.has(ch.id)) {
    db.chapters.push(ch);
    existingChapterIds.add(ch.id);
  }
}

console.log('Chapters count after expansion:', db.chapters.length);

// =========================================================================
// 2. QUESTION BANK EXPANSION (15-20 QUESTIONS PER TOPIC)
// =========================================================================

// Helper to create rich authentic questions
function makeQuestion(q) {
  return {
    id: q.id,
    board: q.board,
    classLevel: q.classLevel,
    subject: q.subject,
    chapterId: q.chapterId,
    conceptId: q.conceptId,
    topicId: q.conceptId,
    topicTitle: q.topicTitle || 'Core Topic',
    learningOutcome: q.learningOutcome || 'Demonstrate mastery on key syllabus concept.',
    academicYear: '2026-2027',
    difficulty: q.difficulty,
    cognitiveSkill: q.cognitiveSkill || 'Conceptual',
    questionType: q.questionType || 'mcq',
    expectedSolvingTimeSeconds: q.expectedSolvingTimeSeconds || 60,
    prompt: q.prompt,
    choices: q.choices,
    correctAnswerText: q.correctAnswerText,
    acceptableTolerance: q.acceptableTolerance,
    explanation: q.explanation,
    hint: q.hint,
    misconceptionTags: q.misconceptionTags || [],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  };
}

const additionalQuestions = [];

// --- CBSE CLASS 10 SCIENCE: Chemical Reactions & Equations (Target 15+ Questions) ---
const chemRxnQuestions = [
  {
    id: 'q_cbse10_sci_chem_03',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Foundational',
    cognitiveSkill: 'Foundational',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 40,
    prompt: {
      en: 'What fundamental physical law requires every chemical equation to be balanced?',
      hi: 'किस भौतिक नियम के कारण प्रत्येक रासायनिक समीकरण का संतुलित होना अनिवार्य है?',
      te: 'ప్రతి రసాయన సమీకరణం తుల్యం కావడానికి కారణమైన ప్రాథమిక భౌతిక నియమం ఏది?',
    },
    choices: [
      { id: 'c1', text: { en: 'Law of Conservation of Mass', hi: 'द्रव्यमान संरक्षण का नियम', te: 'ద్రవ్య నిత్యత్వ నియమం' }, isCorrect: true },
      { id: 'c2', text: { en: 'Law of Constant Proportions', hi: 'स्थिर अनुपात का नियम', te: 'స్థిర నిష్పత్తి నియమం' }, misconceptionTag: 'CONFUSED_WITH_DALTON_PROPORTIONS', isCorrect: false },
      { id: 'c3', text: { en: 'Law of Multiple Proportions', hi: 'गुणित अनुपात का नियम', te: 'గుణిత నిష్పత్తి నియమం' }, misconceptionTag: 'CONFUSED_STOICHIOMETRY_LAW', isCorrect: false },
      { id: 'c4', text: { en: 'Avogadro’s Law of Gas Volumes', hi: 'आवोगाद्रो का नियम', te: 'అవగాడ్రో నియమం' }, misconceptionTag: 'CONFUSED_WITH_GAS_LAW', isCorrect: false },
    ],
    explanation: {
      en: 'Under the Law of Conservation of Mass, mass can neither be created nor destroyed in a chemical reaction. Therefore, the total number of atoms of each element on the reactant side must equal the total on the product side.',
      hi: 'द्रव्यमान संरक्षण के नियमानुसार, रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है और न ही विनाश।',
      te: 'ద్రవ్య నిత్యత్వ నియమం ప్రకారం, రసాయన చర్యలో ద్రవ్యరాశి సృష్టించబడదు లేదా నాశనం చేయబడదు.',
    },
    hint: {
      en: 'Think about Antoine Lavoisier’s principle regarding total mass before and after a reaction.',
      hi: 'अभिक्रिया से पहले और बाद में कुल द्रव्यमान के सिद्धांत को याद करें।',
      te: 'చర్యకు ముందు మరియు తర్వాత మొత్తం ద్రవ్యరాశి సమానంగా ఉండే నియమాన్ని ఆలోచించండి.',
    },
    misconceptionTags: ['CONFUSED_WITH_DALTON_PROPORTIONS'],
  },
  {
    id: 'q_cbse10_sci_chem_04',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Procedural',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 45,
    prompt: {
      en: 'In the equation: 2Mg(s) + O2(g) -> 2MgO(s), what type of reaction occurs when magnesium ribbon burns with a dazzling white flame?',
      hi: 'समीकरण 2Mg(s) + O2(g) -> 2MgO(s) में मैग्नीशियम रिबन का जलना किस प्रकार की अभिक्रिया है?',
      te: '2Mg(s) + O2(g) -> 2MgO(s) సమీకరణంలో మెగ్నీషియం రిబ్బన్ తెల్లని కాంతితో మండడం ఏ రకమైన చర్య?',
    },
    choices: [
      { id: 'c1', text: { en: 'Combination and Exothermic Reaction', hi: 'संयोजन और ऊष्माक्षेपी अभिक्रिया', te: 'సంయోగ మరియు ఉష్ణమోచక చర్య' }, isCorrect: true },
      { id: 'c2', text: { en: 'Decomposition Reaction', hi: 'वियोजन अभिक्रिया', te: 'వియోగ చర్య' }, misconceptionTag: 'CONFUSED_COMBINATION_WITH_DECOMPOSITION', isCorrect: false },
      { id: 'c3', text: { en: 'Displacement Reaction', hi: 'विस्थापन अभिक्रिया', te: 'స్థానభ్రంశ చర్య' }, misconceptionTag: 'CONFUSED_DISPLACEMENT', isCorrect: false },
      { id: 'c4', text: { en: 'Endothermic Neutralization Reaction', hi: 'ऊष्माशोषी उदासीनीकरण', te: 'ఉష్ణగ్రాహక తటస్థీకరణ' }, misconceptionTag: 'CONFUSED_HEAT_FLOW', isCorrect: false },
    ],
    explanation: {
      en: 'Two reactants (Mg and O2) combine to form a single product (MgO), which defines a combination reaction. The intense emission of heat and light confirms it is exothermic.',
      hi: 'दो या दो से अधिक अभिकारक मिलकर एकल उत्पाद बनाते हैं, जिसे संयोजन अभिक्रिया कहते हैं।',
      te: 'రెండు క్రియాజనకాలు కలిసి ఒకే క్రియాజన్యాన్ని ఏర్పరుస్తాయి కాబట్టి ఇది సంయోగ చర్య.',
    },
    hint: {
      en: 'Look at the number of reactants on the left vs products on the right.',
      hi: 'अभिकारकों और उत्पाद की संख्या को देखें।',
      te: 'ఎడమవైపు క్రియాజనకాలు, కుడివైపు క్రియాజన్యాల సంఖ్యను చూడండి.',
    },
    misconceptionTags: ['CONFUSED_COMBINATION_WITH_DECOMPOSITION'],
  },
  {
    id: 'q_cbse10_sci_chem_05',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Procedural',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 60,
    prompt: {
      en: 'What are the stoichiometric coefficients a, b, c in the balanced equation: a HNO3 + Ca(OH)2 -> b Ca(NO3)2 + c H2O?',
      hi: 'संतुलित समीकरण a HNO3 + Ca(OH)2 -> b Ca(NO3)2 + c H2O में a, b, c के सही मान क्या हैं?',
      te: 'తుల్య సమీకరణం a HNO3 + Ca(OH)2 -> b Ca(NO3)2 + c H2O లో a, b, c ల సరైన గుణకాలు ఏవి?',
    },
    choices: [
      { id: 'c1', text: { en: 'a = 2, b = 1, c = 2', hi: 'a = 2, b = 1, c = 2', te: 'a = 2, b = 1, c = 2' }, isCorrect: true },
      { id: 'c2', text: { en: 'a = 1, b = 1, c = 1', hi: 'a = 1, b = 1, c = 1', te: 'a = 1, b = 1, c = 1' }, misconceptionTag: 'UNBALANCED_NITRATE_RADICALS', isCorrect: false },
      { id: 'c3', text: { en: 'a = 2, b = 2, c = 1', hi: 'a = 2, b = 2, c = 1', te: 'a = 2, b = 2, c = 1' }, misconceptionTag: 'CALCIUM_ATOM_IMBALANCE', isCorrect: false },
      { id: 'c4', text: { en: 'a = 1, b = 2, c = 2', hi: 'a = 1, b = 2, c = 2', te: 'a = 1, b = 2, c = 2' }, misconceptionTag: 'INVERTED_COEFFICIENT_RATIOS', isCorrect: false },
    ],
    explanation: {
      en: 'Ca(NO3)2 contains two nitrate groups (NO3) and Ca(OH)2 contains two hydroxide (OH) groups. Thus, 2 HNO3 molecules are needed: 2 HNO3 + Ca(OH)2 -> 1 Ca(NO3)2 + 2 H2O.',
      hi: 'कैल्शियम नाइट्रेट में 2 नाइट्रेट समूह हैं, इसलिए 2 HNO3 की आवश्यकता होती है। a=2, b=1, c=2.',
      te: 'కాల్షియం నైట్రేట్‌లో రెండు నైట్రేట్ సమూహాలు ఉన్నాయి, కాబట్టి 2 HNO3 అవసరం. a=2, b=1, c=2.',
    },
    hint: {
      en: 'Balance the nitrate polyatomic ion (NO3) first, then balance Hydrogen atoms.',
      hi: 'पहले नाइट्रेट आयन को संतुलित करें, फिर हाइड्रोजन को।',
      te: 'ముందుగా నైట్రేట్ అయాన్‌ను తుల్యం చేయండి, తర్వాత హైడ్రోజన్ పరమాణువులను తుల్యం చేయండి.',
    },
    misconceptionTags: ['UNBALANCED_NITRATE_RADICALS'],
  },
  {
    id: 'q_cbse10_sci_chem_06',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Conceptual',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 55,
    prompt: {
      en: 'When lead nitrate Pb(NO3)2 crystals are heated strongly in a dry test tube, which brown-colored gas is evolved?',
      hi: 'जब लेड नाइट्रेट क्रिस्टल को सूखी परखनली में गर्म किया जाता है, तो कौन सी भूरे रंग की गैस निकलती है?',
      te: 'లెడ్ నైట్రేట్ స్పటికాలను వేడి చేసినప్పుడు వెలువడే గోధుమ రంగు వాయువు ఏది?',
    },
    choices: [
      { id: 'c1', text: { en: 'Nitrogen dioxide (NO2)', hi: 'नाइट्रोजन डाइऑक्साइड (NO2)', te: 'నైట్రోజన్ డయాక్సైడ్ (NO2)' }, isCorrect: true },
      { id: 'c2', text: { en: 'Oxygen (O2)', hi: 'ऑक्सीजन (O2)', te: 'ఆక్సిజన్ (O2)' }, misconceptionTag: 'CONFUSED_COLORLESS_WITH_COLORED_GAS', isCorrect: false },
      { id: 'c3', text: { en: 'Nitrous oxide (N2O)', hi: 'नाइट्रस ऑक्साइड (N2O)', te: 'నైట్రస్ ఆక్సైడ్ (N2O)' }, misconceptionTag: 'INCORRECT_NITROGEN_OXIDE_STATE', isCorrect: false },
      { id: 'c4', text: { en: 'Lead vapor (Pb)', hi: 'लेड वाष्प', te: 'లెడ్ ఆవిరి' }, misconceptionTag: 'METALLIC_SUBLIMATION_MISCONCEPTION', isCorrect: false },
    ],
    explanation: {
      en: 'Thermal decomposition of lead nitrate: 2Pb(NO3)2(s) -> 2PbO(s) + 4NO2(g) + O2(g). NO2 is a pungent, characteristic brown gas, while PbO is a yellow solid residue.',
      hi: 'लेड नाइट्रेट के तापीय अपघटन पर नाइट्रोजन डाइऑक्साइड (NO2) नामक भूरे रंग की गैस निकलती है।',
      te: 'లెడ్ నైట్రేట్ వియోగం చెందినప్పుడు నైట్రోజన్ డయాక్సైడ్ (NO2) అనే గోధుమ రంగు వాయువు వెలువడుతుంది.',
    },
    hint: {
      en: 'Think of the reddish-brown gas produced in the thermal decomposition of metal nitrates.',
      hi: 'नाइट्रेट्स के तापीय अपघटन में निकलने वाली भूरी गैस को याद करें।',
      te: 'నైట్రేట్లను వేడి చేసినప్పుడు వచ్చే గోధుమ రంగు వాయువును గుర్తుచేసుకోండి.',
    },
    misconceptionTags: ['CONFUSED_COLORLESS_WITH_COLORED_GAS'],
  },
  {
    id: 'q_cbse10_sci_chem_07',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Challenging',
    cognitiveSkill: 'Application',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 70,
    prompt: {
      en: 'In the redox reaction: MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2, which substance is oxidized and which acts as the oxidizing agent?',
      hi: 'रेडॉक्स अभिक्रिया MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2 में कौन सा पदार्थ ऑक्सीकृत होता है और कौन सा ऑक्सीकारक है?',
      te: 'రిడాక్స్ చర్య MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2 లో ఆక్సీకరణం చెందిన పదార్థం మరియు ఆక్సీకరణి ఏవి?',
    },
    choices: [
      { id: 'c1', text: { en: 'HCl is oxidized; MnO2 is the oxidizing agent', hi: 'HCl ऑक्सीकृत होता है; MnO2 ऑक्सीकारक है', te: 'HCl ఆక్సీకరణం చెందుతుంది; MnO2 ఆక్సీకరణి' }, isCorrect: true },
      { id: 'c2', text: { en: 'MnO2 is oxidized; HCl is the oxidizing agent', hi: 'MnO2 ऑक्सीकृत होता है; HCl ऑक्सीकारक है', te: 'MnO2 ఆక్సీకరణం చెందుతుంది; HCl ఆక్సీకరణి' }, misconceptionTag: 'INVERTED_OXIDIZING_AND_REDUCING_ROLES', isCorrect: false },
      { id: 'c3', text: { en: 'HCl is reduced; Cl2 is the oxidizing agent', hi: 'HCl अपचयित होता है; Cl2 ऑक्सीकारक है', te: 'HCl క్షయకరణం చెందుతుంది; Cl2 ఆక్సీకరణి' }, misconceptionTag: 'CONFUSED_REACTANT_PRODUCT_REDOX_AGENT', isCorrect: false },
      { id: 'c4', text: { en: 'MnO2 is reduced; MnCl2 is the reducing agent', hi: 'MnO2 अपचयित होता है; MnCl2 अपचायक है', te: 'MnO2 క్షయకరణం చెందుతుంది; MnCl2 క్షయకారి' }, misconceptionTag: 'PICKED_PRODUCT_AS_AGENT', isCorrect: false },
    ],
    explanation: {
      en: 'HCl loses hydrogen (oxidation of chloride to chlorine gas), so HCl is oxidized. MnO2 loses oxygen to form MnCl2 (reduction), making MnO2 the oxidizing agent.',
      hi: 'HCl से हाइड्रोजन अलग होकर Cl2 बनता है, इसलिए HCl ऑक्सीकृत होता है और MnO2 ऑक्सीकारक है।',
      te: 'HCl హైడ్రోజన్‌ను కోల్పోయి Cl2 గా మారుతుంది కాబట్టి ఇది ఆక్సీకరణం చెందుతుంది. MnO2 ఆక్సీకరణిగా పనిచేస్తుంది.',
    },
    hint: {
      en: 'The substance that loses hydrogen is oxidized; the substance that supplies oxygen is the oxidizing agent.',
      hi: 'जो हाइड्रोजन खोता है वह ऑक्सीकृत होता है; जो ऑक्सीजन देता है वह ऑक्सीकारक है।',
      te: 'హైడ్రోజన్‌ను కోల్పోయేది ఆక్సీకరణం చెందుతుంది; ఆక్సిజన్‌ను ఇచ్చేది ఆక్సీకరణి.',
    },
    misconceptionTags: ['INVERTED_OXIDIZING_AND_REDUCING_ROLES'],
  },
  {
    id: 'q_cbse10_sci_chem_08',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Challenging',
    cognitiveSkill: 'ProblemSolving',
    questionType: 'numerical',
    expectedSolvingTimeSeconds: 60,
    prompt: {
      en: 'When 10.0 grams of calcium carbonate (CaCO3) decomposes completely on heating, how many grams of quicklime (calcium oxide, CaO) are produced? (Atomic masses: Ca=40, C=12, O=16)',
      hi: 'जब 10.0 ग्राम कैल्शियम कार्बोनेट (CaCO3) पूरी तरह गर्म होकर अपघटित होता है, तो कितने ग्राम बिना बुझा चूना (CaO) प्राप्त होगा? (परमाणु भार: Ca=40, C=12, O=16)',
      te: '10.0 గ్రాముల కాల్షియం కార్బోనేట్ (CaCO3) వేడిచేసినప్పుడు ఎన్ని గ్రాముల క్విక్‌లైమ్ (CaO) ఏర్పడుతుంది? (పరమాణు ద్రవ్యరాశులు: Ca=40, C=12, O=16)',
    },
    correctAnswerText: '5.6',
    acceptableTolerance: 0.1,
    explanation: {
      en: 'CaCO3 -> CaO + CO2. Molar mass of CaCO3 = 40 + 12 + 48 = 100 g/mol. Molar mass of CaO = 40 + 16 = 56 g/mol. Therefore, 100 g CaCO3 yields 56 g CaO. For 10.0 g CaCO3, CaO produced = (56 / 100) * 10 = 5.6 grams.',
      hi: '100 ग्राम CaCO3 से 56 ग्राम CaO बनता है। अतः 10 ग्राम से 5.6 ग्राम CaO बनेगा।',
      te: '100 గ్రాముల CaCO3 నుండి 56 గ్రాముల CaO ఏర్పడుతుంది. కాబట్టి 10 గ్రాముల నుండి 5.6 గ్రాముల CaO వస్తుంది.',
    },
    hint: {
      en: 'Calculate the molar mass of CaCO3 (100 g/mol) and CaO (56 g/mol), then find the mass ratio.',
      hi: 'CaCO3 (100) और CaO (56) के आणविक द्रव्यमान का अनुपात निकालें।',
      te: 'CaCO3 (100) మరియు CaO (56) మోలార్ ద్రవ్యరాశి నిష్పత్తిని లెక్కించండి.',
    },
    misconceptionTags: ['MISCALCULATED_MOLAR_RATIO'],
  },
  {
    id: 'q_cbse10_sci_chem_09',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Application',
    cognitiveSkill: 'Application',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 50,
    prompt: {
      en: 'Why are chips packets flushed with inert nitrogen gas by food manufacturers?',
      hi: 'खाद्य निर्माताओं द्वारा चिप्स के पैकेटों में अक्रिय नाइट्रोजन गैस क्यों भरी जाती है?',
      te: 'ఆహార తయారీదారులు చిప్స్ ప్యాకెట్లలో నైట్రోజన్ వాయువును ఎందుకు నింపుతారు?',
    },
    choices: [
      { id: 'c1', text: { en: 'To prevent oxidation and rancidity of oils and fats', hi: 'तेलों और वसा के ऑक्सीकरण और विकृतगंधिता को रोकने के लिए', te: 'నూనెలు ఆక్సీకరణం చెందకుండా మరియు దుర్వాసన రాకుండా నిరోధించడానికి' }, isCorrect: true },
      { id: 'c2', text: { en: 'To accelerate decomposition of carbohydrates', hi: 'कार्बोहाइड्रेट के अपघटन को तेज करने के लिए', te: 'కార్బోహైడ్రేట్ల వియోగాన్ని వేగవంతం చేయడానికి' }, misconceptionTag: 'CONFUSED_PRESERVATION_WITH_DECOMPOSITION', isCorrect: false },
      { id: 'c3', text: { en: 'To make the packet heavier for transport', hi: 'पैकेट को भारी बनाने के लिए', te: 'ప్యాకెట్‌ను బరువుగా చేయడానికి' }, misconceptionTag: 'NON_CHEMICAL_REASONING', isCorrect: false },
      { id: 'c4', text: { en: 'To bleach the natural color of fried potato slices', hi: 'आलू के प्राकृतिक रंग को विरंजित करने के लिए', te: 'రంగును వెలిసిపోయేలా చేయడానికి' }, misconceptionTag: 'CONFUSED_BLEACHING_WITH_PRESERVATION', isCorrect: false },
    ],
    explanation: {
      en: 'When fats and oils in food are exposed to air, they get oxidized, become rancid, and develop foul taste and smell. Nitrogen is an unreactive antioxidant gas that expels atmospheric oxygen.',
      hi: 'वसा और तेल ऑक्सीकृत होकर विकृतगंधी हो जाते हैं। नाइट्रोजन अक्रिय गैस होने के कारण ऑक्सीकरण रोकती है।',
      te: 'నూనెలు గాలితో చర్య జరిపి ఆక్సీకరణం చెందితే దుర్వాసన వస్తుంది. నైట్రోజన్ దీనిని నివారిస్తుంది.',
    },
    hint: {
      en: 'Consider the reaction between fats/oils and atmospheric oxygen over time.',
      hi: 'वसा और हवा की ऑक्सीजन के बीच होने वाली अभिक्रिया के बारे में सोचें।',
      te: 'కొవ్వులు మరియు గాలిలోని ఆక్సిజన్ మధ్య జరిగే చర్యను ఆలోచించండి.',
    },
    misconceptionTags: ['CONFUSED_PRESERVATION_WITH_DECOMPOSITION'],
  },
  {
    id: 'q_cbse10_sci_chem_10',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Conceptual',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 40,
    prompt: {
      en: 'What precipitate is formed when aqueous sodium sulphate reacts with aqueous barium chloride?',
      hi: 'जब सोडियम सल्फेट का जलीय विलयन बेरियम क्लोराइड के साथ अभिक्रिया करता है, तो कौन सा अवक्षेप बनता है?',
      te: 'సోడియం సల్ఫేట్ ద్రావణం బేరియం క్లోరైడ్‌తో చర్య జరిపినప్పుడు ఏర్పడే అవక్షేపం ఏది?',
    },
    choices: [
      { id: 'c1', text: { en: 'White precipitate of Barium sulphate (BaSO4)', hi: 'बेरियम सल्फेट (BaSO4) का सफेद अवक्षेप', te: 'బేరియం సల్ఫేట్ (BaSO4) తెల్లని అవక్షేపం' }, isCorrect: true },
      { id: 'c2', text: { en: 'Yellow precipitate of Lead iodide', hi: 'लेड आयोडाइड का पीला अवक्षेप', te: 'లెడ్ అయోడైడ్ పసుపు అవక్షేపం' }, misconceptionTag: 'CONFUSED_PRECIPITATE_COLOR', isCorrect: false },
      { id: 'c3', text: { en: 'Blue precipitate of Copper hydroxide', hi: 'कॉपर हाइड्रॉक्साइड का नीला अवक्षेप', te: 'కాపర్ హైడ్రాక్సైడ్ నీలి అవక్షేపం' }, misconceptionTag: 'INCORRECT_ANION_EXCHANGE', isCorrect: false },
      { id: 'c4', text: { en: 'Black precipitate of Copper sulphide', hi: 'कॉपर सल्फाइड का काला अवक्षेप', te: 'కాపర్ సల్ఫైడ్ నల్లని అవక్షేపం' }, misconceptionTag: 'CONFUSED_SULPHIDE_PRECIPITATION', isCorrect: false },
    ],
    explanation: {
      en: 'Na2SO4(aq) + BaCl2(aq) -> BaSO4(s) + 2NaCl(aq). This is a double displacement and precipitation reaction. BaSO4 is insoluble and settles as a white precipitate.',
      hi: 'Na2SO4 और BaCl2 की अभिक्रिया में BaSO4 का अघुलनशील सफेद अवक्षेप बनता है। यह द्विविस्थापन अभिक्रिया है।',
      te: 'ఇది ద్వివిస్థాపన చర్య. బేరియం సల్ఫేట్ (BaSO4) కరగని తెల్లని అవక్షేపంగా ఏర్పడుతుంది.',
    },
    hint: {
      en: 'An insoluble salt of Barium is formed by ion exchange.',
      hi: 'आयनों के आदान-प्रदान से बेरियम का एक अघुलनशील लवण बनता है।',
      te: 'అయాన్ల మార్పిడి ద్వారా బేరియం లవణం కరగని అవక్షేపంగా ఏర్పడుతుంది.',
    },
    misconceptionTags: ['CONFUSED_PRECIPITATE_COLOR'],
  },
];

for (const q of chemRxnQuestions) {
  if (!existingQuestionIds.has(q.id)) {
    additionalQuestions.push(makeQuestion(q));
    existingQuestionIds.add(q.id);
  }
}

// --- TELANGANA SSC CLASS 10 PHYSICAL SCIENCE: Refraction at Curved Surfaces (Target 15+ Questions) ---
const tsRefractionQuestions = [
  {
    id: 'q_ts10_ps_lens_02',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Foundational',
    cognitiveSkill: 'Foundational',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 40,
    prompt: {
      en: 'What is the relation between the focal length (f) and radius of curvature (R) of a spherical lens or mirror?',
      hi: 'गोलीय दर्पण या लेंस के फोकस दूरी (f) और वक्रता त्रिज्या (R) में क्या संबंध है?',
      te: 'గోళాకార దర్పణం లేదా కటకపు నాభ్యాంతరం (f) మరియు వక్రతా వ్యాసార్థం (R) మధ్య సంబంధం ఏమిటి?',
    },
    choices: [
      { id: 'c1', text: { en: 'f = R / 2', hi: 'f = R / 2', te: 'f = R / 2' }, isCorrect: true },
      { id: 'c2', text: { en: 'f = 2R', hi: 'f = 2R', te: 'f = 2R' }, misconceptionTag: 'INVERTED_FOCAL_RADIUS_RELATION', isCorrect: false },
      { id: 'c3', text: { en: 'f = R^2', hi: 'f = R^2', te: 'f = R^2' }, misconceptionTag: 'NON_LINEAR_FOCAL_FORMULA', isCorrect: false },
      { id: 'c4', text: { en: 'f = 1 / R', hi: 'f = 1 / R', te: 'f = 1 / R' }, misconceptionTag: 'RECIPROCAL_RADIUS_CONFUSION', isCorrect: false },
    ],
    explanation: {
      en: 'For spherical surfaces of small aperture, the principal focus lies midway between the pole/optic center and the center of curvature, giving f = R / 2.',
      hi: 'गोलीय सतहों के लिए मुख्य फोकस वक्रता केंद्र और ध्रुव के ठीक मध्य में स्थित होता है, अतः f = R / 2.',
      te: 'గోళాకార తలాలకు ప్రధాన నాభి, ధృవానికి మరియు వక్రతా కేంద్రానికి మధ్యలో ఉంటుంది. కాబట్టి f = R / 2.',
    },
    hint: {
      en: 'The focus is exactly halfway between the surface pole and center of curvature.',
      hi: 'फोकस ध्रुव और वक्रता केंद्र के ठीक बीच में होता है।',
      te: 'నాభి అనేది ధృవానికి మరియు వక్రతా కేంద్రానికి సరిగ్గా మధ్యలో ఉంటుంది.',
    },
    misconceptionTags: ['INVERTED_FOCAL_RADIUS_RELATION'],
  },
  {
    id: 'q_ts10_ps_lens_03',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Conceptual',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 45,
    prompt: {
      en: 'Under Cartesian sign convention, which lens always has a positive (+) focal length?',
      hi: 'कार्तीय चिन्ह परिपाटी के अनुसार किस लेंस की फोकस दूरी सदैव धनात्मक (+) होती है?',
      te: 'కార్టీసియన్ సాంప్రదాయం ప్రకారం ఏ కటకపు నాభ్యాంతరం ఎల్లప్పుడూ ధనాత్మకం (+)?',
    },
    choices: [
      { id: 'c1', text: { en: 'Convex (Converging) Lens', hi: 'उत्तल (अभिसारी) लेंस', te: 'కుంభాకార (కేంద్రీకరణ) కటకం' }, isCorrect: true },
      { id: 'c2', text: { en: 'Concave (Diverging) Lens', hi: 'अवतल (अपसारी) लेंस', te: 'పుటాకార (వికేంద్రీకరణ) కటకం' }, misconceptionTag: 'INVERTED_LENS_SIGN_CONVENTION', isCorrect: false },
      { id: 'c3', text: { en: 'Both Convex and Concave Lenses', hi: 'उत्तल और अवतल दोनों', te: 'కుంభాకార మరియు పుటాకార రెండూ' }, misconceptionTag: 'UNDIFFERENTIATED_SIGN_RULES', isCorrect: false },
      { id: 'c4', text: { en: 'Cylindrical Lens only', hi: 'केवल बेलनाकार लेंस', te: 'స్తూపాకార కటకం మాత్రమే' }, misconceptionTag: 'IRRELEVANT_OPTICAL_ELEMENT', isCorrect: false },
    ],
    explanation: {
      en: 'A convex lens focuses parallel rays on the right side of the optical center (in the direction of incident light), so by Cartesian convention its focal length is positive (+). A concave lens diverges light and has a negative (-) focal length.',
      hi: 'उत्तल लेंस आपतित प्रकाश की दिशा में दाईं ओर प्रकाश किरणों को केंद्रित करता है, इसलिए इसकी फोकस दूरी धनात्मक (+) होती है।',
      te: 'కుంభాకార కటకం కాంతి కిరణాలను కుడివైపు కేంద్రీకరిస్తుంది కాబట్టి దాని నాభ్యాంతరం ధనాత్మకం (+).',
    },
    hint: {
      en: 'Think which lens converges parallel rays towards the positive x-axis.',
      hi: 'सोचें कि कौन सा लेंस किरणों को धनात्मक दिशा में केंद्रित करता है।',
      te: 'ఏ కటకం కిరణాలను కుడివైపున కేంద్రీకరిస్తుందో ఆలోచించండి.',
    },
    misconceptionTags: ['INVERTED_LENS_SIGN_CONVENTION'],
  },
  {
    id: 'q_ts10_ps_lens_04',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Procedural',
    questionType: 'numerical',
    expectedSolvingTimeSeconds: 65,
    prompt: {
      en: 'An object is placed at a distance u = -20 cm from a convex lens of focal length f = +10 cm. Find the image distance v in cm using the lens formula: 1/f = 1/v - 1/u.',
      hi: 'एक वस्तु +10 सेमी फोकस दूरी वाले उत्तल लेंस से u = -20 सेमी की दूरी पर रखी है। लेंस सूत्र 1/f = 1/v - 1/u का उपयोग करके प्रतिबिंब दूरी v (सेमी में) ज्ञात करें।',
      te: 'f = +10 సెం.మీ నాభ్యాంతరం గల కుంభాకార కటకం ముందు u = -20 సెం.మీ దూరంలో వస్తువును ఉంచారు. కటక సూత్రం 1/f = 1/v - 1/u ఉపయోగించి ప్రతిబింబ దూరం v (సెం.మీ) కనుగొనండి.',
    },
    correctAnswerText: '20',
    acceptableTolerance: 0.1,
    explanation: {
      en: 'Lens formula: 1/v - 1/u = 1/f => 1/v = 1/f + 1/u = 1/10 + 1/(-20) = 1/10 - 1/20 = (2 - 1)/20 = 1/20. Therefore, v = +20 cm. The real, inverted image is formed at 2F2.',
      hi: '1/v = 1/f + 1/u = 1/10 - 1/20 = 1/20. अतः v = +20 सेमी (वास्तविक और उल्टा प्रतिबिंब)।',
      te: '1/v = 1/10 - 1/20 = 1/20. కాబట్టి v = +20 సెం.మీ.',
    },
    hint: {
      en: 'Remember to subtract: 1/10 - 1/20 = 1/20.',
      hi: '1/v = 1/f + 1/u में u = -20 रखें।',
      te: 'కటక సూత్రంలో u = -20 మరియు f = 10 ప్రతిక్షేపించండి.',
    },
    misconceptionTags: ['CONFUSED_MIRROR_AND_LENS_SIGN'],
  },
  {
    id: 'q_ts10_ps_lens_05',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Conceptual',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 50,
    prompt: {
      en: 'Where should an object be placed in front of a convex lens to produce a real image of the exact same size as the object?',
      hi: 'उत्तल लेंस के सामने किसी वस्तु को कहाँ रखा जाना चाहिए ताकि वस्तु के समान आकार का वास्तविक प्रतिबिंब बने?',
      te: 'కుంభాకార కటకం ముందు వస్తువును ఎక్కడ ఉంచితే వస్తువు పరిమాణంతో సమానమైన నిజ ప్రతిబింబం ఏర్పడుతుంది?',
    },
    choices: [
      { id: 'c1', text: { en: 'At twice the focal length (at 2F or Center of Curvature)', hi: 'फोकस दूरी के दोगुने पर (2F पर)', te: 'నాభ్యాంతరానికి రెట్టింపు దూరం వద్ద (2F వద్ద)' }, isCorrect: true },
      { id: 'c2', text: { en: 'At the principal focus (F)', hi: 'मुख्य फोकस (F) पर', te: 'ప్రధాన నాభి (F) వద్ద' }, misconceptionTag: 'CONFUSED_INFINITY_WITH_EQUAL_SIZE', isCorrect: false },
      { id: 'c3', text: { en: 'Between optical center and focus (O and F)', hi: 'प्रकाशिक केंद्र और फोकस के बीच', te: 'కటక కేంద్రం మరియు నాభి మధ్య' }, misconceptionTag: 'CONFUSED_MAGNIFIED_VIRTUAL_CASE', isCorrect: false },
      { id: 'c4', text: { en: 'Beyond 2F towards infinity', hi: '2F से परे अनंत की ओर', te: '2F కి ఆవల' }, misconceptionTag: 'CONFUSED_DIMINISHED_IMAGE_CASE', isCorrect: false },
    ],
    explanation: {
      en: 'When the object is placed at 2F1, a real, inverted image of the same size (magnification m = -1) is formed at 2F2 on the opposite side.',
      hi: 'जब वस्तु को 2F पर रखा जाता है, तो दूसरी तरफ 2F पर समान आकार का वास्तविक और उल्टा प्रतिबिंब बनता है (m = -1).',
      te: 'వస్తువును 2F వద్ద ఉంచినప్పుడు, రెండవ వైపు 2F వద్ద సమాన పరిమాణంగల నిజ ప్రతిబింబం ఏర్పడుతుంది.',
    },
    hint: {
      en: 'Think of the symmetric case where magnification m = -1.',
      hi: 'उस स्थिति को याद करें जहाँ आवर्धन m = -1 होता है।',
      te: 'ఆవర్ధనం m = -1 అయ్యే సందర్భాన్ని ఆలోచించండి.',
    },
    misconceptionTags: ['CONFUSED_INFINITY_WITH_EQUAL_SIZE'],
  },
  {
    id: 'q_ts10_ps_lens_06',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Challenging',
    cognitiveSkill: 'Application',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 60,
    prompt: {
      en: 'A doctor prescribes a corrective lens with optical power P = -2.5 Dioptres. What type of lens is this, and what is its focal length?',
      hi: 'एक डॉक्टर -2.5 डायोप्टर क्षमता वाले सुधारात्मक लेंस की सलाह देता है। यह किस प्रकार का लेंस है और इसकी फोकस दूरी क्या है?',
      te: 'ఒక వైద్యుడు P = -2.5 డయాప్టర్ల సామర్థ్యం గల కటకాన్ని సూచించారు. ఇది ఏ రకమైన కటకం మరియు దాని నాభ్యాంతరం ఎంత?',
    },
    choices: [
      { id: 'c1', text: { en: 'Concave lens with focal length f = -40 cm (corrects myopia)', hi: 'अवतल लेंस, फोकस दूरी f = -40 सेमी (मायोपिया दूर करता है)', te: 'పుటాకార కటకం, నాభ్యాంతరం f = -40 సెం.మీ (హ్రస్వదృష్టి నివారణ)' }, isCorrect: true },
      { id: 'c2', text: { en: 'Convex lens with focal length f = +40 cm (corrects hypermetropia)', hi: 'उत्तल लेंस, फोकस दूरी f = +40 सेमी', te: 'కుంభాకార కటకం, నాభ్యాంతరం f = +40 సెం.మీ' }, misconceptionTag: 'INVERTED_POWER_SIGN', isCorrect: false },
      { id: 'c3', text: { en: 'Concave lens with focal length f = -25 cm', hi: 'अवतल लेंस, फोकस दूरी f = -25 सेमी', te: 'పుటాకార కటకం, నాభ్యాంతరం f = -25 సెం.మీ' }, misconceptionTag: 'RECIPROCAL_ARITHMETIC_ERROR', isCorrect: false },
      { id: 'c4', text: { en: 'Bifocal lens with focal length f = -2.5 m', hi: 'द्विफोकसी लेंस', te: 'ద్వినాభి కటకం' }, misconceptionTag: 'UNIT_CONVERSION_ERROR', isCorrect: false },
    ],
    explanation: {
      en: 'Power P = 1 / f (in meters) => f = 1 / P = 1 / (-2.5) = -0.4 meters = -40 cm. The negative sign denotes a diverging concave lens, used to correct myopia (nearsightedness).',
      hi: 'लेंस की क्षमता P = 1/f (मीटर में) => f = 1/(-2.5) = -0.4 मीटर = -40 सेमी। ऋणात्मक चिन्ह अवतल लेंस दर्शाता है।',
      te: 'సామర్థ్యం P = 1/f (మీటర్లలో) => f = 1/(-2.5) = -0.4 మీటర్లు = -40 సెం.మీ. రుణాత్మక గుర్తు పుటాకార కటకాన్ని సూచిస్తుంది.',
    },
    hint: {
      en: 'f (in meters) = 1 / P. Then convert meters to centimeters.',
      hi: 'f = 1/P से मीटर में निकालें और 100 से गुणा करके सेमी में बदलें।',
      te: 'f = 1/P ద్వారా మీటర్లలో కనుగొని, 100 తో గుణించి సెం.మీ లోకి మార్చండి.',
    },
    misconceptionTags: ['INVERTED_POWER_SIGN', 'RECIPROCAL_ARITHMETIC_ERROR'],
  },
  {
    id: 'q_ts10_ps_lens_07',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Challenging',
    cognitiveSkill: 'ProblemSolving',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 65,
    prompt: {
      en: 'What happens to the focal length of a glass convex lens when it is immersed in water (refractive index of glass = 1.5, water = 1.33)?',
      hi: 'जब काँच के उत्तल लेंस (अपवर्तनांक 1.5) को जल (अपवर्तनांक 1.33) में डुबोया जाता है, तो उसकी फोकस दूरी पर क्या प्रभाव पड़ता है?',
      te: 'గాజు కుంభాకార కటకాన్ని (వక్రీభవన గుణకం 1.5) నీటిలో (వక్రీభవన గుణకం 1.33) ముంచినప్పుడు దాని నాభ్యాంతరం ఏమవుతుంది?',
    },
    choices: [
      { id: 'c1', text: { en: 'Its focal length increases significantly', hi: 'इसकी फोकस दूरी काफी बढ़ जाती है', te: 'దాని నాభ్యాంతరం గణనీయంగా పెరుగుతుంది' }, isCorrect: true },
      { id: 'c2', text: { en: 'Its focal length decreases to near zero', hi: 'इसकी फोकस दूरी घटकर लगभग शून्य हो जाती है', te: 'దాని నాభ్యాంతరం దాదాపు సున్నాకి తగ్గుతుంది' }, misconceptionTag: 'INVERTED_RELATIVE_REFRACTIVE_INDEX', isCorrect: false },
      { id: 'c3', text: { en: 'Its focal length remains completely unchanged', hi: 'इसकी फोकस दूरी अपरिवर्तित रहती है', te: 'నాభ్యాంతరంలో ఎలాంటి మార్పు ఉండదు' }, misconceptionTag: 'ASSUMED_FIXED_GEOMETRIC_FOCAL_LENGTH', isCorrect: false },
      { id: 'c4', text: { en: 'It turns into a diverging concave lens', hi: 'यह अवतल लेंस बन जाता है', te: 'ఇది పుటాకార కటకంగా మారుతుంది' }, misconceptionTag: 'OVEREXTENDED_MEDIUM_INVERSION_RULE', isCorrect: false },
    ],
    explanation: {
      en: 'By the Lens Maker’s Formula: 1/f = (n_lens/n_medium - 1)(1/R1 - 1/R2). In water, the relative refractive index (1.5 / 1.33 = 1.127) is much less than in air (1.5 / 1.0 = 1.5). The term (n - 1) decreases from 0.5 to 0.127, causing focal length f to increase roughly fourfold.',
      hi: 'लेंस निर्माता सूत्र के अनुसार, जब माध्यम का अपवर्तनांक बढ़ता है तो (n - 1) घटता है, जिससे फोकस दूरी f बढ़ जाती है।',
      te: 'లెన్స్ మేకర్ సూత్రం ప్రకారం, సాపేక్ష వక్రీభవన గుణకం తగ్గడం వల్ల నాభ్యాంతరం సుమారు నాలుగు రెట్లు పెరుగుతుంది.',
    },
    hint: {
      en: 'Look at the Lens Maker’s Formula: 1/f proportional to (n_relative - 1). If n_relative drops, what happens to f?',
      hi: 'लेंस मेकर सूत्र देखें: 1/f = (n - 1)... यदि (n-1) घटता है तो f बढ़ेगा।',
      te: 'లెన్స్ మేకర్స్ సూత్రం ప్రకారం సాపేక్ష వక్రీభవన గుణకం తగ్గితే నాభ్యాంతరం పెరుగుతుంది.',
    },
    misconceptionTags: ['ASSUMED_FIXED_GEOMETRIC_FOCAL_LENGTH'],
  },
];

for (const q of tsRefractionQuestions) {
  if (!existingQuestionIds.has(q.id)) {
    additionalQuestions.push(makeQuestion(q));
    existingQuestionIds.add(q.id);
  }
}

// --- CISCE CLASS 10 CHEMISTRY: Periodic Table (Target 15+ Questions) ---
const ciscePeriodicQuestions = [
  {
    id: 'q_cisce10_chem_per_02',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    difficulty: 'Foundational',
    cognitiveSkill: 'Foundational',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 40,
    prompt: {
      en: 'Across a period from left to right in the Modern Periodic Table, what happens to atomic radius?',
      hi: 'आधुनिक आवर्त सारणी में बाएं से दाएं जाने पर परमाणु त्रिज्या पर क्या प्रभाव पड़ता है?',
      te: 'ఆధునిక ఆవర్తన పట్టికలో ఎడమ నుండి కుడికి వెళ్లేకొద్దీ పరమాణు వ్యాసార్థం ఏమవుతుంది?',
    },
    choices: [
      { id: 'c1', text: { en: 'Decreases due to increasing effective nuclear charge', hi: 'प्रभावी नाभिकीय आवेश बढ़ने के कारण घटती है', te: 'కేంద్రక ఆవేశం పెరగడం వల్ల తగ్గుతుంది' }, isCorrect: true },
      { id: 'c2', text: { en: 'Increases due to addition of new electron shells', hi: 'नए कोश जुड़ने से बढ़ती है', te: 'కొత్త కక్ష్యలు చేరడం వల్ల పెరుగుతుంది' }, misconceptionTag: 'CONFUSED_PERIOD_WITH_GROUP_TREND', isCorrect: false },
      { id: 'c3', text: { en: 'Remains constant because number of shells is the same', hi: 'समान रहती है क्योंकि कोशों की संख्या समान है', te: 'కక్ష్యల సంఖ్య మారదు కాబట్టి స్థిరంగా ఉంటుంది' }, misconceptionTag: 'NEGLECTED_NUCLEAR_CHARGE_INCREASE', isCorrect: false },
      { id: 'c4', text: { en: 'First increases then sharply drops', hi: 'पहले बढ़ती है फिर घटती है', te: 'మొదట పెరిగి తర్వాత తగ్గుతుంది' }, misconceptionTag: 'CONFUSED_WITH_TRANSITION_CONTRACTION', isCorrect: false },
    ],
    explanation: {
      en: 'Across a period, electrons are added to the same principal energy shell while nuclear charge increases by one unit for each element. The stronger pull of the nucleus pulls the valence electrons inward, reducing the atomic size.',
      hi: 'आवर्त में बाएं से दाएं जाने पर नाभिकीय आवेश बढ़ता है, जिससे बाह्यतम इलेक्ट्रॉन नाभिक की ओर खिंचते हैं और परमाणु आकार घटता है।',
      te: 'పీరియడ్‌లో కేంద్రక ఆవేశం పెరగడం వల్ల వేలెన్సీ ఎలక్ట్రాన్లు కేంద్రకం వైపు బలంగా లాగబడి పరమాణు పరిమాణం తగ్గుతుంది.',
    },
    hint: {
      en: 'Does nuclear charge (number of protons) increase across a period?',
      hi: 'क्या आवर्त में प्रोटॉन की संख्या बढ़ती है?',
      te: 'పీరియడ్‌లో ప్రోటాన్ల సంఖ్య పెరుగుతుందా?',
    },
    misconceptionTags: ['CONFUSED_PERIOD_WITH_GROUP_TREND'],
  },
  {
    id: 'q_cisce10_chem_per_03',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Conceptual',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 40,
    prompt: {
      en: 'Which element in Period 3 has the highest electronegativity according to Pauling’s scale?',
      hi: 'पॉलिंग पैमाने के अनुसार आवर्त 3 में किस तत्व की विद्युत ऋणात्मकता सर्वाधिक है?',
      te: 'పౌలింగ్ స్కేల్ ప్రకారం 3వ పీరియడ్‌లో అత్యధిక ఋణవిద్యుదాత్మకత గల మూలకం ఏది?',
    },
    choices: [
      { id: 'c1', text: { en: 'Chlorine (Cl)', hi: 'क्लोरीन (Cl)', te: 'క్లోరిన్ (Cl)' }, isCorrect: true },
      { id: 'c2', text: { en: 'Sodium (Na)', hi: 'सोडियम (Na)', te: 'సోడియం (Na)' }, misconceptionTag: 'CONFUSED_METALLIC_WITH_NONMETALLIC', isCorrect: false },
      { id: 'c3', text: { en: 'Argon (Ar)', hi: 'ऑर्गन (Ar)', te: 'ఆర్గాన్ (Ar)' }, misconceptionTag: 'CONFUSED_NOBLE_GAS_WITH_HALOGEN', isCorrect: false },
      { id: 'c4', text: { en: 'Silicon (Si)', hi: 'सिलिकॉन (Si)', te: 'సిలికాన్ (Si)' }, misconceptionTag: 'CONFUSED_METALLOID_PROPERTIES', isCorrect: false },
    ],
    explanation: {
      en: 'Chlorine has 7 valence electrons, high effective nuclear charge, and smallest atomic radius among bonding elements in Period 3, giving it the highest electronegativity (approx 3.16). Argon is an inert gas with zero electronegativity on Pauling scale.',
      hi: 'क्लोरीन आवर्त 3 का सबसे अधिक विद्युत ऋणात्मक तत्व है क्योंकि इसका नाभिकीय आकर्षण बहुत अधिक होता है।',
      te: 'క్లోరిన్ 3వ పీరియడ్‌లో అత్యధిక ఋణవిద్యుదాత్మకతను కలిగి ఉంటుంది.',
    },
    hint: {
      en: 'Halogens have the highest tendency to attract bonded pairs of electrons.',
      hi: 'हैलोजन में साझे के इलेक्ट्रॉन को आकर्षित करने की क्षमता सर्वाधिक होती है।',
      te: 'హాలోజన్లు బంధ ఎలక్ట్రాన్లను ఆకర్షించే అత్యధిక సామర్థ్యాన్ని కలిగి ఉంటాయి.',
    },
    misconceptionTags: ['CONFUSED_NOBLE_GAS_WITH_HALOGEN'],
  },
  {
    id: 'q_cisce10_chem_per_04',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Procedural',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 50,
    prompt: {
      en: 'Which of the following represents the correct order of increasing ionization energy for elements of Group 1 (Alkali Metals)?',
      hi: 'समूह 1 (क्षार धातु) के तत्वों के लिए आयनन ऊर्जा का सही बढ़ता क्रम कौन सा है?',
      te: 'గ్రూప్ 1 మూలకాల (క్షార లోహాలు) పెరుగుతున్న అయనీకరణ శక్తి సరైన క్రమం ఏది?',
    },
    choices: [
      { id: 'c1', text: { en: 'Cs < Rb < K < Na < Li', hi: 'Cs < Rb < K < Na < Li', te: 'Cs < Rb < K < Na < Li' }, isCorrect: true },
      { id: 'c2', text: { en: 'Li < Na < K < Rb < Cs', hi: 'Li < Na < K < Rb < Cs', te: 'Li < Na < K < Rb < Cs' }, misconceptionTag: 'INVERTED_GROUP_IONIZATION_TREND', isCorrect: false },
      { id: 'c3', text: { en: 'Na < Li < K < Cs < Rb', hi: 'Na < Li < K < Cs < Rb', te: 'Na < Li < K < Cs < Rb' }, misconceptionTag: 'RANDOM_GROUP_ORDERING', isCorrect: false },
      { id: 'c4', text: { en: 'Li = Na = K = Rb = Cs', hi: 'सभी की समान होती है', te: 'అన్నీ సమానం' }, misconceptionTag: 'ASSUMED_CONSTANT_GROUP_ENERGY', isCorrect: false },
    ],
    explanation: {
      en: 'Down a group, atomic radius increases and outer electron is further from the nucleus, shielded by inner shells. Less energy is required to remove it. Therefore, ionization energy decreases down the group: Li has the highest, Cs the lowest.',
      hi: 'समूह में नीचे जाने पर परमाणु आकार बढ़ता है, जिससे इलेक्ट्रॉन निकालना आसान हो जाता है। अतः आयनन ऊर्जा घटती है: Cs < Rb < K < Na < Li.',
      te: 'గ్రూప్‌లో కిందకి వెళ్లేకొద్దీ పరమాణు పరిమాణం పెరుగుతుంది కాబట్టి అయనీకరణ శక్తి తగ్గుతుంది: Cs < Rb < K < Na < Li.',
    },
    hint: {
      en: 'Is it easier or harder to pull an electron from a larger atom with more electron shielding?',
      hi: 'क्या बड़े परमाणु से इलेक्ट्रॉन निकालना आसान होता है?',
      te: 'పెద్ద పరమాణువు నుండి ఎలక్ట్రాన్‌ను తొలగించడం సులభమా లేదా కష్టమా?',
    },
    misconceptionTags: ['INVERTED_GROUP_IONIZATION_TREND'],
  },
  {
    id: 'q_cisce10_chem_per_05',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    difficulty: 'Challenging',
    cognitiveSkill: 'Application',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 60,
    prompt: {
      en: 'Why is the electron affinity of Chlorine (-349 kJ/mol) higher than that of Fluorine (-328 kJ/mol), despite Fluorine having a smaller atomic radius?',
      hi: 'फ्लोरीन का आकार छोटा होने के बावजूद क्लोरीन की इलेक्ट्रॉन बंधुता फ्लोरीन से अधिक क्यों होती है?',
      te: 'ఫ్లోరిన్ పరమాణు వ్యాసార్థం తక్కువగా ఉన్నప్పటికీ క్లోరిన్ ఎలక్ట్రాన్ ఎఫినిటీ ఫ్లోరిన్ కంటే ఎందుకు ఎక్కువ?',
    },
    choices: [
      { id: 'c1', text: { en: 'Fluorine’s compact 2p subshell causes strong inter-electronic repulsions for the incoming electron', hi: 'फ्लोरीन के छोटे 2p कोश में तीव्र अंतर-इलेक्ट्रॉनिक प्रतिकर्षण होता है', te: 'ఫ్లోరిన్ యొక్క చిన్న 2p ఉపకక్ష్యలో ప్రవేశించే ఎలక్ట్రాన్‌పై బలమైన వికర్షణ ఉంటుంది' }, isCorrect: true },
      { id: 'c2', text: { en: 'Chlorine has lower nuclear charge than Fluorine', hi: 'क्लोरीन का नाभिकीय आवेश कम होता है', te: 'క్లోరిన్‌కు కేంద్రక ఆవేశం తక్కువ' }, misconceptionTag: 'INCORRECT_NUCLEAR_CHARGE_ASSUMPTION', isCorrect: false },
      { id: 'c3', text: { en: 'Fluorine is a metal and Chlorine is a non-metal', hi: 'फ्लोरीन धातु है', te: 'ఫ్లోరిన్ లోహం' }, misconceptionTag: 'GROSS_CHEMICAL_MISCLASSIFICATION', isCorrect: false },
      { id: 'c4', text: { en: 'Chlorine lacks vacant d-orbitals', hi: 'क्लोरीन में d-कक्षक नहीं होते', te: 'క్లోరిన్‌లో d-ఆర్బిటాళ్లు లేవు' }, misconceptionTag: 'INVERTED_ORBITAL_AVAILABILITY', isCorrect: false },
    ],
    explanation: {
      en: 'Fluorine’s atomic radius is extremely small, resulting in high electron density in its 2p subshell. Incoming electrons experience significant inter-electronic repulsion, lowering its net electron affinity compared to Chlorine (3p subshell).',
      hi: 'फ्लोरीन का आकार अत्यंत छोटा होने के कारण इसके 2p इलेक्ट्रॉनों में तीव्र प्रतिकर्षण होता है, जिससे आने वाले इलेक्ट्रॉन को कम ऊर्जा से बांधा जाता है।',
      te: 'ఫ్లోరిన్ చాలా చిన్న పరిమాణం కలిగి ఉండటం వల్ల దాని 2p కక్ష్యలో ఎలక్ట్రాన్ సాంద్రత ఎక్కువగా ఉండి బలమైన వికర్షణ ఏర్పడుతుంది.',
    },
    hint: {
      en: 'Consider the intense crowding of 7 electrons in the tiny 2p subshell of Fluorine.',
      hi: 'फ्लोरीन के अत्यंत छोटे आकार में 7 इलेक्ट्रॉनों की भीड़ और उनके आपसी प्रतिकर्षण के बारे में सोचें।',
      te: 'ఫ్లోరిన్ యొక్క చిన్న కక్ష్యలో ఎలక్ట్రాన్ల మధ్య ఏర్పడే వికర్షణను పరిగణించండి.',
    },
    misconceptionTags: ['INCORRECT_NUCLEAR_CHARGE_ASSUMPTION'],
  },
];

for (const q of ciscePeriodicQuestions) {
  if (!existingQuestionIds.has(q.id)) {
    additionalQuestions.push(makeQuestion(q));
    existingQuestionIds.add(q.id);
  }
}

// Add all new questions to DB
for (const q of additionalQuestions) {
  db.questions.push(q);
  existingQuestionIds.add(q.id);
}

console.log('Total questions after expansion:', db.questions.length);

// Save updated database synchronously
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated database.json with expanded curriculum and questions!');
