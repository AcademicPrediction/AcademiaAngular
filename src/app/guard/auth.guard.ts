import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router) {}

  guardSupervisor(): boolean {
    const role = localStorage.getItem('role');

    if (role === null) {
      // Si no hay un rol almacenado en el localStorage, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    if (role === 'supervisor') {
      // Si el rol es supervisor, redirigir a la página de inicio de supervisor
      this.router.navigate(['/homepage']);
      return false;
    }

    if (role === 'admin') {
      // Si el rol es admin, redirigir a la página de inicio de admin
      this.router.navigate(['/homepage-admin']);
      return false;
    }

    // Otros roles, permitir acceso a la ruta
    return true;
  }
}
