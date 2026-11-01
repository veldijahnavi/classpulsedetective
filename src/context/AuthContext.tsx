/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, TeacherProfile, UserRole, LanguageCode } from '../types';

interface AuthContextType {
  portal: 'student' | 'teacher' | null;
  user: User | null;
  studentProfile: StudentProfile | null;
  teacherProfile: TeacherProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  selectPortal: (portal: 'student' | 'teacher' | null) => void;
  login: (loginId: string, password: string,portal: 'student' | 'teacher') => Promise<boolean>;
  registerStudent: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateLanguagePreferences: (interfaceLang: LanguageCode, learningLang: LanguageCode) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  portal: null,
  user: null,
  studentProfile: null,
  teacherProfile: null,
  token: null,
  isLoading: true,
  error: null,
  selectPortal: () => {},
  login: async () => false,
  registerStudent: async () => false,
  logout: async () => {},
  updateLanguagePreferences: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portal, setPortal] = useState<'student' | 'teacher' | null>(() => {
    return (localStorage.getItem('classpulse_portal') as 'student' | 'teacher') || null;
  });
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('classpulse_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectPortal = (p: 'student' | 'teacher' | null) => {
    setPortal(p);
    if (p) {
      localStorage.setItem('classpulse_portal', p);
    } else {
      localStorage.removeItem('classpulse_portal');
    }
  };

  const refreshProfile = async () => {
    const currentToken = localStorage.getItem('classpulse_token');
    if (!currentToken) {
      setUser(null);
      setStudentProfile(null);
      setTeacherProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        const data = await res.json();
        setUser(data.user);
        setStudentProfile(data.studentProfile || null);
        setTeacherProfile(data.teacherProfile || null);
        setPortal(data.user.role);
        localStorage.setItem('classpulse_portal', data.user.role);
      } else {
        // Session expired or invalid
        localStorage.removeItem('classpulse_token');
        setToken(null);
        setUser(null);
        setStudentProfile(null);
        setTeacherProfile(null);
      }
    } catch (e) {
      console.error('Session validation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (loginId: string, password: string, targetPortal: 'student' | 'teacher'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password, portal: targetPortal }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : {};
      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return false;
      }

      setToken(data.token);
      localStorage.setItem('classpulse_token', data.token);
      setUser(data.user);
      setStudentProfile(data.studentProfile || null);
      setTeacherProfile(data.teacherProfile || null);
      setPortal(targetPortal);
      localStorage.setItem('classpulse_portal', targetPortal);

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Network error during login.');
      setIsLoading(false);
      return false;
    }
  };

  const registerStudent = async (registrationData: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await res.json() : {};
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setIsLoading(false);
        return false;
      }

      setToken(data.token);
      localStorage.setItem('classpulse_token', data.token);
      setUser(data.user);
      setStudentProfile(data.studentProfile || null);
      setPortal('student');
      localStorage.setItem('classpulse_portal', 'student');

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Network error during registration.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      const currentToken = token || localStorage.getItem('classpulse_token');
      if (currentToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentToken}` },
        });
      }
    } catch (e) {
      console.warn('Logout network error, clearing client credentials locally:', e);
    } finally {
      localStorage.removeItem('classpulse_token');
      localStorage.removeItem('classpulse_portal');
      setToken(null);
      setUser(null);
      setStudentProfile(null);
      setTeacherProfile(null);
      setPortal(null);
    }
  };

  const updateLanguagePreferences = async (interfaceLang: LanguageCode, learningLang: LanguageCode) => {
    if (studentProfile) {
      setStudentProfile({
        ...studentProfile,
        interfaceLanguage: interfaceLang,
        learningLanguage: learningLang,
      });
    }

    const currentToken = token || localStorage.getItem('classpulse_token');
    if (currentToken) {
      try {
        await fetch('/api/auth/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            interfaceLanguage: interfaceLang,
            learningLanguage: learningLang,
          }),
        });
      } catch (e) {
        console.error('Failed to sync language preferences:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        portal,
        user,
        studentProfile,
        teacherProfile,
        token,
        isLoading,
        error,
        selectPortal,
        login,
        registerStudent,
        logout,
        updateLanguagePreferences,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
