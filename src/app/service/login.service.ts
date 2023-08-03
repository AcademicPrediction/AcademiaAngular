import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Supervisor } from 'src/app/model/supervisor';
import { Admin } from 'src/app/model/admin';
import { LoginDto } from '../model/login-dto';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl =
    'http://funcionabasura-env.eba-upsse4x4.us-east-2.elasticbeanstalk.com/api/v1/'; // URL de tu servidor local

  constructor(private http: HttpClient) {}

  authenticate(loginDto: LoginDto): Observable<Supervisor | Admin> {
    const loginUrl =
      loginDto.role === 'Supervisor' ? 'supervisors/login' : 'admin/login';
    return this.http.post<Supervisor>(this.apiUrl + loginUrl, loginDto);
  }
}
