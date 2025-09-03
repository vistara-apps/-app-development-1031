"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getCreatorById, updateCreator } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfileEditor from "@/components/dashboard/ProfileEditor";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [creator, setCreator] = useState<any>(null);
  const [isCreatorLoading, setIsCreatorLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreator = async () => {
      if (!user) return;
      
      setIsCreatorLoading(true);
      try {
        const creatorData = await getCreatorById(user.id);
        setCreator(creatorData);
      } catch (error) {
        console.error("Error fetching creator:", error);
        toast({
          title: "Error",
          description: "Failed to load creator profile",
          variant: "destructive",
        });
      } finally {
        setIsCreatorLoading(false);
      }
    };
    
    if (user) {
      fetchCreator();
    }
  }, [user, toast]);

  const handleProfileUpdate = async (updatedProfile: any) => {
    if (!user) return;
    
    try {
      const updated = await updateCreator(user.id, updatedProfile);
      if (updated) {
        setCreator(updated);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isCreatorLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your profile</h1>
        <Button asChild>
          <a href="/">Go to Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Creator Profile</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <ProfileEditor creator={creator} onUpdate={handleProfileUpdate} />
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Your connected wallet for receiving payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  value={creator?.base_wallet_address || ""}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  This is the wallet address where you'll receive tips and subscription payments
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              To change your wallet, you'll need to sign out and sign in with a different wallet
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

