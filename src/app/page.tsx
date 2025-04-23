'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import Image from 'next/image';

interface EmailFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'auth') {
      toast.error('Authentication failed. Please try again.', {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(false);
      
      if (session) {
        router.push('/dashboards');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/dashboards');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://pizfabjdepzmjauoxchx.supabase.co/auth/v1/callback'
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isSignUp) {
        if (emailFormData.password !== emailFormData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: emailFormData.email,
          password: emailFormData.password,
        });

        if (error) throw error;
        toast.success('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailFormData.email,
          password: emailFormData.password,
        });

        if (error) throw error;
      }

      setShowEmailModal(false);
    } catch (error: unknown) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#2a3142] to-[#1e2435] relative">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <Toaster position="top-right" />
        <div className="max-w-md w-full">
          <div className="text-center space-y-6 bg-[#1e2435]/90 p-8 rounded-2xl shadow-xl border border-gray-800/50">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome to API Key Manager</h1>
            <p className="text-gray-400">Manage your API keys securely</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Image 
                  src="/google-logo.svg"
                  alt="Google logo" 
                  width={20}
                  height={20}
                />
                {loading ? 'Logging in...' : 'Login with Google'}
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                disabled={loading}
                className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Login with Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Authentication Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e2435] rounded-xl p-6 md:p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              {isSignUp ? 'Create an Account' : 'Sign In'}
            </h2>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={emailFormData.email}
                  onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
                  className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={emailFormData.password}
                  onChange={(e) => setEmailFormData({ ...emailFormData, password: e.target.value })}
                  className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {isSignUp && (
                <div>
                  <label className="block text-gray-400 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={emailFormData.confirmPassword}
                    onChange={(e) => setEmailFormData({ ...emailFormData, confirmPassword: e.target.value })}
                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              <div className="flex flex-col gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
