import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private flaskUrl = config.mlUrl;

  constructor(private http: HttpClient) {}

  getRecommendations(symptoms: string): Observable<any> {
    return this.http.post<any>(this.flaskUrl, { symptoms: symptoms });
  }
}
