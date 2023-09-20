import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageAdminComponent } from './pages/admin/home-page-admin/home-page-admin.component';
import { NavBarAdminComponent } from './components/nav-bar-admin/nav-bar-admin.component';
import { HomePageSupervisorComponent } from './pages/supervisor/home-page-supervisor/home-page-supervisor.component';
import { NavBarSupervisorComponent } from './components/nav-bar-supervisor/nav-bar-supervisor.component';
import { PredictionPageComponent } from './pages/supervisor/prediction-page/prediction-page.component';
import { PredictionHistoryComponent } from './pages/supervisor/prediction-history/prediction-history.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PredictionDialogComponent } from './components/prediction-dialog/prediction-dialog.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PredictionReviewComponent } from './pages/supervisor/prediction-review/prediction-review.component';
import { HelpComponent } from './pages/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageAdminComponent,
    NavBarAdminComponent,
    HomePageSupervisorComponent,
    NavBarSupervisorComponent,
    PredictionPageComponent,
    PredictionHistoryComponent,
    ContactComponent,
    PredictionDialogComponent,
    ForgotPasswordComponent,
    PredictionReviewComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
