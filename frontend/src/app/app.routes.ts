import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryStepComponent } from './components/category-step/category-step.component';
import { DescriptionStepComponent } from './components/description-step/description-step.component';
import { GoalStepComponent } from './components/goal-step/goal-step.component';
import { ReviewStepComponent } from './components/review-step/review-step.component';
import { HelpComponent } from './pages/help/help.component';
import { MyHelpersComponent } from './pages/my-helpers/my-helpers.component';

export const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'category', component: CategoryStepComponent },
  { path: 'description', component: DescriptionStepComponent },
  { path: 'goal', component: GoalStepComponent },
  { path: 'review', component: ReviewStepComponent },
  { path: 'help', component: HelpComponent },
  { path: 'my', component: MyHelpersComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
