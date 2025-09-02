import RecipeGenerator from '@/components/RecipeGenerator';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-12 md:py-20">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Sparkles className="mr-2 h-4 w-4" />
          Powered by Gemini AI
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white">
          AI Recipe Curator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Tell us what's in your pantry, and we'll whip up some delicious recipe ideas for you.
          Less waste, more taste!
        </p>
      </section>

      <RecipeGenerator />
    </div>
  );
}
