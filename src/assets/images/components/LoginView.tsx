import React, { useState } from 'react';
import { Language } from '../../../types';
import { Lock, User, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginViewProps {
  currentLang: Language;
  onLogin: () => void;
}

// API Base URL - change this to match your PHP backend location
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}/agaro/php_export`;
export default function LoginView({ currentLang, onLogin }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dict = {
    title: {
      en: 'Admin Login',
      om: 'Galmaa\'ii Bulchiinsaa',
      am: 'የአስተዳዳሪ መግቢያ'
    },
    subtitle: {
      en: 'Access the Agaro City Administration Dashboard',
      om: 'Bulchiinsa Magaalaa Aggaaroo Galmaa\'i',
      am: 'የአጋሮ ከተማ አስተዳደር ዳሽቦርድ ይግቡ'
    },
    username: {
      en: 'Username',
      om: 'Maqaa Fayyadamtaa',
      am: 'የተጠቃሚ ስም'
    },
    password: {
      en: 'Password',
      om: 'Jecha Iccitii',
      am: 'የይለፍ ቃል'
    },
    login: {
      en: 'Login',
      om: 'Galmaa\'i',
      am: 'ግባ'
    },
    loggingIn: {
      en: 'Logging in...',
      om: 'Galmaa\'aa jira...',
      am: 'በመግባት ላይ...'
    },
    error: {
      en: 'Invalid username or password',
      om: 'Maqaa fayyadamtaa yookaan jecha iccitii dogoggora',
      am: 'የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል'
    },
    credentials: {
      en: 'Demo Credentials: admin / agaro2026',
      om: 'Galmaa\'ii Fakkeessaa: admin / agaro2026',
      am: 'የሙከራ መግቢያ: admin / agaro2026'
    },
    backToHome: {
      en: 'Back to Home',
      om: 'Garuu Mana',
      am: 'ወደ መነሻ ተመለስ'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin_login.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || dict.error[currentLang]);
        setLoading(false);
        return;
      }
      onLogin();
    } catch (error) {
      console.error('Admin login failed:', error);
      setError(error instanceof Error ? error.message : dict.error[currentLang]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.backToHome[currentLang]}
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-emerald-700 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            {dict.title[currentLang]}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {dict.subtitle[currentLang]}
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs text-amber-800 font-mono text-center">
            {dict.credentials[currentLang]}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.username[currentLang]}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.password[currentLang]}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {dict.loggingIn[currentLang]}
              </span>
            ) : (
              dict.login[currentLang]
            )}
          </button>
        </form>
      </div>
    </div>
  );
}