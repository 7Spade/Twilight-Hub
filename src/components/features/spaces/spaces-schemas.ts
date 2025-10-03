/**
 * @fileoverview Defines Zod schemas for validating 'space' related data.
 * This file centralizes the data validation logic for space entities, ensuring
 * consistency and type safety when creating or updating spaces. The schemas
 * are used in forms and action handlers.
 */
import * as z from 'zod';

export const spaceBaseSchema = z.object({
  name: z.string().min(1, 'Space name is required'),
  description: z.string().min(1, 'Description is required'),
  isPublic: z.boolean().default(false),
});

export type SpaceBaseFormValues = z.infer<typeof spaceBaseSchema>;
