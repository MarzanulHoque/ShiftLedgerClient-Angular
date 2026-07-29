import { HttpParams } from '@angular/common/http';

export function toHttpParams(params: Record<string, string | number | boolean | null | undefined>): HttpParams {
  let httpParams = new HttpParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    httpParams = httpParams.set(key, String(value));
  }
  return httpParams;
}
