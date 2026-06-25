import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private flaskUrl = 'http://localhost:5000/api/predict';

  constructor(private http: HttpClient) {}

  getRecommendations(symptoms: string): Observable<any> {
    return this.http.post<any>(this.flaskUrl, { symptoms: symptoms });
  }
}
