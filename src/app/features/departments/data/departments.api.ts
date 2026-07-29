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

  createDepartment(name: string): Observable<string> {
    return this.http.post<string>('/departments', { name });
  }

  updateDepartment(id: string, name: string): Observable<void> {
    return this.http.put<void>(`/departments/${id}`, { id, name });
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`/departments/${id}`);
  }
}
