import { NextRequest, NextResponse } from 'next/server';
import { generateLegalScript } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import type { Script } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const situation = searchParams.get('situation');
    const language = searchParams.get('language') || 'en';

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('scripts')
      .select('*')
      .eq('state', state)
      .eq('language', language);

    if (situation) {
      query = query.eq('situation', situation);
    }

    const { data: existingScripts, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching scripts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch scripts' },
        { status: 500 }
      );
    }

    // If we have existing scripts, return them
    if (existingScripts && existingScripts.length > 0) {
      return NextResponse.json({ scripts: existingScripts });
    }

    // If no existing scripts, generate new ones
    const situations = [
      'traffic_stop',
      'vehicle_search',
      'home_search',
      'arrest',
      'stop_and_frisk',
      'public_recording',
    ];

    const generatedScripts: Script[] = [];

    for (const situationType of situations) {
      try {
        // Generate both user responses and officer scripts
        const userScripts = await generateLegalScript({
          prompt: `Generate appropriate user responses for ${situationType} situations`,
          context: {
            state,
            situation: situationType,
            language: language as 'en' | 'es'
          }
        });

        const officerScripts = await generateLegalScript({
          prompt: `Generate typical officer scripts for ${situationType} situations`,
          context: {
            state,
            situation: situationType,
            language: language as 'en' | 'es'
          }
        });

        // Process user scripts
        const userScript: Omit<Script, 'script_id' | 'created_at' | 'updated_at'> = {
          state,
          situation: situationType,
          dialogue_type: 'user_response',
          text: userScripts,
          language: language as 'en' | 'es',
          order_in_sequence: 1,
        };

        // Save user script to database
        const { data: savedUserScript, error: userError } = await supabase
          .from('scripts')
          .insert(userScript)
          .select()
          .single();

        if (!userError && savedUserScript) {
          generatedScripts.push(savedUserScript);
        }

        // Process officer scripts
        const officerScript: Omit<Script, 'script_id' | 'created_at' | 'updated_at'> = {
          state,
          situation: situationType,
          dialogue_type: 'officer_script',
          text: officerScripts,
          language: language as 'en' | 'es',
          order_in_sequence: 1,
        };

        // Save officer script to database
        const { data: savedOfficerScript, error: officerError } = await supabase
          .from('scripts')
          .insert(officerScript)
          .select()
          .single();

        if (!officerError && savedOfficerScript) {
          generatedScripts.push(savedOfficerScript);
        }
      } catch (error) {
        console.error(`Error generating scripts for ${situationType}:`, error);
        continue;
      }
    }

    // Wait a bit for database operations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Fetch the newly created scripts
    const { data: newScripts } = await supabase
      .from('scripts')
      .select('*')
      .eq('state', state)
      .eq('language', language);

    return NextResponse.json({ scripts: newScripts || generatedScripts });
  } catch (error) {
    console.error('Error in scripts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, situation, dialogue_type, language = 'en' } = body;

    if (!state || !situation || !dialogue_type) {
      return NextResponse.json(
        { error: 'State, situation, and dialogue_type are required' },
        { status: 400 }
      );
    }

    // Generate scripts for the specific situation and dialogue type
    const scripts = await generateLegalScript({
      prompt: `Generate ${dialogue_type === 'user_response' ? 'appropriate user responses' : 'typical officer scripts'} for ${situation} situations`,
      context: {
        state,
        situation,
        language: language as 'en' | 'es'
      }
    });

    const generatedScripts: Script[] = [];

    const script: Omit<Script, 'script_id' | 'created_at' | 'updated_at'> = {
      state,
      situation,
      dialogue_type,
      text: scripts,
      language,
      order_in_sequence: 1,
    };

    // Save to database
    const { data: savedScript, error: saveError } = await supabase
      .from('scripts')
      .insert(script)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving script:', saveError);
      return NextResponse.json(
        { error: 'Failed to save script' },
        { status: 500 }
      );
    }

    if (savedScript) {
      generatedScripts.push(savedScript);
    }

    return NextResponse.json({ scripts: generatedScripts });
  } catch (error) {
    console.error('Error creating scripts:', error);
    return NextResponse.json(
      { error: 'Failed to create scripts' },
      { status: 500 }
    );
  }
}
