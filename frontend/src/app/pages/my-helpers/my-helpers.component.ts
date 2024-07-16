import { Component } from '@angular/core';
import { Help } from '../../models/help.model';
import { HelpService } from '../../services/help.service';
import {
  AuthService,
  isLoggedIn,
  loggedName,
} from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { InstructionsComponent } from '../../components/instructions/instructions.component';
import { SearchComponent } from '../../components/search/search.component';
import { CardComponent } from '../../components/card/card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-helpers',
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    InstructionsComponent,
    SearchComponent,
    CardComponent,
    FooterComponent,
  ],
  providers: [MessageService],
  templateUrl: './my-helpers.component.html',
  styleUrl: './my-helpers.component.scss',
})
export class MyHelpersComponent {
  loading = false;
  helpers: Help[] = [];
  name: string = '';
  isLog: boolean = false;
  constructor(
    private helpService: HelpService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  logoutFunc = () => this.authService.logout();

  ngOnInit(): void {
    this.loading = true;
    this.fetchHelpers();
    this.name = loggedName();
    this.isLog = isLoggedIn();
  }

  fetchHelpers() {
    this.loading = true;
    const id = localStorage.getItem('id');
    if (id)
      this.helpService
        .getMyHelpers(id)
        .subscribe((data) => {
          this.helpers = data;
        })
        .add(() => {
          this.loading = false;
        });
  }

  onDelete(id: string): void {
    this.loading = true;
    this.helpService
      .delete(id)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Usuário deletado com sucesso.',
        });
        this.fetchHelpers();
      })
      .add(() => {
        this.loading = false;
      });
  }
}
