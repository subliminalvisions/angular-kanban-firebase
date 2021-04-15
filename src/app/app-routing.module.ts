import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from  './admin/login/login.component';
import { RegisterComponent } from  './admin/register/register.component';
import { ForgotPasswordComponent } from  './admin/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from  './admin/verify-email/verify-email.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';

const routes: Routes = [
  {
    path:  'admin',
    component:  AdminMainComponent,
    
    children: [
        // [...]
        { path:  'login',component:  LoginComponent},
        { path:  'register', component:  RegisterComponent },
        { path:  'forgot-password', component:  ForgotPasswordComponent },
        { path:  'verify-email', component:  VerifyEmailComponent }
    ]
    }
    

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
