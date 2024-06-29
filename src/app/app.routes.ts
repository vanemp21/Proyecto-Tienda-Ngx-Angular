import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'register', component: RegisterComponent, canActivate:[authGuard]},
    {path: 'login', component: LoginComponent, canActivate:[authGuard]},
    {path:'**', redirectTo:'/'},
];
