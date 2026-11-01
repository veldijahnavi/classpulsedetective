/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BoardType = 'CBSE' | 'TELANGANA_SSC' | 'CISCE';
export type ClassLevel = '6' | '7' | '8' | '9' | '10';
export type MediumType = 'English' | 'Telugu' | 'Hindi';
export type LanguageCode = 'en' | 'hi' | 'te';
export type UserRole = 'student' | 'teacher';

export type MasteryStatus = 
  | 'UNTESTED' 
  | 'INSUFFICIENT_EVIDENCE' 
  | 'PRACTICING' 
  | 'POSSIBLE_MISCONCEPTION' 
  | 'PREREQUISITE_GAP' 
  | 'STRONG_UNDERSTANDING';

export type AdaptiveState = 
  | 'FOUNDATIONAL_SUPPORT' 
  | 'DEVELOPING_UNDERSTANDING' 
  | 'INDEPENDENT_PRACTICE' 
  | 'ADVANCED_APPLICATION' 
  | 'MASTERY_CHALLENGE';

export type PaceCategory = 
  | 'Fast & Accurate' 
  | 'Methodical & Thorough' 
  | 'Needs Guidance / Slower' 
  | 'Rushing / Careless';

export type ErrorType = 
  | 'PREREQUISITE_GAP' 
  | 'CONCEPTUAL_MISCONCEPTION' 
  | 'CALCULATION_PROCEDURAL_ERROR' 
  | 'FORMULA_RULE_APPLICATION' 
  | 'READING_CARELESS_ERROR';

export type CognitiveSkill = 
  | 'Foundational' 
  | 'Conceptual' 
  | 'Procedural' 
  | 'Application' 
  | 'ProblemSolving';

export type DifficultyLevel = 
  | 'Foundational' 
  | 'Easy' 
  | 'Moderate' 
  | 'Challenging' 
  | 'Application';

export interface User {
  id: string;
  loginId: string;
  name: string;
  role: UserRole;
  school: string;
  email?: string;
}

export interface StudentProfile {
  userId: string;
  studentId: string;
  board: BoardType;
  academicYear: string;
  classLevel: ClassLevel;
  section: string;
  medium: MediumType;
  registeredSubjects: string[];
  interfaceLanguage: LanguageCode;
  learningLanguage: LanguageCode;
  learningProfileDescription: string;
  initialProfileType: 'untested' | 'prerequisite_gap' | 'misconception' | 'calculation_error' | 'practicing' | 'strong' | 'challenge_ready';
  adaptiveState?: AdaptiveState;
  paceCategory?: PaceCategory;
  averageSolvingTimeSeconds?: number;
  medianSolvingTimeSeconds?: number;
  questionsAnsweredCount?: number;
  consecutiveCorrectCount?: number;
  hintsUsedTotal?: number;
}

export interface TeacherProfile {
  userId: string;
  teacherId: string;
  assignedBoards: BoardType[];
  assignedClasses: ClassLevel[];
  assignedSections: string[];
  assignedSubjects: string[];
  school: string;
}

export interface CurriculumSource {
  id: string;
  board: BoardType;
  sourceTitle: string;
  officialUrl: string;
  publisher: string;
  academicYear: string;
  edition: string;
  verificationStatus: 'Officially verified' | 'Provisionally mapped' | 'Awaiting verification';
  lastChecked: string;
}

export interface SubjectCoverageInfo {
  board: BoardType;
  academicYear: string;
  classLevel: ClassLevel;
  subject: string;
  officialTextbook: string;
  officialSourceUrl: string;
  expectedUnitsCount?: number;
  availableUnitsCount?: number;
  expectedChaptersCount: number;
  importedChaptersCount: number;
  expectedTopicsCount?: number;
  availableTopicsCount?: number;
  topicsCoveredCount?: number;
  expectedSubtopicsCount?: number;
  availableSubtopicsCount?: number;
  detailedLessonsCompletedCount?: number;
  questionsAvailableCount?: number;
  practiceQuestionsAvailableCount?: number;
  diagnosticQuestionsAvailableCount?: number;
  recoveryPathwaysAvailableCount?: number;
  retestQuestionsAvailableCount?: number;
  resourcesAvailableCount: number;
  missingItems?: string[];
  verificationStatus: 'Officially verified' | 'Provisionally mapped' | 'Awaiting verification';
  coveragePercentage: number;
  allOfficialChapterTitles: string[];
}

