/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LessonContent } from './types.js';

export const completeLessonsList: LessonContent[] = [
  // 1. CBSE Class 10 Science - Balancing Chemical Equations & Mass Conservation
  {
    id: 'les_cbse10_sci_chem_c1',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    title: 'Balancing Chemical Equations & Law of Conservation of Mass',
    topicIntroduction: {
      en: 'A chemical reaction represents the transformation of reactants into products. Because atoms are indivisible in chemical transformations, balancing equations is the foundational skill of all chemistry.',
      hi: 'रासायनिक अभिक्रिया अभिकारकों के उत्पादों में रूपांतरण को दर्शाती है। चूँकि परमाणु रासायनिक क्रियाओं में न तो नष्ट होते हैं और न बनते हैं, समीकरण को संतुलित करना रसायन विज्ञान का आधार है।',
      te: 'రసాయన చర్య అనేది క్రియాజనకాలు క్రియాజన్యాలుగా మారే ప్రక్రియను సూచిస్తుంది. రసాయన చర్యల్లో పరమాణువులు నాశనం కావు కాబట్టి సమీకరణాలను తుల్యం చేయడం రసాయన శాస్త్రానికి పునాది.',
    },
    whyLearn: {
      en: 'Mastering chemical balancing enables you to calculate theoretical yields, avoid toxic byproduct oversights in industrial synthesis, and predict exact reagent requirements in laboratories.',
      hi: 'रासायनिक संतुलन में निपुणता से आप प्रयोगशालाओं और उद्योगों में पदार्थों की सही मात्रा की गणना कर सकते हैं।',
      te: 'రసాయన తుల్యత నేర్చుకోవడం ద్వారా ప్రయోగశాలల్లో మరియు పరిశ్రమల్లో అవసరమైన రసాయనాల పరిమాణాన్ని ఖచ్చితంగా లెక్కించవచ్చు.',
    },
    learningObjectives: [
      'State and apply Antoine Lavoisier\'s Law of Conservation of Mass to skeletal reactions',
      'Execute the step-by-step hit-and-trial method by prioritizing elements with greatest atomic imbalance',
      'Incorporate mandatory physical state symbols: (s), (l), (g), and (aq) alongside temperature/catalyst notations',
      'Distinguish subscripts (which define molecular identity) from stoichiometric coefficients (which specify molar quantities)',
    ],
    prerequisiteKnowledge: [
      {
        en: 'Class 9 Dalton\'s Atomic Theory: Atoms cannot be created, destroyed, or divided during chemical reactions.',
        hi: 'कक्षा 9 डॉल्टन का परमाणु सिद्धांत: रासायनिक क्रियाओं में परमाणु अविभाज्य रहते हैं।',
        te: '9వ తరగతి డాల్టన్ పరమాణు సిద్ధాంతం: రసాయన చర్యల్లో పరమాణువులు సృష్టించబడవు లేదా నాశనం కావు.',
      },
      {
        en: 'Chemical formula writing and valency rules for binary compounds and polyatomic ions (e.g., SO4^2-, NO3^-, OH^-).',
        hi: 'बहुपरमाणुक आयनों और यौगिकों के रासायनिक सूत्र व संयोजकता नियम।',
        te: 'బహుళ పరమాణుక అయాన్లు మరియు సంయోజకత సూత్రాలు.',
      },
    ],
    explanation: {
      en: 'According to the Law of Conservation of Mass, the total mass of the reactants must equal the total mass of the products. Consequently, the total number of atoms of each individual element on the left-hand side (LHS) must strictly equal the number of atoms on the right-hand side (RHS). To achieve this, you place whole-number stoichiometric coefficients directly in front of the chemical formulas. You must NEVER modify subscript numbers inside a chemical formula (e.g., changing H2O to H2O2 is forbidden because H2O2 is hydrogen peroxide, a toxic antiseptic bleach, not water!).',
      hi: 'द्रव्यमान संरक्षण के नियम के अनुसार, अभिकारकों का कुल द्रव्यमान उत्पादों के कुल द्रव्यमान के बराबर होना चाहिए। अतः दोनों ओर प्रत्येक तत्व के परमाणुओं की संख्या बराबर होनी चाहिए। इसके लिए सूत्र के आगे पूर्ण गुणांक (coefficients) लगाए जाते हैं। सूत्र के भीतर के पादांक (subscript) को कभी न बदलें!',
      te: 'ద్రవ్య నిత్యత్వ నియమం ప్రకారం క్రియాజనకాల మొత్తం ద్రవ్యరాశి క్రియాజన్యాల మొత్తం ద్రవ్యరాశికి సమానంగా ఉండాలి. బాణం గుర్తుకు ఇరువైపులా ప్రతి మూలకపు పరమాణువుల సంఖ్య సమానంగా ఉండేలా ఫార్ములా ముందు గుణకాలను మాత్రమే చేర్చాలి. ఫార్ములా లోపలి సంఖ్యలను ఎప్పుడూ మార్చరాదు!',
    },
    definitions: [
      {
        term: 'Skeletal Chemical Equation',
        definition: {
          en: 'An unbalanced chemical equation that shows the reactants and products using chemical symbols without equalizing atom counts.',
          hi: 'एक असंतुलित रासायनिक समीकरण जो केवल अभिकारकों और उत्पादों के सूत्रों को दर्शाता है।',
          te: 'పరమాణువుల సంఖ్య సమానంగా లేని ప్రాథమిక రసాయన సమీకరణం.',
        },
      },
      {
        term: 'Stoichiometric Coefficient',
        definition: {
          en: 'A whole number written in front of a chemical formula indicating the relative number of molecules or moles reacting or produced.',
          hi: 'रासायनिक सूत्र के आगे लिखी जाने वाली पूर्ण संख्या जो अणुओं या मोल्स की संख्या दर्शाती है।',
          te: 'రసాయన చర్యలో పాల్గొనే లేదా ఏర్పడే అణువుల నిష్పత్తిని తెలిపే గుణకం.',
        },
      },
    ],
    principlesAndRules: [
      {
        heading: 'The 4 Golden Rules of Chemical Balancing',
        rule: {
          en: '1. Enclose chemical formulas in protective boxes; never alter characters inside the box.\n2. Count atoms on LHS and RHS in an Atom Inventory Table.\n3. Balance the compound containing the maximum number of atoms first (typically Oxygen or polyatomic radicals).\n4. Balance elemental metals and gases (like Fe, H2, O2) last.',
          hi: '1. रासायनिक सूत्रों को कभी न बदलें। 2. दोनों पक्षों के परमाणुओं की सूची बनाएं। 3. सबसे बड़े यौगिक से संतुलन शुरू करें। 4. स्वतंत्र तत्वों को अंत में संतुलित करें।',
          te: '1. ఫార్ములాలను మార్చకూడదు. 2. ఇరువైపులా పరమాణువులను లెక్కించాలి. 3. ఎక్కువ పరమాణువులు గల పదార్థంతో ప్రారంభించాలి. 4. ఒంటరి మూలకాలను చివరగా తుల్యం చేయాలి.',
        },
        formulaOrStructure: 'Total Mass (Reactants) = Total Mass (Products)',
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'Balance the reaction of heated iron with steam: Fe(s) + H2O(g) -> Fe3O4(s) + H2(g)',
          hi: 'लाल तप्त लोहे की भाप के साथ अभिक्रिया को संतुलित करें: Fe(s) + H2O(g) -> Fe3O4(s) + H2(g)',
          te: 'ఇనుము నీటి ఆవిరితో జరిపే చర్యను తుల్యం చేయండి: Fe(s) + H2O(g) -> Fe3O4(s) + H2(g)',
        },
        stepByStep: [
          {
            en: 'Step 1 (Atom Inventory): LHS has 1 Fe, 2 H, 1 O. RHS has 3 Fe, 2 H, 4 O. Oxygen has greatest imbalance (1 vs 4).',
            hi: 'चरण 1: बाएं पक्ष में 1 Fe, 2 H, 1 O है; दाएं पक्ष में 3 Fe, 2 H, 4 O है।',
            te: 'దశ 1: ఎడమవైపు 1 Fe, 2 H, 1 O; కుడివైపు 3 Fe, 2 H, 4 O ఉన్నాయి.',
          },
          {
            en: 'Step 2 (Balance Oxygen): Place coefficient 4 in front of H2O: Fe + 4H2O -> Fe3O4 + H2. Oxygen is now 4 on both sides.',
            hi: 'चरण 2: H2O के आगे 4 लगाएं: Fe + 4H2O -> Fe3O4 + H2। ऑक्सीजन संतुलित हो गया।',
            te: 'దశ 2: H2O ముందు 4 ఉంచండి: Fe + 4H2O -> Fe3O4 + H2. ఆక్సిజన్ తుల్యమైంది.',
          },
          {
            en: 'Step 3 (Balance Hydrogen): LHS now has 4 x 2 = 8 H atoms. Place 4 in front of H2 on RHS: Fe + 4H2O -> Fe3O4 + 4H2.',
            hi: 'चरण 3: बाएं 8 हाइड्रोजन हैं। दाएं H2 के आगे 4 लगाएं: Fe + 4H2O -> Fe3O4 + 4H2।',
            te: 'దశ 3: ఎడమవైపు 8 H లు ఉన్నాయి. కుడివైపు H2 ముందు 4 ఉంచండి: Fe + 4H2O -> Fe3O4 + 4H2.',
          },
          {
            en: 'Step 4 (Balance Iron): RHS has 3 Fe atoms. Place 3 in front of Fe on LHS: 3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g).',
            hi: 'चरण 4: दाएं 3 Fe हैं। बाएं Fe के आगे 3 लगाएं: 3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)।',
            te: 'దశ 4: కుడివైపు 3 Fe లు ఉన్నాయి. ఎడమవైపు Fe ముందు 3 ఉంచండి: 3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g).',
          },
        ],
        finalAnswer: '3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)',
        keyInsight: {
          en: 'Check: Fe: 3=3, H: 8=8, O: 4=4. All atoms conserved. State symbols reflect iron metal and water vapor.',
          hi: 'जाँच: Fe: 3=3, H: 8=8, O: 4=4। द्रव्यमान पूर्णतः संरक्षित है।',
          te: 'తనిఖీ: Fe: 3=3, H: 8=8, O: 4=4. అన్ని పరమాణువులు సమానమయ్యాయి.',
        },
      },
    ],
    diagramsAndTables: [
      {
        title: 'Atom Tabulation Table for Fe + H2O Reaction',
        description: {
          en: 'Comparison of initial versus balanced atomic counts across reactants and products.',
          hi: 'अभिकारकों और उत्पादों के बीच परमाणुओं की तुलना तालिका।',
          te: 'క్రియాజనకాలు మరియు క్రియాజన్యాల పరమాణువుల పట్టిక.',
        },
        asciiDiagramOrTable:
          '+---------+---------------+-----------------+-------------------+\n' +
          '| Element | Initial LHS   | Initial RHS     | Final Balanced    |\n' +
          '+---------+---------------+-----------------+-------------------+\n' +
          '| Fe      | 1             | 3               | 3 (3Fe)           |\n' +
          '| H       | 2             | 2               | 8 (4H2O = 4H2)    |\n' +
          '| O       | 1             | 4               | 4 (4H2O = Fe3O4)  |\n' +
          '+---------+---------------+-----------------+-------------------+',
      },
    ],
    realWorldApplications: [
      {
        en: 'Automotive Airbags: The rapid decomposition of sodium azide (2NaN3 -> 2Na + 3N2) requires exact stoichiometric balancing to inflate the bag with non-toxic nitrogen gas in 40 milliseconds.',
        hi: 'कारों के एयरबैग: सोडियम एजाइड का सटीक संतुलित विघटन 40 मिलीसेकंड में नाइट्रोजन गैस भरकर जान बचाता है।',
        te: 'కారు ఎయిర్‌బ్యాగ్‌లు: సోడియం అజైడ్ ఖచ్చితమైన రసాయన చర్య ద్వారా 40 మిల్లీసెకన్లలో నైట్రోజన్ వాయువును విడుదల చేసి ప్రయాణికులను కాపాడుతుంది.',
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Writing subscripts to balance atoms: e.g., H2 + O2 -> H2O2 to balance oxygen.',
          hi: 'ऑक्सीजन संतुलित करने के लिए H2 + O2 -> H2O2 लिखना।',
          te: 'ఆక్సిజన్ తుల్యం చేయడానికి H2O2 అని ఫార్ములా మార్చడం.',
        },
        correction: {
          en: 'Subscripts alter compound identity (H2O2 is toxic hydrogen peroxide, not water). Write 2H2 + O2 -> 2H2O.',
          hi: 'H2O2 हाइड्रोजन परॉक्साइड है, जल नहीं। सही रूप 2H2 + O2 -> 2H2O है।',
          te: 'H2O2 అంటే హైడ్రోజన్ పెరాక్సైడ్, నీరు కాదు. సరైన సమీకరణం: 2H2 + O2 -> 2H2O.',
        },
        whyItHappens: {
          en: 'Students forget that chemical formulas represent fixed molecular bonds governed by valency.',
          hi: 'छात्र भूल जाते हैं कि रासायनिक सूत्र संयोजकता से बंधे होते हैं।',
          te: 'రసాయన సూత్రాలు స్థిర బంధాలతో ఏర్పడతాయని విద్యార్థులు మరిచిపోవడం.',
        },
      },
    ],
    importantPoints: [
      {
        en: 'A balanced chemical equation provides quantitative stoichiometric ratios between reactants and products.',
        hi: 'संतुलित समीकरण अभिकारकों और उत्पादों के बीच मात्रात्मक अनुपात प्रदान करता है।',
        te: 'తుల్య రసాయన సమీకరణం పదార్థాల మధ్య పరిమాణాత్మక నిష్పత్తులను అందిస్తుంది.',
      },
      {
        en: 'Always reduce coefficients to the lowest whole-number ratio (e.g. 2H2 + O2 -> 2H2O, not 4H2 + 2O2 -> 4H2O).',
        hi: 'गुणांकों को हमेशा न्यूनतम पूर्णांक अनुपात में रखें।',
        te: 'గుణకాలను ఎల్లప్పుడూ కనిష్ట పూర్ణాంక నిష్పత్తిలో ఉంచాలి.',
      },
    ],
    revisionNotes: [
      {
        en: 'Step 1: Write correct skeletal formulas. Step 2: Tabulate atom counts. Step 3: Equalize largest atom count first using coefficients. Step 4: Verify all elements and add state symbols.',
        hi: 'कंकाली सूत्र लिखें -> परमाणुओं की गणना करें -> बड़े यौगिक को पहले संतुलित करें -> भौतिक अवस्थाएं लिखें।',
        te: 'ప్రాథమిక సమీకరణం రాయండి -> పరమాణువులను లెక్కించండి -> గుణకాలతో తుల్యం చేయండి -> భౌతిక స్థితులను గుర్తించండి.',
      },
    ],
    topicSummary: {
      en: 'Balancing chemical equations is an expression of mass invariance. Coefficients scale molecular quantities without modifying molecular structures, enabling precise quantitative chemical analysis.',
      hi: 'रासायनिक संतुलन द्रव्यमान संरक्षण का व्यावहारिक रूप है जो अणुओं की संरचना बदले बिना उनकी मात्रा को संतुलित करता है।',
      te: 'రసాయన సమీకరణాలను తుల్యం చేయడం అనేది ద్రవ్య నిత్యత్వ నియమానికి ప్రతీక. ఇది పదార్థాల స్వభావాన్ని మార్చకుండా వాటి పరిమాణాలను సమతుల్యం చేస్తుంది.',
    },
    knowledgeCheckQuestions: [
      {
        question: {
          en: 'What is the coefficient of oxygen in the balanced combustion equation: CH4 + ?O2 -> CO2 + 2H2O?',
          hi: 'CH4 + ?O2 -> CO2 + 2H2O के संतुलित समीकरण में ऑक्सीजन का गुणांक क्या होगा?',
          te: 'CH4 + ?O2 -> CO2 + 2H2O తుల్య సమీకరణంలో ఆక్సిజన్ గుణకం ఎంత?',
        },
        answer: {
          en: 'Coefficient is 2 (CH4 + 2O2 -> CO2 + 2H2O, yielding 4 oxygen atoms on both sides).',
          hi: 'गुणांक 2 है (CH4 + 2O2 -> CO2 + 2H2O)।',
          te: 'గుణకం 2 (CH4 + 2O2 -> CO2 + 2H2O).',
        },
        quickTip: {
          en: 'Count product oxygens: 2 from CO2 + 2 from 2H2O = 4 atoms. 4 / 2 = 2 molecules of O2.',
          hi: 'उत्पाद में 2 (CO2) + 2 (2H2O) = 4 ऑक्सीजन हैं। 4 / 2 = 2।',
          te: 'కుడివైపు మొత్తం 4 ఆక్సిజన్ పరమాణువులు ఉన్నాయి కాబట్టి 2 O2 అణువులు అవసరం.',
        },
      },
    ],
    practiceExercises: [
      {
        instruction: {
          en: 'Balance the following neutralization reaction and include physical state symbols:',
          hi: 'निम्नलिखित उदासीनीकरण अभिक्रिया को संतुलित करें और भौतिक अवस्थाएं लिखें:',
          te: 'కింది తటస్థీకరణ చర్యను తుల్యం చేసి భౌతిక స్థితులను రాయండి:',
        },
        exerciseProblem: {
          en: 'HNO3(aq) + Ca(OH)2(aq) -> Ca(NO3)2(aq) + H2O(l)',
          hi: 'HNO3(aq) + Ca(OH)2(aq) -> Ca(NO3)2(aq) + H2O(l)',
          te: 'HNO3(aq) + Ca(OH)2(aq) -> Ca(NO3)2(aq) + H2O(l)',
        },
        solutionHint: {
          en: 'Notice NO3 is taken twice in Ca(NO3)2; place 2 in front of HNO3, which produces 2H2O.',
          hi: 'Ca(NO3)2 में 2 नाइट्रेट हैं, इसलिए HNO3 के आगे 2 लगाएं।',
          te: 'Ca(NO3)2 లో 2 నైట్రేట్లు ఉన్నాయి కాబట్టి 2HNO3 అని రాయాలి.',
        },
      },
    ],
    summaryPoints: [
      {
        en: 'Total mass and individual atomic counts are invariant across any closed chemical reaction.',
        hi: 'किसी भी बंद रासायनिक क्रिया में कुल द्रव्यमान और प्रत्येक परमाणु की संख्या स्थिर रहती है।',
        te: 'రసాయన చర్యకు ముందు మరియు తరువాత మొత్తం ద్రవ్యరాశి మరియు పరమాణువుల సంఖ్య మారదు.',
      },
    ],
  },

  // 2. CBSE Class 10 English - Reported Speech: Tense Backshifting & Pronoun Transformation
  {
    id: 'les_cbse10_eng_c1',
    chapterId: 'ch_cbse10_eng_grammar',
    conceptId: 'con_cbse10_eng_c1',
    title: 'Reported Speech: Tense Backshifting & Pronoun Transformation',
    topicIntroduction: {
      en: 'Direct speech quotes the exact words spoken by a person inside inverted commas. Indirect or reported speech narrates what was said from the narrator\'s perspective without using exact quotes.',
      hi: 'प्रत्यक्ष कथन (Direct Speech) वक्ता के मूल शब्दों को उद्धरण चिह्नों में रखता है। अप्रत्यक्ष कथन (Reported Speech) उन शब्दों को अपनी भाषा में प्रस्तुत करता है।',
      te: 'డైరెక్ట్ స్పీచ్ లో వ్యక్తి మాట్లాడిన ఖచ్చితమైన మాటలు కొటేషన్లలో ఉంటాయి. ఇండైరెక్ట్ స్పీచ్ లో ఆ మాటల భావాన్ని మన మాటలలో చెబుతాము.',
    },
    whyLearn: {
      en: 'Essential for journalistic reporting, academic essay synthesis, professional business minutes, formal correspondence, and board examinations.',
      hi: 'समाचार लेखन, आधिकारिक पत्र व्यवहार, संवाद सारांश और बोर्ड परीक्षाओं के लिए अत्यंत महत्वपूर्ण।',
      te: 'వార్తా రచన, వ్యాసాలు, అధికారిక ఉత్తర ప్రత్యుత్తరాలు మరియు పరీక్షల కోసం ఎంతో ముఖ్యం.',
    },
    learningObjectives: [
      'Apply tense backshifting rules when the reporting verb is in the past tense',
      'Accurately adjust first and second person personal/possessive pronouns to third person',
      'Transform time, place, and proximity markers (e.g. today -> that day, tomorrow -> the next day)',
      'Identify exceptions where universal scientific truths retain present tense',
    ],
    prerequisiteKnowledge: [
      {
        en: 'Classification of tenses: Simple Present, Present Continuous, Present Perfect, Simple Past, and Past Perfect.',
        hi: 'कालों का ज्ञान: सामान्य वर्तमान, अपूर्ण वर्तमान, पूर्ण वर्तमान, सामान्य भूतकाल।',
        te: 'టెన్సెస్ వర్గీకరణ మరియు వాటి సహాయక క్రియల పరిజ్ఞానం.',
      },
    ],
    explanation: {
      en: 'The transformation into reported speech depends fundamentally on the tense of the reporting verb. If the reporting verb is in the present or future tense (e.g. "He says" or "She will say"), the tense inside the reported clause does NOT change. However, when the reporting verb is in the past tense (e.g. "He said", "They told"), the verbs inside undergo a systematic chronological shift one step into the past. Simple Present becomes Simple Past, Present Continuous becomes Past Continuous, and critically, Simple Past shifts to Past Perfect!',
      hi: 'जब रिपोर्टिंग क्रिया भूतकाल में हो ("He said"), तो प्रत्यक्ष कथन का काल एक चरण पीछे चला जाता है: सामान्य वर्तमान -> सामान्य भूतकाल, तथा सामान्य भूतकाल -> पूर्ण भूतकाल! यदि रिपोर्टिंग क्रिया वर्तमान में हो ("He says"), तो काल नहीं बदलता।',
      te: 'రిపోర్టింగ్ వెర్బ్ భూతకాలంలో ("He said") ఉన్నప్పుడు మాత్రమే టెన్స్ వెనక్కి మారుతుంది: Simple Present కాస్త Simple Past గాను, Simple Past కాస్త Past Perfect గాను మారుతుంది. ఒకవేళ రిపోర్టింగ్ వెర్బ్ వర్తమానంలో ("He says") ఉంటే టెన్స్ మారదు.',
    },
    definitions: [
      {
        term: 'Reporting Verb',
        definition: {
          en: 'The introductory verb (such as said, asked, exclaimed, stated) that introduces the spoken quotation.',
          hi: 'वह क्रिया जो कथन की शुरुआत करती है (जैसे said, told, inquired)।',
          te: 'ప్రత్యక్ష వాక్యాన్ని పరిచయం చేసే క్రియ (said, asked, told).',
        },
      },
      {
        term: 'Tense Backshifting',
        definition: {
          en: 'The grammatical movement of a verb form into a corresponding past tense when subordinate to a past-tense reporting verb.',
          hi: 'भूतकाल की रिपोर्टिंग क्रिया के प्रभाव से मुख्य वाक्य के काल का एक चरण पीछे खिसकना।',
          te: 'గతకాలపు రిపోర్టింగ్ వెర్బ్ ప్రభావం వల్ల వాక్యంలోని క్రియ మరింత వెనుకటి కాలంలోకి మారడం.',
        },
      },
    ],
    principlesAndRules: [
      {
        heading: 'Complete Tense Backshifting Matrix',
        rule: {
          en: 'Simple Present ("am/is/are/write") -> Simple Past ("was/were/wrote")\nPresent Continuous ("is writing") -> Past Continuous ("was writing")\nPresent Perfect ("has written") -> Past Perfect ("had written")\nSimple Past ("wrote") -> Past Perfect ("had written")\nModals: can -> could, will -> would, may -> might, must -> had to',
          hi: 'Simple Present -> Simple Past; Present Continuous -> Past Continuous; Present Perfect -> Past Perfect; Simple Past -> Past Perfect; can -> could; will -> would.',
          te: 'Simple Present -> Simple Past; Present Continuous -> Past Continuous; Present Perfect -> Past Perfect; Simple Past -> Past Perfect; can -> could; will -> would.',
        },
        formulaOrStructure: 'Subject + Reporting Verb + that + Transformed Pronoun + Backshifted Verb',
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'Convert: Arjun said to Priya, "I saw an incredible documentary on lunar exploration yesterday."',
          hi: 'परोक्ष कथन में बदलें: Arjun said to Priya, "I saw an incredible documentary on lunar exploration yesterday."',
          te: 'ఇండైరెక్ట్ స్పీచ్ లోకి మార్చండి: Arjun said to Priya, "I saw an incredible documentary on lunar exploration yesterday."',
        },
        stepByStep: [
          {
            en: 'Step 1: Convert reporting verb with object: "said to Priya" becomes "told Priya that".',
            hi: 'चरण 1: "said to Priya" बदलकर "told Priya that" बन जाता है।',
            te: 'దశ 1: "said to Priya" కాస్త "told Priya that" గా మారుతుంది.',
          },
          {
            en: 'Step 2: Change first-person pronoun: "I" refers to Arjun, so it becomes "he".',
            hi: 'चरण 2: सर्वनाम "I" अर्जुन के अनुसार "he" बनता है।',
            te: 'దశ 2: "I" అర్జున్‌ను సూచిస్తుంది కాబట్టి "he" అవుతుంది.',
          },
          {
            en: 'Step 3: Backshift verb: Simple Past "saw" must shift to Past Perfect "had seen".',
            hi: 'चरण 3: Simple Past "saw" बदलकर Past Perfect "had seen" बनेगा।',
            te: 'దశ 3: Simple Past "saw" కాస్త Past Perfect "had seen" గా మారుతుంది.',
          },
          {
            en: 'Step 4: Shift time adverbial: "yesterday" becomes "the previous day" or "the day before".',
            hi: 'चरण 4: समय सूचक "yesterday" बदलकर "the previous day" बनेगा।',
            te: 'దశ 4: "yesterday" కాస్త "the previous day" గా మారుతుంది.',
          },
        ],
        finalAnswer: 'Arjun told Priya that he had seen an incredible documentary on lunar exploration the previous day.',
        keyInsight: {
          en: 'Simple past verbs NEVER stay simple past in indirect speech when reporting past events; they always backshift to past perfect (had + V3).',
          hi: 'भूतकाल की क्रिया परोक्ष कथन में सदैव Past Perfect (had + V3) में बदलती है।',
          te: 'భూతకాలపు క్రియలు ఇండైరెక్ట్ స్పీచ్‌లో ఎల్లప్పుడూ Past Perfect (had + V3) గా మారాలి.',
        },
      },
    ],
    diagramsAndTables: [
      {
        title: 'Time & Place Adverbial Conversion Table',
        description: {
          en: 'Standard shifts of proximity expressions into distal reported markers.',
          hi: 'समय और स्थान सूचक शब्दों के परिवर्तन की तालिका।',
          te: 'సమయ మరియు స్థాన సూచికల మార్పు పట్టిక.',
        },
        asciiDiagramOrTable:
          '+--------------------+-------------------------------------+\n' +
          '| Direct Speech      | Reported (Indirect) Speech          |\n' +
          '+--------------------+-------------------------------------+\n' +
          '| now                | then                                |\n' +
          '| today              | that day                            |\n' +
          '| tonight            | that night                           |\n' +
          '| yesterday          | the previous day / the day before   |\n' +
          '| tomorrow           | the next day / the following day    |\n' +
          '| last week          | the previous week                   |\n' +
          '| here               | there                               |\n' +
          '| this / these       | that / those                        |\n' +
          '+--------------------+-------------------------------------+',
      },
    ],
    realWorldApplications: [
      {
        en: 'Courtroom Legal Transcripts: Testimonies given by witnesses must be recorded in indirect speech with precise tense fidelity to preserve evidentiary chronology.',
        hi: 'अदालती कार्यवाही: गवाहों के बयानों को काल की सटीकता के साथ अप्रत्यक्ष कथन में दर्ज किया जाता है।',
        te: 'న్యాయస్థాన ప్రక్రియలు: సాక్షుల వాంగ్మూలాలను ఖచ్చితమైన కాల క్రమంలో పరోక్ష కథనంలో నమోదు చేస్తారు.',
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Using "told to": e.g., "Arjun told to Priya that..."',
          hi: '"told to" का प्रयोग करना: जैसे "Arjun told to Priya..."',
          te: '"told to" అని రాయడం.',
        },
        correction: {
          en: '"Told" is transitive and takes a direct object without "to": "Arjun told Priya that...".',
          hi: '"told" के बाद "to" नहीं लगता: "Arjun told Priya..." सही है।',
          te: '"told" తర్వాత "to" రాదు: "Arjun told Priya that..." సరైనది.',
        },
        whyItHappens: {
          en: 'Confusing "said to" (which requires preposition) with "told" (which directly takes an indirect object).',
          hi: '"said to" और "told" के नियमों में भ्रम।',
          te: '"said to" మరియు "told" మధ్య వ్యత్యాసాన్ని గమనించకపోవడం.',
        },
      },
    ],
    importantPoints: [
      {
        en: 'Universal Scientific Truths & Habits: Do NOT change tense if statement describes permanent natural laws (e.g. "He said that water boils at 100°C").',
        hi: 'सार्वभौमिक सत्य और वैज्ञानिक नियमों का काल कभी नहीं बदलता (जैसे जल 100°C पर उबलता है)।',
        te: 'సార్వత్రిక సత్యాలు మరియు శాస్త్రీయ నియమాల కాలం మారదు (ఉదా: నీరు 100°C వద్ద మరుగుతుంది).',
      },
    ],
    revisionNotes: [
      {
        en: 'Rule Checklist: (1) Check reporting verb tense. (2) Replace inverted commas with "that". (3) Shift pronouns. (4) Backshift verbs (Present->Past, Past->Past Perfect). (5) Adjust time expressions.',
        hi: 'जाँच सूची: रिपोर्टिंग वर्ब -> उद्धरण हटाएं -> सर्वनाम बदलें -> काल पीछे खिसकाएं -> समय सूचक बदलें।',
        te: 'ముఖ్య నియమాలు: రిపోర్టింగ్ వెర్బ్ -> కొటేషన్లు తొలగించి that చేర్చడం -> సర్వనామాల మార్పు -> టెన్స్ మార్పు -> సమయ సూచికల మార్పు.',
      },
    ],
    topicSummary: {
      en: 'Reported speech allows seamless narration of dialogue. Mastery hinges upon synchronizing pronoun perspective, chronological tense backshifting, and situational adverbial conversions.',
      hi: 'परोक्ष कथन संवादों को सुचारू रूप से प्रस्तुत करता है। सर्वनाम और काल का सही संतुलन ही इसकी कुंजी है।',
      te: 'ఇండైరెక్ట్ స్పీచ్ ఇతరుల సంభాషణలను ప్రభావవంతంగా చెప్పడానికి తోడ్పడుతుంది.',
    },
    knowledgeCheckQuestions: [
      {
        question: {
          en: 'What does "She said, \'I am writing an essay now\'" become in indirect speech?',
          hi: '"She said, \'I am writing an essay now\'" अप्रत्यक्ष कथन में क्या बनेगा?',
          te: '"She said, \'I am writing an essay now\'" ఇండైరెక్ట్ స్పీచ్ లో ఎలా మారుతుంది?',
        },
        answer: {
          en: 'She said that she was writing an essay then.',
          hi: 'She said that she was writing an essay then.',
          te: 'She said that she was writing an essay then.',
        },
        quickTip: {
          en: '"am writing" becomes "was writing" and "now" becomes "then".',
          hi: '"am writing" -> "was writing" और "now" -> "then"।',
          te: '"am writing" కాస్త "was writing" గాను, "now" కాస్త "then" గాను మారుతుంది.',
        },
      },
    ],
    practiceExercises: [
      {
        instruction: {
          en: 'Convert the following dialogue into indirect speech:',
          hi: 'निम्नलिखित वाक्य को अप्रत्यक्ष कथन में बदलें:',
          te: 'కింది వాక్యాన్ని ఇండైరెక్ట్ స్పీచ్ లోకి మార్చండి:',
        },
        exerciseProblem: {
          en: 'The librarian said to the students, "You must return all borrowed encyclopedias by tomorrow."',
          hi: 'The librarian said to the students, "You must return all borrowed encyclopedias by tomorrow."',
          te: 'The librarian said to the students, "You must return all borrowed encyclopedias by tomorrow."',
        },
        solutionHint: {
          en: '"must" backshifts to "had to", "you" becomes "they", and "tomorrow" becomes "the next day".',
          hi: '"must" बदलकर "had to" बनेगा और "tomorrow" -> "the next day"।',
          te: '"must" కాస్త "had to" గాను, "tomorrow" కాస్త "the next day" గాను మారుతుంది.',
        },
      },
    ],
    summaryPoints: [
      {
        en: 'Subordinating direct quotations to a past reporting verb requires simultaneous transformation of pronouns, tenses, and adverbs.',
        hi: 'प्रत्यक्ष कथन को परोक्ष में बदलते समय सर्वनाम, काल और समय सूचकों का एक साथ ध्यान रखना आवश्यक है।',
        te: 'ఇండైరెక్ట్ స్పీచ్ లోకి మార్చేటప్పుడు సర్వనామాలు, కాలం మరియు సమయ సూచికలు మూడూ మారాలి.',
      },
    ],
  },

  // 3. Telangana SSC Class 10 Physical Science - Refraction at Curved Surfaces & Lens Formula
  {
    id: 'les_ts10_ps_lens_c1',
    chapterId: 'ch_ts10_ps_curved_light',
    conceptId: 'con_ts10_ps_lens_c1',
    title: 'Lens Formula, Magnification & New Cartesian Sign Convention',
    topicIntroduction: {
      en: 'A lens is a transparent optical medium bounded by two spherical surfaces or one spherical and one planar surface. Lenses form images by refraction governed by Snell\'s law and curvature geometry.',
      hi: 'लेंस दो गोलीय पृष्ठों या एक गोलीय व एक समतल पृष्ठ से घिरा पारदर्शी माध्यम है जो अपवर्तन द्वारा प्रतिबिंब बनाता है।',
      te: 'కటకం అనేది రెండు గోళాకార తలాలు లేదా ఒక గోళాకార మరియు ఒక సమతలంతో కూడిన పారదర్శక యానకం.',
    },
    whyLearn: {
      en: 'Essential for designing corrective optical spectacles for myopia and hypermetropia, microscopes, telescopes, smartphone cameras, and ophthalmic laser surgery.',
      hi: 'नेत्र दोषों (निकट व दूर दृष्टि दोष) के निवारण हेतु चश्मों, सूक्ष्मदर्शी और कैमरों के निर्माण के लिए आवश्यक।',
      te: 'కంటి దోషాల నివారణ కళ్లద్దాలు, మైక్రోస్కోప్‌లు, టెలిస్కోప్‌లు మరియు కెమెరాల రూపకల్పనకు ఇది అత్యంత ముఖ్యం.',
    },
    learningObjectives: [
      'Define optical center (O), principal axis, principal foci (F1, F2), and focal length (f)',
      'Apply the New Cartesian Sign Convention rigorously: distances measured against incident light are negative',
      'Solve numerical problems using the Lens Formula: 1/f = 1/v - 1/u',
      'Calculate linear magnification (m = v/u = h_i / h_o) and deduce image nature and orientation',
    ],
    prerequisiteKnowledge: [
      {
        en: 'Laws of refraction: Incident ray, refracted ray, and normal lie in the same plane; Snell\'s Law (sin i / sin r = constant).',
        hi: 'अपवर्तन के नियम: स्नेल का नियम (sin i / sin r = स्थिरांक)।',
        te: 'వక్రీభవన నియమాలు: స్నెల్ నియమం (sin i / sin r = స్థిరాంకం).',
      },
    ],
    explanation: {
      en: 'In ray optics with spherical lenses, all distances are measured along the principal axis from the Optical Center (O) as origin. According to the New Cartesian Sign Convention: (1) Object is always placed to the left of the lens; (2) Distances measured in the direction of incident light (to the right of O) are POSITIVE (+); (3) Distances measured opposite to the direction of incident light (to the left of O) are NEGATIVE (-); (4) Heights measured upward perpendicular to principal axis are positive (+); heights downward are negative (-). A convex lens converges parallel incident light to a real focus on the right side, so its focal length is ALWAYS POSITIVE (f > 0). A concave lens diverges light from a virtual focus on the left, so its focal length is ALWAYS NEGATIVE (f < 0).',
      hi: 'लेंस में सभी दूरियां प्रकाशिक केंद्र (O) से मापी जाती हैं। आपतित प्रकाश की दिशा (दाईं ओर) में दूरियां धनात्मक (+) तथा विपरीत (बाईं ओर) ऋणात्मक (-) होती हैं। उत्तल लेंस की फोकस दूरी सदैव धनात्मक (f > 0) और अवतल लेंस की सदैव ऋणात्मक (f < 0) होती है।',
      te: 'కటకంలో అన్ని దూరాలను కటక కేంద్రం (O) నుండి కొలుస్తారు. కాంతి కిరణాల దిశలో దూరాలు ధనాత్మకం (+), వ్యతిరేక దిశలో రుణాత్మకం (-). కుంభాకార కటక నాభ్యాంతరం ఎల్లప్పుడూ ధనాత్మకం (f > 0), పుటాకార కటక నాభ్యాంతరం ఎల్లప్పుడూ రుణాత్మకం (f < 0).',
    },
    definitions: [
      {
        term: 'Lens Formula',
        definition: {
          en: 'The mathematical relation connecting focal length (f), object distance (u), and image distance (v): 1/f = 1/v - 1/u.',
          hi: 'फोकस दूरी (f), वस्तु दूरी (u) और प्रतिबिंब दूरी (v) के बीच संबंध: 1/f = 1/v - 1/u।',
          te: 'నాభ్యాంతరం (f), వస్తు దూరం (u), మరియు ప్రతిబింబ దూరం (v) ల మధ్య సంబంధం: 1/f = 1/v - 1/u.',
        },
      },
      {
        term: 'Linear Magnification (m)',
        definition: {
          en: 'The ratio of the height of the image (h_i) to the height of the object (h_o): m = h_i / h_o = v / u.',
          hi: 'प्रतिबिंब की ऊंचाई और वस्तु की ऊंचाई का अनुपात: m = h_i / h_o = v / u।',
          te: 'ప్రతిబింబ ఎత్తు మరియు వస్తువు ఎత్తుల నిష్పత్తి: m = h_i / h_o = v / u.',
        },
      },
    ],
    principlesAndRules: [
      {
        heading: 'Lens Formula vs Mirror Formula Sign Discipline',
        rule: {
          en: 'Lens Formula has a MINUS sign: 1/f = 1/v - 1/u (with magnification m = +v/u).\nMirror Formula has a PLUS sign: 1/f = 1/v + 1/u (with magnification m = -v/u). Do not confuse them!',
          hi: 'लेंस सूत्र में माइनस (-) होता है: 1/f = 1/v - 1/u (आवर्धन m = +v/u)। दर्पण सूत्र में प्लस (+) होता है।',
          te: 'కటక సూత్రంలో మైనస్ (-) ఉంటుంది: 1/f = 1/v - 1/u (ఆవర్ధనం m = +v/u). దర్పణ సూత్రంలో ప్లస్ (+) ఉంటుంది.',
        },
        formulaOrStructure: '1/f = 1/v - 1/u  and  m = v/u',
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'A convex lens of focal length 15 cm forms a real image at a distance of 30 cm from the lens. Find the position of the object and the magnification produced.',
          hi: '15 cm फोकस दूरी वाला उत्तल लेंस 30 cm की दूरी पर वास्तविक प्रतिबिंब बनाता है। वस्तु की स्थिति और आवर्धन ज्ञात करें।',
          te: '15 cm నాభ్యాంతరం గల కుంభాకార కటకం 30 cm దూరంలో నిజ ప్రతిబింబం ఏర్పరుస్తుంది. వస్తువు దూరం మరియు ఆవర్ధనం కనుగొనండి.',
        },
        stepByStep: [
          {
            en: 'Step 1 (Identify given with signs): f = +15 cm (convex lens), v = +30 cm (real image formed on right side). Find u.',
            hi: 'चरण 1: उत्तल लेंस के लिए f = +15 cm, वास्तविक प्रतिबिंब हेतु v = +30 cm।',
            te: 'దశ 1: f = +15 cm, v = +30 cm (నిజ ప్రతిబింబం కుడివైపు ఏర్పడుతుంది).',
          },
          {
            en: 'Step 2 (Apply lens formula): 1/f = 1/v - 1/u  =>  1/15 = 1/30 - 1/u.',
            hi: 'चरण 2: 1/15 = 1/30 - 1/u  =>  1/u = 1/30 - 1/15.',
            te: 'దశ 2: 1/15 = 1/30 - 1/u  =>  1/u = 1/30 - 1/15.',
          },
          {
            en: 'Step 3 (Solve for u): 1/u = (1 - 2) / 30 = -1/30  =>  u = -30 cm.',
            hi: 'चरण 3: 1/u = -1/30  =>  u = -30 cm (वस्तु लेंस के 30 cm बाईं ओर है)।',
            te: 'దశ 3: 1/u = -1/30  =>  u = -30 cm (వస్తువు కటకానికి ఎడమవైపు 30 సెం.మీ దూరంలో ఉంది).',
          },
          {
            en: 'Step 4 (Calculate magnification): m = v / u = (+30) / (-30) = -1. Negative sign confirms image is real and inverted, of identical size.',
            hi: 'चरण 4: m = v / u = 30 / (-30) = -1। ऋणात्मक चिन्ह दर्शाता है कि प्रतिबिंब वास्तविक, उल्टा और बराबर आकार का है।',
            te: 'దశ 4: m = v / u = 30 / (-30) = -1. మైనస్ గుర్తు ప్రతిబింబం నిజమైనది, తలక్రిందులైనది మరియు సమాన పరిమాణం కలదని తెలుపుతుంది.',
          },
        ],
        finalAnswer: 'u = -30 cm, m = -1 (Real, inverted, same size as object at 2F1)',
        keyInsight: {
          en: 'When object is located at 2F (30 cm = 2 x 15 cm), image is formed at 2F on the other side with m = -1.',
          hi: 'जब वस्तु 2F पर होती है, तो प्रतिबिंब दूसरी तरफ 2F पर समान आकार का (m = -1) बनता है।',
          te: 'వస్తువు 2F వద్ద ఉన్నప్పుడు ప్రతిబింబం కూడా రెండవ వైపు 2F వద్ద సమాన పరిమాణంతో ఏర్పడుతుంది.',
        },
      },
    ],
    diagramsAndTables: [
      {
        title: 'Cartesian Sign Convention Diagram for Spherical Lenses',
        description: {
          en: 'Coordinate axes overlaid on a spherical lens with optical center O at origin (0,0).',
          hi: 'गोलीय लेंस के लिए कार्तीय चिन्ह परिपाटी आरेख।',
          te: 'కటకాల కార్టీసియన్ సంకేత సాంప్రదాయ రేఖాచిత్రం.',
        },
        asciiDiagramOrTable:
          '                 +y (Upward height: Positive)\n' +
          '                             |\n' +
          '    Incident Light ------>   |\n' +
          '  Distances against light:   |   Distances along light:\n' +
          '      NEGATIVE (-)           |       POSITIVE (+)\n' +
          '  ---------------------------O---------------------------> +x\n' +
          '  (Object placed on left)    |   (Real images on right)\n' +
          '                             |\n' +
          '                 -y (Downward height: Negative)',
      },
    ],
    realWorldApplications: [
      {
        en: 'Prescription Glasses: An optometrist diagnoses a patient with myopia (-2.5 D power) and prescribes a concave lens with focal length f = 1/P = 1/(-2.5) = -0.4 m (-40 cm) to form virtual images at their far point.',
        hi: 'दृष्टि दोष निवारण: निकट दृष्टि दोष के लिए अवतल लेंस (-2.5 D) की आवश्यकता होती है जिसकी फोकस दूरी -40 cm होती है।',
        te: 'కంటి అద్దాలు: హ్రస్వదృష్టి నివారణకు పుటాకార కటకాన్ని వాడతారు.',
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Writing magnification formula for lenses with a negative sign: m = -v/u.',
          hi: 'लेंस के आवर्धन सूत्र में m = -v/u लिखना।',
          te: 'కటక ఆవర్ధనానికి m = -v/u అని రాయడం.',
        },
        correction: {
          en: 'For lenses, m = +v/u. (The negative sign belongs exclusively to spherical mirrors: m = -v/u).',
          hi: 'लेंस के लिए m = +v/u होता है। माइनस चिन्ह केवल दर्पण में आता है।',
          te: 'కటకాలకు m = +v/u. దర్పణాలకు మాత్రమే m = -v/u ఉంటుంది.',
        },
        whyItHappens: {
          en: 'Confusing mirror conventions with lens conventions.',
          hi: 'दर्पण और लेंस के सूत्रों को आपस में मिला देना।',
          te: 'దర్పణ మరియు కటక సూత్రాలను గందరగోళం చేసుకోవడం.',
        },
      },
    ],
    importantPoints: [
      {
        en: 'Convex lens focal length f is ALWAYS positive (+); Concave lens focal length f is ALWAYS negative (-).',
        hi: 'उत्तल लेंस की f सदैव धनात्मक (+) तथा अवतल लेंस की f सदैव ऋणात्मक (-) होती है।',
        te: 'కుంభాకార కటక నాభ్యాంతరం ఎల్లప్పుడూ ధనాత్మకం (+), పుటాకార కటక నాభ్యాంతరం ఎల్లప్పుడూ రుణాత్మకం (-).',
      },
      {
        en: 'Real images always have negative magnification (inverted); Virtual images always have positive magnification (erect).',
        hi: 'वास्तविक प्रतिबिंब का आवर्धन ऋणात्मक (उल्टा) और आभासी का धनात्मक (सीधा) होता है।',
        te: 'నిజ ప్రతిబింబాలకు ఆవర్ధనం రుణాత్మకం (తలక్రిందులు), మిధ్యా ప్రతిబింబాలకు ధనాత్మకం (నిటారు).',
      },
    ],
    revisionNotes: [
      {
        en: 'Lens Formula: 1/f = 1/v - 1/u. Linear Magnification: m = v/u = h_i/h_o. Power: P = 1/f (in meters), measured in Dioptres (D).',
        hi: 'लेंस सूत्र: 1/f = 1/v - 1/u। आवर्धन: m = v/u। क्षमता: P = 1/f (मीटर में), मात्रक डायोप्टर (D)।',
        te: 'కటక సూత్రం: 1/f = 1/v - 1/u. ఆవర్ధనం: m = v/u. సామర్థ్యం: P = 1/f (మీటర్లలో), ప్రమాణాలు డయాప్టర్లు (D).',
      },
    ],
    topicSummary: {
      en: 'The lens formula governs the geometry of refracted spherical wavefronts. Cartesian sign adherence is required to accurately position optical images and determine focal powers.',
      hi: 'लेंस सूत्र अपवर्तित किरणों की ज्यामिति को नियंत्रित करता है। सही चिन्ह परिपाटी ही सटीक उत्तर की गारंटी है।',
      te: 'కటక సూత్రం వక్రీభవన కిరణాల జ్యామితిని సూచిస్తుంది. సరైన సంకేత నిబంధనలను పాటించడం ద్వారా ఖచ్చితమైన ఫలితాలు వస్తాయి.',
    },
    knowledgeCheckQuestions: [
      {
        question: {
          en: 'What is the power of a diverging lens of focal length 20 cm?',
          hi: '20 cm फोकस दूरी वाले अपसारी (अवतल) लेंस की क्षमता क्या होगी?',
          te: '20 cm నాభ్యాంతరం గల పుటాకార కటక సామర్థ్యం ఎంత?',
        },
        answer: {
          en: 'P = -5 D (since f = -20 cm = -0.2 m, P = 1 / (-0.2) = -5 Dioptres).',
          hi: 'P = -5 D (f = -0.2 m, P = 1 / -0.2 = -5 डायोप्टर)।',
          te: 'P = -5 D (f = -0.2 m, P = 1 / -0.2 = -5 డయాప్టర్లు).',
        },
        quickTip: {
          en: 'Remember to convert centimeters to meters before inverting to find Dioptres!',
          hi: 'डायोप्टर निकालने से पहले सेंटीमीटर को मीटर में बदलना न भूलें!',
          te: 'డయాప్టర్లు లెక్కించే ముందు సెం.మీ లను మీటర్లలోకి మార్చడం మర్చిపోకండి!',
        },
      },
    ],
    practiceExercises: [
      {
        instruction: {
          en: 'Calculate image position and nature for the following optical configuration:',
          hi: 'प्रतिबिंब की स्थिति और प्रकृति की गणना करें:',
          te: 'ప్రతిబింబ స్థానం మరియు స్వభావాన్ని లెక్కించండి:',
        },
        exerciseProblem: {
          en: 'An object 5 cm tall is placed 20 cm in front of a concave lens of focal length 20 cm. Find position, size, and nature of the image.',
          hi: '5 cm ऊंची वस्तु 20 cm फोकस दूरी वाले अवतल लेंस के सामने 20 cm पर रखी है। प्रतिबिंब की स्थिति और ऊंचाई निकालें।',
          te: '20 cm నాభ్యాంతరం గల పుటాకార కటకం ముందు 20 cm దూరంలో 5 cm ఎత్తున్న వస్తువును ఉంచారు. ప్రతిబింబ స్థానం మరియు ఎత్తును కనుగొనండి.',
        },
        solutionHint: {
          en: 'f = -20 cm, u = -20 cm. 1/v = 1/f + 1/u = -1/20 - 1/20 = -2/20 = -1/10 => v = -10 cm (virtual, erect, h_i = 2.5 cm).',
          hi: 'v = -10 cm (आभासी, सीधा, h_i = 2.5 cm)।',
          te: 'v = -10 cm (మిధ్యా, నిటారైన, h_i = 2.5 cm).',
        },
      },
    ],
    summaryPoints: [
      {
        en: 'The New Cartesian Sign Convention assigns positive signs to distances in the incident beam direction and negative to opposite directions.',
        hi: 'आपतित किरण की दिशा में दूरियां धनात्मक और विपरीत दिशा में ऋणात्मक होती हैं।',
        te: 'కాంతి దిశలో దూరాలు ధనాత్మకం మరియు వ్యతిరేక దిశలో రుణాత్మకం.',
      },
    ],
  },

  // 4. CISCE Class 10 Chemistry - Periodic Properties & Trends
  {
    id: 'les_cisce10_chem_c1',
    chapterId: 'ch_cisce10_chem_periodic',
    conceptId: 'con_cisce10_chem_c1',
    title: 'Periodic Properties, Effective Nuclear Charge & Periodic Trends',
    topicIntroduction: {
      en: 'The modern periodic table arranges chemical elements by atomic number (Z). The repeating electronic configuration patterns produce predictable variations in physical and chemical properties called periodic trends.',
      hi: 'आधुनिक आवर्त सारणी तत्वों को परमाणु क्रमांक के अनुसार व्यवस्थित करती है। इलेक्ट्रॉनों के आवर्ती विन्यास से भौतिक व रासायनिक गुणों में नियमित प्रवृत्तियां (Periodic Trends) उत्पन्न होती हैं।',
      te: 'ఆధునిక ఆవర్తన పట్టిక మూలకాలను పరమాణు సంఖ్య ఆధారంగా అమర్చుతుంది. ఎలక్ట్రాన్ విన్యాసాల పునరావృతం వల్ల ఆవర్తన ధర్మాలు ఏర్పడతాయి.',
    },
    whyLearn: {
      en: 'Enables prediction of bonding types, chemical reactivity, acid-base nature of oxides, and metallurgy extraction methods without rote memorizing hundreds of separate reactions.',
      hi: 'सैकड़ों रासायनिक अभिक्रियाओं को रटने के बजाय तत्वों की क्रियाशीलता और ऑक्साइड के स्वभाव का पूर्व अनुमान लगाने के लिए आवश्यक।',
      te: 'వందలాది రసాయన చర్యలను బట్టీ పట్టకుండా మూలకాల ప్రతిచర్యాశీలతను ముందుగానే ఊహించడానికి ఇది అత్యవసరం.',
    },
    learningObjectives: [
      'Define atomic radius, ionization potential (IP), electron affinity (EA), and electronegativity (EN)',
      'Analyze the two opposing forces: Effective Nuclear Charge (Z_eff) versus Screening / Number of Shells',
      'Explain why atomic radius decreases across a period and increases down a group',
      'Correlate ionization energy trends with metallic character and oxidizing/reducing properties',
    ],
    prerequisiteKnowledge: [
      {
        en: 'Bohr\'s atomic model: Principal quantum shells K (n=1), L (n=2), M (n=3), and valence electron distributions.',
        hi: 'बोहर का परमाणु मॉडल: कोश (K, L, M) और संयोजकता इलेक्ट्रॉन।',
        te: 'బోర్ పరమాణు నమూనా: కర్పరాలు (K, L, M) మరియు వేలన్సీ ఎలక్ట్రాన్లు.',
      },
    ],
    explanation: {
      en: 'All periodic trends are governed by two competing mechanical forces: (1) Nuclear Charge (the positive pull of protons inside the nucleus attracting the electron cloud), and (2) Number of Electron Shells (which creates physical distance and an electrostatic screening/shielding barrier). Across a period from left to right, electrons are added to the SAME principal shell, meaning the distance from the nucleus remains roughly constant while the nuclear charge increases by +1 proton per element. This intensified effective nuclear pull (Z_eff) drags the electron cloud inward, shrinking atomic radius and raising Ionization Potential. Down a group, an ENTIRELY NEW electron shell is added at each step. The increased distance and inner shell shielding overpower the added nuclear charge, expanding the atomic radius and lowering ionization energy.',
      hi: 'सभी आवर्त प्रवृत्तियां दो बलों पर निर्भर करती हैं: (1) प्रभावी नाभिकीय आवेश (प्रोटॉनों का खिंचाव), और (2) कोशों की संख्या (परिरक्षण प्रभाव)। आवर्त में बाएं से दाएं जाने पर कोश समान रहते हैं लेकिन प्रोटॉन बढ़ते हैं, जिससे परमाणु सिकुड़ता है और आयनन ऊर्जा बढ़ती है। वर्ग में नीचे जाने पर नए कोश जुड़ते हैं, जिससे आकार बढ़ता है और आयनन ऊर्जा घटती है।',
      te: 'అన్ని ఆవర్తన ధర్మాలు రెండు బలాలపై ఆధారపడతాయి: (1) కేంద్రక ఆవేశం, (2) కక్ష్యల సంఖ్య. పీరియడ్‌లో ఎడమ నుండి కుడికి కక్ష్యల సంఖ్య మారదు కానీ ప్రోటాన్లు పెరుగుతాయి, కనుక పరమాణు పరిమాణం తగ్గి అయనీకరణ శక్మం పెరుగుతుంది. గ్రూపులో పై నుండి కిందికి కొత్త కక్ష్యలు చేరడం వల్ల పరమాణు పరిమాణం పెరుగుతుంది మరియు అయనీకరణ శక్మం తగ్గుతుంది.',
    },
    definitions: [
      {
        term: 'Atomic Radius',
        definition: {
          en: 'The distance between the center of the nucleus and the outermost valence electron shell in an isolated atom.',
          hi: 'नाभिक के केंद्र से बाह्यतम इलेक्ट्रॉन कोश के बीच की दूरी।',
          te: 'కేంద్రకం నుండి బాహ్య కక్ష్యలోని ఎలక్ట్రాన్ల మధ్య గల దూరం.',
        },
      },
      {
        term: 'Ionization Potential (IP)',
        definition: {
          en: 'The minimum energy required to remove the most loosely bound valence electron from an isolated gaseous atom to form a positive ion: M(g) + IP -> M+(g) + e-.',
          hi: 'एक विलगित गैसीय परमाणु से सबसे ढीले बंधे इलेक्ट्रॉन को निकालने हेतु आवश्यक न्यूनतम ऊर्जा।',
          te: 'వాయు స్థితిలో ఉన్న ఒంటరి పరమాణువు బాహ్య కక్ష్య నుండి ఎలక్ట్రాన్‌ను తొలగించడానికి అవసరమైన కనీస శక్తి.',
        },
      },
    ],
    principlesAndRules: [
      {
        heading: 'Periodic Trends Master Summary',
        rule: {
          en: 'ACROSS A PERIOD (Left -> Right):\n- Atomic Radius: DECREASES (greater Z_eff)\n- Ionization Potential (IP): INCREASES\n- Electronegativity (EN): INCREASES\n- Non-metallic character: INCREASES\n\nDOWN A GROUP (Top -> Bottom):\n- Atomic Radius: INCREASES (new shells added)\n- Ionization Potential (IP): DECREASES\n- Electronegativity (EN): DECREASES\n- Metallic character: INCREASES',
          hi: 'आवर्त में (बाएं से दाएं): परमाणु त्रिज्या घटती है; आयनन ऊर्जा बढ़ती है; अधात्विक गुण बढ़ता है। वर्ग में (ऊपर से नीचे): परमाणु त्रिज्या बढ़ती है; आयनन ऊर्जा घटती है; धात्विक गुण बढ़ता है।',
          te: 'పీరియడ్‌లో: పరమాణు వ్యాసార్థం తగ్గుతుంది; అయనీకరణ శక్మం పెరుగుతుంది; అలోహ స్వభావం పెరుగుతుంది. గ్రూపులో: పరమాణు వ్యాసార్థం పెరుగుతుంది; అయనీకరణ శక్మం తగ్గుతుంది; లోహ స్వభావం పెరుగుతుంది.',
        },
        formulaOrStructure: 'Z_eff = Z - S  (Effective Nuclear Charge = Atomic Number - Screening Constant)',
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'Arrange the elements of Period 3: Na (Z=11), Mg (Z=12), Al (Z=13), Si (Z=14), P (Z=15), S (Z=16), Cl (Z=17) in decreasing order of atomic radius and justify.',
          hi: 'आवर्त 3 के तत्वों को परमाणु त्रिज्या के घटते क्रम में व्यवस्थित करें और कारण स्पष्ट करें।',
          te: 'పీరియడ్ 3 మూలకాలను పరమాణు వ్యాసార్థం తగ్గే క్రమంలో అమర్చి కారణం వివరించండి.',
        },
        stepByStep: [
          {
            en: 'Step 1: Check shell count. All Period 3 elements possess exactly 3 shells (K=2, L=8, M=valence).',
            hi: 'चरण 1: सभी में 3 कोश हैं।',
            te: 'దశ 1: అన్ని మూలకాలలో 3 కర్పరాలు మాత్రమే ఉంటాయి.',
          },
          {
            en: 'Step 2: Compare nuclear charge (Z). Na has 11 protons, while Cl has 17 protons.',
            hi: 'चरण 2: सोडियम में 11 प्रोटॉन हैं और क्लोरीन में 17 प्रोटॉन।',
            te: 'దశ 2: సోడియంలో 11 ప్రోటాన్లు, క్లోరిన్‌లో 17 ప్రోటాన్లు ఉంటాయి.',
          },
          {
            en: 'Step 3: Chlorine\'s 17 protons exert a much stronger inward electrostatic force on the 3rd shell than Sodium\'s 11 protons.',
            hi: 'चरण 3: क्लोरीन का उच्च नाभिकीय खिंचाव इलेक्ट्रॉनों को अंदर खींचता है।',
            te: 'దశ 3: క్లోరిన్ లోని 17 ప్రోటాన్లు ఎలక్ట్రాన్లను బలంగా లోపలికి లాగుతాయి.',
          },
          {
            en: 'Step 4: Therefore, Sodium is largest and Chlorine is smallest.',
            hi: 'चरण 4: अतः सोडियम सबसे बड़ा और क्लोरीन सबसे छोटा है।',
            te: 'దశ 4: కనుక సోడియం అతిపెద్దది, క్లోరిన్ అతిచిన్నది.',
          },
        ],
        finalAnswer: 'Na > Mg > Al > Si > P > S > Cl',
        keyInsight: {
          en: 'Across any period, alkali metals (Group 1) have the largest atomic radius and halogens (Group 17) have the smallest.',
          hi: 'प्रत्येक आवर्त में क्षार धातुएं सबसे बड़ी और हैलोजन सबसे छोटे होते हैं।',
          te: 'ప్రతి పీరియడ్‌లో గ్రూప్ 1 లోహాలు అతిపెద్దవిగా, గ్రూప్ 17 హాలోజన్లు అతిచిన్నవిగా ఉంటాయి.',
        },
      },
    ],
    diagramsAndTables: [
      {
        title: 'Periodic Trend Vector Compass',
        description: {
          en: 'Directional arrows showing property increases across the periodic table grid.',
          hi: 'आवर्त सारणी में प्रवृत्तियों की दिशा दर्शाने वाला आरेख।',
          te: 'ఆవర్తన పట్టికలో ధర్మాల పెరుగుదలను సూచించే దిశాత్మక పటం.',
        },
        asciiDiagramOrTable:
          '           INCREASING Ionization Potential & Electronegativity ------>\n' +
          '      +-------------------------------------------------------------+\n' +
          '      |  Li   Be   B    C    N    O    F    Ne   | (Smallest Radius)|\n' +
          '   |  |  Na   Mg   Al   Si   P    S    Cl   Ar   |                  |\n' +
          '   |  |  K    Ca   Ga   Ge   As   Se   Br   Kr   |                  |\n' +
          '   v  |  Rb   Sr   In   Sn   Sb   Te   I    Xe   |                  |\n' +
          '  INC |  Cs   Ba   Tl   Pb   Bi   Po   At   Rn   |                  |\n' +
          '  Size+-------------------------------------------------------------+\n' +
          '     (Largest Radius)                                                ',
      },
    ],
    realWorldApplications: [
      {
        en: 'Lithium-ion Battery Design: Lithium has the lowest atomic weight and lowest standard reduction potential among metals, yielding maximal energy storage per unit mass.',
        hi: 'लिथियम-आयन बैटरी: लिथियम का कम परमाणु भार और उच्च धात्विक गुण इसे सबसे हल्की और शक्तिशाली बैटरी बनाता है।',
        te: 'లిథియం-అయాన్ బ్యాటరీలు: లిథియం యొక్క తక్కువ పరమాణు భారం మరియు అధిక చర్యాశీలత దీనిని అత్యంత సమర్థవంతమైన బ్యాటరీగా మారుస్తాయి.',
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Assuming atomic radius increases across a period because atomic number and electron count increase.',
          hi: 'यह सोचना कि इलेक्ट्रॉन बढ़ने से आवर्त में परमाणु त्रिज्या बढ़ती है।',
          te: 'ఎలక్ట్రాన్లు పెరగడం వల్ల పీరియడ్‌లో వ్యాసార్థం పెరుగుతుందని అనుకోవడం.',
        },
        correction: {
          en: 'Added electrons go into the SAME principal shell, while added protons increase inward pull, making the atom shrink!',
          hi: 'इलेक्ट्रॉन उसी कोश में जुड़ते हैं जबकि प्रोटॉनों का खिंचाव बढ़ता है, जिससे परमाणु छोटा हो जाता है!',
          te: 'ఎలక్ట్రాన్లు ఒకే కర్పరంలో చేరడం మరియు ప్రోటాన్లు పెరగడం వల్ల పరమాణు పరిమాణం తగ్గుతుంది!',
        },
        whyItHappens: {
          en: 'Confusing mass accumulation with spatial volume expansion.',
          hi: 'द्रव्यमान और आयतन के बीच अंतर न समझ पाना।',
          te: 'ద్రవ్యరాశి మరియు పరిమాణం మధ్య గల తేడాను గమనించకపోవడం.',
        },
      },
    ],
    importantPoints: [
      {
        en: 'Noble gases (Group 18) are measured using Van der Waals radius (non-bonded), making them appear anomalously larger than halogens.',
        hi: 'उत्कृष्ट गैसों (अक्रिय गैसों) की वान्डर वाल त्रिज्या मापी जाती है जो सहसंयोजक त्रिज्या से बड़ी होती है।',
        te: 'ఉత్కృష్ట వాయువుల వ్యాసార్థం వాండర్ వాల్స్ వ్యాసార్థం కావడం వల్ల అవి హాలోజన్ల కంటే పెద్దవిగా కనిపిస్తాయి.',
      },
    ],
    revisionNotes: [
      {
        en: 'Across Period: Radius down, IP up, EN up, Metallic character down. Down Group: Radius up, IP down, EN down, Metallic character up.',
        hi: 'आवर्त में: त्रिज्या घटेगी, IP बढ़ेगी, धात्विक गुण घटेगा। वर्ग में: त्रिज्या बढ़ेगी, IP घटेगी, धात्विक गुण बढ़ेगा।',
        te: 'పీరియడ్‌లో: వ్యాసార్థం తగ్గుతుంది, IP పెరుగుతుంది, లోహ స్వభావం తగ్గుతుంది. గ్రూపులో: వ్యాసార్థం పెరుగుతుంది, IP తగ్గుతుంది, లోహ స్వభావం పెరుగుతుంది.',
      },
    ],
    topicSummary: {
      en: 'Periodic variations arise from the interplay of nuclear charge and quantum shell shielding. These principles explain elemental reactivity and chemical bonding throughout science.',
      hi: 'आवर्त प्रवृत्तियां नाभिकीय आवेश और कोशों की संख्या के संतुलन से उत्पन्न होती हैं जो संपूर्ण रसायन विज्ञान का आधार हैं।',
      te: 'ఆవర్తన ధర్మాలు కేంద్రక ఆవేశం మరియు కర్పరాల సంఖ్యపై ఆధారపడి ఉంటాయి.',
    },
    knowledgeCheckQuestions: [
      {
        question: {
          en: 'Which has smaller atomic radius: Magnesium (Mg, Z=12) or Sulfur (S, Z=16)?',
          hi: 'मैग्नीशियम (Mg) और सल्फर (S) में से किसकी परमाणु त्रिज्या छोटी है?',
          te: 'మెగ్నీషియం (Mg) మరియు సల్ఫర్ (S) లలో ఏది చిన్న పరమాణు వ్యాసార్థం కలిగి ఉంది?',
        },
        answer: {
          en: 'Sulfur (S) has a smaller atomic radius due to 16 protons pulling on the third shell compared to 12 in Magnesium.',
          hi: 'सल्फर (S) छोटा है क्योंकि इसमें 16 प्रोटॉन का अधिक नाभिकीय खिंचाव है।',
          te: 'సల్ఫర్ (S) చిన్నది, ఎందుకంటే 16 ప్రోటాన్ల ఎక్కువ ఆకర్షణ బలం ఉంటుంది.',
        },
        quickTip: {
          en: 'Sulfur is further to the right in Period 3, where atoms shrink.',
          hi: 'सल्फर आवर्त 3 में दाईं ओर स्थित है।',
          te: 'సల్ఫర్ పీరియడ్ 3 లో కుడివైపున ఉంటుంది.',
        },
      },
    ],
    practiceExercises: [
      {
        instruction: {
          en: 'Predict chemical behavior based on periodic properties:',
          hi: 'आवर्त प्रवृत्तियों के आधार पर उत्तर दें:',
          te: 'ఆవర్తన ధర్మాల ఆధారంగా సమాధానం చెప్పండి:',
        },
        exerciseProblem: {
          en: 'Element X has atomic number 19 and Element Y has atomic number 35. Predict which forms a basic oxide and which forms an acidic oxide.',
          hi: 'तत्व X (Z=19) और तत्व Y (Z=35) में से कौन क्षारीय ऑक्साइड बनाएगा और कौन अम्लीय?',
          te: 'మూలకం X (Z=19) మరియు మూలకం Y (Z=35) లలో ఏది క్షార ఆక్సైడ్‌ను, ఏది ఆమ్ల ఆక్సైడ్‌ను ఏర్పరుస్తుంది?',
        },
        solutionHint: {
          en: 'Z=19 is Potassium (alkali metal -> highly basic oxide K2O). Z=35 is Bromine (halogen non-metal -> acidic oxide).',
          hi: 'Z=19 पोटैशियम धातु है जो क्षारीय ऑक्साइड बनाएगा; Z=35 ब्रोमीन अधातु है जो अम्लीय ऑक्साइड बनाएगा।',
          te: 'Z=19 పొటాషియం (క్షార ఆక్సైడ్); Z=35 బ్రోమిన్ (ఆమ్ల ఆక్సైడ్).',
        },
      },
    ],
    summaryPoints: [
      {
        en: 'Atomic radius and ionization energy dictate the chemical electropositivity and electronegativity across the periodic grid.',
        hi: 'परमाणु त्रिज्या और आयनन ऊर्जा ही तत्वों के रासायनिक स्वभाव को निर्धारित करती हैं।',
        te: 'పరమాణు పరిమాణం మరియు అయనీకరణ శక్మం మూలకాల రసాయన ధర్మాలను నిర్దేశిస్తాయి.',
      },
    ],
  },

  // ==========================================
  // CBSE CLASS 8 ENGLISH: ADVERBS (Comprehensive 16-Point Master Topic Lesson)
  // ==========================================
  {
    id: 'les_cbse8_eng_adv_c1',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c1',
    title: 'Adverbs: Definition, Modification & Adjective vs Adverb Distinction',
    topicIntroduction: {
      en: 'An adverb is an indispensable part of speech that modifies, clarifies, or qualifies a verb, an adjective, or another adverb. While verbs express actions and nouns name entities, adverbs describe the manner, degree, time, place, and frequency with which actions unfold, transforming basic sentences into vivid, precise descriptions.',
      hi: 'क्रियाविशेषण (Adverb) भाषा का एक महत्वपूर्ण अंग है जो किसी क्रिया (verb), विशेषण (adjective), या किसी अन्य क्रियाविशेषण की विशेषता बताता है। यह बताता है कि कोई कार्य कैसे, कब, कहाँ, कितनी बार या किस सीमा तक हुआ।',
      te: 'క్రియా విశేషణం (Adverb) అనేది ఒక క్రియను (verb), విశేషణాన్ని (adjective), లేదా మరొక క్రియా విశేషణాన్ని వివరించే పదం. ఒక పని ఎలా, ఎప్పుడు, ఎక్కడ, ఎన్నిసార్లు లేదా ఎంత పరిమాణంలో జరిగిందో ఇది తెలియజేస్తుంది.',
    },
    whyLearn: {
      en: 'Mastering adverbs empowers you to write with pinpoint precision, distinguish descriptive adjectives from adverbial qualifiers, avoid common grammatical pitfalls in board examinations, and communicate thoughts with nuanced clarity in both creative and academic writing.',
      hi: 'क्रियाविशेषण सीखने से आप परीक्षा में व्याकरण की गलतियों से बचते हैं, अपनी बात को सटीकता से व्यक्त कर पाते हैं, और अंग्रेजी लेखन को अधिक प्रभावशाली बना सकते हैं।',
      te: 'క్రియా విశేషణాలను నేర్చుకోవడం వల్ల పరీక్షల్లో వ్యాకరణ దోషాలు లేకుండా రాయవచ్చు, మరియు ఇంగ్లీష్ వాక్యాలను మరింత స్పష్టంగా మరియు ప్రభావవంతంగా వ్యక్తీకరించవచ్చు.',
    },
    learningObjectives: [
      'Define an adverb and identify the three parts of speech it can modify: verbs, adjectives, and other adverbs',
      'Distinguish clearly between adjectives (which modify nouns/pronouns) and adverbs (which modify actions or attributes)',
      'Differentiate tricky pairs such as "good" (adjective) vs "well" (adverb), and identify flat adverbs like "fast" and "hard"',
      'Recognize false -ly adjectives (e.g. friendly, lovely, silly) that cannot function as adverbs without phrase restructuring',
      'Analyze adverbial functions in complex sentences and explain why each modifier is chosen',
    ],
    prerequisiteKnowledge: [
      {
        en: 'Parts of speech: Understanding the fundamental roles of Nouns (naming people, places, things), Pronouns (substitutes for nouns), and Verbs (action or state of being).',
        hi: 'शब्द भेद (Parts of Speech): संज्ञा (Noun), सर्वनाम (Pronoun) और क्रिया (Verb) की बुनियादी समझ।',
        te: 'భాషా భాగాలు: నామవాచకం (Noun), సర్వనామం (Pronoun) మరియు క్రియ (Verb) యొక్క ప్రాథమిక అవగాహన.',
      },
      {
        en: 'Adjectives: Recognizing that adjectives qualify or describe nouns (e.g., "a quick runner", "a sweet mango").',
        hi: 'विशेषण (Adjective): यह समझना कि विशेषण केवल संज्ञा या सर्वनाम की विशेषता बताते हैं।',
        te: 'విశేషణాలు (Adjectives): ఇవి కేవలం నామవాచకాలు లేదా సర్వనామాలను మాత్రమే వర్ణిస్తాయి.',
      },
    ],
    explanation: {
      en: 'An adverb answers questions such as: How? (Manner), When? (Time), Where? (Place), How often? (Frequency), and To what extent/How much? (Degree). Unlike an adjective, which exclusively qualifies a noun or pronoun (e.g., "She is a quick runner" -> "quick" describes the runner), an adverb modifies verbs ("She runs quickly"), adjectives ("She is remarkably quick"), or other adverbs ("She runs exceptionally quickly"). Many adverbs are formed by appending the suffix -ly to an adjective (slow -> slowly, careful -> carefully), but not all adverbs end in -ly, nor are all words ending in -ly adverbs! For instance, "friendly", "lovely", and "lonely" are adjectives because they describe nouns ("a friendly host", "a lovely day"). Furthermore, flat adverbs such as "fast", "hard", "late", and "straight" share the identical spelling for both their adjective and adverb roles ("He drove a fast car" vs "He drove fast"). The non-word "fastly" does not exist in standard English.',
      hi: 'क्रियाविशेषण (Adverb) मुख्य रूप से तीन चीजों की विशेषता बताता है: (1) क्रिया की (He runs quickly), (2) विशेषण की (He is extremely tall), और (3) दूसरे क्रियाविशेषण की (He runs very fast)। याद रखें: विशेषण केवल संज्ञा या सर्वनाम की विशेषता बताता है (A good boy), जबकि क्रिया की विशेषता बताने के लिए क्रियाविशेषण चाहिए (He plays well, न कि He plays good)। हर -ly पर समाप्त होने वाला शब्द adverb नहीं होता; जैसे "friendly", "lovely" विशेषण हैं!',
      te: 'క్రియా విశేషణం (Adverb) మూడు అంశాలను వివరిస్తుంది: (1) క్రియను (He runs quickly), (2) విశేషణాన్ని (He is extremely tall), (3) మరొక క్రియా విశేషణాన్ని (He speaks very softly). విశేషణం నామవాచకాన్ని వర్ణిస్తే (A good singer), క్రియను క్రియా విశేషణం వర్ణిస్తుంది (She sings well, "sings good" అనకూడదు). -ly తో ముగిసే ప్రతి పదమూ adverb కాదు (ఉదాహరణకు friendly, lovely అనేవి విశేషణాలు).',
    },
    definitions: [
      {
        term: 'Adverb',
        definition: {
          en: 'A word that modifies or qualifies a verb, an adjective, or another adverb by indicating manner, time, place, degree, or frequency.',
          hi: 'वह शब्द जो किसी क्रिया, विशेषण या अन्य क्रियाविशेषण की विशेषता बताता है।',
          te: 'ఒక క్రియను, విశేషణాన్ని లేదా మరొక క్రియా విశేషణాన్ని వర్ణించే పదం.',
        },
      },
      {
        term: 'Adjective vs Adverb Distinction',
        definition: {
          en: 'Adjectives modify nouns and pronouns (answering "what kind?", "which one?"), whereas adverbs modify verbs, adjectives, and adverbs (answering "how?", "when?", "where?", "why?", "how much?").',
          hi: 'विशेषण संज्ञा/सर्वनाम का वर्णन करते हैं, जबकि क्रियाविशेषण क्रिया, विशेषण या अन्य क्रियाविशेषण का वर्णन करते हैं।',
          te: 'విశేషణాలు నామవాచకాలను వర్ణిస్తాయి, క్రియా విశేషణాలు క్రియలు లేదా విశేషణాలను వర్ణిస్తాయి.',
        },
      },
      {
        term: 'Flat Adverb',
        definition: {
          en: 'An adverb that shares the exact same morphological form as its corresponding adjective without an -ly suffix (e.g., fast, hard, straight, early).',
          hi: 'ऐसा क्रियाविशेषण जिसका रूप बिना -ly जोड़े उसके विशेषण जैसा ही रहता है (जैसे fast, hard, early)।',
          te: '-ly ప్రత్యయం లేకుండా విశేషణం వలెనే ఉండే క్రియా విశేషణం (ఉదా: fast, hard, late).',
        },
      },
      {
        term: 'False -ly Adjectives',
        definition: {
          en: 'Words ending in -ly formed from nouns that function purely as adjectives, not adverbs (e.g., friend -> friendly, love -> lovely, coward -> cowardly).',
          hi: 'संज्ञा से बने -ly वाले शब्द जो केवल विशेषण होते हैं, क्रियाविशेषण नहीं (जैसे friendly, lovely)।',
          te: 'నామవాచకాల నుండి ఏర్పడి -ly తో ముగిసే కేవలం విశేషణమైన పదాలు (ఉదా: friendly, lovely).',
        },
      },
    ],
    principlesAndRules: [
      {
        heading: 'Rule 1: The Three Modifying Targets',
        rule: {
          en: 'Adverbs modify: (1) Verbs: "Priya spoke clearly." (2) Adjectives: "The mountain is unusually steep." (3) Other Adverbs: "The athlete ran remarkably fast."',
          hi: 'क्रियाविशेषण तीन को संशोधित करता है: (1) क्रिया, (2) विशेषण, (3) दूसरा क्रियाविशेषण।',
          te: 'క్రియా విశేషణం మూడు పదాలను వర్ణిస్తుంది: (1) క్రియలు, (2) విశేషణాలు, (3) ఇతర క్రియా విశేషణాలు.',
        },
        formulaOrStructure: 'Adverb -> Verb | Adjective | Another Adverb',
      },
      {
        heading: 'Rule 2: Adjective vs Adverb (Good vs Well)',
        rule: {
          en: '"Good" is an adjective modifying nouns ("a good essay"). "Well" is the corresponding adverb modifying verbs ("she writes well"). Exception: "well" can be an adjective only when denoting health ("I feel well"). Never say "He played good"; say "He played well".',
          hi: '"Good" विशेषण है (A good song), जबकि "Well" क्रियाविशेषण है (She sings well)। कभी भी "He did good" न कहें; "He did well" कहें।',
          te: '"Good" అనేది విశేషణం (Good work), "Well" అనేది క్రియా విశేషణం (Worked well). "He speaks good" అనరాదు, "He speaks well" అనాలి.',
        },
        formulaOrStructure: 'Noun + is + Good (Adj) | Verb + Well (Adv)',
      },
      {
        heading: 'Rule 3: Flat Adverbs Never Take "-ly"',
        rule: {
          en: 'Words like "fast", "hard", "early", "late" act as both adjectives and adverbs directly. "Fastly" is an invalid word. "Hardly" exists but has a completely different meaning ("scarcely/barely"), NOT "with great effort".',
          hi: '"Fastly" कोई शब्द नहीं है; हमेशा "fast" का प्रयोग करें। "Hardly" का अर्थ "मुश्किल से" (barely) होता है, न कि "मेहनत से"।',
          te: '"Fastly" అనే పదం లేదు; "fast" అని మాత్రమే రాయాలి. "Hardly" అంటే "కష్టపడి" అని కాదు, "అరుదుగా/దాదాపు కాదు" అని అర్థం.',
        },
        formulaOrStructure: 'Drive fast (Correct) | Drive fastly (Incorrect!)',
      },
      {
        heading: 'Rule 4: Converting False -ly Adjectives into Adverbial Phrases',
        rule: {
          en: 'Because "friendly" and "cowardly" are adjectives, you cannot say "He acted friendly." You must wrap them into a prepositional adverbial phrase: "He acted in a friendly manner / in a friendly way."',
          hi: '"friendly" एक विशेषण है। क्रिया की विशेषता बताने के लिए "in a friendly manner" वाक्यांश का प्रयोग करें।',
          te: '"friendly" విశేషణం కాబట్టి, క్రియ కోసం "in a friendly manner" అనే పదబంధాన్ని వాడాలి.',
        },
        formulaOrStructure: 'Subject + Verb + in a [friendly / lovely] manner',
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'Analyze the word "fast" in these two sentences and determine its part of speech in each: (A) "The train is very fast." (B) "The train travels fast."',
          hi: 'दोनों वाक्यों में "fast" का शब्द भेद (Part of Speech) पहचानें: (A) "The train is very fast." (B) "The train travels fast."',
          te: 'ఈ రెండు వాక్యాలలో "fast" ఏ భాషా భాగమో గుర్తించండి: (A) "The train is very fast." (B) "The train travels fast."',
        },
        stepByStep: [
          {
            en: 'Step 1: In sentence (A), "fast" describes the noun "train" following the linking verb "is". Words that describe nouns are adjectives. Therefore, in (A), "fast" is a predicate adjective.',
            hi: 'चरण 1: वाक्य (A) में "fast" संज्ञा "train" की विशेषता बता रहा है, अतः यह विशेषण (Adjective) है।',
            te: 'దశ 1: వాక్యం (A) లో "fast" నామవాచకం "train" ను వర్ణిస్తుంది, కాబట్టి ఇది విశేషణం (Adjective).',
          },
          {
            en: 'Step 2: In sentence (B), "fast" describes how the train performs the action verb "travels" (answering the question: How does it travel?). Words that modify action verbs are adverbs. Therefore, in (B), "fast" is an adverb of manner.',
            hi: 'चरण 2: वाक्य (B) में "fast" क्रिया "travels" की गति या तरीका बता रहा है (How does it travel?), अतः यह क्रियाविशेषण (Adverb) है।',
            te: 'దశ 2: వాక్యం (B) లో "fast" క్రియ "travels" ఎలా జరుగుతుందో తెలియజేస్తుంది, కాబట్టి ఇది క్రియా విశేషణం (Adverb).',
          },
          {
            en: 'Step 3: Notice that the form of "fast" remains identical in both cases. "Fast" is a classic flat adverb and does not change to "fastly".',
            hi: 'चरण 3: दोनों में शब्द का रूप एक समान है। "Fastly" कोई शब्द नहीं है।',
            te: 'దశ 3: రెండింటిలోనూ పదం మారదు. "Fastly" అనే పదం వాడకూడదు.',
          },
        ],
        finalAnswer: '(A) Adjective qualifying the noun "train"; (B) Adverb of manner modifying the verb "travels".',
        keyInsight: {
          en: 'Identify the target word being modified: if it is a noun, the modifier is an adjective; if it is an action verb, it is an adverb.',
          hi: 'हमेशा देखें कि शब्द किसकी विशेषता बता रहा है: संज्ञा की (तो विशेषण) या क्रिया की (तो क्रियाविशेषण)।',
          te: 'నామవాచకాన్ని వర్ణిస్తే విశేషణం; క్రియను వర్ణిస్తే క్రియా విశేషణం.',
        },
      },
      {
        problem: {
          en: 'Identify all the adverbs in this sentence and state what word each adverb modifies: "The remarkably gifted violinist played the concerto extremely well yesterday."',
          hi: 'इस वाक्य में सभी क्रियाविशेषण पहचानें और बताएं कि वे किस शब्द को संशोधित कर रहे हैं: "The remarkably gifted violinist played the concerto extremely well yesterday."',
          te: 'ఈ వాక్యంలోని అన్ని క్రియా విశేషణాలను మరియు అవి వేటిని వర్ణిస్తున్నాయో గుర్తించండి: "The remarkably gifted violinist played the concerto extremely well yesterday."',
        },
        stepByStep: [
          {
            en: '1. "remarkably" modifies the adjective "gifted" (answering: To what degree is the violinist gifted? -> Adverb of degree).',
            hi: '1. "remarkably" विशेषण "gifted" की विशेषता बता रहा है (क्रियाविशेषण)।',
            te: '1. "remarkably" విశేషణం "gifted" ను వర్ణిస్తుంది (Degree adverb).',
          },
          {
            en: '2. "well" modifies the main action verb "played" (answering: How did she play? -> Adverb of manner).',
            hi: '2. "well" क्रिया "played" की विशेषता बता रहा है (Manner adverb)।',
            te: '2. "well" క్రియ "played" ను వర్ణిస్తుంది (Manner adverb).',
          },
          {
            en: '3. "extremely" modifies the adverb "well" (answering: How well did she play? -> Adverb of degree modifying another adverb).',
            hi: '3. "extremely" दूसरे क्रियाविशेषण "well" की विशेषता बता रहा है।',
            te: '3. "extremely" మరొక క్రియా విశేషణం "well" ను వర్ణిస్తుంది.',
          },
          {
            en: '4. "yesterday" modifies the verb "played" (answering: When was the concerto played? -> Adverb of time).',
            hi: '4. "yesterday" क्रिया "played" का समय बता रहा है (Time adverb)।',
            te: '4. "yesterday" క్రియ "played" సమయాన్ని తెలుపుతుంది (Time adverb).',
          },
        ],
        finalAnswer: 'Four adverbs: "remarkably" (modifies adj "gifted"), "well" (modifies verb "played"), "extremely" (modifies adv "well"), and "yesterday" (modifies verb "played").',
        keyInsight: {
          en: 'A single sentence can weave multiple adverbs that modify verbs, adjectives, and sister adverbs concurrently.',
          hi: 'एक ही वाक्य में क्रिया, विशेषण और अन्य क्रियाविशेषण को संशोधित करने वाले कई क्रियाविशेषण हो सकते हैं।',
          te: 'ఒకే వాక్యంలో క్రియలు, విశేషణాలు మరియు ఇతర అడ్వెర్బ్‌లను వర్ణించే పలు క్రియా విశేషణాలు ఉండవచ్చు.',
        },
      },
    ],
    diagramsAndTables: [
      {
        title: 'Adjective vs Adverb Comparison Matrix',
        description: {
          en: 'Comparative reference table showcasing how adjectives and adverbs differ across modifying roles and example sentences.',
          hi: 'विशेषण और क्रियाविशेषण के बीच अंतर दर्शाने वाली तालिका।',
          te: 'విశేషణాలు మరియు క్రియా విశేషణాల మధ్య భేదాన్ని చూపే పోలిక పట్టిక.',
        },
        asciiDiagramOrTable: `
+----------------+-------------------------------+-----------------------------------+
| Feature        | Adjective                     | Adverb                            |
+----------------+-------------------------------+-----------------------------------+
| Target         | Nouns & Pronouns              | Verbs, Adjectives & Other Adverbs |
| Key Questions  | Which one? What kind? How many| How? When? Where? How much/often? |
| Regular Suffix | -ful, -ous, -able, -ive, -ic  | Usually -ly (from adjective)      |
| Example 1      | She is a QUICK runner.        | She runs QUICKLY.                 |
| Example 2      | This is a HARD puzzle.        | The team worked HARD.             |
| Example 3      | He is a GOOD orator.          | He speaks WELL.                   |
| Trap Words     | friendly, lovely, lonely      | fast, late, early, hard (flat)    |
+----------------+-------------------------------+-----------------------------------+
        `,
      },
    ],
    realWorldApplications: [
      {
        en: 'Formal Scientific Reports: Precise adverbs of degree (e.g., "temperature rose significantly", "reaction completed partially") provide scientific quantitative clarity.',
        hi: 'वैज्ञानिक रिपोर्ट: डिग्री क्रियाविशेषण जैसे "significantly", "partially" वैज्ञानिक सटीकता प्रदान करते हैं।',
        te: 'శాస్త్రీయ నివేదికలు: "significantly", "partially" వంటి క్రియా విశేషణాలు సరైన విశ్లేషణను అందిస్తాయి.',
      },
      {
        en: 'Aviation and Navigation: Precision commands use adverbs of manner and direction: "turn sharply starboard", "descend gradually".',
        hi: 'विमानन और दिशा निर्देश: "turn sharply", "descend gradually" जैसे सटीक निर्देश दिए जाते हैं।',
        te: 'నావిగేషన్: "turn sharply", "descend gradually" వంటి స్పష్టమైన సూచనలు ఇస్తారు.',
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Using "good" (adjective) instead of "well" (adverb): "The student performed good in the science quiz."',
          hi: '"well" के स्थान पर "good" का प्रयोग: "The student performed good..."',
          te: '"well" కి బదులు "good" వాడటం: "The student performed good..."',
        },
        correction: {
          en: 'Use "well" to modify action verbs: "The student performed well in the science quiz."',
          hi: 'क्रिया की विशेषता बताने के लिए "well" का प्रयोग करें: "The student performed well..."',
          te: 'క్రియను వర్ణించడానికి "well" వాడాలి: "The student performed well..."',
        },
        whyItHappens: {
          en: 'Colloquial spoken English often replaces "well" with "good", which violates formal academic grammar rules.',
          hi: 'आम बोलचाल में अक्सर "well" की जगह "good" बोल दिया जाता है।',
          te: 'మాట్లాడే భాషలో పొరపాటుగా "well" బదులు "good" అనడం వల్ల.',
        },
      },
      {
        mistake: {
          en: 'Adding "-ly" to flat adverbs: "The athlete ran fastly to catch the bus."',
          hi: '"fast" में -ly जोड़ना: "The athlete ran fastly..."',
          te: '"fast" కి -ly చేర్చి "fastly" అనడం.',
        },
        correction: {
          en: '"Fast" is already both an adjective and an adverb: "The athlete ran fast to catch the bus."',
          hi: '"fastly" गलत है; सही शब्द "fast" है।',
          te: '"fastly" తప్పు; సరైన పదం "fast".',
        },
        whyItHappens: {
          en: 'Overgeneralizing the rule that adverbs of manner must always end in "-ly".',
          hi: 'यह मान लेना कि सभी Manner क्रियाविशेषणों में -ly होना चाहिए।',
          te: 'అన్ని అడ్వెర్బ్‌లకు -ly ఉండాలని భావించడం వల్ల.',
        },
      },
      {
        mistake: {
          en: 'Confusing "hard" with "hardly": "He worked hardly all semester to top the exam."',
          hi: '"hard" की जगह "hardly" लिखना: "He worked hardly..."',
          te: '"hard" బదులు "hardly" వాడటం: "He worked hardly..."',
        },
        correction: {
          en: '"Hard" means with intense effort; "hardly" means almost not at all! Say: "He worked hard all semester."',
          hi: '"Hard" का अर्थ है कड़ी मेहनत से, जबकि "Hardly" का अर्थ है मुश्किल से या न के बराबर।',
          te: '"Hard" అంటే కష్టపడి, "Hardly" అంటే దాదాపు ఏమీ చేయకుండా అని అర్థం.',
        },
        whyItHappens: {
          en: 'Assuming "hardly" is simply the adverb form of "hard" with the same core meaning.',
          hi: 'यह गलतफहमी होना कि hardly का अर्थ मेहनत से होता है।',
          te: '"hardly" అంటే కష్టపడి అని పొరబడటం వల్ల.',
        },
      },
    ],
    importantPoints: [
      {
        en: 'The modifier "only" is the most frequently misplaced adverb in English. Compare: "Only Rohan ate two apples" (nobody else ate) vs "Rohan only ate two apples" (he did not peel or cook them) vs "Rohan ate only two apples" (no more than two). Always place "only" immediately before the word you intend to modify.',
        hi: '"Only" का स्थान बहुत महत्वपूर्ण है: "Only Rohan ate..." (केवल रोहन ने खाया) बनाम "Rohan ate only two apples" (केवल दो सेब खाए)।',
        te: '"Only" అనే పదాన్ని సరైన స్థానంలో ఉంచాలి: "Only Rohan ate" (రోహన్ మాత్రమే తిన్నాడు), "Rohan ate only two" (రెండు మాత్రమే తిన్నాడు).',
      },
      {
        en: 'Linking verbs (seem, appear, look, smell, taste, feel, sound, be) take predicate adjectives, not adverbs, when describing the subject! Example: "The soup tastes delicious" (NOT "deliciously"). "He feels sad" (NOT "sadly").',
        hi: 'स्वाद, गंध या अहसास कराने वाली लिंकिंग क्रियाओं (taste, smell, look, feel) के साथ विशेषण आता है, क्रियाविशेषण नहीं (The flower smells sweet, न कि sweetly)।',
        te: 'లింకింగ్ క్రియల (taste, smell, feel, look) తర్వాత విశేషణం రావాలి, అడ్వెర్బ్ కాదు (The soup tastes delicious).',
      },
    ],
    revisionNotes: [
      {
        en: 'Adverbs modify verbs, adjectives, and sister adverbs. They NEVER modify nouns directly.',
        hi: 'क्रियाविशेषण क्रिया, विशेषण या अन्य क्रियाविशेषण की विशेषता बताते हैं; संज्ञा की नहीं।',
        te: 'క్రియా విశేషణాలు క్రియలు, విశేషణాలు లేదా ఇతర అడ్వెర్బ్‌లను వర్ణిస్తాయి; నామవాచకాలను కాదు.',
      },
      {
        en: 'Adjective = Noun modifier ("quick cat"); Adverb = Verb/Adj modifier ("ran quickly").',
        hi: 'विशेषण = संज्ञा का गुण; क्रियाविशेषण = क्रिया का गुण।',
        te: 'విశేషణం = నామవాచక గుణం; క్రియా విశేషణం = క్రియా గుణం.',
      },
      {
        en: 'Flat adverbs: fast, hard, late, early, straight (never add -ly to "fast").',
        hi: 'फ्लैट एडवर्ब: fast, hard, late, early (इनमें -ly न जोड़ें)।',
        te: 'ఫ్లాట్ అడ్వెర్బ్‌లు: fast, hard, late, early (వీటికి -ly చేర్చరాదు).',
      },
    ],
    topicSummary: {
      en: 'Adverbs enrich language by answering how, when, where, how often, and to what degree actions occur. By differentiating adjectives from adverbs and mastering flat adverbs, students gain command over clear and error-free expression.',
      hi: 'क्रियाविशेषण भाषा को समृद्ध बनाते हैं। विशेषण और क्रियाविशेषण का सही अंतर समझकर विद्यार्थी परीक्षा में उत्कृष्ट प्रदर्शन कर सकते हैं।',
      te: 'క్రియా విశేషణాలు భాషకు సమగ్రతను చేకూరుస్తాయి. విశేషణం మరియు అడ్వెర్బ్ మధ్య వ్యత్యాసాన్ని అర్థం చేసుకోవడం ద్వారా దోషరహితంగా రాయవచ్చు.',
    },
    knowledgeCheckQuestions: [
      {
        question: {
          en: 'In the sentence "The exceedingly talented musician performed brilliantly," identify the two adverbs and the word each modifies.',
          hi: 'वाक्य "The exceedingly talented musician performed brilliantly" में दोनों क्रियाविशेषण पहचानें।',
          te: '"The exceedingly talented musician performed brilliantly" లోని రెండు అడ్వెర్బ్‌లను గుర్తించండి.',
        },
        answer: {
          en: '"exceedingly" is an adverb of degree modifying the adjective "talented"; "brilliantly" is an adverb of manner modifying the verb "performed".',
          hi: '"exceedingly" विशेषण "talented" को और "brilliantly" क्रिया "performed" को संशोधित करता है।',
          te: '"exceedingly" విశేషణం "talented" ను, "brilliantly" క్రియ "performed" ను వర్ణిస్తుంది.',
        },
        quickTip: {
          en: 'Notice that one adverb modifies an adjective while the other modifies a verb.',
          hi: 'एक क्रियाविशेषण विशेषण की विशेषता बता रहा है, दूसरा क्रिया की।',
          te: 'ఒకటి విశేషణాన్ని, మరొకటి క్రియను వర్ణిస్తుంది.',
        },
      },
      {
        question: {
          en: 'Is "friendly" in "The teacher has a friendly smile" an adverb or an adjective?',
          hi: '"The teacher has a friendly smile" में "friendly" क्या है?',
          te: '"The teacher has a friendly smile" లో "friendly" అనేది విశేషణమా లేక క్రియా విశేషణమా?',
        },
        answer: {
          en: '"friendly" is an ADJECTIVE because it directly describes the noun "smile" (answering: What kind of smile?). Words ending in -ly derived from nouns (friend + ly) are adjectives.',
          hi: '"friendly" एक विशेषण (Adjective) है क्योंकि यह संज्ञा "smile" की विशेषता बता रहा है।',
          te: '"friendly" అనేది విశేషణం (Adjective), ఎందుకంటే ఇది "smile" అనే నామవాచకాన్ని వర్ణిస్తుంది.',
        },
        quickTip: {
          en: 'Noun + ly = Adjective (friendly, fatherly, lovely). Adjective + ly = Adverb (quick + ly = quickly).',
          hi: 'संज्ञा + ly = विशेषण (friendly); विशेषण + ly = क्रियाविशेषण (quickly)।',
          te: 'నామవాచకం + ly = విశేషణం; విశేషణం + ly = క్రియా విశేషణం.',
        },
      },
    ],
    practiceExercises: [
      {
        instruction: {
          en: 'Choose the grammatically correct word for each sentence:',
          hi: 'प्रत्येक वाक्य के लिए सही शब्द चुनें:',
          te: 'ప్రతి వాక్యానికి సరైన పదాన్ని ఎంచుకోండి:',
        },
        exerciseProblem: {
          en: 'Sentence 1: "She solved the difficult puzzle (easy / easily)." Sentence 2: "Rohan spoke very (polite / politely) to the principal."',
          hi: 'वाक्य 1: "She solved the difficult puzzle (easy / easily)." वाक्य 2: "Rohan spoke very (polite / politely) to the principal."',
          te: 'వాక్యం 1: "She solved the difficult puzzle (easy / easily)." వాక్యం 2: "Rohan spoke very (polite / politely) to the principal."',
        },
        solutionHint: {
          en: 'Sentence 1: "easily" (modifies the action verb "solved"). Sentence 2: "politely" (modifies the action verb "spoke").',
          hi: 'दोनों में क्रिया की विशेषता बताने के लिए क्रियाविशेषण (easily, politely) आएगा।',
          te: 'రెండు సందర్భాల్లోనూ క్రియను వర్ణించడానికి easily, politely వాడాలి.',
        },
      },
    ],
    summaryPoints: [
      {
        en: 'Adverbs modify verbs, adjectives, and other adverbs, answering How, When, Where, How often, and To what degree.',
        hi: 'क्रियाविशेषण क्रिया, विशेषण और अन्य क्रियाविशेषण की विशेषता बताते हैं।',
        te: 'క్రియా విశేషణాలు క్రియలు, విశేషణాలు మరియు ఇతర అడ్వెర్బ్‌లను వర్ణిస్తాయి.',
      },
      {
        en: 'Adjectives modify nouns; adverbs modify actions and qualities. Never substitute "good" for "well" when describing actions.',
        hi: 'संज्ञा के लिए विशेषण, क्रिया के लिए क्रियाविशेषण ("spoke well", न कि "spoke good")।',
        te: 'నామవాచకాలకు విశేషణం, పనులకు క్రియా విశేషణం ("spoke well" అనాలి).',
      },
      {
        en: 'Flat adverbs like "fast" and "hard" never take -ly. "Fastly" is an invalid word.',
        hi: '"fastly" अमान्य है; "fast" स्वयं क्रियाविशेषण है।',
        te: '"fastly" తప్పు; "fast" స్వయంగా క్రియా విశేషణం.',
      },
    ],
  },

  // 2. CBSE Class 8 English - Types of Adverbs & Sentence Placement
  {
    id: 'les_cbse8_eng_adv_c2',
    chapterId: 'ch_cbse8_eng_adverbs',
    conceptId: 'con_cbse8_eng_adv_c2',
    title: 'Types of Adverbs (Manner, Time, Place, Frequency, Degree) & Sentence Placement',
    topicIntroduction: {
      en: 'Adverbs are categorized into five primary classes based on the nature of information they provide: Manner (how an action is executed), Time (when it occurred), Place (where it took place), Frequency (how often it recurs), and Degree (intensity or completeness). Placing adverbs in their proper syntactic position inside a sentence is vital for clear, unambiguous communication.',
      hi: 'क्रियाविशेषण पांच प्रमुख प्रकार के होते हैं: रीतिवाचक (Manner - कैसे), कालवाचक (Time - कब), स्थानवाचक (Place - कहाँ), आवृत्तिवाचक (Frequency - कितनी बार), और परिमाणवाचक (Degree - कितना/किस हद तक)।',
      te: 'క్రియా విశేషణాలు ఐదు ప్రధాన రకాలు: విధానం (Manner - ఎలా), సమయం (Time - ఎప్పుడు), స్థలం (Place - ఎక్కడ), పౌనఃపున్యం (Frequency - ఎన్నిసార్లు), పరిమాణం (Degree - ఎంతవరకు).',
    },
    whyLearn: {
      en: 'Understanding adverb classification and strict syntactic word order enables you to construct balanced sentences, place adverbs of frequency correctly with auxiliary and main verbs, avoid misplaced modifiers, and excel in competitive language assessments.',
      hi: 'क्रियाविशेषणों के प्रकार और वाक्य में उनके सही स्थान को समझने से आप व्याकरण सम्मत और प्रभावशाली वाक्य लिख सकते हैं।',
      te: 'క్రియా విశేషణాల రకాలు మరియు వాక్యంలో వాటి స్థానాన్ని నేర్చుకోవడం వల్ల తప్పులు లేకుండా సరైన క్రమంలో వాక్యాలు నిర్మించవచ్చు.',
    },
    learningObjectives: [
      'Classify any given adverb into one of the 5 core classes: Manner, Time, Place, Frequency, or Degree',
      'Master the syntactic placement rule for Adverbs of Frequency: BEFORE main verbs, but AFTER linking / auxiliary verbs (be, have, do, modals)',
      'Apply the standard order of multiple adverbs at the end of a sentence: Manner -> Place -> Time (MPT rule)',
      'Position adverbs of degree (extremely, quite, barely, almost) immediately before the specific adjective or adverb they modify',
      'Correct misplaced adverb errors that distort sentence semantics',
    ],
    prerequisiteKnowledge: [
      {
        en: 'Identification of main verbs (walk, write, sing) vs auxiliary/be verbs (is, are, was, were, has, have, can, will).',
        hi: 'मुख्य क्रिया (Main Verb) और सहायक क्रिया (Auxiliary/Be Verb) के बीच अंतर।',
        te: 'ప్రధాన క్రియ (Main Verb) మరియు సహాయక క్రియ (Auxiliary Verb) మధ్య తేడా.',
      },
    ],
    explanation: {
      en: 'The 5 major types of adverbs are:\n1. Adverbs of Manner: Answer "How?". Examples: gracefully, quietly, patiently, fiercely.\n2. Adverbs of Time: Answer "When?". Examples: yesterday, today, tomorrow, now, soon, already.\n3. Adverbs of Place: Answer "Where?". Examples: everywhere, outside, nearby, upstairs, here, there.\n4. Adverbs of Frequency: Answer "How often?". Examples: always, usually, often, frequently, sometimes, seldom, rarely, never.\n5. Adverbs of Degree: Answer "How much?" or "To what extent?". Examples: extremely, completely, very, quite, barely, almost, thoroughly.\n\nPlacement Rules:\n• Frequency Adverbs: Placed BEFORE normal action verbs ("She ALWAYS arrives on time"), but AFTER forms of the verb "to be" ("She is ALWAYS on time") and AFTER modal auxiliaries ("She can NEVER forget that day").\n• Order of Multiple Adverbs: When combining adverbs of manner, place, and time at the end of a clause, follow the M-P-T order (Manner -> Place -> Time). Example: "She sang beautifully (Manner) at the auditorium (Place) yesterday (Time)."\n• Adverbs of Degree: Positioned immediately before the adjective, adverb, or verb they qualify. Example: "The water is EXTREMELY cold" (modifies cold).',
      hi: 'क्रियाविशेषण के 5 मुख्य प्रकार हैं:\n1. Manner (रीतिवाचक): कार्य कैसे हुआ (slowly, bravely)\n2. Time (कालवाचक): कार्य कब हुआ (yesterday, now, soon)\n3. Place (स्थानवाचक): कार्य कहाँ हुआ (here, there, outside)\n4. Frequency (आवृत्तिवाचक): कार्य कितनी बार हुआ (always, never, often)\n5. Degree (परिमाणवाचक): कार्य किस हद तक हुआ (very, extremely, barely)\n\nस्थान नियम: Frequency adverbs मुख्य क्रिया से पहले आते हैं (He ALWAYS reads), लेकिन "is/are/was/were" के बाद आते हैं (He is ALWAYS happy)!',
      te: 'క్రియా విశేషణాలు 5 రకాలు:\n1. Manner: పని ఎలా జరిగింది (bravely, quickly)\n2. Time: ఎప్పుడు జరిగింది (today, soon)\n3. Place: ఎక్కడ జరిగింది (here, outside)\n4. Frequency: ఎన్నిసార్లు జరిగింది (always, often, never)\n5. Degree: ఎంత తీవ్రతతో జరిగింది (very, extremely)\n\nనిబంధన: Frequency adverbs ప్రధాన క్రియకు ముందు వస్తాయి (She ALWAYS smiles), కానీ "be" రూపాల తర్వాత వస్తాయి (She is ALWAYS punctual)!',
    },
    definitions: [
      {
        term: 'Adverb of Manner',
        definition: {
          en: 'Tells how or in what manner an action is performed, usually formed by adding -ly to descriptive adjectives.',
          hi: 'बताता है कि कोई कार्य किस प्रकार या कैसे किया गया (जैसे swiftly, patiently)।',
          te: 'ఒక పని ఏ విధంగా జరిగిందో తెలియజేసే పదం (ఉదా: bravely, softly).',
        },
      },
      {
        term: 'Adverb of Frequency',
        definition: {
          en: 'Indicates how many times or how often an event occurs over a span of time (e.g., always, often, seldom, never).',
          hi: 'बताता है कि कोई क्रिया कितनी बार घटित होती है (जैसे always, sometimes, never)।',
          te: 'ఒక పని ఎంత తరచుగా జరుగుతుందో తెలిపే పదం (ఉదా: always, often, rarely).',
        },
      },
      {
        term: 'Adverb of Degree',
        definition: {
          en: 'Specifies the intensity, degree, or extent of an action, quality, or other modifier (e.g., extremely, quite, barely).',
          hi: 'किसी गुण, क्रिया या अन्य क्रियाविशेषण की तीव्रता या सीमा को दर्शाता है (जैसे very, extremely)।',
          te: 'తీవ్రత లేదా పరిమాణాన్ని తెలియజేసే పదం (ఉదా: very, thoroughly, almost).',
        },
      },
      {
        term: 'The M-P-T Rule',
        definition: {
          en: 'The natural syntactical order when multiple adverbs appear together: Manner first, followed by Place, followed by Time.',
          hi: 'वाक्य के अंत में क्रियाविशेषणों का क्रम: पहले Manner, फिर Place, फिर Time (M-P-T)।',
          te: 'వాక్యం చివర అడ్వెర్బ్‌ల సహజ క్రమం: విధానం (Manner) -> స్థలం (Place) -> సమయం (Time).',
        },
      },
    ],
    principlesAndRules: [
      {
        heading: 'Rule 1: Syntactic Placement of Adverbs of Frequency',
        rule: {
          en: 'Position Frequency Adverbs: (1) BEFORE simple main verbs: "Suresh ALWAYS eats breakfast." (2) AFTER forms of "be" (is, am, are, was, were): "Suresh is ALWAYS punctual." (3) BETWEEN the auxiliary and main verb: "Suresh has ALWAYS loved cricket."',
          hi: 'आवृत्तिवाचक क्रियाविशेषण मुख्य क्रिया से पहले, लेकिन "is/are/was/were" के बाद आते हैं।',
          te: 'Frequency adverbs ప్రధాన క్రియకు ముందు, సహాయక క్రియ తర్వాత రావాలి.',
        },
        formulaOrStructure: 'Subject + Frequency + Main Verb  OR  Subject + [is/am/are/was/were] + Frequency',
      },
      {
        heading: 'Rule 2: The M-P-T Sequential Pattern',
        rule: {
          en: 'When sequencing multiple adverbial modifiers at the end of a clause: Manner comes first, Place comes second, and Time comes third. Example: "The choir sang enchantingly (M) in the cathedral (P) last evening (T)."',
          hi: 'क्रम नियम: रीति (Manner) -> स्थान (Place) -> समय (Time)।',
          te: 'క్రమ నియమం: Manner -> Place -> Time (MPT).',
        },
        formulaOrStructure: 'Verb + [Manner] + [Place] + [Time]',
      },
      {
        heading: 'Rule 3: Negative Frequency Inversion',
        rule: {
          en: 'When a negative frequency adverb (never, rarely, seldom, hardly) begins a sentence for dramatic emphasis, the auxiliary verb inverts with the subject: "Seldom HAVE I witnessed such courage" (NOT: "Seldom I have witnessed...").',
          hi: 'नकारात्मक क्रियाविशेषण से वाक्य शुरू होने पर सहायक क्रिया कर्ता से पहले आ जाती है (Inversion)।',
          te: 'వాక్యం Seldom, Never లతో మొదలైతే సహాయక క్రియ కర్తకు ముందు వస్తుంది.',
        },
        formulaOrStructure: 'Negative Adverb + Auxiliary Verb + Subject + Main Verb',
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'Correct the placement of the frequency adverb in: "Pooja always is cheerful when she meets her friends."',
          hi: 'इस वाक्य में आवृत्तिवाचक क्रियाविशेषण की स्थिति ठीक करें: "Pooja always is cheerful..."',
          te: 'ఈ వాక్యంలో అడ్వెర్బ్ స్థానాన్ని సరిచేయండి: "Pooja always is cheerful..."',
        },
        stepByStep: [
          {
            en: 'Step 1: Identify the verb in the main clause. The verb is "is", which is a linking form of "to be".',
            hi: 'चरण 1: क्रिया पहचानें। यहाँ "is" क्रिया है।',
            te: 'దశ 1: క్రియను గుర్తించండి. ఇక్కడ "is" ఉంది.',
          },
          {
            en: 'Step 2: Recall the Frequency Placement Rule: Adverbs of frequency MUST be placed AFTER forms of "to be" (is, am, are, was, were), not before them.',
            hi: 'चरण 2: नियम के अनुसार frequency adverbs "is/are/was/were" के बाद आते हैं।',
            te: 'దశ 2: నిబంధన ప్రకారం frequency adverbs "is" తర్వాత రావాలి.',
          },
          {
            en: 'Step 3: Move "always" directly after "is": "Pooja is always cheerful when she meets her friends."',
            hi: 'चरण 3: "always" को "is" के बाद रखें: "Pooja is always cheerful..."',
            te: 'దశ 3: "always" ని "is" తర్వాత ఉంచండి: "Pooja is always cheerful..."',
          },
        ],
        finalAnswer: 'Correct: "Pooja is always cheerful when she meets her friends."',
        keyInsight: {
          en: 'With regular action verbs: [Subject + Frequency + Verb]. With "to be": [Subject + BE + Frequency].',
          hi: 'सामान्य क्रिया में पहले; "to be" में बाद में।',
          te: 'సాధారణ క్రియకు ముందు; "be" రూపాల తర్వాత.',
        },
      },
      {
        problem: {
          en: 'Arrange the scrambled modifiers into a natural sentence following the M-P-T rule: "The children played / yesterday afternoon / enthusiastically / in the garden."',
          hi: 'M-P-T नियम के अनुसार सही क्रम में लगाएं: "The children played / yesterday afternoon / enthusiastically / in the garden."',
          te: 'M-P-T నిబంధన ప్రకారం సరైన క్రమంలో వాక్యాన్ని రాయండి.',
        },
        stepByStep: [
          {
            en: '1. Identify the Manner adverb: "enthusiastically" (How did they play?).',
            hi: '1. Manner: "enthusiastically" (कैसे खेले?)',
            te: '1. Manner: "enthusiastically" (ఎలా ఆడారు?)',
          },
          {
            en: '2. Identify the Place adverbial: "in the garden" (Where did they play?).',
            hi: '2. Place: "in the garden" (कहाँ खेले?)',
            te: '2. Place: "in the garden" (ఎక్కడ ఆడారు?)',
          },
          {
            en: '3. Identify the Time adverbial: "yesterday afternoon" (When did they play?).',
            hi: '3. Time: "yesterday afternoon" (कब खेले?)',
            te: '3. Time: "yesterday afternoon" (ఎప్పుడు ఆడారు?)',
          },
          {
            en: '4. Sequence according to Manner -> Place -> Time: "The children played enthusiastically (M) in the garden (P) yesterday afternoon (T)."',
            hi: '4. M-P-T क्रम में जोड़ें।',
            te: '4. M-P-T క్రమంలో జోడించండి.',
          },
        ],
        finalAnswer: 'The children played enthusiastically in the garden yesterday afternoon.',
        keyInsight: {
          en: 'Applying M-P-T creates idiomatic English rhythm and prevents awkward descriptive clumping.',
          hi: 'M-P-T क्रम वाक्य को स्वाभाविक और व्याकरण सम्मत बनाता है।',
          te: 'M-P-T క్రమం వాక్యానికి సరైన లయను మరియు స్పష్టతను ఇస్తుంది.',
        },
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Placing frequency adverbs before the verb "to be": "He often is tired after tennis practice."',
          hi: '"to be" से पहले आवृत्तिवाचक क्रियाविशेषण लगाना: "He often is tired..."',
          te: '"is" కి ముందు frequency adverb పెట్టడం: "He often is tired..."',
        },
        correction: {
          en: 'Place it after the "be" verb: "He is often tired after tennis practice."',
          hi: 'सही रूप: "He is often tired..."',
          te: 'సరైన రూపం: "He is often tired..."',
        },
        whyItHappens: {
          en: 'Applying the general rule [Adverb + Main Verb] to the verb "to be", forgetting that "to be" is an exception requiring the adverb after it.',
          hi: 'सामान्य क्रिया के नियम को "to be" पर लागू कर देना।',
          te: '"to be" నిబంధనను మరచిపోవడం వల్ల.',
        },
      },
      {
        mistake: {
          en: 'Scrambling the M-P-T order: "She danced yesterday beautifully on the stage."',
          hi: 'M-P-T क्रम बिगाड़ना: "She danced yesterday beautifully on the stage."',
          te: 'M-P-T క్రమాన్ని మార్చి రాయడం.',
        },
        correction: {
          en: 'Place manner first, then place, then time: "She danced beautifully on the stage yesterday."',
          hi: 'सही क्रम: "She danced beautifully (M) on the stage (P) yesterday (T)."',
          te: 'సరైన క్రమం: "She danced beautifully on the stage yesterday."',
        },
        whyItHappens: {
          en: 'Translating thought clauses directly from mother tongue without structuring English adverbial word order.',
          hi: 'मातृभाषा से सीधे अनुवाद करने के कारण।',
          te: 'మాతృభాష నుండి నేరుగా అనువాదం చేయడం వల్ల.',
        },
      },
    ],
    importantPoints: [
      {
        en: 'Adverbs of Degree like "almost", "nearly", and "quite" belong right before the word they modify. "I nearly lost all my money" is vastly different from "I lost nearly all my money"!',
        hi: 'डिग्री एडवर्ब उसी शब्द के ठीक पहले आना चाहिए जिसकी वह विशेषता बताता है।',
        te: 'Degree adverbs ఏ పదాన్ని వర్ణిస్తున్నాయో దానికి సరిగ్గా ముందే ఉండాలి.',
      },
    ],
    revisionNotes: [
      {
        en: 'The 5 Adverb Types: Manner (How?), Time (When?), Place (Where?), Frequency (How often?), Degree (To what extent?).',
        hi: '5 प्रकार: Manner (रीति), Time (समय), Place (स्थान), Frequency (आवृत्ति), Degree (परिमाण)।',
        te: '5 రకాలు: Manner, Time, Place, Frequency, Degree.',
      },
      {
        en: 'Placement: Frequency goes BEFORE main verbs, AFTER "be" verbs. Multiple adverbs follow M-P-T (Manner-Place-Time).',
        hi: 'Frequency मुख्य क्रिया से पहले, "be" के बाद। क्रम: Manner -> Place -> Time।',
        te: 'Frequency సాధారణ క్రియకు ముందు, "be" తర్వాత. క్రమం: Manner -> Place -> Time.',
      },
    ],
    topicSummary: {
      en: 'Categorizing adverbs into Manner, Time, Place, Frequency, and Degree, and adhering to strict syntactic placement rules transforms student writing into precise, confident, and natural English.',
      hi: 'क्रियाविशेषणों के प्रकार और उनके सही स्थान के नियमों को जानकर छात्र धाराप्रवाह और सटीक अंग्रेजी लिख सकते हैं।',
      te: 'క్రియా విశేషణాల రకాలు మరియు వాటి వాక్య స్థాన నిబంధనలను పాటించడం ద్వారా ఆంగ్లంలో ప్రావీణ్యం పొందవచ్చు.',
    },
    knowledgeCheckQuestions: [
      {
        question: {
          en: 'In which sentence is the adverb of frequency positioned correctly: (A) "Ravi never has eaten sushi." (B) "Ravi has never eaten sushi." (C) "Ravi has eaten never sushi."',
          hi: 'किस वाक्य में आवृत्तिवाचक क्रियाविशेषण सही स्थान पर है?',
          te: 'ఏ వాక్యంలో frequency adverb సరైన స్థానంలో ఉంది?',
        },
        answer: {
          en: '(B) "Ravi has never eaten sushi." When an auxiliary verb ("has") and a main participle ("eaten") appear together, the frequency adverb sits between them.',
          hi: '(B) सही है। सहायक क्रिया (has) और मुख्य क्रिया (eaten) के बीच में frequency adverb आता है।',
          te: '(B) సరైనది. సహాయక క్రియ (has) మరియు ప్రధాన క్రియ (eaten) మధ్యలో frequency adverb ఉంటుంది.',
        },
        quickTip: {
          en: 'Formula: [Auxiliary Verb + Frequency Adverb + Main Verb].',
          hi: 'सूत्र: [Auxiliary + Frequency + Main Verb]।',
          te: 'సూత్రం: [Auxiliary + Frequency + Main Verb].',
        },
      },
    ],
    practiceExercises: [
      {
        instruction: {
          en: 'Classify the underlined adverbs by type (Manner, Time, Place, Frequency, or Degree):',
          hi: 'क्रियाविशेषणों का प्रकार बताएं:',
          te: 'క్రియా విశేషణాల రకాన్ని తెలపండి:',
        },
        exerciseProblem: {
          en: '(1) The sun shines everywhere. (2) She almost finished the test. (3) The doctor visits the clinic weekly.',
          hi: '(1) everywhere (2) almost (3) weekly',
          te: '(1) everywhere (2) almost (3) weekly',
        },
        solutionHint: {
          en: '(1) everywhere = Place (Where); (2) almost = Degree (To what extent); (3) weekly = Frequency (How often).',
          hi: '(1) Place, (2) Degree, (3) Frequency',
          te: '(1) Place, (2) Degree, (3) Frequency',
        },
      },
    ],
    summaryPoints: [
      {
        en: 'The 5 types of adverbs address manner, time, place, frequency, and intensity.',
        hi: 'क्रियाविशेषण के पांच प्रकार रीति, समय, स्थान, आवृत्ति और परिमाण को दर्शाते हैं।',
        te: 'క్రియా విశేషణాలు 5 రకాలు: Manner, Time, Place, Frequency, Degree.',
      },
      {
        en: 'Adverbs of frequency occur before main verbs, after "to be", and between compound verb tenses.',
        hi: 'Frequency क्रियाविशेषण मुख्य क्रिया से पहले और "to be" के बाद आते हैं।',
        te: 'Frequency adverbs ప్రధాన క్రియకు ముందు మరియు "be" రూపాల తర్వాత వస్తాయి.',
      },
      {
        en: 'Sentence-ending modifiers naturally organize as Manner -> Place -> Time (MPT).',
        hi: 'वाक्य के अंत में क्रम M-P-T होना चाहिए।',
        te: 'వాక్య అంత్య క్రమం M-P-T ఉండాలి.',
      },
    ],
  },
];
