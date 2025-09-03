"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, X, Plus, Trash } from "lucide-react";
import { createTier, updateTier } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface TierEditorProps {
  creatorId: string;
  tier?: any;
  onCreated?: (tier: any) => void;
  onUpdated?: (tier: any) => void;
  onCancel: () => void;
}

export default function TierEditor({
  creatorId,
  tier,
  onCreated,
  onUpdated,
  onCancel,
}: TierEditorProps) {
  const isEditing = !!tier;
  
  // Parse benefits from JSON if needed
  const initialBenefits = tier?.benefits?.benefits || [];
  
  const [name, setName] = useState(tier?.name || "");
  const [description, setDescription] = useState(tier?.description || "");
  const [priceMonthlyUsd, setPriceMonthlyUsd] = useState(tier?.price_monthly_usd || "");
  const [benefits, setBenefits] = useState<string[]>(initialBenefits);
  const [newBenefit, setNewBenefit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !priceMonthlyUsd) {
      toast({
        title: "Error",
        description: "Name and price are required",
        variant: "destructive",
      });
      return;
    }
    
    const price = parseFloat(priceMonthlyUsd.toString());
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Price must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tierData = {
        name,
        description,
        price_monthly_usd: price,
        benefits: { benefits },
      };
      
      if (isEditing) {
        // Update existing tier
        const updatedTier = await updateTier(tier.id, tierData);
        if (updatedTier && onUpdated) {
          onUpdated(updatedTier);
        }
      } else {
        // Create new tier
        const newTier = await createTier({
          ...tierData,
          creator_id: creatorId,
        });
        
        if (newTier && onCreated) {
          onCreated(newTier);
        }
      }
    } catch (error) {
      console.error("Error saving tier:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} membership tier`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{isEditing ? "Edit Membership Tier" : "Create New Membership Tier"}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update your membership tier details" 
                  : "Define a new membership tier for your fans"}
              </CardDescription>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tier Name</Label>
              <Input
                id="name"
                placeholder="e.g., Bronze, Silver, Gold"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this tier offers to your fans"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceMonthlyUsd">Monthly Price (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="priceMonthlyUsd"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="5.00"
                  value={priceMonthlyUsd}
                  onChange={(e) => setPriceMonthlyUsd(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Input
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[index] = e.target.value;
                        setBenefits(newBenefits);
                      }}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBenefit(index)}
                      className="ml-2"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center">
                  <Input
                    placeholder="Add a benefit..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddBenefit}
                    className="ml-2"
                    disabled={!newBenefit.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Tier" : "Create Tier"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

