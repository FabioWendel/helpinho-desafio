import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-goal-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goal-step.component.html',
  styleUrl: './goal-step.component.scss',
})
export class GoalStepComponent {
  @Input() parentForm!: FormGroup;
  @Output() continue = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  goals = [500, 1000, 2000, 5000];

  selectedGoal: number | null = this.goals[0];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.parentForm.addControl(
      'goal',
      this.fb.control('', Validators.required)
    );
    this.parentForm.get('goal')?.setValue(this.selectedGoal);
  }

  selectGoal(goal: number): void {
    this.selectedGoal = goal;
    this.parentForm.get('goal')?.setValue(goal);
  }

  onContinue(): void {
    if (this.parentForm.get('goal')?.valid) {
      this.continue.emit();
    } else {
      this.markAllAsTouched();
    }
  }
  onPrev(): void {
    this.prev.emit();
  }

  private markAllAsTouched() {
    Object.values(this.parentForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
