import { useState, useEffect, useCallback } from 'react';
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

  const fetchApiKeys = useCallback(async () => {
    try {
      const data = await apiKeyService.fetchApiKeys();
      setApiKeys(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch API keys';
      console.error('Error fetching API keys:', errorMessage);
      toast.error(errorMessage);
    }
  }, [setApiKeys]);

  const simulateUsage = useCallback(async () => {
    if (!DEMO_MODE) return;
    
    for (const key of apiKeys) {
      try {
        const randomUsage = Math.floor(Math.random() * 1000);
        await apiKeyService.updateUsage(key.id, randomUsage);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update usage';
        console.error('Error updating usage:', errorMessage);
      }
    }
    
    fetchApiKeys();
  }, [apiKeys, fetchApiKeys]);

  useEffect(() => {
    fetchApiKeys();
    const interval = setInterval(() => {
      if (DEMO_MODE) {
        simulateUsage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [simulateUsage, fetchApiKeys]);

  const handleCreate = useCallback(async () => {
    try {
      const newKey = {
        name: formData.name,
        key: `tvly-${formData.type}-${Math.random().toString(36).substr(2, 32)}`,
        type: formData.type,
        usage: formData.usage,
        limits: formData.limitEnabled ? formData.limits : null
      };
      await apiKeyService.createApiKey(newKey);
      toast.success('API key created successfully');
      setIsModalOpen(false);
      setFormData({
        name: '',
        type: 'dev',
        limitEnabled: false,
        limits: null,
        usage: 0
      });
      fetchApiKeys();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create API key';
      console.error('Error creating API key:', errorMessage);
      toast.error(errorMessage);
    }
  }, [formData, fetchApiKeys, setIsModalOpen, setFormData]);

  const handleUpdate = useCallback(async () => {
    if (!currentKey) return;
    try {
      await apiKeyService.updateApiKey(currentKey.id, formData);
      toast.success('API key updated successfully');
      setIsModalOpen(false);
      setCurrentKey(null);
      setFormData({
        name: '',
        type: 'dev',
        limitEnabled: false,
        limits: null,
        usage: 0
      });
      fetchApiKeys();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update API key';
      console.error('Error updating API key:', errorMessage);
      toast.error(errorMessage);
    }
  }, [currentKey, formData, fetchApiKeys, setIsModalOpen, setCurrentKey, setFormData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await apiKeyService.deleteApiKey(id);
      toast.success('API key deleted successfully');
      fetchApiKeys();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete API key';
      console.error('Error deleting API key:', errorMessage);
      toast.error(errorMessage);
    }
  }, [fetchApiKeys]);

  const handleReset = useCallback(async (id: string) => {
    try {
      await apiKeyService.updateUsage(id, 0);
      toast.success('Usage reset successfully');
      fetchApiKeys();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset usage';
      console.error('Error resetting usage:', errorMessage);
      toast.error(errorMessage);
    }
  }, [fetchApiKeys]);

  const resetForm = useCallback(() => {
    setCurrentKey(null);
    setFormData({
      name: '',
      type: 'dev',
      limitEnabled: false,
      limits: null,
      usage: 0
    });
    setIsModalOpen(false);
  }, []);

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
    handleReset,
    resetForm
  };
} 