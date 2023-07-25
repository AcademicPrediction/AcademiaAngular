import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageAdminComponent } from './pages/admin/home-page-admin/home-page-admin.component';
import { NavBarAdminComponent } from './components/nav-bar-admin/nav-bar-admin.component';
import { HomePageSupervisorComponent } from './pages/supervisor/home-page-supervisor/home-page-supervisor.component';
import { NavBarSupervisorComponent } from './components/nav-bar-supervisor/nav-bar-supervisor.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageAdminComponent,
    NavBarAdminComponent,
    HomePageSupervisorComponent,
    NavBarSupervisorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
