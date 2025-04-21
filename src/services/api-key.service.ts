import { supabase } from '@/lib/supabase';
import { ApiKey } from '@/types/api-key';

export const apiKeyService = {
  async fetchApiKeys() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createApiKey(newKey: Omit<ApiKey, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    return data;
  },

  async updateApiKey(id: string, updatedKey: Partial<ApiKey>) {
    const { data, error } = await supabase
      .from('api_keys')
      .update(updatedKey)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');
    return data;
  },

  async deleteApiKey(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateUsage(id: string, usage: number) {
    const { error } = await supabase
      .from('api_keys')
      .update({ usage })
      .eq('id', id);

    if (error) throw error;
  }
}; 