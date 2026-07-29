import { AuthUser, Role } from '../models/auth.model';

// .NET's ClaimTypes.Role — NOT the xmlsoap.org/2005 family that Name/NameIdentifier/Email use.
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

// Plain claim type (not a ClaimTypes.* URI) — see JwtTokenService.CreateAccessToken. Absent for
// SuperAdmin (org-wide, no department).
const DEPARTMENT_CLAIM = 'dept';

// JWT segments are base64url with the padding stripped (RFC 7515) — atob() can throw on an
// unpadded string depending on its exact length, so pad back out to a multiple of 4 first
// rather than relying on atob's forgiving-base64 leniency.
function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeAccessToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(base64UrlDecode(payload));
    const role = json[ROLE_CLAIM] as Role | undefined;
    if (
      (role !== 'SuperAdmin' && role !== 'DepartmentAdmin' && role !== 'Employee') ||
      typeof json.sub !== 'string'
    ) {
      console.error('Unexpected access token claims shape', json);
      return null;
    }
    const departmentId = typeof json[DEPARTMENT_CLAIM] === 'string' ? (json[DEPARTMENT_CLAIM] as string) : null;
    return { id: json.sub, email: json.email as string, role, departmentId };
  } catch (error) {
    console.error('Failed to decode access token', error);
    return null;
  }
}
