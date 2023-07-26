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
import { NavBarAdminComponent } from './pages/admin/nav-bar-admin/nav-bar-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageAdminComponent,
    NavBarAdminComponent
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
  bootstrap: [AppComponent]
})
export class AppModule { }
