import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutRequest } from 'src/app/models/workoutrequest.model';
import { WorkoutService } from 'src/app/services/workout.service';
import { WorkoutrequestService } from 'src/app/services/workoutrequest.service';
import { Workout } from 'src/app/models/workout.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-userappliedworkout',
  templateUrl: './userappliedworkout.component.html',
  styleUrls: ['./userappliedworkout.component.css']
})
export class UserappliedworkoutComponent {
  appliedList: any[] = [];
  userId = localStorage.getItem('UserId');
  message = '';
  loading = false;

  constructor(private workoutReqService: WorkoutrequestService,private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.getAppliedWorkouts();
  }

  getAppliedWorkouts() {
    this.loading = true;
    this.message = '';

    forkJoin({
      workouts: this.workoutService.getAllWorkouts(),
      applications: this.workoutReqService.getAppliedWorkouts(this.userId)
    }).subscribe({
      next: ({ workouts, applications }) => {
        const nameById = new Map<number, string>();
        (workouts || []).forEach((w: any) => {
          nameById.set(Number(w.workoutId), w.workoutName);
        });

        this.appliedList = (applications || []).map((app: any) => ({
          ...app,
          workoutName: nameById.get(Number(app.workoutId)) || ''
        }));

        this.message = this.appliedList.length ? '' : 'No applied workouts found.';
        this.loading = false;
      },
      error: () => {
        this.message = 'Error loading data.';
        this.loading = false;
      }
    });
  }

  deleteApplication(id?: number) {
    if (id && confirm('Delete this application?')) {
      this.workoutReqService.deleteWorkoutApplication(id)
        .subscribe({
          next: (response) => {
            this.appliedList = this.appliedList.filter(item => item.workoutRequestId !== id);
            
            if (this.appliedList.length === 0) {
              this.message = 'No applied workouts found.';
            }
          },
          error: () => {
            this.message = 'Error deleting application.';
          }
        });
    }
  }
}
