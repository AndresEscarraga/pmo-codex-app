import Papa from 'papaparse';
import { ZodSchema } from 'zod';

export async function parseCsvFile<T>(file: File, schema: ZodSchema<T>): Promise<T[]> {
  const text = await file.text();
  return parseCsvText(text, schema);
}

export function parseCsvText<T>(text: string, schema: ZodSchema<T>): T[] {
  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true
  });
  if (parsed.errors.length) {
    throw new Error(parsed.errors.map(e => e.message).join('\n'));
  }
  return parsed.data.map((row, idx) => {
    const result = schema.safeParse(row);
    if (!result.success) {
      throw new Error(`Error en fila ${idx + 1}: ${result.error.message}`);
    }
    return result.data;
  });
}

export function toCsv<T extends object>(rows: T[]): string {
  return Papa.unparse(rows as any);
}
