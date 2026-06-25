import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkoutRequest } from '../models/workoutrequest.model';
import { Observable } from 'rxjs';


@Injectable({
  
  providedIn: 'root'

})

export class WorkoutrequestService {
  
  public apiUrl = (window.location.origin.includes('examly.io') || window.location.pathname.includes('/proxy/'))
    ? `${window.location.origin}/proxy/8080`
    : 'http://localhost:8080';
  
  constructor(private http: HttpClient) { }
  
  
  addWorkoutRequest(data: WorkoutRequest): Observable<WorkoutRequest> {
   
    return this.http.post<WorkoutRequest>(`${this.apiUrl}/api/workoutrequests`, data);
  }
  getAppliedWorkouts(userId: string): Observable<WorkoutRequest[]> {
   
    return this.http.get<WorkoutRequest[]>(`${this.apiUrl}/api/workoutrequests/user/${userId}`);

  }
  deleteWorkoutApplication(requestedId: number): Observable<void> {
    
    return this.http.delete<void>(`${this.apiUrl}/api/workoutrequests/${requestedId}`);

  }

  getAllWorkoutRequests(): Observable<WorkoutRequest[]> {
    return this.http.get<WorkoutRequest[]>(`${this.apiUrl}/api/workoutrequests`);
  }

  updateWorkoutStatus(id: string, workoutApplication: WorkoutRequest): Observable<WorkoutRequest> {
    return this.http.put<WorkoutRequest>(`${this.apiUrl}/api/workoutrequests/${id}`, workoutApplication);
  }

}
