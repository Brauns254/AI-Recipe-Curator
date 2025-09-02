"use client";

import type { Recipe } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const ingredientCount = recipe.ingredients.split(',').length;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Utensils className="mr-2 h-4 w-4" />
          <span>{ingredientCount} core ingredients</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSelect} className="w-full">
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
