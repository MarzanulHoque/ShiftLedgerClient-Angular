import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DepartmentDto } from '../../../core/models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentsApi {
  constructor(private readonly http: HttpClient) {}

  getDepartments(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>('/departments');
  }
}
