import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { Workout } from 'src/app/models/workout.model';

import { WorkoutService } from 'src/app/services/workout.service';

@Component({

  selector: 'app-adminviewworkout',

  templateUrl: './adminviewworkout.component.html',

  styleUrls: ['./adminviewworkout.component.css']
})

export class AdminviewworkoutComponent {
  workouts: Workout[] = [];
  filtered: Workout[] = [];
  loading = false;
  serverError = '';
  searchTerm = '';
  selectedWorkoutId: number | null = null;
  showDeleteModal = false;

  constructor(private workoutService: WorkoutService, private router: Router) { }

  ngOnInit(): void {
    this.loadworkouts();
  }

  loadworkouts(): void {
    this.loading = true;
    this.workoutService.getAllWorkouts().subscribe({
      next: data => {
        this.workouts = data || [];
        this.filtered = [...this.workouts];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.serverError = 'Failed to load workouts.';
      }
    });
  }

  onSearch(): void {
    const t = (this.searchTerm || '').trim().toLowerCase();

    if (!t) {
      this.filtered = [...this.workouts];
      return;
    }
  
    this.filtered = this.workouts.filter(w => {
      const name = (w.WorkoutName || w['workoutName'] || '').toString().toLowerCase();
      const desc = (w.Description || w['description'] || '').toString().toLowerCase();
      
      return name.includes(t) || desc.includes(t);
    });
  }

  editWorkout(id: number | undefined): void {
    this.router.navigate([`/admineditworkout/${id}`]);
  }

  confirmDelete(id: number): void {
    this.selectedWorkoutId = id;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.selectedWorkoutId === null) return;

    this.workoutService.deleteWorkout(this.selectedWorkoutId).subscribe({
      next: () => {
        this.closeModal();
        this.loadworkouts();
      },
      error: (err) => {
        if (err.status === 200) {
          this.closeModal();
          this.loadworkouts();
        } else {
          alert('Delete failed. Please try again.');
          this.closeModal();
        }
      }
    });
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.selectedWorkoutId = null;
  }
}
