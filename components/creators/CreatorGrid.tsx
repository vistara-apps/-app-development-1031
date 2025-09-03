"use client";

import CreatorCard from "./CreatorCard";

interface CreatorGridProps {
  creators: any[];
}

export default function CreatorGrid({ creators }: CreatorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
}

