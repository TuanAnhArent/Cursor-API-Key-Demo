import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useApiKeyValidation() {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const validateApiKey = async () => {
    setIsValid(false);
    setHasValidated(true);

    if (!apiKey.trim()) {
      return;
    }

    try {
      // Query Supabase to check if the API key exists
      const { data, error: supabaseError } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key', apiKey)
        .single();

      // Check if we have valid data (data will be null if no matching key is found)
      const validationResult = !supabaseError && data !== null;
      setIsValid(validationResult);
    } catch (err) {
      console.error('API key validation error:', err);
    }
  };

  return {
    apiKey,
    setApiKey,
    isValid,
    hasValidated,
    validateApiKey
  };
} 