import { NextResponse } from 'next/server';
import { Challenge } from '@/types';
import { generateId } from '@/utils/helpers';

export async function GET() {
  try {
    // In a real implementation, we would fetch active challenges from a database
    // For this demo, we'll return mock data
    
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    const mockChallenges: Challenge[] = [
      {
        challengeId: generateId(),
        title: 'Cats in Boxes',
        description: 'Share photos of your cat in their favorite box or container',
        startDate: now - oneDayMs, // Started yesterday
        endDate: now + oneDayMs * 6, // Ends in 6 days
        prompt: 'Show us your cat\'s favorite box or container hideout!',
      },
      {
        challengeId: generateId(),
        title: 'Sleepy Kitties',
        description: 'Capture your cat in their most adorable sleeping position',
        startDate: now - oneDayMs * 2, // Started 2 days ago
        endDate: now + oneDayMs * 5, // Ends in 5 days
        prompt: 'What\'s the cutest position your cat sleeps in?',
      },
      {
        challengeId: generateId(),
        title: 'Curious Cats',
        description: 'Show your cat exploring or investigating something interesting',
        startDate: now - oneDayMs * 3, // Started 3 days ago
        endDate: now + oneDayMs * 4, // Ends in 4 days
        prompt: 'What has your cat been curious about lately?',
      },
    ];
    
    return NextResponse.json(mockChallenges);
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active challenges' },
      { status: 500 }
    );
  }
}

