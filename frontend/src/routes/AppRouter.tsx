import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { AboutPage } from '../pages/AboutPage';
import { FeaturesPage } from '../pages/FeaturesPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ChatPage } from '../pages/ChatPage';
import { AdminPage } from '../pages/AdminPage';
import { DoshaQuizPage } from '../pages/DoshaQuizPage';
import { SymptomCheckerPage } from '../pages/SymptomCheckerPage';
import { HerbRecommendationPage } from '../pages/HerbRecommendationPage';
import { LifestylePage } from '../pages/LifestylePage';
import { RemediesPage } from '../pages/RemediesPage';
import { KnowledgeBasePage } from '../pages/KnowledgeBasePage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dosha-quiz" element={<DoshaQuizPage />} />
        <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
        <Route path="/herbs" element={<HerbRecommendationPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
        <Route path="/remedies" element={<RemediesPage />} />
        <Route path="/upload" element={<KnowledgeBasePage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

