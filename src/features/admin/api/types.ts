// ============================================================
// Admin — Type Contract
// ============================================================
// Response shapes, filters, and mutation payloads for the admin
// (admin-account management) resource. These are the frontend's
// contract with the backend — the BFF route handlers in
// src/app/api/admin/ proxy to the real backend and return this shape.
// ============================================================

export type Admin = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
};

export type AdminFilters = {
  page?: number;
  limit?: number;
  roles?: string;
  status?: string;
  search?: string;
  sort?: string;
};

export type AdminsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_admins: number;
  offset: number;
  limit: number;
  admins: Admin[];
};

export type AdminResponse = {
  success: boolean;
  time: string;
  message: string;
  admin: Admin | null;
};

export type AdminMutationPayload = {
  username: string;
  email: string;
  role: string;
  status: string;
  password?: string;
};
