/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from './types.js';

export const expandedQuestionBank: Question[] = [
  // ==========================================
  // CBSE CLASS 10 - SCIENCE: Chemical Reactions & Equations
  // ==========================================
  {
    id: 'q_cbse10_sci_chem_01',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 50,
    prompt: {
      en: 'Which of the following represents the correct balanced equation for the reaction of iron with steam to form iron(II,III) oxide and hydrogen gas?',
      hi: 'लोहे की भाप के साथ अभिक्रिया होकर आयरन(II,III) ऑक्साइड और हाइड्रोजन गैस बनने की सही संतुलित समीकरण कौन सी है?',
      te: 'ఇనుము నీటి ఆవిరితో చర్య జరిపి ఐరన్(II,III) ఆక్సైడ్ మరియు హైడ్రోజన్ వాయువును ఏర్పరిచే సరైన తుల్య సమీకరణం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: '3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)',
          hi: '3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)',
          te: '3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Fe(s) + H2O(g) -> FeO(s) + H2(g)',
          hi: 'Fe(s) + H2O(g) -> FeO(s) + H2(g)',
          te: 'Fe(s) + H2O(g) -> FeO(s) + H2(g)',
        },
        misconceptionTag: 'INCORRECT_OXIDE_STOICHIOMETRY',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: '2Fe(s) + 3H2O(g) -> Fe2O3(s) + 3H2(g)',
          hi: '2Fe(s) + 3H2O(g) -> Fe2O3(s) + 3H2(g)',
          te: '2Fe(s) + 3H2O(g) -> Fe2O3(s) + 3H2(g)',
        },
        misconceptionTag: 'CONFUSED_RUST_FORMULA_WITH_STEAM_REACTION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: '3Fe(s) + 2H2O(g) -> Fe3O2(s) + 2H2(g)',
          hi: '3Fe(s) + 2H2O(g) -> Fe3O2(s) + 2H2(g)',
          te: '3Fe(s) + 2H2O(g) -> Fe3O2(s) + 2H2(g)',
        },
        misconceptionTag: 'UNBALANCED_OXYGEN_ATOMS',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Steam reacts with red-hot iron to produce magnetic oxide of iron Fe3O4: 3 Fe + 4 H2O -> Fe3O4 + 4 H2. There are 3 Fe, 8 H, and 4 O on both sides.',
      hi: 'भाप लाल तप्त लोहे से अभिक्रिया कर Fe3O4 (मैग्नेटिक ऑक्साइड) बनाती है: 3Fe + 4H2O -> Fe3O4 + 4H2।',
      te: 'ఎర్రగా కాలిన ఇనుము ఆవిరితో చర్య పొంది అయస్కాంత ఆక్సైడ్ Fe3O4 ను ఏర్పరుస్తుంది: 3Fe + 4H2O -> Fe3O4 + 4H2.',
    },
    hint: {
      en: 'Count oxygen atoms: Fe3O4 has 4 oxygen atoms, requiring 4 molecules of H2O on the reactant side.',
      hi: 'ऑक्सीजन परमाणुओं की गणना करें: Fe3O4 में 4 ऑक्सीजन होते हैं, इसलिए अभिकारक में 4 H2O की आवश्यकता है।',
      te: 'ఆక్సిజన్ పరమాణువులను లెక్కించండి: Fe3O4 లో 4 ఆక్సిజన్లు ఉంటాయి, కాబట్టి 4 H2O అణువులు కావాలి.',
    },
    misconceptionTags: ['INCORRECT_OXIDE_STOICHIOMETRY', 'UNBALANCED_OXYGEN_ATOMS'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse10_sci_chem_02',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c2',
    difficulty: 'Moderate',
    cognitiveSkill: 'Conceptual',
    expectedSolvingTimeSeconds: 65,
    questionType: 'mcq',
    prompt: {
      en: 'In the reaction: CuO(s) + H2(g) -> Cu(s) + H2O(l), which substance undergoes reduction and acts as the oxidizing agent?',
      hi: 'अभिक्रिया CuO(s) + H2(g) -> Cu(s) + H2O(l) में, किस पदार्थ का अपचयन (reduction) होता है और वह ऑक्सीकारक का कार्य करता है?',
      te: 'CuO(s) + H2(g) -> Cu(s) + H2O(l) చర్యలో, ఏ పదార్థం క్షయకరణం చెంది ఆక్సీకరణిగా పనిచేస్తుంది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'CuO is reduced to Cu and acts as the oxidizing agent',
          hi: 'CuO का Cu में अपचयन होता है और यह ऑक्सीकारक है',
          te: 'CuO కాపర్‌గా క్షయకరణం చెందుతుంది మరియు ఆక్సీకరణిగా పనిచేస్తుంది',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'H2 is reduced and acts as the reducing agent',
          hi: 'H2 का अपचयन होता है और यह अपचायक है',
          te: 'H2 క్షయకరణం చెంది క్షయకారిగా పనిచేస్తుంది',
        },
        misconceptionTag: 'CONFUSED_OXIDATION_WITH_REDUCTION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Cu is oxidized to CuO',
          hi: 'Cu का CuO में ऑक्सीकरण होता है',
          te: 'Cu కాస్తా CuO గా ఆక్సీకరణం చెందుతుంది',
        },
        misconceptionTag: 'FLIPPED_REACTANTS_AND_PRODUCTS',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'H2O is the oxidizing agent',
          hi: 'H2O ऑक्सीकारक है',
          te: 'H2O ఆక్సీకరణి',
        },
        misconceptionTag: 'CONFUSED_PRODUCT_WITH_AGENT',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'CuO loses oxygen to become Cu; loss of oxygen is reduction. The substance that provides oxygen (CuO) is the oxidizing agent.',
      hi: 'CuO से ऑक्सीजन हटती है, इसलिए इसका अपचयन होता है। जो ऑक्सीजन प्रदान करता है वह ऑक्सीकारक (CuO) कहलाता है।',
      te: 'CuO ఆక్సిజన్‌ను కోల్పోయి Cu గా మారుతుంది, కావున ఇది క్షయకరణం. ఆక్సిజన్‌ను ఇచ్చేది ఆక్సీకరణి (CuO).',
    },
    hint: {
      en: 'Loss of oxygen is reduction. The reactant being reduced is the oxidizing agent.',
      hi: 'ऑक्सीजन का ह्रास अपचयन है। जिस पदार्थ का अपचयन होता है वह ऑक्सीकारक होता है।',
      te: 'ఆక్సిజన్ కోల్పోవడం క్షయకరణం. క్షయకరణం చెందిన పదార్థమే ఆక్సీకరణి.',
    },
    misconceptionTags: ['CONFUSED_OXIDATION_WITH_REDUCTION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Dedicated Fresh Retest Question for CBSE Class 10 Science
  {
    id: 'q_cbse10_retest_sci_chem_01',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 70,
    questionType: 'mcq',
    prompt: {
      en: 'When lead(II) nitrate crystals are heated in a dry test tube, a brown gas and a yellow residue are observed. Identify the brown gas and the balanced coefficient of NO2 in the thermal decomposition reaction.',
      hi: 'जब लेड(II) नाइट्रेट को शुष्क परखनली में गर्म किया जाता है, तो भूरे रंग की गैस और पीला अवशेष मिलता है। भूरी गैस और संतुलित समीकरण में NO2 का गुणांक पहचानें।',
      te: 'లెడ్ నైట్రేట్‌ను వేడి చేసినప్పుడు గోధుమ రంగు వాయువు మరియు పసుపు అవశేషం ఏర్పడతాయి. ఆ గోధుమ రంగు వాయువు మరియు NO2 తుల్య గుణకాన్ని గుర్తించండి.',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Nitrogen dioxide (NO2), coefficient is 4 [2Pb(NO3)2 -> 2PbO + 4NO2 + O2]',
          hi: 'नाइट्रोजन डाइऑक्साइड (NO2), गुणांक 4 है [2Pb(NO3)2 -> 2PbO + 4NO2 + O2]',
          te: 'నైట్రోజన్ డై ఆక్సైడ్ (NO2), గుణకం 4 [2Pb(NO3)2 -> 2PbO + 4NO2 + O2]',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Nitrogen monoxide (NO), coefficient is 2',
          hi: 'नाइट्रोजन मोनोऑक्साइड (NO), गुणांक 2 है',
          te: 'నైట్రోజన్ మోనాక్సైడ్ (NO), గుణకం 2',
        },
        misconceptionTag: 'CONFUSED_NO_WITH_NO2',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Dinitrogen pentoxide (N2O5), coefficient is 1',
          hi: 'डाइनाइट्रोजन पेंटाऑक्साइड (N2O5), गुणांक 1 है',
          te: 'డైనైట్రోజన్ పెంటాక్సైడ్, గుణకం 1',
        },
        misconceptionTag: 'INCORRECT_OXIDE_SPECIES',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Oxygen gas (O2), coefficient is 4',
          hi: 'ऑक्सीजन गैस (O2), गुणांक 4 है',
          te: 'ఆక్సిజన్ వాయువు, గుణకం 4',
        },
        misconceptionTag: 'ATTRIBUTED_BROWN_FUMES_TO_OXYGEN',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Thermal decomposition of lead nitrate: 2Pb(NO3)2(s) -> 2PbO(s) + 4NO2(g) + O2(g). The brown fumes are Nitrogen dioxide (NO2) with coefficient 4.',
      hi: 'लेड नाइट्रेट का ऊष्मीय अपघटन: 2Pb(NO3)2 -> 2PbO (पीला) + 4NO2 (भूरी गैस) + O2।',
      te: 'లెడ్ నైట్రేట్ ఉష్ణ వియోగం: 2Pb(NO3)2 -> 2PbO (పసుపు) + 4NO2 (గోధుమ పొగలు) + O2.',
    },
    hint: {
      en: 'The balanced equation has 2 formula units of lead nitrate yielding 4 units of the brown gas.',
      hi: 'संतुलित समीकरण में 2 लेड नाइट्रेट अणु 4 भूरी गैस के अणु बनाते हैं।',
      te: 'తుల్య సమీకరణంలో 2 లెడ్ నైట్రేట్ యూనిట్ల నుండి 4 యూనిట్ల గోధుమ వాయువు విడుదలవుతుంది.',
    },
    misconceptionTags: ['CONFUSED_NO_WITH_NO2'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 10 - ENGLISH: Reported Speech & Subject-Verb Concord
  // ==========================================
  {
    id: 'q_cbse10_eng_rep_01',
    board: 'CBSE',
    classLevel: '10',
    subject: 'English',
    chapterId: 'ch_cbse10_eng_grammar',
    conceptId: 'con_cbse10_eng_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 60,
    questionType: 'mcq',
    prompt: {
      en: 'Convert to indirect speech: The teacher said to Rohan, "Why were you absent during the laboratory practical yesterday?"',
      hi: 'परोक्ष कथन (Indirect Speech) में बदलें: The teacher said to Rohan, "Why were you absent during the laboratory practical yesterday?"',
      te: 'పరోక్ష వాక్యంగా మార్చండి: The teacher said to Rohan, "Why were you absent during the laboratory practical yesterday?"',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'The teacher asked Rohan why he had been absent during the laboratory practical the previous day.',
          hi: 'The teacher asked Rohan why he had been absent during the laboratory practical the previous day.',
          te: 'The teacher asked Rohan why he had been absent during the laboratory practical the previous day.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The teacher asked Rohan that why was he absent during the laboratory practical yesterday.',
          hi: 'The teacher asked Rohan that why was he absent during the laboratory practical yesterday.',
          te: 'The teacher asked Rohan that why was he absent during the laboratory practical yesterday.',
        },
        misconceptionTag: 'USED_THAT_BEFORE_WH_QUESTION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The teacher inquired Rohan why he was absent during the laboratory practical yesterday.',
          hi: 'The teacher inquired Rohan why he was absent during the laboratory practical yesterday.',
          te: 'The teacher inquired Rohan why he was absent during the laboratory practical yesterday.',
        },
        misconceptionTag: 'FAILED_PAST_TENSE_BACKSHIFT_AND_TIME_ADVERB',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'The teacher told Rohan why had he been absent during the laboratory practical tomorrow.',
          hi: 'The teacher told Rohan why had he been absent during the laboratory practical tomorrow.',
          te: 'The teacher told Rohan why had he been absent during the laboratory practical tomorrow.',
        },
        misconceptionTag: 'INVERTED_QUESTION_WORD_ORDER',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Rules: (1) "said to" -> "asked", (2) No "that" before wh-words, (3) Simple past ("were") backshifts to past perfect ("had been"), (4) Subject precedes verb ("he had been", not "had he been"), (5) "yesterday" becomes "the previous day".',
      hi: 'नियम: wh-प्रश्नों में that नहीं लगता; past tense ("were") past perfect ("had been") में बदलता है; yesterday -> the previous day.',
      te: 'నియమాలు: Wh-ప్రశ్నల్లో that రాదు; Simple past కాస్తా past perfect (had been) గా మారుతుంది; yesterday -> the previous day.',
    },
    hint: {
      en: 'Remember: In reported questions, do not use "that" before "why", and change simple past "were" to past perfect "had been".',
      hi: 'याद रखें: wh-प्रश्नों के साथ that नहीं आता और yesterday का the previous day बनता है।',
      te: 'wh-పదాల ముందు that ఉపయోగించకూడదు, were కాస్తా had been అవుతుంది.',
    },
    misconceptionTags: ['USED_THAT_BEFORE_WH_QUESTION', 'FAILED_PAST_TENSE_BACKSHIFT_AND_TIME_ADVERB'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Dedicated Retest Question for CBSE Class 10 English
  {
    id: 'q_cbse10_retest_eng_rep_01',
    board: 'CBSE',
    classLevel: '10',
    subject: 'English',
    chapterId: 'ch_cbse10_eng_grammar',
    conceptId: 'con_cbse10_eng_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 55,
    questionType: 'mcq',
    prompt: {
      en: 'Select the correct indirect version: Maya said, "I have completed all my assignments tonight."',
      hi: 'सही परोक्ष कथन चुनें: Maya said, "I have completed all my assignments tonight."',
      te: 'సరైన పరోక్ష వాక్యాన్ని ఎంచుకోండి: Maya said, "I have completed all my assignments tonight."',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Maya said that she had completed all her assignments that night.',
          hi: 'Maya said that she had completed all her assignments that night.',
          te: 'Maya said that she had completed all her assignments that night.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Maya said that she has completed all her assignments tonight.',
          hi: 'Maya said that she has completed all her assignments tonight.',
          te: 'Maya said that she has completed all her assignments tonight.',
        },
        misconceptionTag: 'FAILED_PRESENT_PERFECT_BACKSHIFT',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Maya said she had completed all my assignments that night.',
          hi: 'Maya said she had completed all my assignments that night.',
          te: 'Maya said she had completed all my assignments that night.',
        },
        misconceptionTag: 'PRONOUN_PERSON_UNCHANGED',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Maya told that she had completed all her assignments yesterday.',
          hi: 'Maya told that she had completed all her assignments yesterday.',
          te: 'Maya told that she had completed all her assignments yesterday.',
        },
        misconceptionTag: 'TOLD_WITHOUT_OBJECT_ERROR',
        isCorrect: false,
      },
    ],
    explanation: {
      en: '"have completed" changes to "had completed", pronoun "I" and "my" change to "she" and "her", and "tonight" transforms into "that night".',
      hi: 'वर्तमान पूर्ण (have completed) भूतकाल पूर्ण (had completed) में बदलता है, tonight -> that night.',
      te: 'have completed కాస్తా had completed గా మారుతుంది, tonight కాస్తా that night గా మారుతుంది.',
    },
    hint: {
      en: 'Shift present perfect to past perfect, and replace "tonight" with "that night".',
      hi: 'have completed को had completed में बदलें और tonight को that night में।',
      te: 'have completed ను had completed గాను, tonight ను that night గాను మార్చండి.',
    },
    misconceptionTags: ['FAILED_PRESENT_PERFECT_BACKSHIFT', 'PRONOUN_PERSON_UNCHANGED'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // TELANGANA SSC CLASS 10 - PHYSICAL SCIENCE: Refraction at Curved Surfaces
  // ==========================================
  {
    id: 'q_ts10_ps_lens_01',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 80,
    questionType: 'mcq',
    prompt: {
      en: 'A convex lens has a focal length of f = +15 cm. An object is placed at a distance of u = -30 cm in front of the lens. What is the image distance (v) and nature of the image formed?',
      hi: 'एक उत्तल लेंस की फोकस दूरी f = +15 cm है। एक वस्तु लेंस के सामने u = -30 cm पर रखी गई है। प्रतिबिंब की दूरी (v) और प्रकृति क्या है?',
      te: 'ఒక కుంభాకార కటకం నాభ్యాంతరం f = +15 cm. ఒక వస్తువును కటకం ముందు u = -30 cm దూరంలో ఉంచారు. ప్రతిబింబ దూరం (v) మరియు ప్రతిబింబ స్వభావం ఏమిటి?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'v = +30 cm; Real, inverted and same size as the object',
          hi: 'v = +30 cm; वास्तविक, उल्टा और वस्तु के समान आकार का',
          te: 'v = +30 cm; నిజమైన, తలక్రిందులైన మరియు వస్తువుతో సమాన పరిమాణం గల ప్రతిబింబం',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'v = -10 cm; Virtual, erect and diminished',
          hi: 'v = -10 cm; आभासी, सीधा और छोटा',
          te: 'v = -10 cm; మిధ్యా, నిటారైన మరియు చిన్నది',
        },
        misconceptionTag: 'CONFUSED_MIRROR_AND_LENS_FORMULA_SIGNS',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'v = +10 cm; Real, inverted and diminished',
          hi: 'v = +10 cm; वास्तविक, उल्टा और छोटा',
          te: 'v = +10 cm; నిజమైన, తలక్రిందులైన మరియు చిన్నది',
        },
        misconceptionTag: 'SIGN_ERROR_IN_RECIPROCAL_SUBTRACTION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'v = infinity; Focused at infinity',
          hi: 'v = अनंत; अनंत पर केंद्रित',
          te: 'v = అనంతం',
        },
        misconceptionTag: 'CONFUSED_2F_WITH_FOCUS_POSITION',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Lens formula: 1/f = 1/v - 1/u => 1/15 = 1/v - 1/(-30) => 1/15 = 1/v + 1/30 => 1/v = 1/15 - 1/30 = 1/30 => v = +30 cm. Since object is at 2F (30 cm = 2 x 15 cm), image is real, inverted, and of the same size at 2F on the other side.',
      hi: 'लेंस सूत्र: 1/f = 1/v - 1/u => 1/15 = 1/v + 1/30 => 1/v = 1/30 => v = +30 cm। वस्तु 2F पर होने से प्रतिबिंब भी 2F पर बराबर आकार का बनता है।',
      te: 'కటక సూత్రం: 1/f = 1/v - 1/u => 1/15 = 1/v + 1/30 => 1/v = 1/30 => v = +30 cm. వస్తువు 2F వద్ద ఉంది కాబట్టి సమాన పరిమాణంగల నిజ ప్రతిబింబం ఏర్పడుతుంది.',
    },
    hint: {
      en: 'Use lens formula 1/f = 1/v - 1/u. Note that object distance u is negative according to Cartesian sign convention.',
      hi: 'लेंस सूत्र 1/f = 1/v - 1/u का प्रयोग करें। u ऋणात्मक (-30 cm) लिया जाता है।',
      te: 'కటక సూత్రం 1/f = 1/v - 1/u ను ఉపయోగించండి. కార్టీసియన్ సంప్రదాయం ప్రకారం u = -30 cm.',
    },
    misconceptionTags: ['CONFUSED_MIRROR_AND_LENS_FORMULA_SIGNS', 'SIGN_ERROR_IN_RECIPROCAL_SUBTRACTION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Dedicated Retest Question for Telangana SSC Class 10 Physical Science
  {
    id: 'q_ts10_retest_ps_lens_01',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 75,
    questionType: 'mcq',
    prompt: {
      en: 'A student uses a magnifying glass (convex lens) to read small print. If the focal length is 10 cm and the paper is placed at 5 cm from the optical center, where is the image formed and what is its nature?',
      hi: 'एक छात्र छोटे अक्षरों को पढ़ने के लिए 10 cm फोकस दूरी वाले उत्तल लेंस का उपयोग करता है। यदि कागज़ लेंस से 5 cm की दूरी पर है, तो प्रतिबिंब कहाँ और कैसा बनेगा?',
      te: 'ఒక విద్యార్థి చిన్న అక్షరాలను చదవడానికి 10 cm నాభ్యాంతరం గల భూతద్దాన్ని ఉపయోగిస్తున్నాడు. కాగితాన్ని కటకం నుండి 5 cm దూరంలో ఉంచితే, ప్రతిబింబం ఎక్కడ మరియు ఎలా ఏర్పడుతుంది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'v = -10 cm (same side as paper); Virtual, erect and magnified',
          hi: 'v = -10 cm (कागज़ की तरफ ही); आभासी, सीधा और बड़ा (आवर्धित)',
          te: 'v = -10 cm (కాగితం వైపే); మిధ్యా, నిటారైన మరియు పెద్దది (ఆవర్ధనం)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'v = +10 cm (opposite side); Real and inverted',
          hi: 'v = +10 cm (दूसरी तरफ); वास्तविक और उल्टा',
          te: 'v = +10 cm (ఎదురుగా); నిజమైన మరియు తలక్రిందులు',
        },
        misconceptionTag: 'FAILED_TO_IDENTIFY_VIRTUAL_MAGNIFIER_CASE',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'v = -3.33 cm; Diminished virtual image',
          hi: 'v = -3.33 cm; छोटा आभासी प्रतिबिंब',
          te: 'v = -3.33 cm; చిన్న మిధ్యా ప్రతిబింబం',
        },
        misconceptionTag: 'USED_ADDITION_INSTEAD_OF_SUBTRACTION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'v = +5 cm; Inverted image',
          hi: 'v = +5 cm; उल्टा प्रतिबिंब',
          te: 'v = +5 cm; తలక్రిందులు',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: '1/f = 1/v - 1/u => 1/10 = 1/v - 1/(-5) => 1/10 = 1/v + 1/5 => 1/v = 1/10 - 2/10 = -1/10 => v = -10 cm. When object is between optical center and focus (u < f), the lens forms a virtual, erect, and magnified image on the same side.',
      hi: '1/v = 1/10 - 1/5 = -1/10 => v = -10 cm। जब वस्तु F और O के बीच होती है, तो आभासी, सीधा और आवर्धित प्रतिबिंब बनता है।',
      te: '1/v = 1/10 - 1/5 = -1/10 => v = -10 cm. వస్తువు కటక కేంద్రం మరియు నాభి మధ్య ఉన్నప్పుడు పెద్దదైన మిధ్యా ప్రతిబింబం ఏర్పడుతుంది.',
    },
    hint: {
      en: 'When object is inside focal point (u < f), 1/v becomes negative, indicating an erect virtual image on the same side.',
      hi: 'जब वस्तु फोकस के अंदर होती है (u < f), प्रतिबिंब आभासी और सीधा बनता है।',
      te: 'వస్తువు నాభి లోపల ఉన్నప్పుడు (u < f), మిధ్యా ప్రతిబింబం ఏర్పడుతుంది.',
    },
    misconceptionTags: ['FAILED_TO_IDENTIFY_VIRTUAL_MAGNIFIER_CASE'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CISCE (ICSE) CLASS 10 - CHEMISTRY: Periodic Properties
  // ==========================================
  {
    id: 'q_cisce10_chem_per_01',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Conceptual',
    expectedSolvingTimeSeconds: 55,
    questionType: 'mcq',
    prompt: {
      en: 'Across Period 3 from Sodium (Na) to Chlorine (Cl), why does atomic radius consistently decrease despite having additional electrons?',
      hi: 'आवर्त 3 में सोडियम (Na) से क्लोरीन (Cl) की ओर जाने पर अतिरिक्त इलेक्ट्रॉन होने के बावजूद परमाणु त्रिज्या लगातार क्यों घटती है?',
      te: 'ఆవర్తనం 3 లో సోడియం (Na) నుండి క్లోరిన్ (Cl) వైపు వెళ్లేటప్పుడు అదనపు ఎలక్ట్రాన్లు ఉన్నప్పటికీ పరమాణు వ్యాసార్థం ఎందుకు తగ్గుతుంది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Effective nuclear charge increases while electrons are added to the same outermost energy shell (n=3)',
          hi: 'प्रभावी नाभिकीय आवेश बढ़ता है जबकि इलेक्ट्रॉन उसी बाह्यतम कोश (n=3) में जुड़ते हैं',
          te: 'ఎలక్ట్రాన్లు ఒకే బాహ్య కర్పరంలో (n=3) చేరుతుండగా, ప్రభావవంతమైన కేంద్రక ఆవేశం (Z_eff) పెరుగుతుంది',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The number of electron shells decreases from 3 to 1',
          hi: 'कोशों की संख्या 3 से घटकर 1 हो जाती है',
          te: 'కర్పరాల సంఖ్య 3 నుండి 1 కి తగ్గుతుంది',
        },
        misconceptionTag: 'CONFUSED_SHELL_COUNT_ACROSS_PERIOD',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Screening / shielding effect increases dramatically across the period',
          hi: 'आवर्त में परिरक्षण प्रभाव अत्यधिक बढ़ जाता है',
          te: 'షీల్డింగ్ ప్రభావం విపరీతంగా పెరుగుతుంది',
        },
        misconceptionTag: 'INCORRECT_SHIELDING_TREND',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Electronegativity decreases, causing the atom to shrink',
          hi: 'विद्युतऋणात्मकता घटती है जिससे परमाणु सिकुड़ता है',
          te: 'ఋణవిద్యుదాత్మకత తగ్గడం వల్ల',
        },
        misconceptionTag: 'FLIPPED_ELECTRONEGATIVITY_TREND',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Across a period, nuclear charge (Z) increases by +1 proton per step, while electrons enter the same principal quantum shell (n=3). Hence, screening remains almost constant while effective nuclear pull Z_eff increases, pulling electrons inward.',
      hi: 'आवर्त में प्रोटॉनों की संख्या बढ़ने से प्रभावी नाभिकीय आवेश बढ़ता है, जबकि मुख्य कोश समान रहता है, जिससे इलेक्ट्रॉन नाभिक की ओर खिंचते हैं।',
      te: 'ఒక పీరియడ్‌లో కేంద్రక ఆవేశం పెరుగుతుంది, కానీ ఎలక్ట్రాన్లు ఒకే కర్పరంలో చేరుతాయి. కాబట్టి ఆకర్షణ బలం పెరిగి వ్యాసార్థం తగ్గుతుంది.',
    },
    hint: {
      en: 'Do all Period 3 elements have the same number of shells? Yes (3 shells). What pulls the outer electrons closer?',
      hi: 'क्या सभी आवर्त 3 तत्वों में कोशों की संख्या समान होती है? हाँ। तो बाहरी इलेक्ट्रॉनों को कौन पास खींचता है?',
      te: 'పీరియడ్ 3 లోని మూలకాలన్నింటికీ కర్పరాల సంఖ్య సమానమే కదా! మరి ఎలక్ట్రాన్లను లోపలికి లాగేది ఏది?',
    },
    misconceptionTags: ['CONFUSED_SHELL_COUNT_ACROSS_PERIOD', 'INCORRECT_SHIELDING_TREND'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Dedicated Retest Question for CISCE Class 10 Chemistry
  {
    id: 'q_cisce10_retest_chem_per_01',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 60,
    questionType: 'mcq',
    prompt: {
      en: 'Which of the following elements has the highest first ionization potential (IP)? Li (Z=3), Be (Z=4), B (Z=5), or C (Z=6)?',
      hi: 'निम्नलिखित में से किस तत्व की प्रथम आयनन ऊर्जा (IP) सर्वाधिक है? Li (Z=3), Be (Z=4), B (Z=5), या C (Z=6)?',
      te: 'కింది వాటిలో గరిష్ట ప్రథమ అయనీకరణ శక్మం (IP) కలిగిన మూలకం ఏది? Li, Be, B, లేదా C?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Carbon (C) - highest nuclear pull and smallest radius among these',
          hi: 'कार्बन (C) - इनमें सर्वाधिक नाभिकीय खिंचाव और सबसे छोटी त्रिज्या',
          te: 'కార్బన్ (C) - వీటిలో గరిష్ట కేంద్రక ఆకర్షణ మరియు అతిచిన్న వ్యాసార్థం కలది',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Lithium (Li) - lowest atomic number',
          hi: 'लिथियम (Li) - न्यूनतम परमाणु संख्या',
          te: 'లిథియం (Li)',
        },
        misconceptionTag: 'CONFUSED_METALLIC_REACTIVITY_WITH_IP',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Boron (B)',
          hi: 'बोरॉन (B)',
          te: 'బోరాన్ (B)',
        },
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'All have exactly equal ionization energy because they belong to the same period',
          hi: 'सभी की आयनन ऊर्जा समान है क्योंकि वे एक ही आवर्त के हैं',
          te: 'ఒకే పీరియడ్ లో ఉన్నందున అందరికీ సమానమే',
        },
        misconceptionTag: 'BELIEVED_PERIOD_MEMBERS_HAVE_CONSTANT_IP',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Ionization energy generally increases across a period from left to right due to increased effective nuclear charge and smaller atomic size. Carbon has the highest IP among Li, Be, B, and C.',
      hi: 'आवर्त में बाएं से दाएं जाने पर प्रभावी नाभिकीय आवेश बढ़ने और आकार घटने के कारण आयनन ऊर्जा बढ़ती है। अतः कार्बन (C) की IP सर्वाधिक है।',
      te: 'పీరియడ్‌లో ఎడమ నుండి కుడికి వెళ్లేకొద్దీ పరమాణు పరిమాణం తగ్గి కేంద్రక ఆకర్షణ పెరగడం వల్ల అయనీకరణ శక్మం పెరుగుతుంది. కాబట్టి కార్బన్ కి అత్యధికం.',
    },
    hint: {
      en: 'Ionization energy measures the energy needed to remove an electron. Smaller atoms hold electrons much more tightly.',
      hi: 'आयनन ऊर्जा इलेक्ट्रॉन निकालने हेतु आवश्यक ऊर्जा है। छोटे परमाणु इलेक्ट्रॉनों को अधिक दृढ़ता से पकड़ते हैं।',
      te: 'అయనీకరణ శక్మం అంటే ఎలక్ట్రాన్‌ను తొలగించడానికి అవసరమైన శక్తి. చిన్న పరమాణువులు ఎలక్ట్రాన్లను గట్టిగా పట్టి ఉంచుతాయి.',
    },
    misconceptionTags: ['CONFUSED_METALLIC_REACTIVITY_WITH_IP'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 8 - ENGLISH: Active and Passive Voice
  // ==========================================
  {
    id: 'q_cbse8_eng_voice_01',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_tenses',
    conceptId: 'con_cbse8_eng_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Procedural',
    expectedSolvingTimeSeconds: 45,
    questionType: 'mcq',
    prompt: {
      en: 'Convert to passive voice: "The architect designed this award-winning eco-friendly library."',
      hi: 'कर्मवाच्य (Passive voice) में बदलें: "The architect designed this award-winning eco-friendly library."',
      te: 'పాసివ్ వాయిస్‌లోకి మార్చండి: "The architect designed this award-winning eco-friendly library."',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'This award-winning eco-friendly library was designed by the architect.',
          hi: 'This award-winning eco-friendly library was designed by the architect.',
          te: 'This award-winning eco-friendly library was designed by the architect.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'This award-winning eco-friendly library is designed by the architect.',
          hi: 'This award-winning eco-friendly library is designed by the architect.',
          te: 'This award-winning eco-friendly library is designed by the architect.',
        },
        misconceptionTag: 'CHANGED_PAST_TENSE_TO_PRESENT_IN_PASSIVE',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The architect was designed by this award-winning eco-friendly library.',
          hi: 'The architect was designed by this award-winning eco-friendly library.',
          te: 'The architect was designed by this award-winning eco-friendly library.',
        },
        misconceptionTag: 'INVERTED_AGENT_AND_OBJECT',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'This award-winning eco-friendly library had been designed by the architect.',
          hi: 'This award-winning eco-friendly library had been designed by the architect.',
          te: 'This award-winning eco-friendly library had been designed by the architect.',
        },
        misconceptionTag: 'UNNECESSARY_TENSE_SHIFT_TO_PAST_PERFECT',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Active sentence is in simple past ("designed"). Passive form for simple past is was/were + V3 ("was designed"). The object "This award-winning eco-friendly library" becomes the new subject.',
      hi: 'Active वाक्य simple past में है, इसलिए passive में was/were + V3 ("was designed") आएगा।',
      te: 'వాక్యం simple past లో ఉంది కాబట్టి పాసివ్ వాయిస్‌లో was designed అని వస్తుంది.',
    },
    hint: {
      en: 'Identify the tense: "designed" is simple past. Use "was" + past participle (V3).',
      hi: 'काल पहचानें: "designed" भूतकाल है। "was designed" का प्रयोग करें।',
      te: '"designed" అనేది simple past. కాబట్టి was + V3 (was designed) వాడాలి.',
    },
    misconceptionTags: ['CHANGED_PAST_TENSE_TO_PRESENT_IN_PASSIVE'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Dedicated Retest Question for CBSE Class 8 English
  {
    id: 'q_cbse8_retest_eng_voice_01',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_tenses',
    conceptId: 'con_cbse8_eng_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Procedural',
    expectedSolvingTimeSeconds: 50,
    questionType: 'mcq',
    prompt: {
      en: 'Choose the correct passive voice: "The students are planting hundred neem saplings along the campus boundary."',
      hi: 'सही Passive voice चुनें: "The students are planting hundred neem saplings along the campus boundary."',
      te: 'సరైన Passive voice ఎంచుకోండి: "The students are planting hundred neem saplings along the campus boundary."',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Hundred neem saplings are being planted along the campus boundary by the students.',
          hi: 'Hundred neem saplings are being planted along the campus boundary by the students.',
          te: 'Hundred neem saplings are being planted along the campus boundary by the students.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Hundred neem saplings were being planted along the campus boundary by the students.',
          hi: 'Hundred neem saplings were being planted along the campus boundary by the students.',
          te: 'Hundred neem saplings were being planted along the campus boundary by the students.',
        },
        misconceptionTag: 'CHANGED_PRESENT_CONTINUOUS_TO_PAST',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Hundred neem saplings are planted along the campus boundary by the students.',
          hi: 'Hundred neem saplings are planted along the campus boundary by the students.',
          te: 'Hundred neem saplings are planted along the campus boundary by the students.',
        },
        misconceptionTag: 'OMITTED_BEING_IN_CONTINUOUS_PASSIVE',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Hundred neem saplings have been planted along the campus boundary.',
          hi: 'Hundred neem saplings have been planted along the campus boundary.',
          te: 'Hundred neem saplings have been planted along the campus boundary.',
        },
        misconceptionTag: 'CHANGED_CONTINUOUS_TO_PERFECT',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Present continuous passive structure: is/am/are + being + V3. "Hundred neem saplings" is plural, so we use "are being planted".',
      hi: 'Present continuous passive की संरचना: is/are + being + V3 होती है।',
      te: 'Present continuous passive రూపం: are + being + V3 (are being planted).',
    },
    hint: {
      en: 'Continuous actions require the helper word "being" in the passive voice.',
      hi: 'Continuous क्रियाओं के passive voice में "being" का प्रयोग अनिवार्य है।',
      te: 'కంటిన్యుయస్ టెన్స్‌లో పాసివ్ వాయిస్‌కి "being" పదం అవసరం.',
    },
    misconceptionTags: ['OMITTED_BEING_IN_CONTINUOUS_PASSIVE'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 6 - SCIENCE: Components of Food
  // ==========================================
  {
    id: 'q_cbse6_sci_food_01',
    board: 'CBSE',
    classLevel: '6',
    subject: 'Science',
    chapterId: 'ch_cbse6_sci_food',
    conceptId: 'con_cbse6_sci_food_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'A student adds two drops of dilute iodine solution to a mashed boiled potato slice. What color change indicates the presence of starch?',
      hi: 'एक छात्र उबले हुए आलू के टुकड़े पर आयोडीन के घोल की दो बूंदें डालता है। स्टार्च की उपस्थिति दर्शाने वाला रंग परिवर्तन क्या है?',
      te: 'ఒక విద్యార్థి ఉడకబెట్టిన బంగాళాదుంప ముక్కపై రెండు చుక్కల అయోడిన్ ద్రావణాన్ని వేశాడు. పిండి పదార్థం (స్టార్చ్) ఉనికిని తెలిపే రంగు మార్పు ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Blue-black color',
          hi: 'नीला-काला रंग',
          te: 'నీలి-నలుపు రంగు (Blue-black)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Bright violet color',
          hi: 'चमकीला बैंगनी रंग (प्रोटीन परीक्षण)',
          te: 'ఊదా రంగు (ప్రోటీన్ పరీక్ష)',
        },
        misconceptionTag: 'CONFUSED_STARCH_TEST_WITH_BIURET_PROTEIN_TEST',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Brick red precipitate',
          hi: 'ईंट जैसा लाल रंग',
          te: 'ఇటుక ఎరుపు రంగు',
        },
        misconceptionTag: 'CONFUSED_WITH_BENEDICT_TEST',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Translucent greasy patch',
          hi: 'पारभासी चिकना धब्बा (वसा परीक्षण)',
          te: 'జిడ్డు మచ్చ (కొవ్వు పరీక్ష)',
        },
        misconceptionTag: 'CONFUSED_WITH_FAT_PAPER_TEST',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'The standard test for starch uses dilute iodine solution. Starch reacts with iodine to form an intense blue-black starch-iodine inclusion complex.',
      hi: 'स्टार्च का परीक्षण तनु आयोडीन घोल से किया जाता है। स्टार्च आयोडीन के साथ नीला-काला रंग देता है।',
      te: 'స్టార్చ్ ఉనికిని గుర్తించడానికి అయోడిన్ ద్రావణం వాడతారు. ఇది స్టార్చ్‌తో నీలి-నలుపు రంగును ఏర్పరుస్తుంది.',
    },
    hint: {
      en: 'Iodine reacts with carbohydrate starch to form a deep dark bluish hue.',
      hi: 'आयोडीन स्टार्च के साथ गहरा नीला-काला रंग बनाता है।',
      te: 'అయోడిన్ స్టార్చ్ తో కలిసి ముదురు నీలి-నలుపు రంగుని ఇస్తుంది.',
    },
    misconceptionTags: ['CONFUSED_STARCH_TEST_WITH_BIURET_PROTEIN_TEST'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Dedicated Retest Question for CBSE Class 6 Science
  {
    id: 'q_cbse6_retest_sci_food_01',
    board: 'CBSE',
    classLevel: '6',
    subject: 'Science',
    chapterId: 'ch_cbse6_sci_food',
    conceptId: 'con_cbse6_sci_food_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'Which deficiency disease is caused due to lack of Vitamin C in the daily diet, characterized by bleeding gums and slow-healing wounds?',
      hi: 'दैनिक आहार में विटामिन C की कमी से कौन सा हीनताजन्य रोग होता है, जिसके लक्षण मसूड़ों से खून आना और घावों का देर से भरना हैं?',
      te: 'ఆహారంలో విటమిన్ సి లోపం వల్ల వచ్చే లోప వ్యాధి ఏది, దీని వల్ల చిగుళ్ళ నుండి రక్తం కారడం మరియు గాయాలు ఆలస్యంగా మానడం జరుగుతాయి?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Scurvy',
          hi: 'स्कर्वी (Scurvy)',
          te: 'స్కర్వీ (Scurvy)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Beriberi (Vitamin B1 deficiency)',
          hi: 'बेरीबेरी (विटामिन B1 की कमी)',
          te: 'బెరిబెరి (విటమిన్ B1 లోపం)',
        },
        misconceptionTag: 'CONFUSED_VITAMIN_C_WITH_B1',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Rickets (Vitamin D deficiency)',
          hi: 'रिकेट्स (विटामिन D की कमी)',
          te: 'రికెట్స్ (విటమిన్ డి లోపం)',
        },
        misconceptionTag: 'CONFUSED_VITAMIN_C_WITH_D',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Night Blindness (Vitamin A deficiency)',
          hi: 'रतौंधी (विटामिन A की कमी)',
          te: 'రేచీకటి (విటమిన్ ఎ లోపం)',
        },
        misconceptionTag: 'CONFUSED_VITAMIN_C_WITH_A',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Vitamin C (ascorbic acid) is essential for collagen synthesis. Its deficiency causes Scurvy, leading to spongy bleeding gums and painful skin lesions.',
      hi: 'विटामिन C की कमी से स्कर्वी रोग होता है जिससे मसूड़ों से खून आने लगता है। खट्टे फल जैसे आंवला और नींबू इसके मुख्य स्रोत हैं।',
      te: 'విటమిన్ సి లోపం వల్ల స్కర్వీ వ్యాధి వస్తుంది. దీనివల్ల చిగుళ్ళ నుండి రక్తం కారుతుంది.',
    },
    hint: {
      en: 'Citrus fruits like amla, lemon, and oranges cure this disease.',
      hi: 'नींबू, आंवला और संतरा जैसे खट्टे फल इस बीमारी को ठीक करते हैं।',
      te: 'నిమ్మ, ఉసిరి వంటి పుల్లని పండ్లు తినడం వల్ల ఈ వ్యాధి నయమవుతుంది.',
    },
    misconceptionTags: ['CONFUSED_VITAMIN_C_WITH_B1', 'CONFUSED_VITAMIN_C_WITH_D'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 6 - ENGLISH: Sentence Structure & Nouns
  // ==========================================
  {
    id: 'q_cbse6_eng_sent_01',
    board: 'CBSE',
    classLevel: '6',
    subject: 'English',
    chapterId: 'ch_cbse6_eng_grammar',
    conceptId: 'con_cbse6_eng_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'Identify the complete predicate in the sentence: "The kind elderly doctor treated all injured animals without taking any fee."',
      hi: 'वाक्य में पूर्ण विधेय (Complete Predicate) पहचानें: "The kind elderly doctor treated all injured animals without taking any fee."',
      te: 'ఈ వాక్యంలో విధేయం (Predicate) ను గుర్తించండి: "The kind elderly doctor treated all injured animals without taking any fee."',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'treated all injured animals without taking any fee',
          hi: 'treated all injured animals without taking any fee',
          te: 'treated all injured animals without taking any fee',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The kind elderly doctor',
          hi: 'The kind elderly doctor (पूर्ण उद्देश्य / Subject)',
          te: 'The kind elderly doctor (కర్త / Subject)',
        },
        misconceptionTag: 'CONFUSED_SUBJECT_WITH_PREDICATE',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'treated',
          hi: 'treated (केवल मुख्य क्रिया)',
          te: 'treated (కేవలం క్రియ మాత్రమే)',
        },
        misconceptionTag: 'IDENTIFIED_ONLY_SIMPLE_PREDICATE_VERB',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'without taking any fee',
          hi: 'without taking any fee',
          te: 'without taking any fee',
        },
        misconceptionTag: 'IDENTIFIED_ONLY_PREPOSITIONAL_PHRASE',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'The subject is who or what the sentence is about ("The kind elderly doctor"). The complete predicate includes the main verb and everything that tells what the subject does ("treated all injured animals without taking any fee").',
      hi: 'Subject है "The kind elderly doctor", और उसके द्वारा किए गए कार्य का सम्पूर्ण विवरण "treated all injured animals without taking any fee" Predicate कहलाता है।',
      te: 'కర్త (Subject) "The kind elderly doctor". కర్త ఏమి చేసిందో చెప్పే మిగిలిన పూర్తి భాగం "treated all injured animals without taking any fee" Predicate అవుతుంది.',
    },
    hint: {
      en: 'The predicate begins from the verb ("treated") and goes to the end of the sentence.',
      hi: 'विधेय (Predicate) क्रिया ("treated") से शुरू होकर वाक्य के अंत तक जाता है।',
      te: 'విధేయం క్రియ ("treated") నుండి ప్రారంభమై వాక్యం చివరి వరకు ఉంటుంది.',
    },
    misconceptionTags: ['CONFUSED_SUBJECT_WITH_PREDICATE'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Dedicated Retest Question for CBSE Class 6 English
  {
    id: 'q_cbse6_retest_eng_sent_01',
    board: 'CBSE',
    classLevel: '6',
    subject: 'English',
    chapterId: 'ch_cbse6_eng_grammar',
    conceptId: 'con_cbse6_eng_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'Which punctuation mark correctly concludes an imperative sentence giving an instruction like "Close the classroom windows before leaving"?',
      hi: 'निर्देश देने वाले आज्ञासूचक वाक्य "Close the classroom windows before leaving" के अंत में कौन सा विराम चिन्ह आता है?',
      te: '"Close the classroom windows before leaving" అనే సూచననిచ్చే వాక్యం చివర ఏ విరామ చిహ్నం ఉండాలి?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Full stop / Period (.)',
          hi: 'पूर्ण विराम (.)',
          te: 'ఫుల్ స్టాప్ (.)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Question mark (?)',
          hi: 'प्रश्नवाचक चिन्ह (?)',
          te: 'ప్రశ్నార్థకం (?)',
        },
        misconceptionTag: 'CONFUSED_IMPERATIVE_WITH_INTERROGATIVE',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Semicolon (;)',
          hi: 'अर्धविराम (;)',
          te: 'సెమీకోలన్ (;)',
        },
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Comma (,)',
          hi: 'अल्पविराम (,)',
          te: 'కామా (,)',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'An imperative sentence gives a command, polite request, or instruction, and ends with a full stop (.) unless spoken with extreme urgency or shouting.',
      hi: 'निर्देश या आदेश देने वाले आज्ञासूचक वाक्य सामान्यतः पूर्ण विराम (.) पर समाप्त होते हैं।',
      te: 'ఆజ్ఞలు, సూచనలు ఇచ్చే వాక్యాలు చివర సాధారణంగా ఫుల్ స్టాప్ (.) తో ముగుస్తాయి.',
    },
    hint: {
      en: 'This is a standard polite instruction, not an inquiry or interjection.',
      hi: 'यह एक सामान्य निर्देश है, न कि कोई प्रश्न।',
      te: 'ఇది ఒక సాధారణ సూచన, ప్రశ్న కాదు.',
    },
    misconceptionTags: ['CONFUSED_IMPERATIVE_WITH_INTERROGATIVE'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 10 - SCIENCE: Life Processes (Biology)
  // ==========================================
  {
    id: 'q_cbse10_sci_bio_01',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_life_proc',
    conceptId: 'con_cbse10_sci_bio_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Conceptual',
    expectedSolvingTimeSeconds: 50,
    questionType: 'mcq',
    prompt: {
      en: 'During the light reaction of photosynthesis in green plants, what is the immediate source of oxygen gas released into the atmosphere?',
      hi: 'हरे पौधों में प्रकाश संश्लेषण की प्रकाश अभिक्रिया के दौरान वायुमंडल में मुक्त होने वाली ऑक्सीजन का तात्कालिक स्रोत क्या है?',
      te: 'కిరణజన్య సంయోగక్రియలోని కాంతి చర్యలో వాతావరణంలోకి విడుదలయ్యే ఆక్సిజన్ యొక్క మూలం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Photolysis (splitting) of water molecules (H2O)',
          hi: 'जल के अणुओं का प्रकाश-अपघटन (Photolysis of H2O)',
          te: 'నీటి అణువుల కాంతి విశ్లేషణ (Photolysis of H2O)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Breakdown of carbon dioxide gas (CO2)',
          hi: 'कार्बन डाइऑक्साइड (CO2) का विखंडन',
          te: 'కార్బన్ డై ఆక్సైడ్ (CO2) విచ్ఛిన్నం',
        },
        misconceptionTag: 'BELIEVED_O2_ORIGINATES_FROM_CO2',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Decomposition of glucose during respiration',
          hi: 'श्वसन में ग्लूकोज का अपघटन',
          te: 'శ్వాసక్రియలో గ్లూకోజ్ విచ్ఛిన్నం',
        },
        misconceptionTag: 'CONFUSED_RESPIRATION_WITH_PHOTOSYNTHESIS',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Direct absorption from soil minerals',
          hi: 'मृदा के खनिजों से सीधा अवशोषण',
          te: 'నేల నుండి నేరుగా గ్రహించడం',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Cornelis van Niel proved that oxygen released during photosynthesis originates from water (H2O), not from carbon dioxide (CO2). Light energy absorbed by chlorophyll photolyzes water: 2H2O -> 4H+ + 4e- + O2.',
      hi: 'प्रकाश संश्लेषण में मुक्त होने वाली ऑक्सीजन जल (H2O) के विखंडन से आती है, न कि कार्बन डाइऑक्साइड से।',
      te: 'కిరణజన్య సంయోగక్రియలో విడుదలయ్యే ఆక్సిజన్ నీటి అణువుల విశ్లేషణ నుండి వస్తుంది, కార్బన్ డై ఆక్సైడ్ నుండి కాదు.',
    },
    hint: {
      en: 'Remember Van Niel’s experiment with purple sulfur bacteria which produced sulfur instead of oxygen when using H2S.',
      hi: 'वान नील का प्रयोग याद करें जिसमें H2S का उपयोग करने पर सल्फर निकला था न कि ऑक्सीजन।',
      te: 'వాన్ నీల్ ప్రయోగం గుర్తుచేసుకోండి; H2S వాడినప్పుడు ఆక్సిజన్ కు బదులుగా సల్ఫర్ వచ్చింది.',
    },
    misconceptionTags: ['BELIEVED_O2_ORIGINATES_FROM_CO2'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse10_retest_sci_bio_01',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_life_proc',
    conceptId: 'con_cbse10_sci_bio_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 55,
    questionType: 'mcq',
    prompt: {
      en: 'In which cellular organelle do the light-dependent and dark (carbon fixation) reactions of photosynthesis take place respectively?',
      hi: 'प्रकाश संश्लेषण की प्रकाश-निर्भर और अप्रकाशीय (डार्क) अभिक्रियाएं क्रमशः कोशिकांग के किन भागों में होती हैं?',
      te: 'కిరణజన్య సంయోగక్రియలోని కాంతి చర్య మరియు నిష్కాంతి చర్యలు హరితరేణువులో ఏ భాగాలలో జరుగుతాయి?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Thylakoid membranes (Grana) and Stroma matrix respectively',
          hi: 'क्रमशः थायलाकोइड झिल्ली (ग्रेना) और स्ट्रोमा मैट्रिक्स में',
          te: 'వరుసగా గ్రానా (థైలకాయిడ్ త్వచం) మరియు స్ట్రోమా (ఆవరణిక) లో',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Mitochondrial cristae and cytoplasm respectively',
          hi: 'माइटोकॉन्ड्रिया और कोशिकाद्रव्य में',
          te: 'మైటోకాండ్రియా మరియు కణద్రవ్యంలో',
        },
        misconceptionTag: 'CONFUSED_CHLOROPLAST_WITH_MITOCHONDRIA',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Stroma matrix and Grana respectively (inverted)',
          hi: 'स्ट्रोमा और ग्रेना में (उल्टा)',
          te: 'ఆవరణిక మరియు గ్రానా లో (వ్యతిరేకం)',
        },
        misconceptionTag: 'INVERTED_LIGHT_AND_DARK_SITES',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Vacuole membrane and nucleus',
          hi: 'रिक्तिका और केंद्रक में',
          te: 'రిక్తిక మరియు కేంద్రకంలో',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Chlorophyll pigments embedded in thylakoid disks (grana) capture photons for the light reaction. The ATP and NADPH synthesized then drive carbohydrate synthesis in the fluid stroma matrix.',
      hi: 'ग्रेना (थायलाकोइड) में प्रकाश अभिक्रिया होती है और तरल स्ट्रोमा में अप्रकाशीय अभिक्रिया (एंजाइमी संश्लेषण) होती है।',
      te: 'గ్రానా లో కాంతి చర్య, స్ట్రోమా లో నిష్కాంతి చర్య (డార్క్ రియాక్షన్) జరుగుతాయి.',
    },
    hint: {
      en: 'Grana stack membranes hold chlorophyll pigments; the fluid surrounding them is the stroma.',
      hi: 'ग्रेना में क्लोरोफिल होता है; उनके आसपास का तरल पदार्थ स्ट्रोमा है।',
      te: 'హరితరేణువులోని గ్రానా కాంతిని గ్రహిస్తుంది; ద్రవ రూపంలోని స్ట్రోమా కార్బోహైడ్రేట్లను తయారుచేస్తుంది.',
    },
    misconceptionTags: ['INVERTED_LIGHT_AND_DARK_SITES'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 10 - SOCIAL SCIENCE: Nationalism in India
  // ==========================================
  {
    id: 'q_cbse10_soc_nat_01',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Social Science',
    chapterId: 'ch_cbse10_soc_nationalism',
    conceptId: 'con_cbse10_soc_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    expectedSolvingTimeSeconds: 45,
    questionType: 'mcq',
    prompt: {
      en: 'Why did Mahatma Gandhi decide to abruptly withdraw and call off the nationwide Non-Cooperation Movement in February 1922?',
      hi: 'महात्मा गांधी ने फरवरी 1922 में देशव्यापी असहयोग आंदोलन को अचानक वापस लेने का निर्णय क्यों लिया?',
      te: 'ఫిబ్రవరి 1922 లో సహాయ నిరాకరణ ఉద్యమాన్ని మహాత్మా గాంధీ అకస్మాత్తుగా ఎందుకు విరమించారు?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'The violent incident at Chauri Chaura where a police station was set on fire',
          hi: 'चौरी-चौरा की हिंसक घटना जहाँ थाने में आग लगा दी गई थी',
          te: 'చౌరీచౌరా లో పోలీస్ స్టేషన్‌ను తగులబెట్టిన హింసాత్మక సంఘటన వల్ల',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The British government accepted all demands of the Khilafat committee',
          hi: 'ब्रिटिश सरकार ने खिलाफत की सभी मांगें स्वीकार कर ली थीं',
          te: 'బ్రిటిష్ వారు అన్ని డిమాండ్లను అంగీకరించడం వల్ల',
        },
        misconceptionTag: 'BELIEVED_MOVEMENT_SUCCEEDED_IMMEDIATELY',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The signing of the Gandhi-Irwin Pact in London',
          hi: 'गांधी-इरविन समझौता होना',
          te: 'గాంధీ-ఇర్విన్ ఒప్పందం కుదరడం వల్ల',
        },
        misconceptionTag: 'ANACHRONISTIC_CONFUSION_WITH_1931_PACT',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Lack of mass participation across Indian towns and villages',
          hi: 'जनता की भागीदारी का अभाव',
          te: 'ప్రజల భాగస్వామ్యం లేకపోవడం వల్ల',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'At Chauri Chaura (Gorakhpur, UP) in February 1922, a peaceful demonstration turned violent when protesters clashed with police and burned down the station, killing 22 policemen. Committed to absolute Ahimsa (non-violence), Gandhiji immediately suspended the movement.',
      hi: 'फरवरी 1922 में चौरी-चौरा में भीड़ ने थाने में आग लगा दी जिसमें 22 पुलिसकर्मी मारे गए। अहिंसा के सिद्धांत के कारण गांधीजी ने आंदोलन तुरंत वापस ले लिया।',
      te: 'చౌరీచౌరా వద్ద జరిగిన హింసాత్మక ఘటనలో 22 మంది పోలీసులు మరణించారు. అహింసను నమ్మిన గాంధీజీ ఉద్యమాన్ని తక్షణమే నిలిపివేశారు.',
    },
    hint: {
      en: 'Look for the UP village incident where protestors violated the strict rule of non-violence.',
      hi: 'उत्तर प्रदेश के उस स्थल को याद करें जहाँ पुलिस थाने में आगजनी हुई थी।',
      te: 'ఉత్తరప్రదేశ్‌లోని ఆ హింసాత్మక సంఘటనను గుర్తుచేసుకోండి.',
    },
    misconceptionTags: ['ANACHRONISTIC_CONFUSION_WITH_1931_PACT'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // TELANGANA SSC CLASS 10 - ENGLISH: Attitude is Altitude
  // ==========================================
  {
    id: 'q_ts10_eng_att_01',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'English',
    chapterId: 'ch_ts10_eng_attitude',
    conceptId: 'con_ts10_eng_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 45,
    questionType: 'mcq',
    prompt: {
      en: 'Fill in the blank with the appropriate prepositional phrase: "Nick Vujicic graduated in Financial Planning and Accounting ______ his severe physical disability."',
      hi: 'उचित prepositional phrase से रिक्त स्थान भरें: "Nick Vujicic graduated in Financial Planning and Accounting ______ his severe physical disability."',
      te: 'సరైన prepositional phrase తో పూరించండి: "Nick Vujicic graduated in Financial Planning and Accounting ______ his severe physical disability."',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'in spite of',
          hi: 'in spite of (के बावजूद)',
          te: 'in spite of (అయినప్పటికీ)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'in order to',
          hi: 'in order to (के उद्देश्य से)',
          te: 'in order to (ఉద్దేశ్యంతో)',
        },
        misconceptionTag: 'CONFUSED_PURPOSE_WITH_CONCESSION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'by means of',
          hi: 'by means of (के माध्यम से)',
          te: 'by means of (ద్వారా)',
        },
        misconceptionTag: 'CONFUSED_INSTRUMENTALITY_WITH_CONCESSION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'in favor of',
          hi: 'in favor of (के पक्ष में)',
          te: 'in favor of (పక్షాన)',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: '"In spite of" expresses contrast/concession (despite having a disability, he achieved graduation). "In order to" expresses purpose, and "by means of" expresses instrument.',
      hi: '"in spite of" का अर्थ होता है "के बावजूद", जो विपरीत परिस्थितियों में मिली सफलता को दर्शाता है।',
      te: '"in spite of" అంటే "అయినప్పటికీ". తీవ్రమైన వైకల్యం ఉన్నప్పటికీ ఆయన పట్టభద్రుడయ్యాడు అనే అర్థంలో ఇది వాడతాము.',
    },
    hint: {
      en: 'Choose the phrase meaning "despite" or showing contrast between adversity and achievement.',
      hi: 'वह मुहावरा चुनें जिसका अर्थ "बाधाओं के बावजूद" हो।',
      te: '"అయినప్పటికీ" అనే అర్థాన్నిచ్చే పదాన్ని ఎంచుకోండి.',
    },
    misconceptionTags: ['CONFUSED_PURPOSE_WITH_CONCESSION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CISCE (ICSE) CLASS 10 - BIOLOGY: Cell Cycle & Mitosis
  // ==========================================
  {
    id: 'q_cisce10_bio_mit_01',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Biology',
    chapterId: 'ch_cisce10_bio_cell_cycle',
    conceptId: 'con_cisce10_bio_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Conceptual',
    expectedSolvingTimeSeconds: 50,
    questionType: 'mcq',
    prompt: {
      en: 'During which phase of Mitosis do sister chromatids separate at the centromere and migrate toward opposite poles of the spindle?',
      hi: 'समसूत्री विभाजन (Mitosis) की किस अवस्था में सिस्टर क्रोमैटिड्स सेंट्रोमियर पर अलग होकर विपरीत ध्रुवों की ओर गति करते हैं?',
      te: 'సమవిభజన (Mitosis) లోని ఏ దశలో సిస్టర్ క్రోమాటిడ్స్ సెంట్రోమియర్ వద్ద విడిపోయి వ్యతిరేక ధ్రువాల వైపు కదులుతాయి?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Anaphase',
          hi: 'पश्चावस्था (Anaphase)',
          te: 'చలన దశ (Anaphase)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Metaphase (alignment at equatorial plate)',
          hi: 'मध्यावस्था (Metaphase)',
          te: 'మధ్యస్థ దశ (Metaphase)',
        },
        misconceptionTag: 'CONFUSED_EQUATORIAL_ALIGNMENT_WITH_SEPARATION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Prophase (chromatin condensation)',
          hi: 'पूर्वावस्था (Prophase)',
          te: 'ప్రథమ దశ (Prophase)',
        },
        misconceptionTag: 'CONFUSED_CONDENSATION_WITH_MIGRATION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Telophase (nuclear membrane reformation)',
          hi: 'अंत्यावस्था (Telophase)',
          te: 'అంత్య దశ (Telophase)',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'In Anaphase, each centromere splits and the spindle fibers contract, pulling sister chromatids apart toward opposite poles as individual daughter chromosomes (forming characteristic V or J shapes).',
      hi: 'Anaphase (पश्चावस्था) में सेंट्रोमियर विभाजित होता है और क्रोमैटिड्स ध्रुवों की ओर खिंचते हैं।',
      te: 'ఎనాఫేస్ (Anaphase) దశలో సెంట్రోమియర్ విడిపోయి క్రోమోజోమ్‌లు వ్యతిరేక ధ్రువాల వైపు లాగబడతాయి.',
    },
    hint: {
      en: 'Think of "A" in Anaphase for "Away" — chromosomes move away toward opposite poles.',
      hi: 'Anaphase का "A" याद रखें: "Away" (दूर जाना)।',
      te: 'Anaphase లో "A" అనగా "Away" (దూరంగా వెళ్లడం).',
    },
    misconceptionTags: ['CONFUSED_EQUATORIAL_ALIGNMENT_WITH_SEPARATION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CISCE CLASS 10 - ENGLISH: Sentence Transformation & Inversion
  // ==========================================
  {
    id: 'q_cisce10_eng_trans_01',
    board: 'CISCE',
    classLevel: '10',
    subject: 'English',
    chapterId: 'ch_cisce10_eng_syntax',
    conceptId: 'con_cisce10_eng_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 50,
    questionType: 'mcq',
    prompt: {
      en: 'Begin with "No sooner": "As soon as the school bell rang, the enthusiastic students rushed out to the playground."',
      hi: '"No sooner" से वाक्य पुनः लिखें: "As soon as the school bell rang, the enthusiastic students rushed out to the playground."',
      te: '"No sooner" తో వాక్యాన్ని ప్రారంభించండి: "As soon as the school bell rang, the enthusiastic students rushed out to the playground."',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'No sooner did the school bell ring than the enthusiastic students rushed out to the playground.',
          hi: 'No sooner did the school bell ring than the enthusiastic students rushed out to the playground.',
          te: 'No sooner did the school bell ring than the enthusiastic students rushed out to the playground.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'No sooner the school bell rang when the enthusiastic students rushed out to the playground.',
          hi: 'No sooner the school bell rang when the enthusiastic students rushed out to the playground.',
          te: 'No sooner the school bell rang when the enthusiastic students rushed out to the playground.',
        },
        misconceptionTag: 'USED_WHEN_INSTEAD_OF_THAN_AND_MISSED_INVERSION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'No sooner did the school bell rang then the enthusiastic students rushed out.',
          hi: 'No sooner did the school bell rang then the enthusiastic students rushed out.',
          te: 'No sooner did the school bell rang then the enthusiastic students rushed out.',
        },
        misconceptionTag: 'DID_FOLLOWED_BY_PAST_TENSE_AND_THEN_ERROR',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Hardly had the school bell rang than students rushed out.',
          hi: 'Hardly had the school bell rang than students rushed out.',
          te: 'Hardly had the school bell rang than students rushed out.',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Rules: (1) "No sooner" requires subject-auxiliary inversion ("did the bell ring" or "had the bell rung"). (2) "No sooner" pairs exclusively with "than", NEVER with "when" or "then". (3) After "did", use base verb "ring", not "rang".',
      hi: 'नियम: No sooner के बाद auxiliary क्रिया (did/had) आगे आती है और इसके साथ हमेशा "than" का प्रयोग होता है, "when" या "then" का नहीं।',
      te: 'నియమాలు: No sooner వచ్చినప్పుడు did/had ముందు రావాలి, మరియు దీనితో ఎల్లప్పుడూ "than" మాత్రమే జతగా రావాలి.',
    },
    hint: {
      en: 'Correlative pair is "No sooner... than", with subject-verb inversion (did + subject + V1).',
      hi: 'No sooner के साथ "than" आता है और did के बाद मूल क्रिया (ring) लगती है।',
      te: 'No sooner తర్వాత than రావాలి, did తర్వాత V1 (ring) రావాలి.',
    },
    misconceptionTags: ['USED_WHEN_INSTEAD_OF_THAN_AND_MISSED_INVERSION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 8 - SOCIAL SCIENCE: Resources
  // ==========================================
  {
    id: 'q_cbse8_soc_res_01',
    board: 'CBSE',
    classLevel: '8',
    subject: 'Social Science',
    chapterId: 'ch_cbse8_soc_resources',
    conceptId: 'con_cbse8_soc_c1',
    difficulty: 'Easy',
    cognitiveSkill: 'Conceptual',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'Which of the following defines "Sustainable Development" according to the NCERT curriculum?',
      hi: 'NCERT पाठ्यक्रम के अनुसार "सतत पोषणीय विकास" (Sustainable Development) की सही परिभाषा क्या है?',
      te: 'సుస్థిర అభివృద్ధి (Sustainable Development) యొక్క సరైన నిర్వచనం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Carefully utilizing resources so that meeting present needs does not compromise the needs of future generations',
          hi: 'संसाधनों का सावधानीपूर्वक उपयोग ताकि वर्तमान की आवश्यकताएं पूरी हों और भविष्य की पीढ़ियों के लिए भी वे सुरक्षित रहें',
          te: 'భవిష్యత్ తరాల అవసరాలకు ఆటంకం కలగకుండా ప్రస్తుత అవసరాలను తీర్చుకుంటూ వనరులను సద్వినియోగం చేసుకోవడం',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Stopping all industrial use of natural resources immediately',
          hi: 'सभी प्राकृतिक संसाधनों का औद्योगिक उपयोग तुरंत बंद करना',
          te: 'సహజ వనరుల వాడకాన్ని పూర్తిగా నిలిపివేయడం',
        },
        misconceptionTag: 'CONFUSED_CONSERVATION_WITH_PRESERVATION_HALT',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Extracting mineral deposits as quickly as possible to boost GDP',
          hi: 'जीडीपी बढ़ाने के लिए खनिजों का तेजी से निष्कर्षण करना',
          te: 'జిడిపి పెంచడానికి వీలైనంత త్వరగా వనరులను వాడేయడం',
        },
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Using only man-made synthetic resources instead of natural gifts',
          hi: 'प्राकृतिक संसाधनों के स्थान पर केवल कृत्रिम उत्पादों का उपयोग करना',
          te: 'కేవలం మానవ నిర్మిత వనరులను మాత్రమే వాడటం',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Sustainable development means balancing the need to use resources today and conserving them for future generations, respecting ecological boundaries.',
      hi: 'सतत पोषणीय विकास का अर्थ है वर्तमान की जरूरतों को पूरा करते हुए भविष्य के लिए संसाधनों का संरक्षण करना।',
      te: 'సుస్థిర అభివృద్ధి అనగా ప్రస్తుత అవసరాలను తీర్చుకుంటూనే భవిష్యత్ తరాల కొరకు వనరులను కాపాడుకోవడం.',
    },
    hint: {
      en: 'Think about balancing present consumption with the rights of future generations.',
      hi: 'वर्तमान उपयोग और भावी पीढ़ियों के बीच संतुलन पर ध्यान दें।',
      te: 'ప్రస్తుత మరియు భవిష్యత్ తరాల అవసరాల మధ్య సమతుల్యతను ఆలోచించండి.',
    },
    misconceptionTags: ['CONFUSED_CONSERVATION_WITH_PRESERVATION_HALT'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // ==========================================
  // CBSE CLASS 8 ENGLISH: ADVERBS (Comprehensive Topic Question Bank)
  // ==========================================
  {
    id: 'q_cbse8_eng_adv_01',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c1',
    topicId: 'con_cbse8_eng_adv_c1',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Identify adverbs in sentences and differentiate them from qualifying adjectives.',
    academicYear: '2026-2027',
    difficulty: 'Foundational',
    cognitiveSkill: 'Foundational',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'In the sentence: "The remarkably swift falcon flew incredibly fast across the valley," which adverb directly modifies another adverb?',
      hi: 'वाक्य "The remarkably swift falcon flew incredibly fast across the valley" में कौन सा क्रियाविशेषण किसी अन्य क्रियाविशेषण की विशेषता बता रहा है?',
      te: '"The remarkably swift falcon flew incredibly fast across the valley" వాక్యంలో మరొక క్రియా విశేషణాన్ని వర్ణించే అడ్వెర్బ్ ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: '"incredibly" (it modifies the adverb "fast")',
          hi: '"incredibly" (यह क्रियाविशेषण "fast" को संशोधित करता है)',
          te: '"incredibly" (ఇది "fast" అనే అడ్వెర్బ్‌ను వర్ణిస్తుంది)',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: '"swift" (it modifies falcon)',
          hi: '"swift" (यह falcon की विशेषता बताता है)',
          te: '"swift" (ఇది falcon ను వర్ణిస్తుంది)',
        },
        misconceptionTag: 'ADJECTIVE_ADVERB_CONFUSION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: '"remarkably" (it modifies the adverb falcon)',
          hi: '"remarkably" (यह falcon को संशोधित करता है)',
          te: '"remarkably" (ఇది falcon ను వర్ణిస్తుంది)',
        },
        misconceptionTag: 'CONFUSED_NOUN_WITH_ADVERB',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: '"across" (it modifies the noun valley)',
          hi: '"across" (यह valley को संशोधित करता है)',
          te: '"across" (ఇది valley ను వర్ణిస్తుంది)',
        },
        misconceptionTag: 'CONFUSED_PREPOSITION_WITH_ADVERB',
        isCorrect: false,
      },
    ],
    explanation: {
      en: '"fast" is an adverb describing how the falcon flew (verb). "incredibly" is an adverb of degree modifying that adverb "fast". "remarkably" modifies the adjective "swift".',
      hi: '"fast" क्रियाविशेषण है जो उड़ने का तरीका बताता है, और "incredibly" इस "fast" की डिग्री बताता है।',
      te: '"fast" అనేది అడ్వెర్బ్ కాగా, "incredibly" అనేది ఈ "fast" తీవ్రతను తెలిపే అడ్వెర్బ్.',
    },
    hint: {
      en: 'Find the adverb that answers "how fast?" or "to what degree fast?".',
      hi: 'देखें कि "कितना तेज (how fast)?" का उत्तर कौन सा शब्द दे रहा है।',
      te: '"ఎంత వేగంగా (how fast)?" అని తెలిపే పదాన్ని గమనించండి.',
    },
    misconceptionTags: ['ADJECTIVE_ADVERB_CONFUSION', 'CONFUSED_NOUN_WITH_ADVERB'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_eng_adv_02',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c1',
    topicId: 'con_cbse8_eng_adv_c1',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Identify adverbs in sentences and differentiate them from qualifying adjectives.',
    academicYear: '2026-2027',
    difficulty: 'Easy',
    cognitiveSkill: 'Conceptual',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'Choose the sentence that correctly uses the adverb "well" instead of the adjective "good":',
      hi: 'वह वाक्य चुनें जिसमें विशेषण "good" के स्थान पर क्रियाविशेषण "well" का सही प्रयोग हुआ है:',
      te: '"good" కి బదులుగా క్రియా విశేషణం "well" ను సరైన రీతిలో ఉపయోగించిన వాక్యాన్ని ఎంచుకోండి:',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'The student played the sitar well during the cultural assembly.',
          hi: 'The student played the sitar well during the cultural assembly.',
          te: 'The student played the sitar well during the cultural assembly.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The student played the sitar good during the cultural assembly.',
          hi: 'The student played the sitar good during the cultural assembly.',
          te: 'The student played the sitar good during the cultural assembly.',
        },
        misconceptionTag: 'ADJECTIVE_ADVERB_CONFUSION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The student played the sitar goodly during the cultural assembly.',
          hi: 'The student played the sitar goodly during the cultural assembly.',
          te: 'The student played the sitar goodly during the cultural assembly.',
        },
        misconceptionTag: 'INVALID_ADVERB_DERIVATION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'The student was playing the sitar too much good yesterday.',
          hi: 'The student was playing the sitar too much good yesterday.',
          te: 'The student was playing the sitar too much good yesterday.',
        },
        misconceptionTag: 'ADJECTIVE_ADVERB_CONFUSION',
        isCorrect: false,
      },
    ],
    explanation: {
      en: '"Good" is an adjective used to modify nouns (e.g. "a good sitar player"). To modify the action verb "played", standard English strictly requires the adverb "well".',
      hi: '"Good" विशेषण है जो संज्ञा का वर्णन करता है। क्रिया "played" का वर्णन करने के लिए क्रियाविशेषण "well" का प्रयोग आवश्यक है।',
      te: '"Good" విశేషణం. క్రియ "played" ను వర్ణించడానికి క్రియా విశేషణం "well" మాత్రమే వాడాలి.',
    },
    hint: {
      en: 'Action verbs require the adverb "well", not the adjective "good".',
      hi: 'क्रिया की विशेषता बताने के लिए "well" आता है, "good" नहीं।',
      te: 'క్రియను వర్ణించడానికి "well" వాడాలి.',
    },
    misconceptionTags: ['ADJECTIVE_ADVERB_CONFUSION', 'INVALID_ADVERB_DERIVATION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_eng_adv_03',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c1',
    topicId: 'con_cbse8_eng_adv_c1',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Identify adverbs in sentences and differentiate them from qualifying adjectives.',
    academicYear: '2026-2027',
    difficulty: 'Moderate',
    cognitiveSkill: 'Procedural',
    expectedSolvingTimeSeconds: 45,
    questionType: 'mcq',
    prompt: {
      en: 'Which of the following sentences is grammatically ACCURATE regarding flat adverbs and the -ly suffix?',
      hi: 'फ्लैट क्रियाविशेषणों (Flat Adverbs) के संबंध में निम्नलिखित में से कौन सा वाक्य व्याकरण की दृष्टि से पूर्णतः शुद्ध है?',
      te: 'ఫ్లాట్ అడ్వెర్బ్‌ల వాడకం ప్రకారం క్రింది వాటిలో వ్యాకరణబద్ధంగా సరైన వాక్యం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'The ambulance drove fast through the congested intersection.',
          hi: 'The ambulance drove fast through the congested intersection.',
          te: 'The ambulance drove fast through the congested intersection.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The ambulance drove fastly through the congested intersection.',
          hi: 'The ambulance drove fastly through the congested intersection.',
          te: 'The ambulance drove fastly through the congested intersection.',
        },
        misconceptionTag: 'FLAT_ADVERB_MISUSE',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The surgeon worked hardly for six hours without any tea break.',
          hi: 'The surgeon worked hardly for six hours without any tea break.',
          te: 'The surgeon worked hardly for six hours without any tea break.',
        },
        misconceptionTag: 'CONFUSED_HARD_WITH_HARDLY',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'The soldier fought cowardly when the frontline was breached.',
          hi: 'The soldier fought cowardly when the frontline was breached.',
          te: 'The soldier fought cowardly when the frontline was breached.',
        },
        misconceptionTag: 'FALSE_LY_ADJECTIVE_CONFUSION',
        isCorrect: false,
      },
    ],
    explanation: {
      en: '"Fast" is a flat adverb that does not take "-ly" ("fastly" does not exist). "Hardly" means barely/scarcely, not with effort. "Cowardly" is an adjective, so one must say "in a cowardly manner".',
      hi: '"Fast" स्वयं क्रियाविशेषण है, "fastly" गलत है। "Hardly" का अर्थ न के बराबर होता है, मेहनत से नहीं।',
      te: '"fastly" అనే పదం లేదు; "fast" మాత్రమే వాడాలి. "hardly" అంటే దాదాపు కాదు అని అర్థం.',
    },
    hint: {
      en: 'Remember: flat adverbs like "fast" and "hard" never take "-ly".',
      hi: '"fast" में कभी भी -ly नहीं जुड़ता।',
      te: '"fast" కి ఎప్పుడూ -ly చేర్చరాదు.',
    },
    misconceptionTags: ['FLAT_ADVERB_MISUSE', 'CONFUSED_HARD_WITH_HARDLY', 'FALSE_LY_ADJECTIVE_CONFUSION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_eng_adv_04',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c2',
    topicId: 'con_cbse8_eng_adv_c2',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Classify adverbs into 5 types and position frequency/manner adverbs accurately in sentences.',
    academicYear: '2026-2027',
    difficulty: 'Moderate',
    cognitiveSkill: 'Conceptual',
    expectedSolvingTimeSeconds: 45,
    questionType: 'mcq',
    prompt: {
      en: 'In the sentence: "Ananya rarely forgets her notebooks and revises her lessons thoroughly," what types of adverbs are "rarely" and "thoroughly" respectively?',
      hi: 'वाक्य "Ananya rarely forgets her notebooks and revises her lessons thoroughly" में "rarely" और "thoroughly" क्रमशः किस प्रकार के क्रियाविशेषण हैं?',
      te: '"Ananya rarely forgets her notebooks and revises her lessons thoroughly" లో "rarely" మరియు "thoroughly" వరుసగా ఏ రకానికి చెందిన అడ్వెర్బ్‌లు?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: '"rarely" is Adverb of Frequency; "thoroughly" is Adverb of Degree',
          hi: '"rarely" आवृत्तिवाचक (Frequency) है; "thoroughly" परिमाणवाचक (Degree) है',
          te: '"rarely" అనేది Frequency; "thoroughly" అనేది Degree',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: '"rarely" is Adverb of Time; "thoroughly" is Adverb of Manner',
          hi: '"rarely" कालवाचक (Time) है; "thoroughly" रीतिवाचक (Manner) है',
          te: '"rarely" అనేది Time; "thoroughly" అనేది Manner',
        },
        misconceptionTag: 'ADVERB_TYPE_CONFUSION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: '"rarely" is Adverb of Manner; "thoroughly" is Adverb of Frequency',
          hi: '"rarely" रीतिवाचक है; "thoroughly" आवृत्तिवाचक है',
          te: '"rarely" అనేది Manner; "thoroughly" అనేది Frequency',
        },
        misconceptionTag: 'ADVERB_TYPE_CONFUSION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: '"rarely" is Adverb of Degree; "thoroughly" is Adverb of Place',
          hi: '"rarely" परिमाणवाचक है; "thoroughly" स्थानवाचक है',
          te: '"rarely" అనేది Degree; "thoroughly" అనేది Place',
        },
        misconceptionTag: 'ADVERB_TYPE_CONFUSION',
        isCorrect: false,
      },
    ],
    explanation: {
      en: '"rarely" answers "how often?" (Frequency). "thoroughly" answers "to what extent/completeness?" (Degree).',
      hi: '"rarely" बताता है कितनी बार (Frequency), और "thoroughly" बताता है किस सीमा तक (Degree)।',
      te: '"rarely" ఎన్నిసార్లు (Frequency) అని తెలుపుతుంది; "thoroughly" ఎంత పరిపూర్ణంగా (Degree) అని తెలుపుతుంది.',
    },
    hint: {
      en: '"rarely" indicates how often an action occurs; "thoroughly" indicates completeness or intensity.',
      hi: '"rarely" कार्य की पुनरावृत्ति (frequency) बताता है।',
      te: '"rarely" పని ఎంత తరచుగా జరుగుతుందో తెలుపుతుంది.',
    },
    misconceptionTags: ['ADVERB_TYPE_CONFUSION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_eng_adv_05',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c2',
    topicId: 'con_cbse8_eng_adv_c2',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Classify adverbs into 5 types and position frequency/manner adverbs accurately in sentences.',
    academicYear: '2026-2027',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 45,
    questionType: 'mcq',
    prompt: {
      en: 'Which sentence correctly positions the adverb of frequency "always" when paired with the linking verb "is"?',
      hi: 'लिंकिंग क्रिया "is" के साथ आवृत्तिवाचक क्रियाविशेषण "always" का सही स्थान किस वाक्य में है?',
      te: 'లింకింగ్ వెర్బ్ "is" ఉన్నప్పుడు frequency adverb "always" సరైన స్థానంలో ఉన్న వాక్యం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Dr. Abdul Kalam is always courteous and inspiring towards students.',
          hi: 'Dr. Abdul Kalam is always courteous and inspiring towards students.',
          te: 'Dr. Abdul Kalam is always courteous and inspiring towards students.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Dr. Abdul Kalam always is courteous and inspiring towards students.',
          hi: 'Dr. Abdul Kalam always is courteous and inspiring towards students.',
          te: 'Dr. Abdul Kalam always is courteous and inspiring towards students.',
        },
        misconceptionTag: 'MISPLACED_FREQUENCY_ADVERB',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Dr. Abdul Kalam courteous is always and inspiring towards students.',
          hi: 'Dr. Abdul Kalam courteous is always and inspiring towards students.',
          te: 'Dr. Abdul Kalam courteous is always and inspiring towards students.',
        },
        misconceptionTag: 'MISPLACED_FREQUENCY_ADVERB',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Always Dr. Abdul Kalam is courteous and inspiring towards students.',
          hi: 'Always Dr. Abdul Kalam is courteous and inspiring towards students.',
          te: 'Always Dr. Abdul Kalam is courteous and inspiring towards students.',
        },
        misconceptionTag: 'MISPLACED_FREQUENCY_ADVERB',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Syntactic rule: Adverbs of frequency must follow forms of the verb "to be" (is, am, are, was, were). Therefore, "is always" is correct; "always is" is grammatically incorrect.',
      hi: 'नियम: Frequency adverbs "to be" (is/am/are/was/were) के बाद आते हैं: "is always"।',
      te: 'నియమం: Frequency adverbs "be" రూపాల తర్వాత మాత్రమే రావాలి: "is always".',
    },
    hint: {
      en: 'Remember the formula: Subject + [is/am/are/was/were] + Frequency Adverb.',
      hi: 'सूत्र: Subject + is + always...',
      te: 'సూత్రం: Subject + is + always...',
    },
    misconceptionTags: ['MISPLACED_FREQUENCY_ADVERB'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_eng_adv_06',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c1',
    topicId: 'con_cbse8_eng_adv_c1',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Identify adverbs in sentences and differentiate them from qualifying adjectives.',
    academicYear: '2026-2027',
    difficulty: 'Challenging',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 50,
    questionType: 'mcq',
    prompt: {
      en: 'The word "friendly" is an adjective. How can it be accurately used to modify an action verb like "greeted"?',
      hi: '"friendly" एक विशेषण है। क्रिया "greeted" की विशेषता बताने के लिए इसका सही प्रयोग कैसे किया जाएगा?',
      te: '"friendly" అనేది ఒక విశేషణం. "greeted" అనే క్రియను వర్ణించడానికి దీనిని ఎలా వాడాలి?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'The principal greeted the newly admitted students in a friendly manner.',
          hi: 'The principal greeted the newly admitted students in a friendly manner.',
          te: 'The principal greeted the newly admitted students in a friendly manner.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The principal greeted the newly admitted students friendly.',
          hi: 'The principal greeted the newly admitted students friendly.',
          te: 'The principal greeted the newly admitted students friendly.',
        },
        misconceptionTag: 'FALSE_LY_ADJECTIVE_CONFUSION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The principal greeted the newly admitted students friendlily.',
          hi: 'The principal greeted the newly admitted students friendlily.',
          te: 'The principal greeted the newly admitted students friendlily.',
        },
        misconceptionTag: 'INVALID_ADVERB_DERIVATION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'The principal greeted friendly the newly admitted students.',
          hi: 'The principal greeted friendly the newly admitted students.',
          te: 'The principal greeted friendly the newly admitted students.',
        },
        misconceptionTag: 'FALSE_LY_ADJECTIVE_CONFUSION',
        isCorrect: false,
      },
    ],
    explanation: {
      en: '"Friendly" is a noun-derived adjective (friend + ly). Because English does not accept "friendly" as an adverb and "friendlily" is extremely awkward, standard idiom converts it into the prepositional adverbial phrase: "in a friendly manner / way".',
      hi: '"friendly" विशेषण है। क्रिया की विशेषता बताने के लिए "in a friendly manner" वाक्यांश का प्रयोग किया जाता है।',
      te: '"friendly" విశేషణం కాబట్టి క్రియ కోసం "in a friendly manner" అనే ఫ్రేజ్ వాడాలి.',
    },
    hint: {
      en: 'Since "friendly" is not an adverb, you need the prepositional phrase "in a ... manner".',
      hi: 'सही अभिव्यक्ति "in a friendly manner" होती है।',
      te: 'సరైన వ్యక్తీకరణ "in a friendly manner".',
    },
    misconceptionTags: ['FALSE_LY_ADJECTIVE_CONFUSION', 'INVALID_ADVERB_DERIVATION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_eng_adv_07',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c2',
    topicId: 'con_cbse8_eng_adv_c2',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Classify adverbs into 5 types and position frequency/manner adverbs accurately in sentences.',
    academicYear: '2026-2027',
    difficulty: 'Challenging',
    cognitiveSkill: 'ProblemSolving',
    expectedSolvingTimeSeconds: 50,
    questionType: 'mcq',
    prompt: {
      en: 'Follow the natural Manner -> Place -> Time (M-P-T) order to sequence the adverbials in: "The orchestra played [yesterday / passionately / at the auditorium]."',
      hi: 'M-P-T (Manner -> Place -> Time) नियम के अनुसार क्रियाविशेषणों का सही क्रम क्या होगा?',
      te: 'M-P-T (Manner -> Place -> Time) క్రమం ప్రకారం సరైన వాక్యం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'The orchestra played passionately (Manner) at the auditorium (Place) yesterday (Time).',
          hi: 'The orchestra played passionately (Manner) at the auditorium (Place) yesterday (Time).',
          te: 'The orchestra played passionately (Manner) at the auditorium (Place) yesterday (Time).',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'The orchestra played yesterday (Time) at the auditorium (Place) passionately (Manner).',
          hi: 'The orchestra played yesterday at the auditorium passionately.',
          te: 'The orchestra played yesterday at the auditorium passionately.',
        },
        misconceptionTag: 'SCRAMBLED_MPT_ORDER',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The orchestra played at the auditorium (Place) passionately (Manner) yesterday (Time).',
          hi: 'The orchestra played at the auditorium passionately yesterday.',
          te: 'The orchestra played at the auditorium passionately yesterday.',
        },
        misconceptionTag: 'SCRAMBLED_MPT_ORDER',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'The orchestra played yesterday (Time) passionately (Manner) at the auditorium (Place).',
          hi: 'The orchestra played yesterday passionately at the auditorium.',
          te: 'The orchestra played yesterday passionately at the auditorium.',
        },
        misconceptionTag: 'SCRAMBLED_MPT_ORDER',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'When multiple adverbs appear after a verb, the natural English order is M-P-T: Manner (passionately) -> Place (at the auditorium) -> Time (yesterday).',
      hi: 'वाक्य के अंत में सही क्रम M-P-T (Manner -> Place -> Time) होता है।',
      te: 'వాక్య అంత్య క్రమం M-P-T (విధానం -> స్థలం -> సమయం) ఉండాలి.',
    },
    hint: {
      en: 'Think M-P-T: How? Where? When?',
      hi: 'M-P-T याद रखें: कैसे? कहाँ? कब?',
      te: 'M-P-T గుర్తుంచుకోండి: ఎలా? ఎక్కడ? ఎప్పుడు?',
    },
    misconceptionTags: ['SCRAMBLED_MPT_ORDER'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_eng_adv_08',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c1',
    topicId: 'con_cbse8_eng_adv_c1',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Identify adverbs in sentences and differentiate them from qualifying adjectives.',
    academicYear: '2026-2027',
    difficulty: 'Application',
    cognitiveSkill: 'ProblemSolving',
    expectedSolvingTimeSeconds: 50,
    questionType: 'mcq',
    prompt: {
      en: 'Which sentence precisely conveys that "nobody except Meera" submitted the project on time?',
      hi: 'किस वाक्य का सटीक अर्थ है कि "मीरा के अलावा किसी और ने" प्रोजेक्ट समय पर जमा नहीं किया?',
      te: '"మీరా తప్ప ఇంకెవరూ" ప్రాజెక్ట్‌ను సమయానికి సమర్పించలేదు అనే ఖచ్చితమైన అర్థాన్నిచ్చే వాక్యం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Only Meera submitted the project on time.',
          hi: 'Only Meera submitted the project on time.',
          te: 'Only Meera submitted the project on time.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Meera only submitted the project on time.',
          hi: 'Meera only submitted the project on time.',
          te: 'Meera only submitted the project on time.',
        },
        misconceptionTag: 'MISPLACED_ONLY_MODIFIER',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Meera submitted only the project on time.',
          hi: 'Meera submitted only the project on time.',
          te: 'Meera submitted only the project on time.',
        },
        misconceptionTag: 'MISPLACED_ONLY_MODIFIER',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Meera submitted the project only on time.',
          hi: 'Meera submitted the project only on time.',
          te: 'Meera submitted the project only on time.',
        },
        misconceptionTag: 'MISPLACED_ONLY_MODIFIER',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'The adverb "only" modifies the word that immediately follows it. To emphasize that Meera alone submitted (and nobody else), "only" must precede "Meera": "Only Meera...".',
      hi: '"Only" जिस शब्द से पहले आता है, उसी को संशोधित करता है। अतः केवल मीरा को दर्शाने के लिए "Only Meera" सही है।',
      te: '"Only" ఏ పదానికి ముందు ఉంటే దానిని మాత్రమే ప్రభావితం చేస్తుంది. కాబట్టి "Only Meera" సరైనది.',
    },
    hint: {
      en: 'Place "only" directly before the subject person being isolated.',
      hi: '"only" को उस व्यक्ति के नाम से ठीक पहले रखें जिसे अकेला दर्शाना है।',
      te: '"only" ని నేరుగా వ్యక్తి పేరు ముందు ఉంచండి.',
    },
    misconceptionTags: ['MISPLACED_ONLY_MODIFIER'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },

  // Dedicated Adverbs Retest Questions
  {
    id: 'q_cbse8_retest_eng_adv_01',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c1',
    topicId: 'con_cbse8_eng_adv_c1',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Identify adverbs in sentences and differentiate them from qualifying adjectives.',
    academicYear: '2026-2027',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    expectedSolvingTimeSeconds: 40,
    questionType: 'mcq',
    prompt: {
      en: 'Retest Evaluation: In which of the following sentences does the word "hard" function as an ADVERB modifying an action verb?',
      hi: 'पुनः परीक्षा (Retest): किस वाक्य में "hard" शब्द किसी क्रिया की विशेषता बताने वाले क्रियाविशेषण के रूप में प्रयुक्त हुआ है?',
      te: 'మళ్లీ పరీక్ష (Retest): "hard" అనే పదం క్రియను వర్ణించే అడ్వెర్బ్‌గా ఉన్న వాక్యం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'The dedicated researchers worked hard to develop the new solar battery.',
          hi: 'The dedicated researchers worked hard to develop the new solar battery.',
          te: 'The dedicated researchers worked hard to develop the new solar battery.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Diamond is an exceptionally hard mineral capable of cutting glass.',
          hi: 'Diamond is an exceptionally hard mineral capable of cutting glass.',
          te: 'Diamond is an exceptionally hard mineral capable of cutting glass.',
        },
        misconceptionTag: 'ADJECTIVE_ADVERB_CONFUSION',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'The mathematics olympiad question was a hard puzzle for the class.',
          hi: 'The mathematics olympiad question was a hard puzzle for the class.',
          te: 'The mathematics olympiad question was a hard puzzle for the class.',
        },
        misconceptionTag: 'ADJECTIVE_ADVERB_CONFUSION',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'The coconut has a very hard outer shell protecting the kernel.',
          hi: 'The coconut has a very hard outer shell protecting the kernel.',
          te: 'The coconut has a very hard outer shell protecting the kernel.',
        },
        misconceptionTag: 'ADJECTIVE_ADVERB_CONFUSION',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'In "worked hard", "hard" answers how the researchers worked (modifying the verb "worked" -> Adverb). In the other options, "hard" modifies nouns (mineral, puzzle, shell) and is an adjective.',
      hi: '"worked hard" में "hard" क्रिया "worked" का तरीका बताता है (Adverb)। बाकी वाक्यों में यह संज्ञाओं की विशेषता बताने वाला विशेषण (Adjective) है।',
      te: '"worked hard" లో "hard" క్రియ "worked" ను వర్ణిస్తుంది (Adverb). మిగిలిన వాటిలో నామవాచకాలను వర్ణించే విశేషణం.',
    },
    hint: {
      en: 'Look for the sentence where "hard" describes the action of a verb, not the physical firmness of an object.',
      hi: 'देखें कि कहाँ "hard" किसी कार्य करने का तरीका बता रहा है।',
      te: 'పని ఎలా జరిగిందో తెలిపే సందర్భాన్ని చూడండి.',
    },
    misconceptionTags: ['ADJECTIVE_ADVERB_CONFUSION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  {
    id: 'q_cbse8_retest_eng_adv_02',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c2',
    topicId: 'con_cbse8_eng_adv_c2',
    topicTitle: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    learningOutcome: 'Classify adverbs into 5 types and position frequency/manner adverbs accurately in sentences.',
    academicYear: '2026-2027',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    expectedSolvingTimeSeconds: 45,
    questionType: 'mcq',
    prompt: {
      en: 'Retest Evaluation: Which sentence correctly positions the adverb of frequency "never" with a compound verb tense (auxiliary + main verb)?',
      hi: 'पुनः परीक्षा (Retest): संयुक्त क्रिया (auxiliary + main verb) के साथ आवृत्तिवाचक क्रियाविशेषण "never" का सही स्थान किस वाक्य में है?',
      te: 'మళ్లీ పరీక్ష (Retest): సంయుక్త క్రియ (auxiliary + main verb) ఉన్నప్పుడు frequency adverb "never" సరైన స్థానంలో ఉన్న వాక్యం ఏది?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Our science teacher has never arrived late to any laboratory demonstration.',
          hi: 'Our science teacher has never arrived late to any laboratory demonstration.',
          te: 'Our science teacher has never arrived late to any laboratory demonstration.',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Our science teacher never has arrived late to any laboratory demonstration.',
          hi: 'Our science teacher never has arrived late to any laboratory demonstration.',
          te: 'Our science teacher never has arrived late to any laboratory demonstration.',
        },
        misconceptionTag: 'MISPLACED_FREQUENCY_ADVERB',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Our science teacher has arrived never late to any laboratory demonstration.',
          hi: 'Our science teacher has arrived never late to any laboratory demonstration.',
          te: 'Our science teacher has arrived never late to any laboratory demonstration.',
        },
        misconceptionTag: 'MISPLACED_FREQUENCY_ADVERB',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Never our science teacher has arrived late to any laboratory demonstration.',
          hi: 'Never our science teacher has arrived late to any laboratory demonstration.',
          te: 'Never our science teacher has arrived late to any laboratory demonstration.',
        },
        misconceptionTag: 'MISPLACED_FREQUENCY_ADVERB',
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'In compound verb phrases, adverbs of frequency are positioned between the auxiliary verb ("has") and the main participle ("arrived"): [Subject + Auxiliary + Frequency + Main Verb].',
      hi: 'नियम: सहायक क्रिया (has) और मुख्य क्रिया (arrived) के बीच में frequency adverb आता है: "has never arrived"।',
      te: 'నియమం: సహాయక క్రియ (has) మరియు ప్రధాన క్రియ (arrived) మధ్యలో frequency adverb ఉంటుంది: "has never arrived".',
    },
    hint: {
      en: 'Place "never" directly between the helping verb "has" and the main verb "arrived".',
      hi: '"has" और "arrived" के ठीक बीच में "never" रखें।',
      te: '"has" మరియు "arrived" ల మధ్యలో "never" ను ఉంచండి.',
    },
    misconceptionTags: ['MISPLACED_FREQUENCY_ADVERB'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Additional CBSE Class 10 Science: Balancing Propane Combustion
  {
    id: 'q_cbse10_sci_chem_03',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 60,
    prompt: {
      en: 'In the complete balanced combustion reaction of propane: C3H8 + xO2 -> yCO2 + zH2O, what is the stoichiometric coefficient x of oxygen?',
      hi: 'प्रोपेन के पूर्ण दहन की संतुलित अभिक्रिया में C3H8 + xO2 -> yCO2 + zH2O, ऑक्सीजन का गुणांक x क्या है?',
      te: 'ప్రొపేన్ దహన చర్య తుల్య సమీకరణంలో C3H8 + xO2 -> yCO2 + zH2O, ఆక్సిజన్ గుణకం x ఎంత?',
    },
    choices: [
      {
        id: 'c1',
        text: { en: '5', hi: '5', te: '5' },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: { en: '10', hi: '10', te: '10' },
        misconceptionTag: 'CONFUSED_O2_MOLECULES_WITH_O_ATOMS',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: { en: '4', hi: '4', te: '4' },
        isCorrect: false,
      },
      {
        id: 'c4',
        text: { en: '3', hi: '3', te: '3' },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'C3H8 + 5O2 -> 3CO2 + 4H2O. Right hand side has 3x2 (from CO2) + 4x1 (from H2O) = 10 Oxygen atoms. Therefore 10/2 = 5 O2 molecules.',
      hi: 'दाहिनी ओर 3×2 + 4×1 = 10 ऑक्सीजन परमाणु हैं। अतः 10/2 = 5 O2 अणु होंगे।',
      te: 'కుడివైపు 3x2 + 4x1 = 10 ఆక్సిజన్ పరమాణువులు ఉంటాయి. కాబట్టి 10/2 = 5 O2 అణువులు అవసరం.',
    },
    hint: {
      en: 'Balance Carbon first (3), then Hydrogen (4), and count total Oxygen atoms on the right before dividing by 2.',
      hi: 'पहले कार्बन (3), फिर हाइड्रोजन (4) को संतुलित करें, फिर दाहिनी ओर के कुल ऑक्सीजन परमाणुओं को 2 से भाग दें।',
      te: 'మొదట కార్బన్, తర్వాత హైడ్రోజన్ తుల్యం చేసి కుడివైపు మొత్తం ఆక్సిజన్ పరమాణువులను 2 తో భాగించండి.',
    },
    misconceptionTags: ['CONFUSED_O2_MOLECULES_WITH_O_ATOMS'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Numerical Question: Thermal Decomposition of KClO3
  {
    id: 'q_cbse10_sci_chem_04',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    questionType: 'numerical',
    expectedSolvingTimeSeconds: 50,
    prompt: {
      en: 'In the balanced thermal decomposition reaction: 2KClO3(s) -> 2KCl(s) + nO2(g), enter the integer value of coefficient n.',
      hi: 'संतुलित उष्मीय अपघटन अभिक्रिया: 2KClO3(s) -> 2KCl(s) + nO2(g) में गुणांक n का पूर्णांक मान दर्ज करें।',
      te: 'తుల్య ఉష్ణ వియోగ చర్య: 2KClO3(s) -> 2KCl(s) + nO2(g) లో గుణకం n యొక్క సంఖ్యా విలువను నమోదు చేయండి.',
    },
    correctAnswerText: '3',
    acceptableTolerance: 0,
    explanation: {
      en: '2KClO3 contains 2 x 3 = 6 oxygen atoms on the left. On the right, n x 2 = 6, which gives n = 3.',
      hi: 'बाईं ओर 2 × 3 = 6 ऑक्सीजन परमाणु हैं। दाईं ओर n × 2 = 6, अतः n = 3।',
      te: 'ఎడమవైపు 2 x 3 = 6 ఆక్సిజన్ పరమాణువులు ఉన్నాయి. కాబట్టి కుడివైపు n x 2 = 6 అగుటచే n = 3.',
    },
    hint: {
      en: 'Multiply the coefficient 2 by the subscript 3 on oxygen, then determine how many O2 molecules equal 6 atoms.',
      hi: '2 को 3 से गुणा करके कुल 6 ऑक्सीजन परमाणु प्राप्त करें, फिर 6 को 2 से विभाजित करें।',
      te: '2 x 3 = 6 ఆక్సిజన్ పరమాణువులు. 6/2 = 3 O2 అణువులు.',
    },
    misconceptionTags: ['POLYATOMIC_OXYGEN_ACCOUNTING'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Numerical Question: Class 8 Math Fractions
  {
    id: 'q_cbse8_math_frac_04',
    board: 'CBSE',
    classLevel: '8',
    subject: 'Mathematics',
    chapterId: 'ch_cbse8_math_fractions',
    conceptId: 'con_cbse8_m1_c3',
    difficulty: 'Moderate',
    cognitiveSkill: 'Foundational',
    questionType: 'numerical',
    expectedSolvingTimeSeconds: 60,
    prompt: {
      en: 'Evaluate: (2/3) + (3/4) - (5/12). Enter the simplified integer result.',
      hi: 'मान ज्ञात कीजिए: (2/3) + (3/4) - (5/12)। सरल किया हुआ पूर्णांक मान दर्ज करें।',
      te: 'గణించండి: (2/3) + (3/4) - (5/12). సూక్ష్మీకరించిన పూర్ణాంక ఫలితాన్ని నమోదు చేయండి.',
    },
    correctAnswerText: '1',
    acceptableTolerance: 0,
    explanation: {
      en: 'LCM of 3, 4, 12 is 12. Convert numerators: 2/3 = 8/12, 3/4 = 9/12, 5/12 = 5/12. Then (8 + 9 - 5)/12 = 12/12 = 1.',
      hi: '3, 4, 12 का ल.स.प. (LCM) 12 है। (8 + 9 - 5)/12 = 12/12 = 1।',
      te: '3, 4, 12 ల క.సా.గు 12. (8 + 9 - 5)/12 = 12/12 = 1.',
    },
    hint: {
      en: 'Find the common denominator 12, then perform addition and subtraction of the adjusted numerators.',
      hi: 'उभयनिष्ठ हर 12 ज्ञात करें, फिर अंशों को जोड़ें और घटाएं।',
      te: 'హారాల క.సా.గు 12 కనుగొని లవాలను కూడి తీసివేయండి.',
    },
    misconceptionTags: ['FRACTION_ADDITION_ACROSS_NUMERATORS_DENOMINATORS'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Fill in the blank: Class 8 Math LCM
  {
    id: 'q_cbse8_math_frac_05',
    board: 'CBSE',
    classLevel: '8',
    subject: 'Mathematics',
    chapterId: 'ch_cbse8_math_fractions',
    conceptId: 'con_cbse8_m1_c3',
    difficulty: 'Easy',
    cognitiveSkill: 'Foundational',
    questionType: 'fill_in_the_blank',
    expectedSolvingTimeSeconds: 30,
    prompt: {
      en: 'To add unlike fractions with denominators 8 and 12, the Least Common Multiple (LCM) is ___.',
      hi: '8 और 12 हर वाले असमान भिन्नों को जोड़ने के लिए लघुत्तम समापवर्त्य (LCM) ___ है।',
      te: '8 మరియు 12 హారాలు గల భిన్నాలను కూడడానికి కనిష్ట సామాన్య గుణిజం (క.సా.గు) ___ .',
    },
    correctAnswerText: '24',
    explanation: {
      en: 'Multiples of 8: 8, 16, 24, 32... Multiples of 12: 12, 24, 36... The smallest common multiple is 24.',
      hi: '8 और 12 का सबसे छोटा उभयनिष्ठ गुणज 24 है।',
      te: '8 మరియు 12 ల కనిష్ట సామాన్య గుణిజం 24.',
    },
    hint: {
      en: 'Check the multiplication table of 12 for the first number divisible by 8.',
      hi: '12 के पहाड़े में 8 से विभाजित होने वाली पहली संख्या देखें।',
      te: '12 గుణిజాలలో 8 తో భాగించబడే మొదటి సంఖ్యను చూడండి.',
    },
    misconceptionTags: ['LCM_DENOMINATOR_MISCALCULATION'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // Numerical Question: Telangana SSC 10 Physical Science
  {
    id: 'q_ts10_ps_lens_02',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterId: 'ch_ts10_ps_lens',
    conceptId: 'con_ts10_ps_lens_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    questionType: 'numerical',
    expectedSolvingTimeSeconds: 45,
    prompt: {
      en: 'A convex lens used in spectacles has a focal length f = +20 cm. Calculate its optical power in dioptres (D).',
      hi: 'चश्मे में प्रयुक्त उत्तल लेंस की फोकस दूरी f = +20 सेमी है। डायोप्टर (D) में इसकी क्षमता की गणना करें।',
      te: 'ఒక కుంభాకార కటకం నాభ్యాంతరం f = +20 సెం.మీ. దాని కటక సామర్థ్యాన్ని డయాప్టర్లలో (D) లెక్కించండి.',
    },
    correctAnswerText: '5',
    acceptableTolerance: 0.1,
    explanation: {
      en: 'Power P = 1 / f (in metres). Since f = 20 cm = 0.2 m, P = 1 / 0.2 = +5 D.',
      hi: 'क्षमता P = 1 / f (मीटर में)। 20 सेमी = 0.2 मीटर, अतः P = 1 / 0.2 = +5 D।',
      te: 'కటక సామర్థ్యం P = 1 / f (మీటర్లలో). f = 20 సెం.మీ = 0.2 మీటర్లు. కాబట్టి P = 1 / 0.2 = +5 D.',
    },
    hint: {
      en: 'Remember to convert 20 cm into metres (0.2 m) before dividing 1 by f.',
      hi: '1 को f से भाग देने से पहले 20 सेमी को मीटर (0.2 मी) में बदलें।',
      te: '1 ని f తో భాగించే ముందు 20 సెం.మీ ని మీటర్లుగా (0.2 మీ) మార్చండి.',
    },
    misconceptionTags: ['UNIT_CONVERSION_CENTIMETRE_TO_METRE'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
  // CISCE Class 10 Chemistry
  {
    id: 'q_cisce10_chem_per_02',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    difficulty: 'Moderate',
    cognitiveSkill: 'Application',
    questionType: 'mcq',
    expectedSolvingTimeSeconds: 45,
    prompt: {
      en: 'Moving across Period 3 from Sodium (Na) to Chlorine (Cl), how do atomic radius and electronegativity vary?',
      hi: 'आवर्त 3 में सोडियम (Na) से क्लोरीन (Cl) की ओर जाने पर परमाणु त्रिज्या और विद्युत ऋणात्मकता में क्या परिवर्तन होता है?',
      te: '3వ పీరియడ్ లో సోడియం (Na) నుండి క్లోరిన్ (Cl) వైపు వెళ్ళే కొద్దీ పరమాణు వ్యాసార్థం మరియు ఋణవిద్యుదాత్మకత ఎలా మారతాయి?',
    },
    choices: [
      {
        id: 'c1',
        text: {
          en: 'Atomic radius decreases; Electronegativity increases',
          hi: 'परमाणु त्रिज्या घटती है; विद्युत ऋणात्मकता बढ़ती है',
          te: 'పరమాణు వ్యాసార్థం తగ్గుతుంది; ఋణవిద్యుదాత్మకత పెరుగుతుంది',
        },
        isCorrect: true,
      },
      {
        id: 'c2',
        text: {
          en: 'Both atomic radius and electronegativity increase',
          hi: 'दोनों बढ़ते हैं',
          te: 'రెండూ పెరుగుతాయి',
        },
        misconceptionTag: 'CONFUSED_PERIODIC_TRENDS',
        isCorrect: false,
      },
      {
        id: 'c3',
        text: {
          en: 'Atomic radius increases; Electronegativity decreases',
          hi: 'परमाणु त्रिज्या बढ़ती है; विद्युत ऋणात्मकता घटती है',
          te: 'పరమాణు వ్యాసార్థం పెరుగుతుంది; ఋణవిద్యుదాత్మకత తగ్గుతుంది',
        },
        misconceptionTag: 'INVERTED_PERIODIC_TRENDS',
        isCorrect: false,
      },
      {
        id: 'c4',
        text: {
          en: 'Both remain constant across a period',
          hi: 'दोनों स्थिर रहते हैं',
          te: 'రెండూ స్థిరంగా ఉంటాయి',
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: 'Across a period, nuclear charge increases while electron shells remain constant, pulling electrons closer (smaller radius) and increasing nuclear attraction for bonding electrons (higher electronegativity).',
      hi: 'आवर्त में प्रभावी नाभिकीय आवेश बढ़ने से परमाणु त्रिज्या घटती है और विद्युत ऋणात्मकता बढ़ती है।',
      te: 'పీరియడ్ లో కేంద్రక ఆవేశం పెరగడం వల్ల పరమాణు వ్యాసార్థం తగ్గి, ఋణవిద్యుదాత్మకత పెరుగుతుంది.',
    },
    hint: {
      en: 'Nuclear charge increases with constant shells across a period.',
      hi: 'आवर्त में कोशों की संख्या समान रहती है परन्तु नाभिकीय आवेश बढ़ता है।',
      te: 'పీరియడ్ లో కక్ష్యల సంఖ్య మారదు కానీ కేంద్రక ఆవేశం పెరుగుతుంది.',
    },
    misconceptionTags: ['CONFUSED_PERIODIC_TRENDS'],
    isVerified: true,
    approvalStatus: 'Approved',
    source: 'Official Curriculum',
  },
];
