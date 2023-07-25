import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomePageAdminComponent } from './pages/admin/home-page-admin/home-page-admin.component';

const routes: Routes = [
  { path: 'homePageAdmin', component: HomePageAdminComponent },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
