import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent {

  workoutOpen = false;

  constructor(private authService:AuthService,private router:Router)
  {

  }
  feedbackOpen = false;
  roleLabel = 'user / User';

  openWorkout() 
  { 
    this.workoutOpen = true; 
  }
  closeWorkout() 
  { 
    this.workoutOpen = false;
  }

  openFeedback() 
  { 
    this.feedbackOpen = true; 
  }
  closeFeedback() 
  { 
    this.feedbackOpen = false;
  }
  onLogout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }

}
