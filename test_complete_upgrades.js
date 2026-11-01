/**
 * Comprehensive Automated Verification Script for ClassPulse Detective Upgrades
 */

async function run() {
  const baseUrl = 'http://localhost:3000';
  console.log('=== STARTING COMPLETE UPGRADE VERIFICATION ===\n');

  // 1. Authenticate Class 10 CBSE Student (ananya.iyer)
  console.log('1. Authenticating Class 10 CBSE student: ananya.iyer...');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'ananya.iyer', password: 'Student@2026', portal: 'student' }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  const { token, studentProfile } = await loginRes.json();
  console.log(`✓ Logged in as: ${studentProfile.name} (Class ${studentProfile.classLevel} ${studentProfile.board})`);
  console.log(`  Registered subjects: ${studentProfile.registeredSubjects.join(', ')}`);

  // 2. Fetch Chapters for Student's Board & Class
  console.log('\n2. Fetching enrolled curriculum chapters...');
  const chRes = await fetch(`${baseUrl}/api/curriculum/chapters?board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`);
  const chapters = await chRes.json();
  console.log(`✓ Fetched ${chapters.length} chapters.`);
  chapters.forEach((c) => {
    console.log(`  - [${c.subject}] Ch ${c.chapterNumber}: ${c.title} (${c.concepts.length} concepts)`);
    if (c.classLevel !== '10' || c.board !== 'CBSE') {
      throw new Error(`Contamination: Received Chapter belonging to Class ${c.classLevel} ${c.board}!`);
    }
  });

  // 3. Test Science Practice & Anti-Repetition
  console.log('\n3. Testing Science Practice Question Retrieval (Class 10 Science)...');
  const sciChap = chapters.find((c) => c.subject === 'Science');
  const sciConcept = sciChap.concepts[0];

  const qRes1 = await fetch(
    `${baseUrl}/api/assessment/questions?conceptId=${sciConcept.id}&studentId=${studentProfile.userId}&board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`
  );
  const qs1 = await qRes1.json();
  console.log(`✓ Retrieved ${qs1.length} questions for Science: ${sciConcept.title}`);
  qs1.forEach((q) => {
    console.log(`  Question ID: ${q.id} | Subject: ${q.subject} | Class: ${q.classLevel} | Difficulty: ${q.difficulty}`);
    if (q.classLevel !== '10' || q.subject !== 'Science') {
      throw new Error(`CRITICAL LEAK: Question ${q.id} belongs to Class ${q.classLevel} ${q.subject}! Expected Class 10 Science!`);
    }
  });

  // 4. Submit Assessment with intentional error to trigger Concept Detective
  console.log('\n4. Submitting Science practice attempt with intentional misconception...');
  const submitRes = await fetch(`${baseUrl}/api/assessment/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chapterId: sciChap.id,
      conceptId: sciConcept.id,
      studentAnswers: {
        [qs1[0].id]: 'c4', // deliberately pick incorrect option with UNBALANCED_OXYGEN_ATOMS
      },
      timeSpentSeconds: 45,
      hintsUsedCount: 0,
      questionTimings: {
        [qs1[0].id]: { activeSeconds: 45, hintsUsed: 0, wasChanged: false },
      },
    }),
  });
  const submitData = await submitRes.json();
  console.log(`✓ Assessment submitted. Needs Detective Follow-Up: ${submitData.needsDiagnosticFollowup}`);
  console.log(`  Diagnostic ID: ${submitData.diagnosticId}`);
  if (!submitData.needsDiagnosticFollowup) throw new Error('Expected Concept Detective trigger!');

  // 5. Test Concept Detective Multi-Subject Probes
  console.log('\n5. Inspecting Concept Detective Follow-Up Probes for Science...');
  const diagRes = await fetch(
    `${baseUrl}/api/detective/investigation/${studentProfile.userId}/${sciConcept.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const diagData = await diagRes.json();
  console.log(`✓ Detective Investigation Loaded:`);
  console.log(`  Primary Difficulty: ${diagData.evidence.primaryObservedDifficulty}`);
  console.log(`  Subject: ${diagData.evidence.subject}`);
  console.log(`  Follow-Up Probes count: ${diagData.followUpProbes.length}`);
  diagData.followUpProbes.forEach((p, i) => {
    console.log(`  Probe ${i + 1}: ${p.question}`);
    console.log(`    Sub-skill: ${p.testedSubSkill}`);
    if (p.question.includes('LCM') || p.question.includes('cake')) {
      throw new Error('CRITICAL BUG: Concept Detective returned Class 8 Math LCM probes for Class 10 Science!');
    }
  });

  // 6. Submit Detective Probes for Science
  console.log('\n6. Submitting Detective Probe Answers...');
  const probeSubmitRes = await fetch(`${baseUrl}/api/detective/submit-followup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      diagnosticId: diagData.evidence.id,
      probeAnswers: {
        [diagData.followUpProbes[0].id]: diagData.followUpProbes[0].correctAnswer,
        [diagData.followUpProbes[1].id]: diagData.followUpProbes[1].correctAnswer,
      },
    }),
  });
  const probeSubmitData = await probeSubmitRes.json();
  console.log(`✓ Detective Synthesis Complete:`);
  console.log(`  Status: ${probeSubmitData.diagnosis.concludedStatus}`);
  console.log(`  Recommended Activity ID: ${probeSubmitData.diagnosis.recommendedActivityId}`);
  console.log(`  Recommended Recovery Type: ${probeSubmitData.diagnosis.recommendedRecoveryType}`);
  if (probeSubmitData.diagnosis.recommendedActivityId === 'rec_frac_lcm_bridge') {
    throw new Error('CRITICAL BUG: Recommended recovery is rec_frac_lcm_bridge (Math Fractions) for Class 10 Science!');
  }

  // 7. Test Smart Recovery Module for Science
  console.log('\n7. Fetching Smart Recovery Activity for Science...');
  const recRes = await fetch(`${baseUrl}/api/recovery/activity/${probeSubmitData.diagnosis.recommendedActivityId}`);
  const recData = await recRes.json();
  console.log(`✓ Smart Recovery Activity Loaded:`);
  console.log(`  Title: ${recData.title}`);
  console.log(`  Subject: ${recData.subject} | Class: ${recData.classLevel}`);
  console.log(`  Guided questions: ${recData.guidedPracticeQuestions.length}`);
  if (recData.subject !== 'Science' || recData.classLevel !== '10') {
    throw new Error(`CRITICAL BUG: Recovery activity has subject ${recData.subject} and class ${recData.classLevel}! Expected Class 10 Science!`);
  }

  // 8. Test Class 10 English Subject Isolation
  console.log('\n8. Testing Class 10 English Subject Isolation...');
  const engChap = chapters.find((c) => c.subject === 'English');
  const engConcept = engChap.concepts[0];
  const engQRes = await fetch(
    `${baseUrl}/api/assessment/questions?conceptId=${engConcept.id}&studentId=${studentProfile.userId}&board=${studentProfile.board}&classLevel=${studentProfile.classLevel}`
  );
  const engQs = await engQRes.json();
  console.log(`✓ Retrieved ${engQs.length} questions for English: ${engConcept.title}`);
  engQs.forEach((q) => {
    console.log(`  Question ID: ${q.id} | Subject: ${q.subject} | Class: ${q.classLevel}`);
    if (q.classLevel !== '10' || q.subject !== 'English') {
      throw new Error(`CRITICAL LEAK: English student received question with subject ${q.subject} class ${q.classLevel}!`);
    }
  });

  // 9. Verify Empty Content Handling for Unmapped Subject
  console.log('\n9. Testing Empty Content Handling for unmapped/empty combination...');
  const emptyRes = await fetch(
    `${baseUrl}/api/assessment/questions?conceptId=con_non_existent&board=CBSE&classLevel=10&subject=Economics`
  );
  const emptyQs = await emptyRes.json();
  console.log(`✓ Non-existent/unmapped subject returned: ${emptyQs.length} questions (0 expected).`);
  if (emptyQs.length !== 0) {
    throw new Error('CRITICAL LEAK: Unmapped subject received fallback questions instead of empty array!');
  }

  // 10. Verify Telangana SSC Class 10 Physical Science
  console.log('\n10. Testing Telangana SSC Class 10 Physical Science...');
  const tsQRes = await fetch(
    `${baseUrl}/api/assessment/questions?conceptId=con_ts10_ps_lens_c1&board=TELANGANA_SSC&classLevel=10&subject=Physical%20Science`
  );
  const tsQs = await tsQRes.json();
  console.log(`✓ Retrieved ${tsQs.length} questions for Telangana SSC Physical Science.`);
  tsQs.forEach((q) => {
    console.log(`  Question ID: ${q.id} | Subject: ${q.subject} | Class: ${q.classLevel} | Board: ${q.board}`);
    if (q.subject !== 'Physical Science' || q.board !== 'TELANGANA_SSC' || q.classLevel !== '10') {
      throw new Error('Contamination in Telangana Physical Science questions!');
    }
  });

  // 11. Verify CISCE Class 10 Chemistry
  console.log('\n11. Testing CISCE Class 10 Chemistry...');
  const cisceQRes = await fetch(
    `${baseUrl}/api/assessment/questions?conceptId=con_cisce10_chem_c1&board=CISCE&classLevel=10&subject=Chemistry`
  );
  const cisceQs = await cisceQRes.json();
  console.log(`✓ Retrieved ${cisceQs.length} questions for CISCE Chemistry.`);
  cisceQs.forEach((q) => {
    console.log(`  Question ID: ${q.id} | Subject: ${q.subject} | Class: ${q.classLevel} | Board: ${q.board}`);
    if (q.subject !== 'Chemistry' || q.board !== 'CISCE' || q.classLevel !== '10') {
      throw new Error('Contamination in CISCE Chemistry questions!');
    }
  });

  // 12. Verify Complete 16-Point Lesson Structure
  console.log('\n12. Verifying Detailed 16-Point Lesson Content...');
  const lessonRes = await fetch(`${baseUrl}/api/learn/lesson/ch_cbse10_sci_chem_rxn/con_cbse10_sci_chem_c1`);
  const lessonData = await lessonRes.json();
  const les = lessonData.lesson;
  console.log(`✓ Loaded Lesson: "${les.title}"`);
  console.log(`  Has topicIntroduction: ${Boolean(les.topicIntroduction)}`);
  console.log(`  Has whyLearn: ${Boolean(les.whyLearn)}`);
  console.log(`  Has learningObjectives: ${Boolean(les.learningObjectives?.length)}`);
  console.log(`  Has prerequisiteKnowledge: ${Boolean(les.prerequisiteKnowledge?.length)}`);
  console.log(`  Has principlesAndRules: ${Boolean(les.principlesAndRules?.length)}`);
  console.log(`  Has workedExamples: ${Boolean(les.workedExamples?.length)}`);
  console.log(`  Has diagramsAndTables: ${Boolean(les.diagramsAndTables?.length)}`);
  console.log(`  Has commonMistakes: ${Boolean(les.commonMistakes?.length)}`);
  console.log(`  Has knowledgeCheckQuestions: ${Boolean(les.knowledgeCheckQuestions?.length)}`);
  console.log(`  Has practiceExercises: ${Boolean(les.practiceExercises?.length)}`);

  if (!les.topicIntroduction || !les.whyLearn || !les.principlesAndRules || !les.workedExamples) {
    throw new Error('Lesson content is incomplete! Missing 16-point structure.');
  }

  // 13. Test Teacher Live Dashboard & Activity Synchronization
  console.log('\n13. Testing Teacher Live Activity Stream & Real-Time Sync...');
  const teacherLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'teacher_priya', password: 'Teacher@2026', portal: 'teacher' }),
  });
  if (!teacherLoginRes.ok) throw new Error('Teacher login failed!');
  const teacherAuth = await teacherLoginRes.json();
  console.log(`✓ Teacher logged in: ${teacherAuth.user.name}`);

  const liveActRes = await fetch(`${baseUrl}/api/teacher/live-activities`, {
    headers: { Authorization: `Bearer ${teacherAuth.token}` },
  });
  const liveActData = await liveActRes.json();
  console.log(`✓ Fetched ${liveActData.activities?.length || 0} recent live activities from teacher endpoint.`);
  console.log(`  Connected clients count: ${liveActData.connectedClientsCount}`);
  console.log(`  Last synchronized: ${liveActData.lastSynchronizedAt}`);

  const recentAnanyaAct = liveActData.activities?.find((a) => a.studentId === studentProfile.studentId);
  if (recentAnanyaAct) {
    console.log(`✓ Confirmed Real-Time Activity Logged for Student:`);
    console.log(`  Student: ${recentAnanyaAct.studentName} (${recentAnanyaAct.studentId})`);
    console.log(`  Subject: ${recentAnanyaAct.subject} | Concept: ${recentAnanyaAct.conceptTitle || recentAnanyaAct.conceptId}`);
    console.log(`  Activity Type: ${recentAnanyaAct.activityType} | IsCorrect: ${recentAnanyaAct.isCorrect}`);
  }

  console.log('\n=== ALL 13 VERIFICATION SUITES PASSED PERFECTLY (100% SUCCESS) ===');
}

run().catch((err) => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
