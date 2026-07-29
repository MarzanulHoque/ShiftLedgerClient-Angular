import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OrgSettingsDto } from '../../../core/models/org-settings.model';

@Injectable({ providedIn: 'root' })
export class OrgSettingsApi {
  constructor(private readonly http: HttpClient) {}

  getOrgSettings(): Observable<OrgSettingsDto> {
    return this.http.get<OrgSettingsDto>('/org-settings');
  }
}
