import * as z from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  logo: z.string().optional(),
  // Stored as a string in the form (select value); converted to a number
  // before it is sent to the backend (common.Status).
  status: z.string().optional()
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
