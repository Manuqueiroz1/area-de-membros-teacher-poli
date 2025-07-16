import React from 'react';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export default function Header({ userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-h-[64px]">
          <div className="flex items-center">
            <img 
              src="/WhatsApp Image 2025-06-02 at 10.53.02.jpeg" 
              alt="Teacher Poli" 
              className="h-8 sm:h-10 w-auto"
            />
            <div className="ml-2 sm:ml-4">
              <h1 className="text-sm sm:text-xl font-bold text-gray-900 leading-tight">
                <span className="hidden sm:inline">Área de Membros - Teacher Poli</span>
                <span className="sm:hidden">Teacher Poli</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </div>
            <div className="sm:hidden">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
