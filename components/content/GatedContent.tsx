"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { Lock, Unlock, ExternalLink, Trash, Loader2 } from "lucide-react";
import { deleteContent } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface GatedContentProps {
  content: any;
  isCreator?: boolean;
  hasAccess?: boolean;
  onDelete?: () => void;
}

export default function GatedContent({
  content,
  isCreator = false,
  hasAccess = false,
  onDelete,
}: GatedContentProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { toast } = useToast();

  // Determine if content should be shown
  const shouldShowContent = content.is_public || isCreator || hasAccess;

  const handleDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }
    
    setIsDeleting(true);
    try {
      const success = await deleteContent(content.id);
      if (success && onDelete) {
        onDelete();
      } else {
        throw new Error("Failed to delete content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  // Render content based on type
  const renderContent = () => {
    if (!shouldShowContent) {
      return (
        <div className="flex flex-col items-center justify-center py-8 bg-muted/20 rounded-md">
          <Lock className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Exclusive Content</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This content is exclusive to {content.tiers?.name} tier subscribers
          </p>
          <Button asChild>
            <Link href={`/creators/${content.creator_id}`}>Subscribe to Access</Link>
          </Button>
        </div>
      );
    }

    switch (content.content_type) {
      case "text":
        return (
          <div className="prose max-w-none">
            <p>{content.content_data}</p>
          </div>
        );
      case "image":
        return (
          <div className="flex justify-center">
            <img 
              src={content.content_data} 
              alt={content.title} 
              className="max-w-full h-auto rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
              }}
            />
          </div>
        );
      case "link":
        return (
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <a href={content.content_data} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Link
              </a>
            </Button>
          </div>
        );
      default:
        return <p>Unknown content type</p>;
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          {renderContent()}
        </CardContent>
      </Card>
      
      {isCreator && onDelete && (
        <div className="mt-4 flex justify-end">
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
                Confirm Delete
              </>
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      )}
      
      {!content.is_public && shouldShowContent && !isCreator && (
        <div className="mt-2 flex items-center justify-center">
          <Unlock className="h-4 w-4 text-primary-custom mr-1" />
          <span className="text-xs text-muted-foreground">
            You have access to this exclusive content
          </span>
        </div>
      )}
    </div>
  );
}

