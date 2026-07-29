import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateUserRequest, UpdateUserRequest, UserDto } from '../../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>('/users');
  }

  createUser(request: CreateUserRequest): Observable<string> {
    return this.http.post<string>('/users', request);
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`/users/${id}`, request);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`/users/${id}`);
  }
}
