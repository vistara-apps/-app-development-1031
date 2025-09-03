"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { getCreatorTips, getCreatorSubscriptions } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Users, CreditCard, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";
import DashboardStats from "@/components/dashboard/DashboardStats";

export default function DashboardPage() {
  const { user, isLoading, userRole } = useAuth();
  const [tips, setTips] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsDataLoading(true);
      try {
        if (userRole === "creator") {
          // Fetch creator data
          const [tipsData, subscriptionsData] = await Promise.all([
            getCreatorTips(user.id),
            getCreatorSubscriptions(user.id)
          ]);
          
          setTips(tipsData || []);
          setSubscriptions(subscriptionsData || []);
        } else {
          // Fetch fan data
          // This will be implemented in a separate component
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, userRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {userRole === "creator" ? (
        <CreatorDashboard 
          user={user} 
          tips={tips} 
          subscriptions={subscriptions} 
          isLoading={isDataLoading} 
        />
      ) : (
        <FanDashboard user={user} isLoading={isDataLoading} />
      )}
    </div>
  );
}

function CreatorDashboard({ user, tips, subscriptions, isLoading }: any) {
  // Calculate stats
  const totalTips = tips.reduce((sum: number, tip: any) => sum + Number(tip.amount), 0);
  const totalSubscribers = subscriptions.length;
  const activeSubscribers = subscriptions.filter((sub: any) => sub.status === "active").length;
  const monthlyRecurringRevenue = subscriptions
    .filter((sub: any) => sub.status === "active")
    .reduce((sum: number, sub: any) => sum + Number(sub.tiers.price_monthly_usd), 0);

  return (
    <div className="space-y-6">
      <DashboardStats 
        totalTips={totalTips}
        totalSubscribers={totalSubscribers}
        activeSubscribers={activeSubscribers}
        monthlyRecurringRevenue={monthlyRecurringRevenue}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary-custom" />
              Recent Tips
            </CardTitle>
            <CardDescription>Your most recent tips from fans</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : tips.length > 0 ? (
              <div className="space-y-4">
                {tips.slice(0, 5).map((tip: any) => (
                  <div key={tip.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{tip.fans?.name || "Anonymous Fan"}</p>
                      <p className="text-sm text-muted-foreground">{new Date(tip.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="font-bold text-primary-custom">${Number(tip.amount).toFixed(2)}</div>
                  </div>
                ))}
                <Link href="/dashboard/tips">
                  <Button variant="outline" className="w-full mt-2">View All Tips</Button>
                </Link>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No tips received yet</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary-custom" />
              Recent Subscribers
            </CardTitle>
            <CardDescription>Your most recent subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.slice(0, 5).map((sub: any) => (
                  <div key={sub.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{sub.fans?.name || "Anonymous Fan"}</p>
                      <p className="text-sm text-muted-foreground">{sub.tiers.name} Tier</p>
                    </div>
                    <div className="font-bold text-primary-custom">${Number(sub.tiers.price_monthly_usd).toFixed(2)}/mo</div>
                  </div>
                ))}
                <Link href="/dashboard/subscriptions">
                  <Button variant="outline" className="w-full mt-2">View All Subscribers</Button>
                </Link>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No subscribers yet</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-custom" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your creator profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Link>
              <Link href="/dashboard/tiers">
                <Button variant="outline" className="w-full">Manage Tiers</Button>
              </Link>
              <Link href="/dashboard/content">
                <Button variant="outline" className="w-full">Create Content</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FanDashboard({ user, isLoading }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fan Dashboard</CardTitle>
          <CardDescription>Manage your subscriptions and tips</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subscriptions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
              <TabsTrigger value="tips">My Tips</TabsTrigger>
            </TabsList>
            <TabsContent value="subscriptions" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Active Subscriptions</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any active subscriptions yet.
                  </p>
                  <Link href="/creators">
                    <Button className="mt-4">Discover Creators</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="tips" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Tips Sent</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't sent any tips to creators yet.
                  </p>
                  <Link href="/creators">
                    <Button className="mt-4">Discover Creators</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

