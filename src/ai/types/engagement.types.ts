import { z } from 'genkit';

/**
 * Schema for individual tasks in a Work Breakdown Structure (WBS)
 */
export const TaskSchema = z.object({
  id: z.string().describe('Unique identifier for the task'),
  title: z.string().describe('The title or name of the task'),
  quantity: z.number().describe('The quantity of work units for this task'),
  unitPrice: z.number().describe('The price per unit for this task'),
  value: z.number().describe('The total value for this task (quantity × unitPrice)'),
  discount: z.number().optional().describe('Discount percentage applied to this task'),
  lastUpdated: z.string().describe('ISO string timestamp of when this task was last updated'),
  completedQuantity: z.number().default(0).describe('The quantity of work completed for this task'),
  subTasks: z.array(z.lazy(() => TaskSchema)).default([]).describe('Nested subtasks for this task'),
});

export type Task = z.infer<typeof TaskSchema>;

