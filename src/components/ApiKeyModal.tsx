import { FormData } from '@/types/api-key';
import { Rocket } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  formData: FormData;
  isEditMode: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (formData: FormData) => void;
}

export function ApiKeyModal({
  isOpen,
  formData,
  isEditMode,
  onClose,
  onSubmit,
  onFormChange,
}: ApiKeyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1a1f2e] p-8 rounded-xl w-[480px] text-gray-100">
        <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Update API key' : 'Create a new API key'}</h2>
        <p className="text-gray-400 mb-8">Enter a name and limit for the new API key.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block mb-2">
              Key Name <span className="text-gray-400">— A unique name to identify this key</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="w-full bg-[#1e2435] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Key Name"
            />
          </div>

          <div>
            <label className="block mb-4">
              Key Type <span className="text-gray-400">— Choose the environment for this key</span>
            </label>
            <div className="space-y-3">
              <label className={`block p-4 rounded-lg border ${
                formData.type === 'prod' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 bg-[#1e2435]'
              } cursor-pointer`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="keyType"
                    value="prod"
                    checked={formData.type === 'prod'}
                    onChange={(e) => onFormChange({ ...formData, type: e.target.value as 'prod' | 'dev' })}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData.type === 'prod' ? 'border-blue-500' : 'border-gray-600'
                  }`}>
                    {formData.type === 'prod' && (
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket size={18} className="text-gray-400" />
                    <span className="font-medium">Production</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1 ml-7">Rate limited to 1,000 requests/minute</p>
              </label>

              <label className={`block p-4 rounded-lg border ${
                formData.type === 'dev' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 bg-[#1e2435]'
              } cursor-pointer`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="keyType"
                    value="dev"
                    checked={formData.type === 'dev'}
                    onChange={(e) => onFormChange({ ...formData, type: e.target.value as 'prod' | 'dev' })}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData.type === 'dev' ? 'border-blue-500' : 'border-gray-600'
                  }`}>
                    {formData.type === 'dev' && (
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-gray-400">&lt;/&gt;</code>
                    <span className="font-medium">Development</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1 ml-7">Rate limited to 100 requests/minute</p>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.limitEnabled}
                onChange={(e) => onFormChange({ 
                  ...formData, 
                  limitEnabled: e.target.checked,
                  usage: e.target.checked ? 1 : 0,
                  limits: e.target.checked ? 1000 : 0
                })}
                className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-[#1e2435]"
              />
              <span>Limit monthly usage*</span>
            </label>
            {formData.limitEnabled && (
              <input
                type="number"
                value={formData.limits ?? ''}
                onChange={(e) => onFormChange({ ...formData, limits: parseInt(e.target.value) })}
                className="w-full bg-[#1e2435] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                placeholder="1000"
              />
            )}
            <p className="text-sm text-gray-400 mt-2">
              * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>

          <div className="flex justify-start gap-3 mt-8">
            <button
              onClick={onSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isEditMode ? 'Update' : 'Create'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 