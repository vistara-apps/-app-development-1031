import { NextRequest, NextResponse } from 'next/server';
import { Photo } from '@/types';
import { generateId } from '@/utils/helpers';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    
    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would fetch submissions for the challenge from a database
    // For this demo, we'll return mock data
    
    const mockSubmissions: Photo[] = [
      {
        photoId: generateId(),
        userId: 'user1',
        imageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/cat1.jpg',
        enhancedImageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/enhanced-cat1.jpg',
        tags: ['box', 'cute'],
        uploadTimestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      },
      {
        photoId: generateId(),
        userId: 'user2',
        imageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/cat2.jpg',
        enhancedImageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/enhanced-cat2.jpg',
        tags: ['sleeping', 'adorable'],
        uploadTimestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
      },
      {
        photoId: generateId(),
        userId: 'user3',
        imageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/cat3.jpg',
        enhancedImageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/enhanced-cat3.jpg',
        tags: ['playful', 'funny'],
        uploadTimestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
      },
      {
        photoId: generateId(),
        userId: 'user4',
        imageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/cat4.jpg',
        enhancedImageUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/enhanced-cat4.jpg',
        tags: ['curious', 'exploring'],
        uploadTimestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
      },
    ];
    
    return NextResponse.json(mockSubmissions);
  } catch (error) {
    console.error('Error fetching challenge submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenge submissions' },
      { status: 500 }
    );
  }
}

