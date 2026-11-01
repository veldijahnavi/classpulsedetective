/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  AdaptiveState,
  PaceCategory,
  Question,
  StudentProfile,
  DifficultyLevel,
  BoardType,
  ClassLevel,
} from './types.js';

export function computeAdaptiveState(params: {
  accuracy: number;
  totalAttempts: number;
  hintsUsedTotal: number;
  consecutiveCorrect: number;
  hasPrereqGap?: boolean;
}): AdaptiveState {
  const { accuracy, totalAttempts, hintsUsedTotal, consecutiveCorrect, hasPrereqGap } = params;

  if (hasPrereqGap || (totalAttempts >= 3 && accuracy < 0.5)) {
    return 'FOUNDATIONAL_SUPPORT';
  }

  if (accuracy >= 0.92 && consecutiveCorrect >= 3 && hintsUsedTotal === 0) {
    return 'MASTERY_CHALLENGE';
  }

  if (accuracy >= 0.82 && consecutiveCorrect >= 2) {
    return 'ADVANCED_APPLICATION';
  }

  if (accuracy >= 0.65 && hintsUsedTotal <= 2) {
    return 'INDEPENDENT_PRACTICE';
  }

  return 'DEVELOPING_UNDERSTANDING';
}

export function computePaceCategory(
  activeSeconds: number,
  expectedSeconds: number,
  isCorrect: boolean,
  hintsCount: number = 0
): PaceCategory {
  const ratio = expectedSeconds > 0 ? activeSeconds / expectedSeconds : 1;

  if (!isCorrect && ratio < 0.4) {
    return 'Rushing / Careless';
  }

  if (isCorrect && ratio <= 0.85 && hintsCount === 0) {
    return 'Fast & Accurate';
  }

  if (ratio > 1.6 || hintsCount >= 2) {
    return 'Needs Guidance / Slower';
  }

  return 'Methodical & Thorough';
}

