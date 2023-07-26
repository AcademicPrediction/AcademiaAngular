import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomePageAdminComponent } from './pages/admin/home-page-admin/home-page-admin.component';
import { HomePageSupervisorComponent } from './pages/supervisor/home-page-supervisor/home-page-supervisor.component';

const routes: Routes = [
  { path: 'homepage-admin', component: HomePageAdminComponent },
  { path: 'login', component: LoginComponent},
  { path: 'homepage', component: HomePageSupervisorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
