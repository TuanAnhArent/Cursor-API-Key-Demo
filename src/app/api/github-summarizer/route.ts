import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
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
      .select('*')
      .eq('key', apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    // TODO: Implement GitHub repository summarization logic here
    const summary = {
      repoUrl,
      message: 'GitHub repository summary will be implemented here'
    };

    // Update API key usage
    const newUsage = (apiKeyData.usage || 0) + 1;
    await supabase
      .from('api_keys')
      .update({ usage: newUsage })
      .eq('id', apiKeyData.id);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 