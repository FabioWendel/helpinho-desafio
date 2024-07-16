import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Help } from '../../models/help.model';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() items: Help[] = [];
  @Input() loading: Boolean = false;
  @Input() my = false;
  @Output() delete = new EventEmitter<string>();

  constructor(private confirmationService: ConfirmationService) {}

  confirmDelete(item: Help): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este help?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItem(item);
      },
    });
  }

  confirmEdit(item: Help): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja editar este help?',
      header: 'Confirmação de Edição',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.editItem(item);
      },
    });
  }

  deleteItem(item: Help): void {
    this.delete.emit(item.id);
  }

  editItem(item: Help): void {
    console.log('Item editado:', item);
  }
}
