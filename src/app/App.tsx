import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { Navbar } from '../components/Navbar';
import { HomePage } from '../components/HomePage';
import { DetalhesImovel } from '../components/DetalhesImovel';
import { CadastroImovel } from '../components/CadastroImovel';
import { MensagensPage } from '../components/MensagensPage';
import { MeusImoveisPage } from '../components/MeusImoveisPage';
import { Imovel } from '../types';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<
    'home' | 'detalhes' | 'mensagens' | 'cadastrar' | 'meus-imoveis'
  >('home');
  const [imovelSelecionado, setImovelSelecionado] = useState<Imovel | null>(null);

  const handleImovelClick = (imovel: Imovel) => {
    setImovelSelecionado(imovel);
    setCurrentPage('detalhes');
  };

  const handleNavigate = (page: 'home' | 'detalhes' | 'mensagens' | 'cadastrar' | 'meus-imoveis') => {
    setCurrentPage(page);
    if (page !== 'detalhes') {
      setImovelSelecionado(null);
    }
  };

  const handleLoginSuccess = () => {
    setCurrentPage('home');
  };

  const handleCadastroSuccess = () => {
    setCurrentPage('meus-imoveis');
  };

  if (!isAuthenticated) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {currentPage === 'home' && <HomePage onImovelClick={handleImovelClick} />}
      
      {currentPage === 'detalhes' && imovelSelecionado && (
        <DetalhesImovel imovel={imovelSelecionado} onVoltar={() => setCurrentPage('home')} />
      )}
      
      {currentPage === 'mensagens' && <MensagensPage />}
      
      {currentPage === 'cadastrar' && <CadastroImovel onSuccess={handleCadastroSuccess} />}
      
      {currentPage === 'meus-imoveis' && <MeusImoveisPage onImovelClick={handleImovelClick} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider children={
      <>
        <AppContent />
        <Toaster />
      </>
    } />
  );
}
