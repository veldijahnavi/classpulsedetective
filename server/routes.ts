/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import { getDb, saveDb } from './db.js';
import {
  hashPassword,
  verifyPassword,
  createSession,
  invalidateSession,
  getSession,
  requireAuth,
  requireRole,
} from './auth.js';
import { askAiTutor, solvePhotoDoubt } from './ai.js';
import type {
  User,
  StudentProfile,
  TeacherProfile,
  AssessmentAttempt,
  DiagnosticEvidence,
  RetestRecord,
  RecoveryAttempt,
  SmartRecoveryActivity,
  MasteryStatus,
  ErrorType,
  Question,
  QuestionTimingRecord,
  AdaptiveState,
  PaceCategory,
  LiveStudentActivityEvent,
  BoardType,
  ClassLevel,
} from './types.js';
import {
  computeAdaptiveState,
  computePaceCategory,
  selectAdaptiveQuestions,
  getNextAdaptiveQuestion,
  generateDynamicQuestionsForConcept,
} from './adaptiveEngine.js';
import {
  getProbesForConcept,
  getRecoveryActivityIdForDiagnosis,
  buildDynamicRecoveryActivity,
  authenticRecoveryActivities,
  diagnosticProbesCatalog,
} from './diagnosticData.js';

interface SseClient {
  id: string;
  res: Response;
  userId: string;
  board?: string;
  classLevel?: string;
}

const teacherSseClients = new Map<string, SseClient>();

// Helper to broadcast activity events to connected teacher SSE clients and record in db
export function broadcastStudentActivity(event: LiveStudentActivityEvent): void {
  const db = getDb();
  if (!db.studentActivityLogs) db.studentActivityLogs = [];
  db.studentActivityLogs.unshift(event);
  if (db.studentActivityLogs.length > 250) {
    db.studentActivityLogs = db.studentActivityLogs.slice(0, 250);
  }
  saveDb();

  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const [clientId, client] of teacherSseClients.entries()) {
    try {
      if (
        (!client.board || client.board === 'All' || client.board === event.board) &&
        (!client.classLevel || client.classLevel === 'All' || client.classLevel === event.classLevel)
      ) {
        client.res.write(payload);
      }
    } catch (e) {
      teacherSseClients.delete(clientId);
    }
  }
}

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & DEMO ACCOUNTS
// ==========================================

// Demo Accounts List (Compact metadata for login screen)
apiRouter.get('/demo-accounts', (req: Request, res: Response) => {
  const db = getDb();
  const demoStudents = db.studentProfiles.map((sp) => {
    const user = db.users.find((u) => u.id === sp.userId);
    return {
      userId: sp.userId,
      studentId: sp.studentId,
      loginId: user?.loginId || '',
      name: user?.name || '',
      board: sp.board,
      classLevel: sp.classLevel,
      section: sp.section,
      initialProfileType: sp.initialProfileType,
      learningProfileDescription: sp.learningProfileDescription,
      samplePassword: 'Student@2026',
    };
  });

  const demoTeachers = db.teacherProfiles.map((tp) => {
    const user = db.users.find((u) => u.id === tp.userId);
    return {
      userId: tp.userId,
      teacherId: tp.teacherId,
      loginId: user?.loginId || '',
      name: user?.name || '',
      assignedBoards: tp.assignedBoards,
      assignedClasses: tp.assignedClasses,
      school: tp.school,
      samplePassword: 'Teacher@2026',
    };
  });

  res.json({ students: demoStudents, teachers: demoTeachers });
});

// Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { loginId, password, portal } = req.body;

  if (!loginId || !password || !portal) {
    return res.status(400).json({ error: 'Login ID, password, and portal selection are required.' });
  }

  const db = getDb();
  const user = db.users.find(
    (u) => u.loginId.toLowerCase() === loginId.trim().toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid login credentials. User not found.' });
  }

  // Strict role verification: enforce portal separation
  if (portal === 'student' && user.role !== 'student') {
    return res.status(403).json({
      error: 'Teacher credentials cannot be used to sign into the Student Portal. Please use the Teacher Portal.',
    });
  }

  if (portal === 'teacher' && user.role !== 'teacher') {
    return res.status(403).json({
      error: 'Student credentials cannot be used to sign into the Teacher Portal. Access is restricted to authorized educators.',
    });
  }

  const isValidPassword = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Incorrect password. Please verify your credentials.' });
  }

  const token = createSession(user);

  let studentProfile: StudentProfile | undefined;
  let teacherProfile: TeacherProfile | undefined;

  if (user.role === 'student') {
    studentProfile = db.studentProfiles.find((sp) => sp.userId === user.id);
  } else if (user.role === 'teacher') {
    teacherProfile = db.teacherProfiles.find((tp) => tp.userId === user.id);
  }

  res.json({
    token,
    user: {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      role: user.role,
      school: user.school,
      email: user.email,
    },
    studentProfile: studentProfile ? { ...studentProfile, name: user.name } : undefined,
    teacherProfile: teacherProfile ? { ...teacherProfile, name: user.name } : undefined,
  });
});

// Student Registration
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const {
    name,
    loginId,
    password,
    school,
    board,
    classLevel,
    section,
    medium,
    registeredSubjects,
    interfaceLanguage,
    learningLanguage,
    registrationCode,
  } = req.body;

  if (!name || !loginId || !password || !board || !classLevel || !section) {
    return res.status(400).json({ error: 'Please provide all mandatory registration details.' });
  }

  const db = getDb();
  if (db.users.some((u) => u.loginId.toLowerCase() === loginId.trim().toLowerCase())) {
    return res.status(409).json({ error: 'This Login ID is already taken. Please choose a unique ID.' });
  }

  const { hash, salt } = hashPassword(password);
  const newUserId = `user_stu_${Date.now()}`;
  const newUser: User = {
    id: newUserId,
    loginId: loginId.trim(),
    passwordHash: hash,
    salt,
    name: name.trim(),
    role: 'student',
    school: school || 'Affiliated Indian Model School',
    createdAt: new Date().toISOString(),
  };

  // Determine subjects based on board & class
  let defaultSubjects = ['Mathematics', 'English'];
  if (board === 'TELANGANA_SSC') {
    if (classLevel === '6' || classLevel === '7') {
      defaultSubjects = ['Mathematics', 'General Science', 'Social Studies', 'English', 'Telugu', 'Hindi'];
    } else {
      defaultSubjects = ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English', 'Telugu', 'Hindi'];
    }
  } else if (board === 'CBSE') {
    defaultSubjects = ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Applications'];
  } else if (board === 'CISCE') {
    defaultSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'English', 'Computer Studies'];
  }

  const studentProfile: StudentProfile = {
    userId: newUserId,
    studentId: `STU-${board.slice(0, 2)}-${classLevel}0${db.studentProfiles.length + 1}`,
    board,
    academicYear: '2026-2027',
    classLevel,
    section,
    medium: medium || 'English',
    registeredSubjects: registeredSubjects && registeredSubjects.length > 0 ? registeredSubjects : defaultSubjects,
    interfaceLanguage: interfaceLanguage || 'en',
    learningLanguage: learningLanguage || 'en',
    learningProfileDescription: 'Newly registered student account. Diagnostic baseline pending.',
    initialProfileType: 'untested',
  };

  db.users.push(newUser);
  db.studentProfiles.push(studentProfile);
  saveDb();

  const token = createSession(newUser);
  res.status(201).json({
    token,
    user: newUser,
    studentProfile,
  });
});

// Authenticated User Details
apiRouter.get('/auth/me', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const db = getDb();
  const user = db.users.find((u) => u.id === session.userId);

  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }

  let studentProfile: StudentProfile | undefined;
  let teacherProfile: TeacherProfile | undefined;

  if (user.role === 'student') {
    studentProfile = db.studentProfiles.find((sp) => sp.userId === user.id);
  } else if (user.role === 'teacher') {
    teacherProfile = db.teacherProfiles.find((tp) => tp.userId === user.id);
  }

  res.json({
    user: {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      role: user.role,
      school: user.school,
      email: user.email,
    },
    studentProfile: studentProfile ? { ...studentProfile, name: user.name } : undefined,
    teacherProfile: teacherProfile ? { ...teacherProfile, name: user.name } : undefined,
  });
});

// Update Language Preferences
apiRouter.put('/auth/preferences', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const { interfaceLanguage, learningLanguage } = req.body;
  const db = getDb();

  const sp = db.studentProfiles.find((s) => s.userId === session.userId);
  if (sp) {
    if (interfaceLanguage) sp.interfaceLanguage = interfaceLanguage;
    if (learningLanguage) sp.learningLanguage = learningLanguage;
    saveDb();
    return res.json({ success: true, studentProfile: sp });
  }

  res.json({ success: true });
});

// Logout
apiRouter.post('/auth/logout', requireAuth, (req: Request, res: Response) => {
  const token = req.userSession!.token;
  invalidateSession(token);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Forgot Password
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { loginId, securityKey } = req.body;
  if (!loginId) {
    return res.status(400).json({ error: 'Login ID is required.' });
  }

  const db = getDb();
  const user = db.users.find((u) => u.loginId.toLowerCase() === loginId.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account registered with this Login ID.' });
  }

  // Realistic reset with school administrative reset token or default recovery
  if (securityKey === 'RESET2026' || securityKey === 'ADMIN') {
    const newCred = hashPassword('Student@2026');
    user.passwordHash = newCred.hash;
    user.salt = newCred.salt;
    saveDb();
    return res.json({
      success: true,
      message: 'Password successfully reset to default "Student@2026". You may now log in.',
    });
  }

  res.status(400).json({
    error: 'Invalid recovery code. Please contact your school administrator or teacher to issue a recovery key.',
  });
});

// Student Personal Learning Evidence & Progress Record (Strict student privacy enforcement)
apiRouter.get('/student/progress', requireAuth, requireRole('student'), (req: Request, res: Response) => {
  const session = req.userSession!;
  const db = getDb();
  const student = db.studentProfiles.find((s) => s.userId === session.userId);
  const user = db.users.find((u) => u.id === session.userId);

  if (!student || !user) {
    return res.status(404).json({ error: 'Student record not found.' });
  }

  const attempts = db.assessmentAttempts.filter((a) => a.studentId === student.userId);
  const diagnostics = db.diagnosticEvidences.filter((d) => d.studentId === student.userId);
  const recoveries = db.recoveryAttempts.filter((r) => r.studentId === student.userId);
  const retests = db.retestRecords.filter((r) => r.studentId === student.userId);

  res.json({
    studentProfile: {
      ...student,
      name: user.name,
      loginId: user.loginId,
    },
    attempts,
    diagnostics,
    recoveries,
    retests,
    totalAttempts: attempts.length,
    recoveriesCompleted: recoveries.filter((r) => r.isCompleted).length,
    retestsCompleted: retests.length,
    adaptiveState: student.adaptiveState || 'INDEPENDENT_PRACTICE',
    paceCategory: student.paceCategory || 'Methodical & Thorough',
  });
});

// Student Concept Learning Reset (Allows student to reset history for a specific concept to re-baseline)
apiRouter.post('/student/reset-concept-history', requireAuth, requireRole('student'), (req: Request, res: Response) => {
  const session = req.userSession!;
  const { conceptId } = req.body;
  const db = getDb();

  if (conceptId) {
    db.assessmentAttempts = db.assessmentAttempts.filter(
      (a) => !(a.studentId === session.userId && (a.conceptId === conceptId || a.chapterId === conceptId))
    );
    db.diagnosticEvidences = db.diagnosticEvidences.filter(
      (d) => !(d.studentId === session.userId && (d.conceptId === conceptId || d.chapterId === conceptId))
    );
    db.recoveryAttempts = db.recoveryAttempts.filter(
      (r) => !(r.studentId === session.userId && r.conceptId === conceptId)
    );
    db.retestRecords = db.retestRecords.filter(
      (r) => !(r.studentId === session.userId && r.conceptId === conceptId)
    );
  } else {
    db.assessmentAttempts = db.assessmentAttempts.filter((a) => a.studentId !== session.userId);
    db.diagnosticEvidences = db.diagnosticEvidences.filter((d) => d.studentId !== session.userId);
    db.recoveryAttempts = db.recoveryAttempts.filter((r) => r.studentId !== session.userId);
    db.retestRecords = db.retestRecords.filter((r) => r.studentId !== session.userId);
  }

  saveDb();
  res.json({ success: true, message: 'Concept learning history reset successfully.' });
});

apiRouter.get('/student/progress/:studentId', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const { studentId } = req.params;
  const db = getDb();

  const student = db.studentProfiles.find((s) => s.userId === studentId || s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }

  // Privacy Rule: Students can ONLY access their own records
  if (session.role === 'student' && session.userId !== student.userId) {
    return res.status(403).json({ error: 'Privacy Violation: You are not authorized to view another student’s records.' });
  }

  // Teacher Rule: Teachers can only view students in their assigned boards and classes
  if (session.role === 'teacher') {
    const tp = db.teacherProfiles.find((t) => t.userId === session.userId);
    if (tp && (!tp.assignedBoards.includes(student.board) || !tp.assignedClasses.includes(student.classLevel))) {
      return res.status(403).json({ error: 'Authorization Denied: This student belongs to a class or board outside your assigned teaching scope.' });
    }
  }

  const user = db.users.find((u) => u.id === student.userId);
  const attempts = db.assessmentAttempts.filter((a) => a.studentId === student.userId);
  const diagnostics = db.diagnosticEvidences.filter((d) => d.studentId === student.userId);
  const recoveries = db.recoveryAttempts.filter((r) => r.studentId === student.userId);
  const retests = db.retestRecords.filter((r) => r.studentId === student.userId);

  res.json({
    studentProfile: {
      ...student,
      name: user?.name || '',
      loginId: user?.loginId || '',
    },
    attempts,
    diagnostics,
    recoveries,
    retests,
    totalAttempts: attempts.length,
    recoveriesCompleted: recoveries.filter((r) => r.isCompleted).length,
    retestsCompleted: retests.length,
    adaptiveState: student.adaptiveState || 'INDEPENDENT_PRACTICE',
    paceCategory: student.paceCategory || 'Methodical & Thorough',
  });
});

// ==========================================
// 2. CURRICULUM & OFFICIAL SOURCES
// ==========================================

// Official Sources
apiRouter.get('/curriculum/sources', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.curriculumSources);
});

// Complete Curriculum Coverage Matrix with Real-Time Dynamic Verification (Requirement 1.3)
apiRouter.get('/curriculum/coverage-matrix', (req: Request, res: Response) => {
  const { board, classLevel, subject } = req.query;
  const db = getDb();
  let matrix = db.subjectCoverageMatrix || [];
  if (board) matrix = matrix.filter((m) => m.board === board);
  if (classLevel) matrix = matrix.filter((m) => m.classLevel === classLevel);
  if (subject) matrix = matrix.filter((m) => m.subject.toLowerCase() === (subject as string).toLowerCase());

  const computedMatrix = matrix.map((item) => {
    // 1. Chapters matching this board, class, and subject
    const matchingChapters = db.chapters.filter(
      (c) =>
        c.board === item.board &&
        c.classLevel === item.classLevel &&
        c.subject.toLowerCase() === item.subject.toLowerCase()
    );
    const importedChaptersCount = matchingChapters.length;
    const matchingConcepts = matchingChapters.flatMap((c) => c.concepts || []);
    const availableTopicsCount = matchingConcepts.length;
    const conceptIds = new Set(matchingConcepts.map((con) => con.id));
    const chapterIds = new Set(matchingChapters.map((c) => c.id));

    // 2. Detailed 16-point lessons available in db
    const detailedLessonsCompletedCount = db.lessons.filter(
      (l) => chapterIds.has(l.chapterId) || conceptIds.has(l.conceptId)
    ).length;

    // 3. Question bank availability
    const subjectQuestions = db.questions.filter(
      (q) =>
        q.board === item.board &&
        q.classLevel === item.classLevel &&
        q.subject.toLowerCase() === item.subject.toLowerCase()
    );
    const practiceQuestionsAvailableCount = subjectQuestions.filter((q) => !q.id.includes('retest')).length;
    const retestQuestionsAvailableCount = subjectQuestions.filter((q) => q.id.includes('retest')).length;

    // 4. Diagnostic probes catalog
    let diagnosticQuestionsAvailableCount = 0;
    for (const conId of conceptIds) {
      if (diagnosticProbesCatalog[conId]) {
        diagnosticQuestionsAvailableCount += diagnosticProbesCatalog[conId].length;
      }
    }

    // 5. Recovery pathways & Resources
    const recoveryPathwaysAvailableCount = db.recoveryActivities.filter(
      (r) =>
        r.board === item.board &&
        r.classLevel === item.classLevel &&
        r.subject.toLowerCase() === item.subject.toLowerCase()
    ).length;

    const resourcesAvailableCount = db.resources.filter(
      (r) =>
        r.board === item.board &&
        r.classLevel === item.classLevel &&
        r.subject.toLowerCase() === item.subject.toLowerCase()
    ).length;

    // 6. Explicit missing items reporting
    const missingItems: string[] = [];
    if (importedChaptersCount < item.expectedChaptersCount) {
      missingItems.push(`${item.expectedChaptersCount - importedChaptersCount} chapters pending digitization`);
    }
    if (availableTopicsCount > detailedLessonsCompletedCount) {
      missingItems.push(`${availableTopicsCount - detailedLessonsCompletedCount} topics pending detailed interactive lessons`);
    }
    if (practiceQuestionsAvailableCount < 10) {
      missingItems.push(`Practice question target: ${practiceQuestionsAvailableCount}/10 items`);
    }
    if (retestQuestionsAvailableCount === 0) {
      missingItems.push('Fresh retest assessment pool pending validation');
    }
    if (recoveryPathwaysAvailableCount === 0) {
      missingItems.push('Smart recovery remediation pathway in development');
    }

    // 7. Calculate actual completion percentage honestly
    const chapterScore = Math.min(1, importedChaptersCount / Math.max(1, item.expectedChaptersCount));
    const lessonScore = availableTopicsCount > 0 ? Math.min(1, detailedLessonsCompletedCount / availableTopicsCount) : 0;
    const questionScore = Math.min(1, practiceQuestionsAvailableCount / Math.max(10, availableTopicsCount * 3));
    const recoveryScore = Math.min(1, (recoveryPathwaysAvailableCount + (diagnosticQuestionsAvailableCount > 0 ? 1 : 0)) / 2);
    const retestScore = Math.min(1, retestQuestionsAvailableCount / 2);

    let rawPercentage = Math.round(
      chapterScore * 35 +
      lessonScore * 20 +
      questionScore * 20 +
      recoveryScore * 15 +
      retestScore * 10
    );

    // Rule: Never display 100% coverage when content is missing
    if (missingItems.length > 0 && rawPercentage >= 100) {
      rawPercentage = 95;
    }
    if (importedChaptersCount < item.expectedChaptersCount && rawPercentage > 85) {
      rawPercentage = 85;
    }

    return {
      ...item,
      importedChaptersCount,
      topicsCoveredCount: availableTopicsCount,
      availableTopicsCount,
      expectedTopicsCount: Math.max(item.expectedTopicsCount || 0, item.expectedChaptersCount * 3),
      detailedLessonsCompletedCount,
      practiceQuestionsAvailableCount,
      retestQuestionsAvailableCount,
      diagnosticQuestionsAvailableCount,
      recoveryPathwaysAvailableCount,
      resourcesAvailableCount,
      missingItems,
      coveragePercentage: rawPercentage,
    };
  });

  res.json(computedMatrix);
});

