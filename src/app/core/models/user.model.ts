import { Role } from './auth.model';

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId: string | null;
  isActive: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  departmentId?: string | null;
}

export interface UpdateUserRequest {
  id: string;
  fullName: string;
  role: Role;
  departmentId?: string | null;
  isActive: boolean;
}
