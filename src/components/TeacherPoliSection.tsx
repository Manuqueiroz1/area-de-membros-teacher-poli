import React from 'react';
import { ExternalLink, Star, ArrowRight } from 'lucide-react';

export default function TeacherPoliSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Teacher Poli Platform</h2>
        <p className="text-sm sm:text-base text-gray-600">Acesse a plataforma completa de ensino de inglês</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-8 mb-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-center">
          <div>
            <h3 className="text-xl sm:text-3xl font-bold mb-4">
              Converse com a Teacher Poli IA
            </h3>
            <p className="text-purple-100 mb-6 text-sm sm:text-lg">
              Professora IA que conversa sobre qualquer assunto, gera textos, corrige seus exercícios e oferece feedback personalizado para acelerar seu aprendizado.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4">
              <a
                href="https://app.teacherpoli.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 font-bold text-sm sm:text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                <span className="hidden sm:inline">🚀 ENTRAR NA TEACHER POLI</span>
                <span className="sm:hidden">🚀 ENTRAR</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <button className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border-2 border-white text-white font-semibold text-sm sm:text-base rounded-lg hover:bg-white hover:text-purple-600 transition-colors">
                <span className="hidden sm:inline">Ver Demonstração</span>
                <span className="sm:hidden">Demo</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <p className="text-purple-100 italic text-sm sm:text-base">
                "Me surpreendi com esta incrível ferramenta. Em termos de conversação, a melhor professora de inglês que já tive!"
              </p>
              <p className="text-purple-200 mt-2 font-medium text-xs sm:text-sm">- Carlos Eloy, Aluno da Teacher Polie</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">Acesso Rápido à Plataforma</h3>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">Clique no botão abaixo para acessar diretamente sua conta na Teacher Poli</p>
        
        {/* Main Login Button */}
        <div className="text-center mb-6 sm:mb-8">
          <a
            href="https://app.teacherpoli.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg sm:text-xl rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl transform hover:scale-105"
          >
            <ExternalLink className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden sm:inline">ENTRAR NA TEACHER POLI</span>
            <span className="sm:hidden">ENTRAR</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <a
            href="https://app.teacherpoli.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 sm:p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
          >
            <div className="text-center">
              <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Input</h4>
              <p className="text-xs sm:text-sm text-gray-600">Pratique leitura</p>
            </div>
          </a>
          
          <a
            href="https://app.teacherpoli.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 sm:p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
          >
            <div className="text-center">
              <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Writing</h4>
              <p className="text-xs sm:text-sm text-gray-600">Melhore sua escrita</p>
            </div>
          </a>
          
          <a
            href="https://app.teacherpoli.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 sm:p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
          >
            <div className="text-center">
              <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Role Play</h4>
              <p className="text-xs sm:text-sm text-gray-600">Simule situações</p>
            </div>
          </a>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6 max-w-md mx-auto">
          <a
            href="https://app.teacherpoli.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 sm:p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
          >
            <div className="text-center">
              <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Speaking</h4>
              <p className="text-xs sm:text-sm text-gray-600">Pratique conversação</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
