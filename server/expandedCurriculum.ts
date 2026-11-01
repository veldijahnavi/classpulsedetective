/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumChapter, LessonContent } from './types.js';

export const expandedChapters: CurriculumChapter[] = [
  // ==========================================
  // CBSE CLASS 10
  // ==========================================
  {
    id: 'ch_cbse10_sci_chem_rxn',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 1,
    title: 'Chemical Reactions and Equations',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'A chemical reaction is a process where the reactant substances undergo chemical transformation to form new products with entirely different properties. In this chapter, we master writing balanced chemical equations obeying mass conservation, identify types of reactions (combination, decomposition, displacement, double displacement, redox), and investigate everyday oxidation phenomena like corrosion and rancidity.',
    learningObjectives: [
      'Write word equations and translate them into balanced skeletal chemical equations',
      'Balance chemical equations using the hit-and-trial method with state symbols (s, l, g, aq)',
      'Classify reactions into exothermic, endothermic, combination, and decomposition types',
      'Distinguish oxidation (loss of electrons / addition of oxygen) from reduction (gain of electrons / addition of hydrogen)',
      'Explain practical prevention techniques for metal corrosion and food rancidity',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_chem_c1',
        chapterId: 'ch_cbse10_sci_chem_rxn',
        title: 'Balancing Chemical Equations & Law of Conservation of Mass',
        description: 'Ensuring equal counts of each atomic species on both reactant and product sides.',
        order: 1,
        learningOutcome: 'Balance multi-element reactions with correct state symbols.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_chem_c2',
        chapterId: 'ch_cbse10_sci_chem_rxn',
        title: 'Types of Reactions & Redox Phenomena',
        description: 'Combination, decomposition, displacement, and simultaneous oxidation-reduction processes.',
        order: 2,
        learningOutcome: 'Identify oxidizing and reducing agents in chemical redox equations.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_sci_life_proc',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Science',
    chapterNumber: 5,
    title: 'Life Processes (Nutrition, Respiration, Circulation & Excretion)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'All living organisms maintain life through essential biological processes: nutrition (autotrophic & heterotrophic), cellular respiration (aerobic vs anaerobic), internal transport (human circulatory system, xylem/phloem in plants), and metabolic excretion via nephrons.',
    learningObjectives: [
      'Understand the biochemical mechanism of photosynthesis and stomatal transpiration',
      'Compare aerobic and anaerobic respiration in yeast, muscle cells, and mitochondria',
      'Trace double circulation through the human heart, arteries, veins, and capillaries',
      'Explain the filtration and selective reabsorption mechanism inside nephrons of the kidney',
    ],
    concepts: [
      {
        id: 'con_cbse10_sci_bio_c1',
        chapterId: 'ch_cbse10_sci_life_proc',
        title: 'Photosynthesis & Autotrophic Nutrition',
        description: 'Light absorption by chlorophyll, splitting of water molecules, and reduction of CO2 into glucose.',
        order: 1,
        learningOutcome: 'Explain the inputs, steps, and byproduct release during photosynthesis.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_sci_bio_c2',
        chapterId: 'ch_cbse10_sci_life_proc',
        title: 'Double Circulation in Humans & Heart Structure',
        description: 'Separate systemic and pulmonary pathways preventing oxygenated and deoxygenated blood mixing.',
        order: 2,
        learningOutcome: 'Trace blood flow through auricles, ventricles, pulmonary artery, and aorta.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_eng_grammar',
    board: 'CBSE',
    classLevel: '10',
    subject: 'English',
    chapterNumber: 10,
    title: 'Grammar: Reported Speech & Subject-Verb Concord',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Class X CBSE English curriculum requires rigorous precision in reporting dialogues (direct to indirect speech) across assertions, imperatives, interrogatives, and exclamations, alongside rule-governed subject-verb agreement.',
    learningObjectives: [
      'Convert direct statements, questions, and commands into reported speech with accurate tense backshifting',
      'Apply changes in pronouns, time expressions, and reporting verbs (said -> told, asked, commanded)',
      'Ensure subject-verb concord in collective nouns, plural forms with singular meanings, and indefinite pronouns',
    ],
    concepts: [
      {
        id: 'con_cbse10_eng_c1',
        chapterId: 'ch_cbse10_eng_grammar',
        title: 'Tense Backshifting & Pronoun Transformation in Reported Speech',
        description: 'Systematic transformation of present tenses to past tenses when the reporting verb is in the past.',
        order: 1,
        learningOutcome: 'Convert dialogue excerpts into error-free reported paragraphs.',
        prerequisites: [],
      },
      {
        id: 'con_cbse10_eng_c2',
        chapterId: 'ch_cbse10_eng_grammar',
        title: 'Subject-Verb Concord Rules & Exceptions',
        description: 'Rules governing compound subjects, neither/nor, either/or, and collective nouns.',
        order: 2,
        learningOutcome: 'Select singular or plural verb forms based on formal agreement rules.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_cbse_2027',
    isComplete: true,
  },
  {
    id: 'ch_cbse10_soc_nationalism',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Social Science',
    chapterNumber: 2,
    title: 'Nationalism in India (History)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Explore the growth of modern nationalism in India: the First World War context, Satyagraha and the Rowlatt Act, the Non-Cooperation Movement across cities, countryside, and plantations, the Simon Commission, the Civil Disobedience Movement, the Salt March, and the sense of collective belonging.',
    learningObjectives: [
      'Trace how the First World War created new economic and political conditions in India',
      'Analyze the philosophy of Satyagraha championed by Mahatma Gandhi',
      'Examine the Rowlatt Act, the Jallianwala Bagh massacre, and the Non-Cooperation movement',
      'Compare Civil Disobedience with Non-Cooperation and explain the historic Salt March',
    ],
    concepts: [
      {
        id: 'con_cbse10_soc_c1',
        chapterId: 'ch_cbse10_soc_nationalism',
        title: 'Non-Cooperation Movement & Khilafat Movement',
        description: 'Boycott of foreign cloth, courts, and government schools; the alliance between Congress and Khilafat leaders.',
        order: 1,
        learningOutcome: 'Explain reasons for launching and later calling off the Non-Cooperation Movement.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },

  // ==========================================
  // TELANGANA SSC CLASS 10
  // ==========================================
  {
    id: 'ch_ts10_ps_curved_light',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'Physical Science',
    chapterNumber: 3,
    title: 'Refraction of Light at Curved Surfaces',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'SCERT Telangana Class X Physical Science: Refraction through spherical lenses (convex and concave), center of curvature, focal length, ray diagrams, lens formula (1/f = 1/v - 1/u), magnification, and power of a lens.',
    learningObjectives: [
      'Construct standard ray diagrams for convex and concave lenses with different object positions',
      'Apply the lens formula and sign convention to calculate image distance, height, and magnification',
      'Determine the power of a lens in dioptres (P = 1/f in meters)',
    ],
    concepts: [
      {
        id: 'con_ts10_ps_lens_c1',
        chapterId: 'ch_ts10_ps_curved_light',
        title: 'Lens Formula & Cartesian Sign Convention',
        description: 'Applying 1/f = 1/v - 1/u with strict sign discipline for real vs virtual images.',
        order: 1,
        learningOutcome: 'Calculate image position and magnification for converging and diverging lenses.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ts_scert',
    isComplete: true,
  },
  {
    id: 'ch_ts10_eng_attitude',
    board: 'TELANGANA_SSC',
    classLevel: '10',
    subject: 'English',
    chapterNumber: 1,
    title: 'Personality Development (Attitude is Altitude)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'SCERT Telangana Class X English Reader Unit 1: The inspiring life story of Nick Vujicic, overcoming phocomelia with resilience, determination, and positive mindset. Reading comprehension, prepositional phrases, and speech writing.',
    learningObjectives: [
      'Analyze the central theme of overcoming adversity through positive psychological attitude',
      'Extract inferences and contextual meanings from biographical narrative text',
      'Master prepositional phrases (e.g. in spite of, by means of, in addition to)',
    ],
    concepts: [
      {
        id: 'con_ts10_eng_c1',
        chapterId: 'ch_ts10_eng_attitude',
        title: 'Contextual Reading Comprehension & Prepositional Phrases',
        description: 'Analyzing narrative voice, character motivations, and compound prepositions.',
        order: 1,
        learningOutcome: 'Answer analytical comprehension questions and apply prepositional idioms accurately.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ts_scert',
    isComplete: true,
  },

  // ==========================================
  // CISCE / ICSE CLASS 10
  // ==========================================
  {
    id: 'ch_cisce10_chem_periodic',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Chemistry',
    chapterNumber: 1,
    title: 'Periodic Table, Periodic Properties and Variations',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'ICSE Class 10 Chemistry Chapter 1: Modern Periodic Law, groups and periods, and periodic trends in atomic size, ionization potential, electron affinity, electronegativity, metallic, and non-metallic characters.',
    learningObjectives: [
      'Explain periodic trends across a period (left to right) and down a group (top to bottom)',
      'Relate nuclear charge and number of shells to changes in atomic radius and electronegativity',
      'Predict chemical reactivity and oxide character based on element position in the periodic table',
    ],
    concepts: [
      {
        id: 'con_cisce10_chem_c1',
        chapterId: 'ch_cisce10_chem_periodic',
        title: 'Periodic Trends: Ionization Energy, Electronegativity & Atomic Radius',
        description: 'How nuclear pull and screening effect determine periodic property variations.',
        order: 1,
        learningOutcome: 'Arrange elements in increasing or decreasing order of non-metallic character and ionization potential.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_cisce_icse',
    isComplete: true,
  },
  {
    id: 'ch_cisce10_bio_cell_cycle',
    board: 'CISCE',
    classLevel: '10',
    subject: 'Biology',
    chapterNumber: 1,
    title: 'Cell Cycle, Cell Division & Chromosome Structure',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'ICSE Class 10 Biology Chapter 1: Chromatin network, chromosome structure (centromere, chromatids, genes), cell cycle phases (Interphase: G1, S, G2), Mitosis stages (Prophase, Metaphase, Anaphase, Telophase), and significance of Meiosis.',
    learningObjectives: [
      'Describe the molecular organization of DNA wrapped around histone octamers to form nucleosomes',
      'Identify stages of mitosis from microscopic diagrams based on chromosome alignment and movement',
      'Explain the genetic significance of crossing over during Meiosis in gamete formation',
    ],
    concepts: [
      {
        id: 'con_cisce10_bio_c1',
        chapterId: 'ch_cisce10_bio_cell_cycle',
        title: 'Stages of Mitosis & Diagrammatic Identification',
        description: 'Prophase, Metaphase (equatorial plate alignment), Anaphase (centromere division), and Telophase.',
        order: 1,
        learningOutcome: 'Identify and label mitotic phases and differentiate animal vs plant cytokinesis.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_cisce_icse',
    isComplete: true,
  },
  {
    id: 'ch_cisce10_eng_syntax',
    board: 'CISCE',
    classLevel: '10',
    subject: 'English',
    chapterNumber: 1,
    title: 'Grammar: Transformation of Sentences & Synthesis',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'ICSE English Language Paper 1 Question 5: Advanced sentence transformation without changing meaning. Rephrasing sentences using "No sooner... than", "Hardly... when", "Unless", "Too... to", active/passive, and combining simple sentences into complex or compound sentences.',
    learningObjectives: [
      'Transform affirmative sentences into negative, interrogative, and exclamatory without altering meaning',
      'Master correlative conjunctions: No sooner had... than, Hardly had... when, Scarcely... when',
      'Synthesize pairs of sentences using participles, infinitives, noun clauses, and absolute phrases',
    ],
    concepts: [
      {
        id: 'con_cisce10_eng_c1',
        chapterId: 'ch_cisce10_eng_syntax',
        title: 'Inversion Structures (No sooner / Hardly) & Sentence Synthesis',
        description: 'Using auxiliary inversion with negative adverbials to combine and transform sentences.',
        order: 1,
        learningOutcome: 'Transform sentences accurately following strict ICSE Paper 1 grammar conventions.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_cisce_icse',
    isComplete: true,
  },

  // ==========================================
  // CBSE CLASS 8 (ENGLISH & SOCIAL SCIENCE ADDITIONS)
  // ==========================================
  {
    id: 'ch_cbse8_eng_tenses',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterNumber: 8,
    title: 'Grammar: Tenses, Aspects & Modals',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Class VIII NCERT English: Present, past, and future time aspects (simple, continuous, perfect, perfect continuous) and modal auxiliaries expressing ability, permission, obligation, possibility, and deduction.',
    learningObjectives: [
      'Differentiate past simple and present perfect in time-bound contexts',
      'Select appropriate modal verbs: can, could, may, might, must, should, ought to',
      'Identify and correct errors of verb forms in continuous writing',
    ],
    concepts: [
      {
        id: 'con_cbse8_eng_c1',
        chapterId: 'ch_cbse8_eng_tenses',
        title: 'Present Perfect vs Simple Past & Modal Logic',
        description: 'Using "since/for" with present perfect and specific past time markers with simple past.',
        order: 1,
        learningOutcome: 'Fill blanks with correct verb forms and modal auxiliaries.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse8_eng_adverbs',
    board: 'CBSE',
    classLevel: '8',
    subject: 'English',
    chapterNumber: 7,
    title: 'Grammar: Adverbs – Types, Usage & Sentence Placement',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'An adverb is a word that modifies, clarifies, or qualifies a verb, an adjective, or another adverb. Adverbs express manner (how), time (when), place (where), frequency (how often), and degree (to what extent). In this comprehensive module, students master adverbial identification, structural formation, syntactic placement, and avoiding adjective-adverb confusion in formal communication.',
    learningObjectives: [
      'Define adverbs and understand why they are used to add precision, nuance, and vivid detail',
      'Distinguish between adjectives (modifying nouns/pronouns) and adverbs (modifying verbs, adjectives, or other adverbs)',
      'Classify adverbs into five primary categories: Manner, Time, Place, Frequency, and Degree',
      'Apply correct syntactic word order and placement rules (especially adverbs of frequency with auxiliary vs main verbs)',
      'Form regular and irregular adverbs correctly and avoid common traps such as flat adverbs and false -ly adjectives',
    ],
    concepts: [
      {
        id: 'con_cbse8_eng_adv_c1',
        chapterId: 'ch_cbse8_eng_adverbs',
        title: 'Adverbs: Definition, Modification & Adjective vs Adverb Distinction',
        description: 'Understanding how adverbs modify verbs, adjectives, and other adverbs, and differentiating adjectives from adverbs.',
        order: 1,
        learningOutcome: 'Identify adverbs in sentences and differentiate them from qualifying adjectives.',
        prerequisites: [],
      },
      {
        id: 'con_cbse8_eng_adv_c2',
        chapterId: 'ch_cbse8_eng_adverbs',
        title: 'Types of Adverbs (Manner, Time, Place, Frequency, Degree) & Sentence Placement',
        description: 'Categorizing adverbs into 5 core types and correctly positioning them before main verbs, after "to be", or at sentence margins.',
        order: 2,
        learningOutcome: 'Classify adverbs into 5 types and position frequency/manner adverbs accurately in sentences.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse8_soc_resources',
    board: 'CBSE',
    classLevel: '8',
    subject: 'Social Science',
    chapterNumber: 9,
    title: 'Resources: Types & Sustainable Development (Geography)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'NCERT Class VIII Geography Chapter 1: Definition of a resource, utility and value, classification into natural (renewable vs non-renewable), human-made, and human resources, resource conservation, and the principles of sustainable development.',
    learningObjectives: [
      'Define resource and understand the role of human technology in transforming natural gifts into resources',
      'Distinguish renewable (solar, wind) and non-renewable (fossil fuels, minerals) resources',
      'Explain sustainable development: balancing the need to use resources and conserving them for the future',
    ],
    concepts: [
      {
        id: 'con_cbse8_soc_c1',
        chapterId: 'ch_cbse8_soc_resources',
        title: 'Renewable vs Non-Renewable Resources & Sustainability Principles',
        description: 'Conservation ethics and the 3Rs (Reduce, Reuse, Recycle) in resource management.',
        order: 1,
        learningOutcome: 'Categorize resources and suggest practical conservation practices.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },

  // ==========================================
  // CBSE CLASS 6 (SCIENCE & ENGLISH ADDITIONS)
  // ==========================================
  {
    id: 'ch_cbse6_sci_food',
    board: 'CBSE',
    classLevel: '6',
    subject: 'Science',
    chapterNumber: 1,
    title: 'Components of Food (Nutrients & Balanced Diet)',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'NCERT Class VI Science: Carbohydrates, proteins, fats, vitamins, minerals, dietary fibre (roughage), and water. Laboratory tests for starch, protein, and fats, balanced diet, and deficiency diseases.',
    learningObjectives: [
      'Identify major nutrients in different foods and their biological roles',
      'Describe chemical tests using iodine (for starch), copper sulphate & caustic soda (for proteins)',
      'Explain deficiency diseases: scurvy, rickets, beriberi, anemia, and goitre',
    ],
    concepts: [
      {
        id: 'con_cbse6_sci_c1',
        chapterId: 'ch_cbse6_sci_food',
        title: 'Nutrient Tests & Deficiency Diseases',
        description: 'Conducting chemical tests and recognizing deficiency disorders from symptoms.',
        order: 1,
        learningOutcome: 'Connect specific vitamin/mineral deficiencies with their characteristic diseases.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
  {
    id: 'ch_cbse6_eng_grammar',
    board: 'CBSE',
    classLevel: '6',
    subject: 'English',
    chapterNumber: 1,
    title: 'Nouns, Pronouns and Sentence Construction',
    academicYear: '2026-2027',
    medium: 'English',
    introduction: 'Foundational English grammar for Class VI: proper, common, collective, and abstract nouns; personal, possessive, and demonstrative pronouns; and subject-predicate structure.',
    learningObjectives: [
      'Classify nouns into abstract, collective, proper, and common categories',
      'Use pronouns correctly to avoid repetitive noun usage',
      'Construct complete, punctuated sentences with matching subjects and predicates',
    ],
    concepts: [
      {
        id: 'con_cbse6_eng_c1',
        chapterId: 'ch_cbse6_eng_grammar',
        title: 'Noun Classification & Pronoun Replacement',
        description: 'Identifying noun classes and applying correct pronoun agreement in sentences.',
        order: 1,
        learningOutcome: 'Identify abstract nouns and replace subject phrases with accurate pronouns.',
        prerequisites: [],
      },
    ],
    officialSourceId: 'src_ncert_tb',
    isComplete: true,
  },
];

export const expandedLessons: LessonContent[] = [
  // Lesson: CBSE Class 10 Science - Chemical Reactions & Balancing
  {
    id: 'les_cbse10_sci_chem_c1',
    chapterId: 'ch_cbse10_sci_chem_rxn',
    conceptId: 'con_cbse10_sci_chem_c1',
    title: 'Balancing Chemical Equations & Law of Conservation of Mass',
    explanation: {
      en: 'According to the Law of Conservation of Mass (discovered by Antoine Lavoisier), mass can neither be created nor destroyed in a chemical reaction. Therefore, the total number of atoms of each element on the reactant side (left of ->) MUST strictly equal the total number of atoms of that same element on the product side (right of ->). Never alter the chemical formula subscripts (e.g., you cannot change H2O to H2O2 to balance oxygen; you must place stoichiometric coefficients in front: 2H2 + O2 -> 2H2O)!',
      hi: 'द्रव्यमान संरक्षण के नियम के अनुसार, किसी भी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है और न ही विनाश। इसलिए, अभिकारकों (reactants) के प्रत्येक तत्व के परमाणुओं की संख्या उत्पादों (products) के परमाणुओं की संख्या के बिल्कुल बराबर होनी चाहिए। कभी भी रासायनिक सूत्र के पादांक (subscript) को न बदलें; केवल आगे गुणांक (coefficient) लगाएं!',
      te: 'ద్రవ్య నిత్యత్వ నియమం ప్రకారం, రసాయన చర్యలో ద్రవ్యం సృష్టించబడదు లేదా నాశనం చేయబడదు. కనుక క్రియాజనకాలలోని పరమాణువుల సంఖ్య క్రియాజన్యాలలోని పరమాణువుల సంఖ్యకు ఖచ్చితంగా సమానంగా ఉండాలి. సూత్రాలలోని సంఖ్యలను మార్చకూడదు; కేవలం ముందు గుణకాలను మాత్రమే చేర్చాలి!',
    },
    definitions: [
      {
        term: 'Chemical Reaction',
        definition: {
          en: 'A process in which one or more substances (reactants) are converted into one or more different substances (products) with new chemical properties.',
          hi: 'वह प्रक्रिया जिसमें एक या अधिक पदार्थ नए रासायनिक गुणों वाले नए पदार्थों में बदल जाते हैं।',
          te: 'ఒకటి లేదా అంతకంటే ఎక్కువ పదార్థాలు కొత్త ధర్మాలు గల కొత్త పదార్థాలుగా మారే ప్రక్రియ.',
        },
      },
      {
        term: 'Balanced Equation',
        definition: {
          en: 'An equation having equal numbers of atoms of each element on both sides of the reaction arrow.',
          hi: 'वह समीकरण जिसके तीर के दोनों ओर प्रत्येक तत्व के परमाणुओं की संख्या बराबर होती है।',
          te: 'బాణం గుర్తుకు ఇరువైపులా ప్రతి మూలకపు పరమాణువుల సంఖ్య సమానంగా ఉండే సమీకరణం.',
        },
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'Balance the skeletal equation: Fe + H2O -> Fe3O4 + H2',
          hi: 'कंकाली समीकरण को संतुलित करें: Fe + H2O -> Fe3O4 + H2',
          te: 'సమీకరణాన్ని తుల్యం చేయండి: Fe + H2O -> Fe3O4 + H2',
        },
        stepByStep: [
          {
            en: 'Step 1: Count oxygen atoms. On RHS, Fe3O4 has 4 oxygen atoms. Place coefficient 4 in front of H2O on LHS: Fe + 4H2O -> Fe3O4 + H2.',
            hi: 'चरण 1: ऑक्सीजन परमाणुओं को संतुलित करें। दाईं ओर 4 ऑक्सीजन हैं। H2O के आगे 4 लगाएं: Fe + 4H2O -> Fe3O4 + H2।',
            te: 'దశ 1: ఆక్సిజన్ పరమాణువులను తుల్యం చేయండి: Fe + 4H2O -> Fe3O4 + H2.',
          },
          {
            en: 'Step 2: Count hydrogen atoms. On LHS, 4H2O has 4 × 2 = 8 hydrogen atoms. Place coefficient 4 in front of H2 on RHS: Fe + 4H2O -> Fe3O4 + 4H2.',
            hi: 'चरण 2: हाइड्रोजन को संतुलित करें। बाईं ओर 8 हाइड्रोजन हैं। H2 के आगे 4 लगाएं: Fe + 4H2O -> Fe3O4 + 4H2।',
            te: 'దశ 2: హైడ్రోజన్ పరమాణువులను తుల్యం చేయండి: Fe + 4H2O -> Fe3O4 + 4H2.',
          },
          {
            en: 'Step 3: Count iron (Fe) atoms. On RHS, Fe3O4 has 3 Fe atoms. Place coefficient 3 in front of Fe on LHS: 3Fe + 4H2O -> Fe3O4 + 4H2.',
            hi: 'चरण 3: लोहे (Fe) को संतुलित करें। Fe के आगे 3 लगाएं: 3Fe + 4H2O -> Fe3O4 + 4H2।',
            te: 'దశ 3: ఐరన్ (Fe) ను తుల్యం చేయండి: 3Fe + 4H2O -> Fe3O4 + 4H2.',
          },
        ],
        finalAnswer: '3Fe(s) + 4H2O(g) -> Fe3O4(s) + 4H2(g)',
        keyInsight: {
          en: 'Always balance the element with the maximum number of atoms first (often oxygen or hydrogen), and leave isolated single elements (like Fe) for the end.',
          hi: 'हमेशा सबसे अधिक परमाणुओं वाले तत्व से संतुलन शुरू करें और एकल तत्वों को अंत में संतुलित करें।',
          te: 'ఎక్కువ పరమాణువులు ఉన్న మూలకంతో ప్రారంభించి, ఒంటరి మూలకాలను చివరగా తుల్యం చేయాలి.',
        },
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Changing subscripts inside chemical formulas (e.g. writing Fe + H2O4 -> Fe3O4).',
          hi: 'रासायनिक सूत्रों के भीतर पादांक (subscript) बदलना।',
          te: 'రసాయన ఫార్ములా లోపలి సంఖ్యలను మార్చడం.',
        },
        correction: {
          en: 'Subscripts define the identity of the chemical compound; only modify whole stoichiometric coefficients placed directly before formulas.',
          hi: 'सूत्र पदार्थ की पहचान हैं; केवल सूत्र के आगे पूर्ण गुणांक लिखें।',
          te: 'ఫార్ములా ముందు గుణకాలను మాత్రమే చేర్చాలి.',
        },
        whyItHappens: {
          en: 'Wanting a quick shortcut to match numbers without respecting molecular bonding rules.',
          hi: 'आणविक बंधों के नियमों की उपेक्षा करते हुए जल्दबाजी में संख्याएं मिलाना।',
          te: 'రసాయన బంధాల నియమాలను పట్టించుకోకుండా సంఖ్యలను సమానం చేయాలనుకోవడం వల్ల.',
        },
      },
    ],
    summaryPoints: [
      {
        en: '1. Law of Conservation of Mass mandates equal atomic counts on both reaction sides.',
        hi: '1. द्रव्यमान संरक्षण नियम दोनों पक्षों में बराबर परमाणु संख्या अनिवार्य करता है।',
        te: '1. చర్యకు ఇరువైపులా పరమాణువుల సంఖ్య సమానంగా ఉండాలి.',
      },
      {
        en: '2. Include physical state symbols: (s) solid, (l) liquid, (g) gas, and (aq) aqueous solution.',
        hi: '2. भौतिक अवस्था संकेत अवश्य लिखें: (s) ठोस, (l) द्रव, (g) गैस, (aq) जलीय।',
        te: '2. భౌతిక స్థితుల గుర్తులను రాయడం మర్చిపోకూడదు: (s), (l), (g), (aq).',
      },
    ],
  },

  // Lesson: CBSE Class 10 English - Reported Speech
  {
    id: 'les_cbse10_eng_c1',
    chapterId: 'ch_cbse10_eng_grammar',
    conceptId: 'con_cbse10_eng_c1',
    title: 'Reported Speech: Tense Backshifting & Pronoun Transformation',
    explanation: {
      en: 'Reported speech conveys what someone said without quoting their exact words. When the reporting verb is in the past tense (e.g. "He said..."), the verbs inside the reported statement shift backward one tense: Simple Present -> Simple Past, Present Continuous -> Past Continuous, Present Perfect -> Past Perfect, and Simple Past -> Past Perfect! Words showing nearness in time/place also change: "this" -> "that", "now" -> "then", "today" -> "that day", and "tomorrow" -> "the next day".',
      hi: 'परोक्ष कथन (Reported Speech) किसी के कहे गए शब्दों को बिना उद्धरण चिह्नों के प्रस्तुत करता है। जब रिपोर्टिंग वर्ब भूतकाल में हो (जैसे "He said"), तो काल पीछे खिसक जाता है: सामान्य वर्तमान -> सामान्य भूतकाल, और सामान्य भूतकाल -> पूर्ण भूतकाल! स्थान और समय के शब्द भी बदलते हैं: today -> that day, tomorrow -> the next day।',
      te: 'పరోక్ష కథనం (Reported Speech) లో ఇతరులు చెప్పిన మాటలను ఉన్నదున్నట్లు కాకుండా మన మాటలలో చెబుతాము. రిపోర్టింగ్ వెర్బ్ భూతకాలంలో ఉంటే టెన్స్ మారుతుంది: వర్తమానం భూతకాలంగా, భూతకాలం పాస్ట్ పర్ఫెక్ట్‌గా మారుతుంది. today కాస్తా that day గా మారుతుంది.',
    },
    definitions: [
      {
        term: 'Direct vs Indirect Speech',
        definition: {
          en: 'Direct speech gives actual spoken words inside quotation marks; Indirect speech reports the substantive meaning without quotation marks.',
          hi: 'प्रत्यक्ष कथन में वक्ता के मूल शब्द उद्धरण चिह्नों में होते हैं; परोक्ष कथन में बिना उद्धरण के अर्थ बताया जाता है।',
          te: 'ప్రత్యక్ష కథనంలో కొటేషన్లు ఉంటాయి; పరోక్ష కథనంలో కొటేషన్లు లేకుండా అర్థాన్ని వివరిస్తారు.',
        },
      },
    ],
    workedExamples: [
      {
        problem: {
          en: 'Convert to Indirect Speech: Meera said, "I have completed my science project today."',
          hi: 'अप्रत्यक्ष कथन में बदलें: Meera said, "I have completed my science project today."',
          te: 'పరోక్ష కథనంలోకి మార్చండి: Meera said, "I have completed my science project today."',
        },
        stepByStep: [
          {
            en: 'Step 1: Check reporting verb: "said" is in the past tense, so tense backshifting is required.',
            hi: 'चरण 1: रिपोर्टिंग वर्ब "said" भूतकाल में है, इसलिए काल बदलेगा।',
            te: 'దశ 1: రిపోర్టింగ్ వెర్బ్ "said" భూతకాలంలో ఉంది కాబట్టి టెన్స్ మారాలి.',
          },
          {
            en: 'Step 2: Replace quotation marks with conjunction "that": Meera said that...',
            hi: 'चरण 2: उद्धरण चिह्नों की जगह "that" लगाएं।',
            te: 'దశ 2: కొటేషన్లు తీసివేసి "that" చేర్చండి.',
          },
          {
            en: 'Step 3: Change pronoun "I" to "she", and change Present Perfect ("have completed") to Past Perfect ("had completed"): ...she had completed her science project...',
            hi: 'चरण 3: सर्वनाम "I" को "she" और "have completed" को "had completed" में बदलें।',
            te: 'దశ 3: "I" ని "she" గా, "have completed" ని "had completed" గా మార్చండి.',
          },
          {
            en: 'Step 4: Change time indicator "today" to "that day".',
            hi: 'चरण 4: "today" को "that day" में बदलें।',
            te: 'దశ 4: "today" ని "that day" గా మార్చండి.',
          },
        ],
        finalAnswer: 'Meera said that she had completed her science project that day.',
        keyInsight: {
          en: 'Always inspect three critical elements: (1) Pronouns, (2) Tense backshift, and (3) Time/Place adverbials.',
          hi: 'हमेशा तीन चीजें देखें: सर्वनाम, काल में परिवर्तन, और समय सूचक शब्द।',
          te: 'ఎల్లప్పుడూ సర్వనామాలు, కాలం, మరియు సమయ సూచికలను గమనించాలి.',
        },
      },
    ],
    commonMistakes: [
      {
        mistake: {
          en: 'Leaving the present tense unchanged: Meera said that she has completed...',
          hi: 'वर्तमान काल को वैसे ही छोड़ देना: Meera said that she has completed...',
          te: 'టెన్స్ మార్చకుండా రాయడం: Meera said that she has completed...',
        },
        correction: {
          en: 'When the reporting verb is past ("said"), "have/has" must become "had".',
          hi: 'जब रिपोर्टिंग वर्ब "said" हो, तो "has/have" बदलकर "had" हो जाता है।',
          te: 'రిపోర్టింగ్ వెర్బ్ భూతకాలంలో ఉన్నప్పుడు "has/have" కాస్తా "had" కావాలి.',
        },
        whyItHappens: {
          en: 'Translating mentally without applying formal reported speech sequence of tenses.',
          hi: 'औपचारिक काल अनुक्रम नियमों को याद न रखना।',
          te: 'టెన్స్ నిబంధనలను పాటించకపోవడం వల్ల.',
        },
      },
    ],
    summaryPoints: [
      {
        en: '1. Past reporting verbs trigger tense backshifting (Present -> Past, Past -> Past Perfect).',
        hi: '1. भूतकाल की रिपोर्टिंग वर्ब काल को पीछे ले जाती है।',
        te: '1. పాస్ట్ రిపోర్టింగ్ వెర్బ్ ఉన్నప్పుడు టెన్స్ వెనక్కి మారుతుంది.',
      },
      {
        en: '2. Universal scientific truths do NOT backshift (e.g., The teacher said that the sun rises in the east).',
        hi: '2. सार्वभौमिक सत्य (Universal Truths) का काल नहीं बदलता।',
        te: '2. సార్వత్రిక సత్యాల కాలం మారదు.',
      },
    ],
  },
];
