import { z } from 'zod';

export const RiskCsvSchema = z.object({
  title: z.string(),
  prob: z.coerce.number(),
  impact: z.coerce.number(),
  owner: z.string().optional(),
  due: z.string().optional(),
  notes: z.string().optional()
});

export type RiskCsv = z.infer<typeof RiskCsvSchema>;
