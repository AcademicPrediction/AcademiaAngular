import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <main class="tw-w-screen tw-h-screen">
    <router-outlet></router-outlet>
  </main>`,
})
export class AppComponent {
  title = 'Academai';
  constructor(private route: Router) {
    this.validateSession();
  }

  validateSession() {
    if (localStorage.getItem('role') === null) {
      this.route.navigate(['/login']);
    }
  }
}
