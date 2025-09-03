"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { handleUserAuth, UserProfile, UserRole } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: "fan",
  setUserRole: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { 
    ready, 
    authenticated, 
    user: privyUser, 
    logout: privyLogout,
    wallets
  } = usePrivy();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("fan");
  const router = useRouter();

  useEffect(() => {
    // Get user role from localStorage if available
    const storedRole = localStorage.getItem("fanspark_user_role") as UserRole | null;
    if (storedRole && (storedRole === "creator" || storedRole === "fan")) {
      setUserRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      if (!ready) return;
      
      if (!authenticated || !privyUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Get connected wallet
        const wallet = wallets?.[0];
        if (!wallet?.address) {
          setIsLoading(false);
          return;
        }
        
        // Get user profile from database or create if not exists
        const userProfile = await handleUserAuth(
          privyUser.id,
          wallet.address,
          privyUser.email?.address || privyUser.farcaster?.username || null,
          privyUser.avatar || null,
          userRole
        );
        
        setUser(userProfile);
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeUser();
  }, [ready, authenticated, privyUser, wallets, userRole]);

  const logout = async () => {
    try {
      await privyLogout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    userRole,
    setUserRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

