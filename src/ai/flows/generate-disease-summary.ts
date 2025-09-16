'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summary of a plant disease, including potential causes and recommended actions.
 *
 * - generateDiseaseSummary - A function that takes disease information as input and returns a summary.
 * - GenerateDiseaseSummaryInput - The input type for the generateDiseaseSummary function.
 * - GenerateDiseaseSummaryOutput - The return type for the generateDiseaseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiseaseSummaryInputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease.'),
  potentialCauses: z
    .string()
    .describe('The potential causes of the disease.'),
  recommendedActions: z
    .string()
    .describe('Recommended actions to address the disease.'),
});
export type GenerateDiseaseSummaryInput = z.infer<
  typeof GenerateDiseaseSummaryInputSchema
>;

const GenerateDiseaseSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the identified disease.'),
});
export type GenerateDiseaseSummaryOutput = z.infer<
  typeof GenerateDiseaseSummaryOutputSchema
>;

export async function generateDiseaseSummary(
  input: GenerateDiseaseSummaryInput
): Promise<GenerateDiseaseSummaryOutput> {
  return generateDiseaseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDiseaseSummaryPrompt',
  input: {schema: GenerateDiseaseSummaryInputSchema},
  output: {schema: GenerateDiseaseSummaryOutputSchema},
  prompt: `You are an expert in plant diseases. Generate a concise summary of the identified disease, including its potential causes and recommended actions.

Disease Name: {{{diseaseName}}}
Potential Causes: {{{potentialCauses}}}
Recommended Actions: {{{recommendedActions}}}

Summary:`,
});

const generateDiseaseSummaryFlow = ai.defineFlow(
  {
    name: 'generateDiseaseSummaryFlow',
    inputSchema: GenerateDiseaseSummaryInputSchema,
    outputSchema: GenerateDiseaseSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
