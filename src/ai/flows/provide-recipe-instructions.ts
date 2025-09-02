'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing recipe instructions using the Gemini API.
 *
 * - provideRecipeInstructions - A function that takes a recipe title and ingredients and returns step-by-step cooking instructions.
 * - ProvideRecipeInstructionsInput - The input type for the provideRecipeInstructions function.
 * - ProvideRecipeInstructionsOutput - The return type for the provideRecipeInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ProvideRecipeInstructionsInputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.string().describe('The ingredients required for the recipe.'),
});

export type ProvideRecipeInstructionsInput = z.infer<
  typeof ProvideRecipeInstructionsInputSchema
>;

const ProvideRecipeInstructionsOutputSchema = z.object({
  instructions: z.string().describe('Step-by-step cooking instructions.'),
});

export type ProvideRecipeInstructionsOutput = z.infer<
  typeof ProvideRecipeInstructionsOutputSchema
>;

export async function provideRecipeInstructions(
  input: ProvideRecipeInstructionsInput
): Promise<ProvideRecipeInstructionsOutput> {
  return provideRecipeInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideRecipeInstructionsPrompt',
  input: {schema: ProvideRecipeInstructionsInputSchema},
  output: {schema: ProvideRecipeInstructionsOutputSchema},
  prompt: `Provide step-by-step cooking instructions for the following recipe:

Recipe Title: {{{title}}}
Ingredients: {{{ingredients}}}

Keep the instructions clear and concise.`,
});

const provideRecipeInstructionsFlow = ai.defineFlow(
  {
    name: 'provideRecipeInstructionsFlow',
    inputSchema: ProvideRecipeInstructionsInputSchema,
    outputSchema: ProvideRecipeInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
