"use client";

import { useAuth } from "@/contexts/AuthContext";
import RecipeList from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Recipe } from "@/types";
import { useRouter } from "next/navigation";


export default function FavoritesPage() {
  const { user, favorites, allRecipes } = useAuth();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    } else if (user?.isLoggedIn) {
        const filtered = allRecipes.filter(recipe => favorites.includes(recipe.title));
        setFavoriteRecipes(filtered);
    }
  }, [user, favorites, allRecipes, router]);

  if (!user?.isLoggedIn) {
      // Render nothing or a loading spinner while redirecting
      return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Your Favorite Recipes</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          All your saved culinary inspirations in one place.
        </p>
      </div>

      {favoriteRecipes.length > 0 ? (
        <RecipeList recipes={favoriteRecipes} isLoading={false} />
      ) : (
        <div className="text-center py-16 px-6 rounded-lg border-2 border-dashed">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No favorites yet!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Generate some recipes and click the heart to save them.
            </p>
            <Button asChild className="mt-6">
                <Link href="/">Find Recipes</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