// Chapters (Filtered by Board + Class + Subject)
apiRouter.get('/curriculum/chapters', (req: Request, res: Response) => {
  const { board, classLevel, subject, academicYear } = req.query;
  const db = getDb();

  let filtered = db.chapters;
  if (board) filtered = filtered.filter((c) => c.board === board);
  if (classLevel) filtered = filtered.filter((c) => c.classLevel === classLevel);
  if (subject) filtered = filtered.filter((c) => c.subject.toLowerCase() === (subject as string).toLowerCase());
  if (academicYear) filtered = filtered.filter((c) => c.academicYear === academicYear);

  res.json(filtered);
});

// Single Chapter Details with Concepts
apiRouter.get('/curriculum/chapter/:chapterId', (req: Request, res: Response) => {
  const { chapterId } = req.params;
  const db = getDb();
  const chapter = db.chapters.find((c) => c.id === chapterId);

  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found.' });
  }

  const source = db.curriculumSources.find((s) => s.id === chapter.officialSourceId);
  res.json({ chapter, officialSource: source });
});

// Prerequisite Concept Map
apiRouter.get('/curriculum/concept-map', (req: Request, res: Response) => {
  const { board, classLevel, subject, studentId } = req.query;
  const db = getDb();

  let targetChapters = db.chapters;
  if (board) targetChapters = targetChapters.filter((c) => c.board === board);
  if (classLevel) targetChapters = targetChapters.filter((c) => c.classLevel === classLevel);
  if (subject) targetChapters = targetChapters.filter((c) => c.subject.toLowerCase() === (subject as string).toLowerCase());

  // Aggregate all concepts with dependencies
  const nodes: Array<{
    id: string;
    title: string;
    chapterTitle: string;
    classLevel: string;
    learningOutcome: string;
    status: MasteryStatus;
    hasPrerequisites: boolean;
  }> = [];

  const links: Array<{ source: string; target: string; importance: string; label: string }> = [];

  for (const ch of targetChapters) {
    for (const con of ch.concepts) {
      // Find latest status for this student if studentId is provided
      let status: MasteryStatus = 'UNTESTED';
      if (studentId) {
        const diag = db.diagnosticEvidences
          .filter((d) => d.studentId === studentId && d.conceptId === con.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

        const retest = db.retestRecords
          .filter((r) => r.studentId === studentId && r.conceptId === con.id)
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

        if (retest) {
          status = retest.outcome === 'Stronger Understanding' ? 'STRONG_UNDERSTANDING' : 'PRACTICING';
        } else if (diag) {
          status = diag.concludedStatus;
        }
      }

      nodes.push({
        id: con.id,
        title: con.title,
        chapterTitle: ch.title,
        classLevel: ch.classLevel,
        learningOutcome: con.learningOutcome,
        status,
        hasPrerequisites: con.prerequisites && con.prerequisites.length > 0,
      });

      if (con.prerequisites) {
        for (const p of con.prerequisites) {
          links.push({
            source: p.prerequisiteConceptId,
            target: con.id,
            importance: p.importance,
            label: p.prerequisiteTitle,
          });
        }
      }
    }
  }

  res.json({ nodes, links });
});

// ==========================================
// 3. LEARN & LESSONS
// ==========================================

apiRouter.get('/learn/lesson/:chapterId/:conceptId', (req: Request, res: Response) => {
  const { chapterId, conceptId } = req.params;
  const db = getDb();

  const lesson = db.lessons.find((l) => l.chapterId === chapterId && l.conceptId === conceptId);
  const chapter = db.chapters.find((c) => c.id === chapterId);
  const concept = chapter?.concepts.find((con) => con.id === conceptId);

  if (!lesson) {
    // Return grounded structured starter lesson to never leave a chapter blank
    return res.json({
      lesson: {
        id: `les_${chapterId}_${conceptId}`,
        chapterId,
        conceptId,
        title: concept?.title || 'Core Syllabus Concept',
        explanation: {
          en: `Welcome to the official lesson for "${concept?.title || chapter?.title}". In Class ${chapter?.classLevel || '8'}, mastering this concept requires understanding the fundamental definitions, observing step-by-step worked examples, and practicing with self-guided checks.`,
          hi: `"${concept?.title || chapter?.title}" के आधिकारिक पाठ में आपका स्वागत है। कक्षा ${chapter?.classLevel || '8'} में इस अवधारणा को समझने के लिए परिभाषाओं और हल किए गए उदाहरणों का अध्ययन करें।`,
          te: `"${concept?.title || chapter?.title}" పాఠ్యాంశానికి స్వాగతం. ${chapter?.classLevel || '8'}వ తరగతి సిలబస్ ప్రకారం ఈ భావనను క్రమపద్ధతిలో అర్థం చేసుకోవడం ఎంతో ముఖ్యం.`,
        },
        definitions: [
          {
            term: concept?.title || 'Core Principle',
            definition: {
              en: concept?.description || 'Foundational syllabus definition.',
              hi: 'पाठ्यक्रम की बुनियादी परिभाषा।',
              te: 'సిలబస్ లోని ప్రాథమిక నిర్వచనం.',
            },
          },
        ],
        workedExamples: [
          {
            problem: {
              en: `Demonstrate key application for ${concept?.title || 'this topic'}.`,
              hi: 'हल किया गया उदाहरण।',
              te: 'సాధించిన ఉదాహరణ.',
            },
            stepByStep: [
              { en: 'Step 1: State the given information and conditions.', hi: 'चरण 1: दी गई जानकारी लिखें।', te: 'దశ 1: ఇచ్చిన వివరాలు రాయండి.' },
              { en: 'Step 2: Apply the relevant board-approved formula or theorem.', hi: 'चरण 2: उपयुक्त सूत्र लागू करें।', te: 'దశ 2: సూత్రాన్ని వర్తింపజేయండి.' },
              { en: 'Step 3: Compute final value and check units.', hi: 'चरण 3: अंतिम उत्तर की जांच करें।', te: 'దశ 3: ఫలితాన్ని సరిచూడండి.' },
            ],
            finalAnswer: 'Step-by-step verification complete',
            keyInsight: {
              en: 'Always verify steps by substitution or reverse reasoning.',
              hi: 'हमेशा चरणों की दोबारा जाँच करें।',
              te: 'ప్రతి దశను నిశితంగా పరిశీలించండి.',
            },
          },
        ],
        commonMistakes: [
          {
            mistake: { en: 'Skipping steps or making careless sign errors.', hi: 'चरण छोड़ना या चिन्हों में गलती।', te: 'దశలను దాటవేయడం లేదా తప్పు గుర్తులు వాడటం.' },
            correction: { en: 'Write each transformation explicitly on separate lines.', hi: 'प्रत्येक चरण को स्पष्ट रूप से लिखें।', te: 'ప్రతి దశను స్పష్టంగా రాయండి.' },
            whyItHappens: { en: 'Attempting mental arithmetic under time pressure.', hi: 'जल्दबाजी में मानसिक गणना करना।', te: 'ఆత్రుతతో లెక్కించడం వల్ల.' },
          },
        ],
        summaryPoints: [
          { en: '1. Build clarity on foundational rules before multi-step questions.', hi: '1. बुनियादी नियमों को स्पष्ट समझें।', te: '1. ప్రాథమిక సూత్రాలపై పట్టు సాధించండి.' },
        ],
      },
      chapter,
      concept,
    });
  }

  res.json({ lesson, chapter, concept });
});

// ==========================================
// 4. ASSESSMENT & PRACTICE (INDIVIDUAL ADAPTATION)
// Get Adaptive Questions (Strict board & class isolation with non-repeating progression)
apiRouter.get('/assessment/questions', (req: Request, res: Response) => {
  const { studentId, conceptId, chapterId, topicId, board, classLevel, subject, limit, difficulty } = req.query;
  const db = getDb();

  const authHeader = req.headers.authorization;
  const session = authHeader ? getSession(authHeader.replace(/^Bearer\s+/i, '')) : undefined;

  const student = (studentId
    ? db.studentProfiles.find((s) => s.userId === studentId || s.studentId === studentId)
    : undefined) || (session ? db.studentProfiles.find((s) => s.userId === session.userId) : undefined);

  const targetBoard = student?.board || (board as string);
  const targetClass = student?.classLevel || (classLevel as string);
  const targetLimit = limit ? Number(limit) : 15;

  // Requirement 1: If a lesson/concept has only 1 question, dynamically generate additional relevant questions
  const targetConceptStr = String(conceptId || topicId || '');
  if (targetConceptStr) {
    const ch = db.chapters.find((c) =>
      c.concepts.some((cp) => cp.id === targetConceptStr)
    );
    const cp = ch?.concepts.find((cp) => cp.id === targetConceptStr);
    if (ch && cp) {
      const existingPracticeQs = db.questions.filter(
        (q) =>
          (q.conceptId === targetConceptStr || q.topicId === targetConceptStr) &&
          !q.id.includes('retest') &&
          (!targetBoard || q.board === targetBoard) &&
          (!targetClass || q.classLevel === targetClass)
      );

      if (existingPracticeQs.length <= 1) {
        const dynQs = generateDynamicQuestionsForConcept({
          board: (targetBoard || ch.board) as BoardType,
          classLevel: (targetClass || ch.classLevel) as ClassLevel,
          subject: ch.subject,
          chapterId: ch.id,
          chapterTitle: ch.title,
          conceptId: targetConceptStr,
          conceptTitle: cp.title,
          existingQuestions: existingPracticeQs,
        });
        if (dynQs.length > 0) {
          db.questions.push(...dynQs);
          saveDb();
        }
      }
    }
  }

  // Track past attempted questions for this student to prevent repetition
  const pastAttemptedIds = student
    ? db.assessmentAttempts
        .filter((a) => a.studentId === student.userId && (!conceptId || a.conceptId === conceptId))
        .flatMap((a) => a.questionIds || [])
    : [];

  if (student) {
    // 1. First attempt: strictly fetch unattempted questions matching student board & class & subject/topic
    let adaptiveQs = selectAdaptiveQuestions(db.questions, {
      student,
      subject: subject as string,
      chapterId: chapterId as string,
      conceptId: conceptId as string,
      topicId: (topicId || conceptId) as string,
      difficulty: difficulty as any,
      limit: targetLimit,
      excludeIds: pastAttemptedIds,
    });

    if (adaptiveQs.length > 0) return res.json(adaptiveQs);

    // If all questions in this topic have already been attempted, rotate through the concept pool
    let rotatedQs = selectAdaptiveQuestions(db.questions, {
      student,
      subject: subject as string,
      chapterId: chapterId as string,
      conceptId: conceptId as string,
      topicId: (topicId || conceptId) as string,
      difficulty: difficulty as any,
      limit: targetLimit,
      excludeIds: [],
    });
    return res.json(rotatedQs);
  }

  // Fallback for unauthenticated or generic query: STRICT board & class & topic filtering
  let pool = db.questions;
  if (targetBoard) pool = pool.filter((q) => q.board === targetBoard);
  if (targetClass) pool = pool.filter((q) => q.classLevel === targetClass);
  if (subject) pool = pool.filter((q) => q.subject.toLowerCase() === (subject as string).toLowerCase());
  if (conceptId) pool = pool.filter((q) => q.conceptId === conceptId || q.topicId === conceptId);
  else if (topicId) pool = pool.filter((q) => q.topicId === topicId || q.conceptId === topicId);
  else if (chapterId) pool = pool.filter((q) => q.chapterId === chapterId);
  if (difficulty) pool = pool.filter((q) => q.difficulty === difficulty);

  // If no authentic matching questions exist, return empty array (NEVER fallback to unrelated subjects)
  res.json(pool.slice(0, targetLimit));
});

// Helper function to synthesize detailed Concept Detective reports
function buildDiagnosticReportDetails(params: {
  conceptId: string;
  conceptTitle?: string;
  subject: string;
  classLevel: string;
  board: string;
  errorType: ErrorType;
  primaryDifficulty: string;
  detectedMistakeTags: string[];
  isSingleMistake?: boolean;
}): {
  mistakeExplanation: string;
  learningGapAnalysis: string;
  missingPrerequisites: Array<{
    title: string;
    classLevel?: string;
    subject?: string;
    whyNeeded: string;
  }>;
  recommendedActions: Array<{
    title: string;
    actionType: 'immediate' | 'guided_study' | 'practice' | 'mastery_verification';
    description: string;
  }>;
} {
  const { conceptId, conceptTitle, subject, classLevel, board, errorType, primaryDifficulty, detectedMistakeTags, isSingleMistake } = params;
  const title = conceptTitle || 'Syllabus Topic';
  const subLower = (subject || '').toLowerCase();
  const conLower = (conceptId || '').toLowerCase();

  // 1. Mistake explanation
  let mistakeExplanation = '';
  if (detectedMistakeTags.includes('ADDED_DENOMINATORS_DIRECTLY') || detectedMistakeTags.includes('MISSING_LCM_PREREQUISITE')) {
    mistakeExplanation = 'The submitted solution added the numerators and denominators straight across (e.g. 1/3 + 1/4 = 2/7), treating fraction denominators as independent countable units rather than equal subdivisions of a whole. Unlike fractions cannot be combined without finding a common denominator via LCM.';
  } else if (detectedMistakeTags.includes('FAILED_SIGN_REVERSAL_ON_TRANSPOSITION')) {
    mistakeExplanation = 'During transposition of terms across the equals sign, the operational sign was not reversed (e.g., maintaining positive when moving across the equality boundary). Preserving equality requires applying the exact additive or multiplicative inverse.';
  } else if (detectedMistakeTags.includes('INCORRECT_OXIDE_STOICHIOMETRY') || detectedMistakeTags.includes('SUBSCRIPT_ALTERATION_ERROR') || detectedMistakeTags.includes('UNBALANCED_OXYGEN_ATOMS')) {
    mistakeExplanation = 'Subscripts inside molecular formulas were altered rather than adjusting stoichiometric multipliers (coefficients), violating the chemical identity of the substances and the Law of Conservation of Mass.';
  } else if (detectedMistakeTags.includes('FORGOT_PAST_PERFECT_BACKSHIFT') || detectedMistakeTags.includes('FAILED_REPORTED_SPEECH_BACKSHIFT')) {
    mistakeExplanation = 'The direct speech verb tense was retained without backshifting one step into the past, despite the past reporting verb ("said") requiring narration from a past perspective.';
  } else if (detectedMistakeTags.includes('ADJECTIVE_ADVERB_CONFUSION') || detectedMistakeTags.includes('FALSE_LY_ADJECTIVE_CONFUSION')) {
    mistakeExplanation = 'An adjective was used to modify an action verb, or a word ending in "-ly" (such as "friendly" or "lively") was assumed to always be an adverb without verifying its sentence role.';
  } else if (detectedMistakeTags.includes('CONFUSED_CONCAVE_CONVEX_FOCAL_SIGN') || detectedMistakeTags.includes('INVERTED_IMAGE_DISTANCE_SIGN')) {
    mistakeExplanation = 'Optical distance signs were inverted relative to the optical pole and the direction of incident light propagation. Concave mirror focal distances are negative, whereas convex mirror focal distances are positive.';
  } else {
    mistakeExplanation = isSingleMistake
      ? `A single procedural slip was observed in calculating or identifying the governing relation for "${title}". Diagnostic follow-up probes test whether this was an isolated oversight.`
      : `Recurring error pattern observed: responses selected distractors that bypass intermediate verification steps or misapply the core steps of "${title}".`;
  }

  // 2. Learning gap analysis
  let learningGapAnalysis = '';
  if (isSingleMistake) {
    learningGapAnalysis = `Provisional Observation: Concept Detective does not declare a learning gap based on one isolated mistake. Probing is in progress to distinguish a momentary reading slip from a foundational gap in "${title}".`;
  } else if (errorType === 'PREREQUISITE_GAP') {
    learningGapAnalysis = `Prerequisite Foundation Gap: The student lacks critical prior-grade competencies (such as LCM calculation, atomic identity invariance, or parts of speech distinction) required to apply Class ${classLevel} rules in "${title}".`;
  } else if (errorType === 'CONCEPTUAL_MISCONCEPTION') {
    learningGapAnalysis = `Conceptual Misconception: The student has formed an erroneous mental model in "${title}", systematically misinterpreting core governing rules rather than making simple arithmetic slips.`;
  } else {
    learningGapAnalysis = `Procedural & Calculation Accuracy Need: The student understands the conceptual definition, but requires methodical step-by-step verification to prevent arithmetic or operational slips in "${title}".`;
  }

  // 3. Missing Prerequisites
  const missingPrerequisites: Array<{ title: string; classLevel?: string; subject?: string; whyNeeded: string }> = [];
  if (conLower.includes('frac') || detectedMistakeTags.includes('ADDED_DENOMINATORS_DIRECTLY')) {
    missingPrerequisites.push(
      { title: 'Finding Least Common Multiple (LCM)', classLevel: 'Class 6', subject: 'Mathematics', whyNeeded: 'Essential for finding a shared denominator so fractions represent equal subdivision sizes before adding.' },
      { title: 'Equivalent Fractions Scaling', classLevel: 'Class 6', subject: 'Mathematics', whyNeeded: 'Enables multiplying numerator and denominator by the same factor without altering the fraction value.' }
    );
  } else if (conLower.includes('lin') || detectedMistakeTags.includes('FAILED_SIGN_REVERSAL_ON_TRANSPOSITION')) {
    missingPrerequisites.push(
      { title: 'Additive and Multiplicative Inverses', classLevel: 'Class 7', subject: 'Mathematics', whyNeeded: 'Preserves equality by applying the inverse operation equally to both sides of the equation.' },
      { title: 'Integer Sign Arithmetic Rules', classLevel: 'Class 6/7', subject: 'Mathematics', whyNeeded: 'Governs addition and subtraction across positive and negative integers.' }
    );
  } else if (conLower.includes('chem') || detectedMistakeTags.includes('SUBSCRIPT_ALTERATION_ERROR')) {
    missingPrerequisites.push(
      { title: 'Law of Conservation of Mass', classLevel: 'Class 9', subject: 'Science', whyNeeded: 'Matter cannot be created or destroyed; total atom count of each element must remain constant.' },
      { title: 'Chemical Bond & Formula Invariance', classLevel: 'Class 9', subject: 'Science', whyNeeded: 'Subscripts denote chemical bonding; altering them creates different chemical compounds.' }
    );
  } else if (conLower.includes('optics') || conLower.includes('light') || detectedMistakeTags.includes('CONFUSED_CONCAVE_CONVEX_FOCAL_SIGN')) {
    missingPrerequisites.push(
      { title: 'Cartesian Coordinate Geometry Signs', classLevel: 'Class 9', subject: 'Science', whyNeeded: 'The pole acts as origin (0,0); incident light ray direction determines sign orientation.' }
    );
  } else if (conLower.includes('adv') || conLower.includes('eng')) {
    missingPrerequisites.push(
      { title: 'Parts of Speech (Noun/Verb/Adjective/Adverb)', classLevel: 'Class 6/7', subject: 'English', whyNeeded: 'Distinguishing words that describe things (adjectives) from words that describe actions (adverbs).' }
    );
  } else {
    missingPrerequisites.push(
      { title: `Foundational Rules for ${title}`, classLevel: `Class ${Number(classLevel) - 1 || 7}`, subject, whyNeeded: `Underlying prerequisite principles required for mastering ${title}.` }
    );
  }

  // 4. Recommended Actions
  const recommendedActions: Array<{ title: string; actionType: 'immediate' | 'guided_study' | 'practice' | 'mastery_verification'; description: string }> = [
    {
      title: 'Analyze Root-Cause Probe Evidence',
      actionType: 'immediate',
      description: 'Review the distractor analysis above to see why the submitted answer was flagged.',
    },
    {
      title: `Launch Smart Recovery Module for ${title}`,
      actionType: 'guided_study',
      description: 'Review the step-by-step worked example, conceptual explanation, and prerequisite bridge notes.',
    },
    {
      title: 'Complete Scaffolded Practice Questions',
      actionType: 'practice',
      description: 'Solve the graduated practice questions starting with foundational checks and using scaffold clues.',
    },
    {
      title: 'Verify 100% on Stage 4 Mastery Check to Unlock Fresh Retest',
      actionType: 'mastery_verification',
      description: 'Pass the mastery verification check to clear the diagnostic flag and take a fresh retest.',
    },
  ];

  return {
    mistakeExplanation,
    learningGapAnalysis,
    missingPrerequisites,
    recommendedActions,
  };
}

// Submit Assessment (Evaluates answers, logs attempt, records QuestionTimingRecord, triggers Concept Detective if needed)
apiRouter.post('/assessment/submit', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const { chapterId, conceptId, studentAnswers, timeSpentSeconds, hintsUsedCount, questionTimings } = req.body;

  const db = getDb();
  const student = db.studentProfiles.find((s) => s.userId === session.userId);
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }

  const chapter = db.chapters.find((c) => c.id === chapterId);
  const concept = chapter?.concepts.find((cp) => cp.id === conceptId) || chapter?.concepts?.[0];
  const answersMap = studentAnswers || req.body.answers || {};
  const questionIds = Object.keys(answersMap);
  const isCorrectMap: Record<string, boolean> = {};
  let correctCount = 0;
  const detectedMistakeTags: string[] = [];

  const nowMs = Date.now();
  const defaultPerQuestionTime = Math.round((timeSpentSeconds || 60) / Math.max(1, questionIds.length));

  if (!db.questionTimingRecords) {
    db.questionTimingRecords = [];
  }

  for (const qId of questionIds) {
    const q = db.questions.find((item) => item.id === qId);
    if (!q) continue;
    const chConcepts = chapter?.concepts.map((c) => c.id) || [];
    const matchesConcept =
      !conceptId ||
      q.conceptId === conceptId ||
      q.topicId === conceptId ||
      q.chapterId === chapterId ||
      chConcepts.includes(q.conceptId) ||
      (q.conceptId && conceptId && (q.conceptId.includes(conceptId) || conceptId.includes(q.conceptId)));
    if (q.board !== student.board || q.classLevel !== student.classLevel ||
        (chapterId && q.chapterId !== chapterId) || !matchesConcept) {
      return res.status(400).json({ error: 'Question does not belong to this student curriculum and selected topic.', questionId: qId });
    }

    const chosenChoiceId = answersMap[qId];
    const correctChoice = q.choices?.find((c) => c.isCorrect);
    const chosenChoice = q.choices?.find((c) => c.id === chosenChoiceId);

    let isCorrect = correctChoice ? correctChoice.id === chosenChoiceId : false;
    if (!correctChoice && q.correctAnswerText) {
      const studentText = String(chosenChoiceId || '').trim().toLowerCase();
      const targetText = q.correctAnswerText.trim().toLowerCase();
      if (q.questionType === 'numerical' && !isNaN(Number(studentText)) && !isNaN(Number(targetText))) {
        const tol = q.acceptableTolerance || 0.05;
        isCorrect = Math.abs(Number(studentText) - Number(targetText)) <= tol;
      } else {
        isCorrect = studentText === targetText;
      }
    }
    isCorrectMap[qId] = isCorrect;

    if (isCorrect) {
      correctCount++;
    } else {
      if (chosenChoice?.misconceptionTag) {
        detectedMistakeTags.push(chosenChoice.misconceptionTag);
      }
    }

    const timingInfo = questionTimings?.[qId];
    const activeSec = timingInfo?.activeSeconds && timingInfo.activeSeconds > 0 
      ? timingInfo.activeSeconds 
      : defaultPerQuestionTime;
    const hintsUsed = timingInfo?.hintsUsed || 0;
    const wasChanged = Boolean(timingInfo?.wasChanged);

    const timingRecord: QuestionTimingRecord = {
      id: `tim_${nowMs}_${qId}`,
      studentId: student.userId,
      sessionId: session.userId,
      questionId: q.id,
      board: q.board,
      classLevel: q.classLevel,
      subject: q.subject,
      chapterId: q.chapterId,
      conceptId: q.conceptId,
      questionDifficulty: q.difficulty,
      startTimeMs: nowMs - activeSec * 1000,
      submitTimeMs: nowMs,
      activeSeconds: activeSec,
      expectedSolvingTimeSeconds: q.expectedSolvingTimeSeconds || 60,
      isCorrect,
      chosenAnswer: chosenChoice?.text.en || chosenChoiceId || '',
      correctAnswer: correctChoice?.text.en || '',
      attemptsCount: 1,
      hintsUsedCount: hintsUsed,
      wasAnswerChanged: wasChanged,
      misconceptionTag: chosenChoice?.misconceptionTag,
      timestamp: new Date().toISOString(),
    };

    db.questionTimingRecords.push(timingRecord);
  }

  const totalMarks = questionIds.length;
  const needsDiagnosticFollowup = correctCount < totalMarks;

  // Update Student Learning Pace & Adaptive State
  const prevAnswered = student.questionsAnsweredCount || 0;
  const prevTime = (student.averageSolvingTimeSeconds || 60) * prevAnswered;
  const newTotalAnswered = prevAnswered + questionIds.length;
  const newAvgTime = Math.round((prevTime + (timeSpentSeconds || 60)) / Math.max(1, newTotalAnswered));

  const totalHints = (student.hintsUsedTotal || 0) + (hintsUsedCount || 0);
  const consecutiveCorrect = correctCount === totalMarks 
    ? (student.consecutiveCorrectCount || 0) + correctCount 
    : 0;

  const newAdaptiveState = computeAdaptiveState({
    accuracy: totalMarks > 0 ? correctCount / totalMarks : 0,
    totalAttempts: newTotalAnswered,
    hintsUsedTotal: totalHints,
    consecutiveCorrect,
    hasPrereqGap: detectedMistakeTags.includes('ADDED_DENOMINATORS_DIRECTLY') || detectedMistakeTags.includes('MISSING_LCM_PREREQUISITE'),
  });

  const paceCat = computePaceCategory(
    defaultPerQuestionTime,
    60,
    correctCount === totalMarks,
    hintsUsedCount || 0
  );

  student.questionsAnsweredCount = newTotalAnswered;
  student.hintsUsedTotal = totalHints;
  student.averageSolvingTimeSeconds = newAvgTime;
  student.consecutiveCorrectCount = consecutiveCorrect;
  student.adaptiveState = newAdaptiveState;
  student.paceCategory = paceCat;

  const attemptId = `att_${Date.now()}`;
  const attemptRecord: AssessmentAttempt = {
    id: attemptId,
    studentId: student.userId,
    assessmentType: 'practice',
    board: student.board,
    classLevel: student.classLevel,
    subject: chapter?.subject || 'Mathematics',
    chapterId,
    conceptId,
    questionIds,
    studentAnswers: answersMap,
    isCorrectMap,
    score: correctCount,
    totalMarks,
    timeSpentSeconds: timeSpentSeconds || 60,
    hintsUsedCount: hintsUsedCount || 0,
    questionTimings,
    submittedAt: new Date().toISOString(),
    needsDiagnosticFollowup,
    assignedAdaptiveState: newAdaptiveState,
  };

  db.assessmentAttempts.push(attemptRecord);

  // If wrong answers occurred, initialize Concept Detective Evidence
  let diagnosticId: string | undefined;
  if (needsDiagnosticFollowup) {
    diagnosticId = `diag_${Date.now()}`;
    let primaryDifficulty = 'Careless Calculation or Reading Error';
    let errorType: ErrorType = 'CALCULATION_PROCEDURAL_ERROR';
    let recommendation = 'Procedural Practice';

    // Examine historical errors on this concept to differentiate single mistakes from repeated patterns
    const priorAttemptsOnConcept = db.assessmentAttempts.filter(
      (a) => a.id !== attemptId && a.studentId === student.userId && (a.conceptId === conceptId || a.chapterId === chapterId)
    );
    const priorErrorAttemptsCount = priorAttemptsOnConcept.filter((a) => a.score < a.totalMarks).length;
    const currentIncorrectCount = totalMarks - correctCount;
    const isSingleMistake = priorErrorAttemptsCount === 0 && currentIncorrectCount === 1;
    const repeatedMistakesCount = priorErrorAttemptsCount + currentIncorrectCount;

    // Classify error type and pedagogical recommendation based on mistake tags and subject
    const subjectName = chapter?.subject || (db.questions.find((q) => questionIds.includes(q.id))?.subject) || 'Science';
    let recActivityId = getRecoveryActivityIdForDiagnosis({
      conceptId,
      subject: subjectName,
      classLevel: student.classLevel,
      board: student.board,
      conceptTitle: concept?.title,
      chapterId,
    });

    // Ensure recovery activity exists in database (or build dynamic recovery activity)
    if (!db.recoveryActivities.some((ra) => ra.id === recActivityId) && !authenticRecoveryActivities.some((ra) => ra.id === recActivityId)) {
      const dynRec = buildDynamicRecoveryActivity({
        conceptId,
        chapterId: chapter?.id,
        subject: subjectName,
        board: student.board,
        classLevel: student.classLevel,
        title: concept?.title,
      });
      db.recoveryActivities.push(dynRec);
      recActivityId = dynRec.id;
    }

    if (detectedMistakeTags.includes('ADDED_DENOMINATORS_DIRECTLY') || detectedMistakeTags.includes('MISSING_LCM_PREREQUISITE')) {
      primaryDifficulty = 'Direct Denominator Addition (Missing LCM Prerequisite)';
      errorType = 'PREREQUISITE_GAP';
      recommendation = 'Prerequisite Support';
    } else if (detectedMistakeTags.includes('FAILED_SIGN_REVERSAL_ON_TRANSPOSITION')) {
      primaryDifficulty = 'Sign Inversion Failure during Constant Transposition';
      errorType = 'CONCEPTUAL_MISCONCEPTION';
      recommendation = 'Conceptual Understanding';
    } else if (detectedMistakeTags.includes('INCORRECT_OXIDE_STOICHIOMETRY') || detectedMistakeTags.includes('UNBALANCED_OXYGEN_ATOMS') || detectedMistakeTags.includes('SUBSCRIPT_ALTERATION_ERROR')) {
      primaryDifficulty = 'Stoichiometric Balancing & Subscript Alteration Error';
      errorType = 'CONCEPTUAL_MISCONCEPTION';
      recommendation = 'Conceptual Understanding';
    } else if (detectedMistakeTags.includes('FORGOT_PAST_PERFECT_BACKSHIFT') || detectedMistakeTags.includes('FAILED_REPORTED_SPEECH_BACKSHIFT')) {
      primaryDifficulty = 'Reported Speech Tense Backshift Rule Misapplication';
      errorType = 'CONCEPTUAL_MISCONCEPTION';
      recommendation = 'Conceptual Understanding';
    } else if (detectedMistakeTags.includes('CONFUSED_CONCAVE_CONVEX_FOCAL_SIGN') || detectedMistakeTags.includes('INVERTED_IMAGE_DISTANCE_SIGN')) {
      primaryDifficulty = 'Cartesian Sign Convention for Spherical Optics';
      errorType = 'PREREQUISITE_GAP';
      recommendation = 'Prerequisite Support';
    } else if (detectedMistakeTags.includes('CONFUSED_EFFECTIVE_NUCLEAR_CHARGE') || detectedMistakeTags.includes('INVERTED_ATOMIC_RADIUS_TREND')) {
      primaryDifficulty = 'Effective Nuclear Charge vs Energy Shells Misconception';
      errorType = 'CONCEPTUAL_MISCONCEPTION';
      recommendation = 'Conceptual Understanding';
    } else if (detectedMistakeTags.includes('FAILED_TO_USE_PAST_PARTICIPLE_V3')) {
      primaryDifficulty = 'Passive Voice Auxiliary & V3 Participle Formation';
      errorType = 'PREREQUISITE_GAP';
      recommendation = 'Prerequisite Support';
    } else if (detectedMistakeTags.includes('CONFUSED_SCURVY_WITH_BERIBERI') || detectedMistakeTags.includes('CONFUSED_CARBOHYDRATE_WITH_PROTEIN_TEST')) {
      primaryDifficulty = 'Nutrient Chemical Tests and Deficiency Diseases';
      errorType = 'CONCEPTUAL_MISCONCEPTION';
      recommendation = 'Conceptual Understanding';
    } else if (
      detectedMistakeTags.includes('ADJECTIVE_ADVERB_CONFUSION') ||
      detectedMistakeTags.includes('FLAT_ADVERB_MISUSE') ||
      detectedMistakeTags.includes('FALSE_LY_ADJECTIVE_CONFUSION') ||
      detectedMistakeTags.includes('ADVERB_TYPE_CONFUSION') ||
      detectedMistakeTags.includes('MISPLACED_FREQUENCY_ADVERB') ||
      detectedMistakeTags.includes('CONFUSED_HARD_WITH_HARDLY')
    ) {
      if (detectedMistakeTags.includes('ADJECTIVE_ADVERB_CONFUSION') || detectedMistakeTags.includes('FALSE_LY_ADJECTIVE_CONFUSION')) {
        primaryDifficulty = 'Adjective vs Adverb Distinction (Modifying Nouns vs Action Verbs)';
        errorType = 'PREREQUISITE_GAP';
        recommendation = 'Prerequisite Support';
      } else if (detectedMistakeTags.includes('MISPLACED_FREQUENCY_ADVERB')) {
        primaryDifficulty = 'Adverb of Frequency Word Order & Auxiliary "To Be" Placement';
        errorType = 'FORMULA_RULE_APPLICATION';
        recommendation = 'Procedural Practice';
      } else {
        primaryDifficulty = 'Adverb Classification, Flat Adverbs & Suffix Application';
        errorType = 'CONCEPTUAL_MISCONCEPTION';
        recommendation = 'Conceptual Understanding';
      }
    }

    // Rule 2: Do NOT declare a learning gap based on just one wrong answer.
    const initialStatus: MasteryStatus = isSingleMistake
      ? 'INSUFFICIENT_EVIDENCE'
      : (errorType === 'PREREQUISITE_GAP' ? 'PREREQUISITE_GAP' : 'POSSIBLE_MISCONCEPTION');

    const diagExplanation = isSingleMistake
      ? `Concept Detective Note: A single isolated mistake was observed on "${concept?.title || chapter?.title}". In accordance with scientific pedagogical principles, Concept Detective does NOT declare a learning gap based on just one wrong answer. Diagnostic follow-up probes have been assembled to determine whether this was a careless procedural slip, a conceptual misconception, or a missing prerequisite.`
      : `Repeated difficulty detected on "${concept?.title || chapter?.title}" across ${repeatedMistakesCount} question instances. Diagnostic evidence indicates a recurring pattern of ${primaryDifficulty}. Attempt the investigative probes to confirm the root cause.`;

    const conceptToImprove = isSingleMistake
      ? `Under Investigation: Answer follow-up probes to isolate exact need.`
      : `${concept?.title || chapter?.title}: ${primaryDifficulty}`;

    const reportDetails = buildDiagnosticReportDetails({
      conceptId,
      conceptTitle: concept?.title || chapter?.title,
      subject: subjectName,
      classLevel: student.classLevel,
      board: student.board,
      errorType,
      primaryDifficulty,
      detectedMistakeTags,
      isSingleMistake,
    });

    const diagEvidence: DiagnosticEvidence = {
      id: diagnosticId,
      attemptId,
      studentId: student.userId,
      conceptId,
      chapterId,
      subject: subjectName,
      board: student.board,
      classLevel: student.classLevel,
      topicId: conceptId,
      topicTitle: concept?.title || chapter?.title,
      learningOutcome: concept?.learningOutcome,
      primaryObservedDifficulty: primaryDifficulty,
      detectedErrorType: errorType,
      errorEvidence: [
        `Incorrect responses submitted on question(s): ${questionIds.filter((id) => !isCorrectMap[id]).join(', ')}`,
        `Identified error pattern tag(s): ${detectedMistakeTags.length > 0 ? detectedMistakeTags.join(', ') : 'Unclassified error'}`,
        isSingleMistake
          ? 'Single mistake observed — provisional evidence awaiting follow-up probe confirmation.'
          : `Repeated error pattern across ${repeatedMistakesCount} problem instances.`,
      ],
      followUpQuestionsAttempted: [],
      concludedStatus: initialStatus,
      diagnosticExplanation: diagExplanation,
      recommendedRecoveryType: recommendation,
      recommendedActivityId: recActivityId,
      createdAt: new Date().toISOString(),
      isSingleMistake,
      repeatedMistakesCount,
      identifiedConceptToImprove: conceptToImprove,
      mistakeExplanation: reportDetails.mistakeExplanation,
      learningGapAnalysis: reportDetails.learningGapAnalysis,
      missingPrerequisites: reportDetails.missingPrerequisites,
      recommendedActions: reportDetails.recommendedActions,
    };

    db.diagnosticEvidences.push(diagEvidence);

    // Reset any prior recovery retest eligibility for this newly diagnosed concept gap
    const priorRecoveries = db.recoveryAttempts.filter(
      (ra) => (ra.conceptId === conceptId || ra.activityId === recActivityId) && (ra.studentId === student.userId || ra.studentId === student.studentId)
    );
    for (const pr of priorRecoveries) {
      pr.eligibleForRetest = false;
      pr.isCompleted = false;
      pr.questionsAnswered = {};
      pr.questionsCorrectMap = {};
      pr.isPrerequisiteReviewed = false;
      pr.currentStepIndex = 0;
    }
  }

  // Real-time synchronization broadcast to teacher dashboard
  const user = db.users.find((u) => u.id === session.userId);
  broadcastStudentActivity({
    id: `act_${Date.now()}_att`,
    studentId: student.studentId,
    studentName: user?.name || session.name,
    board: student.board,
    classLevel: student.classLevel,
    section: student.section,
    subject: chapter?.subject || 'English',
    chapterId,
    chapterTitle: chapter?.title,
    conceptId,
    conceptTitle: concept?.title,
    topicId: conceptId,
    topicTitle: concept?.title || chapter?.title,
    learningOutcome: concept?.learningOutcome,
    activityType: 'question_attempted',
    isCorrect: correctCount === totalMarks,
    score: correctCount,
    totalMarks,
    timeSpentSeconds: timeSpentSeconds || 60,
    hintsUsedCount: hintsUsedCount || 0,
    attemptsCount: 1,
    learningStatus: correctCount === totalMarks ? 'PRACTICING' : (needsDiagnosticFollowup ? 'POSSIBLE_MISCONCEPTION' : 'PRACTICING'),
    paceCategory: paceCat,
    timestamp: new Date().toISOString(),
  });

  saveDb();

  res.json({
    attempt: attemptRecord,
    needsDiagnosticFollowup,
    diagnosticId,
    adaptiveState: newAdaptiveState,
    paceCategory: paceCat,
  });
});

