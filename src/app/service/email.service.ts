import { Observable } from 'rxjs';
import { Email } from '../model/email-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl =
    'http://funcionabasura-env.eba-upsse4x4.us-east-2.elasticbeanstalk.com/api/v1/send-email';

  constructor(private http: HttpClient) {}

  sendEmail(emailDto: Email): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      }),
      responseType: 'text' as 'json' // Esto indica que esperas una respuesta de texto plano
    };

    return this.http.post(this.apiUrl, emailDto, httpOptions);
  }
}
