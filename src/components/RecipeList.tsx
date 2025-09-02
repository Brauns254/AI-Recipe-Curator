"use client";

import type { Recipe } from "@/types";
import { useState } from "react";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";
import { Skeleton } from "./ui/skeleton";

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
}

export default function RecipeList({ recipes, isLoading }: RecipeListProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No recipes generated yet. Try entering some ingredients above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, index) => (
          <RecipeCard key={`${recipe.title}-${index}`} recipe={recipe} onSelect={() => setSelectedRecipe(recipe)} />
        ))}
      </div>
      <RecipeDetail
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </>
  );
}