export interface CurriculumConcept {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  order: number;
  learningOutcome: string;
  prerequisites: Array<{
    conceptId: string;
    prerequisiteConceptId: string;
    prerequisiteTitle: string;
    prerequisiteClass: ClassLevel;
    prerequisiteSubject: string;
    importance: 'Essential' | 'Recommended';
  }>;
}

export interface CurriculumChapter {
  id: string;
  board: BoardType;
  classLevel: ClassLevel;
  subject: string;
  chapterNumber: number;
  title: string;
  academicYear: string;
  medium: MediumType;
  introduction: string;
  learningObjectives: string[];
  concepts: CurriculumConcept[];
  officialSourceId: string;
  isComplete: boolean;
  status?: 'Officially verified' | 'Provisionally mapped' | 'Awaiting verification';
  expectedChapterCount?: number;
}

export interface LessonContent {
  id: string;
  chapterId: string;
  conceptId: string;
  title: string;
  topicIntroduction?: { en: string; hi: string; te: string };
  whyLearn?: { en: string; hi: string; te: string };
  learningObjectives?: string[];
  prerequisiteKnowledge?: Array<{ en: string; hi: string; te: string }>;
  explanation: {
    en: string;
    hi: string;
    te: string;
  };
  definitions: Array<{
    term: string;
    definition: { en: string; hi: string; te: string };
  }>;
  principlesAndRules?: Array<{
    heading: string;
    rule: { en: string; hi: string; te: string };
    formulaOrStructure?: string;
  }>;
  workedExamples: Array<{
    problem: { en: string; hi: string; te: string };
    stepByStep: Array<{ en: string; hi: string; te: string }>;
    finalAnswer: string;
    keyInsight: { en: string; hi: string; te: string };
  }>;
  diagramsAndTables?: Array<{
    title: string;
    description: { en: string; hi: string; te: string };
    asciiDiagramOrTable: string;
  }>;
  realWorldApplications?: Array<{ en: string; hi: string; te: string }>;
  commonMistakes: Array<{
    mistake: { en: string; hi: string; te: string };
    correction: { en: string; hi: string; te: string };
    whyItHappens: { en: string; hi: string; te: string };
  }>;
  importantPoints?: Array<{ en: string; hi: string; te: string }>;
  revisionNotes?: Array<{ en: string; hi: string; te: string }>;
  topicSummary?: { en: string; hi: string; te: string };
  knowledgeCheckQuestions?: Array<{
    question: { en: string; hi: string; te: string };
    answer: { en: string; hi: string; te: string };
    quickTip: { en: string; hi: string; te: string };
  }>;
  practiceExercises?: Array<{
    instruction: { en: string; hi: string; te: string };
    exerciseProblem: { en: string; hi: string; te: string };
    solutionHint: { en: string; hi: string; te: string };
  }>;
  visualizerType?: 'fraction_bar' | 'algebra_balance' | 'cell_structure' | 'ray_optics' | 'number_line';
  visualizerConfig?: Record<string, any>;
  summaryPoints: Array<{ en: string; hi: string; te: string }>;
}

export interface QuestionChoice {
  id: string;
  text: {
    en: string;
    hi: string;
    te: string;
  };
  misconceptionTag?: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  board: BoardType;
  classLevel: ClassLevel;
  subject: string;
  chapterId: string;
  conceptId: string;
  topicId?: string;
  topicTitle?: string;
  learningOutcome?: string;
  academicYear?: string;
  difficulty: DifficultyLevel;
  cognitiveSkill: CognitiveSkill;
  questionType: 'mcq' | 'fill_in_the_blank' | 'numerical' | 'short_answer';
  prompt: {
    en: string;
    hi: string;
    te: string;
  };
  choices?: QuestionChoice[];
  correctAnswerText?: string;
  acceptableTolerance?: number;
  explanation: {
    en: string;
    hi: string;
    te: string;
  };
  hint: {
    en: string;
    hi: string;
    te: string;
  };
  misconceptionTags: string[];
  expectedSolvingTimeSeconds: number;
  isVerified: boolean;
  approvalStatus: 'Draft' | 'Awaiting Review' | 'Approved' | 'Published';
  source: string;
}

