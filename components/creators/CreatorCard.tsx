"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import TipButton from "@/components/tipping/TipButton";

interface CreatorCardProps {
  creator: any;
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={creator.profile_image_url} alt={creator.name} />
          <AvatarFallback>{getInitials(creator.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{creator.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {creator.bio || "No bio provided."}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/creators/${creator.id}`}>
            View Profile
          </Link>
        </Button>
        <TipButton creator={creator} variant="secondary" className="flex-1" />
      </CardFooter>
    </Card>
  );
}

