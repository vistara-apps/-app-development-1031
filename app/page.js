'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import AppHeader from './components/AppHeader';
import RecommendationCard from './components/RecommendationCard';

export default function Home() {
  const { setFrameReady } = useMiniKit();
  
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  return (
    <main className="min-h-screen">
      <AppHeader />
      <div className="container py-lg">
        <h1 className="mb-lg">VibeFinder</h1>
        <p className="mb-md">Stop doomscrolling, start discovering: Your AI guide to trending local spots.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          <RecommendationCard 
            title="Moonlight Cafe"
            description="Cozy cafe with live jazz music and specialty coffee. Currently trending for their open mic night."
            venueName="Moonlight Cafe"
            vibeTags={['Cozy', 'Live Music', 'Coffee']}
            trendScore={98}
          />
          
          <RecommendationCard 
            title="Urban Garden Rooftop"
            description="Rooftop bar with panoramic city views and craft cocktails. Popular for sunset gatherings."
            venueName="Urban Garden"
            vibeTags={['Scenic', 'Cocktails', 'Sunset']}
            trendScore={92}
          />
          
          <RecommendationCard 
            title="Pixel Arcade"
            description="Retro gaming arcade with classic cabinets and modern consoles. Trending for their weekend tournaments."
            venueName="Pixel Arcade"
            vibeTags={['Retro', 'Gaming', 'Social']}
            trendScore={87}
          />
        </div>
      </div>
    </main>
  );
}

