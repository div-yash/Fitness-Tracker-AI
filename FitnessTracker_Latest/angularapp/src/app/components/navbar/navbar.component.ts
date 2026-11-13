import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuCollapsed = true;

  constructor(private service: AuthService, private router: Router) {}

  get loggedIn(): boolean {
    return this.service.isLoggedIn();
  }
  get isAdmin(): boolean {
    return this.service.isAdmin();
  }
  get isUser(): boolean {
    return this.service.isUser();
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeMenu(): void {
    this.isMenuCollapsed = true;
  }

  goHome(): void {
    this.closeMenu();
    if (this.isAdmin) {
      this.router.navigate(['/adminviewworkout']);
    } else if (this.isUser) {
      this.router.navigate(['/userviewworkout']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