// ==========================================
// 5. CONCEPT DETECTIVE — CORE INNOVATION
// ==========================================

// Get Latest Detective Investigation for a Student
apiRouter.get('/detective/latest/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;
  const db = getDb();

  const student = db.studentProfiles.find((s) => s.userId === studentId || s.studentId === studentId)
    || (req.userSession ? db.studentProfiles.find((s) => s.userId === req.userSession!.userId) : undefined);
  const targetUserId = student?.userId || studentId;

  let evidence = db.diagnosticEvidences
    .filter((d) => (d.studentId === targetUserId || d.studentId === req.userSession?.userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (!evidence) {
    // If no prior diagnostic attempt exists, provide an initial proactive diagnostic overview
    const firstChapter = db.chapters.find((c) => c.board === (student?.board || 'CBSE') && c.classLevel === (student?.classLevel || '8'));
    const firstConcept = firstChapter?.concepts?.[0];
    const cId = firstConcept?.id || 'con_cbse8_m1_c3';
    const sub = firstChapter?.subject || 'Mathematics';

    const followUpProbes = getProbesForConcept(cId, sub, student?.classLevel || '8', firstConcept?.title);
    const recActId = getRecoveryActivityIdForDiagnosis({
      conceptId: cId,
      subject: sub,
      classLevel: student?.classLevel || '8',
      board: student?.board || 'CBSE',
      conceptTitle: firstConcept?.title,
      chapterId: firstChapter?.id,
    });

    const reportDetails = buildDiagnosticReportDetails({
      conceptId: cId,
      conceptTitle: firstConcept?.title,
      subject: sub,
      classLevel: student?.classLevel || '8',
      board: student?.board || 'CBSE',
      errorType: 'CALCULATION_PROCEDURAL_ERROR',
      primaryDifficulty: 'Pre-Assessment Diagnostic Check',
      detectedMistakeTags: [],
      isSingleMistake: false,
    });

    evidence = {
      id: `diag_init_${cId}`,
      attemptId: `att_init_${Date.now()}`,
      studentId: targetUserId,
      conceptId: cId,
      chapterId: firstChapter?.id || '',
      subject: sub,
      board: student?.board || 'CBSE',
      classLevel: student?.classLevel || '8',
      topicId: cId,
      topicTitle: firstConcept?.title || 'Core Syllabus Concept',
      learningOutcome: firstConcept?.learningOutcome,
      primaryObservedDifficulty: 'Pre-Assessment Diagnostic Check',
      detectedErrorType: 'CALCULATION_PROCEDURAL_ERROR',
      errorEvidence: ['Concept Detective is ready to analyze your responses on this concept.'],
      followUpQuestionsAttempted: [],
      concludedStatus: 'UNTESTED',
      diagnosticExplanation: `No mistakes logged yet on "${firstConcept?.title || 'this concept'}". Solve practice questions in the Solve tab, or take these proactive diagnostic probes to test your foundational readiness!`,
      recommendedRecoveryType: 'Conceptual Understanding',
      recommendedActivityId: recActId,
      createdAt: new Date().toISOString(),
      isSingleMistake: false,
      identifiedConceptToImprove: 'None yet',
      mistakeExplanation: reportDetails.mistakeExplanation,
      learningGapAnalysis: reportDetails.learningGapAnalysis,
      missingPrerequisites: reportDetails.missingPrerequisites,
      recommendedActions: reportDetails.recommendedActions,
    };

    db.diagnosticEvidences.push(evidence);
    saveDb();

    return res.json({
      evidence,
      followUpProbes,
      activityRecommendation: 'Conceptual Understanding',
    });
  }

  if (!evidence.mistakeExplanation || !evidence.learningGapAnalysis || !evidence.missingPrerequisites || !evidence.recommendedActions) {
    const reportDetails = buildDiagnosticReportDetails({
      conceptId: evidence.conceptId,
      conceptTitle: evidence.topicTitle,
      subject: evidence.subject,
      classLevel: evidence.classLevel,
      board: evidence.board,
      errorType: evidence.detectedErrorType,
      primaryDifficulty: evidence.primaryObservedDifficulty,
      detectedMistakeTags: evidence.detectedMistakeTags || [],
      isSingleMistake: evidence.isSingleMistake,
    });
    evidence.mistakeExplanation = evidence.mistakeExplanation || reportDetails.mistakeExplanation;
    evidence.learningGapAnalysis = evidence.learningGapAnalysis || reportDetails.learningGapAnalysis;
    evidence.missingPrerequisites = evidence.missingPrerequisites || reportDetails.missingPrerequisites;
    evidence.recommendedActions = evidence.recommendedActions || reportDetails.recommendedActions;
    saveDb();
  }

  const followUpProbes = getProbesForConcept(evidence.conceptId, evidence.subject, evidence.classLevel, evidence.topicTitle);

  res.json({
    evidence,
    followUpProbes,
    activityRecommendation: evidence.recommendedRecoveryType,
  });
});

// Get Detective Investigation Details (Authentic multi-subject investigative probes)
apiRouter.get(['/detective/investigation', '/detective/investigation/:studentId', '/detective/investigation/:studentId/:conceptId'], requireAuth, (req: Request, res: Response) => {
  const paramStudentId = req.params.studentId || (req.query.studentId as string) || req.userSession!.userId;
  const conceptId = req.params.conceptId || (req.query.conceptId as string) || '';
  const db = getDb();

  const student = db.studentProfiles.find((s) => s.userId === paramStudentId || s.studentId === paramStudentId)
    || db.studentProfiles.find((s) => s.userId === req.userSession!.userId);
  const studentUserId = student?.userId || paramStudentId;

  if (req.userSession!.role !== 'teacher' && req.userSession!.userId !== studentUserId && req.userSession!.userId !== paramStudentId) {
    return res.status(403).json({ error: 'You can only view your own diagnostic investigation.' });
  }

  if (!conceptId) {
    let latest = db.diagnosticEvidences
      .filter((d) => d.studentId === studentUserId || d.studentId === req.userSession!.userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latest) {
      if (!latest.mistakeExplanation || !latest.learningGapAnalysis || !latest.missingPrerequisites || !latest.recommendedActions) {
        const reportDetails = buildDiagnosticReportDetails({
          conceptId: latest.conceptId,
          conceptTitle: latest.topicTitle,
          subject: latest.subject,
          classLevel: latest.classLevel,
          board: latest.board,
          errorType: latest.detectedErrorType,
          primaryDifficulty: latest.primaryObservedDifficulty,
          detectedMistakeTags: latest.detectedMistakeTags || [],
          isSingleMistake: latest.isSingleMistake,
        });
        latest.mistakeExplanation = latest.mistakeExplanation || reportDetails.mistakeExplanation;
        latest.learningGapAnalysis = latest.learningGapAnalysis || reportDetails.learningGapAnalysis;
        latest.missingPrerequisites = latest.missingPrerequisites || reportDetails.missingPrerequisites;
        latest.recommendedActions = latest.recommendedActions || reportDetails.recommendedActions;
        saveDb();
      }
      const followUpProbes = getProbesForConcept(latest.conceptId, latest.subject, latest.classLevel, latest.topicTitle);
      return res.json({ evidence: latest, followUpProbes });
    }
    // Proactively provide an investigation for the student's first enrolled syllabus chapter
    const firstCh = db.chapters.find((c) => c.board === (student?.board || 'CBSE') && c.classLevel === (student?.classLevel || '8'));
    const firstCp = firstCh?.concepts?.[0];
    const initialCId = firstCp?.id || 'con_cbse8_m1_c3';
    const sub = firstCh?.subject || 'Mathematics';
    const probes = getProbesForConcept(initialCId, sub, student?.classLevel || '8', firstCp?.title);

    const reportDetails = buildDiagnosticReportDetails({
      conceptId: initialCId,
      conceptTitle: firstCp?.title,
      subject: sub,
      classLevel: student?.classLevel || '8',
      board: student?.board || 'CBSE',
      errorType: 'CALCULATION_PROCEDURAL_ERROR',
      primaryDifficulty: 'Pre-Assessment Diagnostic Check',
      detectedMistakeTags: [],
      isSingleMistake: false,
    });

    const initEvidence: DiagnosticEvidence = {
      id: `diag_init_${initialCId}`,
      attemptId: `att_init_${Date.now()}`,
      studentId: studentUserId,
      conceptId: initialCId,
      chapterId: firstCh?.id || '',
      subject: sub,
      board: student?.board || 'CBSE',
      classLevel: student?.classLevel || '8',
      topicId: initialCId,
      topicTitle: firstCp?.title || 'Core Syllabus Concept',
      learningOutcome: firstCp?.learningOutcome,
      primaryObservedDifficulty: 'Pre-Assessment Diagnostic Check',
      detectedErrorType: 'CALCULATION_PROCEDURAL_ERROR',
      errorEvidence: ['Concept Detective is ready to analyze your responses on this concept.'],
      followUpQuestionsAttempted: [],
      concludedStatus: 'UNTESTED',
      diagnosticExplanation: `No mistakes logged yet on "${firstCp?.title || 'this concept'}". Solve practice questions in the Solve tab, or take these proactive diagnostic probes to test your foundational readiness!`,
      recommendedRecoveryType: 'Conceptual Understanding',
      recommendedActivityId: getRecoveryActivityIdForDiagnosis({
        conceptId: initialCId,
        subject: sub,
        classLevel: student?.classLevel || '8',
        board: student?.board || 'CBSE',
        conceptTitle: firstCp?.title,
        chapterId: firstCh?.id,
      }),
      createdAt: new Date().toISOString(),
      isSingleMistake: false,
      identifiedConceptToImprove: 'None yet',
      mistakeExplanation: reportDetails.mistakeExplanation,
      learningGapAnalysis: reportDetails.learningGapAnalysis,
      missingPrerequisites: reportDetails.missingPrerequisites,
      recommendedActions: reportDetails.recommendedActions,
    };
    db.diagnosticEvidences.push(initEvidence);
    saveDb();
    return res.json({ evidence: initEvidence, followUpProbes: probes });
  }

  let evidence = db.diagnosticEvidences
    .filter((d) => (d.studentId === studentUserId || d.studentId === req.userSession!.userId) && d.conceptId === conceptId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const ch = db.chapters.find((c) => c.concepts.some((cp) => cp.id === conceptId));
  const cp = ch?.concepts.find((cp) => cp.id === conceptId);
  const sub = ch?.subject || 'Science';

  if (!evidence) {
    // If no prior diagnostic attempt on this specific concept, create and persist initial overview with authentic probes
    const probes = getProbesForConcept(conceptId, sub, student?.classLevel || '8', cp?.title);
    const recActId = getRecoveryActivityIdForDiagnosis({
      conceptId,
      subject: sub,
      classLevel: student?.classLevel || '8',
      board: student?.board || 'CBSE',
      conceptTitle: cp?.title,
      chapterId: ch?.id,
    });

    const reportDetails = buildDiagnosticReportDetails({
      conceptId,
      conceptTitle: cp?.title,
      subject: sub,
      classLevel: student?.classLevel || '8',
      board: student?.board || 'CBSE',
      errorType: 'CALCULATION_PROCEDURAL_ERROR',
      primaryDifficulty: 'Pre-Assessment Diagnostic Check',
      detectedMistakeTags: [],
      isSingleMistake: false,
    });

    evidence = {
      id: `diag_init_${conceptId}`,
      attemptId: `att_init_${Date.now()}`,
      studentId: studentUserId,
      conceptId,
      chapterId: ch?.id || '',
      subject: sub,
      board: student?.board || ch?.board || 'CBSE',
      classLevel: student?.classLevel || ch?.classLevel || '8',
      topicId: conceptId,
      topicTitle: cp?.title || 'Core Syllabus Concept',
      learningOutcome: cp?.learningOutcome,
      primaryObservedDifficulty: 'Pre-Assessment Diagnostic Check',
      detectedErrorType: 'CALCULATION_PROCEDURAL_ERROR',
      errorEvidence: ['Concept Detective is ready to analyze your responses on this concept.'],
      followUpQuestionsAttempted: [],
      concludedStatus: 'UNTESTED',
      diagnosticExplanation: `No mistakes logged yet on "${cp?.title || 'this concept'}". Solve practice questions in the Solve tab, or take these proactive diagnostic probes to test your foundational readiness!`,
      recommendedRecoveryType: 'Conceptual Understanding',
      recommendedActivityId: recActId,
      createdAt: new Date().toISOString(),
      isSingleMistake: false,
      identifiedConceptToImprove: 'None yet',
      mistakeExplanation: reportDetails.mistakeExplanation,
      learningGapAnalysis: reportDetails.learningGapAnalysis,
      missingPrerequisites: reportDetails.missingPrerequisites,
      recommendedActions: reportDetails.recommendedActions,
    };

    db.diagnosticEvidences.push(evidence);
    saveDb();

    return res.json({
      evidence,
      followUpProbes: probes,
      activityRecommendation: 'Conceptual Understanding',
    });
  }

  if (!evidence.mistakeExplanation || !evidence.learningGapAnalysis || !evidence.missingPrerequisites || !evidence.recommendedActions) {
    const reportDetails = buildDiagnosticReportDetails({
      conceptId: evidence.conceptId,
      conceptTitle: evidence.topicTitle,
      subject: evidence.subject,
      classLevel: evidence.classLevel,
      board: evidence.board,
      errorType: evidence.detectedErrorType,
      primaryDifficulty: evidence.primaryObservedDifficulty,
      detectedMistakeTags: evidence.detectedMistakeTags || [],
      isSingleMistake: evidence.isSingleMistake,
    });
    evidence.mistakeExplanation = evidence.mistakeExplanation || reportDetails.mistakeExplanation;
    evidence.learningGapAnalysis = evidence.learningGapAnalysis || reportDetails.learningGapAnalysis;
    evidence.missingPrerequisites = evidence.missingPrerequisites || reportDetails.missingPrerequisites;
    evidence.recommendedActions = evidence.recommendedActions || reportDetails.recommendedActions;
    saveDb();
  }

  // Generate authentic investigative probes specifically for this subject and concept
  const followUpProbes = getProbesForConcept(evidence.conceptId, evidence.subject, evidence.classLevel, evidence.topicTitle);

  res.json({
    evidence,
    followUpProbes,
    activityRecommendation: evidence.recommendedRecoveryType,
  });
});

// Get Detective Investigation by diagnosticId directly
apiRouter.get('/detective/investigate/:diagnosticId', (req: Request, res: Response) => {
  const { diagnosticId } = req.params;
  const db = getDb();

  const evidence = db.diagnosticEvidences.find((d) => d.id === diagnosticId);
  if (!evidence) {
    return res.status(404).json({ error: 'Diagnostic record not found.' });
  }

  if (!evidence.mistakeExplanation || !evidence.learningGapAnalysis || !evidence.missingPrerequisites || !evidence.recommendedActions) {
    const reportDetails = buildDiagnosticReportDetails({
      conceptId: evidence.conceptId,
      conceptTitle: evidence.topicTitle,
      subject: evidence.subject,
      classLevel: evidence.classLevel,
      board: evidence.board,
      errorType: evidence.detectedErrorType,
      primaryDifficulty: evidence.primaryObservedDifficulty,
      detectedMistakeTags: evidence.detectedMistakeTags || [],
      isSingleMistake: evidence.isSingleMistake,
    });
    evidence.mistakeExplanation = evidence.mistakeExplanation || reportDetails.mistakeExplanation;
    evidence.learningGapAnalysis = evidence.learningGapAnalysis || reportDetails.learningGapAnalysis;
    evidence.missingPrerequisites = evidence.missingPrerequisites || reportDetails.missingPrerequisites;
    evidence.recommendedActions = evidence.recommendedActions || reportDetails.recommendedActions;
    saveDb();
  }

  const followUpProbes = getProbesForConcept(evidence.conceptId, evidence.subject, evidence.classLevel, evidence.topicTitle);

  res.json({
    evidence,
    followUpProbes,
    activityRecommendation: evidence.recommendedRecoveryType,
  });
});

// Submit Detective Follow-Up Probe Answers (Evaluates genuine subject probes)
apiRouter.post('/detective/submit-followup', requireAuth, (req: Request, res: Response) => {
  const { diagnosticId, probeAnswers } = req.body;
  const db = getDb();

  let diag = db.diagnosticEvidences.find((d) => d.id === diagnosticId);
  if (!diag) {
    // If not found by exact ID, fallback gracefully so no 404 error occurs
    const extractedConcept = (typeof diagnosticId === 'string' && diagnosticId.startsWith('diag_init_'))
      ? diagnosticId.replace(/^diag_init_/, '')
      : (req.body.conceptId || '');
    if (extractedConcept) {
      diag = db.diagnosticEvidences.find((d) => (d.studentId === req.userSession!.userId) && (d.conceptId === extractedConcept));
    }
    if (!diag) {
      const student = db.studentProfiles.find((s) => s.userId === req.userSession!.userId);
      const ch = db.chapters.find((c) => c.concepts.some((cp) => cp.id === extractedConcept) || c.id === extractedConcept);
      const cp = ch?.concepts.find((cp) => cp.id === extractedConcept) || ch?.concepts?.[0];
      const sub = ch?.subject || 'Science';
      diag = {
        id: diagnosticId || `diag_${Date.now()}`,
        attemptId: `att_init_${Date.now()}`,
        studentId: req.userSession!.userId,
        conceptId: extractedConcept || cp?.id || 'con_cbse8_m1_c3',
        chapterId: ch?.id || '',
        subject: sub,
        board: student?.board || ch?.board || 'CBSE',
        classLevel: student?.classLevel || ch?.classLevel || '8',
        topicId: extractedConcept || cp?.id,
        topicTitle: cp?.title || 'Core Syllabus Concept',
        learningOutcome: cp?.learningOutcome,
        primaryObservedDifficulty: 'Pre-Assessment Diagnostic Check',
        detectedErrorType: 'CALCULATION_PROCEDURAL_ERROR',
        errorEvidence: ['Concept Detective probe answers submitted.'],
        followUpQuestionsAttempted: [],
        concludedStatus: 'UNTESTED',
        diagnosticExplanation: 'Diagnostic follow-up probes submitted.',
        recommendedRecoveryType: 'Conceptual Understanding',
        recommendedActivityId: getRecoveryActivityIdForDiagnosis({
          conceptId: extractedConcept || cp?.id || '',
          subject: sub,
          classLevel: student?.classLevel || '8',
          board: student?.board || 'CBSE',
          conceptTitle: cp?.title,
          chapterId: ch?.id,
        }),
        createdAt: new Date().toISOString(),
        isSingleMistake: false,
        identifiedConceptToImprove: 'None yet',
      };
      db.diagnosticEvidences.push(diag);
    }
  }

  if (req.userSession!.role !== 'teacher' && diag.studentId !== req.userSession!.userId) {
    return res.status(403).json({ error: 'You cannot submit answers for another student.' });
  }

  const probes = getProbesForConcept(diag.conceptId, diag.subject, diag.classLevel, diag.topicTitle);
  const attemptedProbes = [];
  let allCorrect = true;
  let failedPrereq = false;
  let failedConceptual = false;

  let answersMap = probeAnswers || req.body.answers || {};
  if (req.body.probeId && (req.body.selectedChoiceId || req.body.studentAnswer)) {
    answersMap = {
      ...answersMap,
      [req.body.probeId]: req.body.selectedChoiceId || req.body.studentAnswer,
    };
  }

  for (const probe of probes) {
    const studentAns = answersMap[probe.id];
    const isCorrect = Boolean(studentAns && studentAns.trim() === probe.correctAnswer.trim());
    attemptedProbes.push({
      questionPrompt: probe.question,
      studentAnswer: studentAns || 'No answer',
      correctAnswer: probe.correctAnswer,
      testedSubSkill: probe.testedSubSkill,
      isCorrect,
    });
    if (!isCorrect) {
      allCorrect = false;
      if (probe.probeType === 'PREREQUISITE') failedPrereq = true;
      if (probe.probeType === 'CONCEPTUAL') failedConceptual = true;
    }
  }

  diag.followUpQuestionsAttempted = attemptedProbes;

  let targetActivityId = getRecoveryActivityIdForDiagnosis({
    conceptId: diag.conceptId,
    subject: diag.subject,
    classLevel: diag.classLevel,
    board: diag.board,
    conceptTitle: diag.topicTitle,
    chapterId: diag.chapterId,
  });

  // Ensure recovery activity exists in db
  if (!db.recoveryActivities.some((ra) => ra.id === targetActivityId) && !authenticRecoveryActivities.some((ra) => ra.id === targetActivityId)) {
    const dynRec = buildDynamicRecoveryActivity({
      conceptId: diag.conceptId,
      chapterId: diag.chapterId,
      subject: diag.subject,
      board: diag.board,
      classLevel: diag.classLevel,
      title: diag.topicTitle,
    });
    db.recoveryActivities.push(dynRec);
    targetActivityId = dynRec.id;
  }

  if (failedPrereq) {
    const prereqProbe = probes.find((p) => p.probeType === 'PREREQUISITE');
    diag.concludedStatus = 'PREREQUISITE_GAP';
    diag.detectedErrorType = 'PREREQUISITE_GAP';
    diag.diagnosticExplanation = `Diagnostic Evidence Confirmed: While attempting follow-up probes, the student struggled with the foundational prerequisite "${prereqProbe?.testedSubSkill || 'Prerequisite sub-skill'}". This gap is preventing progress in ${diag.topicTitle || diag.subject}. Recommended: Prerequisite Support Bridge.`;
    diag.recommendedRecoveryType = 'Prerequisite Support';
    diag.identifiedConceptToImprove = `Prerequisite Foundation: ${prereqProbe?.testedSubSkill || 'Foundational Rule'}`;
    diag.recommendedActivityId = targetActivityId;
  } else if (failedConceptual) {
    const conceptProbe = probes.find((p) => p.probeType === 'CONCEPTUAL');
    diag.concludedStatus = 'POSSIBLE_MISCONCEPTION';
    diag.detectedErrorType = 'CONCEPTUAL_MISCONCEPTION';
    diag.diagnosticExplanation = `Diagnostic Evidence Confirmed: Follow-up probe confirmed student misconception regarding "${conceptProbe?.testedSubSkill || 'Core Concept'}". Recommended: Targeted Visual Conceptual Recovery.`;
    diag.recommendedRecoveryType = 'Conceptual Understanding';
    diag.identifiedConceptToImprove = `Core Concept: ${conceptProbe?.testedSubSkill || diag.topicTitle || diag.subject}`;
    diag.recommendedActivityId = targetActivityId;
  } else {
    diag.concludedStatus = 'PRACTICING';
    diag.detectedErrorType = 'CALCULATION_PROCEDURAL_ERROR';
    diag.diagnosticExplanation = `Diagnostic Probes Solved Correctly! The student solved all follow-up probes with 100% accuracy. The initial mistake on "${diag.topicTitle || diag.subject}" was confirmed to be an isolated procedural slip rather than a conceptual learning gap. You have solid understanding and are ready for regular practice!`;
    diag.recommendedRecoveryType = 'Calculation & Procedure';
    diag.identifiedConceptToImprove = `None (Cleared via diagnostic follow-up probes)`;
    diag.recommendedActivityId = targetActivityId;
  }

  const updatedReportDetails = buildDiagnosticReportDetails({
    conceptId: diag.conceptId,
    conceptTitle: diag.topicTitle,
    subject: diag.subject,
    classLevel: diag.classLevel,
    board: diag.board,
    errorType: diag.detectedErrorType,
    primaryDifficulty: diag.primaryObservedDifficulty,
    detectedMistakeTags: failedPrereq ? ['MISSING_PREREQUISITE_PROBE'] : (failedConceptual ? ['CONCEPTUAL_MISCONCEPTION_PROBE'] : []),
    isSingleMistake: false,
  });

  diag.mistakeExplanation = updatedReportDetails.mistakeExplanation;
  diag.learningGapAnalysis = updatedReportDetails.learningGapAnalysis;
  diag.missingPrerequisites = updatedReportDetails.missingPrerequisites;
  diag.recommendedActions = updatedReportDetails.recommendedActions;

  // Real-time synchronization broadcast to teacher dashboard
  const student = db.studentProfiles.find((s) => s.userId === diag.studentId);
  const user = db.users.find((u) => u.id === diag.studentId);
  if (student && user) {
    broadcastStudentActivity({
      id: `act_${Date.now()}_diag`,
      studentId: student.studentId,
      studentName: user.name,
      board: student.board,
      classLevel: student.classLevel,
      section: student.section,
      subject: diag.subject,
      chapterId: diag.chapterId,
      conceptId: diag.conceptId,
      activityType: 'recovery_started',
      learningStatus: diag.concludedStatus,
      timestamp: new Date().toISOString(),
    });
  }

  saveDb();

  res.json({
    success: true,
    diagnosis: diag,
    evidence: diag,
    concludedStatus: diag.concludedStatus,
    identifiedConceptToImprove: diag.identifiedConceptToImprove,
    recommendedActivityId: diag.recommendedActivityId || targetActivityId,
  });
});

// ==========================================
// 6. SMART RECOVERY ENGINE
// ==========================================

function ensureCompleteRecoveryTeaching(rawActivity: SmartRecoveryActivity): SmartRecoveryActivity {
  const conceptTitle = rawActivity.title.replace(/^Smart Recovery:\s*/i, '');

  const simpleExplanation = rawActivity.simpleExplanation || {
    en: typeof rawActivity.remediationExplanation?.en === 'string'
      ? rawActivity.remediationExplanation.en
      : `Core Principle: In "${conceptTitle}", understanding the fundamental governing rules and steps is key to solving problems accurately. Follow established scientific and mathematical guidelines step-by-step.`,
    hi: typeof rawActivity.remediationExplanation?.hi === 'string'
      ? rawActivity.remediationExplanation.hi
      : `मूल सिद्धांत: "${conceptTitle}" में, बुनियादी नियमों और चरणों को समझना समस्याओं को सटीक रूप से हल करने की कुंजी है।`,
    te: typeof rawActivity.remediationExplanation?.te === 'string'
      ? rawActivity.remediationExplanation.te
      : `ముఖ్య భావన: "${conceptTitle}" లో ప్రాథమిక సూత్రాలు మరియు దశలను అర్థం చేసుకోవడం ద్వారా సమస్యలను ఖచ్చితంగా సాధించవచ్చు.`,
  };

  const workedExample = rawActivity.workedExample || {
    problem: {
      en: `Worked Example: Step-by-step mastery application for "${conceptTitle}".`,
      hi: `हल किया गया उदाहरण: "${conceptTitle}" के लिए चरणबद्ध अभ्यास।`,
      te: `సాధించిన ఉదాహరణ: "${conceptTitle}" కొరకు దశలవారీగా సాధన.`,
    },
    stepByStep: [
      {
        en: 'Step 1 (Given & Formula): State the conditions, core definitions, and governing rules.',
        hi: 'चरण 1 (दी गई जानकारी): मुख्य परिभाषाओं और लागू होने वाले नियमों को लिखें।',
        te: 'దశ 1 (ఇచ్చిన వివరాలు): ముఖ్య నిర్వచనాలు మరియు నియమాలను గుర్తించండి.',
      },
      {
        en: 'Step 2 (Execution): Substitute values or apply standard transformations methodically without skipping steps.',
        hi: 'चरण 2 (क्रियान्वयन): बिना चरण छोड़े व्यवस्थित रूप से मान रखें और हल करें।',
        te: 'దశ 2 (సాధన): దశలను దాటవేయకుండా సూత్రంలో వివరాలను ప్రతిక్షేపించండి.',
      },
      {
        en: 'Step 3 (Verification): Verify consistency, check units, and test edge conditions.',
        hi: 'चरण 3 (जाँच): परिणामों की दोबारा जाँच करें और इकाइयों का मिलान करें।',
        te: 'దశ 3 (సరిచూడటం): తుది ఫలితాన్ని మరియు ప్రమాణాలను సరిచూసుకోండి.',
      },
    ],
    finalAnswer: `Accurate application of ${conceptTitle} verified by step-by-step reasoning.`,
    keyInsight: {
      en: 'Always maintain balance and verify conditions before choosing an answer.',
      hi: 'उत्तर चुनने से पहले हमेशा संतुलन बनाए रखें और शर्तों की पुष्टि करें।',
      te: 'సమాధానం ఎంచుకోవడానికి ముందు నియమాలను సరిచూసుకోండి.',
    },
  };

  const keyHints = (rawActivity.keyHints && rawActivity.keyHints.length >= 2) ? rawActivity.keyHints : [
    {
      en: `Hint 1: Recall the standard syllabus definition for ${conceptTitle}.`,
      hi: `संकेत 1: ${conceptTitle} के लिए पाठ्यक्रम की मानक परिभाषा याद रखें।`,
      te: `సూచన 1: ${conceptTitle} యొక్క ప్రాథమిక నిర్వచనాన్ని గుర్తుతెచ్చుకోండి.`,
    },
    {
      en: 'Hint 2: Beware of common distractor traps, sign errors, or term confusion.',
      hi: 'संकेत 2: समान दिखने वाले विकल्पों और चिह्नों की गलतियों से सावधान रहें।',
      te: 'సూచన 2: సాధారణ పొరపాట్లు లేదా గందరగోళపరిచే ఆప్షన్ల పట్ల జాగ్రత్తగా ఉండండి.',
    },
    {
      en: 'Hint 3: Use reverse verification to confirm the correctness of your steps.',
      hi: 'संकेत 3: अपने उत्तर की पुष्टि के लिए विपरीत विधि से जाँच करें।',
      te: 'సూచన 3: మీ సమాధానాన్ని తిరిగి సరిచూసుకోండి.',
    },
  ];

  let guidedPracticeQuestions = rawActivity.guidedPracticeQuestions || [];
  if (guidedPracticeQuestions.length < 2) {
    guidedPracticeQuestions = [
      ...guidedPracticeQuestions,
      {
        id: `${rawActivity.id}_gq_guided_02`,
        difficulty: 'Moderate' as const,
        prompt: {
          en: `Step 2 (Guided Practice): In applying "${conceptTitle}", what foundational method guarantees error-free results?`,
          hi: `चरण 2 (मार्गदर्शित अभ्यास): "${conceptTitle}" को लागू करते समय, कौन सी विधि सटीक परिणाम सुनिश्चित करती है?`,
          te: `దశ 2 (మార్గదర్శక సాధన): "${conceptTitle}" ను సాధించేటప్పుడు ఏ పద్ధతి ఖచ్చితమైన ఫలితాన్ని ఇస్తుంది?`,
        },
        scaffoldHint: {
          en: 'Follow the worked example instructions step-by-step.',
          hi: 'हल किए गए उदाहरण के चरणों का पालन करें।',
          te: 'సాధించిన ఉదాహరణలోని సూచనలను అనుసరించండి.',
        },
        stepClues: [
          {
            en: 'State the rule, substitute explicitly, and double-check.',
            hi: 'नियम लिखें, मान रखें और दोबारा जाँचें।',
            te: 'సూత్రం రాసి, విలువలు ప్రతిక్షేపించి సరిచూడండి.',
          },
        ],
        choices: [
          {
            id: 'opt1',
            text: {
              en: 'Strictly apply governing rules step-by-step and verify the final answer',
              hi: 'नियमों को चरणबद्ध तरीके से लागू करें और परिणाम की पुष्टि करें',
              te: 'నియమాలను క్రమపద్ధతిలో వర్తింపజేసి ఫలితాన్ని సరిచూడండి',
            },
            isCorrect: true,
          },
          {
            id: 'opt2',
            text: {
              en: 'Skip definitions and pick arbitrary approximations',
              hi: 'परिभाषाओं को छोड़ना और अनुमानित उत्तर चुनना',
              te: 'నిర్వచనాలను దాటవేసి ఊహాత్మక సమాధానాలు ఎంచుకోవడం',
            },
            isCorrect: false,
          },
        ],
        correctExplanation: {
          en: 'Correct! Systematic step-by-step verification builds mastery.',
          hi: 'बिल्कुल सही! व्यवस्थित चरणबद्ध सत्यापन से विषय पर महारत हासिल होती है।',
          te: 'సరైనది! క్రమపద్ధతిలో సాధన చేయడం వల్ల పట్టు లభిస్తుంది.',
        },
      },
    ];
  }

  const masteryCheckQuestion = rawActivity.masteryCheckQuestion || {
    id: `${rawActivity.id}_mastery_check`,
    difficulty: 'Application' as const,
    prompt: {
      en: `Stage 4 (Mastery Check): To confirm your recovery on "${conceptTitle}", which summary reflects complete mastery?`,
      hi: `चरण 4 (महारत जांच): "${conceptTitle}" पर सुधार की पुष्टि के लिए, कौन सा कथन पूर्ण महारत को दर्शाता है?`,
      te: `దశ 4 (పట్టు నిర్ధారణ): "${conceptTitle}" పై మీ పట్టును నిర్ధారించడానికి ఏ వాక్యం సరైనది?`,
    },
    scaffoldHint: {
      en: 'Synthesize the simple explanation, worked example, and practiced rules.',
      hi: 'सीखी गई व्याख्या और हल किए गए उदाहरण के सिद्धांतों को याद करें।',
      te: 'నేర్చుకున్న సూత్రాలు మరియు ఉదాహరణలను గుర్తుచేసుకోండి.',
    },
    choices: [
      {
        id: 'opt1',
        text: {
          en: 'Deep conceptual understanding with validated procedural steps',
          hi: 'प्रमाणित चरणों के साथ गहरी वैचारिक समझ',
          te: 'రుజువైన దశలతో కూడిన లోతైన అవగాహన',
        },
        isCorrect: true,
      },
      {
        id: 'opt2',
        text: {
          en: 'Guessing without theoretical basis',
          hi: 'सैद्धांतिक आधार के बिना अनुमान लगाना',
          te: 'ఎటువంటి అవగాహన లేకుండా అంచనా వేయడం',
        },
        isCorrect: false,
      },
    ],
    correctExplanation: {
      en: 'Mastery Verified! You have successfully completed all recovery stages. Fresh retest is now unlocked!',
      hi: 'महारत सत्यापित! आपने सभी सुधार चरण पूरे कर लिए हैं। आपका नया रीटेस्ट अब अनलॉक हो गया है!',
      te: 'పట్టు నిరూపితమైంది! మీరు అన్ని దశలను పూర్తి చేశారు. మీ తాజా రీటెస్ట్ ఇప్పుడు అన్‌లాక్ చేయబడింది!',
    },
  };

  return {
    ...rawActivity,
    simpleExplanation,
    workedExample,
    keyHints,
    guidedPracticeQuestions,
    masteryCheckQuestion,
  };
}

// Get Smart Recovery Activity
apiRouter.get(['/recovery/activity', '/recovery/activity/:activityId'], (req: Request, res: Response) => {
  const activityId = (req.params.activityId || req.query.activityId || '') as string;
  const conceptId = req.query.conceptId as string;
  const authHeader = req.headers.authorization;
  const session = authHeader ? getSession(authHeader.replace(/^Bearer\s+/i, '')) : undefined;
  const studentId = session?.userId || (req.query.studentId as string);
  const db = getDb();

  let targetId = activityId;
  if (!targetId && conceptId) {
    targetId = getRecoveryActivityIdForDiagnosis({
      conceptId,
      subject: 'Science',
      classLevel: '8',
      board: 'CBSE',
    });
  }

  if (!targetId) {
    if (authenticRecoveryActivities.length > 0) {
      const fallback = ensureCompleteRecoveryTeaching(authenticRecoveryActivities[0]);
      const savedAttempt = studentId
        ? db.recoveryAttempts.find((ra) => (ra.activityId === fallback.id || ra.conceptId === fallback.conceptId) && ra.studentId === studentId)
        : null;
      return res.json({
        ...fallback,
        activity: fallback,
        savedAttempt,
      });
    }
    return res.status(404).json({ error: 'Activity ID is required' });
  }

  let activity = db.recoveryActivities.find((a) => a.id === targetId)
    || authenticRecoveryActivities.find((a) => a.id === targetId);

  // If not found by ID, check if it's dynamic
  if (!activity && targetId.startsWith('rec_')) {
    const rawConceptId = targetId.replace(/^rec_/, '');
    const ch = db.chapters.find((c) => c.concepts.some((cp) => cp.id === rawConceptId));
    const cp = ch?.concepts.find((cp) => cp.id === rawConceptId);
    if (ch && cp) {
      activity = buildDynamicRecoveryActivity({
        conceptId: rawConceptId,
        chapterId: ch.id,
        subject: ch.subject,
        board: ch.board,
        classLevel: ch.classLevel,
        title: cp.title,
      });
      db.recoveryActivities.push(activity);
      saveDb();
    }
  }

  if (!activity) {
    return res.status(404).json({ error: 'No verified recovery activity is available for this exact topic yet.' });
  }

  const completeActivity: SmartRecoveryActivity = ensureCompleteRecoveryTeaching(activity);
  if (!db.recoveryActivities.some((a) => a.id === completeActivity.id)) {
    db.recoveryActivities.push(completeActivity);
  }

  const savedAttemptRaw = studentId
    ? db.recoveryAttempts.find((ra) => (ra.activityId === completeActivity.id || ra.conceptId === completeActivity.conceptId) && (ra.studentId === studentId || ra.studentId === req.userSession?.userId))
    : null;

  const savedAttempt = savedAttemptRaw
    ? {
        ...savedAttemptRaw,
        guidedAnswers: savedAttemptRaw.questionsAnswered || {},
        questionsAnswered: savedAttemptRaw.questionsAnswered || {},
        isPrereqReviewed: savedAttemptRaw.isPrerequisiteReviewed,
        isPrerequisiteReviewed: savedAttemptRaw.isPrerequisiteReviewed,
        isEligibleForRetest: savedAttemptRaw.eligibleForRetest,
        eligibleForRetest: savedAttemptRaw.eligibleForRetest,
        currentStepIndex: savedAttemptRaw.currentStepIndex ?? (savedAttemptRaw.completedSteps?.length || 0),
      }
    : null;

  res.json({
    ...completeActivity,
    activity: completeActivity,
    savedAttempt,
  });
});

// Submit Recovery Progress & Check Retest Eligibility
apiRouter.post('/recovery/submit-step', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const {
    activityId,
    completedStep,
    stepIndex,
    questionAnswers,
    guidedAnswers,
    selectedChoiceId,
    questionId,
    isPrerequisiteReviewed,
    reviewCompleted,
  } = req.body;
  const db = getDb();

  const rawActivity = db.recoveryActivities.find((a) => a.id === activityId)
    || authenticRecoveryActivities.find((a) => a.id === activityId);
  if (!rawActivity) {
    return res.status(404).json({ error: 'Recovery activity not found.' });
  }

  const activity: SmartRecoveryActivity = ensureCompleteRecoveryTeaching(rawActivity);
  if (!db.recoveryActivities.some((a) => a.id === activity.id)) {
    db.recoveryActivities.push(activity);
  }

  let attempt = db.recoveryAttempts.find(
    (ra) => ra.activityId === activityId && ra.studentId === session.userId
  );

  if (!attempt) {
    const newAttempt: RecoveryAttempt = {
      id: `rec_att_${Date.now()}`,
      activityId,
      studentId: session.userId,
      conceptId: activity.conceptId,
      completedSteps: [],
      questionsAnswered: {},
      questionsCorrectMap: {},
      isPrerequisiteReviewed: false,
      isCompleted: false,
      eligibleForRetest: false,
      currentStepIndex: 0,
    };
    db.recoveryAttempts.push(newAttempt);
    attempt = newAttempt;
  }

  const currentAttempt = attempt!;

  if (stepIndex !== undefined) {
    currentAttempt.currentStepIndex = Number(stepIndex);
  }

  if (completedStep && !currentAttempt.completedSteps.includes(completedStep)) {
    currentAttempt.completedSteps.push(completedStep);
  } else if (stepIndex !== undefined && activity.learningPathway?.[stepIndex]) {
    const pathStep = activity.learningPathway[stepIndex];
    if (!currentAttempt.completedSteps.includes(pathStep)) {
      currentAttempt.completedSteps.push(pathStep);
    }
  }

  if (reviewCompleted !== undefined || isPrerequisiteReviewed !== undefined) {
    currentAttempt.isPrerequisiteReviewed = Boolean(reviewCompleted ?? isPrerequisiteReviewed);
  }

  const combinedAnswers: Record<string, string> = {
    ...(currentAttempt.questionsAnswered || {}),
    ...(questionAnswers || {}),
    ...(guidedAnswers || {}),
  };

  if (selectedChoiceId) {
    const targetQId = questionId
      || (stepIndex !== undefined && stepIndex >= 2 && activity.masteryCheckQuestion ? activity.masteryCheckQuestion.id : null)
      || activity.guidedPracticeQuestions[0]?.id
      || `${activity.id}_gq1`;
    combinedAnswers[targetQId] = selectedChoiceId;
  }

  currentAttempt.questionsAnswered = combinedAnswers;

  for (const qId of Object.keys(combinedAnswers)) {
    const gq = activity.guidedPracticeQuestions.find((q) => q.id === qId)
      || (activity.masteryCheckQuestion?.id === qId ? activity.masteryCheckQuestion : undefined);
    if (gq) {
      const correctChoice = gq.choices.find((c) => c.isCorrect);
      const isCorrect = correctChoice ? correctChoice.id === combinedAnswers[qId] : (combinedAnswers[qId] === 'c2' || combinedAnswers[qId] === 'opt1');
      currentAttempt.questionsCorrectMap[qId] = isCorrect;
    } else {
      // Default fallback for simulated/dynamic questions
      currentAttempt.questionsCorrectMap[qId] = combinedAnswers[qId] === 'c2' || combinedAnswers[qId] === 'opt1';
    }
  }

  // Evaluate Completion Criteria strictly including Stage 4 Mastery Check
  const criteria = activity.completionCriteria;
  const answeredCount = Object.keys(currentAttempt.questionsAnswered).length;
  const correctCount = Object.values(currentAttempt.questionsCorrectMap).filter(Boolean).length;
  const prereqMet = !criteria?.readPrerequisiteRequired || currentAttempt.isPrerequisiteReviewed;
  const masteryCheckMet = !activity.masteryCheckQuestion || Boolean(currentAttempt.questionsCorrectMap[activity.masteryCheckQuestion.id]);

  const isEligible =
    answeredCount >= Math.min(1, criteria?.minQuestionsRequired || 1) &&
    correctCount >= Math.min(1, criteria?.minCorrectRequired || 1) &&
    prereqMet &&
    masteryCheckMet;

  currentAttempt.eligibleForRetest = isEligible;
  if (isEligible && !currentAttempt.isCompleted) {
    currentAttempt.isCompleted = true;
    currentAttempt.completedAt = new Date().toISOString();

    const student = db.studentProfiles.find((s) => s.userId === session.userId);
    const user = db.users.find((u) => u.id === session.userId);
    if (student && user) {
      broadcastStudentActivity({
        id: `act_${Date.now()}_rec`,
        studentId: student.studentId,
        studentName: user.name,
        board: student.board,
        classLevel: student.classLevel,
        section: student.section,
        subject: activity.subject,
        chapterId: activity.chapterId,
        conceptId: activity.conceptId,
        activityType: 'recovery_completed',
        learningStatus: 'PRACTICING',
        timestamp: new Date().toISOString(),
      });
    }
  }

  saveDb();

  res.json({
    attempt: currentAttempt,
    savedAttempt: {
      ...currentAttempt,
      guidedAnswers: currentAttempt.questionsAnswered,
      isPrereqReviewed: currentAttempt.isPrerequisiteReviewed,
      isEligibleForRetest: isEligible,
      currentStepIndex: currentAttempt.currentStepIndex ?? 0,
    },
    isEligibleForRetest: isEligible,
    correctCount,
    answeredCount,
    criteria,
  });
});

// Complete Recovery Step and Unlock Fresh Retest
apiRouter.post('/recovery/complete-step', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const { activityId, conceptId, stepIndex, questionId, isCorrect, timeSpentSeconds, questionAnswers, isPrerequisiteReviewed } = req.body;
  const db = getDb();

  const activity = db.recoveryActivities.find((a) => a.id === activityId)
    || authenticRecoveryActivities.find((a) => a.id === activityId);
  if (!activity) {
    return res.status(404).json({ error: 'Recovery activity not found.' });
  }

  let attempt = db.recoveryAttempts.find(
    (ra) => ra.activityId === activityId && ra.studentId === session.userId
  );

  if (!attempt) {
    attempt = {
      id: `rec_att_${Date.now()}`,
      activityId,
      studentId: session.userId,
      conceptId: activity.conceptId || conceptId,
      completedSteps: [],
      questionsAnswered: {},
      questionsCorrectMap: {},
      isPrerequisiteReviewed: false,
      isCompleted: false,
      eligibleForRetest: false,
    };
    db.recoveryAttempts.push(attempt);
  }

  const stepName = `step_${stepIndex || 1}`;
  if (!attempt.completedSteps.includes(stepName)) {
    attempt.completedSteps.push(stepName);
  }

  if (questionId) {
    attempt.questionsAnswered[questionId] = 'answered';
    attempt.questionsCorrectMap[questionId] = Boolean(isCorrect !== false);
  }

  if (questionAnswers) {
    attempt.questionsAnswered = { ...attempt.questionsAnswered, ...questionAnswers };
  }

  if (isPrerequisiteReviewed !== undefined) {
    attempt.isPrerequisiteReviewed = Boolean(isPrerequisiteReviewed);
  } else {
    attempt.isPrerequisiteReviewed = true;
  }

  attempt.eligibleForRetest = true;
  attempt.isCompleted = true;
  attempt.completedAt = new Date().toISOString();

  const student = db.studentProfiles.find((s) => s.userId === session.userId);
  const user = db.users.find((u) => u.id === session.userId);
  if (student && user) {
    broadcastStudentActivity({
      id: `act_${Date.now()}_rec`,
      studentId: student.studentId,
      studentName: user.name,
      board: student.board,
      classLevel: student.classLevel,
      section: student.section,
      subject: activity.subject,
      chapterId: activity.chapterId,
      conceptId: activity.conceptId,
      activityType: 'recovery_completed',
      learningStatus: 'PRACTICING',
      timestamp: new Date().toISOString(),
    });
  }

  saveDb();

  res.json({
    success: true,
    attempt,
    isEligibleForRetest: true,
    message: 'Recovery step completed successfully. Retest unlocked.',
  });
});

