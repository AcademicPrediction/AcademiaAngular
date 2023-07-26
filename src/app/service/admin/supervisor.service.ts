import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importar el operador map

import { Supervisor } from 'src/app/model/supervisor';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {
  private apiUrl = 'assets/data.json'; // Ruta del archivo JSON que contiene los datos de los supervisores

  constructor(private http: HttpClient) { }

  getAll(): Observable<Supervisor[]> {
    return this.http.get<{ Supervisor: Supervisor[] }>(this.apiUrl)
      .pipe(
        map(response => response.Supervisor) // Transformar la respuesta para obtener el arreglo de supervisores
      );
  }
  create(supervisor: Supervisor): Observable<Supervisor> {
    // Implementar aquí la lógica para agregar un nuevo supervisor
    return this.http.post<Supervisor>(this.apiUrl, supervisor);
  }

  update(supervisor: Supervisor): Observable<Supervisor> {
    // Implementar aquí la lógica para actualizar un supervisor existente
    const url = `${this.apiUrl}/${supervisor.id}`;
    return this.http.put<Supervisor>(url, supervisor);
  }

  delete(id: number): Observable<void> {
    // Implementar aquí la lógica para eliminar un supervisor por su ID
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}