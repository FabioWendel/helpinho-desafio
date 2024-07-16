import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.scss',
})
export class ReviewStepComponent {
  @Input() parentForm!: FormGroup;
  @Output() prev = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  imageUrl: SafeUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  transform(file: File): SafeUrl {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onPrev(): void {
    this.prev.emit();
  }

  ngOnInit(): void {
    const imageFile = this.parentForm.get('image')?.value;
    if (imageFile) {
      this.imageUrl = this.transform(imageFile);
    }
  }

  onSubmit(): void {
    if (this.parentForm.valid) {
      this.submitForm.emit();
    } else {
      this.parentForm.markAllAsTouched();
    }
  }
}