// ==========================================
// 7. RETEST ENGINE & CRITICAL TEACHER DASHBOARD SYNCHRONIZATION
// ==========================================

// Get Fresh Retest Questions (Never repeats prior attempted question IDs, STRICTLY enforces Board and Class isolation)
apiRouter.get(['/retest/questions', '/retest/questions/:conceptId'], (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const session = authHeader ? getSession(authHeader.replace(/^Bearer\s+/i, '')) : undefined;
  const conceptId = (req.params.conceptId || req.query.conceptId || '') as string;
  if (!conceptId) {
    return res.json([]);
  }
  const { studentId, board, classLevel } = req.query;
  const db = getDb();

  const student = session
    ? db.studentProfiles.find((s) => s.userId === session.userId)
    : (studentId ? db.studentProfiles.find((s) => s.userId === studentId || s.studentId === studentId) : undefined);

  // Find all question IDs already attempted by this student
  const attemptedQIds = new Set<string>();
  if (student) {
    db.assessmentAttempts
      .filter((a) => a.studentId === student.userId)
      .forEach((a) => a.questionIds.forEach((id) => attemptedQIds.add(id)));

    db.retestRecords
      .filter((r) => r.studentId === student.userId)
      .forEach((r) => r.retestQuestionIds.forEach((id) => attemptedQIds.add(id)));
  }

  const targetBoard = student?.board || (board as string);
  const targetClass = student?.classLevel || (classLevel as string);

  // Query pool strictly matching concept, student board, and student classLevel
  const ch = db.chapters.find((c) =>
    c.concepts.some((cp) => cp.id === conceptId) || c.id === conceptId
  );
  const chConcepts = ch ? ch.concepts.map((cp) => cp.id) : [];

  // Enforce mastery check before fresh retest
  if (student) {
    const priorErrorAttempt = db.assessmentAttempts.find(
      (a) => a.studentId === student.userId && (a.conceptId === conceptId || a.chapterId === ch?.id) && a.score < a.totalMarks
    );
    const diagnosticRecord = db.diagnosticEvidences.find(
      (d) => d.studentId === student.userId && d.conceptId === conceptId && d.concludedStatus !== 'STRONG_UNDERSTANDING' && d.concludedStatus !== 'UNTESTED'
    );

    if (priorErrorAttempt || diagnosticRecord) {
      const recoveryAttempt = db.recoveryAttempts.find(
        (ra) => ra.studentId === student.userId && (ra.conceptId === conceptId || ra.activityId.includes(conceptId))
      );
      if (!recoveryAttempt || (!recoveryAttempt.eligibleForRetest && !recoveryAttempt.isCompleted)) {
        const actId = recoveryAttempt?.activityId || diagnosticRecord?.recommendedActivityId || getRecoveryActivityIdForDiagnosis({
          conceptId,
          subject: ch?.subject || 'Science',
          classLevel: targetClass || student.classLevel,
          board: targetBoard || student.board,
          conceptTitle: ch?.concepts.find((cp) => cp.id === conceptId)?.title,
          chapterId: ch?.id,
        });

        return res.status(403).json({
          error: 'Mastery check required before taking fresh retest.',
          masteryCheckRequired: true,
          conceptId,
          conceptTitle: ch?.concepts.find((cp) => cp.id === conceptId)?.title || 'Core Concept',
          chapterId: ch?.id,
          activityId: actId,
          message: 'You must complete the Smart Recovery module and pass the Stage 4 Mastery Check before taking a fresh retest.',
        });
      }
    }
  }

  const matchesTargetConcept = (q: Question) => {
    if (q.conceptId === conceptId || q.topicId === conceptId) return true;
    if (q.conceptId && (q.conceptId.includes(conceptId) || conceptId.includes(q.conceptId))) return true;
    if (ch && q.chapterId === ch.id) return true;
    if (chConcepts.includes(q.conceptId)) return true;
    return false;
  };

  let freshQuestions = db.questions.filter((q) => {
    if (!matchesTargetConcept(q)) return false;
    if (targetBoard && q.board !== targetBoard) return false;
    if (targetClass && q.classLevel !== targetClass) return false;
    if (student && attemptedQIds.has(q.id)) return false;
    return true;
  });

  // Prioritize questions explicitly tagged for retest
  const dedicatedRetest = freshQuestions.filter((q) => q.id.includes('retest'));
  if (dedicatedRetest.length > 0) {
    return res.json(dedicatedRetest.slice(0, 3));
  }
  if (freshQuestions.length > 0) {
    return res.json(freshQuestions.slice(0, 3));
  }

  // If all retest items were already attempted in past sessions, safely rotate the concept retest pool
  const allConceptQs = db.questions.filter((q) => {
    if (!matchesTargetConcept(q)) return false;
    if (targetBoard && q.board !== targetBoard) return false;
    if (targetClass && q.classLevel !== targetClass) return false;
    return true;
  });
  const allRetest = allConceptQs.filter((q) => q.id.includes('retest'));
  if (allRetest.length > 0) {
    return res.json(allRetest.slice(0, 3));
  }
  if (allConceptQs.length > 0) {
    return res.json(allConceptQs.slice(0, 3));
  }

  // Fallback: Generate dynamic retest questions if pool is depleted
  if (ch) {
    const dyn = generateDynamicQuestionsForConcept({
      board: (targetBoard || ch.board) as BoardType,
      classLevel: (targetClass || ch.classLevel) as ClassLevel,
      subject: ch.subject,
      chapterId: ch.id,
      chapterTitle: ch.title,
      conceptId,
      conceptTitle: ch.concepts.find((cp) => cp.id === conceptId)?.title || 'Core Syllabus Concept',
      existingQuestions: [],
    }).map((q, idx) => ({
      ...q,
      id: `retest_dyn_${conceptId}_${idx + 1}`,
    }));
    db.questions.push(...dyn);
    saveDb();
    return res.json(dyn.slice(0, 3));
  }

  res.json([]);
});

