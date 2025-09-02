"use client";

import React, { useState, useEffect, useTransition, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateRecipesAction } from "@/app/actions";
import type { Recipe } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import RecipeList from "./RecipeList";
import { useAuth } from "@/contexts/AuthContext";
import RemainingTime from "./RemainingTime";

const initialState = {
  error: undefined,
  recipes: undefined,
  timestamp: Date.now(),
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Recipes
        </>
      )}
    </Button>
  );
}

export default function RecipeGenerator() {
  const [state, formAction] = useActionState(generateRecipesAction, initialState);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isPending, startTransition] = useTransition();
  const { addRecipes, user } = useAuth();
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.recipes) {
      startTransition(() => {
        setRecipes(state.recipes as Recipe[]);
        addRecipes(state.recipes as Recipe[]);
      });
      formRef.current?.reset();
    }
  }, [state.timestamp, state.recipes, addRecipes]);

  return (
    <div className="space-y-8">
      {user?.isPremium && user.subscription === 'daily' && <RemainingTime />}
      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium">
              Enter Ingredients
            </label>
            <p className="text-sm text-muted-foreground">
              Separate ingredients with a comma (e.g., chicken, tomatoes, rice).
            </p>
            <Input
              id="ingredients"
              name="ingredients"
              placeholder="What do you have on hand?"
              required
            />
          </div>
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>
      </div>

      <RecipeList recipes={recipes} isLoading={isPending} />
    </div>
  );
}
