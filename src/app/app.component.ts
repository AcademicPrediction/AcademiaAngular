import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` <main class="tw-w-screen tw-h-screen">
    <router-outlet></router-outlet>
  </main>`,
})
export class AppComponent {
  title = 'Academai';
}