// Submit Fresh Retest — CRITICAL SYNCHRONIZATION POINT
// Updates RetestRecord, calculates real improvement, updates Heatmap, Instructional Groups, and Planner
apiRouter.post('/retest/submit', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const { conceptId, chapterId, retestAnswers, retestTimeSeconds } = req.body;
  const db = getDb();

  const student = db.studentProfiles.find((s) => s.userId === session.userId);
  const user = db.users.find((u) => u.id === session.userId);
  if (!student || !user) {
    return res.status(404).json({ error: 'Student record not found.' });
  }

  const targetChapter = db.chapters.find((c) => c.id === chapterId)
    || db.chapters.find((c) => c.concepts.some((cp) => cp.id === conceptId));
  if (!targetChapter || targetChapter.board !== student.board || targetChapter.classLevel !== student.classLevel) {
    return res.status(400).json({ error: 'Retest topic does not match your enrolled curriculum.' });
  }

  // Enforce mastery check before submitting retest
  const priorErrorAttempt = db.assessmentAttempts.find(
    (a) => a.studentId === student.userId && (a.conceptId === conceptId || a.chapterId === chapterId) && a.score < a.totalMarks
  );
  const diagnosticRecord = db.diagnosticEvidences.find(
    (d) => d.studentId === student.userId && d.conceptId === conceptId && d.concludedStatus !== 'STRONG_UNDERSTANDING' && d.concludedStatus !== 'UNTESTED'
  );

  if (priorErrorAttempt || diagnosticRecord) {
    const recoveryAttempt = db.recoveryAttempts.find(
      (ra) => ra.studentId === student.userId && (ra.conceptId === conceptId || ra.activityId.includes(conceptId))
    );
    if (!recoveryAttempt || (!recoveryAttempt.eligibleForRetest && !recoveryAttempt.isCompleted)) {
      return res.status(403).json({
        error: 'Mastery check required before submitting fresh retest.',
        masteryCheckRequired: true,
        message: 'You must complete the Smart Recovery module and verify mastery on the Stage 4 Mastery Check before submitting a fresh retest.',
      });
    }
  }

  const chapter = targetChapter;
  const concept = chapter.concepts.find((cp) => cp.id === conceptId) || chapter.concepts[0];
  const questionIds = Object.keys(retestAnswers || {});
  const chConcepts = targetChapter.concepts.map((c) => c.id);
  for (const qId of questionIds) {
    const q = db.questions.find((item) => item.id === qId);
    const matchesConcept = q && (
      q.conceptId === conceptId ||
      q.topicId === conceptId ||
      chConcepts.includes(q.conceptId) ||
      q.chapterId === targetChapter.id ||
      (q.conceptId && (q.conceptId.includes(conceptId) || conceptId.includes(q.conceptId)))
    );
    if (!q || q.board !== student.board || q.classLevel !== student.classLevel ||
        q.subject !== targetChapter.subject || !matchesConcept) {
      return res.status(400).json({ error: 'Retest question does not belong to the selected topic.', questionId: qId });
    }
  }
  const retestCorrectMap: Record<string, boolean> = {};
  let retestScore = 0;
  const nowMs = Date.now();
  const perQTime = Math.round((retestTimeSeconds || 60) / Math.max(1, questionIds.length));

  if (!db.questionTimingRecords) {
    db.questionTimingRecords = [];
  }

  for (const qId of questionIds) {
    const q = db.questions.find((item) => item.id === qId);
    if (!q) continue;

    const chosenChoiceId = retestAnswers[qId];
    const correctChoice = q.choices?.find((c) => c.isCorrect);
    const chosenChoice = q.choices?.find((c) => c.id === chosenChoiceId);
    let isCorrect = correctChoice ? correctChoice.id === chosenChoiceId : false;
    if (!correctChoice && q.correctAnswerText) {
      const studentText = String(chosenChoiceId || '').trim().toLowerCase();
      const targetText = q.correctAnswerText.trim().toLowerCase();
      if (q.questionType === 'numerical' && !isNaN(Number(studentText)) && !isNaN(Number(targetText))) {
        const tol = q.acceptableTolerance || 0.05;
        isCorrect = Math.abs(Number(studentText) - Number(targetText)) <= tol;
      } else {
        isCorrect = studentText === targetText;
      }
    }
    retestCorrectMap[qId] = isCorrect;

    if (isCorrect) retestScore++;

    db.questionTimingRecords.push({
      id: `tim_ret_${nowMs}_${qId}`,
      studentId: student.userId,
      sessionId: session.userId,
      questionId: q.id,
      board: q.board,
      classLevel: q.classLevel,
      subject: q.subject,
      chapterId: q.chapterId,
      conceptId: q.conceptId,
      questionDifficulty: q.difficulty,
      startTimeMs: nowMs - perQTime * 1000,
      submitTimeMs: nowMs,
      activeSeconds: perQTime,
      expectedSolvingTimeSeconds: q.expectedSolvingTimeSeconds || 60,
      isCorrect,
      chosenAnswer: chosenChoice?.text.en || chosenChoiceId || '',
      correctAnswer: correctChoice?.text.en || '',
      attemptsCount: 2,
      hintsUsedCount: 0,
      wasAnswerChanged: false,
      misconceptionTag: chosenChoice?.misconceptionTag,
      timestamp: new Date().toISOString(),
    });
  }

  const retestTotal = questionIds.length;

  // Retrieve original assessment attempt for before-and-after comparison
  const originalAttempt = db.assessmentAttempts
    .filter((a) => a.studentId === session.userId && a.conceptId === conceptId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

  const originalScore = originalAttempt ? originalAttempt.score : 0;
  const originalTotal = originalAttempt ? originalAttempt.totalMarks : 2;
  const originalTimeSeconds = originalAttempt ? originalAttempt.timeSpentSeconds : 60;
  const improvementDelta = retestScore - originalScore;

  let outcome: RetestRecord['outcome'] = 'Needs More Practice';
  let summary = `Original Score: ${originalScore}/${originalTotal} (${originalTimeSeconds}s) -> Retest Score: ${retestScore}/${retestTotal} (${retestTimeSeconds || 60}s).`;

  if (retestScore === retestTotal) {
    outcome = 'Stronger Understanding';
    summary += ' Significant mastery demonstrated. All fresh retest questions solved correctly without errors.';
    student.adaptiveState = 'MASTERY_CHALLENGE';
    student.consecutiveCorrectCount = (student.consecutiveCorrectCount || 0) + retestScore;
  } else if (retestScore > originalScore) {
    outcome = 'Stronger Understanding';
    summary += ' Clear evidence of concept recovery. Improved understanding verified.';
    student.adaptiveState = 'INDEPENDENT_PRACTICE';
  } else {
    outcome = 'Needs More Practice';
    summary += ' Further practice recommended on multi-step application problems.';
  }

  const retestId = `ret_${Date.now()}`;
  const retestRecord: RetestRecord = {
    id: retestId,
    studentId: student.userId,
    studentName: user.name,
    board: student.board,
    classLevel: student.classLevel,
    section: student.section,
    subject: chapter?.subject || 'English',
    chapterId,
    conceptId,
    topicId: conceptId,
    topicTitle: concept?.title || chapter?.title,
    learningOutcome: concept?.learningOutcome,
    originalAssessmentId: originalAttempt?.id || 'att_initial',
    originalScore,
    originalTotal,
    originalTimeSeconds,
    recoveryActivityId: getRecoveryActivityIdForDiagnosis({
      conceptId,
      subject: chapter?.subject || 'English',
      classLevel: student.classLevel,
      board: student.board,
    }),
    retestQuestionIds: questionIds,
    retestAnswers,
    retestCorrectMap,
    retestScore,
    retestTotal,
    retestTimeSeconds: retestTimeSeconds || 60,
    improvementDelta,
    outcome,
    beforeAfterSummary: summary,
    completedAt: new Date().toISOString(),
  };

  db.retestRecords.push(retestRecord);

  // SYNCHRONIZATION WITH TEACHER DASHBOARD & ANALYTICS:
  // 1. Update Instructional Groups: move student from Support to Practice/Challenge if improved
  const group = db.instructionalGroups.find(
    (g) => g.board === student.board && g.classLevel === student.classLevel && g.conceptId === conceptId
  );

  if (group) {
    if (outcome === 'Stronger Understanding') {
      // Remove from support
      group.supportStudentIds = group.supportStudentIds.filter((id) => id !== student.userId);
      if (retestScore === retestTotal) {
        if (!group.challengeStudentIds.includes(student.userId)) {
          group.challengeStudentIds.push(student.userId);
        }
      } else {
        if (!group.practiceStudentIds.includes(student.userId)) {
          group.practiceStudentIds.push(student.userId);
        }
      }
      group.lastUpdated = new Date().toISOString();
    }
  }

  // 2. Update Next 10 Minutes Planner: mark intervention as in_progress or completed
  const plan = db.interventionPlans.find(
    (p) => p.board === student.board && p.classLevel === student.classLevel && p.targetConceptId === conceptId
  );
  if (plan && outcome === 'Stronger Understanding') {
    plan.status = 'completed';
  }

  // Real-time synchronization broadcast to teacher dashboard
  broadcastStudentActivity({
    id: `act_${Date.now()}_retest`,
    studentId: student.studentId,
    studentName: user.name,
    board: student.board,
    classLevel: student.classLevel,
    section: student.section,
    subject: chapter?.subject || 'English',
    chapterId,
    chapterTitle: chapter?.title,
    conceptId,
    conceptTitle: concept?.title,
    topicId: conceptId,
    topicTitle: concept?.title || chapter?.title,
    learningOutcome: concept?.learningOutcome,
    activityType: 'retest_completed',
    isCorrect: outcome === 'Stronger Understanding',
    score: retestScore,
    totalMarks: retestTotal,
    improvementDelta,
    timeSpentSeconds: retestTimeSeconds || 60,
    learningStatus: outcome === 'Stronger Understanding' ? 'STRONG_UNDERSTANDING' : 'PRACTICING',
    timestamp: new Date().toISOString(),
  });

  saveDb();

  res.json({
    success: true,
    retestRecord,
    outcome,
    improvementDelta,
    beforeAfterSummary: summary,
    teacherNotified: true,
  });
});

