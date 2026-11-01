/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TeacherNavbar } from '../../components/common/TeacherNavbar';
import { TeacherDashboard } from './TeacherDashboard';
import { TeacherRosterPage } from './TeacherRosterPage';
import { TeacherHeatmapPage } from './TeacherHeatmapPage';
import { TeacherRadarPage } from './TeacherRadarPage';
import { TeacherGroupsPage } from './TeacherGroupsPage';
import { TeacherPlannerPage } from './TeacherPlannerPage';
import { TeacherAssignmentsPage } from './TeacherAssignmentsPage';
import { TeacherCurriculumPage } from './TeacherCurriculumPage';
import { TeacherReportsPage } from './TeacherReportsPage';
import { TeacherQuestionAnalyticsPage } from './TeacherQuestionAnalyticsPage';

export const TeacherPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col">
      <TeacherNavbar currentTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <TeacherDashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'roster' && <TeacherRosterPage />}
        {activeTab === 'heatmap' && <TeacherHeatmapPage />}
        {activeTab === 'analytics' && <TeacherQuestionAnalyticsPage />}
        {activeTab === 'radar' && <TeacherRadarPage />}
        {activeTab === 'groups' && <TeacherGroupsPage />}
        {activeTab === 'planner' && <TeacherPlannerPage />}
        {activeTab === 'assignments' && <TeacherAssignmentsPage />}
        {activeTab === 'curriculum' && <TeacherCurriculumPage />}
        {activeTab === 'reports' && <TeacherReportsPage />}
      </main>
    </div>
  );
};
