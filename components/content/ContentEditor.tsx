"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, X, FileText, Image, Link as LinkIcon } from "lucide-react";
import { createContent, updateContent } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ContentEditorProps {
  creatorId: string;
  content?: any;
  tiers: any[];
  onCreated?: (content: any) => void;
  onUpdated?: (content: any) => void;
  onCancel: () => void;
}

export default function ContentEditor({
  creatorId,
  content,
  tiers,
  onCreated,
  onUpdated,
  onCancel,
}: ContentEditorProps) {
  const isEditing = !!content;
  
  const [title, setTitle] = useState(content?.title || "");
  const [contentType, setContentType] = useState(content?.content_type || "text");
  const [contentData, setContentData] = useState(content?.content_data || "");
  const [isPublic, setIsPublic] = useState(content?.is_public || false);
  const [tierId, setTierId] = useState(content?.tier_id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !contentData.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    
    // If not public, a tier must be selected
    if (!isPublic && !tierId) {
      toast({
        title: "Error",
        description: "Please select a membership tier for gated content",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const contentPayload = {
        title,
        content_type: contentType,
        content_data: contentData,
        is_public: isPublic,
        tier_id: isPublic ? null : tierId,
      };
      
      if (isEditing) {
        // Update existing content
        const updatedContent = await updateContent(content.id, contentPayload);
        if (updatedContent && onUpdated) {
          onUpdated(updatedContent);
        }
      } else {
        // Create new content
        const newContent = await createContent({
          ...contentPayload,
          creator_id: creatorId,
        });
        
        if (newContent && onCreated) {
          onCreated(newContent);
        }
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} content`,
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
              <CardTitle>{isEditing ? "Edit Content" : "Create New Content"}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update your content" 
                  : "Create new content for your fans"}
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Content title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={contentType}
                onValueChange={setContentType}
              >
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Text
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-2" />
                      Image URL
                    </div>
                  </SelectItem>
                  <SelectItem value="link">
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Link
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentData">
                {contentType === "text" ? "Content" : 
                 contentType === "image" ? "Image URL" : "Link URL"}
              </Label>
              
              {contentType === "text" ? (
                <Textarea
                  id="contentData"
                  placeholder="Enter your content here..."
                  value={contentData}
                  onChange={(e) => setContentData(e.target.value)}
                  rows={6}
                  required
                />
              ) : (
                <Input
                  id="contentData"
                  placeholder={contentType === "image" ? "https://example.com/image.jpg" : "https://example.com"}
                  value={contentData}
                  onChange={(e) => setContentData(e.target.value)}
                  required
                />
              )}
              
              {contentType === "image" && contentData && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="max-w-md rounded-md overflow-hidden">
                    <img
                      src={contentData}
                      alt="Preview"
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="isPublic">Make this content public (available to everyone)</Label>
            </div>
            
            {!isPublic && (
              <div className="space-y-2">
                <Label htmlFor="tierId">Required Membership Tier</Label>
                <Select
                  value={tierId}
                  onValueChange={setTierId}
                  disabled={tiers.length === 0}
                >
                  <SelectTrigger id="tierId">
                    <SelectValue placeholder={tiers.length === 0 ? "No tiers available" : "Select a tier"} />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.name} (${Number(tier.price_monthly_usd).toFixed(2)}/month)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {tiers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    You need to create membership tiers first to gate content
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || (!isPublic && tiers.length === 0)}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Content" : "Create Content"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

