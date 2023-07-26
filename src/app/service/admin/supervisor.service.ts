import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supervisor } from 'src/app/model/supervisor';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {
  private apiUrl = 'http://localhost:3000/supervisor';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Supervisor[]> {
    return this.http.get<Supervisor[]>(this.apiUrl);
  }

  create(supervisor: Supervisor): Observable<Supervisor> {
    return this.http.post<Supervisor>(this.apiUrl, supervisor);
  }

  update(supervisor: Supervisor): Observable<Supervisor> {
    const url = `${this.apiUrl}/${supervisor.id}`;
    return this.http.put<Supervisor>(url, supervisor);
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
