export type Role = 'SuperAdmin' | 'DepartmentAdmin' | 'Employee';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  departmentId: string | null;
}
