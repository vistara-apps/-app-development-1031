"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface SignInButtonProps {
  role?: UserRole;
  onSuccess?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function SignInButton({
  role = "fan",
  onSuccess,
  className,
  variant = "default",
}: SignInButtonProps) {
  const { login, authenticated, ready } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Store the selected role in localStorage
      localStorage.setItem("fanspark_user_role", role);
      
      // Trigger Privy login
      await login();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!ready) {
    return (
      <Button disabled className={className} variant={variant}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (authenticated) {
    return null;
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>Sign in as {role === "creator" ? "Creator" : "Fan"}</>
      )}
    </Button>
  );
}

