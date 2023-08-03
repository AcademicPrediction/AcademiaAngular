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

    //create login dto object
    const loginDto: LoginDto = {
      email: this.email,
      password: this.password,
      role: 'Supervisor',
    };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
