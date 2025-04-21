'use client';

import { FC } from 'react';
import { useApiKeyValidation } from '@/hooks/useApiKeyValidation';
import { ApiKeyValidationForm } from '@/components/ApiKeyValidationForm';
import { ApiKeyValidationResult } from '@/components/ApiKeyValidationResult';

const PlaygroundPage: FC = () => {
  const { apiKey, setApiKey, isValid, hasValidated, validateApiKey } = useApiKeyValidation();

  return (
    <main className="min-h-screen p-8 bg-[#0f1117]">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">API Playground</h1>
        <ApiKeyValidationForm
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSubmit={validateApiKey}
        />
        {hasValidated && (
          <ApiKeyValidationResult
            apiKey={apiKey}
            isValid={isValid}
          />
        )}
      </div>
    </main>
  );
};

export default PlaygroundPage; 