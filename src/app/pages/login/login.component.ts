import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { Supervisor } from 'src/app/model/supervisor';
import { Admin } from 'src/app/model/admin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private loginService: LoginService, private router: Router) { }

  onLogin() {
    if (!this.email || !this.password) {
      alert('Los campos de correo y contraseña son obligatorios.');
      return;
    }

    this.loginService.authenticate(this.email, this.password).subscribe(
      (user: Supervisor | Admin | null) => {
        if (!user) {
          alert('Correo o contraseña incorrectos.');
        } else {
          if ('dni' in user) {
            this.router.navigateByUrl('/homepage');
          } else {
            this.router.navigateByUrl('/homepage-admin');
          }
        }
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}