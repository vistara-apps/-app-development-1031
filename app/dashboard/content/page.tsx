"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getCreatorContent, getCreatorTiers } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileText, Image, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ContentEditor from "@/components/content/ContentEditor";
import GatedContent from "@/components/content/GatedContent";

export default function ContentPage() {
  const { user, isLoading } = useAuth();
  const [content, setContent] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsContentLoading(true);
      try {
        const [contentData, tiersData] = await Promise.all([
          getCreatorContent(user.id),
          getCreatorTiers(user.id)
        ]);
        
        setContent(contentData || []);
        setTiers(tiersData || []);
      } catch (error) {
        console.error("Error fetching content:", error);
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive",
        });
      } finally {
        setIsContentLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, toast]);

  const handleContentCreated = (newContent: any) => {
    setContent([newContent, ...content]);
    setIsCreatingContent(false);
    toast({
      title: "Success",
      description: "Content created successfully",
    });
  };

  const handleContentUpdated = (updatedContent: any) => {
    setContent(content.map(item => item.id === updatedContent.id ? updatedContent : item));
    setEditingContent(null);
    toast({
      title: "Success",
      description: "Content updated successfully",
    });
  };

  const handleContentDeleted = (contentId: string) => {
    setContent(content.filter(item => item.id !== contentId));
    toast({
      title: "Success",
      description: "Content deleted successfully",
    });
  };

  if (isLoading || isContentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your content</h1>
        <Button asChild>
          <a href="/">Go to Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button onClick={() => setIsCreatingContent(true)} disabled={isCreatingContent}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Content
        </Button>
      </div>
      
      {isCreatingContent && (
        <div className="mb-8">
          <ContentEditor 
            creatorId={user.id} 
            tiers={tiers}
            onCreated={handleContentCreated} 
            onCancel={() => setIsCreatingContent(false)} 
          />
        </div>
      )}
      
      {editingContent && (
        <div className="mb-8">
          <ContentEditor 
            creatorId={user.id} 
            content={editingContent}
            tiers={tiers}
            onUpdated={handleContentUpdated} 
            onCancel={() => setEditingContent(null)} 
          />
        </div>
      )}
      
      <div className="space-y-6">
        {content.length > 0 ? (
          content.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center">
                    {item.content_type === 'text' && <FileText className="h-5 w-5 mr-2 text-primary-custom" />}
                    {item.content_type === 'image' && <Image className="h-5 w-5 mr-2 text-primary-custom" />}
                    {item.content_type === 'link' && <LinkIcon className="h-5 w-5 mr-2 text-primary-custom" />}
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.is_public 
                      ? "Public Content" 
                      : `Exclusive to ${item.tiers?.name || "Unknown"} Tier`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingContent(item)}>
                    Edit
                  </Button>
                </div>
              </div>
              
              <GatedContent 
                content={item} 
                isCreator={true}
                onDelete={() => handleContentDeleted(item.id)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No Content Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first piece of content to share with your fans
            </p>
            {!isCreatingContent && (
              <Button onClick={() => setIsCreatingContent(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Content
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

