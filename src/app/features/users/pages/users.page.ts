import { Component, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { StatTileComponent } from '../../dashboard/components/stat-tile/stat-tile.component';
import { DepartmentsTableComponent } from '../../departments/components/departments-table/departments-table.component';
import { injectDepartments } from '../../departments/data/departments.queries';
import { injectUsers } from '../data/users.queries';
import { UsersTableComponent } from '../components/users-table/users-table.component';

type Tab = 'users' | 'departments';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [MatButtonToggleModule, StatTileComponent, UsersTableComponent, DepartmentsTableComponent],
  templateUrl: './users.page.html',
  styleUrl: './users.page.scss',
})
export class UsersPage {
  readonly tab = signal<Tab>('users');

  private readonly usersQuery = injectUsers();
  private readonly departmentsQuery = injectDepartments();

  get adminCount(): number {
    return (this.usersQuery.data() ?? []).filter((u) => u.role !== 'Employee').length;
  }

  get mechanicCount(): number {
    return (this.usersQuery.data() ?? []).filter((u) => u.role === 'Employee').length;
  }

  get activeCount(): number {
    return (this.usersQuery.data() ?? []).filter((u) => u.isActive).length;
  }

  get departmentCount(): number {
    return (this.departmentsQuery.data() ?? []).length;
  }
}
