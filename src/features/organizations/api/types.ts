// ============================================================
// Organizations — Type Contract
// ============================================================
// Generated from organization.proto (OrganizationHandler service).
// Backend routes live under /api/v1/admin/organizations; the BFF route
// handlers in src/app/api/organizations/ proxy to them and return the
// shapes below. Field names are snake_case to match the Go/protobuf JSON.
// ============================================================

// Mirrors backend common.Status. Kept as a numeric code — align the exact
// values with common.proto if you need named constants.
export type OrganizationStatus = number;

export type Organization = {
  id: number;
  name: string;
  code: string;
  logo: string;
  status: OrganizationStatus;
  created_at: number;
  updated_at: number;
};

export type OrganizationFilters = {
  page?: number;
  page_size?: number;
  search?: string;
};

// ---- Mutation payloads ----

export type CreateOrganizationPayload = {
  name: string;
  code: string;
  logo?: string;
};

export type UpdateOrganizationPayload = {
  name?: string;
  code?: string;
  logo?: string;
  status?: OrganizationStatus;
};

// ---- Response shapes ----

export type OrganizationResponse = {
  code: number;
  message: string;
  organization: Organization;
};

export type ListOrganizationsResponse = {
  code: number;
  message: string;
  organizations: Organization[];
  total: number;
};

export type DeleteOrganizationResponse = {
  code: number;
  message: string;
};

export type UploadOrganizationLogoResponse = {
  code: number;
  message: string;
  logo: string;
  organization: Organization;
};

export type LeaveOrganizationResponse = {
  code: number;
  message: string;
};
