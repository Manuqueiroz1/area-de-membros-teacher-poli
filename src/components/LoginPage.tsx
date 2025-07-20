import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { authService, type User } from '../services/authService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [step, setStep] = useState<'email' | 'password' | 'create-password'>('email');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, digite seu e-mail');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if email has valid purchase
      const purchaseCheck = await authService.checkPurchase(email);
      
      if (!purchaseCheck.hasPurchase) {
        setError(purchaseCheck.error || 'E-mail não encontrado em nossas compras. Verifique se você digitou corretamente o e-mail usado na compra.');
        setIsLoading(false);
        return;
      }

      setCustomerName(purchaseCheck.customerName || '');
      
      // Try to login first (check if user already has password)
      const loginAttempt = await authService.login(email, 'temp_password_check');
      
      if (loginAttempt.error === 'Usuário não encontrado') {
        // First time user - needs to create password
        setIsFirstTime(true);
        setStep('create-password');
      } else {
        // Existing user - go to password step
        setStep('password');
      }
    } catch (error) {
      setError('Erro ao verificar e-mail. Tente novamente.');
    }
    
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Por favor, digite sua senha');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Senha incorreta');
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    }
    
    setIsLoading(false);
  };

  const handleCreatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.createPassword(email, password, customerName);
      
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Erro ao criar senha');
      }
    } catch (error) {
      setError('Erro ao criar senha. Tente novamente.');
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    setStep('email');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setIsFirstTime(false);
  };

  // Test function - remove in production
  const handleTestPurchase = async () => {
    if (!email) {
      setError('Digite um e-mail primeiro');
      return;
    }
    
    const success = await authService.simulatePurchase(email, 'Usuário Teste');
    if (success) {
      setError('');
      alert('Compra simulada com sucesso! Agora você pode tentar fazer login.');
    } else {
      setError('Erro ao simular compra');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <img 
            src="/WhatsApp Image 2025-06-02 at 10.53.02.jpeg" 
            alt="Teacher Poli" 
            className="h-12 sm:h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            <span className="hidden sm:inline">Área de Membros - Teacher Poli</span>
            <span className="sm:hidden">Teacher Poli</span>
          </h1>
          <p className="text-purple-100 text-sm sm:text-base">
            {step === 'email' && 'Digite o e-mail usado na sua compra'}
            {step === 'password' && 'Digite sua senha'}
            {step === 'create-password' && 'Crie sua senha de acesso'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail da Compra
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Verificar E-mail
                  </>
                )}
              </button>

              {/* Test button - remove in production */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleTestPurchase}
                  className="text-xs text-purple-500 hover:text-purple-700 underline font-medium"
                >
                  🧪 Simular Compra para Teste
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Existing Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-700 text-sm font-medium">E-mail verificado!</p>
                  <p className="text-green-600 text-xs">Olá, {customerName}! Digite sua senha para continuar.</p>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Sua Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Entrar
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Create Password */}
          {step === 'create-password' && (
            <form onSubmit={handleCreatePasswordSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2 mb-4">
                <UserPlus className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm font-medium">Primeiro acesso!</p>
                  <p className="text-blue-600 text-xs">Olá, {customerName}! Crie uma senha para acessar sua área de membros.</p>
                </div>
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Criar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Digite a senha novamente"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Criar Conta
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-purple-100 text-xs sm:text-sm">
            © 2025 Teacher Poli. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}