import { Component } from '@angular/core';
import { Admin } from 'src/app/model/admin';

@Component({
  selector: 'app-nav-bar-admin',
  templateUrl: './nav-bar-admin.component.html',
  styleUrls: ['./nav-bar-admin.component.css'],
})
export class NavBarAdminComponent {
  sidebarActive = false;
  admin: Admin | null = null;

  ngOnInit(): void {
    this.admin = JSON.parse(
      localStorage.getItem('admin') || '{}',
    ) as Admin;
  }


  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  logOut() {
    localStorage.clear();
    window.location.reload();
  }
}
