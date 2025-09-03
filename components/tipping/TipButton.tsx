"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import TipModal from "./TipModal";

interface TipButtonProps {
  creator: any;
  onTipComplete?: (tipData: any) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function TipButton({
  creator,
  onTipComplete,
  variant = "default",
  size = "default",
  className,
}: TipButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [showTipModal, setShowTipModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = "/";
      return;
    }
    
    setShowTipModal(true);
  };

  const handleTipComplete = (tipData: any) => {
    setShowTipModal(false);
    if (onTipComplete) {
      onTipComplete(tipData);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={className}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <DollarSign className="h-4 w-4 mr-2" />
            Send Tip
          </>
        )}
      </Button>
      
      {showTipModal && (
        <TipModal
          creator={creator}
          fan={user}
          onClose={() => setShowTipModal(false)}
          onTipComplete={handleTipComplete}
        />
      )}
    </>
  );
}

