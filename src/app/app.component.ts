import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <main class="tw-w-screen tw-h-screen">
    <router-outlet></router-outlet>
  </main>`,
})
export class AppComponent {
  title = 'Academai';
  constructor(private route: Router) {
    /*this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.validateSession(event.url);
      }
    });*/
  }

  /*validateSession(url: string) {
    if (
      localStorage.getItem('role') === null &&
      url !== '/contact' &&
      url !== '/forgot-password'
    ) {
      this.route.navigate(['/login']);
    }
  }*/
}
