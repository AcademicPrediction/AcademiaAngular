import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { Supervisor } from 'src/app/model/supervisor';
import { Admin } from 'src/app/model/admin';
import { LoginDto } from 'src/app/model/login-dto';
import { PredictionService } from 'src/app/service/prediction.service';

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
    private predictionService: PredictionService,
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('role') !== null) {
      if (localStorage.getItem('role') === 'supervisor') {
        this.router.navigate(['/homepage']);
      } else {
        this.router.navigate(['/homepage-admin']);
      }
    }
  }

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
        localStorage.setItem('supervisor', JSON.stringify(supervisor));
        localStorage.setItem('role', 'supervisor');
        this.router.navigate(['/homepage']);
      },
      (error: any) => {
        this.loginService.loginAdmin(loginDto).subscribe(
          (admin: Admin) => {
            localStorage.setItem('admin', JSON.stringify(admin));
            localStorage.setItem('role', 'admin');
            this.router.navigate(['/homepage-admin']);
          },
          (error: any) => {
            if (error.status === 404) {
              alert('Usuario no encontrado.');
            } else {
              alert('Error al iniciar sesión.');
            }
          },
        );
        if (error.status === 404) {
          alert('Usuario no encontrado.');
        }
      },
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
