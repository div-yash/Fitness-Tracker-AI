import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../config';

export interface SymptomHistoryRecord {
  id?: number;
  userId: number;
  symptoms: string;
  predictedDisease: string;
  description?: string;
  precautions?: string;
  medications?: string;
  diets?: string;
  workouts?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private flaskUrl = config.mlUrl;
  private apiUrl = config.apiUrl;

  constructor(private http: HttpClient) {}

  getRecommendations(symptoms: string): Observable<any> {
    return this.http.post<any>(this.flaskUrl, { symptoms: symptoms });
  }

  saveDiagnosisHistory(record: SymptomHistoryRecord): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/symptomhistory`, record);
  }

  getUserDiagnosisHistory(userId: string | number): Observable<SymptomHistoryRecord[]> {
    return this.http.get<SymptomHistoryRecord[]>(`${this.apiUrl}/api/symptomhistory/user/${userId}`);
  }

  deleteDiagnosisHistory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/symptomhistory/${id}`);
  }
}
