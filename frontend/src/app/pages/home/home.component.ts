import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { ContentComponent } from '../../components/content/content.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { InstructionsComponent } from '../../components/instructions/instructions.component';
import { CardComponent } from '../../components/card/card.component';
import { SearchComponent } from '../../components/search/search.component';
import { HelpService } from '../../services/help.service';
import { CommonModule } from '@angular/common';
import { Help } from '../../models/help.model';
import {
  AuthService,
  isLoggedIn,
  loggedName,
} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BannerComponent,
    ContentComponent,
    FooterComponent,
    InstructionsComponent,
    CardComponent,
    SearchComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  loading = false;
  helpers: Help[] = [];
  name: string = '';
  isLog: boolean = false;
  constructor(
    private helpService: HelpService,
    private authService: AuthService
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
    this.helpService
      .getHelpers()
      .subscribe((data) => {
        this.helpers = data;
      })
      .add(() => {
        this.loading = false;
      });
  }
}