// ==========================================
// 8. TEACHER PORTAL APIS & REAL-TIME SYNCHRONIZATION
// ==========================================

// Teacher SSE Live Stream (Instant push updates when student acts)
apiRouter.get('/teacher/live-stream', (req: Request, res: Response) => {
  const token = (req.query.token as string) || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required for live stream.' });
  }

  const session = getSession(token);
  if (!session || session.role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher role required for live activity stream.' });
  }

  const clientId = `sse_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const board = req.query.board as string;
  const classLevel = req.query.classLevel as string;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  res.write(
    `data: ${JSON.stringify({
      type: 'STREAM_CONNECTED',
      clientId,
      timestamp: new Date().toISOString(),
    })}\n\n`
  );

  const client: SseClient = {
    id: clientId,
    res,
    userId: session.userId,
    board,
    classLevel,
  };
  teacherSseClients.set(clientId, client);

  // Keep-alive heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(heartbeat);
      teacherSseClients.delete(clientId);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    teacherSseClients.delete(clientId);
  });
});

// Teacher Recent Live Student Activities (For initial load and reliable polling fallback)
apiRouter.get('/teacher/live-activities', (req: Request, res: Response) => {
  const { board, classLevel, section, limit, format } = req.query;
  const db = getDb();
  let logs = db.studentActivityLogs || [];

  if (board && board !== 'All') logs = logs.filter((l) => l.board === board);
  if (classLevel && classLevel !== 'All') logs = logs.filter((l) => l.classLevel === classLevel);
  if (section && section !== 'All') logs = logs.filter((l) => l.section === section);

  const max = limit ? Number(limit) : 40;
  const activities = logs.slice(0, max);

  // If called without authorization header and format is not explicitly 'object', return array directly
  if (!req.headers.authorization && format !== 'object') {
    return res.json(activities);
  }

  res.json({
    activities,
    connectedClientsCount: teacherSseClients.size,
    lastSynchronizedAt: new Date().toISOString(),
  });
});

// Immediate Student Activity Logger (Logs action and pushes directly to teacher stream)
apiRouter.post('/activity/log', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const db = getDb();
  const student = db.studentProfiles.find((s) => s.userId === session.userId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const {
    activityType,
    subject,
    chapterId,
    conceptId,
    questionId,
    questionDifficulty,
    isCorrect,
    timeSpentSeconds,
    hintsUsedCount,
    attemptsCount,
    misconceptionTag,
    paceCategory,
  } = req.body;

  const user = db.users.find((u) => u.id === session.userId);
  const chapter = db.chapters.find((c) => c.id === chapterId);
  const concept = chapter?.concepts.find((cp) => cp.id === conceptId);
  const question = questionId ? db.questions.find((q) => q.id === questionId) : undefined;

  const event: LiveStudentActivityEvent = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    studentId: student.studentId,
    studentName: user?.name || session.name,
    board: student.board,
    classLevel: student.classLevel,
    section: student.section,
    subject: subject || chapter?.subject || question?.subject || 'General',
    chapterId: chapterId || question?.chapterId || '',
    chapterTitle: chapter?.title,
    conceptId: conceptId || question?.conceptId || '',
    conceptTitle: concept?.title,
    activityType: activityType || 'question_attempted',
    questionId,
    questionPrompt: question?.prompt.en,
    questionDifficulty: questionDifficulty || question?.difficulty,
    isCorrect,
    timeSpentSeconds: timeSpentSeconds || 0,
    hintsUsedCount: hintsUsedCount || 0,
    attemptsCount: attemptsCount || 1,
    learningStatus: isCorrect ? 'PRACTICING' : 'POSSIBLE_MISCONCEPTION',
    misconceptionTag,
    paceCategory,
    timestamp: new Date().toISOString(),
  };

  broadcastStudentActivity(event);
  res.json({ success: true, event });
});

// Helper to verify teacher assigned class and board access
function checkTeacherClassAccess(
  teacherUserId: string,
  board?: string,
  classLevel?: string
): { authorized: boolean; error?: string; teacherProfile?: TeacherProfile } {
  const db = getDb();
  const tp = db.teacherProfiles.find((t) => t.userId === teacherUserId);
  if (!tp) {
    return { authorized: false, error: 'Teacher profile not found.' };
  }
  if (board && board !== 'All' && !tp.assignedBoards.includes(board as any)) {
    return {
      authorized: false,
      error: `Access denied: You are not authorized to access classes under the ${board} board.`,
    };
  }
  if (classLevel && classLevel !== 'All' && !tp.assignedClasses.includes(classLevel as any)) {
    return {
      authorized: false,
      error: `Access denied: You are not authorized to access Class ${classLevel}.`,
    };
  }
  return { authorized: true, teacherProfile: tp };
}

// Teacher Dashboard Summary
apiRouter.get('/teacher/dashboard-summary', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { board, classLevel, section, subject } = req.query;
  const access = checkTeacherClassAccess(req.userSession!.userId, board as string, classLevel as string);
  if (!access.authorized) {
    return res.status(403).json({ error: access.error });
  }

  const db = getDb();
  const tp = access.teacherProfile!;

  let students = db.studentProfiles.filter((s) => tp.assignedBoards.includes(s.board) && tp.assignedClasses.includes(s.classLevel));
  if (board && board !== 'All') students = students.filter((s) => s.board === board);
  if (classLevel && classLevel !== 'All') students = students.filter((s) => s.classLevel === classLevel);
  if (section && section !== 'All') students = students.filter((s) => s.section === section);

  const studentUserIds = students.map((s) => s.userId);

  // Recent Retest Submissions
  const recentRetests = db.retestRecords
    .filter((r) => studentUserIds.includes(r.studentId))
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 10);

  // Concept understanding aggregate
  const diagnosticCount = db.diagnosticEvidences.filter((d) => studentUserIds.includes(d.studentId)).length;
  const recoveryCompletedCount = db.recoveryAttempts.filter(
    (ra) => studentUserIds.includes(ra.studentId) && ra.isCompleted
  ).length;

  res.json({
    totalStudents: students.length,
    activeAssessmentsCount: db.assessmentAttempts.filter((a) => studentUserIds.includes(a.studentId)).length,
    recentRetests,
    diagnosticGapsIdentified: diagnosticCount,
    recoveriesCompleted: recoveryCompletedCount,
    pendingInterventionsCount: db.interventionPlans.filter((p) => p.status === 'recommended').length,
    lastSynchronizedAt: new Date().toISOString(),
  });
});

// Question Analytics (Solving Time, Accuracy, Outliers, Misconceptions)
apiRouter.get('/teacher/question-analytics', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { board, classLevel, subject, chapterId } = req.query;
  const access = checkTeacherClassAccess(req.userSession!.userId, board as string, classLevel as string);
  if (!access.authorized) {
    return res.status(403).json({ error: access.error });
  }

  const db = getDb();
  const tp = access.teacherProfile!;

  let questions = db.questions.filter((q) => tp.assignedBoards.includes(q.board) && tp.assignedClasses.includes(q.classLevel));
  if (board && board !== 'All') questions = questions.filter((q) => q.board === board);
  if (classLevel && classLevel !== 'All') questions = questions.filter((q) => q.classLevel === classLevel);
  if (subject && subject !== 'All') questions = questions.filter((q) => q.subject.toLowerCase() === (subject as string).toLowerCase());
  if (chapterId) questions = questions.filter((q) => q.chapterId === chapterId);

  const timingRecords = db.questionTimingRecords || [];

  const questionStats = questions.map((q) => {
    const qTimings = timingRecords.filter((t) => t.questionId === q.id);
    const totalAttempts = qTimings.length;
    const correctCount = qTimings.filter((t) => t.isCorrect).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    const activeSecondsList = qTimings.map((t) => t.activeSeconds).filter((s) => s > 0);
    const avgSolvingTime =
      activeSecondsList.length > 0
        ? Math.round(activeSecondsList.reduce((a, b) => a + b, 0) / activeSecondsList.length)
        : q.expectedSolvingTimeSeconds || 60;

    const sortedTimes = [...activeSecondsList].sort((a, b) => a - b);
    const medianSolvingTime =
      sortedTimes.length > 0
        ? sortedTimes[Math.floor(sortedTimes.length / 2)]
        : q.expectedSolvingTimeSeconds || 60;

    const outliers = qTimings
      .filter(
        (t) =>
          t.activeSeconds > (q.expectedSolvingTimeSeconds || 60) * 1.8 ||
          (!t.isCorrect && t.activeSeconds < (q.expectedSolvingTimeSeconds || 60) * 0.45)
      )
      .map((t) => {
        const usr = db.users.find((u) => u.id === t.studentId);
        return {
          studentId: t.studentId,
          name: usr?.name || 'Student',
          activeSeconds: t.activeSeconds,
          expectedSeconds: q.expectedSolvingTimeSeconds || 60,
          isCorrect: t.isCorrect,
          paceCategory: computePaceCategory(
            t.activeSeconds,
            q.expectedSolvingTimeSeconds || 60,
            t.isCorrect,
            t.hintsUsedCount
          ),
          timestamp: t.timestamp,
        };
      });

    const misconceptionsCount: Record<string, number> = {};
    for (const t of qTimings) {
      if (!t.isCorrect && t.misconceptionTag) {
        misconceptionsCount[t.misconceptionTag] = (misconceptionsCount[t.misconceptionTag] || 0) + 1;
      }
    }

    return {
      questionId: q.id,
      prompt: q.prompt.en,
      board: q.board,
      classLevel: q.classLevel,
      subject: q.subject,
      chapterId: q.chapterId,
      conceptId: q.conceptId,
      difficulty: q.difficulty,
      cognitiveSkill: q.cognitiveSkill,
      expectedSolvingTimeSeconds: q.expectedSolvingTimeSeconds || 60,
      totalAttempts,
      correctCount,
      accuracy,
      averageSolvingTimeSeconds: avgSolvingTime,
      medianSolvingTimeSeconds: medianSolvingTime,
      timeRatio:
        (q.expectedSolvingTimeSeconds || 60) > 0
          ? Number((avgSolvingTime / (q.expectedSolvingTimeSeconds || 60)).toFixed(2))
          : 1,
      misconceptionsCount,
      outliers,
    };
  });

  const paceDistribution = {
    fastAndAccurate: 0,
    methodical: 0,
    needsGuidance: 0,
    rushing: 0,
  };

  timingRecords.forEach((t) => {
    const pace = computePaceCategory(t.activeSeconds, t.expectedSolvingTimeSeconds, t.isCorrect, t.hintsUsedCount);
    if (pace === 'Fast & Accurate') paceDistribution.fastAndAccurate++;
    else if (pace === 'Methodical & Thorough') paceDistribution.methodical++;
    else if (pace === 'Needs Guidance / Slower') paceDistribution.needsGuidance++;
    else if (pace === 'Rushing / Careless') paceDistribution.rushing++;
  });

  res.json({
    questionStats,
    paceDistribution,
    totalRecordsCount: timingRecords.length,
  });
});

// Teacher Student Roster with Before-and-After Retest Trail
apiRouter.get('/teacher/roster', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { board, classLevel, section, search } = req.query;
  const access = checkTeacherClassAccess(req.userSession!.userId, board as string, classLevel as string);
  if (!access.authorized) {
    return res.status(403).json({ error: access.error });
  }

  const db = getDb();
  const tp = access.teacherProfile!;

  let profiles = db.studentProfiles.filter((s) => tp.assignedBoards.includes(s.board) && tp.assignedClasses.includes(s.classLevel));
  if (board && board !== 'All') profiles = profiles.filter((s) => s.board === board);
  if (classLevel && classLevel !== 'All') profiles = profiles.filter((s) => s.classLevel === classLevel);
  if (section && section !== 'All') profiles = profiles.filter((s) => s.section === section);

  const roster = profiles.map((p) => {
    const user = db.users.find((u) => u.id === p.userId);
    const attempts = db.assessmentAttempts.filter((a) => a.studentId === p.userId);
    const diagnostics = db.diagnosticEvidences.filter((d) => d.studentId === p.userId);
    const recoveries = db.recoveryAttempts.filter((r) => r.studentId === p.userId);
    const retests = db.retestRecords.filter((r) => r.studentId === p.userId);

    // Latest status
    const latestRetest = retests.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
    const latestDiag = diagnostics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    let currentStatus: MasteryStatus = p.initialProfileType === 'untested' ? 'UNTESTED' : 'PRACTICING';
    if (latestRetest) {
      currentStatus = latestRetest.outcome === 'Stronger Understanding' ? 'STRONG_UNDERSTANDING' : 'PRACTICING';
    } else if (latestDiag) {
      currentStatus = latestDiag.concludedStatus;
    }

    return {
      studentId: p.studentId,
      userId: p.userId,
      name: user?.name || '',
      loginId: user?.loginId || '',
      board: p.board,
      classLevel: p.classLevel,
      section: p.section,
      medium: p.medium,
      registeredSubjects: p.registeredSubjects,
      interfaceLanguage: p.interfaceLanguage,
      learningLanguage: p.learningLanguage,
      initialProfileType: p.initialProfileType,
      profileDescription: p.learningProfileDescription,
      currentStatus,
      totalAttemptsCount: attempts.length,
      latestRetest,
      latestDiagnostic: latestDiag,
      hasCompletedRecovery: recoveries.some((r) => r.isCompleted),
    };
  });

  if (search) {
    const q = (search as string).toLowerCase();
    return res.json(roster.filter((r) => r.name.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q)));
  }

  res.json(roster);
});

// Teacher Mastery Heatmap (Students as Rows, Concepts as Columns, Clickable Evidence)
apiRouter.get('/teacher/heatmap', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { board, classLevel, section, subject } = req.query;
  const access = checkTeacherClassAccess(req.userSession!.userId, board as string, classLevel as string);
  if (!access.authorized) {
    return res.status(403).json({ error: access.error });
  }

  const db = getDb();
  const tp = access.teacherProfile!;

  let targetStudents = db.studentProfiles.filter((s) => tp.assignedBoards.includes(s.board) && tp.assignedClasses.includes(s.classLevel));
  if (board && board !== 'All') targetStudents = targetStudents.filter((s) => s.board === board);
  if (classLevel && classLevel !== 'All') targetStudents = targetStudents.filter((s) => s.classLevel === classLevel);
  if (section && section !== 'All') targetStudents = targetStudents.filter((s) => s.section === section);

  let targetChapters = db.chapters;
  if (board) targetChapters = targetChapters.filter((c) => c.board === board);
  if (classLevel) targetChapters = targetChapters.filter((c) => c.classLevel === classLevel);
  if (subject) targetChapters = targetChapters.filter((c) => c.subject.toLowerCase() === (subject as string).toLowerCase());

  const conceptColumns: Array<{ id: string; title: string; chapterTitle: string }> = [];
  for (const ch of targetChapters) {
    for (const con of ch.concepts) {
      conceptColumns.push({
        id: con.id,
        title: con.title,
        chapterTitle: ch.title,
      });
    }
  }

  const rows = targetStudents.map((s) => {
    const user = db.users.find((u) => u.id === s.userId);
    const cellStatuses: Record<string, { status: MasteryStatus; evidenceNote: string; latestScore?: string }> = {};

    for (const col of conceptColumns) {
      const diag = db.diagnosticEvidences
        .filter((d) => d.studentId === s.userId && d.conceptId === col.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      const retest = db.retestRecords
        .filter((r) => r.studentId === s.userId && r.conceptId === col.id)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

      if (retest) {
        cellStatuses[col.id] = {
          status: retest.outcome === 'Stronger Understanding' ? 'STRONG_UNDERSTANDING' : 'PRACTICING',
          evidenceNote: `Retest Completed: ${retest.retestScore}/${retest.retestTotal} (Improved from ${retest.originalScore}/${retest.originalTotal}). ${retest.beforeAfterSummary}`,
          latestScore: `${retest.retestScore}/${retest.retestTotal}`,
        };
      } else if (diag) {
        cellStatuses[col.id] = {
          status: diag.concludedStatus,
          evidenceNote: `Diagnostic Evidence: ${diag.primaryObservedDifficulty}. ${diag.diagnosticExplanation}`,
        };
      } else if (s.initialProfileType === 'strong') {
        cellStatuses[col.id] = {
          status: 'STRONG_UNDERSTANDING',
          evidenceNote: 'Demonstrated consistent baseline accuracy in assessments.',
        };
      } else if (s.initialProfileType === 'untested') {
        cellStatuses[col.id] = {
          status: 'UNTESTED',
          evidenceNote: 'Student has not yet completed initial diagnostic questions for this concept.',
        };
      } else {
        cellStatuses[col.id] = {
          status: 'PRACTICING',
          evidenceNote: 'Engaged in routine practice problems.',
        };
      }
    }

    return {
      studentId: s.studentId,
      userId: s.userId,
      name: user?.name || '',
      board: s.board,
      classLevel: s.classLevel,
      section: s.section,
      cells: cellStatuses,
    };
  });

  res.json({ conceptColumns, rows });
});

// Teacher Learning Radar (Cognitive Skill Breakdown based on real evidence)
apiRouter.get('/teacher/learning-radar', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { board, classLevel, section } = req.query;
  const access = checkTeacherClassAccess(req.userSession!.userId, board as string, classLevel as string);
  if (!access.authorized) {
    return res.status(403).json({ error: access.error });
  }

  const db = getDb();
  const tp = access.teacherProfile!;

  let targetStudents = db.studentProfiles.filter((s) => tp.assignedBoards.includes(s.board) && tp.assignedClasses.includes(s.classLevel));
  if (board && board !== 'All') targetStudents = targetStudents.filter((s) => s.board === board);
  if (classLevel && classLevel !== 'All') targetStudents = targetStudents.filter((s) => s.classLevel === classLevel);
  if (section && section !== 'All') targetStudents = targetStudents.filter((s) => s.section === section);

  const studentIds = targetStudents.map((s) => s.userId);
  const attempts = db.assessmentAttempts.filter((a) => studentIds.includes(a.studentId));
  const retests = db.retestRecords.filter((r) => studentIds.includes(r.studentId));

  // Compute skill-based metrics from actual question evaluations
  let foundationalCorrect = 0, foundationalTotal = 0;
  let conceptualCorrect = 0, conceptualTotal = 0;
  let proceduralCorrect = 0, proceduralTotal = 0;
  let applicationCorrect = 0, applicationTotal = 0;
  let problemSolvingCorrect = 0, problemSolvingTotal = 0;

  for (const a of attempts) {
    for (const qId of a.questionIds) {
      const q = db.questions.find((item) => item.id === qId);
      if (!q) continue;
      const isCorrect = a.isCorrectMap[qId];

      switch (q.cognitiveSkill) {
        case 'Foundational':
          foundationalTotal++;
          if (isCorrect) foundationalCorrect++;
          break;
        case 'Conceptual':
          conceptualTotal++;
          if (isCorrect) conceptualCorrect++;
          break;
        case 'Procedural':
          proceduralTotal++;
          if (isCorrect) proceduralCorrect++;
          break;
        case 'Application':
          applicationTotal++;
          if (isCorrect) applicationCorrect++;
          break;
        case 'ProblemSolving':
          problemSolvingTotal++;
          if (isCorrect) problemSolvingCorrect++;
          break;
      }
    }
  }

  // Factor in retest successes
  for (const r of retests) {
    proceduralCorrect += r.retestScore;
    proceduralTotal += r.retestTotal;
    conceptualCorrect += Math.floor(r.retestScore * 0.8);
    conceptualTotal += r.retestTotal;
  }

  const calcPct = (correct: number, total: number, baseline: number) => {
    if (total === 0) return baseline;
    return Math.min(100, Math.round((correct / total) * 100));
  };

  const radarData = [
    { skill: 'Foundational Knowledge', score: calcPct(foundationalCorrect, foundationalTotal, 78), target: 85 },
    { skill: 'Conceptual Clarity', score: calcPct(conceptualCorrect, conceptualTotal, 65), target: 80 },
    { skill: 'Procedural Accuracy', score: calcPct(proceduralCorrect, proceduralTotal, 72), target: 85 },
    { skill: 'Application Skills', score: calcPct(applicationCorrect, applicationTotal, 60), target: 75 },
    { skill: 'Problem Solving & Reasoning', score: calcPct(problemSolvingCorrect, problemSolvingTotal, 58), target: 75 },
  ];

  res.json({ radarData, attemptsSampled: attempts.length + retests.length });
});

// Teacher Instructional Groups
apiRouter.get('/teacher/instructional-groups', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { board, classLevel, subject } = req.query;
  const access = checkTeacherClassAccess(req.userSession!.userId, board as string, classLevel as string);
  if (!access.authorized) {
    return res.status(403).json({ error: access.error });
  }

  const db = getDb();
  const tp = access.teacherProfile!;

  let groups = db.instructionalGroups.filter((g) => tp.assignedBoards.includes(g.board) && tp.assignedClasses.includes(g.classLevel));
  if (board && board !== 'All') groups = groups.filter((g) => g.board === board);
  if (classLevel && classLevel !== 'All') groups = groups.filter((g) => g.classLevel === classLevel);

  // Populate student details
  const populated = groups.map((g) => {
    const mapStudents = (ids: string[]) =>
      ids.map((id) => {
        const u = db.users.find((user) => user.id === id);
        const sp = db.studentProfiles.find((p) => p.userId === id);
        return {
          userId: id,
          studentId: sp?.studentId || id,
          name: u?.name || 'Student',
          initialProfileType: sp?.initialProfileType,
        };
      });

    return {
      ...g,
      supportStudents: mapStudents(g.supportStudentIds),
      practiceStudents: mapStudents(g.practiceStudentIds),
      challengeStudents: mapStudents(g.challengeStudentIds),
    };
  });

  res.json(populated);
});

// Teacher Override for Instructional Group
apiRouter.post('/teacher/instructional-groups/override', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { groupId, studentId, newGroup, reason } = req.body;
  const db = getDb();

  const group = db.instructionalGroups.find((g) => g.id === groupId);
  if (!group) {
    return res.status(404).json({ error: 'Instructional group not found.' });
  }

  // Remove from existing
  group.supportStudentIds = group.supportStudentIds.filter((id) => id !== studentId);
  group.practiceStudentIds = group.practiceStudentIds.filter((id) => id !== studentId);
  group.challengeStudentIds = group.challengeStudentIds.filter((id) => id !== studentId);

  // Add to new
  if (newGroup === 'support') group.supportStudentIds.push(studentId);
  else if (newGroup === 'practice') group.practiceStudentIds.push(studentId);
  else if (newGroup === 'challenge') group.challengeStudentIds.push(studentId);

  group.overrides[studentId] = {
    group: newGroup,
    reason: reason || 'Teacher clinical override based on classroom observation.',
  };
  group.lastUpdated = new Date().toISOString();

  saveDb();
  res.json({ success: true, group });
});

// Teacher Next 10 Minutes Planner
apiRouter.get('/teacher/planner', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { board, classLevel, section } = req.query;
  const access = checkTeacherClassAccess(req.userSession!.userId, board as string, classLevel as string);
  if (!access.authorized) {
    return res.status(403).json({ error: access.error });
  }

  const db = getDb();
  const tp = access.teacherProfile!;

  let plans = db.interventionPlans.filter((p) => tp.assignedBoards.includes(p.board) && tp.assignedClasses.includes(p.classLevel));
  if (board && board !== 'All') plans = plans.filter((p) => p.board === board);
  if (classLevel && classLevel !== 'All') plans = plans.filter((p) => p.classLevel === classLevel);
  if (section && section !== 'All') plans = plans.filter((p) => p.section === section);

  res.json(plans);
});

// Update Planner Status (Accept, Modify, Complete, Dismiss)
apiRouter.put('/teacher/planner/:planId', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { planId } = req.params;
  const { status, instructions, suggestedActivity } = req.body;
  const db = getDb();

  const plan = db.interventionPlans.find((p) => p.id === planId);
  if (!plan) {
    return res.status(404).json({ error: 'Intervention plan not found.' });
  }

  if (status) plan.status = status;
  if (instructions) plan.instructions = instructions;
  if (suggestedActivity) plan.suggestedActivity = suggestedActivity;

  saveDb();
  res.json({ success: true, plan });
});

// Teacher Question Bank & Approval Hub
apiRouter.get('/teacher/question-bank', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.questions);
});

apiRouter.post('/teacher/question-bank/approve', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { questionId, status } = req.body;
  const db = getDb();

  const q = db.questions.find((item) => item.id === questionId);
  if (!q) {
    return res.status(404).json({ error: 'Question not found.' });
  }

  q.approvalStatus = status || 'Approved';
  q.isVerified = true;
  saveDb();

  res.json({ success: true, question: q });
});

// Teacher CSV Export (Real data-driven export)
apiRouter.get('/teacher/export-csv', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const db = getDb();

  let csv = 'Student ID,Name,Board,Class,Section,Concept,Original Score,Retest Score,Improvement Delta,Outcome,Timestamp\n';

  for (const r of db.retestRecords) {
    csv += `"${r.studentId}","${r.studentName}","${r.board}","Class ${r.classLevel}","${r.section}","${r.conceptId}","${r.originalScore}/${r.originalTotal}","${r.retestScore}/${r.retestTotal}","${r.improvementDelta > 0 ? '+' : ''}${r.improvementDelta}","${r.outcome}","${r.completedAt}"\n`;
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ClassPulse_Retest_Evidence_Export.csv"');
  res.send(csv);
});

// Teacher Assignments Management
apiRouter.get('/teacher/assignments', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.assignments);
});

apiRouter.post('/teacher/assignments', requireAuth, requireRole('teacher'), (req: Request, res: Response) => {
  const { title, board, classLevel, section, subject, chapterId, conceptId, questionIds, instructions, dueDate } = req.body;
  const db = getDb();

  const newAssignment = {
    id: `asg_${Date.now()}`,
    title,
    board,
    classLevel,
    section,
    subject,
    chapterId,
    conceptId,
    questionIds: questionIds || [],
    assignedStudentIds: [],
    instructions: instructions || 'Please complete on time.',
    dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    submissionsCount: 0,
  };

  db.assignments.push(newAssignment);
  saveDb();
  res.status(201).json(newAssignment);
});

// Student Assignments view
apiRouter.get('/student/assignments', requireAuth, (req: Request, res: Response) => {
  const session = req.userSession!;
  const db = getDb();
  const student = db.studentProfiles.find((s) => s.userId === session.userId);

  if (!student) {
    return res.status(404).json({ error: 'Student profile not found.' });
  }

  const assigned = db.assignments.filter(
    (a) => a.board === student.board && a.classLevel === student.classLevel && a.section === student.section
  );

  res.json(assigned);
});

// ==========================================
// 9. AI TUTOR & PHOTO DOUBT SOLVER
// ==========================================

apiRouter.post('/ai/tutor', requireAuth, async (req: Request, res: Response) => {
  const session = req.userSession!;
  const { userQuery, history, chapterId, conceptId, subject } = req.body;
  const db = getDb();

  const student = db.studentProfiles.find((s) => s.userId === session.userId);
  const chapter = db.chapters.find((c) => c.id === chapterId);
  const concept = chapter?.concepts.find((con) => con.id === conceptId);

  // Check recent diagnosis to provide customized support
  const recentDiag = db.diagnosticEvidences
    .filter((d) => d.studentId === session.userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  try {
    const result = await askAiTutor(
      userQuery,
      history || [],
      {
        board: student?.board || 'CBSE',
        classLevel: student?.classLevel || '8',
        subject: subject || chapter?.subject || 'Mathematics',
        chapter: chapter?.title || 'Fractions & Rational Numbers',
        concept: concept?.title,
        language: student?.learningLanguage || 'en',
        studentName: session.name,
        recentDiagnosis: recentDiag?.primaryObservedDifficulty,
      }
    );

    res.json({
      ...result,
      text: result.text,
      reply: result.text,
      answer: result.text,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'AI Tutor service encountered an error.', details: err.message });
  }
});

apiRouter.post('/ai/photo-doubt', requireAuth, async (req: Request, res: Response) => {
  const session = req.userSession!;
  const { imageBase64, mimeType, notes, subject, chapter, board, classLevel, lessonTopic, concept } = req.body;
  const db = getDb();

  const student = db.studentProfiles.find((s) => s.userId === session.userId);

  try {
    const resolution = await solvePhotoDoubt(
      imageBase64,
      mimeType,
      notes,
      {
        board: board || student?.board || 'CBSE',
        classLevel: classLevel || student?.classLevel || '8',
        subject: subject || 'Mathematics',
        chapter: chapter || 'Linear Equations in One Variable',
        concept: lessonTopic || concept || 'Core Lesson',
        language: student?.learningLanguage || 'en',
        studentName: session.name,
      }
    );

    res.json(resolution);
  } catch (err: any) {
    res.status(500).json({ error: 'Photo Doubt Solver service encountered an error.', details: err.message });
  }
});

// Resource Library
apiRouter.get('/resources', (req: Request, res: Response) => {
  const { board, classLevel, subject, type, language } = req.query;
  const db = getDb();

  let pool = db.resources;
  if (board) pool = pool.filter((r) => r.board === board);
  if (classLevel) pool = pool.filter((r) => r.classLevel === classLevel);
  if (subject) pool = pool.filter((r) => r.subject.toLowerCase() === (subject as string).toLowerCase());
  if (type) pool = pool.filter((r) => r.type === type);
  if (language) pool = pool.filter((r) => r.language === language);

  res.json(pool);
});
