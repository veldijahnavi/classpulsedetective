/**
 * Comprehensive Automated Verification Script for:
 * 1. Adaptive Question Engine (gradual harder on correct, easier on incorrect, dynamic generation for 1-question lessons)
 * 2. Concept Detective (identifies tested concept, asks diagnostic follow-up probes, analyzes repeated mistakes, no gap declared on single mistake)
 * 3. Smart Recovery (teaches concept with simple explanation, worked example, hints, graduated questions: easier -> guided -> harder -> mastery check -> retest unlock)
 * 4. Data persistence and Teacher Dashboard live updates
 */

const baseUrl = 'http://localhost:3000';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runFlowTest() {
  console.log('========================================================================');
  console.log('TESTING COMPLETE ADAPTIVE, CONCEPT DETECTIVE & SMART RECOVERY FLOW');
  console.log('========================================================================\n');

  // --- 1. AUTHENTICATE STUDENT ---
  console.log('1. Authenticating student (Kavya Rao - Telangana SSC Class 6)...');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'kavya.rao', password: 'Student@2026', portal: 'student' }),
  });
  assert(loginRes.ok, 'Kavya Rao login failed');
  const { token, studentProfile } = await loginRes.json();
  console.log(`  Logged in as: ${studentProfile.name} (${studentProfile.board} Class ${studentProfile.classLevel})`);

  // --- 2. DYNAMIC QUESTION GENERATION WHEN A LESSON HAS <= 1 QUESTION ---
  console.log('\n2. Testing Dynamic Question Generation for single-question lesson...');
  // Concept con_ts6_sci_c1 in Telangana SSC Class 6 initially had 0 or 1 question
  const dynQRes = await fetch(
    `${baseUrl}/api/assessment/questions?conceptId=con_ts6_sci_c1&board=TELANGANA_SSC&classLevel=6&subject=General%20Science`
  );
  assert(dynQRes.ok, 'Failed to fetch questions for con_ts6_sci_c1');
  const dynQs = await dynQRes.json();
  console.log(`  Questions retrieved for con_ts6_sci_c1: ${dynQs.length}`);
  assert(dynQs.length >= 3, `Expected at least 3 questions generated dynamically, got ${dynQs.length}`);
  const difficulties = dynQs.map((q) => q.difficulty);
  console.log(`  Generated difficulty tiers:`, [...new Set(difficulties)]);
  assert(difficulties.includes('Foundational') || difficulties.includes('Easy'), 'Missing foundational/easy tiers');
  console.log('  Dynamic Question Generation PASSED!');

  // --- 3. ADAPTIVE PROGRESSION LOGIC (EASIER ON INCORRECT, HARDER ON CORRECT) ---
  console.log('\n3. Testing Adaptive Question Difficulty Progression...');
  // Check that the helper module correctly transitions difficulty
  const { getNextAdaptiveQuestion } = await import('./server/adaptiveEngine.ts');
  const sampleQEasy = dynQs.find((q) => q.difficulty === 'Easy') || dynQs[0];
  const sampleQMod = dynQs.find((q) => q.difficulty === 'Moderate') || dynQs[1];

  // Test Correct -> Stepped Up
  const nextOnCorrect = getNextAdaptiveQuestion({
    currentQuestion: sampleQEasy,
    isCorrect: true,
    conceptQuestions: dynQs,
    alreadyAttemptedIds: [sampleQEasy.id],
  });
  console.log(`  Current: ${sampleQEasy.difficulty} (Correct) -> Next: ${nextOnCorrect?.difficulty}`);
  assert(nextOnCorrect !== null, 'Expected an adaptive next question on correct');
  const diffRanks = { Foundational: 1, Easy: 2, Moderate: 3, Challenging: 4, Application: 5 };
  assert(
    diffRanks[nextOnCorrect.difficulty] >= diffRanks[sampleQEasy.difficulty],
    'Expected question to be same or harder difficulty on correct answer'
  );

  // Test Incorrect -> Stepped Down to easier question
  const nextOnIncorrect = getNextAdaptiveQuestion({
    currentQuestion: sampleQMod,
    isCorrect: false,
    conceptQuestions: dynQs,
    alreadyAttemptedIds: [sampleQMod.id],
  });
  console.log(`  Current: ${sampleQMod.difficulty} (Incorrect) -> Next: ${nextOnIncorrect?.difficulty}`);
  assert(nextOnIncorrect !== null, 'Expected an adaptive next question on incorrect');
  assert(
    diffRanks[nextOnIncorrect.difficulty] <= diffRanks[sampleQMod.difficulty],
    'Expected question to be same or easier difficulty on incorrect answer'
  );
  console.log('  Adaptive Difficulty Progression PASSED!');

  // --- 4. CONCEPT DETECTIVE: NOT DECLARING GAP ON 1 MISTAKE ---
  console.log('\n4. Testing Concept Detective single-mistake rule...');
  // Authenticate student with no prior attempts on Fractions
  const freshLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'aarav.patel', password: 'Student@2026', portal: 'student' }),
  });
  const { token: aaravToken, studentProfile: aaravProfile } = await freshLogin.json();

  // Reset concept history to test single-mistake rule idempotently
  await fetch(`${baseUrl}/api/student/reset-concept-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aaravToken}`,
    },
    body: JSON.stringify({ conceptId: 'con_cbse6_sci_c1' }),
  });

  // Submit a single wrong answer on Food Nutrients
  const singleAttemptRes = await fetch(`${baseUrl}/api/assessment/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aaravToken}`,
    },
    body: JSON.stringify({
      chapterId: 'ch_cbse6_sci_food',
      conceptId: 'con_cbse6_sci_c1',
      studentAnswers: { q_cbse6_sci_food_01: 'c2' }, // wrong answer
      timeSpentSeconds: 30,
    }),
  });
  assert(singleAttemptRes.ok, 'Failed to submit single attempt');
  const singleAttemptData = await singleAttemptRes.json();
  assert(singleAttemptData.needsDiagnosticFollowup, 'Expected detective follow-up trigger');

  // Verify diagnostic record has isSingleMistake = true and status is INSUFFICIENT_EVIDENCE (not gap declared!)
  const diagRes = await fetch(`${baseUrl}/api/detective/investigate/${singleAttemptData.diagnosticId}`);
  assert(diagRes.ok, 'Failed to fetch diagnosis');
  const { evidence, followUpProbes } = await diagRes.json();
  console.log(`  Evidence Status: ${evidence.concludedStatus}`);
  console.log(`  isSingleMistake flag: ${evidence.isSingleMistake}`);
  console.log(`  Explanation: ${evidence.diagnosticExplanation.slice(0, 90)}...`);
  assert(evidence.isSingleMistake === true, 'Expected isSingleMistake to be true');
  assert(
    evidence.concludedStatus === 'INSUFFICIENT_EVIDENCE',
    `Expected status INSUFFICIENT_EVIDENCE on single mistake, got ${evidence.concludedStatus}`
  );
  assert(followUpProbes.length >= 2, 'Expected at least 2 diagnostic follow-up probes');
  console.log('  Concept Detective Single-Mistake Rule PASSED!');

  // --- 5. CONCEPT DETECTIVE: PROBE EVALUATION & IDENTIFYING CONCEPT TO IMPROVE ---
  console.log('\n5. Testing Detective Probes Synthesis & Gap Identification...');
  // Intentionally answer the prerequisite probe incorrectly to trigger gap confirmation
  const probeAnswers = {};
  for (const p of followUpProbes) {
    if (p.probeType === 'PREREQUISITE') {
      probeAnswers[p.id] = 'Wrong Answer Intentional';
    } else {
      probeAnswers[p.id] = p.correctAnswer;
    }
  }

  const probeSubRes = await fetch(`${baseUrl}/api/detective/submit-followup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aaravToken}`,
    },
    body: JSON.stringify({
      diagnosticId: evidence.id,
      probeAnswers,
    }),
  });
  assert(probeSubRes.ok, 'Failed to submit probes');
  const probeSubData = await probeSubRes.json();
  console.log(`  Concluded Status after failing prerequisite probe: ${probeSubData.concludedStatus}`);
  console.log(`  Identified Concept to Improve: ${probeSubData.identifiedConceptToImprove}`);
  assert(
    probeSubData.concludedStatus === 'PREREQUISITE_GAP',
    `Expected PREREQUISITE_GAP, got ${probeSubData.concludedStatus}`
  );
  assert(
    probeSubData.identifiedConceptToImprove && probeSubData.identifiedConceptToImprove.length > 5,
    'Expected identified concept to improve to be populated'
  );
  console.log('  Detective Probe Evaluation & Gap Identification PASSED!');

  // --- 6. SMART RECOVERY: TEACH CONCEPT WITH EXPLANATION, WORKED EXAMPLE & GRADUATED PRACTICE ---
  console.log('\n6. Testing Smart Recovery activity structure & teaching components...');
  const recActivityId = probeSubData.recommendedActivityId;
  const recRes = await fetch(`${baseUrl}/api/recovery/activity/${recActivityId}`);
  assert(recRes.ok, `Failed to load recovery activity ${recActivityId}`);
  const rec = await recRes.json();

  console.log(`  Recovery Title: ${rec.title}`);
  assert(rec.simpleExplanation || rec.remediationExplanation, 'Missing simple explanation');
  assert(rec.workedExample !== undefined, 'Missing worked example in recovery activity');
  assert(rec.guidedPracticeQuestions && rec.guidedPracticeQuestions.length >= 2, 'Missing guided practice questions');
  console.log(`  Guided Practice count: ${rec.guidedPracticeQuestions.length}`);
  console.log(`  Worked Example problem: "${rec.workedExample.problem.en}"`);

  // Complete recovery steps: Easier -> Guided -> Harder -> Mastery Check
  console.log('  Submitting graduated recovery answers...');
  const gqAnswers = {};
  rec.guidedPracticeQuestions.forEach((gq) => {
    const correctC = gq.choices.find((c) => c.isCorrect);
    if (correctC) gqAnswers[gq.id] = correctC.id;
  });
  if (rec.masteryCheckQuestion) {
    const correctMC = rec.masteryCheckQuestion.choices.find((c) => c.isCorrect);
    if (correctMC) gqAnswers[rec.masteryCheckQuestion.id] = correctMC.id;
  }

  const recStepRes = await fetch(`${baseUrl}/api/recovery/submit-step`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aaravToken}`,
    },
    body: JSON.stringify({
      activityId: rec.id,
      completedStep: 'Completed All Graduated Stages',
      questionAnswers: gqAnswers,
      isPrerequisiteReviewed: true,
    }),
  });
  assert(recStepRes.ok, 'Failed to submit recovery step');
  const recStepData = await recStepRes.json();
  console.log(`  Retest Eligible: ${recStepData.isEligibleForRetest}`);
  assert(recStepData.isEligibleForRetest === true, 'Expected retest to be unlocked after recovery completion');
  console.log('  Smart Recovery Teaching & Graduated Practice PASSED!');

  // --- 7. FRESH RETEST: UNIQUE FRESH QUESTIONS & DELTA SUMMARY ---
  console.log('\n7. Testing Fresh Retest Execution...');
  const retestQRes = await fetch(`${baseUrl}/api/retest/questions/${rec.conceptId}`, {
    headers: { Authorization: `Bearer ${aaravToken}` },
  });
  assert(retestQRes.ok, 'Failed to fetch fresh retest questions');
  const retestQs = await retestQRes.json();
  assert(retestQs.length > 0, 'No retest questions returned');
  console.log(`  Retest question count: ${retestQs.length} (ID: ${retestQs[0].id})`);

  // Submit retest with correct answer
  const retestAns = {};
  retestQs.forEach((rq) => {
    const correctC = rq.choices.find((c) => c.isCorrect);
    if (correctC) retestAns[rq.id] = correctC.id;
  });

  const retestSubRes = await fetch(`${baseUrl}/api/retest/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aaravToken}`,
    },
    body: JSON.stringify({
      conceptId: rec.conceptId,
      chapterId: rec.chapterId,
      retestAnswers: retestAns,
      retestTimeSeconds: 35,
    }),
  });
  assert(retestSubRes.ok, 'Failed to submit retest');
  const retestData = await retestSubRes.json();
  console.log(`  Retest Outcome: ${retestData.outcome}`);
  console.log(`  Score: ${retestData.retestRecord.retestScore}/${retestData.retestRecord.retestTotal}`);
  console.log(`  Improvement Delta: +${retestData.improvementDelta}`);
  assert(retestData.outcome === 'Stronger Understanding', 'Expected Stronger Understanding outcome');
  console.log('  Fresh Retest PASSED!');

  // --- 8. TEACHER DASHBOARD RECEIVED ACTUAL SAVED RESULTS ---
  console.log('\n8. Verifying Teacher Dashboard received actual saved results...');
  const teacherLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'teacher_priya', password: 'Teacher@2026', portal: 'teacher' }),
  });
  assert(teacherLogin.ok, 'Teacher login failed');
  const { token: teacherToken } = await teacherLogin.json();

  // Check live activities endpoint
  const liveRes = await fetch(`${baseUrl}/api/teacher/live-activities?board=CBSE&classLevel=6`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  assert(liveRes.ok, 'Failed to fetch teacher live activities');
  const { activities } = await liveRes.json();
  const studentActs = activities.filter((a) => a.studentId === aaravProfile.studentId);
  console.log(`  Live activities recorded for Aarav: ${studentActs.length}`);
  assert(studentActs.length > 0, 'Teacher dashboard did not receive live activities');

  // Check roster endpoint reflects retest result
  const rosterRes = await fetch(`${baseUrl}/api/teacher/roster?board=CBSE&classLevel=6`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  assert(rosterRes.ok, 'Failed to fetch teacher roster');
  const roster = await rosterRes.json();
  const aaravRosterEntry = roster.find((r) => r.studentId === aaravProfile.studentId);
  assert(aaravRosterEntry, 'Student not in teacher roster');
  console.log(`  Roster verified retest score: ${aaravRosterEntry.latestRetest?.retestScore}/${aaravRosterEntry.latestRetest?.retestTotal}`);
  assert(aaravRosterEntry.latestRetest !== null, 'Teacher roster missing latest retest record');
  console.log('  Teacher Dashboard Real-Time Synchronization PASSED!');

  console.log('\n========================================================================');
  console.log('ALL VERIFICATION CHECKS FOR ADAPTIVE, DETECTIVE & RECOVERY PASSED (100%)');
  console.log('========================================================================\n');
}

runFlowTest().catch((err) => {
  console.error('\nFLOW TEST FAILED:', err);
  process.exit(1);
});
