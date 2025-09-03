"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/auth/SignInButton";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Loader2, DollarSign, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, isLoading, userRole } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"creator" | "fan">("fan");

  // Redirect to dashboard if already logged in
  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-custom">
          FanSpark
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Ignite your creator income with direct fan support.
        </p>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-6 rounded-lg border cursor-pointer transition-all ${
                  selectedRole === "creator" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole("creator")}
              >
                <div className="flex flex-col items-center">
                  <DollarSign className="h-12 w-12 mb-4 text-primary-custom" />
                  <h2 className="text-xl font-semibold mb-2">I'm a Creator</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start earning from your fans with direct tips and membership tiers
                  </p>
                </div>
              </div>
              
              <div 
                className={`p-6 rounded-lg border cursor-pointer transition-all ${
                  selectedRole === "fan" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole("fan")}
              >
                <div className="flex flex-col items-center">
                  <Users className="h-12 w-12 mb-4 text-primary-custom" />
                  <h2 className="text-xl font-semibold mb-2">I'm a Fan</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support your favorite creators and get access to exclusive content
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <SignInButton role={selectedRole} className="w-full max-w-xs" />
              
              <p className="mt-4 text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="p-4 rounded-lg border">
                <DollarSign className="h-8 w-8 mb-2 text-primary-custom" />
                <h3 className="text-lg font-medium mb-2">Direct Tipping</h3>
                <p className="text-sm text-muted-foreground">
                  Fans can send tips directly to creators in USDC on Base
                </p>
              </div>
              
              <div className="p-4 rounded-lg border">
                <Users className="h-8 w-8 mb-2 text-primary-custom" />
                <h3 className="text-lg font-medium mb-2">Tiered Memberships</h3>
                <p className="text-sm text-muted-foreground">
                  Create membership tiers with different benefits for your fans
                </p>
              </div>
              
              <div className="p-4 rounded-lg border">
                <Shield className="h-8 w-8 mb-2 text-primary-custom" />
                <h3 className="text-lg font-medium mb-2">Content Gating</h3>
                <p className="text-sm text-muted-foreground">
                  Gate exclusive content behind membership tiers
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

