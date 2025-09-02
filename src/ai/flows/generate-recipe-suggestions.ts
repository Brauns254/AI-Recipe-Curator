'use server';

/**
 * @fileOverview AI agent that generates recipe suggestions based on user-provided ingredients.
 *
 * - generateRecipeSuggestions - A function that generates recipe suggestions.
 * - GenerateRecipeSuggestionsInput - The input type for the generateRecipeSuggestions function.
 * - GenerateRecipeSuggestionsOutput - The return type for the generateRecipeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeSuggestionsInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma separated list of ingredients to generate recipes from.'),
});
export type GenerateRecipeSuggestionsInput = z.infer<
  typeof GenerateRecipeSuggestionsInputSchema
>;

const GenerateRecipeSuggestionsOutputSchema = z.object({
  recipes: z.array(
    z.object({
      title: z.string().describe('The name of the recipe.'),
      ingredients: z.string().describe('A comma separated list of ingredients.'),
    })
  ).describe('An array of suggested recipes with their corresponding ingredients.')
});
export type GenerateRecipeSuggestionsOutput = z.infer<
  typeof GenerateRecipeSuggestionsOutputSchema
>;

export async function generateRecipeSuggestions(
  input: GenerateRecipeSuggestionsInput
): Promise<GenerateRecipeSuggestionsOutput> {
  return generateRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeSuggestionsPrompt',
  input: {schema: GenerateRecipeSuggestionsInputSchema},
  output: {schema: GenerateRecipeSuggestionsOutputSchema},
  prompt: `You are a recipe suggestion bot. Given a list of ingredients, you will generate 3 simple recipe names and their core ingredients.

  Return the response in a clear, parsable JSON format. Only return the recipe names and ingredients.

  Ingredients: {{{ingredients}}}
  `,
});

const generateRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateRecipeSuggestionsFlow',
    inputSchema: GenerateRecipeSuggestionsInputSchema,
    outputSchema: GenerateRecipeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
