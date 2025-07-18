import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import OnboardingSection from './components/OnboardingSection';
import AIAssistantSection from './components/AIAssistantSection';
import TeacherPoliSection from './components/TeacherPoliSection';
import ResourcesSection from './components/ResourcesSection';
import CommunitySection from './components/CommunitySection';

function App() {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  const handleLogin = (credentials: { email: string; password: string }) => {
    // In a real app, this would validate credentials with your backend
    // For now, we'll simulate a successful login
    const userName = credentials.email.split('@')[0];
    
    // Simulate checking if user has completed onboarding before
    // In a real app, this would come from your backend/database
    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${credentials.email}`);
    
    setUser({ 
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: credentials.email 
    });
    setIsLoggedIn(true);
    
    // If user has completed onboarding before, unlock everything
    if (hasCompletedOnboarding) {
      setHasGeneratedPlan(true);
      setIsFirstTimeUser(false);
    } else {
      setHasGeneratedPlan(false);
      setIsFirstTimeUser(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setHasGeneratedPlan(false);
    setIsFirstTimeUser(true);
    setActiveTab('onboarding');
  };

  const handlePlanGenerated = () => {
    setHasGeneratedPlan(true);
    setIsFirstTimeUser(false);
    
    // Mark onboarding as completed for this user
    if (user?.email) {
      localStorage.setItem(`onboarding_completed_${user.email}`, 'true');
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }
  const renderContent = () => {
    switch (activeTab) {
      case 'onboarding':
        return <OnboardingSection />;
      case 'ai-assistant':
        return <AIAssistantSection onPlanGenerated={handlePlanGenerated} />;
      case 'teacher-poli':
        return <TeacherPoliSection />;
      case 'resources':
        return <ResourcesSection />;
      case 'community':
        return <CommunitySection />;
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Configurações</h2>
              <p className="text-gray-600">Em breve: Personalize sua experiência de aprendizado</p>
            </div>
          </div>
        );
      default:
        return <OnboardingSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user.name} onLogout={handleLogout} />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        hasGeneratedPlan={hasGeneratedPlan}
        isFirstTimeUser={isFirstTimeUser}
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;