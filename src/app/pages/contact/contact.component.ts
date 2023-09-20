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
  isLoading = false;
  isError = false;
  wordCount: number = 0;
  messageContent: string = ''; 
  characterCount: number = 0;

  constructor(
    private emailService: EmailService,
    private router: Router,
  ) {}

  checkPhoneNumber(event: any) {
    const phoneValue = event.target.value;
    this.phoneInvalid = phoneValue.length !== 9;
  }

  updateCharacterCount() {
    this.characterCount = this.messageContent.length;
  }

  updateWordCount() {
    const words = this.messageContent.split(/\s/).filter(Boolean);
    this.wordCount = words.length;

    if (this.wordCount > 150) {
      this.messageContent = words.slice(0, 150).join(' ');
      this.wordCount = 150;  // Actualiza el recuento de palabras a 150
    }
  }

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

      this.isLoading = true;
      this.emailService.sendEmail(emailDto).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.isError = false;
          if (response.message === 'Email sent') {
            this.emailSent = true;
            console.log('Correo enviado exitosamente');
          } else {
            console.error('Respuesta inesperada del servidor:', response);
            this.errorMessage = 'Error inesperado del servidor';
            this.emailSent = false;
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error al enviar el correo:', error);
          this.errorMessage = 'Error al enviar el correo, Intentelo mas tarde';
          this.emailSent = false;
          this.isError = true;
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

  resetForm() {
    this.messageContent = ''; // Limpia el contenido del textarea
    this.phoneInvalid = false;
    this.updateCharacterCount(); // Actualiza el contador de caracteres
  }
}
