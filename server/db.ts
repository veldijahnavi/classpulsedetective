/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  StudentProfile,
  TeacherProfile,
  CurriculumSource,
  CurriculumChapter,
  LessonContent,
  Question,
  AssessmentAttempt,
  DiagnosticEvidence,
  SmartRecoveryActivity,
  RecoveryAttempt,
  RetestRecord,
  InstructionalGroup,
  InterventionPlan,
  Assignment,
  AssignmentSubmission,
  ResourceItem,
  MasteryStatus,
  QuestionTimingRecord,
  SubjectCoverageInfo,
} from './types.js';
import { hashPassword } from './auth.js';
import { expandedChapters, expandedLessons } from './expandedCurriculum.js';
import { completeLessonsList } from './completeLessonsData.js';
import { officialSubjectCoverage } from './curriculumData.js';
import { expandedQuestionBank } from './questionData.js';
import { expandedResourceLibrary } from './resourceData.js';
import { authenticRecoveryActivities } from './diagnosticData.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  users: User[];
  studentProfiles: StudentProfile[];
  teacherProfiles: TeacherProfile[];
  curriculumSources: CurriculumSource[];
  chapters: CurriculumChapter[];
  lessons: LessonContent[];
  questions: Question[];
  assessmentAttempts: AssessmentAttempt[];
  diagnosticEvidences: DiagnosticEvidence[];
  recoveryActivities: SmartRecoveryActivity[];
  recoveryAttempts: RecoveryAttempt[];
  retestRecords: RetestRecord[];
  instructionalGroups: InstructionalGroup[];
  interventionPlans: InterventionPlan[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  resources: ResourceItem[];
  questionTimingRecords: QuestionTimingRecord[];
  subjectCoverageMatrix: SubjectCoverageInfo[];
  studentActivityLogs?: any[];
}

let dbCache: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (dbCache) {
    return dbCache;
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      
      // Ensure merged data if fields or arrays are missing
      if (dbCache) {
        if (!dbCache.questionTimingRecords) dbCache.questionTimingRecords = [];
        if (!dbCache.studentActivityLogs) dbCache.studentActivityLogs = [];
        if (!dbCache.subjectCoverageMatrix || dbCache.subjectCoverageMatrix.length === 0) {
          dbCache.subjectCoverageMatrix = officialSubjectCoverage;
        }

        // Upsert expanded chapters
        for (const ech of expandedChapters) {
          const idx = dbCache.chapters.findIndex((c) => c.id === ech.id);
          if (idx >= 0) {
            dbCache.chapters[idx] = ech;
          } else {
            dbCache.chapters.push(ech);
          }
        }

        // Upsert complete 16-point lessons
        for (const cl of completeLessonsList) {
          const idx = dbCache.lessons.findIndex((l) => l.id === cl.id);
          if (idx >= 0) {
            dbCache.lessons[idx] = cl;
          } else {
            dbCache.lessons.push(cl);
          }
        }

        // Upsert expanded lessons
        for (const el of expandedLessons) {
          const idx = dbCache.lessons.findIndex((l) => l.id === el.id);
          if (idx >= 0) {
            dbCache.lessons[idx] = { ...el, ...dbCache.lessons[idx] };
          } else {
            dbCache.lessons.push(el);
          }
        }

        // Upsert expanded questions with canonical IDs
        for (const eq of expandedQuestionBank) {
          const idx = dbCache.questions.findIndex((q) => q.id === eq.id);
          if (idx >= 0) {
            dbCache.questions[idx] = eq;
          } else {
            dbCache.questions.push(eq);
          }
        }

        // Upsert authentic recovery activities
        if (!dbCache.recoveryActivities) dbCache.recoveryActivities = [];
        for (const ra of authenticRecoveryActivities) {
          const idx = dbCache.recoveryActivities.findIndex((r) => r.id === ra.id);
          if (idx >= 0) {
            dbCache.recoveryActivities[idx] = ra;
          } else {
            dbCache.recoveryActivities.push(ra);
          }
        }

        // Merge expanded resources if not present
        const existingResIds = new Set(dbCache.resources.map((r) => r.id));
        for (const er of expandedResourceLibrary) {
          if (!existingResIds.has(er.id)) {
            dbCache.resources.push(er);
          }
        }

        return dbCache;
      }
    } catch (e) {
      console.error('Failed to parse database file, re-initializing...', e);
    }
  }

  // Initialize and seed database
  dbCache = seedInitialData();
  saveDb();
  return dbCache;
}

export function saveDb(): void {
  if (!dbCache) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(dbCache, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing database to disk:', err);
  }
}

function makePassword(plain: string) {
  const salt = 'classpulse_fixed_salt_' + plain.length;
  const hash = crypto.scryptSync(plain, salt, 64).toString('hex');
  return { hash, salt };
}

