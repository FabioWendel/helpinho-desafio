import { Component, Input } from '@angular/core';
import { ReviewStepComponent } from '../../components/review-step/review-step.component';
import { GoalStepComponent } from '../../components/goal-step/goal-step.component';
import { DescriptionStepComponent } from '../../components/description-step/description-step.component';
import { CategoryStepComponent } from '../../components/category-step/category-step.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import {
  AuthService,
  isLoggedIn,
  loggedName,
} from '../../services/auth.service';
import { Help } from '../../models/help.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HelpService } from '../../services/help.service';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    ReviewStepComponent,
    GoalStepComponent,
    DescriptionStepComponent,
    CategoryStepComponent,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  name: string = '';
  isLog: boolean = false;
  mainForm: FormGroup;
  currentStep = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private helpService: HelpService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.mainForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.name = loggedName();
    this.isLog = isLoggedIn();
    this.mainForm.addControl(
      'category',
      this.fb.control('', Validators.required)
    );
    this.mainForm.addControl('title', this.fb.control('', Validators.required));
    this.mainForm.addControl(
      'description',
      this.fb.control('', Validators.required)
    );
    this.mainForm.addControl('goal', this.fb.control('', Validators.required));
    this.mainForm.addControl(
      'image',
      this.fb.control(null, Validators.required)
    );
  }

  logoutFunc = () => this.authService.logout();

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.mainForm.valid) {
      this.loading = true;

      const formData = new FormData();
      const requesterId = localStorage.getItem('id');
      if (requesterId) formData.append('requesterId', requesterId);

      Object.keys(this.mainForm.controls).forEach((key) => {
        if (
          this.mainForm.get(key)?.value !== null &&
          this.mainForm.get(key)?.value !== undefined
        ) {
          formData.append(key, this.mainForm.get(key)?.value);
        }
      });
      console.log('help: =>', formData);
      this.helpService
        .register(formData)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Helpinho registrado com sucesso.',
            });
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1300);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Erro ao registrar Helpinho.',
            });
          },
        })
        .add(() => {
          this.loading = false;
        });
    }
  }
}
