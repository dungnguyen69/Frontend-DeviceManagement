import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RequestPageComponent } from './components/request-page/request-page.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { OwningPageComponent } from './components/owning-page/owning-page.component';
import { KeepingPageComponent } from './components/keeping-page/keeping-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'requests', component: RequestPageComponent },
  { path: 'users', component: UserPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'owning', component: OwningPageComponent },
  { path: 'keeping', component: KeepingPageComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
