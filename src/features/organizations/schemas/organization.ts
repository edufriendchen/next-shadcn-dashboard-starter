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

// Workspace settings — the General card edits name/code only (the logo is
// uploaded separately via the logo endpoint, so it is not a form field).
export const workspaceGeneralSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required')
});

export type WorkspaceGeneralFormValues = z.infer<typeof workspaceGeneralSchema>;
