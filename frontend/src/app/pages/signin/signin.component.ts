import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSignin } from '../../models/user.model';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  loginForm: FormGroup;
  loading = false;
  returnUrl!: string;
  submitted!: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
    } else {
      this.loading = true;
      const user: UserSignin = this.loginForm.value;
      this.authService
        .login(user)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Login bem-sucedido',
            });
            setTimeout(() => {
              {
                this.router.navigate(['/home']);
              }
            }, 1300);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Erro no login',
            });
          },
        })
        .add(() => {
          this.loading = false;
        });
    }
  }

  private markAllAsTouched() {
    Object.values(this.loginForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
