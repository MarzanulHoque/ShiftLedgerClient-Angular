import { HttpParams } from '@angular/common/http';

export function toHttpParams<T extends object>(params: T): HttpParams {
  let httpParams = new HttpParams();
  for (const [key, value] of Object.entries(params) as Array<[string, unknown]>) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    httpParams = httpParams.set(key, String(value));
  }
  return httpParams;
}
