"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { getWalletBalance, getUSDCBalance } from "@/lib/wallet";

interface WalletConnectProps {
  onConnect?: (walletAddress: string) => void;
  className?: string;
}

export function WalletConnect({ onConnect, className }: WalletConnectProps) {
  const { 
    ready, 
    authenticated, 
    user, 
    connectWallet, 
    createWallet, 
    wallets, 
    linkWallet 
  } = usePrivy();
  
  const [isLoading, setIsLoading] = useState(false);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // Get the connected wallet if available
  const connectedWallet = wallets?.[0];
  const walletAddress = connectedWallet?.address;

  useEffect(() => {
    // If wallet is connected, fetch balances
    if (walletAddress) {
      fetchBalances(walletAddress);
      
      // Call onConnect callback if provided
      if (onConnect) {
        onConnect(walletAddress);
      }
    }
  }, [walletAddress, onConnect]);

  const fetchBalances = async (address: string) => {
    setIsBalanceLoading(true);
    try {
      const [ethBal, usdcBal] = await Promise.all([
        getWalletBalance(address),
        getUSDCBalance(address)
      ]);
      
      setEthBalance(ethBal);
      setUsdcBalance(usdcBal);
    } catch (error) {
      console.error("Error fetching balances:", error);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    try {
      if (wallets && wallets.length > 0) {
        // If user has wallets, connect the first one
        await connectWallet(wallets[0].address);
      } else {
        // Otherwise, create a new embedded wallet
        await createWallet();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkWallet = async () => {
    setIsLoading(true);
    try {
      await linkWallet();
    } catch (error) {
      console.error("Error linking wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!ready || !authenticated) {
    return null;
  }

  if (walletAddress) {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <div className="flex items-center justify-between p-3 bg-surface rounded-lg shadow-card">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-primary-custom" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <div className="flex space-x-2 text-xs text-muted-foreground">
                {isBalanceLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <>
                    <span>{ethBalance?.slice(0, 6) || "0"} ETH</span>
                    <span>{usdcBalance?.toFixed(2) || "0"} USDC</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchBalances(walletAddress)}
            disabled={isBalanceLoading}
          >
            {isBalanceLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <Button
        onClick={handleConnectWallet}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting Wallet...
          </>
        ) : (
          <>Connect Wallet</>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={handleLinkWallet}
        disabled={isLoading}
        className="w-full"
      >
        Link External Wallet
      </Button>
    </div>
  );
}

