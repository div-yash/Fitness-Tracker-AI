import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  public apiUrl = config.apiUrl;
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
