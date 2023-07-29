import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomePageAdminComponent } from './pages/admin/home-page-admin/home-page-admin.component';
import { HomePageSupervisorComponent } from './pages/supervisor/home-page-supervisor/home-page-supervisor.component';
import { PredictionPageComponent } from './pages/supervisor/prediction-page/prediction-page.component';

const routes: Routes = [
  { path: 'homepage-admin', component: HomePageAdminComponent },
  { path: 'login', component: LoginComponent},
  { path: 'homepage', component: HomePageSupervisorComponent },
  { path: 'prediction', component: PredictionPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
