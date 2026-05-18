'use server';
/**
 * @fileOverview An AI tool to audit internship certificate data for inconsistencies.
 *
 * - flagInconsistentCertificateData - A function that checks for inconsistencies in certificate data.
 * - FlagInconsistentCertificateDataInput - The input type for the flagInconsistentCertificateData function.
 * - FlagInconsistentCertificateDataOutput - The return type for the flagInconsistentCertificateData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import dayjs from 'dayjs';

const FlagInconsistentCertificateDataInputSchema = z.object({
  internshipDomain: z.string().describe('The domain of the internship (e.g., Software Development, Data Science, Marketing).'),
  totalHours: z.number().int().positive().describe('The total number of hours reported for the internship.'),
  startDate: z.string().describe('The start date of the internship in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the internship in YYYY-MM-DD format.'),
});
export type FlagInconsistentCertificateDataInput = z.infer<typeof FlagInconsistentCertificateDataInputSchema>;

const FlagInconsistentCertificateDataOutputSchema = z.object({
  isInconsistent: z.boolean().describe('True if an inconsistency was found, false otherwise.'),
  reason: z.string().optional().describe('A detailed explanation of the inconsistency found, if any.'),
  suggestedHours: z.number().int().positive().optional().describe('Suggested total hours if an inconsistency is found, based on standard expectations for the domain and duration.'),
});
export type FlagInconsistentCertificateDataOutput = z.infer<typeof FlagInconsistentCertificateDataOutputSchema>;

export async function flagInconsistentCertificateData(
  input: FlagInconsistentCertificateDataInput
): Promise<FlagInconsistentCertificateDataOutput> {
  return flagInconsistentCertificateDataFlow(input);
}

const auditPrompt = ai.definePrompt({
  name: 'flagInconsistentCertificateDataPrompt',
  input: { schema: FlagInconsistentCertificateDataInputSchema.extend({
    durationWeeks: z.number().positive().describe('The calculated duration of the internship in full weeks.'),
    durationDaysOffset: z.number().int().min(0).max(6).describe('The remaining days after full weeks in the internship duration.'),
  }) },
  output: { schema: FlagInconsistentCertificateDataOutputSchema },
  prompt: `You are an AI Credential Audit Tool for Eunous IT. Your task is to review internship certificate data and flag inconsistencies.\n\nGiven the following internship details, determine if the 'totalHours' reported are consistent with typical expectations for the 'internshipDomain' and the provided duration.\n\nAssume a standard working week has 5 working days.\n\nConsider these guidelines for expected weekly hours:\n- For a full-time internship: approximately 40 hours per week (8 hours/day).\n- For a part-time internship: approximately 20 hours per week (4 hours/day).\n- Assume an average internship is somewhere between full-time and part-time for estimation purposes, or consider both if the total hours are ambiguous.\n\nInternship Domain: {{{internshipDomain}}}\nTotal Reported Hours: {{{totalHours}}}\nInternship Duration: {{{durationWeeks}}} weeks and {{{durationDaysOffset}}} days.\n\nCalculate an expected range of total hours based on the duration. If the reported 'totalHours' deviate significantly (e.g., more than 20% difference) from this expected range, mark it as inconsistent.\n\nOutput your findings as a JSON object.\n`,
});

const flagInconsistentCertificateDataFlow = ai.defineFlow(
  {
    name: 'flagInconsistentCertificateDataFlow',
    inputSchema: FlagInconsistentCertificateDataInputSchema,
    outputSchema: FlagInconsistentCertificateDataOutputSchema,
  },
  async (input) => {
    const startDate = dayjs(input.startDate);
    const endDate = dayjs(input.endDate);

    if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate)) {
      // Return a structured error indicating invalid dates
      return {
        isInconsistent: true,
        reason: 'Invalid start or end date provided, or end date is before start date.',
        suggestedHours: undefined, // No suggestion possible with invalid dates
      };
    }

    const diffInDays = endDate.diff(startDate, 'day') + 1; // +1 to include both start and end day
    const durationWeeks = Math.floor(diffInDays / 7);
    const durationDaysOffset = diffInDays % 7;

    const promptInput = {
      ...input,
      durationWeeks,
      durationDaysOffset,
    };

    const { output } = await auditPrompt(promptInput);
    // Ensure output is not null and matches the schema
    if (!output) {
      throw new Error('AI prompt did not return a valid output.');
    }
    return output;
  }
);