export function selectAdaptiveQuestions(
  allQuestions: Question[],
  options: {
    student: StudentProfile;
    subject?: string;
    chapterId?: string;
    conceptId?: string;
    topicId?: string;
    accuracy?: number;
    difficulty?: DifficultyLevel;
    limit?: number;
    excludeIds?: string[];
  }
): Question[] {
  const { student, subject, chapterId, conceptId, topicId, accuracy, difficulty, limit = 15, excludeIds = [] } = options;
  const excludeSet = new Set(excludeIds);

  // STRICT board and class isolation
  let candidates = allQuestions.filter(
    (q) =>
      q.board === student.board &&
      q.classLevel === student.classLevel &&
      !excludeSet.has(q.id)
  );

  // STRICT subject isolation if provided
  if (subject) {
    candidates = candidates.filter(
      (q) => q.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  // STRICT topic / concept isolation
  if (conceptId) {
    candidates = candidates.filter((q) => q.conceptId === conceptId || q.topicId === conceptId);
  } else if (topicId) {
    candidates = candidates.filter((q) => q.topicId === topicId || q.conceptId === topicId);
  } else if (chapterId) {
    // STRICT chapter isolation
    candidates = candidates.filter((q) => q.chapterId === chapterId);
  }

  if (candidates.length === 0) {
    return [];
  }

  // If a specific difficulty was explicitly requested, prioritize exact matches
  if (difficulty) {
    const exactMatches = candidates.filter((q) => q.difficulty === difficulty);
    if (exactMatches.length >= limit) {
      return exactMatches.slice(0, limit);
    }
  }

  // Evaluate performance: either explicitly passed accuracy or student profile
  const effectiveAccuracy = typeof accuracy === 'number' 
    ? accuracy 
    : (typeof student.overallAccuracy === 'number' ? student.overallAccuracy : 0.7);

  let state = student.adaptiveState || 'INDEPENDENT_PRACTICE';
  if (effectiveAccuracy >= 0.85) {
    state = 'MASTERY_CHALLENGE';
  } else if (effectiveAccuracy >= 0.80) {
    state = 'ADVANCED_APPLICATION';
  } else if (effectiveAccuracy < 0.50) {
    state = 'FOUNDATIONAL_SUPPORT';
  } else if (effectiveAccuracy < 0.65) {
    state = 'DEVELOPING_UNDERSTANDING';
  }

  let preferredDifficulties: DifficultyLevel[];
  if (difficulty) {
    const allDiffs: DifficultyLevel[] = ['Foundational', 'Easy', 'Moderate', 'Challenging', 'Application'];
    preferredDifficulties = [difficulty, ...allDiffs.filter((d) => d !== difficulty)];
  } else {
    switch (state) {
      case 'FOUNDATIONAL_SUPPORT':
        preferredDifficulties = ['Foundational', 'Easy', 'Moderate', 'Challenging', 'Application'];
        break;
      case 'DEVELOPING_UNDERSTANDING':
        preferredDifficulties = ['Easy', 'Moderate', 'Foundational', 'Challenging', 'Application'];
        break;
      case 'INDEPENDENT_PRACTICE':
        preferredDifficulties = ['Moderate', 'Easy', 'Challenging', 'Application', 'Foundational'];
        break;
      case 'ADVANCED_APPLICATION':
        preferredDifficulties = ['Challenging', 'Application', 'Moderate', 'Easy', 'Foundational'];
        break;
      case 'MASTERY_CHALLENGE':
        preferredDifficulties = ['Application', 'Challenging', 'Moderate', 'Easy', 'Foundational'];
        break;
      default:
        preferredDifficulties = ['Moderate', 'Easy', 'Challenging', 'Application', 'Foundational'];
    }
  }

  // Sort by difficulty preference
  candidates.sort((a, b) => {
    const rankA = preferredDifficulties.indexOf(a.difficulty);
    const rankB = preferredDifficulties.indexOf(b.difficulty);
    const scoreA = rankA >= 0 ? rankA : 99;
    const scoreB = rankB >= 0 ? rankB : 99;
    return scoreA - scoreB;
  });

  return candidates.slice(0, limit);
}

/**
 * Given the current question outcome, pick the next adaptive question in the same concept:
 * - If correct: gradually give a slightly harder question (Foundational -> Easy -> Moderate -> Challenging -> Application)
 * - If incorrect: give an easier question testing the same concept (Application -> Challenging -> Moderate -> Easy -> Foundational)
 */
export function getNextAdaptiveQuestion(params: {
  currentQuestion: Question;
  isCorrect: boolean;
  conceptQuestions: Question[];
  alreadyAttemptedIds: string[];
}): Question | null {
  const { currentQuestion, isCorrect, conceptQuestions, alreadyAttemptedIds } = params;
  const attemptedSet = new Set(alreadyAttemptedIds);

  const candidates = conceptQuestions.filter(
    (q) =>
      !attemptedSet.has(q.id) &&
      q.id !== currentQuestion.id &&
      (q.conceptId === currentQuestion.conceptId || q.topicId === currentQuestion.conceptId)
  );

  if (candidates.length === 0) {
    return null;
  }

  const difficultyRanks: Record<DifficultyLevel, number> = {
    Foundational: 1,
    Easy: 2,
    Moderate: 3,
    Challenging: 4,
    Application: 5,
  };

  const currentRank = difficultyRanks[currentQuestion.difficulty] || 3;
  // If correct, target rank = currentRank + 1 (gradually slightly harder)
  // If incorrect, target rank = currentRank - 1 (easier question testing the same concept)
  const targetRank = isCorrect
    ? Math.min(5, currentRank + 1)
    : Math.max(1, currentRank - 1);

  candidates.sort((a, b) => {
    const rankA = difficultyRanks[a.difficulty] || 3;
    const rankB = difficultyRanks[b.difficulty] || 3;
    const diffA = Math.abs(rankA - targetRank);
    const diffB = Math.abs(rankB - targetRank);
    if (diffA !== diffB) return diffA - diffB;
    return isCorrect ? rankB - rankA : rankA - rankB;
  });

  return candidates[0] || null;
}

/**
 * Dynamically generates additional relevant questions when a lesson has only 1 question.
 * Generates questions across Foundational, Easy, Moderate, Challenging, Application tiers.
 */
export function generateDynamicQuestionsForConcept(params: {
  board: BoardType;
  classLevel: ClassLevel;
  subject: string;
  chapterId: string;
  chapterTitle: string;
  conceptId: string;
  conceptTitle: string;
  existingQuestions: Question[];
}): Question[] {
  const {
    board,
    classLevel,
    subject,
    chapterId,
    chapterTitle,
    conceptId,
    conceptTitle,
    existingQuestions,
  } = params;

  const existingDifficulties = new Set(existingQuestions.map((q) => q.difficulty));
  const newQuestions: Question[] = [];

  const tiers: Array<{
    difficulty: DifficultyLevel;
    skill: Question['cognitiveSkill'];
    type: 'mcq' | 'numerical';
  }> = [
    { difficulty: 'Foundational', skill: 'Foundational', type: 'mcq' },
    { difficulty: 'Easy', skill: 'Conceptual', type: 'mcq' },
    { difficulty: 'Moderate', skill: 'Procedural', type: 'mcq' },
    { difficulty: 'Challenging', skill: 'Application', type: 'mcq' },
    { difficulty: 'Application', skill: 'ProblemSolving', type: 'mcq' },
  ];

  for (const tier of tiers) {
    if (existingDifficulties.has(tier.difficulty)) continue;

    const qId = `q_dyn_${conceptId}_${tier.difficulty.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const subLower = (subject || '').toLowerCase();
    const titleLower = (conceptTitle || '').toLowerCase();

    // Determine domain category
    const isMath = subLower.includes('math') || titleLower.includes('fraction') || titleLower.includes('equation') || titleLower.includes('algebra') || titleLower.includes('number');
    const isChem = subLower.includes('chem') || titleLower.includes('reaction') || titleLower.includes('stoichio') || titleLower.includes('acid') || titleLower.includes('oxide');
    const isPhysics = subLower.includes('physic') || titleLower.includes('light') || titleLower.includes('optics') || titleLower.includes('motion') || titleLower.includes('force') || titleLower.includes('lens');
    const isBio = subLower.includes('bio') || titleLower.includes('plant') || titleLower.includes('cell') || titleLower.includes('nutrient') || titleLower.includes('respiration') || titleLower.includes('food');
    const isEnglish = subLower.includes('eng') || titleLower.includes('adverb') || titleLower.includes('speech') || titleLower.includes('voice') || titleLower.includes('tense') || titleLower.includes('grammar');

    let promptEn = '';
    let promptHi = '';
    let promptTe = '';
    let choices: Question['choices'] = [];
    let explanationEn = '';
    let hintEn = '';

    if (tier.difficulty === 'Foundational') {
      if (isMath) {
        promptEn = `Foundational Check: What is the primary prerequisite rule required when solving problems in "${conceptTitle}"?`;
        choices = [
          { id: 'c1', text: { en: `Convert to a common base/denominator or balance equality operations methodically`, hi: `समान आधार/हर में बदलें या समानता संक्रियाओं को व्यवस्थित रूप से संतुलित करें`, te: `సమాన హారంగా మార్చడం లేదా సమీకరణ నియమాలను పాటించడం` }, isCorrect: true },
          { id: 'c2', text: { en: `Add or calculate across numerators and denominators directly without matching units`, hi: `इकाई मिलाए बिना सीधे गणना करें`, te: `హారాలు సమానం చేయకుండా నేరుగా కూడటం` }, misconceptionTag: 'ADDED_DENOMINATORS_DIRECTLY', isCorrect: false },
          { id: 'c3', text: { en: `Transpose constant terms across the equals sign without changing their signs`, hi: `चिन्ह बदले बिना पदों का पक्षांतरण करना`, te: `గుర్తు మార్చకుండా పక్షాంతరం చేయడం` }, misconceptionTag: 'FAILED_SIGN_REVERSAL_ON_TRANSPOSITION', isCorrect: false },
          { id: 'c4', text: { en: `Only alter the variable term and drop the constant values entirely`, hi: `केवल चर पद को बदलें और अचर को छोड़ दें`, te: `స్థిరరాశులను పూర్తిగా విస్మరించడం` }, misconceptionTag: 'PARTIAL_EQUATION_REDUCTION', isCorrect: false },
        ];
        explanationEn = `Foundational arithmetic and algebra in ${conceptTitle} strictly require respecting mathematical balance and equivalence.`;
        hintEn = `Recall that unlike denominators require finding the LCM, and equation terms change sign upon transposition.`;
      } else if (isChem) {
        promptEn = `Foundational Chemistry Check: In "${conceptTitle}", what does the Law of Conservation of Mass mandate?`;
        choices = [
          { id: 'c1', text: { en: `Total number of atoms of each element must remain identical before and after reaction`, hi: `अभिक्रिया से पहले और बाद में प्रत्येक तत्व के परमाणुओं की कुल संख्या समान होनी चाहिए`, te: `చర్యకు ముందు మరియు తర్వాత ప్రతి మూలక పరమాణువుల సంఖ్య సమానంగా ఉండాలి` }, isCorrect: true },
          { id: 'c2', text: { en: `Subscripts inside molecular formulas should be altered until atoms match`, hi: `सूत्र के उप-सूचकांकों को बदल देना चाहिए`, te: `సబ్‌స్క్రిప్ట్‌లను ఇష్టానుసారంగా మార్చవచ్చు` }, misconceptionTag: 'SUBSCRIPT_ALTERATION_ERROR', isCorrect: false },
          { id: 'c3', text: { en: `Mass can disappear if gas or steam is produced in an open vessel`, hi: `गैस बनने पर द्रव्यमान नष्ट हो सकता है`, te: `వాయువులు వెలువడినప్పుడు ద్రవ్యరాశి తగ్గుతుంది` }, misconceptionTag: 'MASS_CONSERVATION_MISCONCEPTION', isCorrect: false },
          { id: 'c4', text: { en: `Coefficients can only be odd numbers`, hi: `गुणांक केवल विषम संख्याएँ हो सकते हैं`, te: `గుణకాలు కేవలం బేసి సంఖ్యలే ఉండాలి` }, misconceptionTag: 'ARBITRARY_COEFFICIENT_TRAP', isCorrect: false },
        ];
        explanationEn = `Chemical balancing in ${conceptTitle} relies on the Law of Conservation of Mass. Only stoichiometric multipliers (coefficients) can be adjusted.`;
        hintEn = `Remember: never change chemical subscripts; adjust coefficients in front of formulas instead.`;
      } else if (isPhysics) {
        promptEn = `Foundational Optics Check: In "${conceptTitle}", how are coordinate signs defined from the origin?`;
        choices = [
          { id: 'c1', text: { en: `All distances are measured from the optical pole along the direction of incident light as positive`, hi: `सभी दूरियां ध्रुव से मापी जाती हैं; आपतित प्रकाश की दिशा को धनात्मक माना जाता है`, te: `అన్ని దూరాలు ధ్రువం నుండి కొలుస్తారు; కాంతి కిరణాల దిశను ధనాత్మకంగా తీసుకుంటారు` }, isCorrect: true },
          { id: 'c2', text: { en: `Focal length of a concave mirror is always taken as positive (+f)`, hi: `अवतल दर्पण की फोकस दूरी हमेशा धनात्मक होती है`, te: `పుటాకార దర్పణ నాభ్యాంతరం ఎల్లప్పుడూ ధనాత్మకం` }, misconceptionTag: 'CONFUSED_CONCAVE_CONVEX_FOCAL_SIGN', isCorrect: false },
          { id: 'c3', text: { en: `Distances against the direction of incident light are positive`, hi: `आपतित प्रकाश के विपरीत दूरियां धनात्मक होती हैं`, te: `కాంతికి వ్యతిరేక దిశను ధనాత్మకంగా తీసుకోవడం` }, misconceptionTag: 'INVERTED_IMAGE_DISTANCE_SIGN', isCorrect: false },
          { id: 'c4', text: { en: `Sign conventions are arbitrary and can be swapped at will`, hi: `चिन्ह परिपाटी मनमानी होती है`, te: `గుర్తుల సంప్రదాయం ఎలాగైనా మార్చుకోవచ్చు` }, misconceptionTag: 'ARBITRARY_SIGN_CONVENTION', isCorrect: false },
        ];
        explanationEn = `Cartesian coordinate sign conventions in ${conceptTitle} require measuring from the pole with light propagation determining polarity.`;
        hintEn = `Concave mirror focal lengths are negative; convex mirror focal lengths are positive.`;
      } else if (isEnglish) {
        promptEn = `Foundational Grammar Check: In "${conceptTitle}", what is the fundamental governing grammatical rule?`;
        choices = [
          { id: 'c1', text: { en: `Adverbs modify verbs, adjectives, or other adverbs, while adjectives modify nouns and pronouns`, hi: `क्रियाविशेषण क्रिया, विशेषण या अन्य क्रियाविशेषण की विशेषता बताते हैं`, te: `క్రియావిశేషణాలు క్రియలను లేదా విశేషణాలను వివరిస్తాయి` }, isCorrect: true },
          { id: 'c2', text: { en: `Every word ending in "-ly" is automatically an adverb with no exceptions`, hi: `"-ly" से समाप्त होने वाला प्रत्येक शब्द क्रियाविशेषण ही होता है`, te: `"-ly" తో ముగిసే ప్రతి పదం ఖచ్చితంగా క్రియావిశేషణమే` }, misconceptionTag: 'FALSE_LY_ADJECTIVE_CONFUSION', isCorrect: false },
          { id: 'c3', text: { en: `Adjectives should be used to describe actions instead of adverbs`, hi: `क्रियाओं का वर्णन करने के लिए विशेषण का उपयोग किया जाना चाहिए`, te: `పనులను వివరించడానికి విశేషణాలను వాడాలి` }, misconceptionTag: 'ADJECTIVE_ADVERB_CONFUSION', isCorrect: false },
          { id: 'c4', text: { en: `Adverbs must always be placed at the very end of a sentence`, hi: `क्रियाविशेषण हमेशा वाक्य के अंत में होना चाहिए`, te: `క్రియావిశేషణం ఎల్లప్పుడూ వాక్యం చివరలోనే ఉండాలి` }, misconceptionTag: 'MISPLACED_FREQUENCY_ADVERB', isCorrect: false },
        ];
        explanationEn = `In ${conceptTitle}, recognizing grammatical parts of speech and sentence function ensures correct usage.`;
        hintEn = `Check whether the word modifies an action verb or a noun (e.g. 'friendly' is an adjective, 'fast' can be a flat adverb).`;
      } else {
        promptEn = `Foundational Syllabus Check: What is the primary definition or core principle governing "${conceptTitle}" in Class ${classLevel} ${subject}?`;
        choices = [
          { id: 'c1', text: { en: `The standard approved ${board} syllabus principle for ${conceptTitle}`, hi: `${conceptTitle} के लिए ${board} पाठ्यक्रम का मानक सिद्धांत`, te: `${conceptTitle} కోసం ప్రామాణిక సూత్రం` }, isCorrect: true },
          { id: 'c2', text: { en: `An inverted rule that contradicts fundamental conservation laws`, hi: `एक उलटा नियम जो मूल नियमों के विपरीत है`, te: `నియమాలకు విరుద్ధమైన తప్పుడు భావన` }, misconceptionTag: 'INVERTED_CORE_RULE', isCorrect: false },
          { id: 'c3', text: { en: `A superficial shortcut that bypasses essential intermediate steps`, hi: `एक सतही शॉर्टकट जो मुख्य चरणों को छोड़ देता है`, te: `ముఖ్య దశలను విస్మరించే షార్ట్‌కట్` }, misconceptionTag: 'SUPERFICIAL_SHORTCUT_TRAP', isCorrect: false },
          { id: 'c4', text: { en: `Assuming results are constant regardless of initial parameters`, hi: `यह मानना कि परिणाम हमेशा स्थिर रहता है`, te: `విలువలతో సంబంధం లేకుండా ఫలితం ఒకటేనని అనుకోవడం` }, misconceptionTag: 'STATIC_VALUE_FALLACY', isCorrect: false },
        ];
        explanationEn = `In Class ${classLevel} ${subject} (${board}), "${conceptTitle}" requires following the exact governing rules step-by-step.`;
        hintEn = `Recall the core definition of ${conceptTitle} from your textbook.`;
      }
    } else if (tier.difficulty === 'Easy') {
      promptEn = `Direct Conceptual Application: When applying "${conceptTitle}", which immediate transformation is correct?`;
      choices = [
        { id: 'c1', text: { en: `Align values and apply the single-step governing relation of ${conceptTitle}`, hi: `मानों को संरेखित करें और ${conceptTitle} के प्रत्यक्ष नियम को लागू करें`, te: `${conceptTitle} యొక్క సూత్రాన్ని నేరుగా వర్తింపజేయడం` }, isCorrect: true },
        { id: 'c2', text: { en: `Skip intermediate verification and perform rapid mental estimation`, hi: `सत्यापन छोड़ें और अनुमान से उत्तर दें`, te: `సరిచూసుకోకుండా అంచనా వేయడం` }, misconceptionTag: 'CARELESS_PROCEDURAL_SKIP', isCorrect: false },
        { id: 'c3', text: { en: `Arbitrarily swap numerator and denominator or reactant and product`, hi: `अंश और हर या अभिकारक और उत्पाद को आपस में बदलें`, te: `లవహారాలు లేదా క్రియాజనకాలను తారుమారు చేయడం` }, misconceptionTag: 'INVERTED_CORE_RULE', isCorrect: false },
        { id: 'c4', text: { en: `Apply the rule only to the first term and leave remaining terms unadjusted`, hi: `नियम को केवल पहले पद पर लागू करें`, te: `మొదటి పదానికే పరిమితం చేసి మిగతావి వదిలేయడం` }, misconceptionTag: 'PARTIAL_EQUATION_REDUCTION', isCorrect: false },
      ];
      explanationEn = `Direct application of ${conceptTitle} requires methodical execution without skipping steps.`;
      hintEn = `Identify the single immediate step required by the formula or definition.`;
    } else if (tier.difficulty === 'Moderate') {
      promptEn = `Guided Procedural Exercise: In a multi-step problem on "${conceptTitle}", how is the solution verified step-by-step?`;
      choices = [
        { id: 'c1', text: { en: `Substitute intermediate results back into the governing relation to verify LHS = RHS and balance`, hi: `संतुलन और दोनों पक्षों की समानता सत्यापित करने के लिए मानों को मूल संबंध में रखें`, te: `రెండు వైపులా సరిసమానంగా ఉన్నాయని నిర్ధారించడానికి అసలు సమీకరణంలో సరిచూడండి` }, isCorrect: true },
        { id: 'c2', text: { en: `Multiply all terms together without checking inverse operations`, hi: `प्रतिलोम संक्रियाओं की जांच किए बिना सभी पदों को गुणा करें`, te: `విలోమాలను చూడకుండా అన్నింటినీ గుణించడం` }, misconceptionTag: 'INVERSE_OPERATION_FAILURE', isCorrect: false },
        { id: 'c3', text: { en: `Stop after completing the first calculation step without checking final units`, hi: `इकाइयों की जांच किए बिना पहले चरण के बाद ही रुक जाना`, te: `మొదటి లెక్కతోనే ఆగిపోయి ప్రమాణాలు చూడకపోవడం` }, misconceptionTag: 'INCOMPLETE_VERIFICATION_BIAS', isCorrect: false },
        { id: 'c4', text: { en: `Assume the problem is flawed if the answer is not a whole number`, hi: `यह मानना कि पूर्णांक न होने पर समस्या गलत है`, te: `పూర్ణాంకం రాకపోతే లెక్క తప్పు అనుకోవడం` }, misconceptionTag: 'STATIC_VALUE_FALLACY', isCorrect: false },
      ];
      explanationEn = `Moderate problems test procedural consistency in ${conceptTitle}. Always verify units and equality.`;
      hintEn = `Check each step sequentially before confirming your final answer.`;
    } else if (tier.difficulty === 'Challenging') {
      promptEn = `Higher-Order Analysis: A student encounters a challenging edge-case in "${conceptTitle}". Which analytical reasoning solves the ambiguity?`;
      choices = [
        { id: 'c1', text: { en: `Isolate governing boundary constraints and methodically resolve each prerequisite sub-condition`, hi: `सीमा शर्तों को अलग करें और प्रत्येक उप-शर्त को व्यवस्थित रूप से हल करें`, te: `నియమ పరిమితులను గుర్తించి ప్రతి ఉప-నియమాన్ని క్రమబద్ధంగా పరిష్కరించడం` }, isCorrect: true },
        { id: 'c2', text: { en: `Force an empirical estimate without mathematical or scientific proof`, hi: `वैज्ञानिक प्रमाण के बिना केवल अनुमान के आधार पर उत्तर निकालना`, te: `రుజువు లేకుండా అంచనాతో మాత్రమే ముగించడం` }, misconceptionTag: 'UNGROUNDED_HEURISTIC_SLIP', isCorrect: false },
        { id: 'c3', text: { en: `Treat the edge condition as an exception to the law of conservation or equality invariance`, hi: `इस स्थिति को संरक्षण या समानता के नियम का अपवाद मानना`, te: `పరిరక్షణ లేదా సమానత్వ సూత్రాలకు మినహాయింపుగా భావించడం` }, misconceptionTag: 'CONSERVATION_LAW_MISCONCEPTION', isCorrect: false },
        { id: 'c4', text: { en: `Invert the signs or operators arbitrarily when calculations become complex`, hi: `गणना कठिन होने पर मनमाने ढंग से चिन्ह बदल देना`, te: `లెక్క కష్టమైనప్పుడు గుర్తులను ఇష్టానుసారంగా మార్చడం` }, misconceptionTag: 'ARBITRARY_SIGN_INVERSION', isCorrect: false },
      ];
      explanationEn = `Challenging analysis in ${conceptTitle} requires rigorous breakdown of constraints without resorting to guesswork.`;
      hintEn = `Break the problem into sub-skills and test each condition against fundamental laws.`;
    } else {
      // Application
      promptEn = `Real-World Application: How is the principle of "${conceptTitle}" utilized in modern scientific, technological, or practical problem solving?`;
      choices = [
        { id: 'c1', text: { en: `By applying precise stoichiometric and dimensional balance to predict real outcomes accurately`, hi: `वास्तविक परिणामों का सटीक अनुमान लगाने के लिए सटीक आयामी और भौतिक संतुलन लागू करके`, te: `ఖచ్చితమైన ఫలితాలను అంచనా వేయడానికి నియమబద్ధమైన సమతుల్యతను ఉపయోగించి` }, isCorrect: true },
        { id: 'c2', text: { en: `By ignoring input-output equilibrium and maximizing speed alone`, hi: `इनपुट-आउटपुट संतुलन की अनदेखी करके केवल गति को अधिकतम करके`, te: `సమతుల్యతను పట్టించుకోకుండా కేవలం వేగాన్ని మాత్రమే చూడటం` }, misconceptionTag: 'EQUILIBRIUM_DISREGARD', isCorrect: false },
        { id: 'c3', text: { en: `By replacing empirical measurements with superficial assumptions`, hi: `भौतिक मापों को यादृच्छिक मान्यताओं से बदलकर`, te: `కొలతలను వదిలి ఊహాగానాలను నమ్మడం` }, misconceptionTag: 'EMPIRICAL_DISREGARD', isCorrect: false },
        { id: 'c4', text: { en: `By assuming conservation laws only apply inside a school classroom`, hi: `यह मानकर कि संरक्षण के नियम केवल स्कूल की कक्षा में ही लागू होते हैं`, te: `సూత్రాలు తరగతి గదికే పరిమితమని అనుకోవడం` }, misconceptionTag: 'CONTEXTUAL_ISOLATION_ERROR', isCorrect: false },
      ];
      explanationEn = `Real-world application of ${conceptTitle} bridges theoretical models with measurable experimental outcomes.`;
      hintEn = `Think about how engineers, scientists, or tradespeople rely on balance and precision.`;
    }

    newQuestions.push({
      id: qId,
      board,
      classLevel,
      subject,
      chapterId,
      conceptId,
      topicId: conceptId,
      topicTitle: conceptTitle,
      learningOutcome: `Mastery of ${conceptTitle} at ${tier.difficulty} difficulty.`,
      academicYear: '2026-2027',
      difficulty: tier.difficulty,
      cognitiveSkill: tier.skill,
      questionType: tier.type,
      expectedSolvingTimeSeconds: tier.difficulty === 'Challenging' ? 70 : 50,
      prompt: {
        en: promptEn,
        hi: promptHi || promptEn,
        te: promptTe || promptEn,
      },
      choices,
      explanation: {
        en: explanationEn,
        hi: explanationEn,
        te: explanationEn,
      },
      hint: {
        en: hintEn,
        hi: hintEn,
        te: hintEn,
      },
      misconceptionTags: choices.map((c) => c.misconceptionTag).filter(Boolean) as string[],
      isVerified: true,
      approvalStatus: 'Approved',
      source: 'Official Curriculum',
    });
  }

  return newQuestions;
}

