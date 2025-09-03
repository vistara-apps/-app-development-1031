import { NextRequest, NextResponse } from 'next/server';
import { Gift } from '@/types';
import { generateId } from '@/utils/helpers';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;
    
    if (!photoId) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would fetch gifts for the photo from a database
    // For this demo, we'll return mock data
    
    const mockGifts: Gift[] = [
      {
        giftId: generateId(),
        senderUserId: 'user5',
        photoId,
        treatType: 'fish',
        timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      },
      {
        giftId: generateId(),
        senderUserId: 'user6',
        photoId,
        treatType: 'yarn',
        timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
      },
      {
        giftId: generateId(),
        senderUserId: 'user7',
        photoId,
        treatType: 'mouse',
        timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
      },
    ];
    
    return NextResponse.json(mockGifts);
  } catch (error) {
    console.error('Error fetching gifts for photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gifts for photo' },
      { status: 500 }
    );
  }
}

