import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomePageAdminComponent } from './pages/admin/home-page-admin/home-page-admin.component';
import { NavBarAdminComponent } from './pages/admin/nav-bar-admin/nav-bar-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageAdminComponent,
    NavBarAdminComponent,
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
