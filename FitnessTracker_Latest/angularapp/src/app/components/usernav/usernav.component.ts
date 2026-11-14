import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit {
  isMenuCollapsed = true;
  feedbackDropdownOpen = false;
  username = '';
  email = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    let raw = localStorage.getItem('username');
    this.email = localStorage.getItem('email') || '';

    if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
      if (this.email && this.email !== 'undefined' && this.email !== 'null') {
        const handle = this.email.split('@')[0];
        raw = handle.charAt(0).toUpperCase() + handle.slice(1);
      } else {
        raw = 'Athlete';
      }
      localStorage.setItem('username', raw);
    }
    this.username = raw;
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeMenu(): void {
    this.isMenuCollapsed = true;
    this.feedbackDropdownOpen = false;
  }

  toggleFeedback(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.feedbackDropdownOpen = !this.feedbackDropdownOpen;
  }

  onLogout(): void {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
