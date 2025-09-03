'use client';

export default function MapPin({ active = false, onClick }) {
  return (
    <div 
      className={`map-pin ${active ? 'active' : 'inactive'}`}
      onClick={onClick}
    >
      <span>📍</span>
    </div>
  );
}

