import { z } from 'zod';

export const TaskCsvSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.coerce.number().optional(),
  dependsOn: z.string().optional(),
  assignee: z.string().optional(),
  status: z.string().optional(),
  start: z.string().optional(),
  due: z.string().optional(),
  distribution: z.string().optional()
});

export type TaskCsv = z.infer<typeof TaskCsvSchema>;
