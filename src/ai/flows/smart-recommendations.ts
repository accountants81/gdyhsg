'use server';

/**
 * @fileOverview AI-powered product recommendation flow.
 *
 * - getSmartRecommendations - A function to get product recommendations.
 * - SmartRecommendationsInput - The input type for the getSmartRecommendations function.
 * - SmartRecommendationsOutput - The return type for the getSmartRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartRecommendationsInputSchema = z.object({
  productName: z.string().describe('The name of the product being viewed or in the cart.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  category: z.string().describe('The product category (e.g., chargers, cases, screen protectors).'),
  userHistory: z.string().optional().describe('Optional history of user interactions and past purchases.'),
});

export type SmartRecommendationsInput = z.infer<typeof SmartRecommendationsInputSchema>;

const SmartRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(
    z.object({
      name: z.string().describe('The name of the recommended product.'),
      description: z.string().describe('A short description of the recommended product.'),
      reason: z.string().describe('The reason why this product is being recommended.'),
    })
  ).describe('An array of recommended products.'),
});

export type SmartRecommendationsOutput = z.infer<typeof SmartRecommendationsOutputSchema>;

export async function getSmartRecommendations(input: SmartRecommendationsInput): Promise<SmartRecommendationsOutput> {
  return smartRecommendationsFlow(input);
}

const smartRecommendationsPrompt = ai.definePrompt({
  name: 'smartRecommendationsPrompt',
  input: {schema: SmartRecommendationsInputSchema},
  output: {schema: SmartRecommendationsOutputSchema},
  prompt: `You are an expert in recommending mobile accessories that complement the product the user is currently viewing or has in their cart.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Category: {{{category}}}
  User History: {{{userHistory}}}

  Based on the product details and the user's purchase history, recommend other accessories that the user might be interested in. Explain why each product is recommended in the 'reason' field.`,,
});

const smartRecommendationsFlow = ai.defineFlow(
  {
    name: 'smartRecommendationsFlow',
    inputSchema: SmartRecommendationsInputSchema,
    outputSchema: SmartRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await smartRecommendationsPrompt(input);
    return output!;
  }
);
