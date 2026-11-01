/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { DiagnosticEvidence, SmartRecoveryActivity, ErrorType, MasteryStatus, BoardType, ClassLevel } from './types.js';

export interface FollowUpProbe {
  id: string;
  conceptId: string;
  subject: string;
  question: string;
  testedSubSkill: string;
  probeType: 'PREREQUISITE' | 'CONCEPTUAL';
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// ==========================================
// 1. COMPREHENSIVE MULTI-SUBJECT PROBES CATALOG
// ==========================================
export const diagnosticProbesCatalog: Record<string, FollowUpProbe[]> = {
  // CBSE Class 10 Science - Chemical Reactions
  con_cbse10_sci_chem_c1: [
    {
      id: 'probe_chem_subscript',
      conceptId: 'con_cbse10_sci_chem_c1',
      subject: 'Science',
      question: 'Investigative Probe 1: When balancing H₂ + O₂ → H₂O, why is changing the formula to H₂O₂ scientifically invalid?',
      testedSubSkill: 'Molecular Identity & Subscript Invariance (Class 9 Prerequisite)',
      probeType: 'PREREQUISITE',
      options: [
        'Subscripts define chemical identity; H₂O₂ is toxic hydrogen peroxide, not water',
        'Subscripts can only be changed when reacting metals with steam',
        'Coefficients must always be prime numbers',
      ],
      correctAnswer: 'Subscripts define chemical identity; H₂O₂ is toxic hydrogen peroxide, not water',
      explanation: 'Subscripts dictate molecular structure. To satisfy mass conservation, only stoichiometric multipliers (coefficients) in front of formulas can be adjusted.',
    },
    {
      id: 'probe_chem_atom_inventory',
      conceptId: 'con_cbse10_sci_chem_c1',
      subject: 'Science',
      question: 'Investigative Probe 2: In 3Ca(OH)₂, how many Calcium (Ca), Oxygen (O), and Hydrogen (H) atoms are present in total?',
      testedSubSkill: 'Polyatomic Radical Atom Accounting',
      probeType: 'CONCEPTUAL',
      options: [
        '3 Calcium, 6 Oxygen, 6 Hydrogen atoms',
        '3 Calcium, 2 Oxygen, 2 Hydrogen atoms',
        '1 Calcium, 3 Oxygen, 3 Hydrogen atoms',
      ],
      correctAnswer: '3 Calcium, 6 Oxygen, 6 Hydrogen atoms',
      explanation: 'The subscript 2 multiplies each atom inside parentheses (2 O and 2 H). The coefficient 3 multiplies the whole formula: 3×1 Ca = 3, 3×2 O = 6, 3×2 H = 6.',
    },
  ],

  // CBSE Class 10 Science - Types of Reactions & Redox
  con_cbse10_sci_chem_c2: [
    {
      id: 'probe_redox_def',
      conceptId: 'con_cbse10_sci_chem_c2',
      subject: 'Science',
      question: 'Investigative Probe 1: In the reaction CuO + H₂ → Cu + H₂O, which substance loses oxygen and what is this process called?',
      testedSubSkill: 'Oxidation vs Reduction Definition',
      probeType: 'CONCEPTUAL',
      options: [
        'CuO loses oxygen; this is Reduction and CuO is the oxidizing agent',
        'H₂ loses oxygen; this is Oxidation',
        'Cu gains hydrogen; this is Neutralization',
      ],
      correctAnswer: 'CuO loses oxygen; this is Reduction and CuO is the oxidizing agent',
      explanation: 'Loss of oxygen or gain of electrons is reduction. The substance supplying the oxygen (CuO) is the oxidizing agent.',
    },
    {
      id: 'probe_redox_electron',
      conceptId: 'con_cbse10_sci_chem_c2',
      subject: 'Science',
      question: 'Investigative Probe 2: Can a reduction reaction ever take place in isolation without a simultaneous oxidation reaction?',
      testedSubSkill: 'Simultaneous Redox Electron Conservation Prerequisite',
      probeType: 'PREREQUISITE',
      options: [
        'No, electrons lost by one species must be accepted by another (Redox is coupled)',
        'Yes, reduction occurs spontaneously under sunlight alone',
        'Yes, displacement reactions produce reduction only',
      ],
      correctAnswer: 'No, electrons lost by one species must be accepted by another (Redox is coupled)',
      explanation: 'Oxidation and reduction are complementary halves of the same electron transfer process.',
    },
  ],

  // CBSE Class 10 English - Reported Speech
  con_cbse10_eng_c1: [
    {
      id: 'probe_eng_rep_verb',
      conceptId: 'con_cbse10_eng_c1',
      subject: 'English',
      question: 'Investigative Probe 1: If the reporting verb is in the present tense ("She says: \'I am hungry\'"), how does the tense inside quotation marks change?',
      testedSubSkill: 'Reporting Verb Tense Invariance Rule',
      probeType: 'PREREQUISITE',
      options: [
        'The tense does NOT backshift ("She says that she is hungry")',
        'It must always backshift into past perfect ("had been hungry")',
        'It changes only if the speaker is female',
      ],
      correctAnswer: 'The tense does NOT backshift ("She says that she is hungry")',
      explanation: 'Tense backshift only occurs when the reporting verb is in the past tense (e.g., "said", "told", "inquired").',
    },
    {
      id: 'probe_eng_past_shift',
      conceptId: 'con_cbse10_eng_c1',
      subject: 'English',
      question: 'Investigative Probe 2: In "He said, \'I wrote a poem yesterday\'", how do the past tense verb and time adverb transform?',
      testedSubSkill: 'Past Simple to Past Perfect & Time Shift (yesterday -> previous day)',
      probeType: 'CONCEPTUAL',
      options: [
        'wrote -> had written, and yesterday -> the previous day',
        'wrote -> was writing, and yesterday -> tomorrow',
        'wrote -> writes, and yesterday -> that day',
      ],
      correctAnswer: 'wrote -> had written, and yesterday -> the previous day',
      explanation: 'Simple past backshifts to past perfect ("had written") and "yesterday" transforms into "the day before" or "the previous day".',
    },
  ],

  // CBSE Class 10 English - Concord
  con_cbse10_eng_c2: [
    {
      id: 'probe_eng_concord_compound',
      conceptId: 'con_cbse10_eng_c2',
      subject: 'English',
      question: 'Investigative Probe 1: When two singular subjects are joined by "neither... nor", which subject determines the verb number?',
      testedSubSkill: 'Proximity Concord Rule with Correlative Conjunctions',
      probeType: 'CONCEPTUAL',
      options: [
        'The verb agrees with the subject closest (nearest) to it',
        'The verb must always be plural regardless of subject',
        'The first subject always determines the verb',
      ],
      correctAnswer: 'The verb agrees with the subject closest (nearest) to it',
      explanation: 'With "either... or" and "neither... nor", the verb agrees with the closer subject: "Neither the teacher nor the students were present."',
    },
  ],

  // TS SSC Class 10 Physical Science - Light Reflection & Refraction
  con_ts10_ps_c1: [
    {
      id: 'probe_ts10_sign_conv',
      conceptId: 'con_ts10_ps_c1',
      subject: 'Physical Science',
      question: 'Investigative Probe 1: Under the New Cartesian Sign Convention, why is the focal length (f) of a concave mirror assigned a negative (-) sign?',
      testedSubSkill: 'Cartesian Coordinate Sign Convention (Pole as Origin)',
      probeType: 'PREREQUISITE',
      options: [
        'Because the focus lies in front of the reflecting surface, opposite to incident light',
        'Because concave mirrors can only form virtual images',
        'Because the mirror is curved outwards',
      ],
      correctAnswer: 'Because the focus lies in front of the reflecting surface, opposite to incident light',
      explanation: 'Distances measured against the direction of incident light (to the left of the pole) are negative. Concave mirrors have their focus in front (left) of the pole.',
    },
    {
      id: 'probe_ts10_mirror_formula',
      conceptId: 'con_ts10_ps_c1',
      subject: 'Physical Science',
      question: 'Investigative Probe 2: In the mirror formula 1/f = 1/v + 1/u, if an object is placed at 2F (center of curvature C) of a concave mirror, where is the image formed?',
      testedSubSkill: 'Ray Tracing Geometry at Center of Curvature',
      probeType: 'CONCEPTUAL',
      options: [
        'Exactly at 2F (at C), real, inverted, and of the same size',
        'At the focal point F, highly diminished',
        'Behind the mirror, virtual and enlarged',
      ],
      correctAnswer: 'Exactly at 2F (at C), real, inverted, and of the same size',
      explanation: 'An object at the center of curvature (C = 2f) forms an inverted, real image at C with magnification m = -1.',
    },
  ],

  // CISCE Class 10 Chemistry - Periodic Properties
  con_cisce10_chem_c1: [
    {
      id: 'probe_cisce_nuclear_charge',
      conceptId: 'con_cisce10_chem_c1',
      subject: 'Chemistry',
      question: 'Investigative Probe 1: As you move from left to right across Period 3 (Na to Cl), why does the atomic radius decrease despite an increase in atomic number?',
      testedSubSkill: 'Effective Nuclear Charge & Shell Invariance Prerequisite',
      probeType: 'CONCEPTUAL',
      options: [
        'Nuclear charge increases while number of shells remains constant, pulling outer electrons inward',
        'Electrons are lost as you move across the period',
        'The shielding effect increases dramatically across the period',
      ],
      correctAnswer: 'Nuclear charge increases while number of shells remains constant, pulling outer electrons inward',
      explanation: 'Across a period, each added proton increases the inward electrostatic pull on the same principal energy shell.',
    },
    {
      id: 'probe_cisce_ionization_energy',
      conceptId: 'con_cisce10_chem_c1',
      subject: 'Chemistry',
      question: 'Investigative Probe 2: Down a group (e.g., Li -> Na -> K), what happens to the Ionization Potential (energy required to remove the outermost electron)?',
      testedSubSkill: 'Periodic Group Trends & Atomic Size Influence',
      probeType: 'PREREQUISITE',
      options: [
        'It decreases, because additional shells place valence electrons further from the nucleus',
        'It increases, because more protons are present in the core',
        'It stays identical for all alkali metals',
      ],
      correctAnswer: 'It decreases, because additional shells place valence electrons further from the nucleus',
      explanation: 'Increasing atomic radius and shielding down a group weaken the nuclear grip on valence electrons, lowering ionization energy.',
    },
  ],

  // CBSE Class 8 Math - Fractions
  con_cbse8_m1_c3: [
    {
      id: 'probe_frac_lcm',
      conceptId: 'con_cbse8_m1_c3',
      subject: 'Mathematics',
      question: 'Investigative Probe 1: Can you identify the Least Common Multiple (LCM) of denominators 4 and 6?',
      testedSubSkill: 'Class 6 Multiples & LCM Prerequisite',
      probeType: 'PREREQUISITE',
      options: ['10', '12', '24'],
      correctAnswer: '12',
      explanation: 'Multiples of 4: 4, 8, 12, 16... Multiples of 6: 6, 12, 18... The first shared multiple is 12.',
    },
    {
      id: 'probe_frac_slice_meaning',
      conceptId: 'con_cbse8_m1_c3',
      subject: 'Mathematics',
      question: 'Investigative Probe 2: If a cake is sliced into 4 pieces and another into 3 pieces, are the slices the same size?',
      testedSubSkill: 'Fraction Scale & Denominator Meaning',
      probeType: 'CONCEPTUAL',
      options: [
        'No, 1/3 slice is larger than 1/4 slice',
        'Yes, a slice is always a slice regardless of total count',
        'Depends on whether the cake is round or square',
      ],
      correctAnswer: 'No, 1/3 slice is larger than 1/4 slice',
      explanation: 'Denominators define partition size. Cutting into fewer pieces produces larger portions.',
    },
  ],

  // CBSE Class 8 Math - Linear Equations
  con_cbse8_m2_c2: [
    {
      id: 'probe_lin_sign_flip',
      conceptId: 'con_cbse8_m2_c2',
      subject: 'Mathematics',
      question: 'Investigative Probe 1: When transposing a subtracted term (-7) across the equals sign, what operation must be applied?',
      testedSubSkill: 'Inverse Operation Rule on Equations',
      probeType: 'PREREQUISITE',
      options: [
        'Addition (+7) to both sides to maintain equality',
        'Subtraction (-7) because the term retains its sign',
        'Division by 7',
      ],
      correctAnswer: 'Addition (+7) to both sides to maintain equality',
      explanation: 'To eliminate -7 from one side of the balance, you add +7 to both sides.',
    },
  ],

  // CBSE Class 8 English - Active/Passive Voice
  con_cbse8_eng_c1: [
    {
      id: 'probe_eng8_v3',
      conceptId: 'con_cbse8_eng_c1',
      subject: 'English',
      question: 'Investigative Probe 1: In every passive voice sentence, what verb form must follow the auxiliary verb (be/was/were)?',
      testedSubSkill: 'Past Participle V3 Requirement in Passive Sentences',
      probeType: 'PREREQUISITE',
      options: [
        'Past Participle form (V3 like "written", "given", "broken")',
        'Present continuous form (V-ing like "writing")',
        'Base form (V1 like "write")',
      ],
      correctAnswer: 'Past Participle form (V3 like "written", "given", "broken")',
      explanation: 'Passive structure always requires: Object + Auxiliary "be" + Past Participle (V3) + by Subject.',
    },
    {
      id: 'probe_eng8_agent',
      conceptId: 'con_cbse8_eng_c1',
      subject: 'English',
      question: 'Investigative Probe 2: In "The chef baked a delicious cake", what becomes the grammatical subject in passive voice?',
      testedSubSkill: 'Object-Subject Inversion Mechanism',
      probeType: 'CONCEPTUAL',
      options: [
        '"A delicious cake" (the active object becomes the passive subject)',
        '"The chef" remains the subject',
        '"Baked" becomes the subject',
      ],
      correctAnswer: '"A delicious cake" (the active object becomes the passive subject)',
      explanation: 'In passive voice, focus shifts from the doer of the action to the recipient/object of the action.',
    },
  ],

  // CBSE Class 8 English - Adverbs (Definition, Modification & Adjective Distinction)
  con_cbse8_eng_adv_c1: [
    {
      id: 'probe_adv_adj_role',
      conceptId: 'con_cbse8_eng_adv_c1',
      subject: 'English',
      question: 'Investigative Probe 1: In the sentence "The athlete ran quick across the finish line," why is "quick" considered a grammatical error?',
      testedSubSkill: 'Adjective vs Adverb Target Role (Prerequisite)',
      probeType: 'PREREQUISITE',
      options: [
        '"quick" is an adjective that can only modify nouns/pronouns; modifying the action verb "ran" requires the adverb "quickly"',
        '"quick" can only be used with present continuous verbs',
        '"ran" is an auxiliary verb and requires an adverb of degree',
      ],
      correctAnswer: '"quick" is an adjective that can only modify nouns/pronouns; modifying the action verb "ran" requires the adverb "quickly"',
      explanation: 'Adjectives modify entities (nouns). To describe the manner in which an action verb is executed, standard English strictly demands the adverb of manner.',
    },
    {
      id: 'probe_adv_flat_trap',
      conceptId: 'con_cbse8_eng_adv_c1',
      subject: 'English',
      question: 'Investigative Probe 2: Why can we say "He drove fast" but cannot say "He drove fastly" or "He spoke friendly"?',
      testedSubSkill: 'Flat Adverbs vs False -ly Adjectives',
      probeType: 'CONCEPTUAL',
      options: [
        '"fast" is a flat adverb with no -ly suffix ("fastly" does not exist), while "friendly" is a noun-derived adjective requiring "in a friendly manner"',
        '"friendly" can only be placed before the subject noun',
        '"fast" is an irregular noun that transforms into an adjective',
      ],
      correctAnswer: '"fast" is a flat adverb with no -ly suffix ("fastly" does not exist), while "friendly" is a noun-derived adjective requiring "in a friendly manner"',
      explanation: 'Flat adverbs like "fast" and "hard" never accept "-ly". Words like "friendly" and "lovely" (noun + ly) are adjectives, not adverbs.',
    },
  ],

  // CBSE Class 8 English - Adverbs (Types & Sentence Placement)
  con_cbse8_eng_adv_c2: [
    {
      id: 'probe_adv_freq_placement',
      conceptId: 'con_cbse8_eng_adv_c2',
      subject: 'English',
      question: 'Investigative Probe 1: Where does an adverb of frequency ("always", "never") go when a sentence contains the linking verb "is" versus an action verb like "reads"?',
      testedSubSkill: 'Syntactic Frequency Word Order with "be" vs Action Verbs',
      probeType: 'CONCEPTUAL',
      options: [
        'AFTER the linking verb "is" (e.g. "She is always..."), but BEFORE the action verb (e.g. "She always reads...")',
        'Always before both verbs without exception',
        'Always at the very end of the sentence following the object',
      ],
      correctAnswer: 'AFTER the linking verb "is" (e.g. "She is always..."), but BEFORE the action verb (e.g. "She always reads...")',
      explanation: 'English syntax mandates: Subject + [Frequency Adverb] + Main Verb (e.g. "always reads"), but Subject + [is/am/are/was/were] + [Frequency Adverb] (e.g. "is always").',
    },
    {
      id: 'probe_adv_mpt_rule',
      conceptId: 'con_cbse8_eng_adv_c2',
      subject: 'English',
      question: 'Investigative Probe 2: When combining adverbs of Manner, Place, and Time at the end of a sentence, what is the standard order?',
      testedSubSkill: 'Manner-Place-Time (M-P-T) Sequence Convention',
      probeType: 'PREREQUISITE',
      options: [
        'Manner first, then Place, then Time (M-P-T: "played passionately at the hall yesterday")',
        'Time first, then Place, then Manner (T-P-M)',
        'Place first, then Time, then Manner (P-T-M)',
      ],
      correctAnswer: 'Manner first, then Place, then Time (M-P-T: "played passionately at the hall yesterday")',
      explanation: 'The natural syntactic rhythm in English organizes clause-ending modifiers in M-P-T sequence (Manner -> Place -> Time).',
    },
  ],

  // CBSE Class 6 Science - Components of Food
  con_cbse6_sci_c1: [
    {
      id: 'probe_cbse6_iodine',
      conceptId: 'con_cbse6_sci_c1',
      subject: 'Science',
      question: 'Investigative Probe 1: What color change indicates the presence of starch when testing with dilute iodine solution?',
      testedSubSkill: 'Starch Biochemical Iodine Test Prerequisite',
      probeType: 'PREREQUISITE',
      options: [
        'Blue-black color',
        'Bright red or pink color',
        'Milky white precipitate',
      ],
      correctAnswer: 'Blue-black color',
      explanation: 'Iodine reacts with helical amylose in starch to form a characteristic deep blue-black complex.',
    },
    {
      id: 'probe_cbse6_scurvy',
      conceptId: 'con_cbse6_sci_c1',
      subject: 'Science',
      question: 'Investigative Probe 2: A child suffers from bleeding gums and wounds take an abnormally long time to heal. Which vitamin is deficient?',
      testedSubSkill: 'Nutrient Deficiency Symptom Recognition',
      probeType: 'CONCEPTUAL',
      options: [
        'Vitamin C (Scurvy)',
        'Vitamin A (Night blindness)',
        'Vitamin D (Rickets)',
      ],
      correctAnswer: 'Vitamin C (Scurvy)',
      explanation: 'Vitamin C (ascorbic acid) is vital for collagen synthesis. Deficiency leads to fragile capillaries and scurvy.',
    },
  ],
};

// ==========================================
// 2. AUTHENTIC MULTI-SUBJECT SMART RECOVERY ACTIVITIES
// ==========================================
export const authenticRecoveryActivities: SmartRecoveryActivity[] = [
  // Class 10 Science - Chemical Reactions & Balancing
  {
    id: 'rec_chem_rxn_balancing',
    conceptId: 'con_cbse10_sci_chem_c1',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    subject: 'Science',
    board: 'CBSE',
    classLevel: '10',
    title: 'Smart Recovery: Law of Conservation of Mass & Stoichiometric Balancing',
    recoveryType: 'Conceptual Understanding',
    learningPathway: [
      'Chemical Invariance: Subscripts vs Stoichiometric Multipliers',
      'The Atom Inventory Table: Reactants vs Products Tabulation',
      'Hit-and-Trial Balancing Procedure with Physical State Symbols',
      'Guided Scaffolding Practice with Instant Verification',
      'Unlock Fresh Class 10 Retest',
    ],
    remediationExplanation: {
      en: 'In every chemical reaction, matter is neither created nor destroyed. The total number of atoms of each element on the reactant side must equal the product side. Crucially: NEVER modify chemical subscripts (e.g., H₂O cannot become H₂O₂ because that creates a different toxic compound!). You may ONLY place whole numbers (coefficients) in front of the formula.',
      hi: 'रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है और न ही विनाश। दोनों पक्षों में प्रत्येक तत्व के परमाणुओं की संख्या समान होनी चाहिए। सूत्र के उप-चिह्नों (subscripts) को कभी न बदलें, केवल आगे गुणक (coefficients) लगाएं।',
      te: 'రసాయన చర్యలో ద్రవ్యరాశి సృష్టింపబడదు, నాశనమూ కాదు. క్రియాజనకాలలోని పరమాణువుల సంఖ్య క్రియాజన్యాల పరమాణువుల సంఖ్యకు సమానంగా ఉండాలి. ఫార్ములా కింద ఉండే సబ్‌స్క్రిప్ట్‌లను ఎప్పటికీ మార్చకూడదు, ముందు గుణకాలను మాత్రమే చేర్చాలి.',
    },
    prerequisiteBridge: {
      prerequisiteTitle: 'Class 9 Dalton\'s Atomic Theory & Polyatomic Radicals',
      prerequisiteClass: '9',
      bridgeExplanation: {
        en: 'In formulas with parentheses like Ca(OH)₂, the subscript 2 outside multiplies every atom inside: 2 Oxygen atoms and 2 Hydrogen atoms per formula unit.',
        hi: 'कोष्ठक वाले सूत्रों जैसे Ca(OH)₂ में, बाहर का अंक 2 अंदर के प्रत्येक परमाणु से गुणा होता है: 2 ऑक्सीजन और 2 हाइड्रोजन।',
        te: 'Ca(OH)₂ వంటి బ్రాకెట్లు ఉన్న ఫార్ములాలలో, బయట ఉన్న 2 లోపలి ప్రతి పరమాణువును గుణిస్తుంది: 2 ఆక్సిజన్ మరియు 2 హైడ్రోజన్ పరమాణువులు.',
      },
    },
    guidedPracticeQuestions: [
      {
        id: 'rec_chem_gq_01',
        prompt: {
          en: 'Step 1: In the skeletal reaction Fe + H₂O → Fe₃O₄ + H₂, which element has the largest atomic imbalance and should be balanced first?',
          hi: 'चरण 1: कंकाली समीकरण Fe + H₂O → Fe₃O₄ + H₂ में किस तत्व में सबसे अधिक असंतुलन है जिसे पहले संतुलित करना चाहिए?',
          te: 'దశ 1: Fe + H₂O → Fe₃O₄ + H₂ సమీకరణంలో ఏ మూలకం ఎక్కువ అసమతుల్యత కలిగి ఉంది?',
        },
        scaffoldHint: {
          en: 'Fe₃O₄ has 4 Oxygen atoms on the right, but H₂O has only 1 Oxygen on the left.',
          hi: 'दाएं पक्ष में 4 ऑक्सीजन हैं और बाएं में केवल 1। 4 ऑक्सीजन को संतुलित करने के लिए H₂O के आगे 4 लगाएं।',
          te: 'కుడివైపు 4 ఆక్సిజన్లు ఉన్నాయి, కాబట్టి H₂O ముందు 4 గుణకం పెట్టాలి.',
        },
        stepClues: [
          { en: 'Count Oxygen: 1 (left) vs 4 (right). Place coefficient 4 in front of H₂O.', hi: 'ऑक्सीजन गिनें: बाएं 1, दाएं 4। H₂O के आगे 4 लगाएं।', te: 'ఆక్సిజన్ లెక్కింపు: ఎడమ 1, కుడి 4. H₂O ముందు 4 ఉంచండి.' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'Oxygen (balance by placing 4H₂O)', hi: 'ऑक्सीजन (4H₂O लगाकर संतुलित करें)', te: 'ఆక్సిజన్ (4H₂O రాయడం ద్వారా)' }, isCorrect: true },
          { id: 'opt2', text: { en: 'Change formula to Fe₃O₄ + H₂O₄', hi: 'सूत्र को Fe₃O₄ + H₂O₄ में बदलें', te: 'ఫార్ములాను H₂O₄ గా మార్చండి' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Exact! Placing 4 in front of H₂O balances Oxygen (4 O on both sides).',
          hi: 'शाबाश! 4H₂O लिखने से ऑक्सीजन संतुलित हो जाता है।',
          te: 'సరైనది! 4H₂O రాయడం వల్ల ఆక్సిజన్ సమతుల్యం అవుతుంది.',
        },
      },
      {
        id: 'rec_chem_gq_02',
        prompt: {
          en: 'Step 2: After placing 4H₂O, we have 8 Hydrogen atoms on the left (4×2). How many H₂ molecules are needed on the right to balance Hydrogen?',
          hi: 'चरण 2: 4H₂O लगाने के बाद बाएं 8 हाइड्रोजन हैं। दाएं हाइड्रोजन को संतुलित करने के लिए कितने H₂ अणु चाहिए?',
          te: 'దశ 2: ఎడమవైపు 8 హైడ్రోజన్లు (4×2) ఉన్నప్పుడు, కుడివైపు సమతుల్యం కావడానికి ఎన్ని H₂ అణువులు కావాలి?',
        },
        scaffoldHint: {
          en: 'Each H₂ molecule carries 2 hydrogen atoms. 8 atoms ÷ 2 = 4 molecules.',
          hi: 'प्रत्येक H₂ में 2 परमाणु होते हैं। 8 ÷ 2 = 4 अणु।',
          te: 'ప్రతి H₂ లో 2 పరమాణువులు ఉంటాయి. 8 ÷ 2 = 4 అణువులు.',
        },
        stepClues: [
          { en: '4 H₂ gives 4 × 2 = 8 Hydrogen atoms.', hi: '4 H₂ से 4 × 2 = 8 हाइड्रोजन मिलते हैं।', te: '4 H₂ అంటే 4 × 2 = 8 హైడ్రోజన్ పరమాణువులు.' },
        ],
        choices: [
          { id: 'opt1', text: { en: '4 H₂ molecules', hi: '4 H₂ अणु', te: '4 H₂ అణువులు' }, isCorrect: true },
          { id: 'opt2', text: { en: '8 H₂ molecules', hi: '8 H₂ अणु', te: '8 H₂ అణువులు' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Correct! Final balanced equation: 3Fe + 4H₂O → Fe₃O₄ + 4H₂.',
          hi: 'बिल्कुल सही! पूर्ण संतुलित समीकरण: 3Fe + 4H₂O → Fe₃O₄ + 4H₂।',
          te: 'అద్భుతం! తుది తుల్య సమీకరణం: 3Fe + 4H₂O → Fe₃O₄ + 4H₂.',
        },
      },
    ],
    completionCriteria: {
      minQuestionsRequired: 2,
      minCorrectRequired: 2,
      readPrerequisiteRequired: true,
    },
  },

  // Class 10 English - Reported Speech
  {
    id: 'rec_eng_reported_speech',
    conceptId: 'con_cbse10_eng_c1',
    chapterId: 'ch_cbse10_eng_grammar',
    subject: 'English',
    board: 'CBSE',
    classLevel: '10',
    title: 'Smart Recovery: Reported Speech Backshifts & Time Expressions',
    recoveryType: 'Conceptual Understanding',
    learningPathway: [
      'The Golden Reporting Verb Rule: When to Shift vs When to Retain Tenses',
      'Systematic Tense Backshift Chart (Present -> Past, Past Simple -> Past Perfect)',
      'Time & Place Adverb Conversions (now -> then, yesterday -> previous day)',
      'Guided Transformation Practice with Instant Feedback',
      'Unlock Fresh Retest upon meeting criteria',
    ],
    remediationExplanation: {
      en: 'When reporting what someone said in the past ("He said..."), you are describing events from a past vantage point. Therefore, every present action in direct speech shifts one step into the past: simple present ("I write") becomes simple past ("he wrote"), and simple past ("I wrote") shifts further back to past perfect ("he had written"). If the statement expresses a universal scientific truth, however, the tense remains unchanged ("The teacher said the Earth revolves around the Sun").',
      hi: 'जब रिपोर्टिंग क्रिया भूतकाल में हो ("He said..."), तो प्रत्यक्ष कथन का काल एक चरण पीछे खिसक जाता है: Simple Present बदलकर Simple Past बनता है और Simple Past बदलकर Past Perfect ("had + V3") बनता है। सार्वभौमिक सत्य होने पर काल नहीं बदलता।',
      te: 'రిపోర్టింగ్ వెర్బ్ గతకాలంలో ఉన్నప్పుడు ("He said..."), డైరెక్ట్ స్పీచ్ లోని కాలం ఒక అడుగు వెనక్కి మారుతుంది: Simple Present కాస్త Simple Past గాను, Simple Past కాస్త Past Perfect ("had + V3") గాను మారుతుంది.',
    },
    prerequisiteBridge: {
      prerequisiteTitle: 'Pronoun Case Shift (First Person -> Third Person)',
      prerequisiteClass: '8',
      bridgeExplanation: {
        en: 'The pronoun changes according to the speaker: "I" becomes "he" or "she", "we" becomes "they", and "my" becomes "his" or "her".',
        hi: 'सर्वनाम वक्ता के अनुसार बदलता है: "I" बदलकर "he/she" और "my" बदलकर "his/her" बन जाता है।',
        te: 'సర్వనామం మాట్లాడే వ్యక్తిని బట్టి మారుతుంది: "I" అనేది "he/she" గాను, "my" అనేది "his/her" గాను మారుతుంది.',
      },
    },
    guidedPracticeQuestions: [
      {
        id: 'rec_eng_gq_01',
        prompt: {
          en: 'Convert: Rita said, "I have finished my homework."',
          hi: 'परोक्ष कथन में बदलें: Rita said, "I have finished my homework."',
          te: 'ఇండైరెక్ట్ స్పీచ్ లోకి మార్చండి: Rita said, "I have finished my homework."',
        },
        scaffoldHint: {
          en: 'Present Perfect ("have finished") backshifts to Past Perfect ("had finished"). "My" becomes "her".',
          hi: 'Present Perfect ("have finished") बदलकर Past Perfect ("had finished") बनता है।',
          te: 'Present Perfect ("have finished") కాస్త Past Perfect ("had finished") గా మారుతుంది.',
        },
        stepClues: [
          { en: 'have finished -> had finished; my -> her', hi: 'have finished -> had finished; my -> her', te: 'have finished -> had finished; my -> her' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'Rita said that she had finished her homework.', hi: 'Rita said that she had finished her homework.', te: 'Rita said that she had finished her homework.' }, isCorrect: true },
          { id: 'opt2', text: { en: 'Rita said that she has finished her homework.', hi: 'Rita said that she has finished her homework.', te: 'Rita said that she has finished her homework.' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Perfect! "have finished" correctly backshifted to "had finished".',
          hi: 'शाबाश! Present Perfect को सही ढंग से Past Perfect में बदला गया।',
          te: 'చక్కగా చెప్పారు! "have finished" ను "had finished" గా మార్చారు.',
        },
      },
    ],
    completionCriteria: {
      minQuestionsRequired: 1,
      minCorrectRequired: 1,
      readPrerequisiteRequired: true,
    },
  },

  // TS SSC Class 10 Physical Science - Optics & Sign Convention
  {
    id: 'rec_ts10_lens_optics',
    conceptId: 'con_ts10_ps_c1',
    chapterId: 'ch_ts10_ps_light',
    subject: 'Physical Science',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    title: 'Smart Recovery: Cartesian Sign Convention & Mirror Ray Geometry',
    recoveryType: 'Prerequisite Support',
    learningPathway: [
      'The Pole as Coordinate Origin (0,0)',
      'Direction of Incident Light: Positive (+x) vs Negative (-x)',
      'Focal Length Rules: Concave (f < 0) vs Convex (f > 0)',
      'Applying the Mirror Formula 1/f = 1/v + 1/u with Signs',
      'Unlock Fresh Retest',
    ],
    remediationExplanation: {
      en: 'All distances in spherical mirrors are measured from the Pole (P) as the origin. The direction of incident light is taken as positive (+). Since the real focus of a concave mirror lies in front of the reflecting surface (towards the left, against incident rays), its focal length is ALWAYS NEGATIVE (f < 0). For a convex mirror, the focus is behind the mirror, so f is ALWAYS POSITIVE (f > 0).',
      hi: 'गोलीय दर्पण में सभी दूरियाँ ध्रुव (Pole) से मापी जाती हैं। आपतित प्रकाश की दिशा धनात्मक (+) होती है। अवतल दर्पण की फोकस दूरी सदैव ऋणात्मक (f < 0) और उत्तल दर्पण की सदैव धनात्मक (f > 0) होती है।',
      te: 'గోళాకార దర్పణాలలో అన్ని దూరాలను ధ్రువం (P) నుండి కొలుస్తారు. కాంతి కిరణాల దిశ ధనాత్మకం. పుటాకార దర్పణ నాభ్యాంతరం ఎల్లప్పుడూ రుణాత్మకం (f < 0), కుంభాకార దర్పణ నాభ్యాంతరం ఎల్లప్పుడూ ధనాత్మకం (f > 0).',
    },
    prerequisiteBridge: {
      prerequisiteTitle: 'Cartesian Coordinate Geometry (X-Axis Signs)',
      prerequisiteClass: '9',
      bridgeExplanation: {
        en: 'Just like on a standard X-axis: distances to the right of the origin are positive (+), while distances to the left are negative (-).',
        hi: 'ग्राफ के X-अक्ष की तरह: मूल बिंदु के दाईं ओर धनात्मक (+) और बाईं ओर ऋणात्मक (-)।',
        te: 'గ్రాఫ్ X-అక్షం వలె: మూలబిందువు కుడివైపు ధనాత్మకం (+), ఎడమవైపు రుణాత్మకం (-).',
      },
    },
    guidedPracticeQuestions: [
      {
        id: 'rec_ts10_gq_01',
        prompt: {
          en: 'A concave mirror has a radius of curvature R = 30 cm. What value of focal length (f) should be substituted into the mirror formula?',
          hi: 'एक अवतल दर्पण की वक्रता त्रिज्या R = 30 सेमी है। दर्पण सूत्र में फोकस दूरी (f) का क्या मान रखा जाएगा?',
          te: 'ఒక పుటాకార దర్పణ వక్రతా వ్యాసార్థం R = 30 సెం.మీ. దర్పణ సూత్రంలో నాభ్యాంతరం (f) విలువను ఎంతగా ప్రతిక్షేపించాలి?',
        },
        scaffoldHint: {
          en: 'f = R / 2 = 30 / 2 = 15 cm. Since it is a concave mirror, apply the negative sign!',
          hi: 'f = R / 2 = 15 सेमी। अवतल दर्पण के लिए चिन्ह ऋणात्मक (-) होता है।',
          te: 'f = R / 2 = 15 సెం.మీ. పుటాకార దర్పణం కాబట్టి మైనస్ (-) గుర్తు చేర్చాలి!',
        },
        stepClues: [
          { en: 'f = -15 cm (concave mirror focus is in front)', hi: 'f = -15 सेमी (अवतल दर्पण)', te: 'f = -15 సెం.మీ (పుటాకార దర్పణం)' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'f = -15 cm', hi: 'f = -15 सेमी', te: 'f = -15 సెం.మీ' }, isCorrect: true },
          { id: 'opt2', text: { en: 'f = +15 cm', hi: 'f = +15 सेमी', te: 'f = +15 సెం.మీ' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Accurate! f = -15 cm for a concave mirror.',
          hi: 'बिल्कुल सही! अवतल दर्पण के लिए f = -15 सेमी।',
          te: 'సరైనది! పుటాకార దర్పణానికి f = -15 సెం.మీ.',
        },
      },
    ],
    completionCriteria: {
      minQuestionsRequired: 1,
      minCorrectRequired: 1,
      readPrerequisiteRequired: true,
    },
  },

  // CISCE Class 10 Chemistry - Periodic Trends
  {
    id: 'rec_cisce10_periodic_trends',
    conceptId: 'con_cisce10_chem_c1',
    chapterId: 'ch_cisce10_chem_ptable',
    subject: 'Chemistry',
    board: 'CISCE',
    classLevel: '10',
    title: 'Smart Recovery: Effective Nuclear Charge & Periodic Trends',
    recoveryType: 'Conceptual Understanding',
    learningPathway: [
      'The Two Competing Forces: Nuclear Charge vs Number of Energy Shells',
      'Across a Period: Why Atomic Radii Decrease and Ionization Potential Increases',
      'Down a Group: Why Atomic Radii Increase and Electronegativity Drops',
      'Guided Problem Solving & Trend Predictions',
      'Unlock Fresh Retest',
    ],
    remediationExplanation: {
      en: 'Two factors govern all periodic trends: (1) Nuclear Charge (number of protons in the nucleus) pulling electrons inward, and (2) Number of Shells providing distance and shielding. Across a period, new electrons enter the SAME shell while proton count increases, creating a stronger inward electrostatic pull. Thus, atomic radius decreases and ionization energy rises.',
      hi: 'आवर्त सारणी की प्रवृत्तियां दो कारकों पर निर्भर करती हैं: नाभिकीय आवेश (प्रोटॉनों की संख्या) और कोशों (shells) की संख्या। आवर्त में बाएं से दाएं जाने पर कोशों की संख्या समान रहती है लेकिन नाभिकीय आवेश बढ़ता है, जिससे परमाणु त्रिज्या घटती है।',
      te: 'ఆవర్తన ధర్మాలు రెండు అంశాలపై ఆధారపడతాయి: (1) కేంద్రక ఆవేశం (ప్రోటాన్ల సంఖ్య), (2) కక్ష్యల సంఖ్య. పీరియడ్‌లో ఎడమ నుండి కుడికి వెళ్లే కొద్దీ కక్ష్యల సంఖ్య స్థిరంగా ఉండి కేంద్రక ఆవేశం పెరుగుతుంది, కాబట్టి పరమాణు వ్యాసార్థం తగ్గుతుంది.',
    },
    guidedPracticeQuestions: [
      {
        id: 'rec_cisce_gq_01',
        prompt: {
          en: 'Between Magnesium (Mg, Z=12) and Chlorine (Cl, Z=17) in Period 3, which has a higher first ionization energy?',
          hi: 'आवर्त 3 में मैग्नीशियम (Mg, Z=12) और क्लोरीन (Cl, Z=17) में से किसकी प्रथम आयनन ऊर्जा अधिक है?',
          te: 'పీరియడ్ 3 లోని మెగ్నీషియం (Mg, Z=12) మరియు క్లోరిన్ (Cl, Z=17) లలో దేనికి మొదటి అయనీకరణ శక్తి ఎక్కువ?',
        },
        scaffoldHint: {
          en: 'Chlorine has 17 protons compared to 12 in Magnesium, holding valence electrons much more tightly in the same third shell.',
          hi: 'क्लोरीन में 17 प्रोटॉन हैं जो तीसरे कोश के इलेक्ट्रॉनों को अधिक दृढ़ता से बांधे रखते हैं।',
          te: 'క్లోరిన్ లో 17 ప్రోటాన్లు ఉంటాయి, కాబట్టి బాహ్య కక్ష్యలోని ఎలక్ట్రాన్లను గట్టిగా పట్టి ఉంచుతుంది.',
        },
        stepClues: [
          { en: 'Higher nuclear pull = higher energy needed to remove an electron = Chlorine.', hi: 'उच्च नाभिकीय खिंचाव = इलेक्ट्रॉन निकालने हेतु उच्च ऊर्जा = क्लोरीन।', te: 'ఎక్కువ కేంద్రక ఆకర్షణ = ఎలక్ట్రాన్ తొలగించడానికి ఎక్కువ శక్తి = క్లోరిన్.' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'Chlorine (Cl)', hi: 'क्लोरीन (Cl)', te: 'క్లోరిన్ (Cl)' }, isCorrect: true },
          { id: 'opt2', text: { en: 'Magnesium (Mg)', hi: 'मैग्नीशियम (Mg)', te: 'మెగ్నీషియం (Mg)' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Spot on! Chlorine has higher nuclear charge, so its ionization potential is significantly higher.',
          hi: 'शाबाश! क्लोरीन का उच्च नाभिकीय आवेश होने से आयनन ऊर्जा अधिक होती है।',
          te: 'అద్భుతం! క్లోరిన్ కు ఎక్కువ కేంద్రక ఆవేశం ఉండటం వల్ల అయనీకరణ శక్తి ఎక్కువ.',
        },
      },
    ],
    completionCriteria: {
      minQuestionsRequired: 1,
      minCorrectRequired: 1,
      readPrerequisiteRequired: false,
    },
  },

  // CBSE Class 8 English - Active & Passive Voice
  {
    id: 'rec_cbse8_active_passive',
    conceptId: 'con_cbse8_eng_c1',
    chapterId: 'ch_cbse8_eng_grammar',
    subject: 'English',
    board: 'CBSE',
    classLevel: '8',
    title: 'Smart Recovery: Active to Passive Voice Transformation & V3 Participles',
    recoveryType: 'Conceptual Understanding',
    learningPathway: [
      'The 3 Golden Rules: Subject-Object Swap, Auxiliary "Be", and Past Participle V3',
      'Verb Tense Matching with "Be" (is/are, was/were, has been, will be)',
      'Pronoun Transformations (he -> him, they -> them)',
      'Scaffolded Sentence Construction',
      'Unlock Fresh Retest',
    ],
    remediationExplanation: {
      en: 'In active voice, the subject performs the action ("The dog bit the man"). In passive voice, the object becomes the subject and receives the action ("The man was bitten by the dog"). Crucial rule: The passive verb always consists of the appropriate tense form of "be" followed by the Past Participle (V3 form). Never use simple past or continuous forms without auxiliary "be"!',
      hi: 'Active voice में कर्ता कार्य करता है। Passive voice में कर्म कर्ता का स्थान ले लेता है। मुख्य नियम: Passive में हमेशा "be" का उपयुक्त रूप और क्रिया का Past Participle (V3) रूप ही आता है।',
      te: 'యాక్టివ్ వాయిస్ లో కర్త పని చేస్తుంది. పాసివ్ వాయిస్ లో కర్మ ప్రధాన స్థానంలోకి వస్తుంది. ముఖ్యమైన సూత్రం: పాసివ్ వాయిస్ లో ఎల్లప్పుడూ "be" రూపం తరువాత వెర్బ్ యొక్క మూడవ రూపం (V3 - Past Participle) మాత్రమే రావాలి.',
    },
    guidedPracticeQuestions: [
      {
        id: 'rec_eng8_gq_01',
        prompt: {
          en: 'Change to passive voice: "Alexander Graham Bell invented the telephone."',
          hi: 'Passive voice में बदलें: "Alexander Graham Bell invented the telephone."',
          te: 'పాసివ్ వాయిస్ లోకి మార్చండి: "Alexander Graham Bell invented the telephone."',
        },
        scaffoldHint: {
          en: '"The telephone" is singular past -> was + invented (V3) + by Alexander Graham Bell.',
          hi: '"The telephone" एकवचन भूतकाल है -> was + invented + by...',
          te: '"The telephone" ఏకవచనం, గతకాలం -> was + invented + by...',
        },
        stepClues: [
          { en: 'Object (The telephone) + was + V3 (invented) + by agent', hi: 'Object + was + V3 + by...', te: 'Object + was + V3 + by...' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'The telephone was invented by Alexander Graham Bell.', hi: 'The telephone was invented by Alexander Graham Bell.', te: 'The telephone was invented by Alexander Graham Bell.' }, isCorrect: true },
          { id: 'opt2', text: { en: 'The telephone had invented Alexander Graham Bell.', hi: 'The telephone had invented Alexander Graham Bell.', te: 'The telephone had invented Alexander Graham Bell.' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Excellent! Object promoted to subject, accompanied by "was invented".',
          hi: 'उत्तम! कर्म को सही ढंग से कर्ता बनाया गया और was invented का प्रयोग किया गया।',
          te: 'చక్కగా చెప్పారు! కర్మ కర్తగా మారి "was invented" వచ్చింది.',
        },
      },
    ],
    completionCriteria: {
      minQuestionsRequired: 1,
      minCorrectRequired: 1,
      readPrerequisiteRequired: false,
    },
  },

  // CBSE Class 6 Science - Components of Food
  {
    id: 'rec_cbse6_nutrients_diet',
    conceptId: 'con_cbse6_sci_c1',
    chapterId: 'ch_cbse6_sci_food',
    subject: 'Science',
    board: 'CBSE',
    classLevel: '6',
    title: 'Smart Recovery: Food Nutrients, Chemical Tests & Balanced Diet',
    recoveryType: 'Prerequisite Support',
    learningPathway: [
      'The 5 Major Nutrient Groups and Their Roles (Carbohydrates, Fats, Proteins, Vitamins, Minerals)',
      'Laboratory Tests for Starch (Iodine) and Proteins (Copper Sulphate + Caustic Soda)',
      'Deficiency Diseases and Dietary Sources (Vitamin A, C, D, Iron, Iodine)',
      'Interactive Nutrient Matching Practice',
      'Unlock Fresh Retest',
    ],
    remediationExplanation: {
      en: 'Our bodies require balanced proportions of all nutrients. Energy is supplied primarily by carbohydrates and fats. Body growth and repair require proteins. Disease resistance and cellular defense require vitamins and minerals. Lack of a specific nutrient over an extended period causes a deficiency disease: lack of Vitamin A causes night blindness, lack of Vitamin C causes scurvy, and lack of Iron causes anaemia.',
      hi: 'हमारे शरीर को सभी पोषक तत्वों की संतुलित मात्रा की आवश्यकता होती है। कार्बोहाइड्रेट और वसा ऊर्जा देते हैं, प्रोटीन वृद्धि करते हैं, तथा विटामिन एवं खनिज रोगों से रक्षा करते हैं। विटामिन C की कमी से स्कर्वी (मसूड़ों से खून आना) और आयरन की कमी से एनीमिया होता है।',
      te: 'మన శరీరానికి అన్ని రకాల పోషకాలు సమతుల్యంగా అవసరం. పిండిపదార్థాలు, కొవ్వులు శక్తినిస్తాయి; ప్రోటీన్లు శారీరక పెరుగుదలకు తోడ్పడతాయి; విటమిన్లు, ఖనిజాలు రోగనిరోధక శక్తినిస్తాయి. విటమిన్ సి లోపిస్తే స్కర్వీ, ఐరన్ లోపిస్తే రక్తహీనత కలుగుతాయి.',
    },
    guidedPracticeQuestions: [
      {
        id: 'rec_cbse6_gq_01',
        prompt: {
          en: 'Which chemical reagent turns blue-black when added to boiled rice or raw potato?',
          hi: 'उबले चावल या कच्चे आलू में डालने पर कौन सा रासायनिक अभिकर्मक नीला-काला हो जाता है?',
          te: 'ఉడికించిన అన్నం లేదా బంగాళాదుంపకు కలిపినప్పుడు ఏ ద్రావణం నీలి-నలుపు రంగులోకి మారుతుంది?',
        },
        scaffoldHint: {
          en: 'Rice and potato are rich in starch (carbohydrates). Starch is tested using dilute iodine solution.',
          hi: 'चावल और आलू में स्टार्च होता है, जिसकी पहचान आयोडीन घोल से होती है।',
          te: 'అన్నం, బంగాళాదుంపలలో పిండిపదార్థం ఉంటుంది. దీనిని అయోడిన్ ద్రావణంతో పరీక్షిస్తారు.',
        },
        stepClues: [
          { en: 'Starch + Dilute Iodine Solution -> Blue-black color', hi: 'स्टार्च + आयोडीन घोल -> नीला-काला रंग', te: 'పిండిపదార్థం + అయోడిన్ -> నీలి-నలుపు రంగు' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'Dilute Iodine Solution', hi: 'तनु आयोडीन का घोल', te: 'విలీన అయోడిన్ ద్రావణం' }, isCorrect: true },
          { id: 'opt2', text: { en: 'Copper Sulphate Solution', hi: 'कॉपर सल्फेट का घोल', te: 'కాపర్ సల్ఫేట్ ద్రావణం' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Correct! Dilute iodine is the standard test for starch.',
          hi: 'बिल्कुल सही! स्टार्च परीक्षण के लिए आयोडीन का उपयोग किया जाता है।',
          te: 'సరిగ్గా చెప్పారు! పిండిపదార్థ పరీక్షకు అయోడిన్ వాడతారు.',
        },
      },
    ],
    completionCriteria: {
      minQuestionsRequired: 1,
      minCorrectRequired: 1,
      readPrerequisiteRequired: false,
    },
  },

  // CBSE Class 8 English - Adverbs Recovery
  {
    id: 'rec_cbse8_adverbs_mastery',
    conceptId: 'con_cbse8_eng_adv_c1',
    chapterId: 'ch_cbse8_eng_adverbs',
    board: 'CBSE',
    subject: 'English',
    classLevel: '8',
    title: 'Smart Recovery: Adverb Identification, Adjective Contrast & Syntax Placement',
    recoveryType: 'Conceptual Understanding',
    learningPathway: [
      'Contrast Adjectives vs Adverbs in Action Contexts',
      'Master Flat Adverbs (fast, hard) and False -ly Adjectives',
      'Lock in Frequency Placement: Before Action Verbs, After "To Be"',
      'Unlock Fresh Adverbs Retest',
    ],
    topic: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    identifiedGap: 'Difficulty distinguishing qualifying adjectives from action-modifying adverbs, incorrectly affixing -ly to flat adverbs, or misplacing frequency adverbs in verb phrases.',
    errorType: 'CONCEPTUAL_MISCONCEPTION',
    prerequisitePrereqSummary: {
      en: 'Remember: Adjectives exclusively qualify nouns and pronouns (e.g. "a swift runner", "a polite child"). Adverbs modify verbs ("spoke politely"), adjectives ("extremely polite"), and other adverbs ("runs very quickly"). "Good" is an adjective, whereas "well" is the adverb describing how an action is performed.',
      hi: 'याद रखें: विशेषण केवल संज्ञा/सर्वनाम का वर्णन करते हैं (A good boy)। क्रिया की विशेषता बताने के लिए क्रियाविशेषण का प्रयोग होता है (He sings well, न कि sings good)। "Fast" और "hard" फ्लैट एडवर्ब हैं जिनमें -ly कभी नहीं जुड़ता।',
      te: 'గుర్తుంచుకోండి: విశేషణాలు నామవాచకాలను వర్ణిస్తాయి (A good student). క్రియలను వర్ణించడానికి క్రియా విశేషణం వాడాలి (He speaks well). "Fast", "hard" లకు -ly చేర్చరాదు.',
    },
    recoverySteps: [
      'Contrast Adjectives vs Adverbs in Action Contexts',
      'Master Flat Adverbs (fast, hard) and False -ly Adjectives',
      'Lock in Frequency Placement: Before Action Verbs, After "To Be"',
      'Unlock Fresh Adverbs Retest',
    ],
    remediationExplanation: {
      en: 'Three golden rules resolve almost all adverb errors:\n1. Adjective vs Adverb: Use adjectives for things/people ("He is a good speaker") and adverbs for actions ("He speaks well").\n2. Flat Adverbs: Words like "fast" and "hard" never change into "fastly". "Hardly" means barely/scarcely, not with effort!\n3. Frequency Word Order: Position frequency adverbs BEFORE normal action verbs ("She ALWAYS smiles"), but AFTER forms of "be" ("She is ALWAYS cheerful") and between compound verbs ("She has NEVER failed").',
      hi: 'तीन मुख्य नियम:\n1. वस्तु/व्यक्ति के लिए विशेषण ("a good singer"), क्रिया के लिए क्रियाविशेषण ("sings well")।\n2. "Fastly" कोई शब्द नहीं है; "fast" ही क्रियाविशेषण है।\n3. Frequency adverbs सामान्य क्रिया से पहले आते हैं ("always works"), लेकिन "is/are/was/were" के बाद आते हैं ("is always ready")।',
      te: 'మూడు ముఖ్య నియమాలు:\n1. నామవాచకానికి విశేషణం ("good dancer"), క్రియకు క్రియా విశేషణం ("dances well").\n2. "Fastly" అనే పదం లేదు; "fast" మాత్రమే వాడాలి.\n3. Frequency adverbs సాధారణ క్రియకు ముందు ("always helps"), కానీ "be" రూపాల తర్వాత ("is always kind") వస్తాయి.',
    },
    guidedPracticeQuestions: [
      {
        id: 'rec_adv_gq_01',
        prompt: {
          en: 'Complete the sentence with the grammatically correct word: "The school choir sang _____ (good / well) at the state auditorium."',
          hi: 'सही शब्द चुनें: "The school choir sang _____ (good / well) at the state auditorium."',
          te: 'సరైన పదాన్ని ఎంచుకోండి: "The school choir sang _____ (good / well) at the state auditorium."',
        },
        scaffoldHint: {
          en: 'The blank modifies the action verb "sang". Therefore, you need the adverb ("well"), not the adjective ("good").',
          hi: 'यहाँ क्रिया "sang" की विशेषता बतानी है, अतः क्रियाविशेषण "well" आएगा।',
          te: 'ఇక్కడ క్రియ "sang" ను వర్ణించాలి కాబట్టి క్రియా విశేషణం "well" వాడాలి.',
        },
        stepClues: [
          { en: 'Modifying an action verb requires the adverb "well"', hi: 'क्रिया के लिए "well" का प्रयोग करें', te: 'క్రియ కోసం "well" వాడాలి' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'well', hi: 'well', te: 'well' }, isCorrect: true },
          { id: 'opt2', text: { en: 'good', hi: 'good', te: 'good' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Correct! "well" is the adverb modifying the action verb "sang".',
          hi: 'बिल्कुल सही! "sang" क्रिया के साथ "well" आता है।',
          te: 'సరిగ్గా చెప్పారు! "sang" క్రియతో "well" వస్తుంది.',
        },
      },
      {
        id: 'rec_adv_gq_02',
        prompt: {
          en: 'Choose the correct form of the flat adverb: "The rescue team drove _____ (fast / fastly) to reach the affected village."',
          hi: 'फ्लैट एडवर्ब का सही रूप चुनें: "The rescue team drove _____ (fast / fastly)..."',
          te: 'సరైన రూపాన్ని ఎంచుకోండి: "The rescue team drove _____ (fast / fastly)..."',
        },
        scaffoldHint: {
          en: '"Fast" is a flat adverb that serves as both adjective and adverb. "Fastly" is not a word in the English language.',
          hi: '"Fast" स्वयं क्रियाविशेषण है; "fastly" अंग्रेजी में अमान्य है।',
          te: '"Fast" స్వయంగా క్రియా విశేషణం; "fastly" అనే పదం లేదు.',
        },
        stepClues: [
          { en: 'Flat adverbs never take -ly suffix', hi: 'फ्लैट एडवर्ब में -ly नहीं जुड़ता', te: 'ఫ్లాట్ అడ్వెర్బ్‌లకు -ly చేరదు' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'fast', hi: 'fast', te: 'fast' }, isCorrect: true },
          { id: 'opt2', text: { en: 'fastly', hi: 'fastly', te: 'fastly' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Correct! "fast" is the standard flat adverb form.',
          hi: 'बिल्कुल सही! सही शब्द "fast" है।',
          te: 'సరిగ్గా చెప్పారు! "fast" సరైన రూపం.',
        },
      },
      {
        id: 'rec_adv_gq_03',
        prompt: {
          en: 'Where should the frequency adverb "always" be placed: "Pooja [is always / always is] prepared for her laboratory exams."',
          hi: 'सही विकल्प चुनें: "Pooja [is always / always is] prepared for her laboratory exams."',
          te: 'సరైన స్థానాన్ని ఎంచుకోండి: "Pooja [is always / always is] prepared for her laboratory exams."',
        },
        scaffoldHint: {
          en: 'With forms of the verb "to be" (is, am, are, was, were), frequency adverbs are placed AFTER the verb.',
          hi: '"is/are/was/were" के बाद frequency adverb आता है: "is always"।',
          te: '"is" తర్వాత frequency adverb రావాలి: "is always".',
        },
        stepClues: [
          { en: 'Rule: Subject + [is/am/are/was/were] + Frequency Adverb', hi: 'नियम: Subject + is + always', te: 'నియమం: Subject + is + always' },
        ],
        choices: [
          { id: 'opt1', text: { en: 'is always', hi: 'is always', te: 'is always' }, isCorrect: true },
          { id: 'opt2', text: { en: 'always is', hi: 'always is', te: 'always is' }, isCorrect: false },
        ],
        correctExplanation: {
          en: 'Correct! Frequency adverbs come after forms of the verb "to be".',
          hi: 'बिल्कुल सही! "to be" के बाद frequency adverb आता है।',
          te: 'సరిగ్గా చెప్పారు! "be" రూపాల తర్వాత frequency adverb వస్తుంది.',
        },
      },
    ],
    completionCriteria: {
      minQuestionsRequired: 2,
      minCorrectRequired: 2,
      readPrerequisiteRequired: true,
    },
  },
];

// Helper to find authentic probes for any concept or subject
export function getProbesForConcept(
  conceptId: string,
  subject?: string,
  classLevel?: string,
  conceptTitle?: string
): FollowUpProbe[] {
  if (diagnosticProbesCatalog[conceptId] && diagnosticProbesCatalog[conceptId].length > 0) {
    return diagnosticProbesCatalog[conceptId];
  }

  // Fallback by subject match if exact concept ID does not have custom probes
  const subLower = (subject || '').toLowerCase();
  const conLower = (conceptId || '').toLowerCase();

  if (conLower.includes('adv') || subLower.includes('adverb')) {
    return diagnosticProbesCatalog['con_cbse8_eng_adv_c1'] || [];
  }

  if (subLower.includes('chem') || subLower.includes('science')) {
    if (classLevel === '10') return diagnosticProbesCatalog['con_cbse10_sci_chem_c1'];
    if (classLevel === '6') return diagnosticProbesCatalog['con_cbse6_sci_c1'];
  }
  if (subLower.includes('english')) {
    if (classLevel === '10') return diagnosticProbesCatalog['con_cbse10_eng_c1'];
    return diagnosticProbesCatalog['con_cbse8_eng_adv_c1'] || diagnosticProbesCatalog['con_cbse8_eng_c1'] || [];
  }
  if (subLower.includes('physic')) {
    return diagnosticProbesCatalog['con_ts10_ps_c1'];
  }
  if (subLower.includes('math')) {
    if (conLower.includes('lin') || conLower.includes('m2')) return diagnosticProbesCatalog['con_cbse8_m2_c2'] || [];
    return diagnosticProbesCatalog['con_cbse8_m1_c3'] || [];
  }

  // Generate dynamic, authentic diagnostic follow-up probes for this specific concept
  const title = conceptTitle || conceptId.replace(/^con_/, '').replace(/_/g, ' ');
  return [
    {
      id: `probe_${conceptId}_prereq`,
      conceptId,
      subject: subject || 'General',
      question: `Diagnostic Probe 1 (Prerequisite Check): Before applying "${title}", what is the fundamental prerequisite definition or baseline identity required?`,
      testedSubSkill: `Foundational Prerequisite & Core Definition of ${title}`,
      probeType: 'PREREQUISITE',
      options: [
        `The standard governing definition and unit balance of ${title}`,
        `An inverted relationship assuming the opposite rule`,
        `Ignoring intermediate conditions and estimating directly`,
      ],
      correctAnswer: `The standard governing definition and unit balance of ${title}`,
      explanation: `Mastery of ${title} requires solid grounding in its basic definition before solving multi-step problems.`,
    },
    {
      id: `probe_${conceptId}_concept`,
      conceptId,
      subject: subject || 'General',
      question: `Diagnostic Probe 2 (Conceptual Discrimination): When solving problems in "${title}", which common distractor trap must be avoided?`,
      testedSubSkill: `Concept Trap & Misconception Avoidance in ${title}`,
      probeType: 'CONCEPTUAL',
      options: [
        `Confusing superficial symptoms with the root governing principle`,
        `Applying the approved curriculum rule step-by-step`,
        `Checking the final answer against boundary limits`,
      ],
      correctAnswer: `Confusing superficial symptoms with the root governing principle`,
      explanation: `Conceptual clarity means recognizing why distractor options fail under official curriculum standards.`,
    },
  ];
}

// Helper to determine or generate the authentic recovery activity ID
export function getRecoveryActivityIdForDiagnosis(params: {
  conceptId: string;
  subject: string;
  classLevel: string;
  board: string;
  conceptTitle?: string;
  chapterId?: string;
}): string {
  const { conceptId, subject, classLevel, board, conceptTitle, chapterId } = params;
  const subLower = (subject || '').toLowerCase();
  const conLower = (conceptId || '').toLowerCase();

  // Strict concept matching for Adverbs
  if (
    conceptId === 'con_cbse8_eng_adv_c1' ||
    conceptId === 'con_cbse8_eng_adv_c2' ||
    conLower.includes('adv') ||
    subLower.includes('adverb')
  ) {
    return 'rec_cbse8_adverbs_mastery';
  }

  if (conceptId === 'con_cbse10_sci_chem_c1' || conceptId === 'con_cbse10_sci_chem_c2' || (subLower.includes('science') && classLevel === '10')) {
    return 'rec_chem_rxn_balancing';
  }
  if (conceptId === 'con_cbse10_eng_c1' || conceptId === 'con_cbse10_eng_c2' || (subLower.includes('english') && classLevel === '10')) {
    return 'rec_eng_reported_speech';
  }
  if (conceptId === 'con_ts10_ps_c1' || conceptId === 'con_ts10_ps_c2' || (subLower.includes('physical') && classLevel === '10')) {
    return 'rec_ts10_lens_optics';
  }
  if (conceptId === 'con_cisce10_chem_c1' || (subLower.includes('chem') && classLevel === '10')) {
    return 'rec_cisce10_periodic_trends';
  }
  if (conceptId === 'con_cbse8_eng_c1' || (subLower.includes('english') && classLevel === '8')) {
    return 'rec_cbse8_active_passive';
  }
  if (conceptId === 'con_cbse6_sci_c1' || (subLower.includes('science') && classLevel === '6')) {
    return 'rec_cbse6_nutrients_diet';
  }
  if (conceptId === 'con_cbse8_m2_c2') {
    return 'rec_linear_balance_remedy';
  }
  if (conceptId === 'con_cbse8_m1_c3' || (subLower.includes('math') && classLevel === '8' && (conLower.includes('frac') || conLower.includes('m1')))) {
    return 'rec_frac_lcm_bridge';
  }

  // For any other concept, return a dedicated concept recovery ID
  return `rec_${conceptId}`;
}

/**
 * Creates a complete, rich Smart Recovery Activity for any concept:
 * Teaches the exact concept with simple explanation, worked example, key hints,
 * graduated practice (easier -> guided -> harder), and a final mastery check!
 */
export function buildDynamicRecoveryActivity(params: {
  conceptId: string;
  chapterId?: string;
  subject: string;
  board: BoardType;
  classLevel: ClassLevel;
  title?: string;
}): SmartRecoveryActivity {
  const { conceptId, chapterId, subject, board, classLevel, title } = params;
  const conceptName = title || conceptId.replace(/^con_/, '').replace(/_/g, ' ');

  return {
    id: `rec_${conceptId}`,
    conceptId,
    chapterId: chapterId || `ch_${conceptId}`,
    subject,
    board,
    classLevel,
    title: `Smart Recovery: Mastering ${conceptName}`,
    recoveryType: 'Conceptual Understanding',
    learningPathway: [
      'Simple Concept Foundation & Core Rule Explanation',
      'Worked Example with Step-by-Step Avoidance of Pitfalls',
      'Easier Foundation Practice',
      'Guided Scaffolding Practice with Hints',
      'Gradually Harder Application Drill',
      'Final Mastery Check Question',
      'Unlock Fresh Retest',
    ],
    remediationExplanation: {
      en: `Let's break down "${conceptName}" from first principles. When tackling this concept, start by identifying the governing rule, verify intermediate units or signs, and never skip foundational steps.`,
      hi: `आइए "${conceptName}" को बुनियादी सिद्धांतों से समझें। इस संकल्पना को हल करते समय सबसे पहले मूल नियम को पहचानें और मध्यवर्ती चरणों की सावधानीपूर्वक जांच करें।`,
      te: `"${conceptName}" భావనను ప్రాథమిక సూత్రాల నుండి అర్థం చేసుకుందాం. లెక్కించేటప్పుడు మూల సూత్రాన్ని గుర్తించి, దశలను క్రమబద్ధంగా పాటించండి.`,
    },
    simpleExplanation: {
      en: `In Class ${classLevel} ${subject} (${board}), "${conceptName}" represents a fundamental competency. The key idea: break every problem into 3 logical steps: (1) State given values, (2) Apply the governing formula or rule, and (3) Verify your result by substitution.`,
      hi: `कक्षा ${classLevel} ${subject} (${board}) में, "${conceptName}" एक महत्वपूर्ण संकल्पना है। मुख्य नियम: (1) दी गई जानकारी लिखें, (2) मूल सूत्र या नियम लागू करें, और (3) अपने उत्तर की दोबारा जांच करें।`,
      te: `క్లాస్ ${classLevel} ${subject} (${board}) లో, "${conceptName}" ముఖ్యమైన అంశం. ముఖ్య సూత్రం: (1) ఇచ్చిన విలువలను రాయండి, (2) సరైన సూత్రాన్ని వర్తింపజేయండి, (3) తుది సమాధానాన్ని సరిచూసుకోండి.`,
    },
    workedExample: {
      problem: {
        en: `Worked Example: Step-by-step application of "${conceptName}".`,
        hi: `हल किया गया उदाहरण: "${conceptName}" का चरण-दर-चरण अनुप्रयोग।`,
        te: `సాధించిన ఉదాహరణ: "${conceptName}" యొక్క దశలవారీ పరిష్కారం.`,
      },
      stepByStep: [
        {
          en: 'Step 1: Identify what is given and what must be found.',
          hi: 'चरण 1: पहचानें कि क्या दिया गया है और क्या ज्ञात करना है।',
          te: 'దశ 1: ఇచ్చిన వివరాలు మరియు కనుగొనవలసిన అంశాన్ని గుర్తించండి.',
        },
        {
          en: 'Step 2: Apply the governing rule without skipping intermediate transformations.',
          hi: 'चरण 2: मध्यवर्ती चरणों को छोड़े बिना मूल नियम लागू करें।',
          te: 'దశ 2: మధ్యంతర దశలను దాటవేయకుండా సూత్రాన్ని వర్తింపజేయండి.',
        },
        {
          en: 'Step 3: Check units and verify that the solution is physically/mathematically sound.',
          hi: 'चरण 3: इकाइयों की जांच करें और समाधान का सत्यापन करें।',
          te: 'దశ 3: ప్రమాణాలను సరిచూసి తుది సమాధానాన్ని ధృవీకరించండి.',
        },
      ],
      finalAnswer: 'Step-by-step verification complete',
      keyInsight: {
        en: 'Never rush through signs or units; small algebraic or conceptual slips can be easily avoided by writing each line explicitly.',
        hi: 'चिह्नों या इकाइयों में जल्दबाजी न करें; प्रत्येक चरण को स्पष्ट लिखकर गलतियों से बचा जा सकता है।',
        te: 'గుర్తులు లేదా ప్రమాణాల విషయంలో ఆత్రుత పడకండి; ప్రతి దశను స్పష్టంగా రాయడం ద్వారా తప్పులను నివారించవచ్చు.',
      },
    },
    keyHints: [
      {
        en: 'Write down the core formula before substituting values.',
        hi: 'मान रखने से पहले मुख्य सूत्र को लिखें।',
        te: 'విలువలను ప్రతిక్షేపించే ముందు అసలు సూత్రాన్ని రాయండి.',
      },
      {
        en: 'Look out for common distractor traps: inverted ratios, missing negative signs, or skipped units.',
        hi: 'सामान्य भ्रामक विकल्पों से बचें: उलटे अनुपात, छूटे हुए ऋणात्मक चिह्न या छूटी हुई इकाइयाँ।',
        te: 'తప్పు సమాధానాల ఉచ్చులలో పడకండి: విలోమ నిష్పత్తులు లేదా మైనస్ గుర్తులను గమనించండి.',
      },
    ],
    prerequisiteBridge: {
      prerequisiteTitle: `Foundations of ${subject}`,
      prerequisiteClass: classLevel === '6' ? '6' : String(Number(classLevel) - 1) as ClassLevel,
      bridgeExplanation: {
        en: `Recall your prior foundational definitions in ${subject}. Having clarity on basic terms makes "${conceptName}" much simpler to master.`,
        hi: `${subject} में अपनी पिछली बुनियादी परिभाषाओं को याद करें। बुनियादी शब्दों की स्पष्टता "${conceptName}" को समझना आसान बनाती है।`,
        te: `${subject} లోని మునుపటి ప్రాథమిక అంశాలను గుర్తుతెచ్చుకోండి. ఇది "${conceptName}" ను సులభంగా అర్థం చేసుకోవడానికి సహాయపడుతుంది.`,
      },
    },
    guidedPracticeQuestions: [
      // 1. Easier Question (Foundational)
      {
        id: `rec_${conceptId}_gq_easy`,
        difficulty: 'Foundational',
        prompt: {
          en: `Stage 1 (Easier Question): What is the core definition or starting rule for "${conceptName}"?`,
          hi: `चरण 1 (आसान प्रश्न): "${conceptName}" की मुख्य परिभाषा या प्रारंभिक नियम क्या है?`,
          te: `దశ 1 (సులభమైన ప్రశ్న): "${conceptName}" యొక్క ప్రాథమిక నిర్వచనం లేదా ప్రారంభ సూత్రం ఏది?`,
        },
        scaffoldHint: {
          en: `Focus on the foundational standard definition from the explanation above.`,
          hi: `ऊपर दिए गए स्पष्टीकरण से बुनियादी मानक परिभाषा पर ध्यान केंद्रित करें।`,
          te: `పై వివరణలోని ప్రాథమిక నిర్వచనాన్ని గుర్తుతెచ్చుకోండి.`,
        },
        stepClues: [
          {
            en: 'Recall the first rule: identify the given quantities and the governing relation.',
            hi: 'पहला नियम याद रखें: दी गई मात्राओं और शासक संबंध को पहचानें।',
            te: 'మొదటి నియమం: ఇచ్చిన విలువలను మరియు సంబంధిత సూత్రాన్ని గుర్తించండి.',
          },
        ],
        choices: [
          {
            id: 'opt1',
            text: {
              en: `Follow the standard ${board} board rule for ${conceptName}`,
              hi: `${conceptName} के लिए मानक ${board} बोर्ड नियम का पालन करें`,
              te: `${conceptName} కోసం ప్రామాణిక ${board} నిబంధనను పాటించండి`,
            },
            isCorrect: true,
          },
          {
            id: 'opt2',
            text: {
              en: `Guess randomly without verifying initial conditions`,
              hi: `शुरुआती शर्तों को सत्यापित किए बिना बेतरतीब ढंग से अनुमान लगाएं`,
              te: `పరిశీలించకుండా ఊహాగానం చేయడం`,
            },
            isCorrect: false,
          },
        ],
        correctExplanation: {
          en: `Great start! Understanding the foundational definition gives you a strong launchpad.`,
          hi: `शानदार शुरुआत! बुनियादी परिभाषा को समझना एक मजबूत आधार देता है।`,
          te: `చక్కని ప్రారంభం! ప్రాథమిక నిర్వచనం అర్థం కావడం బలమైన పునాదిని ఇస్తుంది.`,
        },
      },
      // 2. Guided Practice Question (Moderate with Hints)
      {
        id: `rec_${conceptId}_gq_guided`,
        difficulty: 'Moderate',
        prompt: {
          en: `Stage 2 (Guided Practice): In applying "${conceptName}" to a practical problem, how do you handle intermediate steps?`,
          hi: `चरण 2 (निर्देशित अभ्यास): व्यावहारिक समस्या में "${conceptName}" लागू करते समय, आप मध्यवर्ती चरणों को कैसे संभालते हैं?`,
          te: `దశ 2 (మార్గదర్శక అభ్యాసం): "${conceptName}" ను వర్తింపజేసేటప్పుడు మధ్యంతర దశలను ఎలా పూర్తి చేయాలి?`,
        },
        scaffoldHint: {
          en: `Maintain equality and verify each mathematical/physical transformation explicitly.`,
          hi: `समानता बनाए रखें और प्रत्येक गणितीय/भौतिक रूपांतरण को स्पष्ट रूप से सत्यापित करें।`,
          te: `సమతుల్యతను కాపాడుతూ ప్రతి దశను విడిగా సరిచూడండి.`,
        },
        stepClues: [
          {
            en: 'Step Clue: Check units, signs, and multipliers before moving to the next line.',
            hi: 'संकेत: अगली पंक्ति में जाने से पहले इकाइयों, चिह्नों और गुणकों की जांच करें।',
            te: 'సూచన: తదుపరి దశకు వెళ్లే ముందు ప్రమాణాలు మరియు గుర్తులను సరిచూసుకోండి.',
          },
        ],
        choices: [
          {
            id: 'opt1',
            text: {
              en: `Execute each transformation methodically and check that balance is preserved`,
              hi: `प्रत्येक रूपांतरण को व्यवस्थित रूप से निष्पादित करें और जांचें कि संतुलन बना हुआ है`,
              te: `ప్రతి దశను క్రమబద్ధంగా సాధించి సమతుల్యత దెబ్బతినకుండా చూసుకోండి`,
            },
            isCorrect: true,
          },
          {
            id: 'opt2',
            text: {
              en: `Skip writing intermediate lines to save paper`,
              hi: `कागज बचाने के लिए मध्यवर्ती पंक्तियाँ लिखना छोड़ दें`,
              te: `దశలను రాయకుండా దాటవేయడం`,
            },
            isCorrect: false,
          },
        ],
        correctExplanation: {
          en: `Spot on! Writing intermediate steps methodically eliminates careless procedural slips.`,
          hi: `बिल्कुल सही! मध्यवर्ती चरणों को व्यवस्थित रूप से लिखने से लापरवाह गलतियाँ समाप्त हो जाती हैं।`,
          te: `అద్భుతం! మధ్యంతర దశలను క్రమబద్ధంగా రాయడం వల్ల పొరపాట్లు జరగవు.`,
        },
      },
      // 3. Gradually Harder Question (Application)
      {
        id: `rec_${conceptId}_gq_harder`,
        difficulty: 'Challenging',
        prompt: {
          en: `Stage 3 (Application Drill): You are given an unfamiliar problem involving "${conceptName}". What strategy guarantees an accurate outcome?`,
          hi: `चरण 3 (अनुप्रयोग अभ्यास): आपको "${conceptName}" से संबंधित एक नई समस्या दी गई है। कौन सी रणनीति सटीक परिणाम सुनिश्चित करती है?`,
          te: `దశ 3 (అనువర్తన సాధన): "${conceptName}" తో కూడిన కొత్త సమస్యను సాధించడానికి ఏ వ్యూహం సరైన ఫలితాన్ని ఇస్తుంది?`,
        },
        scaffoldHint: {
          en: `Translate the word description into governing equations and test edge cases.`,
          hi: `शाब्दिक विवरण को समीकरणों में बदलें और जांच करें।`,
          te: `సమస్యను సమీకరణాలుగా మార్చి నిరూపించండి.`,
        },
        stepClues: [
          {
            en: 'Use reverse reasoning to double check: does the final answer make sense in context?',
            hi: 'पुष्टि के लिए विपरीत तर्क का उपयोग करें: क्या अंतिम उत्तर संदर्भ में सही बैठता है?',
            te: 'తుది సమాధానం సహేతుకంగా ఉందో లేదో సరిచూసుకోండి.',
          },
        ],
        choices: [
          {
            id: 'opt1',
            text: {
              en: `Formulate the relationship rigorously, solve step-by-step, and verify by substitution`,
              hi: `संबंध को स्पष्ट रूप से तैयार करें, चरण-दर-चरण हल करें, और प्रतिस्थापन द्वारा पुष्टि करें`,
              te: `సంబంధాన్ని స్పష్టంగా రూపొందించి, దశలవారీగా సాధించి, తిరిగి ప్రతిక్షేపించి ధృవీకరించండి`,
            },
            isCorrect: true,
          },
          {
            id: 'opt2',
            text: {
              en: `Pick the largest number among options without calculating`,
              hi: `गणना किए बिना विकल्पों में से सबसे बड़ी संख्या चुनें`,
              te: `లెక్కించకుండా పెద్ద సంఖ్యను ఎంపిక చేయడం`,
            },
            isCorrect: false,
          },
        ],
        correctExplanation: {
          en: `Excellent! You applied rigorous problem-solving logic to master this concept.`,
          hi: `उत्कृष्ट! आपने इस संकल्पना में महारत हासिल करने के लिए सटीक समस्या-समाधान तर्क लागू किया।`,
          te: `చాలా బాగుంది! ఈ అంశంపై పట్టు సాధించడానికి సరైన తార్కిక విధానాన్ని ఉపయోగించారు.`,
        },
      },
    ],
    // 4. Final Mastery Check Question
    masteryCheckQuestion: {
      id: `rec_${conceptId}_mastery_check`,
      difficulty: 'Application',
      prompt: {
        en: `Stage 4 (Mastery Check): To confirm your complete concept recovery for "${conceptName}", which statement summarizes the core principle?`,
        hi: `चरण 4 (महारत जांच): "${conceptName}" के पूर्ण सुधार की पुष्टि करने के लिए, कौन सा कथन मूल सिद्धांत का सारांश देता है?`,
        te: `దశ 4 (పట్టు నిర్ధారణ): "${conceptName}" లో మీ పరిపూర్ణ అభివృద్ధిని ధృవీకరించడానికి ఏ వాక్యం సరైనది?`,
      },
      scaffoldHint: {
        en: `Combine all three rules you practiced above into the final mastery summary.`,
        hi: `ऊपर अभ्यास किए गए सभी नियमों को अंतिम सारांश में संयोजित करें।`,
        te: `పై మూడు దశలలో నేర్చుకున్న సూత్రాలను గుర్తుచేసుకోండి.`,
      },
      choices: [
        {
          id: 'opt1',
          text: {
            en: `The concept requires strict adherence to governing rules, preserving balance, and verifying final outcomes`,
            hi: `इस संकल्पना में मूल नियमों का कड़ाई से पालन, संतुलन बनाए रखना और अंतिम परिणामों का सत्यापन आवश्यक है`,
            te: `నిబంధనలను ఖచ్చితంగా పాటించడం, సమతుల్యతను కాపాడటం మరియు ఫలితాలను సరిచూసుకోవడం ఈ భావన యొక్క ముఖ్య ఉద్దేశం`,
          },
          isCorrect: true,
        },
        {
          id: 'opt2',
          text: {
            en: `The concept can be bypassed with random trial-and-error alone`,
            hi: `इस संकल्पना को केवल तुक्केबाजी से हल किया जा सकता है`,
            te: `ఈ భావనను కేవలం అంచనాలతో సాధించవచ్చు`,
          },
          isCorrect: false,
        },
      ],
      correctExplanation: {
        en: `Mastery Verified! You have completed all 4 recovery stages. Your fresh retest is now unlocked!`,
        hi: `महारत सत्यापित! आपने सभी 4 सुधार चरण पूरे कर लिए हैं। आपका नया रीटेस्ट अब अनलॉक हो गया है!`,
        te: `పట్టు నిరూపితమైంది! మీరు 4 దశలను పూర్తి చేశారు. మీ తాజా రీటెస్ట్ ఇప్పుడు అన్‌లాక్ చేయబడింది!`,
      },
    },
    completionCriteria: {
      minQuestionsRequired: 2,
      minCorrectRequired: 2,
      readPrerequisiteRequired: true,
    },
  };
}

