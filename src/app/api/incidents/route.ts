import { NextRequest, NextResponse } from 'next/server';
import { generateIncidentSummary } from '@/lib/openai';
import { createShareableCard } from '@/lib/pinata';
import { supabase } from '@/lib/supabase';
import type { IncidentReport, ShareableCard, LocationData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      location, 
      recording_url, 
      situation_type, 
      description,
      state,
      language = 'en'
    } = body;

    if (!user_id || !location) {
      return NextResponse.json(
        { error: 'User ID and location are required' },
        { status: 400 }
      );
    }

    // Create incident report
    const incidentData: Omit<IncidentReport, 'report_id' | 'created_at'> = {
      user_id,
      timestamp: new Date(),
      location,
      recording_url,
      generated_card_url: null,
    };

    const { data: savedIncident, error: saveError } = await supabase
      .from('incident_reports')
      .insert(incidentData)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving incident:', saveError);
      return NextResponse.json(
        { error: 'Failed to save incident report' },
        { status: 500 }
      );
    }

    // Generate incident summary using AI
    let summaryContent = '';
    try {
      summaryContent = await generateIncidentSummary({
        location,
        situationType: situation_type || 'general_encounter',
        description: description || 'Police interaction recorded',
        state,
        language: language as 'en' | 'es',
      });
    } catch (aiError) {
      console.error('Error generating AI summary:', aiError);
      // Fallback to basic summary
      summaryContent = `Police interaction recorded at ${location.address || `${location.lat}, ${location.lon}`} on ${new Date().toLocaleString()}. ${description || 'No additional details provided.'}`;
    }

    // Create shareable card
    let shareableCard: ShareableCard | null = null;
    try {
      shareableCard = await createShareableCard({
        title: `Incident Report - ${new Date().toLocaleDateString()}`,
        content: summaryContent,
        location,
        timestamp: new Date(),
      });

      // Update incident report with card URL
      if (shareableCard.ipfsUrl) {
        await supabase
          .from('incident_reports')
          .update({ generated_card_url: shareableCard.ipfsUrl })
          .eq('report_id', savedIncident.report_id);
      }
    } catch (cardError) {
      console.error('Error creating shareable card:', cardError);
      // Continue without card - incident is still saved
    }

    return NextResponse.json({
      incident: savedIncident,
      shareableCard,
    });
  } catch (error) {
    console.error('Error in incidents API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: incidents, error: fetchError } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fetchError) {
      console.error('Error fetching incidents:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch incidents' },
        { status: 500 }
      );
    }

    return NextResponse.json({ incidents: incidents || [] });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
