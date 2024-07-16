import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  isLoggedIn,
  loggedName,
} from '../../services/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category-step',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './category-step.component.html',
  styleUrl: './category-step.component.scss',
})
export class CategoryStepComponent {
  @Input() parentForm!: FormGroup;
  @Output() continue = new EventEmitter<void>();

  categories = [
    { id: 1, name: 'Jogos', imageUrl: 'assets/image/game.png' },
    { id: 2, name: 'Saúde', imageUrl: 'assets/image/heart.png' },
    { id: 3, name: 'Música', imageUrl: 'assets/image/music.png' },
    { id: 4, name: 'Reforma', imageUrl: 'assets/image/reforme.png' },
    { id: 5, name: 'Emergência', imageUrl: 'assets/image/emerg.png' },
    { id: 6, name: 'Hospitalar', imageUrl: 'assets/image/activity.png' },
  ];

  selectedCategoryId: number = 1;

  ngOnInit(): void {
    this.parentForm
      .get('category')
      ?.setValue(
        this.categories.find((el) => el.id == this.selectedCategoryId)?.name
      );
  }

  selectCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.parentForm
      .get('category')
      ?.setValue(this.categories.find((el) => el.id == categoryId)?.name);
  }

  onContinue(): void {
    this.continue.emit();
  }
}
