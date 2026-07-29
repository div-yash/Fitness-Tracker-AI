import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  userRole = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    this.userRole = role || '';
  }

  onStartWorkout(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else if (this.userRole === 'Admin') {
      this.router.navigate(['/adminviewworkout']);
    } else {
      this.router.navigate(['/userviewworkout']);
    }
  }

  onExplorePlans(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else if (this.userRole === 'Admin') {
      this.router.navigate(['/adminviewworkout']);
    } else {
      this.router.navigate(['/userviewworkout']);
    }
  }
}
