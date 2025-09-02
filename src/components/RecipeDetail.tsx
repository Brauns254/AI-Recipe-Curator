"use client";

import { useState, useEffect } from "react";
import type { Recipe } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getInstructionsAction } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Separator } from "./ui/separator";

interface RecipeDetailProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeDetail({ recipe, isOpen, onClose }: RecipeDetailProps) {
  const { user, favorites, toggleFavorite } = useAuth();
  const [instructions, setInstructions] = useState<string | undefined>(recipe?.instructions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when recipe changes
    setInstructions(recipe?.instructions);
    setIsLoading(false);
    setError(null);
  }, [recipe]);

  if (!recipe) return null;

  const isFavorite = favorites.includes(recipe.title);

  const handleToggleFavorite = () => {
    if (!user?.isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to save favorites.",
        variant: "destructive",
      });
      return;
    }
    toggleFavorite(recipe);
  };

  const handleGetInstructions = async () => {
    if (!user?.isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to premium to unlock AI-powered instructions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    const result = await getInstructionsAction(recipe.title, recipe.ingredients);
    setIsLoading(false);

    if (result.instructions) {
      setInstructions(result.instructions);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
  };
  
  const formattedInstructions = instructions?.split('\n').filter(line => line.trim() !== '').map((line, index) => (
    <p key={index} className="mb-2">{line}</p>
  ));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{recipe.title}</DialogTitle>
          <DialogDescription>
            A delicious recipe suggestion based on your ingredients.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-semibold mb-2">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.split(",").map((ingredient) => (
                <Badge key={ingredient.trim()} variant="secondary">
                  {ingredient.trim()}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Instructions</h3>
            {instructions ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90">
                {formattedInstructions}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Our AI chef is writing the steps...</p>
                  </div>
                ) : error ? (
                   <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                     <p className="text-sm text-muted-foreground">
                      {user?.isPremium ? "Get step-by-step instructions from our AI chef." : "This is a premium feature. Upgrade to unlock!"}
                    </p>
                    {user?.isPremium ? (
                      <Button onClick={handleGetInstructions}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Instructions
                      </Button>
                    ) : (
                      <Button asChild>
                         <Link href="/premium">Upgrade to Premium</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            aria-label="Toggle Favorite"
          >
            <Heart className={`h-6 w-6 ${isFavorite ? "text-red-500 fill-current" : "text-muted-foreground"}`} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
