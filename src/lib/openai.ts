import OpenAI from 'openai';
import type { AIGenerationRequest } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

/**
 * Generate context-aware legal scripts using OpenAI
 */
export async function generateLegalScript(request: AIGenerationRequest): Promise<string> {
  try {
    const { prompt, context } = request;
    
    const systemPrompt = `You are a legal rights advisor specializing in police interactions. 
    Generate clear, concise, and legally sound scripts for citizens during police encounters.
    
    Guidelines:
    - Keep responses brief and easy to remember under stress
    - Focus on de-escalation and constitutional rights
    - Avoid legal jargon - use plain language
    - Include both what to say and what NOT to say
    - Consider state-specific laws when provided
    - Prioritize safety and compliance while asserting rights
    
    Context: ${context?.state ? `State: ${context.state}` : ''} ${context?.situation ? `Situation: ${context.situation}` : ''} ${context?.language ? `Language: ${context.language}` : ''}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more consistent legal advice
    });

    return completion.choices[0]?.message?.content || 'Unable to generate script at this time.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate legal script');
  }
}

/**
 * Generate incident summary for documentation
 */
export async function generateIncidentSummary(data: {
  location: { lat: number; lon: number; address?: string };
  situationType: string;
  description: string;
  state: string;
  language: 'en' | 'es';
}): Promise<string> {
  try {
    const systemPrompt = `You are creating a professional incident summary for legal documentation.
    Generate a clear, factual summary that includes:
    - Location and time information
    - Situation type and description
    - Relevant legal context for the state
    - Professional, neutral tone
    
    Language: ${data.language === 'es' ? 'Spanish' : 'English'}
    Keep it concise but comprehensive for legal purposes.`;

    const userPrompt = `Create an incident summary for:
    Location: ${data.location.address || `${data.location.lat}, ${data.location.lon}`}
    State: ${data.state}
    Situation Type: ${data.situationType}
    Description: ${data.description}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.2,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate incident summary.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate incident summary');
  }
}

/**
 * Generate shareable incident card content
 */
export async function generateIncidentCard(data: {
  location: { lat: number; lon: number; address?: string };
  state: string;
  timestamp: string;
  situation?: string;
}): Promise<string> {
  try {
    const systemPrompt = `You are creating a concise incident summary card for legal documentation.
    Generate a clear, factual summary that includes:
    - Location and time information
    - Relevant legal rights for the state
    - Key contact information reminders
    - Professional, neutral tone
    
    Keep it under 200 words and format for easy sharing.`;

    const userPrompt = `Create an incident summary card for:
    Location: ${data.location.address || `${data.location.lat}, ${data.location.lon}`}
    State: ${data.state}
    Time: ${data.timestamp}
    ${data.situation ? `Situation: ${data.situation}` : ''}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.2,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate incident card.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate incident card');
  }
}

/**
 * Simplify legal jargon for better understanding
 */
export async function simplifyLegalText(text: string, language: 'en' | 'es' = 'en'): Promise<string> {
  try {
    const systemPrompt = `You are a legal translator who converts complex legal language into simple, understandable terms.
    
    Guidelines:
    - Use everyday language
    - Explain legal concepts clearly
    - Maintain accuracy while improving readability
    - ${language === 'es' ? 'Translate to Spanish' : 'Keep in English'}
    - Focus on practical implications for citizens`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Simplify this legal text: ${text}` }
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return text; // Return original text if simplification fails
  }
}

/**
 * Generate state-specific legal guide content
 */
export async function generateLegalGuide(state: string, topic?: string, language: 'en' | 'es' = 'en'): Promise<string> {
  try {
    const systemPrompt = `You are a legal expert creating citizen rights guides for police interactions.
    
    Create a comprehensive but concise guide covering:
    - Constitutional rights (4th, 5th, 6th amendments)
    - State-specific laws and procedures
    - Traffic stop procedures
    - Search and seizure rights
    - Arrest procedures
    - Contact information for legal aid
    
    ${topic ? `Focus specifically on: ${topic}` : ''}
    
    Format: Clear sections with bullet points
    Language: ${language === 'es' ? 'Spanish' : 'English'}
    Length: 800-1000 words maximum`;

    const userPrompt = `Create a legal rights guide for ${state} state covering ${topic || 'police interactions and citizen rights'}.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1200,
      temperature: 0.2,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate legal guide.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate legal guide');
  }
}

/**
 * Health check for OpenAI API
 */
export async function healthCheckOpenAI(): Promise<{ success: boolean; error?: string }> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
    });

    return { success: !!completion.choices[0]?.message?.content };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
