import { useState, useEffect } from 'react';
import { ApiKey, FormData } from '@/types/api-key';
import { apiKeyService } from '@/services/api-key.service';
import { toast } from 'react-hot-toast';

const DEMO_MODE = true;

export function useApiKeys() {
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

  useEffect(() => {
    fetchApiKeys();
    const interval = setInterval(() => {
      if (DEMO_MODE) {
        simulateUsage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchApiKeys = async () => {
    try {
      const data = await apiKeyService.fetchApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const simulateUsage = async () => {
    if (!DEMO_MODE) return;
    
    for (const key of apiKeys) {
      try {
        const randomUsage = Math.floor(Math.random() * 1000);
        await apiKeyService.updateUsage(key.id, randomUsage);
      } catch (error) {
        console.error('Error updating usage:', error);
      }
    }
    
    fetchApiKeys();
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

      const data = await apiKeyService.createApiKey(newKey);
      setApiKeys([data, ...apiKeys]);
      resetForm();
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

  const handleUpdate = async () => {
    if (!currentKey) return;
    try {
      const updatedKey = {
        name: formData.name,
        type: formData.type,
        limits: formData.limitEnabled ? formData.limits : null,
        usage: formData.usage
      };

      const data = await apiKeyService.updateApiKey(currentKey.id, updatedKey);
      setApiKeys(apiKeys.map(key => 
        key.id === currentKey.id ? { ...key, ...data } as ApiKey : key
      ));
      resetForm();
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

  const handleDelete = async (id: string) => {
    try {
      await apiKeyService.deleteApiKey(id);
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

  const resetForm = () => {
    setCurrentKey(null);
    setFormData({
      name: '',
      type: 'dev',
      limitEnabled: false,
      limits: null,
      usage: 0
    });
    setIsModalOpen(false);
  };

  return {
    apiKeys,
    isModalOpen,
    setIsModalOpen,
    currentKey,
    setCurrentKey,
    visibleKeyIds,
    setVisibleKeyIds,
    formData,
    setFormData,
    handleCreate,
    handleUpdate,
    handleDelete,
    resetForm
  };
} 