'use client';

import { FC } from 'react';
import { useApiKeyValidation } from '@/hooks/useApiKeyValidation';
import { ApiKeyValidationForm } from '@/components/ApiKeyValidationForm';
import { ApiKeyValidationResult } from '@/components/ApiKeyValidationResult';
import Sidebar from '@/components/Sidebar';

const PlaygroundPage: FC = () => {
  const { apiKey, setApiKey, isValid, hasValidated, validateApiKey } = useApiKeyValidation();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#1a1f2e] text-white">
        <div className="flex flex-col h-full">
          {/* Breadcrumb header */}
          <div className="p-4 md:p-8">
            <div className="flex items-center gap-2 text-gray-400">
              <span>Pages</span>
              <span>/</span>
              <span>API Playground</span>
            </div>
          </div>

          {/* Main content - top center */}
          <div className="px-4 md:px-8">
            <div className="w-full max-w-lg mx-auto space-y-8">
              <h1 className="text-3xl font-bold text-center">API Playground</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage; 