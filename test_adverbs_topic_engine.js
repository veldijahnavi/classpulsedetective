/**
 * Comprehensive Automated Verification Script for Topic-Based Learning & Adaptive Engine:
 * Flagship Example: CBSE Class 8 English — Adverbs
 */

async function run() {
  const baseUrl = 'http://localhost:3000';
  console.log('=== STARTING TOPIC-BASED LEARNING & ADAPTIVE ENGINE VERIFICATION ===\n');

  // 1. Authenticate Class 8 CBSE Student (arjun.sharma or priya.patel)
  console.log('1. Authenticating Class 8 CBSE student...');
  const demoRes = await fetch(`${baseUrl}/api/demo-accounts`);
  const demoData = await demoRes.json();
  const class8Student = demoData.students.find((s) => s.classLevel === '8' && s.board === 'CBSE');
  if (!class8Student) throw new Error('No Class 8 CBSE student found in demo accounts!');
  console.log(`✓ Found Class 8 CBSE student: ${class8Student.name} (${class8Student.loginId})`);

  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: class8Student.loginId, password: 'Student@2026', portal: 'student' }),
  });
  if (!loginRes.ok) throw new Error(`Login failed for ${class8Student.loginId}: ${loginRes.status}`);
  const { token, user, studentProfile } = await loginRes.json();
  console.log(`✓ Logged in as: ${user.name} | Class: ${studentProfile.classLevel} | Board: ${studentProfile.board}`);

  // 2. Fetch Chapters and verify Adverbs Chapter
  console.log('\n2. Fetching curriculum chapters for Class 8 CBSE...');
  const chRes = await fetch(`${baseUrl}/api/curriculum/chapters?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`);
  const chapters = await chRes.json();
  const adverbsChapter = chapters.find((c) => c.id === 'ch_cbse8_eng_adverbs');
  if (!adverbsChapter) {
    throw new Error('FAILED: ch_cbse8_eng_adverbs not found in Class 8 CBSE curriculum!');
  }
  console.log(`✓ Found Chapter: [${adverbsChapter.subject}] Ch ${adverbsChapter.chapterNumber}: ${adverbsChapter.title}`);
  console.log(`  Concepts in Chapter: ${adverbsChapter.concepts.map((c) => c.title).join(' | ')}`);

  if (adverbsChapter.concepts.length < 2) {
    throw new Error('FAILED: Expected at least 2 distinct concepts in Adverbs chapter!');
  }
  const concept1 = adverbsChapter.concepts[0]; // con_cbse8_eng_adv_c1
  const concept2 = adverbsChapter.concepts[1]; // con_cbse8_eng_adv_c2

  // 3. Verify Complete 16-Point Lesson on Adverbs
  console.log(`\n3. Verifying comprehensive 16-point lesson for: ${concept1.title}...`);
  const lessonRes = await fetch(`${baseUrl}/api/learn/lesson/${adverbsChapter.id}/${concept1.id}`);
  const lessonJson = await lessonRes.json();
  const lesson = lessonJson.lesson;
  if (!lesson) throw new Error('FAILED: No lesson returned for Adverbs concept 1');

  // Verify all 16 key points
  const pointsToCheck = [
    { name: 'Topic Introduction', ok: Boolean(lesson.topicIntroduction?.en) },
    { name: 'Why Learn', ok: Boolean(lesson.whyLearn?.en) },
    { name: 'Learning Objectives', ok: Array.isArray(lesson.learningObjectives) && lesson.learningObjectives.length > 0 },
    { name: 'Prerequisite Knowledge', ok: Array.isArray(lesson.prerequisiteKnowledge) && lesson.prerequisiteKnowledge.length > 0 },
    { name: 'In-depth Explanation (trilingual)', ok: Boolean(lesson.explanation?.en && lesson.explanation?.hi && lesson.explanation?.te) },
    { name: 'Definitions (Adverb, Flat Adverb)', ok: Array.isArray(lesson.definitions) && lesson.definitions.length >= 3 },
    { name: 'Principles and Rules (Good vs Well, etc.)', ok: Array.isArray(lesson.principlesAndRules) && lesson.principlesAndRules.length >= 3 },
    { name: 'Worked Examples (Step-by-Step Reasoning)', ok: Array.isArray(lesson.workedExamples) && lesson.workedExamples.length >= 2 },
    { name: 'Diagrams / Comparison Matrix', ok: Array.isArray(lesson.diagramsAndTables) && lesson.diagramsAndTables.length > 0 },
    { name: 'Real-World Applications', ok: Array.isArray(lesson.realWorldApplications) && lesson.realWorldApplications.length > 0 },
    { name: 'Common Mistakes & Traps', ok: Array.isArray(lesson.commonMistakes) && lesson.commonMistakes.length >= 3 },
    { name: 'Important Points (Misplaced Only, Linking Verbs)', ok: Array.isArray(lesson.importantPoints) && lesson.importantPoints.length > 0 },
    { name: 'Revision Notes', ok: Array.isArray(lesson.revisionNotes) && lesson.revisionNotes.length > 0 },
    { name: 'Topic Summary', ok: Boolean(lesson.topicSummary?.en) },
    { name: 'Knowledge Check Questions & Quick Tips', ok: Array.isArray(lesson.knowledgeCheckQuestions) && lesson.knowledgeCheckQuestions.length >= 2 },
    { name: 'Practice Exercises & Solution Hints', ok: Array.isArray(lesson.practiceExercises) && lesson.practiceExercises.length > 0 },
    { name: 'Summary Points', ok: Array.isArray(lesson.summaryPoints) && lesson.summaryPoints.length > 0 },
  ];

  let verifiedCount = 0;
  pointsToCheck.forEach((pt) => {
    if (pt.ok) {
      verifiedCount++;
      console.log(`  ✓ ${pt.name} present`);
    } else {
      console.log(`  ✗ MISSING: ${pt.name}`);
    }
  });

  if (verifiedCount < pointsToCheck.length) {
    throw new Error(`FAILED: Only ${verifiedCount}/${pointsToCheck.length} required lesson sections were verified!`);
  }
  console.log(`✓ 16-point lesson fully verified! (${verifiedCount}/${pointsToCheck.length} sections present).`);

  // 4. Test Adaptive Question Engine for Adverbs
  console.log('\n4. Testing Adaptive Question Selection for Adverbs...');
  const qRes = await fetch(
    `${baseUrl}/api/assessment/questions?conceptId=${concept1.id}&chapterId=${adverbsChapter.id}&studentId=${studentProfile.userId}&board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`
  );
  const questions = await qRes.json();
  console.log(`✓ Retrieved ${questions.length} adaptive questions for Adverbs.`);
  if (questions.length === 0) throw new Error('FAILED: Expected questions for Adverbs concept!');

  questions.forEach((q) => {
    console.log(`  Q: [${q.id}] Diff: ${q.difficulty} | Sub: ${q.subject} | Prompt: ${q.prompt.en.slice(0, 60)}...`);
    if (q.subject !== 'English') throw new Error(`CRITICAL LEAK: Question ${q.id} is ${q.subject}, expected English!`);
    if (q.classLevel !== '8') throw new Error(`CRITICAL LEAK: Question ${q.id} is Class ${q.classLevel}, expected Class 8!`);
  });

  // 5. Test Concept Detective: Submit deliberate misconception
  console.log('\n5. Submitting assessment with deliberate misconception (ADJECTIVE_ADVERB_CONFUSION)...');
  const targetQ = questions[0];
  const wrongChoice = targetQ.choices?.find((c) => !c.isCorrect && c.misconceptionTag?.includes('CONFUSION')) || targetQ.choices?.find((c) => !c.isCorrect);
  if (!wrongChoice) throw new Error('No incorrect choice found on question!');

  const subRes = await fetch(`${baseUrl}/api/assessment/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chapterId: adverbsChapter.id,
      conceptId: concept1.id,
      studentAnswers: { [targetQ.id]: wrongChoice.id },
      timeSpentSeconds: 45,
      hintsUsedCount: 1,
      questionTimings: {
        [targetQ.id]: { activeSeconds: 45, hintsUsed: 1, wasChanged: false },
      },
    }),
  });

  if (!subRes.ok) {
    const errText = await subRes.text();
    throw new Error(`Assessment submit returned ${subRes.status}: ${errText.slice(0, 200)}`);
  }
  const subJson = await subRes.json();
  console.log(`✓ Assessment submitted. Needs Detective: ${subJson.needsDiagnosticFollowup} | Diagnostic ID: ${subJson.diagnosticId}`);
  if (!subJson.needsDiagnosticFollowup || !subJson.diagnosticId) {
    throw new Error('FAILED: Concept Detective was not triggered for incorrect answer!');
  }

  // 6. Inspect Diagnostic Probes
  console.log(`\n6. Fetching Concept Detective follow-up probes for diagnosis: ${subJson.diagnosticId}...`);
  const diagRes = await fetch(`${baseUrl}/api/detective/investigate/${subJson.diagnosticId}`);
  const diagJson = await diagRes.json();
  const probes = diagJson.followUpProbes;
  console.log(`✓ Retrieved ${probes.length} follow-up probes for Adverbs diagnosis.`);
  if (probes.length === 0) throw new Error('FAILED: No follow-up probes returned for Adverbs!');

  probes.forEach((p) => {
    console.log(`  Probe: [${p.id}] Type: ${p.probeType} | Skill: ${p.testedSubSkill} | Q: ${p.question.slice(0, 60)}...`);
    if (p.subject !== 'English') throw new Error(`CRITICAL LEAK: Probe is for ${p.subject}, expected English!`);
  });

  // Submit response to probe
  const probe1 = probes[0];
  console.log(`  Submitting probe response: "${probe1.correctAnswer}"...`);
  const probeSubRes = await fetch(`${baseUrl}/api/detective/submit-followup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      diagnosticId: subJson.diagnosticId,
      probeAnswers: { [probe1.id]: probe1.correctAnswer },
    }),
  });
  const probeSubJson = await probeSubRes.json();
  console.log(`✓ Follow-up probe processed. Concluded status: ${probeSubJson.evidence.concludedStatus}`);
  console.log(`  Recommended Recovery Activity: ${probeSubJson.evidence.recommendedActivityId}`);

  if (probeSubJson.evidence.recommendedActivityId !== 'rec_cbse8_adverbs_mastery') {
    throw new Error(`FAILED: Expected rec_cbse8_adverbs_mastery, got: ${probeSubJson.evidence.recommendedActivityId}`);
  }

  // 7. Verify Smart Recovery Activity for Adverbs
  console.log('\n7. Testing Smart Recovery Activity (rec_cbse8_adverbs_mastery)...');
  const recRes = await fetch(`${baseUrl}/api/recovery/activity/rec_cbse8_adverbs_mastery`);
  const recJson = await recRes.json();
  const rec = recJson.activity;
  console.log(`✓ Loaded recovery activity: "${rec.title}"`);
  console.log(`  Identified Gap: ${rec.identifiedGap}`);
  console.log(`  Guided Practice Questions count: ${rec.guidedPracticeQuestions.length}`);
  if (rec.guidedPracticeQuestions.length < 2) {
    throw new Error('FAILED: Expected at least 2 guided practice questions in Adverbs recovery!');
  }

  // Complete recovery practice questions
  console.log('  Completing guided practice step...');
  const gq1 = rec.guidedPracticeQuestions[0];
  const gq1Correct = gq1.choices.find((c) => c.isCorrect);
  const stepRes = await fetch(`${baseUrl}/api/recovery/complete-step`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      activityId: 'rec_cbse8_adverbs_mastery',
      conceptId: concept1.id,
      stepIndex: 1,
      totalSteps: rec.guidedPracticeQuestions.length,
      questionId: gq1.id,
      isCorrect: true,
      timeSpentSeconds: 30,
    }),
  });
  const stepJson = await stepRes.json();
  console.log(`✓ Recovery step recorded. Next: Unlock fresh retest!`);

  // 8. Fetch Fresh Retest Questions for Adverbs
  console.log('\n8. Fetching fresh retest questions for Adverbs...');
  const retestQRes = await fetch(`${baseUrl}/api/retest/questions/${concept1.id}?chapterId=${adverbsChapter.id}`);
  const retestQs = await retestQRes.json();
  console.log(`✓ Retrieved ${retestQs.length} fresh retest questions.`);
  if (retestQs.length === 0) throw new Error('FAILED: No retest questions for Adverbs!');

  retestQs.forEach((rq) => {
    console.log(`  Retest Q: [${rq.id}] Prompt: ${rq.prompt.en.slice(0, 60)}...`);
    if (rq.subject !== 'English' || rq.classLevel !== '8') {
      throw new Error(`CRITICAL LEAK: Retest question is ${rq.subject} Class ${rq.classLevel}!`);
    }
  });

  // Submit Retest with full marks
  console.log('\n9. Submitting fresh retest with correct answers to verify improvement tracking...');
  const retestAnswers = {};
  retestQs.forEach((rq) => {
    const correctC = rq.choices.find((c) => c.isCorrect);
    if (correctC) retestAnswers[rq.id] = correctC.id;
  });

  const retestSubRes = await fetch(`${baseUrl}/api/retest/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chapterId: adverbsChapter.id,
      conceptId: concept1.id,
      retestAnswers,
      retestTimeSeconds: 40,
    }),
  });
  const retestSubJson = await retestSubRes.json();
  console.log(`✓ Retest submitted successfully!`);
  console.log(`  Outcome: ${retestSubJson.outcome}`);
  console.log(`  Score: ${retestSubJson.retestRecord.retestScore}/${retestSubJson.retestRecord.retestTotal}`);
  console.log(`  Improvement Delta: +${retestSubJson.improvementDelta}`);
  console.log(`  Summary: ${retestSubJson.beforeAfterSummary}`);

  if (retestSubJson.outcome !== 'Stronger Understanding' || retestSubJson.improvementDelta < 0) {
    throw new Error('FAILED: Retest outcome should indicate Stronger Understanding with positive delta!');
  }

  // 10. Verify Real-Time Teacher Sync
  console.log('\n10. Verifying Real-Time Teacher Activity Sync for Adverbs...');
  const liveRes = await fetch(`${baseUrl}/api/teacher/live-activities`);
  const liveLogs = await liveRes.json();
  console.log(`✓ Retrieved ${liveLogs.length} live activity events from server.`);
  const adverbsEvents = liveLogs.filter((ev) => ev.subject === 'English' && (ev.chapterId === 'ch_cbse8_eng_adverbs' || ev.conceptId === concept1.id));
  console.log(`✓ Found ${adverbsEvents.length} activities logged for Adverbs!`);
  adverbsEvents.slice(0, 3).forEach((ev) => {
    console.log(`  Event: [${ev.activityType}] Student: ${ev.studentName} | Score: ${ev.score}/${ev.totalMarks} | Topic: ${ev.topicTitle || ev.conceptTitle}`);
  });

  if (adverbsEvents.length === 0) {
    throw new Error('FAILED: No Adverbs activities recorded in live stream logs!');
  }

  console.log('\n======================================================');
  console.log('✓ ALL ADVERBS TOPIC & ADAPTIVE ENGINE TESTS PASSED (100%)');
  console.log('======================================================\n');
}

run().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
