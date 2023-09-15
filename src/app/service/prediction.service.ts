import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prediction } from '../model/prediction';
import { GetPredictionDto } from '../model/getPredictionDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl + '/predictions';

  doPrediction(file: File, supervisorId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const apiUrl = `${this.apiUrl}/do-prediction/${supervisorId}`;

    return this.http.post(apiUrl, formData, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getAllPredictions(supervisorId: number): Observable<Prediction[]> {
    const apiUrl = `${this.apiUrl}/${supervisorId}`;
    return this.http.get<Prediction[]>(apiUrl);
  }

  downloadPredictionFile(getPredictionDto: GetPredictionDto): Observable<any> {
    const apiUrl = `${this.apiUrl}/download`;
    return this.http.post(apiUrl, getPredictionDto, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  donwloadLastPrediction(supervisorId: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/last-prediction/${supervisorId}`;
    return this.http.post(
      apiUrl,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      },
    );
  }
}
