import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workout } from '../models/workout.model';
import { WorkoutRequest } from '../models/workoutrequest.model';

@Injectable({
  providedIn: 'root'
})

export class WorkoutService {
  
  public apiUrl = (window.location.origin.includes('examly.io') || window.location.pathname.includes('/proxy/'))
    ? `${window.location.origin}/proxy/8080`
    : 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  public getAllWorkouts():Observable<Workout[]>{
    return this.http.get<Workout[]>(`${this.apiUrl}/api/workout`);
  }

  public deleteWorkout(workoutId:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/api/workout/${workoutId}`)
  }

  public getWorkoutById(id:number):Observable<Workout>{
    return this.http.get<Workout>(`${this.apiUrl}/api/workout/${id}`);
  }

  public addWorkout(requestObject: Workout):Observable<Workout>{
    return this.http.post<Workout>(`${this.apiUrl}/api/workout`,requestObject);
  }

  public updateWorkout(id:string, requestObject:Workout):Observable<Workout>{
    return this.http.put<Workout>(`${this.apiUrl}/api/workout/${id}`,requestObject);
  }

  public getAppliedWorkouts(userId:string):Observable<WorkoutRequest[]>{
    return this.http.get<WorkoutRequest[]>(`${this.apiUrl}/api/workoutrequests/user/${userId}`);
  }
}