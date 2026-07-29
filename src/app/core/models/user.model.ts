import { Role } from './auth.model';

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId: string | null;
  isActive: boolean;
}
