import { FC, FormEvent, ChangeEvent } from 'react';
import { ApiKeyValidationFormProps } from '@/types/validation';

export const ApiKeyValidationForm: FC<ApiKeyValidationFormProps> = ({
  apiKey,
  onApiKeyChange,
  onSubmit
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onApiKeyChange(e.target.value);
  };

  return (
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
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#1e2435] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sk_test_..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Validate Key
        </button>
      </form>
    </div>
  );
}; 