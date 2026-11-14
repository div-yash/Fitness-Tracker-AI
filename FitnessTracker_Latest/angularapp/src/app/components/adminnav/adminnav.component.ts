import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {
  isMenuCollapsed = true;
  workoutDropdownOpen = false;
  adminName = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    let raw = localStorage.getItem('username');
    if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
      raw = 'Administrator';
      localStorage.setItem('username', raw);
    }
    this.adminName = raw;
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeMenu(): void {
    this.isMenuCollapsed = true;
    this.workoutDropdownOpen = false;
  }

  toggleWorkout(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.workoutDropdownOpen = !this.workoutDropdownOpen;
  }

  onLogout(): void {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
