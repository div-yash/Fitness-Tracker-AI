import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

   constructor(private http:HttpClient) { 
  }
  
  public apiUrl = (window.location.origin.includes('examly.io') || window.location.pathname.includes('/proxy/'))
    ? `${window.location.origin}/proxy/8080`
    : 'http://localhost:8080';

  register(newUser: User): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/api/register`, newUser).pipe(tap(data => {
      localStorage.setItem('role', data.UserRole)
    }))
  }

  login(login: Login):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/login`,login).pipe(tap(result =>{
      const token = result?.token;
      if(token){
        const payload = this.decodeToken(token);
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload["role"];
        const email = payload["http://schemas.xmlsoap.org/ws2005/05/identity/claims/emailaddress"] || payload["email"] || payload["sub"];
        const username = payload["http://schemas.xmlsoap.org/ws2005/05/identity/claims/name"] || payload["unique_name"] || payload["name"];
        const userId = payload["UserId"] || payload["userId"];
        localStorage.setItem('role',role);
        localStorage.setItem("token",token);
        localStorage.setItem("email",email);
        localStorage.setItem("username",username);
        localStorage.setItem("UserId",userId);
      }
    }))
  }
  
  decodeToken(token:string): any{
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g,'+').replace(/_/g,'/');
    const json = atob(base64);
    return JSON.parse(json);
  }

  logout(){
    localStorage.clear();
  }

  getUserId(){
    return localStorage.getItem("UserId");
  }
  
  isLoggedIn():boolean{
    const loggedIn = localStorage.getItem("role");
    if(loggedIn){
      return true;
    } 
    return false;
  }

  isAdmin(){
    return localStorage.getItem("role") == "Admin"
  }

  isUser(){
    return localStorage.getItem("role") == "User"
  }
  getRole(){
    return localStorage.getItem('role');
  }
  
}