export interface QuestionTimingRecord {
  id: string;
  studentId: string;
  sessionId: string;
  questionId: string;
  board: BoardType;
  classLevel: ClassLevel;
  subject: string;
  chapterId: string;
  conceptId: string;
  questionDifficulty: DifficultyLevel;
  startTimeMs: number;
  submitTimeMs: number;
  activeSeconds: number;
  expectedSolvingTimeSeconds: number;
  isCorrect: boolean;
  chosenAnswer: string;
  correctAnswer: string;
  attemptsCount: number;
  hintsUsedCount: number;
  wasAnswerChanged: boolean;
  misconceptionTag?: string;
  timestamp: string;
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  assessmentType: 'practice' | 'chapter_test' | 'assignment';
  board: BoardType;
  classLevel: ClassLevel;
  subject: string;
  chapterId: string;
  conceptId: string;
  questionIds: string[];
  studentAnswers: Record<string, string>;
  isCorrectMap: Record<string, boolean>;
  score: number;
  totalMarks: number;
  timeSpentSeconds: number;
  questionTimings?: Record<string, { activeSeconds: number; hintsUsed: number; wasChanged: boolean }>;
  hintsUsedCount: number;
  submittedAt: string;
  needsDiagnosticFollowup: boolean;
  assignedAdaptiveState?: AdaptiveState;
}

export interface DiagnosticEvidence {
  id: string;
  attemptId: string;
  studentId: string;
  conceptId: string;
  chapterId: string;
  subject: string;
  board: BoardType;
  classLevel: ClassLevel;
  topicId?: string;
  topicTitle?: string;
  learningOutcome?: string;
  primaryObservedDifficulty: string;
  detectedErrorType: ErrorType;
  errorEvidence: string[];
  followUpQuestionsAttempted: Array<{
    questionPrompt: string;
    studentAnswer: string;
    correctAnswer: string;
    testedSubSkill: string;
    isCorrect: boolean;
  }>;
  concludedStatus: MasteryStatus;
  diagnosticExplanation: string;
  recommendedRecoveryType: string;
  recommendedActivityId: string;
  createdAt: string;
  isSingleMistake?: boolean;
  repeatedMistakesCount?: number;
  identifiedConceptToImprove?: string;
  mistakeExplanation?: string;
  learningGapAnalysis?: string;
  missingPrerequisites?: Array<{
    title: string;
    classLevel?: string;
    subject?: string;
    whyNeeded: string;
  }>;
  recommendedActions?: Array<{
    title: string;
    actionType: 'immediate' | 'guided_study' | 'practice' | 'mastery_verification';
    description: string;
  }>;
  detectedMistakeTags?: string[];
}

export interface SmartRecoveryActivity {
  id: string;
  conceptId: string;
  chapterId: string;
  subject: string;
  board: BoardType;
  classLevel: ClassLevel;
  title: string;
  recoveryType: string;
  learningPathway: string[];
  remediationExplanation: {
    en: string;
    hi: string;
    te: string;
  };
  simpleExplanation?: {
    en: string;
    hi: string;
    te: string;
  };
  workedExample?: {
    problem: { en: string; hi: string; te: string };
    stepByStep: Array<{ en: string; hi: string; te: string }>;
    finalAnswer: string;
    keyInsight: { en: string; hi: string; te: string };
  };
  keyHints?: Array<{ en: string; hi: string; te: string }>;
  prerequisiteBridge?: {
    prerequisiteTitle: string;
    prerequisiteClass: ClassLevel;
    bridgeExplanation: { en: string; hi: string; te: string };
  };
  guidedPracticeQuestions: Array<{
    id: string;
    difficulty?: DifficultyLevel;
    prompt: { en: string; hi: string; te: string };
    scaffoldHint: { en: string; hi: string; te: string };
    stepClues: Array<{ en: string; hi: string; te: string }>;
    choices: QuestionChoice[];
    correctExplanation: { en: string; hi: string; te: string };
  }>;
  masteryCheckQuestion?: {
    id: string;
    difficulty?: DifficultyLevel;
    prompt: { en: string; hi: string; te: string };
    scaffoldHint?: { en: string; hi: string; te: string };
    stepClues?: Array<{ en: string; hi: string; te: string }>;
    choices: QuestionChoice[];
    correctExplanation: { en: string; hi: string; te: string };
  };
  completionCriteria: {
    minQuestionsRequired: number;
    minCorrectRequired: number;
    readPrerequisiteRequired: boolean;
  };
}

