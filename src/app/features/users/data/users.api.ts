import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserDto } from '../../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>('/users');
  }
}
