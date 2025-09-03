"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import CreatorCard from "@/components/creators/CreatorCard";
import CreatorGrid from "@/components/creators/CreatorGrid";

export default function CreatorsPage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCreators, setFilteredCreators] = useState<any[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('creators')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        setCreators(data || []);
        setFilteredCreators(data || []);
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreators();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCreators(creators);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = creators.filter(creator => 
      creator.name.toLowerCase().includes(query) || 
      (creator.bio && creator.bio.toLowerCase().includes(query))
    );
    
    setFilteredCreators(filtered);
  }, [searchQuery, creators]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Discover Creators</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search creators by name or bio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCreators.length > 0 ? (
        <CreatorGrid creators={filteredCreators} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Creators Found</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery.trim() !== "" 
              ? "No creators match your search query" 
              : "There are no creators available at the moment"}
          </p>
          {searchQuery.trim() !== "" && (
            <Button onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

