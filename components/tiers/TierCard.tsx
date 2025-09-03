"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash, Check } from "lucide-react";
import { deleteTier } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface TierCardProps {
  tier: any;
  onEdit: () => void;
  onDelete: (tierId: string) => void;
}

export default function TierCard({ tier, onEdit, onDelete }: TierCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }
    
    setIsDeleting(true);
    try {
      const success = await deleteTier(tier.id);
      if (success) {
        onDelete(tier.id);
      } else {
        throw new Error("Failed to delete tier");
      }
    } catch (error) {
      console.error("Error deleting tier:", error);
      toast({
        title: "Error",
        description: "Failed to delete membership tier",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  // Parse benefits from JSON if needed
  const benefits = typeof tier.benefits === 'string' 
    ? JSON.parse(tier.benefits) 
    : tier.benefits;
  
  const benefitsList = benefits?.benefits || [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{tier.name}</CardTitle>
        <CardDescription>${Number(tier.price_monthly_usd).toFixed(2)} / month</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-4">{tier.description || "No description provided."}</p>
        
        {benefitsList.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Benefits:</h4>
            <ul className="list-disc list-inside space-y-1">
              {benefitsList.map((benefit: string, index: number) => (
                <li key={index} className="text-sm">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : showConfirmDelete ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Confirm
            </>
          ) : (
            <>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

