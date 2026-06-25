import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
``
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
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
 
  goHome(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else if (this.isUser) {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
