import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomePageAdminComponent } from './pages/admin/home-page-admin/home-page-admin.component';
import { HomePageSupervisorComponent } from './pages/supervisor/home-page-supervisor/home-page-supervisor.component';
import { PredictionPageComponent } from './pages/supervisor/prediction-page/prediction-page.component';
import { PredictionHistoryComponent } from './pages/supervisor/prediction-history/prediction-history.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HelpComponent } from './pages/help/help.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirecciona a /login al cargar la app
  { path: 'login', component: LoginComponent },
  {
    path: 'homepage-admin',
    component: HomePageAdminComponent,
  },
  {
    path: 'homepage',
    component: HomePageSupervisorComponent,
  },
  {
    path: 'prediction',
    component: PredictionPageComponent,
  },
  {
    path: 'history-prediction',
    component: PredictionHistoryComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
