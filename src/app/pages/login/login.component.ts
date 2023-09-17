import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { Supervisor } from 'src/app/model/supervisor';
import { Admin } from 'src/app/model/admin';
import { LoginDto } from 'src/app/model/login-dto';
import { PredictionService } from 'src/app/service/prediction.service';
import { Email } from 'src/app/model/email-dto';
import { EmailService } from 'src/app/service/email.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  emailForget: string = '';
  showValidationMessage: boolean = false;
  password: string = '';
  showPassword: boolean = false;
  showModal: boolean = false;
  emailSent: boolean = false;
  emailExists: boolean = true;
  invalidLogin: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private predictionService: PredictionService,
    private emailService: EmailService,
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
              this.invalidLogin = true;
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

  toggleModalVisibility() {
    this.showModal = !this.showModal;
  }

  validateAndSendEmail() {
    this.showValidationMessage = false;
    this.emailSent = false;
    this.emailExists = true;

    if (!this.emailForget) {
      this.showValidationMessage = true;
      this.emailSent = false;
      return;
    }

    if (!this.isValidEmail(this.emailForget)) {
      this.showValidationMessage = true;
      this.emailSent = false;
      return;
    }

    const emailDto: Email = {
      email: this.emailForget,
      messageType: '2',
    };

    this.emailService.sendEmail(emailDto).subscribe((data) => {
      if (data.message === 'Email sent') {
        this.showValidationMessage = true;
        this.emailSent = true;
      } else {
        this.emailExists = false;
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}
