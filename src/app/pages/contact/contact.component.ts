import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmailService } from 'src/app/service/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  phoneInvalid = false;
  emailSent = false;
  errorMessage = '';

  constructor(
    private emailService: EmailService,
    private router: Router,
  ) {}

  handleSubmit(f: NgForm) {
    const phoneValue = String(f.value.InputCno);
    this.phoneInvalid = phoneValue.length !== 9;

    console.log('Datos del formulario:', {
      name: f.value.InputName,
      email: f.value.InputEmail,
      phone: phoneValue,
      message: f.value.InputMessage,
    });

    if (this.phoneInvalid) {
      console.log('Número de teléfono inválido');
      return;
    }

    if (f.valid && !this.phoneInvalid) {
      console.log('Formulario válido, enviando datos...');

      const emailDto = {
        name: String(f.value.InputName),
        email: String(f.value.InputEmail),
        phone: phoneValue,
        message: String(f.value.InputMessage),
        messageType: '1',
      };

      this.emailService.sendEmail(emailDto).subscribe(
        (response: any) => {
          if (response === 'Email sent') {
            this.emailSent = true;
            console.log('Correo enviado exitosamente');
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            this.errorMessage = 'Error inesperado del servidor';
            this.emailSent = false;
          }
        },
        (error) => {
          console.error('Error al enviar el correo:', error);
          this.errorMessage = 'Error al enviar el correo';
          this.emailSent = false;
        },
      );
    } else {
      console.log('Formulario inválido, revise los campos.');
    }
  }

  restrictInput(event: any) {
    if (event.target.value.length >= 9 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']); // Ajusta la ruta según tu configuración de rutas
  }
}
