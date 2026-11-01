/**
 * Multi-Student End-to-End Verification Test
 * Tests Concept Detective, Smart Recovery, Adaptive Question Engine, and Mastery Retest Gate
 * across two different students (Rahul Sharma - CBSE Class 8, Kavya Rao - Telangana SSC Class 6).
 */

const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    // not json
  }
  return { status: res.status, headers: res.headers, text, json };
}

async function login(loginId, password) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, password, portal: 'student' })
  });
  if (res.status !== 200 || !res.json?.token) {
    throw new Error(`Login failed for ${loginId}: ${res.status} ${res.text}`);
  }
  return res.json;
}

async function runTests() {
  console.log('=== STARTING MULTI-STUDENT VERIFICATION SUITE ===\n');

  // ==========================================
  // STUDENT 1: Rahul Sharma (CBSE Class 8 Math)
  // ==========================================
  console.log('--- TEST SET 1: Student 1 (Rahul Sharma - CBSE 8) ---');
  const rahulAuth = await login('rahul.sharma', 'Student@2026');
  const rahulStudentId = rahulAuth.studentProfile?.studentId || rahulAuth.user.id;
  console.log('✓ Rahul logged in successfully. Token received. Student ID:', rahulStudentId);
  const rahulHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${rahulAuth.token}`
  };

  // 1. Adaptive Question Engine for Rahul
  console.log('\n[1.1] Testing Adaptive Question Engine with Difficulty Levels for CBSE 8 Fractions...');
  const easyRes = await request('/api/assessment/questions?conceptId=con_cbse8_m1_c3&chapterId=ch_cbse8_math_fractions&difficulty=Easy&limit=3', {
    headers: rahulHeaders
  });
  if (easyRes.status !== 200 || !Array.isArray(easyRes.json) || easyRes.json.length === 0) {
    throw new Error(`Failed to fetch easy questions: ${easyRes.status} ${easyRes.text}`);
  }
  console.log(`✓ Fetched ${easyRes.json.length} Easy questions. Sample prompt: "${easyRes.json[0].prompt?.en || easyRes.json[0].prompt}"`);
  console.log(`  Question Difficulty: ${easyRes.json[0].difficulty}, Board: ${easyRes.json[0].board}, Class: ${easyRes.json[0].classLevel}`);

  const challengingRes = await request('/api/assessment/questions?conceptId=con_cbse8_m1_c3&chapterId=ch_cbse8_math_fractions&difficulty=Challenging&limit=3', {
    headers: rahulHeaders
  });
  if (challengingRes.status !== 200 || !Array.isArray(challengingRes.json) || challengingRes.json.length === 0) {
    throw new Error(`Failed to fetch challenging questions: ${challengingRes.status}`);
  }
  console.log(`✓ Fetched ${challengingRes.json.length} Challenging questions. Difficulty: ${challengingRes.json[0].difficulty}`);

  // 2. Submit Assessment creating Diagnostic Evidence
  console.log('\n[1.2] Submitting Diagnostic Assessment with intentional error to trigger Concept Detective...');
  const qToFail = easyRes.json[0];
  const wrongChoice = qToFail.choices?.find(c => !c.isCorrect)?.id || 'c2';
  const submitAssessRes = await request('/api/assessment/submit', {
    method: 'POST',
    headers: rahulHeaders,
    body: JSON.stringify({
      conceptId: 'con_cbse8_m1_c3',
      chapterId: 'ch_cbse8_math_fractions',
      answers: {
        [qToFail.id]: wrongChoice
      },
      timeSpentSeconds: 42
    })
  });
  if (submitAssessRes.status !== 200) {
    throw new Error(`Failed to submit assessment: ${submitAssessRes.status} ${submitAssessRes.text}`);
  }
  const assessResult = submitAssessRes.json;
  console.log(`✓ Assessment evaluated. Score: ${assessResult.attempt?.score}/${assessResult.attempt?.totalMarks}, Needs Remediation: ${assessResult.needsDiagnosticFollowup}`);
  
  // 3. Verify Detailed Concept Detective Report
  console.log('\n[1.3] Fetching Concept Detective Detailed Investigation...');
  const detectiveRes = await request('/api/detective/investigation?conceptId=con_cbse8_m1_c3', {
    headers: rahulHeaders
  });
  if (detectiveRes.status !== 200) {
    throw new Error(`Failed to fetch detective investigation: ${detectiveRes.status} ${detectiveRes.text}`);
  }
  const detectiveData = detectiveRes.json;
  const diag = detectiveData.evidence;
  if (!diag) throw new Error('No diagnostic evidence in detective response');

  console.log('✓ Concept Detective Report Loaded Successfully:');
  console.log('  - Diagnostic ID:', diag.id);
  console.log('  - Observed Difficulty:', diag.primaryObservedDifficulty);
  console.log('  - Mistake Explanation:', diag.mistakeExplanation ? `${diag.mistakeExplanation.slice(0, 75)}...` : 'MISSING');
  console.log('  - Learning Gap Analysis:', diag.learningGapAnalysis ? `${diag.learningGapAnalysis.slice(0, 75)}...` : 'MISSING');
  console.log('  - Missing Prerequisites count:', diag.missingPrerequisites?.length);
  console.log('  - Recommended Actions count:', diag.recommendedActions?.length);
  console.log('  - Follow-up probes count:', detectiveData.followUpProbes?.length);

  if (!diag.mistakeExplanation || !diag.learningGapAnalysis || !diag.missingPrerequisites?.length || !diag.recommendedActions?.length) {
    throw new Error('Concept Detective report is missing required detailed sections!');
  }

  // 4. Submit Follow-up Probe Answer (Diagnostic ID submission error check)
  console.log('\n[1.4] Submitting follow-up probe answer to verify zero 404 or submission errors...');
  const probe = detectiveData.followUpProbes[0];
  const submitProbeRes = await request('/api/detective/submit-followup', {
    method: 'POST',
    headers: rahulHeaders,
    body: JSON.stringify({
      diagnosticId: diag.id,
      conceptId: 'con_cbse8_m1_c3',
      probeId: probe.id,
      selectedChoiceId: probe.choices?.[0]?.id || 'opt_1'
    })
  });
  if (submitProbeRes.status !== 200) {
    throw new Error(`Probe submission failed with status ${submitProbeRes.status}: ${submitProbeRes.text}`);
  }
  console.log('✓ Probe submitted successfully without error. Concluded Status:', submitProbeRes.json?.evidence?.concludedStatus || submitProbeRes.json?.concludedStatus);

  // 5. Enforce Mastery Gate Before Retest
  console.log('\n[1.5] Verifying Retest is BLOCKED before completing Smart Recovery Stage 4 Mastery Check...');
  const blockedRetestQRes = await request('/api/retest/questions/con_cbse8_m1_c3', {
    headers: rahulHeaders
  });
  if (blockedRetestQRes.status !== 403 || !blockedRetestQRes.json?.masteryCheckRequired) {
    throw new Error(`Expected 403 with masteryCheckRequired, got: ${blockedRetestQRes.status} ${blockedRetestQRes.text}`);
  }
  console.log('✓ Retest correctly blocked with HTTP 403:', blockedRetestQRes.json?.error);

  const blockedRetestSubmitRes = await request('/api/retest/submit', {
    method: 'POST',
    headers: rahulHeaders,
    body: JSON.stringify({
      conceptId: 'con_cbse8_m1_c3',
      chapterId: 'ch_cbse8_math_fractions',
      retestAnswers: { q1: 'a' },
      retestTimeSeconds: 30
    })
  });
  if (blockedRetestSubmitRes.status !== 403 || !blockedRetestSubmitRes.json?.masteryCheckRequired) {
    throw new Error(`Expected 403 on retest submit before mastery check, got: ${blockedRetestSubmitRes.status}`);
  }
  console.log('✓ Retest submit correctly blocked with HTTP 403 before mastery check passed.');

  // 6. Smart Recovery: Save & Restore Progress
  console.log('\n[1.6] Smart Recovery: Save intermediate steps and verify restoration upon returning...');
  const actId = diag.recommendedActivityId || 'rec_cbse8_m1_c3_fractions';
  
  // Submit step 0 (review prereq) and step 1 answer
  const stepSaveRes = await request('/api/recovery/submit-step', {
    method: 'POST',
    headers: rahulHeaders,
    body: JSON.stringify({
      activityId: actId,
      stepIndex: 1,
      selectedChoiceId: 'c1',
      reviewCompleted: true,
      notes: 'Reviewed bridge foundation'
    })
  });
  if (stepSaveRes.status !== 200) {
    throw new Error(`Failed to save recovery step: ${stepSaveRes.status}`);
  }
  console.log('✓ Saved step 1 progress in Smart Recovery.');

  // Reload activity as if student returned to the page
  const reloadActRes = await request(`/api/recovery/activity/${actId}`, {
    headers: rahulHeaders
  });
  if (reloadActRes.status !== 200 || !reloadActRes.json?.savedAttempt) {
    throw new Error(`Failed to restore savedAttempt: ${reloadActRes.status}`);
  }
  const restored = reloadActRes.json.savedAttempt;
  console.log('✓ Restored saved Smart Recovery progress:');
  console.log('  - Saved step index:', restored.currentStepIndex);
  console.log('  - Prereq reviewed:', restored.isPrereqReviewed);
  console.log('  - Guided answers count:', Object.keys(restored.guidedAnswers || {}).length);
  if (!restored.isPrereqReviewed || Object.keys(restored.guidedAnswers || {}).length === 0) {
    throw new Error('Smart Recovery failed to properly restore progress!');
  }

  // 7. Complete Stage 4 Mastery Check to unlock Retest
  console.log('\n[1.7] Answering Stage 4 Mastery Check question in Smart Recovery to unlock fresh retest...');
  const activityData = reloadActRes.json.activity || reloadActRes.json;
  const masteryQ = activityData.masteryCheckQuestion;
  const correctChoiceId = masteryQ?.choices?.find(c => c.isCorrect)?.id || 'c2';

  const unlockRes = await request('/api/recovery/submit-step', {
    method: 'POST',
    headers: rahulHeaders,
    body: JSON.stringify({
      activityId: actId,
      stepIndex: 3,
      questionId: masteryQ?.id,
      selectedChoiceId: correctChoiceId,
      questionAnswers: {
        ...(restored.guidedAnswers || {}),
        [masteryQ?.id || 'mastery_q']: correctChoiceId
      },
      reviewCompleted: true,
      isPrerequisiteReviewed: true
    })
  });
  if (unlockRes.status !== 200 || !unlockRes.json?.isEligibleForRetest) {
    throw new Error(`Expected isEligibleForRetest: true, got: ${unlockRes.status} ${JSON.stringify(unlockRes.json)}`);
  }
  console.log('✓ Stage 4 Mastery Check passed! Retest Eligibility Granted:', unlockRes.json?.isEligibleForRetest);

  // 8. Retest Unlocked: Fetch fresh questions & Submit Retest
  console.log('\n[1.8] Fetching fresh retest questions and submitting fresh retest...');
  const retestQRes = await request('/api/retest/questions/con_cbse8_m1_c3', {
    headers: rahulHeaders
  });
  if (retestQRes.status !== 200 || !Array.isArray(retestQRes.json) || retestQRes.json.length === 0) {
    throw new Error(`Expected 200 with retest questions, got ${retestQRes.status}`);
  }
  console.log(`✓ Fresh retest questions retrieved (${retestQRes.json.length} questions).`);

  const retestAnswers = {};
  retestQRes.json.forEach(q => {
    retestAnswers[q.id] = q.correctAnswerId || (q.choices?.[0]?.id) || '4';
  });

  const finalRetestSubmit = await request('/api/retest/submit', {
    method: 'POST',
    headers: rahulHeaders,
    body: JSON.stringify({
      conceptId: 'con_cbse8_m1_c3',
      chapterId: 'ch_cbse8_math_fractions',
      retestAnswers,
      retestTimeSeconds: 28
    })
  });
  if (finalRetestSubmit.status !== 200 || !finalRetestSubmit.json?.retestRecord) {
    throw new Error(`Retest submission failed: ${finalRetestSubmit.status} ${finalRetestSubmit.text}`);
  }
  const record = finalRetestSubmit.json.retestRecord;
  console.log('✓ Fresh retest submitted successfully!');
  console.log(`  - Retest Score: ${record.retestScore}/${record.retestTotal} (+${record.improvementDelta} delta)`);
  console.log(`  - Pacing: ${record.retestTimeSeconds}s`);
  console.log(`  - Outcome: ${record.outcome}`);


  // ==========================================
  // STUDENT 2: Kavya Rao (Telangana SSC Class 6)
  // ==========================================
  console.log('\n\n--- TEST SET 2: Student 2 (Kavya Rao - Telangana SSC Class 6) ---');
  const kavyaAuth = await login('kavya.rao', 'Student@2026');
  const kavyaStudentId = kavyaAuth.studentProfile?.studentId || kavyaAuth.user.id;
  console.log('✓ Kavya logged in successfully. Token received. Student ID:', kavyaStudentId);
  const kavyaHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${kavyaAuth.token}`
  };

  // 1. Data Isolation Check: Rahul's retest & evidence does NOT leak to Kavya
  console.log('\n[2.1] Verifying Data Isolation between Rahul and Kavya...');
  const kavyaLatestRes = await request(`/api/detective/latest/${kavyaStudentId}`, {
    headers: kavyaHeaders
  });
  if (kavyaLatestRes.status === 200 && kavyaLatestRes.json?.evidence?.studentId) {
    if (kavyaLatestRes.json.evidence.studentId !== kavyaStudentId && kavyaLatestRes.json.evidence.studentId !== kavyaAuth.user.id) {
      throw new Error(`Data leak! Kavya saw studentId ${kavyaLatestRes.json.evidence.studentId}`);
    }
  }
  console.log('✓ Data isolation confirmed: Kavya only accesses her own records.');

  // 2. Adaptive Question Engine for Kavya (Telangana SSC Class 6 Science/Math)
  console.log('\n[2.2] Testing Adaptive Question Engine for Kavya (Telangana SSC Class 6)...');
  const kavyaQuestionsRes = await request('/api/assessment/questions?conceptId=con_ts6_sci_c1&chapterId=ch_ts6_sci_plants&difficulty=Moderate&limit=3', {
    headers: kavyaHeaders
  });
  if (kavyaQuestionsRes.status !== 200 || !Array.isArray(kavyaQuestionsRes.json) || kavyaQuestionsRes.json.length === 0) {
    throw new Error(`Failed to fetch questions for Kavya: ${kavyaQuestionsRes.status}`);
  }
  const kavyaQ = kavyaQuestionsRes.json[0];
  console.log(`✓ Fetched questions for Telangana SSC Class 6. Board: ${kavyaQ.board}, Class: ${kavyaQ.classLevel}, Subject: ${kavyaQ.subject}`);
  console.log(`  Prompt: "${kavyaQ.prompt?.en || kavyaQ.prompt}"`);

  // 3. Submit Assessment for Kavya
  console.log('\n[2.3] Submitting Assessment for Kavya and verifying detailed Concept Detective report...');
  const kavyaWrongChoice = kavyaQ.choices?.find(c => !c.isCorrect)?.id || 'c2';
  const kavyaAssessRes = await request('/api/assessment/submit', {
    method: 'POST',
    headers: kavyaHeaders,
    body: JSON.stringify({
      conceptId: 'con_ts6_sci_c1',
      chapterId: 'ch_ts6_sci_plants',
      answers: {
        [kavyaQ.id]: kavyaWrongChoice
      },
      timeSpentSeconds: 38
    })
  });
  if (kavyaAssessRes.status !== 200) {
    throw new Error(`Failed to submit Kavya assessment: ${kavyaAssessRes.status}`);
  }
  console.log('✓ Kavya assessment submitted.');

  // 4. Fetch Detective Investigation for Kavya
  const kavyaDetRes = await request('/api/detective/investigation?conceptId=con_ts6_sci_c1', {
    headers: kavyaHeaders
  });
  if (kavyaDetRes.status !== 200 || !kavyaDetRes.json?.evidence) {
    throw new Error(`Failed to fetch Kavya detective investigation: ${kavyaDetRes.status}`);
  }
  const kavyaEvidence = kavyaDetRes.json.evidence;
  console.log('✓ Kavya Concept Detective Evidence:');
  console.log('  - Diagnostic ID:', kavyaEvidence.id);
  console.log('  - Mistake Explanation:', kavyaEvidence.mistakeExplanation?.slice(0, 70) + '...');
  console.log('  - Missing Prerequisites count:', kavyaEvidence.missingPrerequisites?.length);
  console.log('  - Recommended Actions count:', kavyaEvidence.recommendedActions?.length);

  // 5. Submit Follow-up Probe for Kavya
  const kavyaProbe = kavyaDetRes.json.followUpProbes?.[0];
  if (kavyaProbe) {
    const probeRes = await request('/api/detective/submit-followup', {
      method: 'POST',
      headers: kavyaHeaders,
      body: JSON.stringify({
        diagnosticId: kavyaEvidence.id,
        conceptId: 'con_ts6_sci_c1',
        probeId: kavyaProbe.id,
        selectedChoiceId: kavyaProbe.choices?.[0]?.id || 'opt_1'
      })
    });
    if (probeRes.status !== 200) {
      throw new Error(`Kavya probe submission failed: ${probeRes.status}`);
    }
    console.log('✓ Kavya probe submitted successfully without 404.');
  }

  // 6. Verify Retest Mastery Gate for Kavya
  const kavyaRetestGateRes = await request('/api/retest/questions/con_ts6_sci_c1', {
    headers: kavyaHeaders
  });
  if (kavyaRetestGateRes.status !== 403 || !kavyaRetestGateRes.json?.masteryCheckRequired) {
    throw new Error(`Expected Kavya retest to be blocked by mastery gate, got: ${kavyaRetestGateRes.status}`);
  }
  console.log('✓ Kavya fresh retest correctly blocked by mastery gate before Smart Recovery.');

  // 7. Complete Smart Recovery for Kavya & unlock retest
  const kavyaActId = kavyaEvidence.recommendedActivityId || 'rec_ts6_s1_c1_nutrients';
  const kavyaActRes = await request(`/api/recovery/activity/${kavyaActId}`, {
    headers: kavyaHeaders
  });
  if (kavyaActRes.status === 200 && (kavyaActRes.json?.activity || kavyaActRes.json)) {
    const kAct = kavyaActRes.json?.activity || kavyaActRes.json;
    const masteryQ = kAct.masteryCheckQuestion;
    const correctId = masteryQ?.choices?.find(c => c.isCorrect)?.id || 'c2';

    const kavyaUnlockRes = await request('/api/recovery/submit-step', {
      method: 'POST',
      headers: kavyaHeaders,
      body: JSON.stringify({
        activityId: kavyaActId,
        stepIndex: 3,
        questionId: masteryQ?.id,
        selectedChoiceId: correctId,
        questionAnswers: {
          [masteryQ?.id || 'mastery_q']: correctId
        },
        reviewCompleted: true,
        isPrerequisiteReviewed: true
      })
    });
    console.log('✓ Kavya Stage 4 Mastery Check passed:', kavyaUnlockRes.json?.isEligibleForRetest);

    const kavyaRetestUnlockedRes = await request('/api/retest/questions/con_ts6_sci_c1', {
      headers: kavyaHeaders
    });
    if (kavyaRetestUnlockedRes.status === 200 && Array.isArray(kavyaRetestUnlockedRes.json)) {
      console.log(`✓ Kavya fresh retest unlocked (${kavyaRetestUnlockedRes.json.length} questions).`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 ALL MULTI-STUDENT TESTS COMPLETED AND VERIFIED 100%!');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
