import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent {
  workoutOpen=false;
  constructor(private authService:AuthService,private router:Router)
  {

  }
  toggleWorkout(){
    this.workoutOpen=!this.workoutOpen;
  }
  openWorkout(){
    this.workoutOpen=true;
  }

  closeWorkout(){
    this.workoutOpen=false;
  }

  onLogout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }

}
