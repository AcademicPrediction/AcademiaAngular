import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Supervisor } from 'src/app/model/supervisor';
import { Admin } from 'src/app/model/admin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/'; // URL de tu servidor local

  constructor(private http: HttpClient) {}

  // Método para autenticar al usuario
  authenticate(email: string, password: string): Observable<Supervisor | Admin | null> {
    // Simulando la respuesta con un archivo JSON local (db.json)
    return this.http.get<any[]>(this.apiUrl + 'supervisor').pipe(
      mergeMap((supervisors: any[]) => this.findUser(supervisors, email, password))
    );
  }

  private findUser(users: any[], email: string, password: string): Observable<Supervisor | Admin | null> {
    const supervisor = users.find((u: any) => u.correoElectronico === email && u.contrasena === password);

    if (supervisor) {
      return new Observable<Supervisor | Admin | null>((observer) => {
        observer.next({ ...supervisor });
        observer.complete();
      });
    } else {
      return this.authenticateAdmin(email, password);
    }
  }

  private authenticateAdmin(email: string, password: string): Observable<Admin | null> {
    // Simulando la respuesta con un archivo JSON local (db.json)
    return this.http.get<any[]>(this.apiUrl + 'admin').pipe(
      map((admins: any[]) => {
        const admin = admins.find((a: any) => a.correoElectronico === email && a.contrasena === password);
        return admin ? { ...admin } as Admin : null;
      })
    );
  }
}
