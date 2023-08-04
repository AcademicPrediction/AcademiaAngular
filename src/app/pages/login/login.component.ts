import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { Supervisor } from 'src/app/model/supervisor';
import { Admin } from 'src/app/model/admin';
import { LoginDto } from 'src/app/model/login-dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      alert('Los campos de correo y contraseña son obligatorios.');
      return;
    }

    const loginDto: LoginDto = {
      email: this.email,
      password: this.password,
    };

    this.loginService.loginSupervisor(loginDto).subscribe(
      (supervisor: Supervisor) => {
        this.router.navigate(['/homepage']);
      },
      (supervisorError: any) => {
        this.loginService.loginAdmin(loginDto).subscribe(
          (admin: Admin) => {
            this.router.navigate(['/homepage-admin']);
          },
          (adminError: any) => {
            alert('Usuario no encontrado.'); // Si falla el inicio de sesión con ambos usuarios
          }
        );
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
