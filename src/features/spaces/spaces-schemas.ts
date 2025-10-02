import * as z from 'zod';

export const spaceBaseSchema = z.object({
  name: z.string().min(1, 'Space name is required'),
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean().default(false),
});

export type SpaceBaseFormValues = z.infer<typeof spaceBaseSchema>;


