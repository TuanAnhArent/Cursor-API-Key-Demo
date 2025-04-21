'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, Copy, ExternalLink, Rocket } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'dev' | 'prod';
  usage: number;
  limit?: number;
  createdAt: string;
}

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState<ApiKey | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<{
    name: string;
    type: 'dev' | 'prod';
    limitEnabled: boolean;
    limit?: number;
  }>({
    name: '',
    type: 'dev',
    limitEnabled: false,
    limit: 1000
  });

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const maskApiKey = (key: string) => {
    const prefix = key.split('-').slice(0, 2).join('-');
    return `${prefix}-${'*'.repeat(32)}`;
  };

  const handleCreate = () => {
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      key: `tvly-${formData.type}-${Math.random().toString(36).substr(2, 32)}`,
      type: formData.type,
      usage: 0,
      limit: formData.limitEnabled ? formData.limit : undefined,
      createdAt: new Date().toISOString(),
    };
    setApiKeys([...apiKeys, newKey]);
    setFormData({
      name: '',
      type: 'dev',
      limitEnabled: false,
      limit: 1000
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleEdit = (key: ApiKey) => {
    setCurrentKey(key);
    setFormData({
      name: key.name,
      type: key.type,
      limitEnabled: key.limit !== undefined,
      limit: key.limit
    });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (!currentKey) return;
    setApiKeys(apiKeys.map(key => 
      key.id === currentKey.id 
        ? { ...key, name: formData.name, type: formData.type, limit: formData.limitEnabled ? formData.limit : undefined }
        : key
    ));
    setCurrentKey(null);
    setFormData({
      name: '',
      type: 'dev',
      limitEnabled: false,
      limit: 1000
    });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-2 text-gray-400">
          <span>Pages</span>
          <span>/</span>
          <span>Overview</span>
        </div>

        <h1 className="text-4xl font-bold">Overview</h1>

        {/* Current Plan Card */}
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-rose-400/20 via-purple-400/20 to-blue-400/20 p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-sm">
                CURRENT PLAN
              </div>
              <h2 className="text-3xl font-bold">Researcher</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>API Usage</span>
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
                <div>
                  <span className="text-gray-400">Plan</span>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="text-right text-sm mt-1">0 / 1,000 Credits</div>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2">
              <span>Manage Plan</span>
            </button>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="rounded-xl bg-[#1e2435] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">API Keys</h2>
              <p className="text-gray-400 text-sm">
                The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <Plus size={20} />
              <span>New Key</span>
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left py-4 px-4">NAME</th>
                <th className="text-left py-4 px-4">TYPE</th>
                <th className="text-left py-4 px-4">USAGE</th>
                <th className="text-left py-4 px-4">KEY</th>
                <th className="text-left py-4 px-4">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-t border-gray-700">
                  <td className="py-4 px-4">{key.name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      key.type === 'dev' ? 'bg-gray-700' : 'bg-green-700'
                    }`}>
                      {key.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">{key.usage}</td>
                  <td className="py-4 px-4">
                    <div className="font-mono bg-gray-800 rounded px-3 py-1.5 text-sm">
                      {visibleKeyIds.has(key.id) ? key.key : maskApiKey(key.key)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-300"
                      >
                        {visibleKeyIds.has(key.id) ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-300">
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(key)}
                        className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-300"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="p-2 hover:bg-gray-700 rounded-lg text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-[#1a1f2e] p-8 rounded-xl w-[480px] text-gray-100">
              <h2 className="text-2xl font-bold mb-6">Create a new API key</h2>
              <p className="text-gray-400 mb-8">Enter a name and limit for the new API key.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">
                    Key Name <span className="text-gray-400">— A unique name to identify this key</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'prod' | 'dev' })}
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
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'prod' | 'dev' })}
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
                      onChange={(e) => setFormData({ ...formData, limitEnabled: e.target.checked })}
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-[#1e2435]"
                    />
                    <span>Limit monthly usage*</span>
                  </label>
                  {formData.limitEnabled && (
                    <input
                      type="number"
                      value={formData.limit}
                      onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) })}
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
                    onClick={handleCreate}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentKey(null);
                      setFormData({
                        name: '',
                        type: 'dev',
                        limitEnabled: false,
                        limit: 1000
                      });
                    }}
                    className="px-6 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 