export interface RetestRecord {
  id: string;
  studentId: string;
  studentName: string;
  board: BoardType;
  classLevel: ClassLevel;
  section: string;
  subject: string;
  chapterId: string;
  conceptId: string;
  originalAssessmentId: string;
  originalScore: number;
  originalTotal: number;
  originalTimeSeconds?: number;
  recoveryActivityId: string;
  retestQuestionIds: string[];
  retestAnswers: Record<string, string>;
  retestCorrectMap: Record<string, boolean>;
  retestScore: number;
  retestTotal: number;
  retestTimeSeconds?: number;
  improvementDelta: number;
  outcome: 'Stronger Understanding' | 'Needs More Practice' | 'Likely Prerequisite Gap' | 'Ready for Challenge';
  beforeAfterSummary: string;
  completedAt: string;
}

export interface InterventionPlan {
  id: string;
  board: BoardType;
  classLevel: ClassLevel;
  section: string;
  subject: string;
  targetConceptId: string;
  targetConceptTitle: string;
  targetStudents: Array<{ id: string; name: string; observedGap: string; averageSolvingTimeSeconds?: number }>;
  suggestedActivity: string;
  instructions: string;
  materialsNeeded: string;
  durationMinutes: number;
  learningObjective: string;
  followUpCheck: string;
  status: 'recommended' | 'accepted' | 'in_progress' | 'completed' | 'dismissed';
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  board: BoardType;
  classLevel: ClassLevel;
  section: string;
  subject: string;
  chapterId: string;
  conceptId: string;
  questionIds: string[];
  assignedStudentIds: string[];
  instructions: string;
  dueDate: string;
  createdAt: string;
  submissionsCount: number;
}

export interface ResourceItem {
  id: string;
  board: BoardType;
  classLevel: ClassLevel;
  subject: string;
  chapterId: string;
  title: string;
  type: 'notes' | 'worksheet' | 'video' | 'diagram' | 'revision_sheet' | 'formula_sheet' | 'exam_prep';
  description: string;
  language: LanguageCode;
  fileUrl?: string;
  videoEmbedUrl?: string;
  durationOrPages?: string;
  downloadable: boolean;
  contentBody?: string;
}

export interface LiveStudentActivityEvent {
  id: string;
  studentId: string;
  studentName: string;
  board: BoardType;
  classLevel: ClassLevel;
  section: string;
  subject: string;
  chapterId: string;
  chapterTitle?: string;
  conceptId?: string;
  conceptTitle?: string;
  activityType:
    | 'question_attempted'
    | 'question_started'
    | 'lesson_started'
    | 'lesson_completed'
    | 'recovery_started'
    | 'recovery_completed'
    | 'retest_attempted'
    | 'retest_completed'
    | 'mastery_status_changed';
  questionId?: string;
  questionPrompt?: string;
  questionDifficulty?: string;
  isCorrect?: boolean;
  timeSpentSeconds?: number;
  hintsUsedCount?: number;
  attemptsCount?: number;
  learningStatus?: MasteryStatus;
  misconceptionTag?: string;
  paceCategory?: PaceCategory;
  score?: number;
  totalMarks?: number;
  improvementDelta?: number;
  timestamp: string;
}