// Full Initial Seed
function seedInitialData(): DatabaseSchema {
  const defaultPw = 'Student@2026';
  const teacherPw = 'Teacher@2026';

  const teacherCredential = makePassword(teacherPw);
  const studentCredential = makePassword(defaultPw);

  // 1. Official Curriculum Sources
  const curriculumSources: CurriculumSource[] = [
    {
      id: 'src_cbse_2027',
      board: 'CBSE',
      sourceTitle: 'CBSE Secondary Curriculum (Classes IX-X) & Middle Scheme (Classes VI-VIII)',
      officialUrl: 'https://cbseacademic.nic.in/curriculum_2027.html',
      publisher: 'Central Board of Secondary Education, New Delhi',
      academicYear: '2026-2027',
      edition: 'Official Academic Curriculum 2026-2027',
      verificationStatus: 'Officially verified',
      lastChecked: '2026-10-15',
    },
    {
      id: 'src_ncert_tb',
      board: 'CBSE',
      sourceTitle: 'NCERT Rationalised Textbooks for Middle and Secondary Classes',
      officialUrl: 'https://ncert.nic.in/textbook.php',
      publisher: 'National Council of Educational Research and Training',
      academicYear: '2026-2027',
      edition: 'National Curriculum Framework Aligned Edition',
      verificationStatus: 'Officially verified',
      lastChecked: '2026-10-15',
    },
    {
      id: 'src_ts_scert',
      board: 'TELANGANA_SSC',
      sourceTitle: 'Telangana State SCERT Curriculum & Textbooks (Classes VI-X)',
      officialUrl: 'https://www.scert.telangana.gov.in/',
      publisher: 'State Council of Educational Research and Training, Hyderabad, Telangana',
      academicYear: '2026-2027',
      edition: 'SCERT Telangana Revised Curriculum Edition',
      verificationStatus: 'Officially verified',
      lastChecked: '2026-10-18',
    },
    {
      id: 'src_cisce_icse',
      board: 'CISCE',
      sourceTitle: 'CISCE Upper Primary Curriculum Framework & ICSE Regulations and Syllabuses',
      officialUrl: 'https://cisce.org/wp-content/uploads/2025/03/0.1-ICSE-Contents2.pdf',
      publisher: 'Council for the Indian School Certificate Examinations, New Delhi',
      academicYear: '2026-2027',
      edition: 'ICSE 2026-2027 Framework',
      verificationStatus: 'Officially verified',
      lastChecked: '2026-10-20',
    },
  ];

  // 2. Users & Profiles (18 Students + 1 Master Teacher)
  const users: User[] = [
    {
      id: 'user_teacher_1',
      loginId: 'teacher_priya',
      passwordHash: teacherCredential.hash,
      salt: teacherCredential.salt,
      name: 'Mrs. Priya Sharma',
      role: 'teacher',
      school: 'Delhi Public School & Telangana Model School Cluster',
      email: 'priya.sharma@classpulse.edu.in',
      createdAt: '2026-08-01T09:00:00Z',
    },
  ];

  const teacherProfiles: TeacherProfile[] = [
    {
      userId: 'user_teacher_1',
      teacherId: 'TCH-2026-01',
      assignedBoards: ['CBSE', 'TELANGANA_SSC', 'CISCE'],
      assignedClasses: ['6', '7', '8', '9', '10'],
      assignedSections: ['A', 'B', 'C'],
      assignedSubjects: [
        'Mathematics',
        'Physical Science',
        'Biological Science',
        'General Science',
        'Science',
        'Physics',
        'Chemistry',
        'Social Studies',
        'English',
      ],
      school: 'Delhi Public School & Telangana Model School Cluster',
    },
  ];

  const rawStudents = [
    {
      id: 'stu_cbse8_rahul',
      loginId: 'rahul.sharma',
      name: 'Rahul Sharma',
      board: 'CBSE' as const,
      classLevel: '8' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Applications'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Diagnosed with a fundamental prerequisite gap in finding common denominators / LCM for fraction addition.',
      initialProfileType: 'prerequisite_gap' as const,
    },
    {
      id: 'stu_ts8_sravani',
      loginId: 'sravani.reddy',
      name: 'Sravani Reddy',
      board: 'TELANGANA_SSC' as const,
      classLevel: '8' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English', 'Telugu', 'Hindi'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'te' as const,
      profileDesc: 'Exhibits conceptual misconception in Linear Equations when transposing negative terms across the equals sign.',
      initialProfileType: 'misconception' as const,
    },
    {
      id: 'stu_cisce8_aravind',
      loginId: 'aravind.menon',
      name: 'Aravind Menon',
      board: 'CISCE' as const,
      classLevel: '8' as const,
      section: 'B',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'English', 'Computer Studies'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Understands algebraic principles but commits procedural calculation slips during multi-step fractions reduction.',
      initialProfileType: 'calculation_error' as const,
    },
    {
      id: 'stu_cbse10_ananya',
      loginId: 'ananya.iyer',
      name: 'Ananya Iyer',
      board: 'CBSE' as const,
      classLevel: '10' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Applications'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Strong conceptual clarity in Real Numbers, Polynomials and quadratic formulations. High consistency.',
      initialProfileType: 'strong' as const,
    },
    {
      id: 'stu_ts10_sai',
      loginId: 'sai.krishna',
      name: 'Sai Krishna',
      board: 'TELANGANA_SSC' as const,
      classLevel: '10' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English', 'Telugu', 'Hindi'],
      interfaceLanguage: 'te' as const,
      learningLanguage: 'te' as const,
      profileDesc: 'Practicing regular questions on Chemical Reactions and Biological Life Processes with steady gains.',
      initialProfileType: 'practicing' as const,
    },
    {
      id: 'stu_cisce10_meera',
      loginId: 'meera.das',
      name: 'Meera Das',
      board: 'CISCE' as const,
      classLevel: '10' as const,
      section: 'C',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'English', 'Computer Applications'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Ready for higher-order challenge problems in Mechanics, Work-Power-Energy and Analytical Chemistry.',
      initialProfileType: 'challenge_ready' as const,
    },
    {
      id: 'stu_cbse6_aarav',
      loginId: 'aarav.patel',
      name: 'Aarav Patel',
      board: 'CBSE' as const,
      classLevel: '6' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Applications'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'New student account. Untested baseline; ready for diagnostic initial assessment.',
      initialProfileType: 'untested' as const,
    },
    {
      id: 'stu_ts6_kavya',
      loginId: 'kavya.rao',
      name: 'Kavya Rao',
      board: 'TELANGANA_SSC' as const,
      classLevel: '6' as const,
      section: 'A',
      medium: 'Telugu' as const,
      subjects: ['Mathematics', 'General Science', 'Social Studies', 'English', 'Telugu', 'Hindi'],
      interfaceLanguage: 'te' as const,
      learningLanguage: 'te' as const,
      profileDesc: 'Active in General Science (Plant Life & Motion). Regularly completes bilingual interactive practice.',
      initialProfileType: 'practicing' as const,
    },
    {
      id: 'stu_cisce6_rohan',
      loginId: 'rohan.sen',
      name: 'Rohan Sen',
      board: 'CISCE' as const,
      classLevel: '6' as const,
      section: 'B',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'English', 'Computer Studies'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Requires foundational review in factors and multiples before applying prime factorization.',
      initialProfileType: 'prerequisite_gap' as const,
    },
    {
      id: 'stu_cbse7_ishaan',
      loginId: 'ishaan.verma',
      name: 'Ishaan Verma',
      board: 'CBSE' as const,
      classLevel: '7' as const,
      section: 'B',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Applications'],
      interfaceLanguage: 'hi' as const,
      learningLanguage: 'hi' as const,
      profileDesc: 'Confuses autotrophic nutrition and parasitic modes in Science Chapter 1.',
      initialProfileType: 'misconception' as const,
    },
    {
      id: 'stu_ts7_manisha',
      loginId: 'manisha.goud',
      name: 'Manisha Goud',
      board: 'TELANGANA_SSC' as const,
      classLevel: '7' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'General Science', 'Social Studies', 'English', 'Telugu', 'Hindi'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Engaged with General Science (Measurement, Motion and Time). Consistently submitting step-by-step solutions.',
      initialProfileType: 'practicing' as const,
    },
    {
      id: 'stu_cisce7_vikram',
      loginId: 'vikram.chawla',
      name: 'Vikram Chawla',
      board: 'CISCE' as const,
      classLevel: '7' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'English', 'Computer Studies'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Exhibits strong mastery across Matter, Physical and Chemical Changes in Class 7 Chemistry.',
      initialProfileType: 'strong' as const,
    },
    {
      id: 'stu_cbse9_diya',
      loginId: 'diya.nair',
      name: 'Diya Nair',
      board: 'CBSE' as const,
      classLevel: '9' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Applications'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Newly registered Class 9 student. Baseline questions pending on Matter in Our Surroundings.',
      initialProfileType: 'untested' as const,
    },
    {
      id: 'stu_ts9_pranay',
      loginId: 'pranay.kumar',
      name: 'Pranay Kumar',
      board: 'TELANGANA_SSC' as const,
      classLevel: '9' as const,
      section: 'B',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English', 'Telugu', 'Hindi'],
      interfaceLanguage: 'te' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Practicing Laws of Motion & Cell Tissues. Needs occasional guidance on kinematic vectors.',
      initialProfileType: 'practicing' as const,
    },
    {
      id: 'stu_cisce9_tanya',
      loginId: 'tanya.kapoor',
      name: 'Tanya Kapoor',
      board: 'CISCE' as const,
      classLevel: '9' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'English', 'Computer Applications'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Strong grasp of 1D Kinematics concepts, but incurs decimal rounding and calculation slips in numericals.',
      initialProfileType: 'calculation_error' as const,
    },
    {
      id: 'stu_ts8_venkat',
      loginId: 'venkat.ramana',
      name: 'Venkat Ramana',
      board: 'TELANGANA_SSC' as const,
      classLevel: '8' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English', 'Telugu', 'Hindi'],
      interfaceLanguage: 'te' as const,
      learningLanguage: 'te' as const,
      profileDesc: 'Exceptional in TS Class 8 Biological Science (Cell Structure and Organelles). Ready for Olympiad challenges.',
      initialProfileType: 'challenge_ready' as const,
    },
    {
      id: 'stu_cbse8_sneha',
      loginId: 'sneha.kulkarni',
      name: 'Sneha Kulkarni',
      board: 'CBSE' as const,
      classLevel: '8' as const,
      section: 'A',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Applications'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Solid conceptual understanding in CBSE Class 8 Science (Force & Pressure) and Computer Applications.',
      initialProfileType: 'strong' as const,
    },
    {
      id: 'stu_cisce8_zoya',
      loginId: 'zoya.ahmed',
      name: 'Zoya Ahmed',
      board: 'CISCE' as const,
      classLevel: '8' as const,
      section: 'C',
      medium: 'English' as const,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'English', 'Computer Studies'],
      interfaceLanguage: 'en' as const,
      learningLanguage: 'en' as const,
      profileDesc: 'Regularly progressing through ICSE Class 8 History and Algorithms in Computer Studies.',
      initialProfileType: 'practicing' as const,
    },
  ];

  const studentProfiles: StudentProfile[] = [];

  for (const s of rawStudents) {
    users.push({
      id: s.id,
      loginId: s.loginId,
      passwordHash: studentCredential.hash,
      salt: studentCredential.salt,
      name: s.name,
      role: 'student',
      school: s.board === 'TELANGANA_SSC' ? 'Telangana State Model School, Hyderabad' : s.board === 'CBSE' ? 'Delhi Public School, Sector 4' : 'St. Xavier’s High School (ICSE)',
      email: `${s.loginId}@student.classpulse.edu.in`,
      createdAt: '2026-08-10T10:00:00Z',
    });

    studentProfiles.push({
      userId: s.id,
      studentId: `STU-${s.board.slice(0, 2)}-${s.classLevel}0${studentProfiles.length + 1}`,
      board: s.board,
      academicYear: '2026-2027',
      classLevel: s.classLevel,
      section: s.section,
      medium: s.medium,
      registeredSubjects: s.subjects,
      interfaceLanguage: s.interfaceLanguage,
      learningLanguage: s.learningLanguage,
      learningProfileDescription: s.profileDesc,
      initialProfileType: s.initialProfileType,
    });
  }

  // 3. Curriculum Chapters & Concepts across Boards & Classes
  const chapters: CurriculumChapter[] = [
    // CBSE Class 8 Math - Complete Chapter 1: Rational Numbers & Fractions
    {
      id: 'ch_cbse8_math_fractions',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterNumber: 1,
      title: 'Rational Numbers & Fractions',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'Rational numbers form the bedrock of algebra and real-world arithmetic. In this chapter, we explore fractional representations, equivalent rational numbers, addition and subtraction using least common denominators (LCM), reciprocal multiplication, and word problem modeling.',
      learningObjectives: [
        'Understand the formal definition of rational numbers in p/q form (q ≠ 0)',
        'Master fraction reduction to lowest terms using GCD/HCF',
        'Add and subtract fractions with like and unlike denominators using LCM',
        'Multiply rational numbers and understand the concept of reciprocal/multiplicative inverse',
        'Solve multi-step real-world problems involving fractional parts',
      ],
      concepts: [
        {
          id: 'con_cbse8_m1_c1',
          chapterId: 'ch_cbse8_math_fractions',
          title: 'Concept of Rational Numbers & Equivalence',
          description: 'Numbers expressible as p/q where p and q are integers and q is non-zero.',
          order: 1,
          learningOutcome: 'Represent rational numbers on number lines and determine equivalence.',
          prerequisites: [],
        },
        {
          id: 'con_cbse8_m1_c2',
          chapterId: 'ch_cbse8_math_fractions',
          title: 'Fraction Simplification & Lowest Terms',
          description: 'Dividing numerator and denominator by their greatest common divisor (GCD).',
          order: 2,
          learningOutcome: 'Reduce any fraction to its simplest irreducible form.',
          prerequisites: [
            {
              conceptId: 'con_cbse8_m1_c2',
              prerequisiteConceptId: 'con_cbse6_factors_gcd',
              prerequisiteTitle: 'Factors, Multiples & GCD (Class 6)',
              prerequisiteClass: '6',
              prerequisiteSubject: 'Mathematics',
              importance: 'Essential',
            },
          ],
        },
        {
          id: 'con_cbse8_m1_c3',
          chapterId: 'ch_cbse8_math_fractions',
          title: 'Addition & Subtraction of Unlike Fractions (LCM Method)',
          description: 'Aligning denominators using the Least Common Multiple (LCM) before combining numerators.',
          order: 3,
          learningOutcome: 'Accurately compute sums and differences of unlike rational numbers without adding denominators.',
          prerequisites: [
            {
              conceptId: 'con_cbse8_m1_c3',
              prerequisiteConceptId: 'con_cbse6_lcm',
              prerequisiteTitle: 'Finding Least Common Multiple (LCM)',
              prerequisiteClass: '6',
              prerequisiteSubject: 'Mathematics',
              importance: 'Essential',
            },
          ],
        },
        {
          id: 'con_cbse8_m1_c4',
          chapterId: 'ch_cbse8_math_fractions',
          title: 'Multiplication & Reciprocals of Rational Numbers',
          description: 'Direct numerator-by-numerator and denominator-by-denominator multiplication, and multiplicative inverses.',
          order: 4,
          learningOutcome: 'Divide rational numbers by multiplying by the reciprocal of the divisor.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ncert_tb',
      isComplete: true,
    },

    // CBSE Class 8 Math - Complete Chapter 2: Linear Equations in One Variable
    {
      id: 'ch_cbse8_math_linear_eq',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterNumber: 2,
      title: 'Linear Equations in One Variable',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'Linear equations are mathematical statements where an expression with a degree-1 variable equals another expression or constant. Mastering balancing methods and the transposition rule unlocks problem solving in science, geometry, and finance.',
      learningObjectives: [
        'Distinguish algebraic expressions from algebraic equations',
        'Solve linear equations using the balancing property of equality',
        'Apply the transposition method with strict sign-reversal discipline',
        'Solve linear equations having variables on both sides',
        'Formulate and solve real-world word problems from word statements',
      ],
      concepts: [
        {
          id: 'con_cbse8_m2_c1',
          chapterId: 'ch_cbse8_math_linear_eq',
          title: 'Equations vs Expressions & Degree of a Variable',
          description: 'Understanding equations as balances containing an equals sign (=) with highest power 1.',
          order: 1,
          learningOutcome: 'Identify linear equations and verify solutions by substitution.',
          prerequisites: [],
        },
        {
          id: 'con_cbse8_m2_c2',
          chapterId: 'ch_cbse8_math_linear_eq',
          title: 'Transposition Method & Sign Reversal',
          description: 'Moving terms across the equals sign by changing positive to negative and multiplication to division.',
          order: 2,
          learningOutcome: 'Isolate variables without making sign errors during transposition.',
          prerequisites: [
            {
              conceptId: 'con_cbse8_m2_c2',
              prerequisiteConceptId: 'con_cbse7_integers_signs',
              prerequisiteTitle: 'Integer Rules & Sign Operations (Class 7)',
              prerequisiteClass: '7',
              prerequisiteSubject: 'Mathematics',
              importance: 'Essential',
            },
          ],
        },
        {
          id: 'con_cbse8_m2_c3',
          chapterId: 'ch_cbse8_math_linear_eq',
          title: 'Equations with Variables on Both Sides',
          description: 'Grouping variable terms on the LHS and constant terms on the RHS.',
          order: 3,
          learningOutcome: 'Solve multi-term equations involving brackets and fractions.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ncert_tb',
      isComplete: true,
    },

    // CBSE Class 8 Science: Force and Pressure
    {
      id: 'ch_cbse8_sci_force',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Science',
      chapterNumber: 8,
      title: 'Force and Pressure',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'Force is an interaction that, when unopposed, changes the motion of an object. Pressure is the magnitude of force exerted per unit area.',
      learningObjectives: [
        'Understand push or pull as force',
        'Differentiate contact and non-contact forces',
        'Calculate pressure using Pressure = Force / Area',
        'Examine atmospheric and fluid pressure',
      ],
      concepts: [
        {
          id: 'con_cbse8_sci_c1',
          chapterId: 'ch_cbse8_sci_force',
          title: 'Nature of Force: Contact vs Non-Contact',
          description: 'Muscular and friction forces vs gravitational, electrostatic, and magnetic forces.',
          order: 1,
          learningOutcome: 'Classify everyday interactions into contact and field forces.',
          prerequisites: [],
        },
        {
          id: 'con_cbse8_sci_c2',
          chapterId: 'ch_cbse8_sci_force',
          title: 'Pressure and Surface Area Relationship',
          description: 'For a given force, a smaller surface area results in greater pressure.',
          order: 2,
          learningOutcome: 'Apply P = F/A to explain sharp knives, wide camel feet, and foundation structures.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ncert_tb',
      isComplete: true,
    },

    // Telangana SSC Class 8 Physical Science: Metals and Non-Metals
    {
      id: 'ch_ts8_ps_metals',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Physical Science',
      chapterNumber: 4,
      title: 'Metals and Non-Metals',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'SCERT Telangana Physical Science curriculum investigates the physical properties (malleability, ductility, sonority, conductivity) and chemical reactions of metallic and non-metallic elements.',
      learningObjectives: [
        'Analyze malleability, ductility, sonority and conductivity of elements',
        'Observe reactions of metals with oxygen, water and acids',
        'Compare acidic vs basic nature of metallic and non-metallic oxides',
      ],
      concepts: [
        {
          id: 'con_ts8_ps_c1',
          chapterId: 'ch_ts8_ps_metals',
          title: 'Physical Properties of Metals and Non-Metals',
          description: 'Distinguishing elements based on luster, conductivity, ductility, and malleability.',
          order: 1,
          learningOutcome: 'Identify metals and non-metals experimentally.',
          prerequisites: [],
        },
        {
          id: 'con_ts8_ps_c2',
          chapterId: 'ch_ts8_ps_metals',
          title: 'Chemical Reactions with Oxygen & Oxides Nature',
          description: 'Metal oxides are basic (turn red litmus blue); non-metal oxides are acidic (turn blue litmus red).',
          order: 2,
          learningOutcome: 'Predict litmus indicator color changes for metallic vs non-metallic oxides.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ts_scert',
      isComplete: true,
    },

    // Telangana SSC Class 8 Biological Science: Cell - The Basic Unit of Life
    {
      id: 'ch_ts8_bs_cell',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Biological Science',
      chapterNumber: 1,
      title: 'Cell: The Basic Unit of Life',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'SCERT Telangana Biological Science curriculum introduces the discovery of cells by Robert Hooke, microscopic observation of onion peel and cheek cells, and the structural differences between plant and animal cells.',
      learningObjectives: [
        'Understand historical discovery of the cell',
        'Identify cell membrane, nucleus, cytoplasm, and cell wall',
        'Compare plant cells with animal cells',
      ],
      concepts: [
        {
          id: 'con_ts8_bs_c1',
          chapterId: 'ch_ts8_bs_cell',
          title: 'Cell Organelles: Nucleus, Membrane & Cell Wall',
          description: 'The distinct functions of boundary layers and the control center of the cell.',
          order: 1,
          learningOutcome: 'Distinguish animal cells from plant cells by the presence of cell walls and plastids.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ts_scert',
      isComplete: true,
    },

    // Telangana SSC Class 8 Mathematics: Linear Equations in One Variable (State Syllabus)
    {
      id: 'ch_ts8_math_linear_eq',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Mathematics',
      chapterNumber: 2,
      title: 'Linear Equations in One Variable (SCERT)',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'SCERT Telangana Class VIII Mathematics syllabus focusing on solving equations using transposition and balancing with applications to age, currency, and geometry problems.',
      learningObjectives: [
        'Solve simple linear equations in one variable',
        'Apply the transposition method with strict sign preservation',
        'Formulate mathematical equations for practical real-life scenarios',
      ],
      concepts: [
        {
          id: 'con_ts8_m2_c1',
          chapterId: 'ch_ts8_math_linear_eq',
          title: 'Transposition and Balancing Equations',
          description: 'Solving linear equations with variables on one or both sides.',
          order: 1,
          learningOutcome: 'Accurately transpose terms without sign inversions.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ts_scert',
      isComplete: true,
    },

    // CISCE Class 8 Computer Studies: Algorithms and Flowcharts
    {
      id: 'ch_cisce8_comp_algo',
      board: 'CISCE',
      classLevel: '8',
      subject: 'Computer Studies',
      chapterNumber: 3,
      title: 'Algorithms and Flowcharts',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'CISCE Upper Primary framework for Computer Studies: computational thinking, algorithmic steps, standard flowchart symbols, and decision logic.',
      learningObjectives: [
        'Define algorithm as finite sequential instructions',
        'Identify flowchart symbols: oval (terminator), parallelogram (I/O), rectangle (process), diamond (decision)',
        'Trace execution and identify logic errors',
      ],
      concepts: [
        {
          id: 'con_cisce8_cs_c1',
          chapterId: 'ch_cisce8_comp_algo',
          title: 'Flowchart Symbols & Decision Making',
          description: 'Mapping conditional branching (if-then-else) using diamond decision symbols.',
          order: 1,
          learningOutcome: 'Construct correct flowcharts for conditional problems.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_cisce_icse',
      isComplete: true,
    },

    // CBSE Class 6 Mathematics: Fractions and Decimals
    {
      id: 'ch_cbse6_math_fractions',
      board: 'CBSE',
      classLevel: '6',
      subject: 'Mathematics',
      chapterNumber: 7,
      title: 'Fractions & Representation',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'Foundational introduction to parts of a whole, proper/improper fractions, and number line representation.',
      learningObjectives: [
        'Understand fraction as a part of a whole or collection',
        'Plot fractions on a number line',
        'Convert between improper and mixed fractions',
      ],
      concepts: [
        {
          id: 'con_cbse6_m1_c1',
          chapterId: 'ch_cbse6_math_fractions',
          title: 'Fractions as Parts of a Whole',
          description: 'Numerator represents selected parts; denominator represents total equal parts.',
          order: 1,
          learningOutcome: 'Identify and write fractions from shaded diagrams.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ncert_tb',
      isComplete: true,
    },

    // Telangana SSC Class 6 General Science: Plant Parts and Photosynthesis
    {
      id: 'ch_ts6_sci_plants',
      board: 'TELANGANA_SSC',
      classLevel: '6',
      subject: 'General Science',
      chapterNumber: 2,
      title: 'Knowing About Plants',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'Telangana SCERT Class 6 General Science exploring roots (taproot vs fibrous), stem transport, and leaf venation.',
      learningObjectives: [
        'Differentiate tap root and fibrous root systems',
        'Relate leaf venation with root types',
        'Understand basic leaf functions including photosynthesis and transpiration',
      ],
      concepts: [
        {
          id: 'con_ts6_sci_c1',
          chapterId: 'ch_ts6_sci_plants',
          title: 'Roots and Leaf Venation Correlation',
          description: 'Reticulate venation correlates with taproot; parallel venation correlates with fibrous roots.',
          order: 1,
          learningOutcome: 'Predict root structure by examining leaf venation.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ts_scert',
      isComplete: true,
    },

    // CISCE Class 6 Mathematics: Numbers and Factors
    {
      id: 'ch_cisce6_math_numbers',
      board: 'CISCE',
      classLevel: '6',
      subject: 'Mathematics',
      chapterNumber: 2,
      title: 'Factors, Multiples & Prime Numbers',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'CISCE Upper Primary Mathematics: properties of numbers, prime factorization, and HCF/LCM.',
      learningObjectives: [
        'Determine factors and multiples of natural numbers',
        'Perform prime factorization using factor trees or division',
        'Calculate HCF and LCM of numbers',
      ],
      concepts: [
        {
          id: 'con_cisce6_m1_c1',
          chapterId: 'ch_cisce6_math_numbers',
          title: 'Prime Factorization & LCM Calculation',
          description: 'Expressing composite numbers as products of primes to determine LCM.',
          order: 1,
          learningOutcome: 'Find LCM accurately using continuous prime division.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_cisce_icse',
      isComplete: true,
    },

    // CBSE Class 7 Science: Nutrition in Plants
    {
      id: 'ch_cbse7_sci_nutrition',
      board: 'CBSE',
      classLevel: '7',
      subject: 'Science',
      chapterNumber: 1,
      title: 'Nutrition in Plants',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'NCERT Class 7 Science: Modes of nutrition, autotrophic vs heterotrophic, photosynthesis mechanism, and saprotrophs.',
      learningObjectives: [
        'Explain photosynthesis equation: Carbon dioxide + Water -> Carbohydrate + Oxygen',
        'Identify role of chlorophyll, stomata and sunlight',
        'Distinguish parasitic, insectivorous, and saprotrophic modes',
      ],
      concepts: [
        {
          id: 'con_cbse7_sci_c1',
          chapterId: 'ch_cbse7_sci_nutrition',
          title: 'Autotrophic Nutrition & Photosynthesis',
          description: 'Plants synthesize glucose using sunlight, chlorophyll, CO2, and water.',
          order: 1,
          learningOutcome: 'Describe the essential inputs and products of photosynthesis.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ncert_tb',
      isComplete: true,
    },

    // Telangana SSC Class 7 General Science: Motion and Time
    {
      id: 'ch_ts7_sci_motion',
      board: 'TELANGANA_SSC',
      classLevel: '7',
      subject: 'General Science',
      chapterNumber: 4,
      title: 'Motion and Time',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'SCERT Telangana Class 7 General Science: Measurement of time, uniform and non-uniform motion, calculating speed.',
      learningObjectives: [
        'Define speed as distance divided by time',
        'Convert between km/h and m/s',
        'Interpret distance-time graphs',
      ],
      concepts: [
        {
          id: 'con_ts7_sci_c1',
          chapterId: 'ch_ts7_sci_motion',
          title: 'Speed Calculation & Uniform Motion',
          description: 'Formula Speed = Distance / Time and standard SI units.',
          order: 1,
          learningOutcome: 'Calculate unknown parameters using Speed = Distance / Time.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ts_scert',
      isComplete: true,
    },

    // CISCE Class 7 Chemistry: Elements, Compounds & Mixtures
    {
      id: 'ch_cisce7_chem_matter',
      board: 'CISCE',
      classLevel: '7',
      subject: 'Chemistry',
      chapterNumber: 3,
      title: 'Elements, Compounds and Mixtures',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'CISCE Class 7 Chemistry curriculum: Classification of matter, chemical formulas, and separation techniques.',
      learningObjectives: [
        'Differentiate pure substances from mixtures',
        'Recognize chemical symbols and formulas',
        'Select separation methods like filtration, evaporation, distillation',
      ],
      concepts: [
        {
          id: 'con_cisce7_chem_c1',
          chapterId: 'ch_cisce7_chem_matter',
          title: 'Compounds vs Mixtures Characteristics',
          description: 'Compounds have fixed ratios and chemical bonds; mixtures have variable composition.',
          order: 1,
          learningOutcome: 'Distinguish compounds from mixtures by physical separation feasibility.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_cisce_icse',
      isComplete: true,
    },

    // CBSE Class 9 Science: Matter in Our Surroundings
    {
      id: 'ch_cbse9_sci_matter',
      board: 'CBSE',
      classLevel: '9',
      subject: 'Science',
      chapterNumber: 1,
      title: 'Matter in Our Surroundings',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'NCERT Class 9 Science: Particle nature of matter, characteristics of particles, states of matter, latent heat, and evaporation.',
      learningObjectives: [
        'Examine particle spaces, attraction, and kinetic energy',
        'Explain state transitions using temperature and pressure',
        'Understand latent heat of fusion and vaporization',
      ],
      concepts: [
        {
          id: 'con_cbse9_sci_c1',
          chapterId: 'ch_cbse9_sci_matter',
          title: 'States of Matter & Latent Heat',
          description: 'Intermolecular forces vs thermal energy during phase changes.',
          order: 1,
          learningOutcome: 'Explain why temperature stays constant during melting and boiling.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ncert_tb',
      isComplete: true,
    },

    // Telangana SSC Class 9 Physical Science: Laws of Motion
    {
      id: 'ch_ts9_ps_laws_motion',
      board: 'TELANGANA_SSC',
      classLevel: '9',
      subject: 'Physical Science',
      chapterNumber: 2,
      title: 'Laws of Motion',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'SCERT Telangana Class 9 Physical Science: Aristotle vs Galileo views, Newton’s three laws of motion, inertia, momentum, and impulse.',
      learningObjectives: [
        'Define inertia and apply Newton’s first law',
        'Derive F = ma from rate of change of momentum',
        'Analyze action-reaction pairs in Newton’s third law',
      ],
      concepts: [
        {
          id: 'con_ts9_ps_c1',
          chapterId: 'ch_ts9_ps_laws_motion',
          title: 'Newton’s Second Law & Momentum Calculation',
          description: 'Force equals mass times acceleration (F = ma) and conservation of momentum.',
          order: 1,
          learningOutcome: 'Calculate net force, acceleration, and change in momentum.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ts_scert',
      isComplete: true,
    },

    // CISCE Class 9 Physics: Motion in One Dimension
    {
      id: 'ch_cisce9_phy_motion1d',
      board: 'CISCE',
      classLevel: '9',
      subject: 'Physics',
      chapterNumber: 2,
      title: 'Motion in One Dimension',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'ICSE Class 9 Physics: Scalars and vectors, speed, velocity, acceleration, equations of uniformly accelerated motion.',
      learningObjectives: [
        'Differentiate scalar and vector quantities',
        'Apply equations: v = u + at, s = ut + 0.5at², v² = u² + 2as',
        'Interpret velocity-time graphs for acceleration and distance',
      ],
      concepts: [
        {
          id: 'con_cisce9_phy_c1',
          chapterId: 'ch_cisce9_phy_motion1d',
          title: 'Kinematic Equations for Uniform Acceleration',
          description: 'Solving numerical problems using the three kinematic equations.',
          order: 1,
          learningOutcome: 'Select and calculate the appropriate equation of motion given initial conditions.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_cisce_icse',
      isComplete: true,
    },

    // CBSE Class 10 Mathematics: Real Numbers & Polynomials
    {
      id: 'ch_cbse10_math_real',
      board: 'CBSE',
      classLevel: '10',
      subject: 'Mathematics',
      chapterNumber: 1,
      title: 'Real Numbers & Fundamental Theorem of Arithmetic',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'NCERT Class 10 Mathematics: Fundamental Theorem of Arithmetic, proving irrationality of √2, √3, √5, and decimal expansions of rational numbers.',
      learningObjectives: [
        'State and apply the Fundamental Theorem of Arithmetic',
        'Compute HCF and LCM of polynomials and composite numbers',
        'Prove irrationality of numbers using proof by contradiction',
      ],
      concepts: [
        {
          id: 'con_cbse10_m1_c1',
          chapterId: 'ch_cbse10_math_real',
          title: 'Fundamental Theorem of Arithmetic & Proof of Irrationality',
          description: 'Every composite number can be uniquely expressed as a product of primes.',
          order: 1,
          learningOutcome: 'Construct rigorous proofs of irrationality using contradiction.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ncert_tb',
      isComplete: true,
    },

    // Telangana SSC Class 10 Physical Science: Chemical Reactions and Equations
    {
      id: 'ch_ts10_ps_reactions',
      board: 'TELANGANA_SSC',
      classLevel: '10',
      subject: 'Physical Science',
      chapterNumber: 1,
      title: 'Chemical Reactions and Equations',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'SCERT Telangana Class 10 Physical Science: Chemical equations, balancing chemical equations, types of reactions, oxidation and reduction, corrosion and rancidity.',
      learningObjectives: [
        'Write balanced chemical equations with state symbols',
        'Categorize combination, decomposition, displacement, and double displacement',
        'Identify oxidizing and reducing agents in redox reactions',
      ],
      concepts: [
        {
          id: 'con_ts10_ps_c1',
          chapterId: 'ch_ts10_ps_reactions',
          title: 'Balancing Chemical Equations & Redox Reactions',
          description: 'Conservation of mass in chemical reactions and electron transfer/oxygen-hydrogen tracking.',
          order: 1,
          learningOutcome: 'Balance multi-reactant equations and identify oxidation states.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_ts_scert',
      isComplete: true,
    },

    // CISCE Class 10 Physics: Force, Work, Power and Energy
    {
      id: 'ch_cisce10_phy_force',
      board: 'CISCE',
      classLevel: '10',
      subject: 'Physics',
      chapterNumber: 1,
      title: 'Force, Work, Power and Energy',
      academicYear: '2026-2027',
      medium: 'English',
      introduction: 'ICSE Class 10 Physics: Turning effect of a force (moment of force), equilibrium, center of gravity, work, power, kinetic and potential energy conservation.',
      learningObjectives: [
        'Calculate moment of force: Force × Perpendicular distance',
        'State the principle of moments for a body in rotational equilibrium',
        'Relate kinetic energy (0.5mv²) and potential energy (mgh) in free fall',
      ],
      concepts: [
        {
          id: 'con_cisce10_phy_c1',
          chapterId: 'ch_cisce10_phy_force',
          title: 'Moment of Force & Principle of Moments',
          description: 'Clockwise moment equals counter-clockwise moment in rotational balance.',
          order: 1,
          learningOutcome: 'Solve lever and meter-rule balancing problems using the principle of moments.',
          prerequisites: [],
        },
      ],
      officialSourceId: 'src_cisce_icse',
      isComplete: true,
    },
  ];

  // 4. Lessons for Key Chapters (with full trilingual support en/hi/te)
  const lessons: LessonContent[] = [
    // Lesson: CBSE Class 8 Math Fractions - Adding Unlike Fractions
    {
      id: 'les_cbse8_m1_c3',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      title: 'Addition & Subtraction of Unlike Fractions (LCM Method)',
      explanation: {
        en: 'When adding or subtracting fractions with unlike denominators, you CANNOT simply add the denominators together! For example, 1/2 + 1/3 is NOT 2/5. You must first find the Least Common Denominator (LCM of denominators), convert each fraction into an equivalent fraction with that common denominator, and only then combine the numerators.',
        hi: 'जब असमान हर (denominators) वाले भिन्न (fractions) जोड़े या घटाए जाते हैं, तो हरों को सीधे नहीं जोड़ा जा सकता! उदाहरण के लिए, 1/2 + 1/3 का मान 2/5 नहीं होता। आपको पहले हरों का लघुत्तम समापवर्त्य (LCM) ज्ञात करना होगा, प्रत्येक भिन्न को समान हर वाले तुल्य भिन्न में बदलना होगा, और फिर अंशों (numerators) को जोड़ना होगा।',
        te: 'వేర్వేరు హారాలు (denominators) కలిగిన భిన్నాలను కూడేటప్పుడు లేదా తీసివేసేటప్పుడు, హారాలను నేరుగా కూడకూడదు! ఉదాహరణకు, 1/2 + 1/3 అనేది 2/5 కాదు. ముందుగా హారాల క.సా.గు (LCM) కనుగొని, ప్రతి భిన్నాన్ని సమాన హారంగల సమాన భిన్నంగా మార్చి, ఆ తర్వాతే లవాలను (numerators) కూడాలి.',
      },
      definitions: [
        {
          term: 'Least Common Denominator (LCD / LCM)',
          definition: {
            en: 'The smallest positive integer that is divisible by all the denominators in the fraction set.',
            hi: 'वह सबसे छोटी धनात्मक संख्या जो दिए गए सभी भिन्नों के हरों से पूर्णतः विभाजित होती है।',
            te: 'ఇచ్చిన అన్ని భిన్నాల హారాలచే నిశ్శేషంగా భాగించబడే అతిచిన్న ధనాత్మక పూర్ణాంకం.',
          },
        },
        {
          term: 'Equivalent Fractions',
          definition: {
            en: 'Fractions that represent the exact same value or proportion, obtained by multiplying or dividing numerator and denominator by the same non-zero integer.',
            hi: 'वे भिन्न जो समान मान या अनुपात दर्शाते हैं, जिन्हें अंश और हर को समान गैर-शून्य संख्या से गुणा या भाग करके प्राप्त किया जाता है।',
            te: 'లవం మరియు హారాన్ని ఒకే శూన్యేతర సంఖ్యతో గుణించడం లేదా భాగించడం ద్వారా పొందే సమాన విలువ గల భిన్నాలు.',
          },
        },
      ],
      workedExamples: [
        {
          problem: {
            en: 'Calculate: 2/3 + 3/4',
            hi: 'हल कीजिए: 2/3 + 3/4',
            te: 'సాధించండి: 2/3 + 3/4',
          },
          stepByStep: [
            {
              en: 'Step 1: Check denominators. They are 3 and 4 (unlike denominators).',
              hi: 'चरण 1: हरों की जाँच करें। वे 3 और 4 हैं (असमान हर)।',
              te: 'దశ 1: హారాలను గమనించండి. అవి 3 మరియు 4 (విభిన్న హారాలు).',
            },
            {
              en: 'Step 2: Find LCM of 3 and 4. Since 3 and 4 have no common factors other than 1, LCM = 3 × 4 = 12.',
              hi: 'चरण 2: 3 और 4 का LCM निकालें। LCM = 3 × 4 = 12।',
              te: 'దశ 2: 3 మరియు 4 ల క.సా.గు = 12.',
            },
            {
              en: 'Step 3: Convert to equivalent fractions with denominator 12: (2×4)/(3×4) = 8/12, and (3×3)/(4×3) = 9/12.',
              hi: 'चरण 3: हर 12 वाले तुल्य भिन्न बनाएं: 2/3 = 8/12, और 3/4 = 9/12।',
              te: 'దశ 3: హారం 12 గా మార్చండి: 2/3 = 8/12, మరియు 3/4 = 9/12.',
            },
            {
              en: 'Step 4: Keep the denominator 12, add only the numerators: (8 + 9) / 12 = 17/12.',
              hi: 'चरण 4: हर 12 रहेगा, केवल अंशों को जोड़ें: (8 + 9) / 12 = 17/12 (या 1 पूर्णांक 5/12)।',
              te: 'దశ 4: హారం 12 అలాగే ఉంచి, లవాలను మాత్రమే కూడండి: (8 + 9) / 12 = 17/12.',
            },
          ],
          finalAnswer: '17/12 (or 1 5/12)',
          keyInsight: {
            en: 'Never add 2+3 over 3+4! Denominators define the slice size; you must equalize slice sizes before counting.',
            hi: 'कभी भी (2+3)/(3+4) न करें! हर केवल टुकड़ों का आकार बताता है।',
            te: 'ఎప్పటికీ (2+3)/(3+4) అని రాయకండి! హారం కేవలం భాగాన్ని సూచిస్తుంది.',
          },
        },
      ],
      commonMistakes: [
        {
          mistake: {
            en: 'Adding denominators: 2/3 + 3/4 = 5/7',
            hi: 'हरों को जोड़ना: 2/3 + 3/4 = 5/7',
            te: 'హారాలను కూడడం: 2/3 + 3/4 = 5/7',
          },
          correction: {
            en: 'Always convert both to equivalent fractions having a common denominator: 8/12 + 9/12 = 17/12.',
            hi: 'हमेशा समान हर वाले तुल्य भिन्न बनाएं: 8/12 + 9/12 = 17/12।',
            te: 'ఎల్లప్పుడూ ఉమ్మడి హారంగల సమాన భిన్నాలుగా మార్చండి: 8/12 + 9/12 = 17/12.',
          },
          whyItHappens: {
            en: 'Intuitive carryover from whole number addition without understanding that the denominator represents unit scale, not count.',
            hi: 'पूर्णांकों के जोड़ की आदत, यह समझे बिना कि हर इकाई का पैमाना है न कि गिनती।',
            te: 'హారం అనేది కొలత యూనిట్ అని గమనించకుండా సాధారణ సంఖ్యల వలె కూడడం వల్ల.',
          },
        },
      ],
      visualizerType: 'fraction_bar',
      visualizerConfig: {
        fractionA: { num: 2, den: 3 },
        fractionB: { num: 3, den: 4 },
        lcm: 12,
      },
      summaryPoints: [
        {
          en: '1. Denominators represent the division of a unit; numerators represent the count.',
          hi: '1. हर किसी इकाई के विभाजन को दर्शाता है; अंश गणना को दर्शाता है।',
          te: '1. హారం విభజించబడిన భాగాలను, లవం తీసుకున్న భాగాలను తెలుపుతుంది.',
        },
        {
          en: '2. To add/subtract unlike fractions: Find LCM -> Form equivalent fractions -> Add numerators -> Simplify.',
          hi: '2. असमान भिन्नों के लिए: LCM निकालें -> तुल्य भिन्न बनाएं -> अंश जोड़ें -> सरल करें।',
          te: '2. విభిన్న భిన్నాలకు: క.సా.గు కనుగొనండి -> సమాన భిన్నాలు రాయండి -> లవాలు కూడండి -> కనిష్ట రూపం.',
        },
      ],
    },

    // Lesson: CBSE / TS Class 8 Math Linear Equations - Transposition Method
    {
      id: 'les_cbse8_m2_c2',
      chapterId: 'ch_cbse8_math_linear_eq',
      conceptId: 'con_cbse8_m2_c2',
      title: 'Transposition Method & Sign Reversal Discipline',
      explanation: {
        en: 'Transposition is a quick method derived from the golden rule of equations: "Whatever you do to one side, you must do to the other." When a term moves from one side of the equal sign (=) to the other, its operation inverts: + becomes -, - becomes +, × becomes ÷, and ÷ becomes ×.',
        hi: 'पक्षांतरण (Transposition) समीकरणों के मूल नियम पर आधारित है: "जो क्रिया एक तरफ करें, वही दूसरी तरफ भी करें।" जब कोई पद बराबर (=) के दूसरी तरफ जाता है, तो उसका चिन्ह बदल जाता है: + बनता है -, - बनता है +, × बनता है ÷, और ÷ बनता है ×।',
        te: 'పక్షాంతరీకరణ (Transposition) అనేది సమీకరణాల ప్రాథమిక నియమంపై ఆధారపడి ఉంటుంది. సమానత్వ గుర్తు (=) దాటినప్పుడు ప్రతి ప్రక్రియ విలోమమవుతుంది: + కాస్తా - అవుతుంది, - కాస్తా + అవుతుంది, గుణకారం భాగాహారమవుతుంది.',
      },
      definitions: [
        {
          term: 'Transposition',
          definition: {
            en: 'The algebraic operation of transferring a term from one side of an equation to the other while altering its sign.',
            hi: 'किसी पद को चिन्ह बदलकर समीकरण के एक पक्ष से दूसरे पक्ष में ले जाने की प्रक्रिया।',
            te: 'సమీకరణంలో ఒక వైపు ఉన్న పదాన్ని గుర్తు మార్చి మరొక వైపుకు తరలించే ప్రక్రియ.',
          },
        },
      ],
      workedExamples: [
        {
          problem: {
            en: 'Solve for x: 3x - 7 = 14',
            hi: 'x का मान ज्ञात कीजिए: 3x - 7 = 14',
            te: 'x విలువ కనుగొనండి: 3x - 7 = 14',
          },
          stepByStep: [
            {
              en: 'Step 1: Isolate the variable term (3x). Move the constant (-7) to the RHS.',
              hi: 'चरण 1: चर पद (3x) को अलग करें। -7 को दाईं तरफ ले जाएं।',
              te: 'దశ 1: చరరాశి పదాన్ని (3x) వేరు చేయండి. -7 ను కుడివైపుకు తరలించండి.',
            },
            {
              en: 'Step 2: Sign rule: When -7 moves across =, it becomes +7. So: 3x = 14 + 7.',
              hi: 'चरण 2: चिन्ह नियम: जब -7 दाईं ओर जाएगा तो +7 बनेगा। 3x = 14 + 7 = 21।',
              te: 'దశ 2: గుర్తు నియమం: -7 కుడివైపుకు వెళ్తే +7 అవుతుంది. కాబట్టి 3x = 14 + 7 = 21.',
            },
            {
              en: 'Step 3: Now isolate x. Since 3 multiplies x, it transposes as division: x = 21 / 3 = 7.',
              hi: 'चरण 3: अब x का मान निकालें: x = 21 / 3 = 7।',
              te: 'దశ 3: 3 అనేది x ని గుణిస్తోంది కాబట్టి భాగిస్తుంది: x = 21 / 3 = 7.',
            },
            {
              en: 'Step 4: Verify by substituting x=7 back: 3(7) - 7 = 21 - 7 = 14. LHS = RHS!',
              hi: 'चरण 4: x=7 रखकर जांचें: 3(7) - 7 = 21 - 7 = 14. दोनों पक्ष बराबर हैं!',
              te: 'దశ 4: తనిఖీ: 3(7) - 7 = 21 - 7 = 14. సరిపోయింది!',
            },
          ],
          finalAnswer: 'x = 7',
          keyInsight: {
            en: 'Never keep the minus sign when moving across the equals sign! 3x = 14 - 7 is a fatal error.',
            hi: 'बराबर का चिन्ह पार करते समय चिन्ह बदलना न भूलें! 3x = 14 - 7 लिखना गलत है।',
            te: '= గుర్తు దాటినప్పుడు గుర్తు మార్చడం మర్చిపోకూడదు! 3x = 14 - 7 అని రాయడం తప్పు.',
          },
        },
      ],
      commonMistakes: [
        {
          mistake: {
            en: 'Keeping the sign unchanged: 3x - 7 = 14 -> 3x = 14 - 7',
            hi: 'चिन्ह न बदलना: 3x - 7 = 14 -> 3x = 14 - 7',
            te: 'గుర్తు మార్చకుండా రాయడం: 3x - 7 = 14 -> 3x = 14 - 7',
          },
          correction: {
            en: 'When -7 moves to the other side, it MUST invert to +7: 3x = 14 + 7 = 21.',
            hi: 'जब -7 दूसरी तरफ जाएगा, तो यह +7 में बदलेगा: 3x = 14 + 7 = 21।',
            te: '-7 కుడివైపుకు వెళ్ళినప్పుడు తప్పనిసరిగా +7 గా మారాలి: 3x = 14 + 7 = 21.',
          },
          whyItHappens: {
            en: 'Students mechanically copy the number without executing the inverse operation required to maintain equality.',
            hi: 'समानता बनाए रखने के लिए आवश्यक विपरीत संक्रिया को लागू किए बिना संख्या को वैसे ही लिख देना।',
            te: 'సమీకరణ సమానత్వం కాపాడటానికి విలోమ ప్రక్రియ చేయాలనే అవగాహన లోపించడం వల్ల.',
          },
        },
      ],
      visualizerType: 'algebra_balance',
      visualizerConfig: {
        lhs: '3x - 7',
        rhs: '14',
        isolated: '3x = 21',
        solution: 'x = 7',
      },
      summaryPoints: [
        {
          en: '1. Golden Rule of Equations: The equality balance must be maintained at every step.',
          hi: '1. समीकरण का स्वर्णिम नियम: संतुलन हर चरण में बना रहना चाहिए।',
          te: '1. సమీకరణాల స్వర్ణ నియమం: ప్రతి దశలో సమతూకం ఉండాలి.',
        },
        {
          en: '2. Transposition inverts operations: + <-> - and × <-> ÷.',
          hi: '2. पक्षांतरण संक्रिया को उलट देता है: + <-> - तथा × <-> ÷।',
          te: '2. పక్షాంతరీకరణ ప్రక్రియను మారుస్తుంది: + <-> - మరియు × <-> ÷.',
        },
      ],
    },
  ];

  // 5. Adaptive Question Bank (Rich, Board & Class calibrated with trilingual prompts & choices)
  const questions: Question[] = [
    // Q1: Class 8 CBSE / CISCE Math - Fractions (LCM addition)
    {
      id: 'q_cbse8_m_frac_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      difficulty: 'Easy',
      cognitiveSkill: 'Procedural',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 60,
      prompt: {
        en: 'What is the sum of 1/4 and 2/3?',
        hi: '1/4 और 2/3 का योग क्या होगा?',
        te: '1/4 మరియు 2/3 ల మొత్తం ఎంత?',
      },
      choices: [
        {
          id: 'c1',
          text: { en: '11/12', hi: '11/12', te: '11/12' },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: { en: '3/7', hi: '3/7', te: '3/7' },
          misconceptionTag: 'ADDED_DENOMINATORS_DIRECTLY',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: { en: '3/12', hi: '3/12', te: '3/12' },
          misconceptionTag: 'ADDED_NUMERATORS_KEPT_FIRST_DENOMINATOR',
          isCorrect: false,
        },
        {
          id: 'c4',
          text: { en: '8/12', hi: '8/12', te: '8/12' },
          misconceptionTag: 'INCORRECT_LCM_EXPANSION',
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'LCM of 4 and 3 is 12. Convert 1/4 to 3/12 and 2/3 to 8/12. Then 3/12 + 8/12 = 11/12.',
        hi: '4 और 3 का LCM 12 है। 1/4 = 3/12 और 2/3 = 8/12। इसलिए 3/12 + 8/12 = 11/12।',
        te: '4 మరియు 3 ల క.సా.గు 12. 1/4 = 3/12 మరియు 2/3 = 8/12. కాబట్టి 3/12 + 8/12 = 11/12.',
      },
      hint: {
        en: 'Find the Least Common Multiple (LCM) of 4 and 3 before adding the numerators.',
        hi: 'अंशों को जोड़ने से पहले 4 और 3 का लघुत्तम समापवर्त्य (LCM) ज्ञात करें।',
        te: 'లవాలను కూడే ముందు 4 మరియు 3 ల క.సా.గు కనుగొనండి.',
      },
      misconceptionTags: ['ADDED_DENOMINATORS_DIRECTLY', 'MISSING_LCM_PREREQUISITE'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },

    // Q2: Class 8 CBSE / CISCE Math - Fractions (Subtraction with unlike denominators)
    {
      id: 'q_cbse8_m_frac_02',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      difficulty: 'Moderate',
      cognitiveSkill: 'Procedural',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 60,
      prompt: {
        en: 'Evaluate: 5/6 - 3/8',
        hi: 'मान ज्ञात कीजिए: 5/6 - 3/8',
        te: 'విలువను లెక్కించండి: 5/6 - 3/8',
      },
      choices: [
        {
          id: 'c1',
          text: { en: '11/24', hi: '11/24', te: '11/24' },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: { en: '2/2 = 1', hi: '2/2 = 1', te: '2/2 = 1' },
          misconceptionTag: 'SUBTRACTED_DENOMINATORS_DIRECTLY',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: { en: '2/24', hi: '2/24', te: '2/24' },
          misconceptionTag: 'DID_NOT_SCALE_NUMERATORS',
          isCorrect: false,
        },
        {
          id: 'c4',
          text: { en: '2/48', hi: '2/48', te: '2/48' },
          misconceptionTag: 'MULTIPLIED_DENOMINATORS_NO_SCALE',
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'LCM of 6 and 8 is 24. 5/6 = 20/24, and 3/8 = 9/24. 20/24 - 9/24 = 11/24.',
        hi: '6 और 8 का LCM 24 है। 5/6 = 20/24 और 3/8 = 9/24। 20/24 - 9/24 = 11/24।',
        te: '6 మరియు 8 ల క.సా.గు 24. 5/6 = 20/24, మరియు 3/8 = 9/24. 20/24 - 9/24 = 11/24.',
      },
      hint: {
        en: 'What is the smallest number that both 6 and 8 divide into evenly? (Hint: 24).',
        hi: 'वह सबसे छोटी संख्या कौन सी है जिसमें 6 और 8 दोनों का भाग जाता है? (संकेत: 24)।',
        te: '6 మరియు 8 రెండింటిచే భాగించబడే అతిచిన్న సంఖ్య ఏది? (సూచన: 24).',
      },
      misconceptionTags: ['SUBTRACTED_DENOMINATORS_DIRECTLY', 'MISSING_LCM_PREREQUISITE'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },

    // Q3: Class 8 CBSE / TS Math - Linear Equations (Transposition with negative constant)
    {
      id: 'q_cbse8_m_lin_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_linear_eq',
      conceptId: 'con_cbse8_m2_c2',
      difficulty: 'Easy',
      cognitiveSkill: 'Conceptual',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 50,
      prompt: {
        en: 'In the equation 4x - 9 = 15, what is the correct first step when transposing the constant -9?',
        hi: 'समीकरण 4x - 9 = 15 में अचर -9 का पक्षांतरण करने पर पहला सही चरण क्या होगा?',
        te: '4x - 9 = 15 సమీకరణంలో స్థిరరాశి -9 ని పక్షాంతరీకరణ చేసినప్పుడు సరైన మొదటి దశ ఏది?',
      },
      choices: [
        {
          id: 'c1',
          text: { en: '4x = 15 + 9', hi: '4x = 15 + 9', te: '4x = 15 + 9' },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: { en: '4x = 15 - 9', hi: '4x = 15 - 9', te: '4x = 15 - 9' },
          misconceptionTag: 'FAILED_SIGN_REVERSAL_ON_TRANSPOSITION',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: { en: 'x = 15 - 9 / 4', hi: 'x = 15 - 9 / 4', te: 'x = 15 - 9 / 4' },
          misconceptionTag: 'PREMATURE_COEFFICIENT_DIVISION',
          isCorrect: false,
        },
        {
          id: 'c4',
          text: { en: '4x = -15 - 9', hi: '4x = -15 - 9', te: '4x = -15 - 9' },
          misconceptionTag: 'FLIPPED_UNMOVED_TERM_SIGN',
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'When a subtracted term (-9) is transposed across the equal sign, its operation inverts to addition (+9). Therefore, 4x = 15 + 9 = 24.',
        hi: 'जब किसी घटाए गए पद (-9) का पक्षांतरण किया जाता है, तो वह जोड़ (+9) में बदल जाता है। अतः 4x = 15 + 9 = 24।',
        te: '-9 అనే పదం = గుర్తును దాటినప్పుడు అది +9 గా మారుతుంది. కాబట్టి 4x = 15 + 9 = 24.',
      },
      hint: {
        en: 'Remember the golden rule: minus becomes plus when crossing the equals sign.',
        hi: 'याद रखें: बराबर का चिन्ह पार करने पर माइनस (+) प्लस बन जाता है।',
        te: '= గుర్తు దాటినప్పుడు మైనస్ ప్లస్ గా మారుతుంది.',
      },
      misconceptionTags: ['FAILED_SIGN_REVERSAL_ON_TRANSPOSITION'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },

    // Q4: Class 8 TS SSC Physical Science - Metals vs Non-Metals
    {
      id: 'q_ts8_ps_metal_01',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Physical Science',
      chapterId: 'ch_ts8_ps_metals',
      conceptId: 'con_ts8_ps_c2',
      difficulty: 'Moderate',
      cognitiveSkill: 'Conceptual',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 60,
      prompt: {
        en: 'A student burns magnesium ribbon in air and dissolves the resulting ash in water. What effect will this solution have on litmus paper?',
        hi: 'एक छात्र मैग्नीशियम रिबन को हवा में जलाता है और राख को पानी में घोलता है। यह घोल लिटमस पेपर पर क्या प्रभाव डालेगा?',
        te: 'ఒక విద్యార్థి మెగ్నీషియం రిబ్బన్‌ను గాలిలో మండించి, బూడిదను నీటిలో కరిగించాడు. ఈ ద్రావణం లిట్మస్ కాగితంపై చూపే ప్రభావం ఏమిటి?',
      },
      choices: [
        {
          id: 'c1',
          text: {
            en: 'It turns Red litmus paper Blue (because magnesium oxide is basic)',
            hi: 'यह लाल लिटमस को नीला कर देता है (क्योंकि मैग्नीशियम ऑक्साइड क्षारीय है)',
            te: 'ఇది ఎరుపు లిట్మస్‌ను నీలంగా మారుస్తుంది (ఎందుకంటే మెగ్నీషియం ఆక్సైడ్ క్షార స్వభావం కలది)',
          },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: {
            en: 'It turns Blue litmus paper Red (because magnesium oxide is acidic)',
            hi: 'यह नीले लिटमस को लाल कर देता है (क्योंकि मैग्नीशियम ऑक्साइड अम्लीय है)',
            te: 'ఇది నీలి లిట్మస్‌ను ఎరుపుగా మారుస్తుంది (ఎందుకంటే మెగ్నీషియం ఆక్సైడ్ ఆమ్ల స్వభావం కలది)',
          },
          misconceptionTag: 'CONFUSED_METALLIC_OXIDE_ACIDIC_NATURE',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: {
            en: 'No change on any litmus paper (neutral)',
            hi: 'किसी भी लिटमस पेपर पर कोई बदलाव नहीं (उदासीन)',
            te: 'ఎలాంటి రంగు మార్పు ఉండదు (తటస్థం)',
          },
          misconceptionTag: 'BELIEVED_ASH_IS_INERT',
          isCorrect: false,
        },
        {
          id: 'c4',
          text: {
            en: 'It bleaches the litmus paper white',
            hi: 'यह लिटमस पेपर को सफेद विरंजित कर देता है',
            te: 'ఇది లిట్మస్ కాగితాన్ని తెల్లగా మారుస్తుంది',
          },
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'Metals react with oxygen to form metallic oxides (2Mg + O2 -> 2MgO). Metallic oxides dissolve in water to form hydroxides (Mg(OH)2), which are basic and turn red litmus blue.',
        hi: 'धातुएं ऑक्सीजन से क्रिया करके धात्विक ऑक्साइड बनाती हैं जो क्षारीय प्रकृति के होते हैं और लाल लिटमस को नीला कर देते हैं।',
        te: 'లోహాలు ఆక్సిజన్‌తో చర్య జరిపి క్షార స్వభావంగల లోహ ఆక్సైడ్లను ఏర్పరుస్తాయి. ఇవి ఎరుపు లిట్మస్‌ను నీలంగా మార్చుతాయి.',
      },
      hint: {
        en: 'Are metal oxides generally acidic or basic in nature?',
        hi: 'क्या धातु के ऑक्साइड आमतौर पर अम्लीय होते हैं या क्षारीय?',
        te: 'లోహ ఆక్సైడ్లు సాధారణంగా ఆమ్లాలా లేక క్షారాలా?',
      },
      misconceptionTags: ['CONFUSED_METALLIC_OXIDE_ACIDIC_NATURE'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },

    // Q5: Class 8 TS SSC Biological Science - Cell
    {
      id: 'q_ts8_bs_cell_01',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Biological Science',
      chapterId: 'ch_ts8_bs_cell',
      conceptId: 'con_ts8_bs_c1',
      difficulty: 'Easy',
      cognitiveSkill: 'Foundational',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 45,
      prompt: {
        en: 'Which of the following structures is found ONLY in plant cells and NOT in human cheek cells?',
        hi: 'निम्नलिखित में से कौन सी संरचना केवल पादप कोशिकाओं में पाई जाती है, मानव गाल की कोशिकाओं में नहीं?',
        te: 'కింది వాటిలో ఏ నిర్మాణం కేవలం వృక్ష కణాలలో మాత్రమే ఉండి, మానవ బుగ్గ కణాలలో ఉండదు?',
      },
      choices: [
        {
          id: 'c1',
          text: {
            en: 'Rigid Cellulose Cell Wall',
            hi: 'दृढ़ सेलूलोज़ कोशिका भित्ति (Cell Wall)',
            te: 'దృఢమైన సెల్యులోజ్ కణకవచం (Cell Wall)',
          },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: {
            en: 'Cell Membrane (Plasma Membrane)',
            hi: 'कोशिका झिल्ली (प्लाज्मा झिल्ली)',
            te: 'కణ త్వచం (ప్లాస్మా పొర)',
          },
          misconceptionTag: 'CONFUSED_MEMBRANE_WITH_WALL',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: {
            en: 'Nucleus containing chromosomes',
            hi: 'गुणसूत्र युक्त केंद्रक',
            te: 'కేంద్రకం (Nucleus)',
          },
          isCorrect: false,
        },
        {
          id: 'c4',
          text: {
            en: 'Cytoplasm fluid',
            hi: 'कोशिकाद्रव्य',
            te: 'కణద్రవ్యం',
          },
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'Plant cells possess an outer rigid cell wall made of cellulose for structural support against osmotic pressure. Animal cells only have a cell membrane.',
        hi: 'पादप कोशिकाओं में कोशिका झिल्ली के बाहर सेलूलोज़ से बनी एक कठोर कोशिका भित्ति होती है। जंतु कोशिकाओं में कोशिका भित्ति अनुपस्थित होती है।',
        te: 'వృక్ష కణాలకు ఆకారాన్ని, రక్షణను ఇవ్వడానికి కణత్వచం వెలుపల సెల్యులోజ్‌తో కూడిన కణకవచం ఉంటుంది. జంతు కణాలలో కణకవచం ఉండదు.',
      },
      hint: {
        en: 'Think of what provides trees and plants their stiff, non-collapsing stems without bones.',
        hi: 'सोचें कि बिना हड्डियों के पौधों को उनकी कठोर संरचना कौन प्रदान करता है।',
        te: 'ఎముకలు లేకపోయినా మొక్కలకు దృఢత్వాన్ని ఇచ్చే బాహ్య పొర ఏది?',
      },
      misconceptionTags: ['CONFUSED_MEMBRANE_WITH_WALL'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },

    // Q6: Class 8 CISCE Computer Studies - Flowcharts
    {
      id: 'q_cisce8_cs_algo_01',
      board: 'CISCE',
      classLevel: '8',
      subject: 'Computer Studies',
      chapterId: 'ch_cisce8_comp_algo',
      conceptId: 'con_cisce8_cs_c1',
      difficulty: 'Easy',
      cognitiveSkill: 'Conceptual',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 45,
      prompt: {
        en: 'In a flowchart, which standard geometric symbol is used for checking conditions such as "Is Age >= 18"?',
        hi: 'फ़्लोचार्ट में, "क्या आयु >= 18 है" जैसी शर्तों की जाँच के लिए किस ज्यामितीय प्रतीक का उपयोग किया जाता है?',
        te: 'ఫ్లోచార్ట్‌లో, "వయస్సు >= 18 నా?" వంటి నిబంధనలను పరీక్షించడానికి ఏ రేఖాగణిత చిహ్నాన్ని ఉపయోగిస్తారు?',
      },
      choices: [
        {
          id: 'c1',
          text: {
            en: 'Diamond (Rhombus) symbol',
            hi: 'डायमंड (समचतुर्भुज) प्रतीक',
            te: 'డైమండ్ (రాంబస్) చిహ్నం',
          },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: {
            en: 'Rectangle symbol',
            hi: 'आयत प्रतीक (प्रक्रिया)',
            te: 'దీర్ఘచతురస్ర చిహ్నం (ప్రక్రియ)',
          },
          misconceptionTag: 'CONFUSED_PROCESS_WITH_DECISION',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: {
            en: 'Oval / Rounded rectangle',
            hi: 'अंडाकार (प्रारंभ/समाप्त)',
            te: 'ఓవల్ (ప్రారంభం/ముగింపు)',
          },
          misconceptionTag: 'CONFUSED_TERMINATOR_WITH_DECISION',
          isCorrect: false,
        },
        {
          id: 'c4',
          text: {
            en: 'Parallelogram',
            hi: 'समानांतर चतुर्भुज (इनपुट/आउटपुट)',
            te: 'సమాంతర చతుర్భుజం (ఇన్‌పుట్/అవుట్‌పుట్)',
          },
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'A diamond (rhombus) represents decision-making in flowcharts, with one entry path and two exit branches (Yes/No or True/False).',
        hi: 'डायमंड का उपयोग निर्णय लेने (Decisions) के लिए किया जाता है, जिसके दो निकास (हाँ/नहीं) होते हैं।',
        te: 'ఫ్లోచార్ట్‌లో నిర్ణయాలు (Decisions) తీసుకోవడానికి డైమండ్ చిహ్నాన్ని ఉపయోగిస్తారు, దీనికి అవును/కాదు అనే రెండు మార్గాలు ఉంటాయి.',
      },
      hint: {
        en: 'It has two outgoing branches corresponding to Yes and No.',
        hi: 'इसके दो निकास पथ होते हैं: हाँ और नहीं।',
        te: 'దీనికి అవును మరియు కాదు అనే రెండు నిష్క్రమణ మార్గాలు ఉంటాయి.',
      },
      misconceptionTags: ['CONFUSED_PROCESS_WITH_DECISION'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },

    // Q7: Fresh Retest Question 1 for Fractions (Class 8)
    {
      id: 'q_cbse8_retest_frac_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      difficulty: 'Moderate',
      cognitiveSkill: 'Procedural',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 65,
      prompt: {
        en: 'A chef used 3/5 kg of flour in the morning and 1/6 kg in the evening. How much flour was used in total?',
        hi: 'एक रसोइए ने सुबह 3/5 किग्रा और शाम को 1/6 किग्रा आटा इस्तेमाल किया। कुल कितना आटा इस्तेमाल हुआ?',
        te: 'ఒక వంటమనిషి ఉదయం 3/5 కిలోల పిండిని, సాయంత్రం 1/6 కిలోల పిండిని ఉపయోగించాడు. మొత్తం ఎంత పిండి వాడబడింది?',
      },
      choices: [
        {
          id: 'c1',
          text: { en: '23/30 kg', hi: '23/30 किग्रा', te: '23/30 కిలోలు' },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: { en: '4/11 kg', hi: '4/11 किग्रा', te: '4/11 కిలోలు' },
          misconceptionTag: 'ADDED_DENOMINATORS_DIRECTLY',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: { en: '18/30 kg', hi: '18/30 किग्रा', te: '18/30 కిలోలు' },
          isCorrect: false,
        },
        {
          id: 'c4',
          text: { en: '4/30 kg', hi: '4/30 किग्रा', te: '4/30 కిలోలు' },
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'LCM of 5 and 6 is 30. 3/5 = 18/30, and 1/6 = 5/30. 18/30 + 5/30 = 23/30 kg.',
        hi: '5 और 6 का LCM 30 है। 3/5 = 18/30 तथा 1/6 = 5/30। कुल = 18/30 + 5/30 = 23/30 किग्रा।',
        te: '5 మరియు 6 ల క.సా.గు 30. 3/5 = 18/30 మరియు 1/6 = 5/30. మొత్తం = 23/30 కిలోలు.',
      },
      hint: {
        en: 'Find the LCM of 5 and 6, scale both fractions, then add numerators.',
        hi: '5 और 6 का LCM निकालें, तुल्य भिन्न बनाएं, फिर अंशों को जोड़ें।',
        te: '5 మరియు 6 ల క.సా.గు 30 గా సమాన భిన్నాలుగా మార్చి కూడండి.',
      },
      misconceptionTags: ['ADDED_DENOMINATORS_DIRECTLY'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },

    // Q8: Fresh Retest Question 2 for Linear Equations (Class 8)
    {
      id: 'q_cbse8_retest_lin_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_linear_eq',
      conceptId: 'con_cbse8_m2_c2',
      difficulty: 'Moderate',
      cognitiveSkill: 'Procedural',
      questionType: 'mcq',
      expectedSolvingTimeSeconds: 55,
      prompt: {
        en: 'Solve for y: 5y - 8 = 27',
        hi: 'y का मान ज्ञात कीजिए: 5y - 8 = 27',
        te: 'y విలువ కనుగొనండి: 5y - 8 = 27',
      },
      choices: [
        {
          id: 'c1',
          text: { en: 'y = 7', hi: 'y = 7', te: 'y = 7' },
          isCorrect: true,
        },
        {
          id: 'c2',
          text: { en: 'y = 3.8', hi: 'y = 3.8', te: 'y = 3.8' },
          misconceptionTag: 'FAILED_SIGN_REVERSAL_ON_TRANSPOSITION',
          isCorrect: false,
        },
        {
          id: 'c3',
          text: { en: 'y = 5', hi: 'y = 5', te: 'y = 5' },
          isCorrect: false,
        },
        {
          id: 'c4',
          text: { en: 'y = 35', hi: 'y = 35', te: 'y = 35' },
          isCorrect: false,
        },
      ],
      explanation: {
        en: 'Transpose -8 to the RHS: 5y = 27 + 8 = 35. Divide by 5: y = 35 / 5 = 7.',
        hi: '-8 का पक्षांतरण करने पर: 5y = 27 + 8 = 35। 5 से भाग देने पर: y = 35 / 5 = 7।',
        te: '-8 ని కుడివైపుకు తరలిస్తే: 5y = 27 + 8 = 35. 5 తో భాగిస్తే: y = 35 / 5 = 7.',
      },
      hint: {
        en: 'Step 1: 5y = 27 + 8. Step 2: y = 35 / 5.',
        hi: 'चरण 1: 5y = 27 + 8. चरण 2: y = 35 / 5.',
        te: 'దశ 1: 5y = 27 + 8. దశ 2: y = 35 / 5.',
      },
      misconceptionTags: ['FAILED_SIGN_REVERSAL_ON_TRANSPOSITION'],
      isVerified: true,
      approvalStatus: 'Published',
      source: 'Official Curriculum',
    },
  ];

  // 6. Pre-configured Diagnostic Evidence (for Demo Students A & B & C)
  const diagnosticEvidences: DiagnosticEvidence[] = [
    {
      id: 'diag_rahul_01',
      attemptId: 'att_rahul_initial',
      studentId: 'stu_cbse8_rahul',
      conceptId: 'con_cbse8_m1_c3',
      chapterId: 'ch_cbse8_math_fractions',
      subject: 'Mathematics',
      board: 'CBSE',
      classLevel: '8',
      primaryObservedDifficulty: 'Direct Denominator Addition (Missing LCM Prerequisite)',
      detectedErrorType: 'PREREQUISITE_GAP',
      errorEvidence: [
        'Attempted 1/4 + 2/3 and selected 3/7 (numerator 1+2=3, denominator 4+3=7).',
        'In follow-up diagnostic probe: When asked for LCM of 4 and 6, could not calculate common multiples.',
        'Independent diagnostic verification confirms lack of Class 6 LCM mastery.',
      ],
      followUpQuestionsAttempted: [
        {
          questionPrompt: 'What is the least common multiple of 4 and 6?',
          studentAnswer: '10',
          correctAnswer: '12',
          testedSubSkill: 'Class 6 LCM & Multiples',
          isCorrect: false,
        },
        {
          questionPrompt: 'Are 1/2 and 2/4 equivalent fractions?',
          studentAnswer: 'Yes',
          correctAnswer: 'Yes',
          testedSubSkill: 'Visual Fraction Equivalence',
          isCorrect: true,
        },
      ],
      concludedStatus: 'PREREQUISITE_GAP',
      diagnosticExplanation: 'Student understands parts-of-a-whole visually, but lacks procedural mastery of calculating Least Common Multiples (LCM) needed to align fraction scales.',
      recommendedRecoveryType: 'Prerequisite Support',
      recommendedActivityId: 'rec_frac_lcm_bridge',
      createdAt: '2026-10-25T11:20:00Z',
    },
    {
      id: 'diag_sravani_01',
      attemptId: 'att_sravani_initial',
      studentId: 'stu_ts8_sravani',
      conceptId: 'con_cbse8_m2_c2',
      chapterId: 'ch_ts8_math_linear_eq',
      subject: 'Mathematics',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      primaryObservedDifficulty: 'Sign Inversion Failure during Constant Transposition',
      detectedErrorType: 'CONCEPTUAL_MISCONCEPTION',
      errorEvidence: [
        'When solving 4x - 9 = 15, selected 4x = 15 - 9, failing to flip the negative sign to positive.',
        'Follow-up check confirmed: Student treats the equal sign as a wall where terms pass through without inverting the operation.',
      ],
      followUpQuestionsAttempted: [
        {
          questionPrompt: 'If x - 3 = 10, does x = 10 - 3 or x = 10 + 3?',
          studentAnswer: 'x = 10 - 3',
          correctAnswer: 'x = 10 + 3',
          testedSubSkill: 'Inverse operations on balance scales',
          isCorrect: false,
        },
      ],
      concludedStatus: 'POSSIBLE_MISCONCEPTION',
      diagnosticExplanation: 'Conceptual misconception regarding equality invariance. Student treats transposition as copying across the equal sign rather than applying inverse operations.',
      recommendedRecoveryType: 'Conceptual Understanding',
      recommendedActivityId: 'rec_linear_balance_remedy',
      createdAt: '2026-10-26T14:30:00Z',
    },
  ];

  // 7. Initial Assessment Attempts
  const assessmentAttempts: AssessmentAttempt[] = [
    {
      id: 'att_rahul_initial',
      studentId: 'stu_cbse8_rahul',
      assessmentType: 'practice',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      questionIds: ['q_cbse8_m_frac_01', 'q_cbse8_m_frac_02'],
      studentAnswers: {
        q_cbse8_m_frac_01: 'c2', // Incorrect (3/7)
        q_cbse8_m_frac_02: 'c2', // Incorrect (2/2)
      },
      isCorrectMap: {
        q_cbse8_m_frac_01: false,
        q_cbse8_m_frac_02: false,
      },
      score: 0,
      totalMarks: 2,
      timeSpentSeconds: 145,
      hintsUsedCount: 1,
      submittedAt: '2026-10-25T11:15:00Z',
      needsDiagnosticFollowup: true,
    },
    {
      id: 'att_sravani_initial',
      studentId: 'stu_ts8_sravani',
      assessmentType: 'practice',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_ts8_math_linear_eq',
      conceptId: 'con_cbse8_m2_c2',
      questionIds: ['q_cbse8_m_lin_01'],
      studentAnswers: {
        q_cbse8_m_lin_01: 'c2', // Incorrect (4x = 15 - 9)
      },
      isCorrectMap: {
        q_cbse8_m_lin_01: false,
      },
      score: 0,
      totalMarks: 1,
      timeSpentSeconds: 68,
      hintsUsedCount: 0,
      submittedAt: '2026-10-26T14:25:00Z',
      needsDiagnosticFollowup: true,
    },
  ];

  // 8. Smart Recovery Activities (Full Functional Remediation Engines)
  const recoveryActivities: SmartRecoveryActivity[] = [
    {
      id: 'rec_frac_lcm_bridge',
      conceptId: 'con_cbse8_m1_c3',
      chapterId: 'ch_cbse8_math_fractions',
      subject: 'Mathematics',
      board: 'CBSE',
      classLevel: '8',
      title: 'Prerequisite Bridge: Mastering LCM & Common Denominators',
      recoveryType: 'Prerequisite Support',
      learningPathway: [
        'Class 6 Prerequisite Bridge: Multiples & LCM Visualization',
        'Equalizing Fraction Slices: The Common Denominator Principle',
        'Guided 3-Step Solution with Visual Number Bar',
        'Scaffolded Practice with Instant Checking',
        'Unlock Fresh Retest upon meeting criteria',
      ],
      remediationExplanation: {
        en: 'Think of fractions as slices of a cake. 1/4 means the cake is divided into 4 large slices. 1/3 means a cake is divided into 3 even larger slices. You cannot say 1 slice + 1 slice = 2 slices of a cake cut into 7 slices! That would make the slices smaller! Instead, we slice both cakes into 12 equal tiny slices (the LCM). Now 1/4 is 3 tiny slices and 1/3 is 4 tiny slices. 3 + 4 = 7 tiny slices out of 12 (7/12).',
        hi: 'भिन्नों को केक के टुकड़ों की तरह समझें। 1/4 का मतलब है 4 बड़े टुकड़े। 1/3 का मतलब 3 और बड़े टुकड़े। आप यह नहीं कह सकते कि 1 टुकड़ा + 1 टुकड़ा = 7 टुकड़ों में से 2 टुकड़े! इसके बजाय, दोनों को 12 बराबर छोटे टुकड़ों (LCM) में काटें। अब 1/4 = 3/12 और 1/3 = 4/12। कुल 7/12 टुकड़े।',
        te: 'భిన్నాలను కేక్ ముక్కల వలె ఊహించండి. 1/4 అంటే కేక్‌ను 4 పెద్ద ముక్కలుగా, 1/3 అంటే 3 మరింత పెద్ద ముక్కలుగా కోయడం. వీటిని నేరుగా 2/7 అని కూడకూడదు! రెండింటిని ఉమ్మడి కొలత అయిన 12 సమాన భాగాలు (క.సా.గు) గా మార్చాలి. అప్పుడు 1/4 = 3/12 మరియు 1/3 = 4/12 అవుతాయి. మొత్తం = 7/12.',
      },
      prerequisiteBridge: {
        prerequisiteTitle: 'Finding LCM by Listing Multiples (Class 6)',
        prerequisiteClass: '6',
        bridgeExplanation: {
          en: 'Multiples of 3: 3, 6, 9, 12, 15... Multiples of 4: 4, 8, 12, 16... The first number they both share is 12! That is your Least Common Multiple.',
          hi: '3 के गुणज: 3, 6, 9, 12, 15... 4 के गुणज: 4, 8, 12, 16... दोनों में पहली समान संख्या 12 है! यही आपका LCM है।',
          te: '3 గుణిజాలు: 3, 6, 9, 12, 15... 4 గుణిజాలు: 4, 8, 12, 16... రెండింటిలోనూ ఉమ్మడిగా ఉన్న మొదటి సంఖ్య 12! ఇదే మీ క.సా.గు.',
        },
      },
      guidedPracticeQuestions: [
        {
          id: 'rec_q_frac_01',
          prompt: {
            en: 'Step 1 Check: What is the LCM of the denominators for 1/6 + 2/9?',
            hi: 'चरण 1 जाँच: 1/6 + 2/9 के हरों का LCM क्या है?',
            te: 'దశ 1 తనిఖీ: 1/6 + 2/9 భిన్నాల హారాల క.సా.గు ఎంత?',
          },
          scaffoldHint: {
            en: 'Multiples of 6: 6, 12, 18, 24... Multiples of 9: 9, 18, 27... What is the first match?',
            hi: '6 के गुणज: 6, 12, 18... 9 के गुणज: 9, 18... पहला मेल क्या है?',
            te: '6 మరియు 9 ల ఉమ్మడి గుణిజాలలో మొదటిది ఏది?',
          },
          stepClues: [
            { en: 'Multiples of 6: 6, 12, 18, 24', hi: '6 के गुणज: 6, 12, 18', te: '6 గుణిజాలు: 6, 12, 18' },
            { en: 'Multiples of 9: 9, 18, 27', hi: '9 के गुणज: 9, 18', te: '9 గుణిజాలు: 9, 18' },
          ],
          choices: [
            { id: 'opt1', text: { en: '18', hi: '18', te: '18' }, isCorrect: true },
            { id: 'opt2', text: { en: '15', hi: '15', te: '15' }, isCorrect: false },
            { id: 'opt3', text: { en: '54', hi: '54', te: '54' }, isCorrect: false },
          ],
          correctExplanation: {
            en: 'Correct! 18 is the smallest multiple shared by 6 and 9.',
            hi: 'बिल्कुल सही! 18 वह सबसे छोटा गुणज है जो 6 और 9 दोनों में है।',
            te: 'సరైనది! 6 మరియు 9 ల కనిష్ట సామాన్య గుణిజం 18.',
          },
        },
        {
          id: 'rec_q_frac_02',
          prompt: {
            en: 'Step 2: Convert 1/6 into an equivalent fraction with denominator 18:',
            hi: 'चरण 2: 1/6 को 18 हर वाले तुल्य भिन्न में बदलें:',
            te: 'దశ 2: 1/6 ను హారం 18 ఉండే సమాన భిన్నంగా మార్చండి:',
          },
          scaffoldHint: {
            en: 'Multiply both numerator and denominator by 3 (since 6 × 3 = 18).',
            hi: 'अंश और हर दोनों को 3 से गुणा करें।',
            te: 'లవం మరియు హారాన్ని 3 తో గుణించండి (ఎందుకంటే 6 × 3 = 18).',
          },
          stepClues: [{ en: '(1 × 3) / (6 × 3) = ?', hi: '(1 × 3) / (6 × 3) = ?', te: '(1 × 3) / (6 × 3) = ?' }],
          choices: [
            { id: 'opt1', text: { en: '3/18', hi: '3/18', te: '3/18' }, isCorrect: true },
            { id: 'opt2', text: { en: '1/18', hi: '1/18', te: '1/18' }, isCorrect: false },
          ],
          correctExplanation: {
            en: 'Spot on! (1×3)/(6×3) = 3/18.',
            hi: 'उत्तम! (1×3)/(6×3) = 3/18।',
            te: 'అద్భుతం! (1×3)/(6×3) = 3/18.',
          },
        },
      ],
      completionCriteria: {
        minQuestionsRequired: 2,
        minCorrectRequired: 2,
        readPrerequisiteRequired: true,
      },
    },

    // Recovery Activity: Linear Equations Transposition
    {
      id: 'rec_linear_balance_remedy',
      conceptId: 'con_cbse8_m2_c2',
      chapterId: 'ch_cbse8_math_linear_eq',
      subject: 'Mathematics',
      board: 'CBSE',
      classLevel: '8',
      title: 'Conceptual Recovery: The Balanced Scale & Sign Transposition',
      recoveryType: 'Conceptual Understanding',
      learningPathway: [
        'Balance Scale Analogy: Adding weights to cancel negatives',
        'The Transposition Shortcut: Why Signs Invert',
        'Interactive Step-by-Step Problem Solver',
        'Scaffolded Self-Check Questions',
        'Retest Eligibility Verification',
      ],
      remediationExplanation: {
        en: 'Imagine a physical balance scale. The left pan has "3x - 7" and the right pan has "14". To eliminate the "-7" debt from the left pan, you must ADD +7 to it. But to keep the scale balanced, you MUST also ADD +7 to the right pan! Result: 3x = 14 + 7. The shortcut rule is: crossing the equal sign inverts the sign.',
        hi: 'एक तराजू की कल्पना करें। बाएं पलड़े पर "3x - 7" है और दाएं पर "14"। बाएं से -7 हटाने के लिए आपको उसमें +7 जोड़ना होगा। तराजू को संतुलित रखने के लिए दाएं में भी +7 जोड़ना होगा! परिणाम: 3x = 14 + 7। पक्षांतरण का नियम यही है।',
        te: 'తక్కెడను ఊహించండి. ఎడమవైపు "3x - 7", కుడివైపు "14" ఉన్నాయి. ఎడమవైపు ఉన్న -7 తొలగించడానికి +7 కలపాలి. తూకం సమానంగా ఉండాలంటే కుడివైపు కూడా +7 కలపాలి! ఫలితం: 3x = 14 + 7.',
      },
      guidedPracticeQuestions: [
        {
          id: 'rec_q_lin_01',
          prompt: {
            en: 'In 2x - 5 = 11, what does the equation become when -5 is moved to the right side?',
            hi: '2x - 5 = 11 में, जब -5 को दाईं ओर ले जाया जाता है, तो समीकरण क्या बनता है?',
            te: '2x - 5 = 11 లో, -5 కుడివైపుకు వెళ్ళినప్పుడు సమీకరణం ఎలా మారుతుంది?',
          },
          scaffoldHint: {
            en: 'Remember: subtracting 5 becomes adding 5 on the other side.',
            hi: 'याद रखें: घटाना दूसरी तरफ जाकर जोड़ बन जाता है।',
            te: 'గుర్తుంచుకోండి: మైనస్ అటువైపు వెళ్తే ప్లస్ అవుతుంది.',
          },
          stepClues: [{ en: '2x = 11 + 5 = 16', hi: '2x = 11 + 5 = 16', te: '2x = 11 + 5 = 16' }],
          choices: [
            { id: 'opt1', text: { en: '2x = 11 + 5 = 16', hi: '2x = 11 + 5 = 16', te: '2x = 11 + 5 = 16' }, isCorrect: true },
            { id: 'opt2', text: { en: '2x = 11 - 5 = 6', hi: '2x = 11 - 5 = 6', te: '2x = 11 - 5 = 6' }, isCorrect: false },
          ],
          correctExplanation: {
            en: 'Correct! Minus 5 inverts to plus 5.',
            hi: 'सही! -5 बदलकर +5 हो जाता है।',
            te: 'సరైనది! -5 అటువైపు వెళ్లి +5 అవుతుంది.',
          },
        },
      ],
      completionCriteria: {
        minQuestionsRequired: 1,
        minCorrectRequired: 1,
        readPrerequisiteRequired: false,
      },
    },
    ...authenticRecoveryActivities,
  ];

  // 9. Initial Recovery Attempts
  const recoveryAttempts: RecoveryAttempt[] = [];

  // 10. Initial Retest Records (Empty initially for demo students who will perform Retest live in Hackathon flow)
  const retestRecords: RetestRecord[] = [];

  // 11. Initial Instructional Groups (Data-Driven from Actual Evidence)
  const instructionalGroups: InstructionalGroup[] = [
    {
      id: 'grp_cbse8_math_fractions',
      board: 'CBSE',
      classLevel: '8',
      section: 'A',
      subject: 'Mathematics',
      conceptId: 'con_cbse8_m1_c3',
      supportStudentIds: ['stu_cbse8_rahul'], // Diagnosed prerequisite gap
      practiceStudentIds: ['stu_cisce8_aravind'], // Slips in multi-step reduction
      challengeStudentIds: ['stu_cbse8_sneha'], // Strong mastery
      lastUpdated: '2026-10-28T09:00:00Z',
      overrides: {},
    },
    {
      id: 'grp_ts8_math_linear',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      section: 'A',
      subject: 'Mathematics',
      conceptId: 'con_cbse8_m2_c2',
      supportStudentIds: ['stu_ts8_sravani'], // Diagnosed sign misconception
      practiceStudentIds: ['stu_ts8_venkat'],
      challengeStudentIds: ['stu_ts10_sai'],
      lastUpdated: '2026-10-28T09:00:00Z',
      overrides: {},
    },
  ];

  // 12. Next 10 Minutes Planner (Evidence-Based Teaching Interventions)
  const interventionPlans: InterventionPlan[] = [
    {
      id: 'plan_cbse8_m1_c3_int',
      board: 'CBSE',
      classLevel: '8',
      section: 'A',
      subject: 'Mathematics',
      targetConceptId: 'con_cbse8_m1_c3',
      targetConceptTitle: 'Addition of Unlike Fractions (LCM Alignment)',
      targetStudents: [
        {
          id: 'stu_cbse8_rahul',
          name: 'Rahul Sharma',
          observedGap: 'Direct denominator addition (1/4 + 2/3 -> 3/7) stemming from Class 6 LCM deficiency.',
        },
      ],
      suggestedActivity: '10-Minute Number-Bar Slice Demo & LCM Drill',
      instructions: '1. Distribute fraction strip cut-outs showing 1/4 and 1/3.\n2. Ask the student to align them against a 12-subdivision strip.\n3. Have student physically count 3 units + 8 units = 11 units out of 12.\n4. Complete 2 quick exit-ticket additions.',
      materialsNeeded: 'ClassPulse Visual Fraction Strips & LCM Quick Reference Sheet',
      durationMinutes: 10,
      learningObjective: 'Eliminate direct denominator addition by verifying common slice units before arithmetic.',
      followUpCheck: 'Assign ClassPulse Fresh Retest #1 on Smart Recovery portal.',
      status: 'recommended',
      createdAt: '2026-10-28T09:15:00Z',
    },
    {
      id: 'plan_ts8_m2_c2_int',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      section: 'A',
      subject: 'Mathematics',
      targetConceptId: 'con_cbse8_m2_c2',
      targetConceptTitle: 'Transposition Sign Inversion in Linear Equations',
      targetStudents: [
        {
          id: 'stu_ts8_sravani',
          name: 'Sravani Reddy',
          observedGap: 'Leaves sign unchanged when moving -9 across = (wrote 4x = 15 - 9).',
        },
      ],
      suggestedActivity: 'Physical Pan Balance Simulation with + / - Tokens',
      instructions: '1. Place 4x and 9 red negative counters on the left pan.\n2. Place 15 green positive counters on the right pan.\n3. Demonstrate that adding 9 green positive counters to BOTH sides cancels the left negatives, making the right side 15 + 9 = 24.',
      materialsNeeded: 'Two-pan scale or interactive digital balance board.',
      durationMinutes: 10,
      learningObjective: 'Internalize that moving across the equals sign is mathematically equivalent to adding/subtracting from both sides.',
      followUpCheck: 'Administer Retest Question: 5y - 8 = 27.',
      status: 'recommended',
      createdAt: '2026-10-28T09:30:00Z',
    },
  ];

  // 13. Assignments
  const assignments: Assignment[] = [
    {
      id: 'asg_cbse8_frac_01',
      title: 'Weekly Mastery: Rational Numbers & Fraction Arithmetic',
      board: 'CBSE',
      classLevel: '8',
      section: 'A',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      questionIds: ['q_cbse8_m_frac_01', 'q_cbse8_m_frac_02'],
      assignedStudentIds: [],
      instructions: 'Solve all questions step by step. Use scratchpad for finding LCMs. Do not guess answers.',
      dueDate: '2026-11-05',
      createdAt: '2026-10-24T08:00:00Z',
      submissionsCount: 1,
    },
  ];

  const assignmentSubmissions: AssignmentSubmission[] = [
    {
      id: 'sub_rahul_01',
      assignmentId: 'asg_cbse8_frac_01',
      studentId: 'stu_cbse8_rahul',
      answers: {
        q_cbse8_m_frac_01: 'c2',
        q_cbse8_m_frac_02: 'c2',
      },
      score: 0,
      totalMarks: 2,
      feedback: 'Evidence of LCM prerequisite gap detected. Please complete recommended Smart Recovery activity.',
      submittedAt: '2026-10-25T11:15:00Z',
    },
  ];

  // 14. Resource Library
  const resources: ResourceItem[] = [
    {
      id: 'res_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      title: 'Visual Guide: Mastering Fractions & LCM Common Denominators',
      type: 'notes',
      description: 'Comprehensive NCERT aligned study notes illustrating slice equivalence, lowest terms reduction, and step-by-step LCM addition.',
      language: 'en',
      downloadable: true,
      durationOrPages: '4 Pages PDF Summary',
    },
    {
      id: 'res_02',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      title: 'भिन्न और परिमेय संख्याएं: संक्षेप नोट्स (Hindi Notes)',
      type: 'notes',
      description: 'एनसीईआरटी कक्षा 8 गणित के लिए स्पष्ट सचित्र नोट्स और हल किए गए उदाहरण।',
      language: 'hi',
      downloadable: true,
      durationOrPages: '4 पृष्ठ',
    },
    {
      id: 'res_03',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_ts8_math_linear_eq',
      title: 'ఏకచరరాశిలో రేఖీయ సమీకరణాలు (Telugu Quick Revision)',
      type: 'revision_sheet',
      description: 'తెలంగాణ స్టేట్ ఎస్సీఈఆర్టీ 8వ తరగతి గణితం పక్షాంతరీకరణ మరియు సాధన నియమాలు.',
      language: 'te',
      downloadable: true,
      durationOrPages: '3 పేజీలు',
    },
    {
      id: 'res_04',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Science',
      chapterId: 'ch_cbse8_sci_force',
      title: 'Force & Pressure: Concept Mindmap and Practice Worksheet',
      type: 'worksheet',
      description: 'Worked numerical exercises for Pressure = Force/Area, atmospheric pressure barometers, and contact forces.',
      language: 'en',
      downloadable: true,
      durationOrPages: '6 Questions Practice Sheet',
    },
    {
      id: 'res_05',
      board: 'TELANGANA_SSC',
      classLevel: '8',
      subject: 'Biological Science',
      chapterId: 'ch_ts8_bs_cell',
      title: 'Plant vs Animal Cell: High-Resolution Labeled Diagram Guide',
      type: 'diagram',
      description: 'Detailed microscopic view labeling cell wall, plasma membrane, chloroplast, mitochondria, and nucleus.',
      language: 'en',
      downloadable: true,
      durationOrPages: 'Full Color Poster Sheet',
    },
  ];

  const initialTimingRecords: QuestionTimingRecord[] = [
    {
      id: 'tim_seed_01',
      studentId: 'usr_stu_cbse8_01',
      sessionId: 'sess_seed_01',
      questionId: 'q_cbse8_m1_c3_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      questionDifficulty: 'Moderate',
      startTimeMs: Date.now() - 3600000,
      submitTimeMs: Date.now() - 3600000 + 35000,
      activeSeconds: 35,
      expectedSolvingTimeSeconds: 60,
      isCorrect: false,
      chosenAnswer: '5/10 (Direct Denominators Addition)',
      correctAnswer: '5/12',
      attemptsCount: 1,
      hintsUsedCount: 0,
      wasAnswerChanged: false,
      misconceptionTag: 'ADDED_DENOMINATORS_DIRECTLY',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'tim_seed_02',
      studentId: 'usr_stu_cbse8_02',
      sessionId: 'sess_seed_02',
      questionId: 'q_cbse8_m1_c3_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      questionDifficulty: 'Moderate',
      startTimeMs: Date.now() - 3000000,
      submitTimeMs: Date.now() - 3000000 + 48000,
      activeSeconds: 48,
      expectedSolvingTimeSeconds: 60,
      isCorrect: true,
      chosenAnswer: '5/12',
      correctAnswer: '5/12',
      attemptsCount: 1,
      hintsUsedCount: 0,
      wasAnswerChanged: false,
      timestamp: new Date(Date.now() - 3000000).toISOString(),
    },
    {
      id: 'tim_seed_03',
      studentId: 'usr_stu_cbse8_03',
      sessionId: 'sess_seed_03',
      questionId: 'q_cbse8_m1_c3_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_fractions',
      conceptId: 'con_cbse8_m1_c3',
      questionDifficulty: 'Moderate',
      startTimeMs: Date.now() - 2500000,
      submitTimeMs: Date.now() - 2500000 + 95000,
      activeSeconds: 95,
      expectedSolvingTimeSeconds: 60,
      isCorrect: true,
      chosenAnswer: '5/12',
      correctAnswer: '5/12',
      attemptsCount: 1,
      hintsUsedCount: 1,
      wasAnswerChanged: true,
      timestamp: new Date(Date.now() - 2500000).toISOString(),
    },
    {
      id: 'tim_seed_04',
      studentId: 'usr_stu_cbse8_01',
      sessionId: 'sess_seed_04',
      questionId: 'q_cbse8_m2_c2_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_linear_eq',
      conceptId: 'con_cbse8_m2_c2',
      questionDifficulty: 'Moderate',
      startTimeMs: Date.now() - 2000000,
      submitTimeMs: Date.now() - 2000000 + 28000,
      activeSeconds: 28,
      expectedSolvingTimeSeconds: 60,
      isCorrect: false,
      chosenAnswer: '4x = 15 - 9',
      correctAnswer: '4x = 15 + 9',
      attemptsCount: 1,
      hintsUsedCount: 0,
      wasAnswerChanged: false,
      misconceptionTag: 'FAILED_SIGN_REVERSAL_ON_TRANSPOSITION',
      timestamp: new Date(Date.now() - 2000000).toISOString(),
    },
    {
      id: 'tim_seed_05',
      studentId: 'usr_stu_cbse8_02',
      sessionId: 'sess_seed_05',
      questionId: 'q_cbse8_m2_c2_01',
      board: 'CBSE',
      classLevel: '8',
      subject: 'Mathematics',
      chapterId: 'ch_cbse8_math_linear_eq',
      conceptId: 'con_cbse8_m2_c2',
      questionDifficulty: 'Moderate',
      startTimeMs: Date.now() - 1500000,
      submitTimeMs: Date.now() - 1500000 + 52000,
      activeSeconds: 52,
      expectedSolvingTimeSeconds: 60,
      isCorrect: true,
      chosenAnswer: '4x = 15 + 9',
      correctAnswer: '4x = 15 + 9',
      attemptsCount: 1,
      hintsUsedCount: 0,
      wasAnswerChanged: false,
      timestamp: new Date(Date.now() - 1500000).toISOString(),
    },
  ];

  return {
    users,
    studentProfiles,
    teacherProfiles,
    curriculumSources,
    chapters: [...chapters, ...expandedChapters],
    lessons: [...lessons, ...expandedLessons],
    questions: [...questions, ...expandedQuestionBank],
    assessmentAttempts,
    diagnosticEvidences,
    recoveryActivities,
    recoveryAttempts,
    retestRecords,
    instructionalGroups,
    interventionPlans,
    assignments,
    assignmentSubmissions,
    resources: [...resources, ...expandedResourceLibrary],
    questionTimingRecords: initialTimingRecords,
    subjectCoverageMatrix: officialSubjectCoverage,
    studentActivityLogs: [],
  };
}
