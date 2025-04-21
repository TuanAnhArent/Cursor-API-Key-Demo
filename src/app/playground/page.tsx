'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Query Supabase to check if the API key exists
      const { data, error: supabaseError } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key', apiKey)
        .single();

      // Check if we have valid data (data will be null if no matching key is found)
      const isValid = !supabaseError && data !== null;
      
      // Always redirect to protected page with validation status
      router.push(`/protected?key=${encodeURIComponent(apiKey)}&isValid=${isValid}`);
    } catch (err) {
      setError('An error occurred while validating the API key');
      console.error('API key validation error:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Playground</h1>
      <div className="max-w-md mx-auto bg-[#1a1f2e] p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 bg-[#1e2435] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="sk_test_..."
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Validate Key
          </button>
        </form>
      </div>
    </div>
  );
} 