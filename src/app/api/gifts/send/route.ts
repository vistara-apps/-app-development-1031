import { NextRequest, NextResponse } from 'next/server';
import { Gift } from '@/types';
import { generateId } from '@/utils/helpers';

export async function POST(req: NextRequest) {
  try {
    const { senderUserId, photoId, treatType } = await req.json();
    
    if (!senderUserId || !photoId || !treatType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would:
    // 1. Process the payment via Privy
    // 2. Record the gift in the database
    // 3. Notify the photo owner
    
    // For this demo, we'll mock the response
    const gift: Gift = {
      giftId: generateId(),
      senderUserId,
      photoId,
      treatType,
      timestamp: Date.now(),
    };
    
    return NextResponse.json(gift);
  } catch (error) {
    console.error('Error sending gift:', error);
    return NextResponse.json(
      { error: 'Failed to send gift' },
      { status: 500 }
    );
  }
}

