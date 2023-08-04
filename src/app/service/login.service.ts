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
    'http://funcionabasura-env.eba-upsse4x4.us-east-2.elasticbeanstalk.com/api/v1/';
  adminUrl = this.apiUrl + 'administrator/login';
  supervisorUrl = this.apiUrl + 'supervisors/login';

  constructor(private http: HttpClient) {}

  loginAdmin(loginDto: LoginDto): Observable<Admin> {
    return this.http.post<Admin>(this.adminUrl, loginDto);
  }

  loginSupervisor(loginDto: LoginDto): Observable<Supervisor> {
    return this.http.post<Supervisor>(this.supervisorUrl, loginDto);
  }
}
