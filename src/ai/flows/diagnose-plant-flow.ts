'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {DISEASES} from '@/lib/data';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plant.'),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the input is a plant.'),
    commonName: z.string().describe('The name of the identified plant. Responds with "Unknown" if not a plant.'),
    latinName: z.string().describe('The Latin name of the identified plant. Responds with "N/A" if not a plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    diagnosis: z.string().describe("A one to three sentence diagnosis of the plant's health, mentioning any diseases or pests visible."),
  }),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const PromptInputSchema = z.object({
  ...DiagnosePlantInputSchema.shape,
  diseases: z.string(),
});

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert botanist specializing in diagnosing plant illnesses from images.

You will be given an image of a plant and a short description. Your tasks are:
1. Identify the plant. If the image does not contain a plant, indicate that.
2. Assess the plant's health. Determine if it's healthy or if it shows signs of disease or pests.
3. Provide a concise diagnosis explaining your assessment.

Use the following as the primary source of information about the plant.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Here is a list of known diseases you should use for your diagnosis:
{{{diseases}}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const diseases = JSON.stringify(DISEASES);
    const result = await prompt({...input, diseases});
    const output = result.output;
    if (!output) {
      console.error('AI prompt failed to return a valid output.', result);
      throw new Error('Diagnosis failed because the AI model could not process the request.');
    }
    return output;
  }
);
