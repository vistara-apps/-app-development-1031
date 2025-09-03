"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getCreatorTiers } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TierCard from "@/components/tiers/TierCard";
import TierEditor from "@/components/tiers/TierEditor";

export default function TiersPage() {
  const { user, isLoading } = useAuth();
  const [tiers, setTiers] = useState<any[]>([]);
  const [isTiersLoading, setIsTiersLoading] = useState(true);
  const [isCreatingTier, setIsCreatingTier] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTiers = async () => {
      if (!user) return;
      
      setIsTiersLoading(true);
      try {
        const tiersData = await getCreatorTiers(user.id);
        setTiers(tiersData || []);
      } catch (error) {
        console.error("Error fetching tiers:", error);
        toast({
          title: "Error",
          description: "Failed to load membership tiers",
          variant: "destructive",
        });
      } finally {
        setIsTiersLoading(false);
      }
    };
    
    if (user) {
      fetchTiers();
    }
  }, [user, toast]);

  const handleTierCreated = (newTier: any) => {
    setTiers([...tiers, newTier]);
    setIsCreatingTier(false);
    toast({
      title: "Success",
      description: "Membership tier created successfully",
    });
  };

  const handleTierUpdated = (updatedTier: any) => {
    setTiers(tiers.map(tier => tier.id === updatedTier.id ? updatedTier : tier));
    setEditingTier(null);
    toast({
      title: "Success",
      description: "Membership tier updated successfully",
    });
  };

  const handleTierDeleted = (tierId: string) => {
    setTiers(tiers.filter(tier => tier.id !== tierId));
    toast({
      title: "Success",
      description: "Membership tier deleted successfully",
    });
  };

  if (isLoading || isTiersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your tiers</h1>
        <Button asChild>
          <a href="/">Go to Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Membership Tiers</h1>
        <Button onClick={() => setIsCreatingTier(true)} disabled={isCreatingTier}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Tier
        </Button>
      </div>
      
      {isCreatingTier && (
        <div className="mb-8">
          <TierEditor 
            creatorId={user.id} 
            onCreated={handleTierCreated} 
            onCancel={() => setIsCreatingTier(false)} 
          />
        </div>
      )}
      
      {editingTier && (
        <div className="mb-8">
          <TierEditor 
            creatorId={user.id} 
            tier={editingTier} 
            onUpdated={handleTierUpdated} 
            onCancel={() => setEditingTier(null)} 
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.length > 0 ? (
          tiers.map((tier) => (
            <TierCard 
              key={tier.id} 
              tier={tier} 
              onEdit={() => setEditingTier(tier)} 
              onDelete={handleTierDeleted} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Membership Tiers Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first membership tier to start offering exclusive benefits to your fans
            </p>
            {!isCreatingTier && (
              <Button onClick={() => setIsCreatingTier(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Tier
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

