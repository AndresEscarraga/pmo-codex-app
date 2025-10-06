import { z } from 'zod';

export const DependencyEdgeSchema = z.object({
  From: z.string(),
  To: z.string(),
  Type: z.string().optional()
});

export type DependencyEdge = z.infer<typeof DependencyEdgeSchema>;
