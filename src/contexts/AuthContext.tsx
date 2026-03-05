import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '../types';
import {
  getUsuarioByEmailAndPassword,
  getUsuarioByEmail,
  addUsuario,
  nextId,
} from '../data/database';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => boolean;
  register: (nome: string, email: string, senha: string, tipoUsuario: 'locador' | 'locatario') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sempre exige login: não restaura sessão do localStorage
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (email: string, senha: string): boolean => {
    const user = getUsuarioByEmailAndPassword(email, senha);
    if (user) {
      setUsuario(user);
      return true;
    }
    return false;
  };

  const register = (
    nome: string,
    email: string,
    senha: string,
    tipoUsuario: 'locador' | 'locatario'
  ): boolean => {
    if (getUsuarioByEmail(email)) {
      return false;
    }

    const newUser: Usuario = {
      id: nextId('usuarios'),
      nome,
      email,
      senha,
      tipoUsuario,
    };

    addUsuario(newUser); // persiste no db (localStorage no MVP)
    setUsuario(newUser);
    return true;
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        register,
        logout,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
