"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCreatorById, getCreatorTiers, getCreatorContent } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import TipButton from "@/components/tipping/TipButton";
import GatedContent from "@/components/content/GatedContent";
import { useAuth } from "@/providers/AuthProvider";

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params.id as string;
  const { user } = useAuth();
  
  const [creator, setCreator] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!creatorId) return;
      
      setIsLoading(true);
      try {
        const [creatorData, tiersData, contentData] = await Promise.all([
          getCreatorById(creatorId),
          getCreatorTiers(creatorId),
          getCreatorContent(creatorId)
        ]);
        
        setCreator(creatorData);
        setTiers(tiersData || []);
        
        // Filter content to only show public content for now
        // (Subscription check will be added later)
        setContent(contentData?.filter((item: any) => item.is_public) || []);
        
        // TODO: Check user's active subscriptions to this creator
        // This would be implemented in a real application
        setActiveSubscriptions([]);
      } catch (error) {
        console.error("Error fetching creator data:", error);
        toast({
          title: "Error",
          description: "Failed to load creator profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreatorData();
  }, [creatorId, toast]);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if user has access to a specific tier
  const hasAccessToTier = (tierId: string) => {
    return activeSubscriptions.some(sub => sub.tier_id === tierId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
          <Button asChild>
            <Link href="/creators">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Creators
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/creators">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Creators
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={creator.profile_image_url} alt={creator.name} />
                <AvatarFallback>{getInitials(creator.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{creator.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {creator.bio || "No bio provided."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <TipButton creator={creator} />
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="tiers">Membership Tiers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="mt-4">
              {content.length > 0 ? (
                <div className="space-y-6">
                  {content.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 shadow-card">
                      <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                      <GatedContent 
                        content={item} 
                        hasAccess={item.is_public || hasAccessToTier(item.tier_id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">No Content Available</h2>
                  <p className="text-muted-foreground">
                    This creator hasn't published any public content yet
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tiers" className="mt-4">
              {tiers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tiers.map((tier) => (
                    <Card key={tier.id}>
                      <CardHeader>
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription>${Number(tier.price_monthly_usd).toFixed(2)} / month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{tier.description || "No description provided."}</p>
                        
                        {tier.benefits?.benefits?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Benefits:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {tier.benefits.benefits.map((benefit: string, index: number) => (
                                <li key={index} className="text-sm">
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          Subscribe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">No Membership Tiers</h2>
                  <p className="text-muted-foreground">
                    This creator hasn't set up any membership tiers yet
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

