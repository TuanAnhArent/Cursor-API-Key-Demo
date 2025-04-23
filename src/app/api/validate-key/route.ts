import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Get API key from request headers
    const headersList = await headers();
    const apiKey = headersList.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Validate API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('id, key, name, usage, created_at')
      .eq('key', apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Return API key details without exposing sensitive information
    return NextResponse.json({
      valid: true,
      key: {
        id: apiKeyData.id,
        name: apiKeyData.name,
        usage: apiKeyData.usage || 0,
        created_at: apiKeyData.created_at
      }
    });
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 