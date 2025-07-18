import React from 'react';
import { Play, Brain, ExternalLink, BookOpen, Users, Settings, Lock } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasGeneratedPlan: boolean;
  isFirstTimeUser: boolean;
}

export default function Navigation({ activeTab, onTabChange, hasGeneratedPlan, isFirstTimeUser }: NavigationProps) {
  const tabs = [
    { id: 'onboarding', label: 'Comece por Aqui', icon: Play, locked: false },
    { id: 'ai-assistant', label: 'Gere seu Plano de Estudos', icon: Brain, locked: false },
    { id: 'teacher-poli', label: 'Teacher Poli', icon: ExternalLink, locked: isFirstTimeUser && !hasGeneratedPlan },
    { id: 'resources', label: 'Bônus', icon: BookOpen, locked: isFirstTimeUser && !hasGeneratedPlan },
    { id: 'community', label: 'Comunidade', icon: Users, locked: isFirstTimeUser && !hasGeneratedPlan },
    { id: 'settings', label: 'Configurações', icon: Settings, locked: isFirstTimeUser && !hasGeneratedPlan },
  ];

  const handleTabClick = (tab: any) => {
    if (!tab.locked) {
      onTabChange(tab.id);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                disabled={tab.locked}
                className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors min-w-0 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : tab.locked
                    ? 'border-transparent text-gray-400 cursor-not-allowed opacity-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${tab.locked ? 'opacity-50' : ''}`} />
                <span className="truncate">{tab.label}</span>
                {tab.locked && (
                  <Lock className="h-3 w-3 text-gray-400 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}