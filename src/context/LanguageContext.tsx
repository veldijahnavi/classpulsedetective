/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface LanguageContextType {
  interfaceLanguage: LanguageCode;
  learningLanguage: LanguageCode;
  setInterfaceLanguage: (lang: LanguageCode) => void;
  setLearningLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    app_title: 'ClassPulse Detective',
    app_tagline: 'Diagnose the gap. Adapt the learning. Empower the teacher.',
    student_portal: 'Student Portal',
    teacher_portal: 'Teacher Portal',
    sign_out: 'Sign Out',
    dashboard: 'Dashboard',
    my_subjects: 'My Subjects',
    learn: 'Learn',
    solve: 'Solve & Practice',
    concept_detective: 'Concept Detective',
    smart_recovery: 'Smart Recovery',
    retest: 'Fresh Retest',
    concept_map: 'Prerequisite Map',
    ai_tutor: 'AI Tutor',
    photo_doubt: 'Photo Doubt Solver',
    resources: 'Resource Library',
    assignments: 'Assignments',
    progress: 'My Progress',
    profile_settings: 'Profile & Settings',
    interface_lang: 'Interface Language',
    learning_lang: 'Learning Content Language',
    select_board: 'Select Board',
    select_class: 'Select Class',
    all_subjects: 'All Subjects',
    start_investigation: 'Start Detective Investigation',
    diagnose_evidence: 'Evidence-Based Diagnosis',
    prerequisite_gap: 'Likely Prerequisite Gap',
    misconception: 'Possible Misconception',
    procedural_error: 'Calculation or Procedural Error',
    strong_understanding: 'Strong Understanding',
    practicing: 'Practicing Regularly',
    untested: 'Baseline Untested',
    submit_answer: 'Submit Answer',
    check_answer: 'Check Answer',
    show_hint: 'Show Hint',
    previous: 'Previous',
    next: 'Next',
    explanation: 'Explanation & Concept Notes',
    worked_example: 'Worked Example',
    common_mistakes: 'Common Pitfalls',
    retest_now: 'Take Fresh Retest',
    completed: 'Completed',
    in_progress: 'In Progress',
    sync_active: 'Synced with Teacher Portal',
  },
  hi: {
    app_title: 'क्लासपल्स डिटेक्टिव',
    app_tagline: 'कमी को पहचानें। सीखना अनुकूलित करें। शिक्षक को सशक्त बनाएं।',
    student_portal: 'विद्यार्थी पोर्टल (Student)',
    teacher_portal: 'शिक्षक पोर्टल (Teacher)',
    sign_out: 'लॉग आउट',
    dashboard: 'डैशबोर्ड',
    my_subjects: 'मेरे विषय',
    learn: 'सीखें (Learn)',
    solve: 'अभ्यास करें (Solve)',
    concept_detective: 'कॉन्सेप्ट डिटेक्टिव',
    smart_recovery: 'स्मार्ट रिकवरी',
    retest: 'नया पुनः परीक्षण (Retest)',
    concept_map: 'पूर्व-आवश्यकता मानचित्र',
    ai_tutor: 'AI शिक्षक',
    photo_doubt: 'फ़ोटो से शंका समाधान',
    resources: 'संसाधन पुस्तकालय',
    assignments: 'गृहकार्य (Assignments)',
    progress: 'मेरी प्रगति',
    profile_settings: 'प्रोफ़ाइल एवं सेटिंग्स',
    interface_lang: 'इंटरफ़ेस भाषा',
    learning_lang: 'अध्ययन सामग्री भाषा',
    select_board: 'बोर्ड चुनें',
    select_class: 'कक्षा चुनें',
    all_subjects: 'सभी विषय',
    start_investigation: 'डिटेक्टिव जांच शुरू करें',
    diagnose_evidence: 'साक्ष्य-आधारित निदान',
    prerequisite_gap: 'पूर्व-आवश्यकता की कमी',
    misconception: 'संभावित गलतफहमी (भ्रांति)',
    procedural_error: 'गणना या प्रक्रियात्मक त्रुटि',
    strong_understanding: 'मजबूत समझ',
    practicing: 'नियमित अभ्यास जारी',
    untested: 'प्रारंभिक मूल्यांकन बाकी',
    submit_answer: 'उत्तर जमा करें',
    check_answer: 'उत्तर जांचें',
    show_hint: 'संकेत देखें (Hint)',
    previous: 'पिछला',
    next: 'अगला',
    explanation: 'व्याख्या एवं अवधारणा नोट्स',
    worked_example: 'हल किया गया उदाहरण',
    common_mistakes: 'सामान्य गलतियाँ',
    retest_now: 'पुनः परीक्षण दें',
    completed: 'पूर्ण हुआ',
    in_progress: 'प्रगति पर',
    sync_active: 'शिक्षक पोर्टल से सिंक्रनाइज़्ड',
  },
  te: {
    app_title: 'క్లాస్‌పల్స్ డిటెక్టివ్',
    app_tagline: 'లోపాన్ని గుర్తించండి. అభ్యసనాన్ని మార్చండి. ఉపాధ్యాయుడికి తోడ్పడండి.',
    student_portal: 'విద్యార్థి పోర్టల్',
    teacher_portal: 'ఉపాధ్యాయ పోర్టల్',
    sign_out: 'లాగ్ అవుట్',
    dashboard: 'డాష్‌బోర్డ్',
    my_subjects: 'నా సబ్జెక్టులు',
    learn: 'నేర్చుకోండి (Learn)',
    solve: 'సాధన చేయండి (Solve)',
    concept_detective: 'కాన్సెప్ట్ డిటెక్టివ్',
    smart_recovery: 'స్మార్ట్ రికవరీ',
    retest: 'తాజా పునఃపరీక్ష (Retest)',
    concept_map: 'ముందస్తు భావనల మ్యాప్',
    ai_tutor: 'AI ఉపాధ్యాయుడు',
    photo_doubt: 'ఫోటో సందేహ నివారణ',
    resources: 'వనరుల భాండాగారం',
    assignments: 'అసైన్‌మెంట్లు',
    progress: 'నా ప్రగతి',
    profile_settings: 'ప్రొఫైల్ & సెట్టింగ్‌లు',
    interface_lang: 'ఇంటర్‌ఫేస్ భాష',
    learning_lang: 'అభ్యసన పాఠ్య భాష',
    select_board: 'బోర్డును ఎంచుకోండి',
    select_class: 'తరగతిని ఎంచుకోండి',
    all_subjects: 'అన్ని సబ్జెక్టులు',
    start_investigation: 'డిటెక్టివ్ దర్యాప్తు ప్రారంభించండి',
    diagnose_evidence: 'సాక్ష్య ఆధారిత నిర్ధారణ',
    prerequisite_gap: 'ముందస్తు పరిజ్ఞాన లోపం',
    misconception: 'అవగాహన లోపం / భ్రమ',
    procedural_error: 'గణన లేదా ప్రక్రియ లోపం',
    strong_understanding: 'దృఢమైన అవగాహన',
    practicing: 'సాధన కొనసాగుతోంది',
    untested: 'ఇంకా పరీక్షించబడలేదు',
    submit_answer: 'సమాధానం సమర్పించండి',
    check_answer: 'సరిచూసుకోండి',
    show_hint: 'సూచన చూడండి (Hint)',
    previous: 'మునుపటిది',
    next: 'తరువాతిది',
    explanation: 'వివరణ & భావనాత్మక సూచనలు',
    worked_example: 'సాధించిన ఉదాహరణ',
    common_mistakes: 'సాధారణంగా చేసే తప్పులు',
    retest_now: 'రీటెస్ట్ రాయండి',
    completed: 'పూర్తయింది',
    in_progress: 'పురోగతిలో ఉంది',
    sync_active: 'టీచర్ పోర్టల్‌తో అనుసంధానించబడింది',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  interfaceLanguage: 'en',
  learningLanguage: 'en',
  setInterfaceLanguage: () => {},
  setLearningLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interfaceLanguage, setInterfaceLanguageState] = useState<LanguageCode>('en');
  const [learningLanguage, setLearningLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const savedIf = localStorage.getItem('classpulse_if_lang') as LanguageCode;
    const savedLrn = localStorage.getItem('classpulse_lrn_lang') as LanguageCode;
    if (savedIf) setInterfaceLanguageState(savedIf);
    if (savedLrn) setLearningLanguageState(savedLrn);
  }, []);

  const setInterfaceLanguage = (lang: LanguageCode) => {
    setInterfaceLanguageState(lang);
    localStorage.setItem('classpulse_if_lang', lang);
  };

  const setLearningLanguage = (lang: LanguageCode) => {
    setLearningLanguageState(lang);
    localStorage.setItem('classpulse_lrn_lang', lang);
  };

  const t = (key: string): string => {
    return translations[interfaceLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        interfaceLanguage,
        learningLanguage,
        setInterfaceLanguage,
        setLearningLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
