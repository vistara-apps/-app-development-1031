import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAppStore } from '@/lib/store';

const Header: React.FC = () => {
  const { user: privyUser, logout } = usePrivy();
  const { user, currentStep, setCurrentStep } = useAppStore();
  
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-display font-bold">
          FurryFrame
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {currentStep !== 'browse' && (
          <button
            onClick={() => setCurrentStep('browse')}
            className="text-primary hover:underline"
          >
            Browse
          </button>
        )}
        
        <div className="flex items-center">
          {user && (
            <div className="flex items-center">
              <img 
                src={user.profilePicUrl || 'https://via.placeholder.com/32'} 
                alt={user.displayName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm font-medium mr-2">
                {user.displayName}
              </span>
            </div>
          )}
          
          <button
            onClick={() => logout()}
            className="text-sm text-primary hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

