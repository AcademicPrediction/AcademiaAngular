import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  phoneInvalid = false;  // Agregamos una nueva propiedad para mantener el estado de la validación del teléfono

  constructor() { }

  handleSubmit(f: NgForm) {
    const phoneValue = f.value.InputCno;
    this.phoneInvalid = String(phoneValue).length !== 9;

    if (this.phoneInvalid) {
      console.log("Número de teléfono inválido");
    }

    if (f.valid && !this.phoneInvalid) {
      console.log("Formulario válido, enviando datos...");
    } else {
      console.log("Formulario inválido, revise los campos.");
    }
  }

  restrictInput(event: any) {
    if (event.target.value.length >= 9 && event.key !== "Backspace") {
      event.preventDefault();
    }
  }
}
