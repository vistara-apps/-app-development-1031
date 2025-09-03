import React, { createContext, useContext, useEffect, useState } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { useAppStore } from './store';
import { getUserProfile } from '@/utils/api';

// Configure wagmi
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

// Create auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Privy configuration
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAppStore();
  
  // Handle authentication with Privy
  const handleLogin = async () => {
    // This will be handled by Privy's login flow
  };
  
  const handleLogout = async () => {
    // This will be handled by Privy's logout flow
    setUser(null);
  };
  
  return (
    <WagmiConfig config={config}>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ['wallet', 'farcaster'],
          appearance: {
            theme: 'light',
            accentColor: 'hsl(230, 75%, 50%)',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        <PrivyWagmiConnector>
          <AuthContext.Provider
            value={{
              isAuthenticated: false, // Will be updated by usePrivy hook in components
              isLoading,
              login: handleLogin,
              logout: handleLogout,
            }}
          >
            {children}
          </AuthContext.Provider>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </WagmiConfig>
  );
};

// Custom hook for Privy Wagmi connector
const PrivyWagmiConnector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser } = useAppStore();
  const { wallet, ready, authenticated, user } = usePrivyWagmi();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!ready) return;
    
    setIsLoading(false);
    
    if (authenticated && user) {
      // Get Farcaster ID if available
      const farcasterAccount = user.linkedAccounts.find(
        (account) => account.type === 'farcaster'
      );
      
      if (farcasterAccount && farcasterAccount.id) {
        // Fetch user profile from API
        getUserProfile(farcasterAccount.id)
          .then((userProfile) => {
            setUser(userProfile);
          })
          .catch((error) => {
            console.error('Error fetching user profile:', error);
          });
      }
    }
  }, [ready, authenticated, user, setUser]);
  
  return <>{children}</>;
};

