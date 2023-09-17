import { Observable } from 'rxjs';
import { Email } from '../model/email-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EmailResponseDto } from '../model/email-response-dto';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = environment.apiUrl + '/send-email';

  constructor(private http: HttpClient) {}

  sendEmail(emailDto: Email): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };

    return this.http.post(this.apiUrl, emailDto, httpOptions);
  }
}
