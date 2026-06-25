import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-admineditworkout',
  templateUrl: './admineditworkout.component.html',
  styleUrls: ['./admineditworkout.component.css']
})
export class AdmineditworkoutComponent implements OnInit {
  workoutId:number;
  workout:any;

  constructor(private service:WorkoutService,private route:ActivatedRoute,private router:Router){}

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      this.workoutId=Number(params['id']);
      this.service.getWorkoutById(this.workoutId).subscribe((data)=>{
        this.workout=data;
      })

    })
  }

  editWorkout(form: NgForm): void {
    if (form.invalid) {
      return;
    }
  
    this.service.updateWorkout(this.workout.workoutId, this.workout).subscribe({
      next: () => {
        this.router.navigate(['/adminviewworkout']);
      },
      error: (err) => {
        if (err.status === 200) {
          this.router.navigate(['/adminviewworkout']);
        } else {
          console.error('Real update error:', err);
        }
      }
    });
  }
}
