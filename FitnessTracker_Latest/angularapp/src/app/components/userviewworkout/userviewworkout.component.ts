import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';
import { WorkoutrequestService } from 'src/app/services/workoutrequest.service';

@Component({
  selector: 'app-userviewworkout',
  templateUrl: './userviewworkout.component.html',
  styleUrls: ['./userviewworkout.component.css']
})
export class UserviewworkoutComponent implements OnInit {
  constructor(private router: Router, private workoutService: WorkoutService, private workoutRequestService: WorkoutrequestService) { }

  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];
  searchTerm = '';

  /** keep applied ids for O(1) checks */
  appliedWorkoutIds = new Set<number>();


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load workouts
    this.workoutService.getAllWorkouts().subscribe({
      next: (data) => {
        this.workouts = data ?? [];
        this.applyFilter();

        this.loadApplied();
      },
      error: (err) => {
        console.error('getAllWorkouts error:', err);
        this.workouts = [];
        this.applyFilter();
      }
    });
  }

  private loadApplied(): void {
    this.workoutRequestService.getAllWorkoutRequests().subscribe({
      next: (reqs) => {
        this.appliedWorkoutIds.clear();
        (reqs ?? []).forEach(r => {
          if (r?.WorkoutId) this.appliedWorkoutIds.add(r.WorkoutId);
        });
      },
      error: (err) => {
        console.error('getMyRequests error:', err);
      }
    });
  }

  applyFilter(): void {
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) {
      this.filteredWorkouts = [...this.workouts];
      return;
    }
    this.filteredWorkouts = this.workouts.filter(w => {
      return [
        w.WorkoutName,
        w.Description,
        w.DifficultyLevel,
        w.TargetArea
      ]
        .filter(Boolean)
        .some(v => ('' + v).toLowerCase().includes(q));
    });
  }


  ngOnChanges(): void {
    this.applyFilter();
  }

  /** Helper for template */
  isApplied(workoutId: number | undefined | null): boolean {
    if (!workoutId) return false;
    return this.appliedWorkoutIds.has(workoutId);
  }


  onApply(workoutId: number | undefined | null): void {
    if (!workoutId) return;
    this.router.navigate(
      ['/userworkoutform', workoutId] // route like /userworkoutform/:id
    );
  }


}
