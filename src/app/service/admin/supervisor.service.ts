import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supervisor } from 'src/app/model/supervisor';
import { UpdatePasswordDto } from 'src/app/model/update-password-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  private apiUrl = environment.apiUrl + '/supervisors';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Supervisor[]> {
    return this.http.get<Supervisor[]>(this.apiUrl);
  }

  create(supervisor: Supervisor): Observable<Supervisor> {
    const createUrl = `${this.apiUrl}/create`; // Agregamos '/create' a la URL
    return this.http.post<Supervisor>(createUrl, supervisor);
  }

  update(supervisor: Supervisor, id: Number): Observable<Supervisor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Supervisor>(url, supervisor);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  updatePassword(updatePasswordDto: UpdatePasswordDto): Observable<any> {
    const url = `${this.apiUrl}/update-password`;
    return this.http.patch<any>(url, updatePasswordDto);
  }
}
