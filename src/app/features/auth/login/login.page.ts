import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthApi } from '../../../core/auth/auth.api';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { extractLoginError } from '../../../core/http/problem-details.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApi);
  private readonly session = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);
    const { email, password } = this.form.getRawValue();

    this.authApi.login(email, password).subscribe({
      next: (result) => {
        this.session.setSession(result.accessToken, result.refreshToken);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        this.submitting.set(false);
        void this.router.navigateByUrl(returnUrl);
      },
      error: (error: unknown) => {
        this.serverError.set(extractLoginError(error));
        this.submitting.set(false);
      },
    });
  }
}
