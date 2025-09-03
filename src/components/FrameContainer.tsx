import React from 'react';

interface FrameContainerProps {
  children: React.ReactNode;
  variant?: 'default';
}

const FrameContainer: React.FC<FrameContainerProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  return (
    <div className="frame-container py-6">
      {children}
    </div>
  );
};

export default FrameContainer;

