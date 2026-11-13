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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'Athlete';
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
