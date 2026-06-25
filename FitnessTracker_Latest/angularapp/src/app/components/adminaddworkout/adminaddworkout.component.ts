import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-adminaddworkout',
  templateUrl: './adminaddworkout.component.html',
  styleUrls: ['./adminaddworkout.component.css']
})
export class AdminaddworkoutComponent implements OnInit{

  workout: Workout={
    WorkoutName:'',
    Description:'',
    DifficultyLevel:null,
    CreatedAt:'',
    TargetArea:'',
    DaysPerWeek:null,
    AverageWorkoutDurationInMinutes:null
  };

  errorMessage='';
  submitted:boolean=false;
  showSuccessModal = false;

  constructor(private workoutService:WorkoutService,private router:Router){}
  
  ngOnInit(): void {
    
  }

  submitWorkout(form: any) {
    if (form.invalid) {
      this.errorMessage = 'All fields are required';
      form.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.submitted = true;

    const payload = {
      ...this.workout,
      CreatedAt: new Date().toISOString(),
      DifficultyLevel: Number(this.workout.DifficultyLevel),
      DaysPerWeek: Number(this.workout.DaysPerWeek),
      AverageWorkoutDurationInMinutes: Number(this.workout.AverageWorkoutDurationInMinutes)
    };

    this.workoutService.addWorkout(payload).subscribe({
      next: () => {
        this.showSuccessModal = true;
      },
      error: (err) => {
        if (err.status === 200) {
          this.showSuccessModal = true;
        } else {
          this.submitted = false;
          this.errorMessage = err.status === 409 ? 'Workout already exists' : 'Something went wrong.';
        }
      }
    });
  }

  onSuccessConfirm(form: any): void {
    this.showSuccessModal = false;
    this.submitted = false;
    form.resetForm();
    this.workout = {
      WorkoutName: '',
      Description: '',
      DifficultyLevel: null,
      CreatedAt: '',
      TargetArea: '',
      DaysPerWeek: null,
      AverageWorkoutDurationInMinutes: null
    };
  }

}