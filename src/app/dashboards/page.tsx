'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, Copy, ExternalLink, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/auth-js';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'dev' | 'prod';
  usage: number;
  limits: number | null;
  created_at: string;
}

interface FormData {
  name: string;
  type: 'dev' | 'prod';
  limitEnabled: boolean;
  limits: number | null;
  usage: number;
}

const DEMO_MODE = true; // Set to false in production

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState<ApiKey | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'dev',
    limitEnabled: false,
    limits: null,
    usage: 0
  });

  const fetchApiKeys = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  }, []);

  const simulateUsage = useCallback(async () => {
    if (!DEMO_MODE) return;
    
    for (const key of apiKeys) {
      const randomUsage = Math.floor(Math.random() * 1000);
      const { error } = await supabase
        .from('api_keys')
        .update({ usage: randomUsage })
        .eq('id', key.id);
      
      if (error) {
        console.error('Error updating usage:', error);
      }
    }
    
    // Refresh the keys after updating usage
    fetchApiKeys();
  }, [apiKeys, fetchApiKeys]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        router.push('/');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    fetchApiKeys();
    const interval = setInterval(() => {
      if (DEMO_MODE) {
        simulateUsage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchApiKeys, simulateUsage]);

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

  const handleCreate = async () => {
    try {
      if (!formData.name) {
        throw new Error('Name is required');
      }

      const newKey = {
        name: formData.name,
        key: `tvly-${formData.type}-${Math.random().toString(36).substr(2, 32)}`,
        type: formData.type,
        usage: formData.usage,
        limits: formData.limitEnabled ? formData.limits : null
      };

      console.log('Creating API key:', newKey);
      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', JSON.stringify(error, null, 2));
        throw new Error(error.message || 'Failed to create API key');
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      setApiKeys([data as ApiKey, ...apiKeys]);
      setFormData({
        name: '',
        type: 'dev',
        limitEnabled: false,
        limits: null,
        usage: 0
      });
      setIsModalOpen(false);
      toast.success('API key created successfully', {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#fff',
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error creating API key:', errorMessage);
      toast.error(errorMessage, {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#fff',
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully', {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        icon: '❌',
        iconTheme: {
          primary: '#EF4444',
          secondary: '#1e2435',
        },
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key', {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#fff',
        },
      });
    }
  };

  const handleEdit = (key: ApiKey) => {
    setCurrentKey(key);
    setFormData({
      name: key.name,
      type: key.type,
      limitEnabled: key.limits !== null,
      limits: key.limits,
      usage: key.usage
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentKey) return;
    try {
      const updatedKey = {
        name: formData.name,
        type: formData.type,
        limits: formData.limitEnabled ? formData.limits : null,
        usage: formData.usage
      };

      console.log('Updating API key:', updatedKey);
      const { data, error } = await supabase
        .from('api_keys')
        .update(updatedKey)
        .eq('id', currentKey.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', JSON.stringify(error, null, 2));
        throw new Error(error.message || 'Failed to update API key');
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      setApiKeys(apiKeys.map(key => 
        key.id === currentKey.id ? { ...key, ...data } as ApiKey : key
      ));
      setCurrentKey(null);
      setFormData({
        name: '',
        type: 'dev',
        limitEnabled: false,
        limits: null,
        usage: 0
      });
      setIsModalOpen(false);
      toast.success('API key updated successfully', {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#fff',
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error updating API key:', errorMessage);
      toast.error(errorMessage, {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#fff',
        },
      });
    }
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success('API key copied to clipboard', {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#fff',
        },
      });
    } catch {
      toast.error('Failed to copy key to clipboard', {
        style: {
          background: '#1e2435',
          color: '#fff',
          border: '1px solid #374151',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#fff',
        },
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1f2e]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#1a1f2e] text-white p-4 md:p-8">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-2 text-gray-400">
            <div className="flex items-center gap-2">
              <span>Pages</span>
              <span>/</span>
              <span>Overview</span>
            </div>
            <div className="md:ml-auto flex items-center gap-4 mt-2 md:mt-0">
              <span className="text-sm text-gray-400 truncate max-w-[150px] md:max-w-none">
                {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">Overview</h1>

          {/* Current Plan Card */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-r from-rose-400/20 via-purple-400/20 to-blue-400/20 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-sm">
                  CURRENT PLAN
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Researcher</h2>
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
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
                <span>Manage Plan</span>
              </button>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="rounded-xl bg-[#1e2435] p-4 md:p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">API Keys</h2>
                <p className="text-gray-400 text-sm">
                  The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full md:w-auto justify-center"
              >
                <Plus size={20} />
                <span>New Key</span>
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-[600px] px-4 md:px-0">
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
                          <div className="font-mono bg-gray-800 rounded px-3 py-1.5 text-sm break-all">
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
                            <button 
                              onClick={() => handleCopyKey(key.key)}
                              className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-300"
                            >
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
            </div>
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
                        onChange={(e) => setFormData({ 
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
                        onChange={(e) => setFormData({ ...formData, limits: parseInt(e.target.value) })}
                        className="w-full bg-[#1e2435] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        placeholder="1000"
                      />
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
                    </p>
                  </div>

                  <div className="flex justify-start gap-3 mt-8">
                    <button
                      onClick={currentKey ? handleUpdate : handleCreate}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {currentKey ? 'Update' : 'Create'}
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setCurrentKey(null);
                        setFormData({
                          name: '',
                          type: 'dev',
                          limitEnabled: false,
                          limits: null,
                          usage: 0
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
    </div>
  );
} 