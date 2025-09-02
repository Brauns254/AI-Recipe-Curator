"use server";

import {
  generateRecipeSuggestions,
  GenerateRecipeSuggestionsOutput,
} from "@/ai/flows/generate-recipe-suggestions";
import {
  provideRecipeInstructions,
  ProvideRecipeInstructionsOutput,
} from "@/ai/flows/provide-recipe-instructions";
import { z } from "zod";

const generateSchema = z.object({
  ingredients: z.string().min(3, "Please enter at least one ingredient."),
});

export async function generateRecipesAction(prevState: any, formData: FormData): Promise<{
  recipes?: GenerateRecipeSuggestionsOutput["recipes"];
  error?: string;
  timestamp?: number;
}> {
  const validatedFields = generateSchema.safeParse({
    ingredients: formData.get("ingredients"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.ingredients?.[0],
      timestamp: Date.now(),
    };
  }

  try {
    const result = await generateRecipeSuggestions({
      ingredients: validatedFields.data.ingredients,
    });
    return { recipes: result.recipes, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to generate recipes. The AI might be resting. Please try again later.",
      timestamp: Date.now(),
    };
  }
}

const instructionsSchema = z.object({
  title: z.string(),
  ingredients: z.string(),
});

export async function getInstructionsAction(
  title: string,
  ingredients: string
): Promise<{ instructions?: string; error?: string }> {
  const validatedFields = instructionsSchema.safeParse({ title, ingredients });

  if (!validatedFields.success) {
    return { error: "Invalid recipe data provided." };
  }

  try {
    const result = await provideRecipeInstructions(validatedFields.data);
    return { instructions: result.instructions };
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to get instructions. The AI seems to be busy. Please try again later.",
    };
  }
}
