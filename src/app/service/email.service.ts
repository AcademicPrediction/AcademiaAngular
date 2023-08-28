import { Observable } from 'rxjs';
import { Email } from '../model/email-dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl =
    'http://funcionabasura-env.eba-upsse4x4.us-east-2.elasticbeanstalk.com/api/v1/send-email';

  constructor(private http: HttpClient) {}

  sendEmail(emailDto: Email): Observable<Email> {
    return this.http.post<Email>(this.apiUrl, emailDto);
  }
}
