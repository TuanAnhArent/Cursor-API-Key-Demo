import { FC } from 'react';
import { ApiKeyValidationResultProps } from '@/types/validation';
import { CheckIcon, CrossIcon } from '@/components/icons/ValidationIcons';

const StatusDisplay: FC<{ isValid: boolean }> = ({ isValid }) => (
  <div className={`flex items-center ${isValid ? 'text-green-500' : 'text-gray-400'} mt-1`}>
    {isValid ? <CheckIcon /> : <CrossIcon />}
    <span>{isValid ? 'Valid API Key' : 'Invalid API Key'}</span>
  </div>
);

export const ApiKeyValidationResult: FC<ApiKeyValidationResultProps> = ({ apiKey, isValid }) => (
  <div className="max-w-md mx-auto bg-[#1a1f2e] p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Validation Result</h2>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-400">API Key:</p>
        <p className="font-mono bg-[#1e2435] p-2 rounded mt-1 break-all">{apiKey}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Status:</p>
        <StatusDisplay isValid={isValid} />
      </div>
    </div>
  </div>
); 