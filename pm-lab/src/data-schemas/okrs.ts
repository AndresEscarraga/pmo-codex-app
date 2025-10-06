import { z } from 'zod';

export const OKRCsvSchema = z.object({
  objective: z.string(),
  kr_name: z.string(),
  target: z.coerce.number(),
  current: z.coerce.number(),
  confidence: z.coerce.number()
});

export type OKRCsv = z.infer<typeof OKRCsvSchema>;
