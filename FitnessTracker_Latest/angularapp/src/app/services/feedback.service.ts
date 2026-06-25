import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  public apiUrl = (window.location.origin.includes('examly.io') || window.location.pathname.includes('/proxy/'))
    ? `${window.location.origin}/proxy/8080`
    : 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  sendFeedback(feedback: Feedback): Observable<Feedback>{
    return this.http.post<Feedback>(`${this.apiUrl}/api/feedback`,feedback);
  }

  getAllFeedbacksByUserId(userId: string):Observable<Feedback[]>{
    return this.http.get<Feedback[]>(`${this.apiUrl}/api/feedback/user/${userId}`);
  }

  deleteFeedback(feedbackId: string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/api/feedback/${feedbackId}`);
  }

  getFeedbacks(): Observable<Feedback[]>{
    return this.http.get<Feedback[]>(`${this.apiUrl}/api/feedback`);
  }
}
