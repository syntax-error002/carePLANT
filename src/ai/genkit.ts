import {config} from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Get the API key from environment variables
const googleApiKey = process.env.GOOGLE_API_KEY;

// Check if the API key is available
if (!googleApiKey) {
  throw new Error("GOOGLE_API_KEY environment variable not set. Please add it to your .env file.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey: googleApiKey})], // Use the validated key
  model: 'googleai/gemini-1.5-flash',
});
