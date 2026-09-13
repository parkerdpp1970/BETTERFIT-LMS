
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import LearnerProfile from './components/LearnerProfile';
import AddUser from './components/AddUser';
import Messaging from './components/Messaging';
import Calendar from './components/Calendar';
import Reports from './components/Reports';
import ActiveLearnersReport from './components/ActiveLearnersReport';
import PendingModerationReport from './components/PendingModerationReport';
import CourseManagement from './components/CourseManagement';
import ModeratorDashboard from './components/ModeratorDashboard';
import IQASamplingView from './components/IQASamplingView';
import IQAReportStandalone from './components/IQAReportStandalone';
import IQAReportsHistory from './components/IQAReportsHistory';
import IQAGenerateReport from './components/IQAGenerateReport';
import StandardizationMeetings from './components/StandardizationMeetings';
import ModeratorAnalyticsDetail from './components/ModeratorAnalyticsDetail';
import CreatorDashboard from './components/CreatorDashboard';
import FormBuilder from './components/FormBuilder';
import CreatorCourseBuilder from './components/CreatorCourseBuilder';
import BannerBuilder from './components/BannerBuilder';
import AssessorQualificationUnits from './components/AssessorQualificationUnits';
import AssessorDashboard from './components/AssessorDashboard';
import AssessorLearners from './components/AssessorLearners';
import AssessorLearnerDetail from './components/AssessorLearnerDetail';
import AssessorAnalytics from './components/AssessorAnalytics';
import AssessorPending from './components/AssessorPending';
import AssessorResultsBy from './components/AssessorResultsBy';
import AssessorAssessmentView from './components/AssessorAssessmentView';
import AssessorAssessmentLearners from './components/AssessorAssessmentLearners';
import LearnerDashboard from './components/LearnerDashboard';
import LearnerMyCourses from './components/LearnerMyCourses';
import LearnerLessonView from './components/LearnerLessonView';
import LearnerMyProfile from './components/LearnerMyProfile';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Standalone Route (No Layout) */}
        <Route path="/moderator/report-standalone" element={<IQAReportStandalone />} />

        {/* Protected Routes Wrapper */}
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/learner/:id" element={<LearnerProfile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin/reports" element={<IQAReportsHistory />} />
          <Route path="/admin/reports/active-learners" element={<ActiveLearnersReport />} />
          <Route path="/admin/reports/pending-moderation" element={<PendingModerationReport />} />
          <Route path="/courses" element={<CourseManagement />} />
          
          {/* Moderator Routes */}
          <Route path="/moderator-dashboard" element={<ModeratorDashboard />} />
          <Route path="/moderator/sampling/:assessorId" element={<IQASamplingView />} />
          <Route path="/moderator/reports-history" element={<IQAReportsHistory />} />
          <Route path="/moderator/generate-report" element={<IQAGenerateReport />} />
          <Route path="/moderator/standardization" element={<StandardizationMeetings />} />
          <Route path="/moderator/analytics/:type" element={<ModeratorAnalyticsDetail />} />
          
          {/* Creator Routes */}
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/form-builder" element={<FormBuilder />} />
          <Route path="/creator/course-builder" element={<CreatorCourseBuilder />} />
          <Route path="/creator/banner-builder" element={<BannerBuilder />} />
          
          {/* Assessor Routes */}
          <Route path="/assessor-dashboard" element={<AssessorDashboard />} />
          <Route path="/assessor/learners" element={<AssessorLearners />} />
          <Route path="/assessor/learner/:id" element={<AssessorLearnerDetail />} />
          <Route path="/assessor/pending" element={<AssessorPending />} />
          <Route path="/assessor/analytics" element={<AssessorAnalytics />} />
          <Route path="/assessor/results-by/:type" element={<AssessorResultsBy />} />
          <Route path="/assessor/qualification-units/:id" element={<AssessorQualificationUnits />} />
          <Route path="/assessor/assessment/:id" element={<AssessorAssessmentView />} />
          <Route path="/assessor/assessment-learners/:id" element={<AssessorAssessmentLearners />} />

          {/* Learner Routes */}
          <Route path="/learner-dashboard" element={<LearnerDashboard />} />
          <Route path="/learner/my-courses" element={<LearnerMyCourses />} />
          <Route path="/learner/lesson/:lessonId" element={<LearnerLessonView />} />
          <Route path="/learner/progress" element={<LearnerDashboard />} />
          <Route path="/learner/results" element={<LearnerDashboard />} />
          <Route path="/learner/profile" element={<LearnerMyProfile />} />

          {/* Shared Routes */}
          <Route path="/messages" element={<Messaging />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
