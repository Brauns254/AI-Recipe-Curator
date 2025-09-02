import { config } from 'dotenv';
config();

import '@/ai/flows/generate-recipe-suggestions.ts';
import '@/ai/flows/provide-recipe-instructions.ts';