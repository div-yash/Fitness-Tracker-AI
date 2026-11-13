import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  userRole = '';

  stats = {
    caloriesBurned: 425800,
    workoutsCompleted: 1280,
    activePlans: 18
  };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    this.userRole = role || '';

    this.loadStats();
  }

  loadStats(): void {
    this.http.get<any>(`${config.apiUrl}/api/stats`).subscribe({
      next: (data) => {
        if (data) {
          this.stats.caloriesBurned = data.caloriesBurned ?? this.stats.caloriesBurned;
          this.stats.workoutsCompleted = data.workoutsCompleted ?? this.stats.workoutsCompleted;
          this.stats.activePlans = data.activePlans ?? this.stats.activePlans;
        }
      },
      error: () => {
        // Keeps graceful defaults if API is not yet loaded
      }
    });
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
