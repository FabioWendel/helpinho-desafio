import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-description-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './description-step.component.html',
  styleUrl: './description-step.component.scss',
})
export class DescriptionStepComponent {
  @Input() parentForm!: FormGroup;
  @Output() continue = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.parentForm.addControl(
      'title',
      this.fb.control('', Validators.required)
    );
    this.parentForm.addControl(
      'image',
      this.fb.control(null, Validators.required)
    );
    this.parentForm.addControl(
      'description',
      this.fb.control('', Validators.required)
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result || null;
        this.parentForm.get('image')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result || null;
        this.parentForm.get('image')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  onContinue(): void {
    if (
      this.parentForm.get('title')?.valid &&
      this.parentForm.get('image')?.valid &&
      this.parentForm.get('description')?.valid
    ) {
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
