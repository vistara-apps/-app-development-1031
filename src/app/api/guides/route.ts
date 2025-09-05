import { NextRequest, NextResponse } from 'next/server';
import { generateLegalGuide } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import type { LegalGuide } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const language = searchParams.get('language') || 'en';

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    // First, try to get existing guides from database
    const { data: existingGuides, error: fetchError } = await supabase
      .from('legal_guides')
      .select('*')
      .eq('state', state)
      .eq('language', language);

    if (fetchError) {
      console.error('Error fetching guides:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch guides' },
        { status: 500 }
      );
    }

    // If we have existing guides, return them
    if (existingGuides && existingGuides.length > 0) {
      return NextResponse.json({ guides: existingGuides });
    }

    // If no existing guides, generate new ones
    const guideTopics = [
      'Traffic Stops and Vehicle Searches',
      'Home Searches and Warrants',
      'Arrest Procedures and Miranda Rights',
      'Stop and Frisk Encounters',
      'Public Photography and Recording Rights',
    ];

    const generatedGuides: LegalGuide[] = [];

    for (const topic of guideTopics) {
      try {
        const content = await generateLegalGuide(state, topic, language as 'en' | 'es');
        
        const guide: Omit<LegalGuide, 'guide_id' | 'created_at' | 'updated_at'> = {
          state,
          title: topic,
          content,
          language: language as 'en' | 'es',
        };

        // Save to database
        const { data: savedGuide, error: saveError } = await supabase
          .from('legal_guides')
          .insert(guide)
          .select()
          .single();

        if (saveError) {
          console.error('Error saving guide:', saveError);
          continue;
        }

        if (savedGuide) {
          generatedGuides.push(savedGuide);
        }
      } catch (error) {
        console.error(`Error generating guide for ${topic}:`, error);
        continue;
      }
    }

    return NextResponse.json({ guides: generatedGuides });
  } catch (error) {
    console.error('Error in guides API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, title, language = 'en' } = body;

    if (!state || !title) {
      return NextResponse.json(
        { error: 'State and title are required' },
        { status: 400 }
      );
    }

    // Generate a single guide
    const content = await generateLegalGuide(state, title, language);
    
    const guide: Omit<LegalGuide, 'guide_id' | 'created_at' | 'updated_at'> = {
      state,
      title,
      content,
      language,
    };

    // Save to database
    const { data: savedGuide, error: saveError } = await supabase
      .from('legal_guides')
      .insert(guide)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving guide:', saveError);
      return NextResponse.json(
        { error: 'Failed to save guide' },
        { status: 500 }
      );
    }

    return NextResponse.json({ guide: savedGuide });
  } catch (error) {
    console.error('Error creating guide:', error);
    return NextResponse.json(
      { error: 'Failed to create guide' },
      { status: 500 }
    );
  }
}
