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
  constructor(
    private router: Router, 
    private workoutService: WorkoutService, 
    private workoutRequestService: WorkoutrequestService
  ) { }

  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];
  searchTerm = '';
  loading = false;
  serverError = '';

  /** keep applied ids for O(1) checks */
  appliedWorkoutIds = new Set<number>();

  // Pagination & Sorting properties
  currentPage = 1;
  pageSize = 10;
  sortColumn = '';
  sortAscending = true;
  Math = Math;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.serverError = '';
    // Load workouts
    this.workoutService.getAllWorkouts().subscribe({
      next: (data) => {
        this.workouts = data ?? [];
        this.applyFilter();
        this.loadApplied();
        this.loading = false;
      },
      error: (err) => {
        console.error('getAllWorkouts error:', err);
        this.workouts = [];
        this.applyFilter();
        this.loading = false;
        this.serverError = 'Failed to load workouts from server.';
      }
    });
  }

  private loadApplied(): void {
    this.workoutRequestService.getAllWorkoutRequests().subscribe({
      next: (reqs) => {
        this.appliedWorkoutIds.clear();
        (reqs ?? []).forEach(r => {
          if (r?.WorkoutId || r?.workoutId) {
            this.appliedWorkoutIds.add(r.WorkoutId || r.workoutId);
          }
        });
      },
      error: (err) => {
        console.error('getMyRequests error:', err);
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 1;
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) {
      this.filteredWorkouts = [...this.workouts];
      return;
    }
    this.filteredWorkouts = this.workouts.filter(w => {
      return [
        w.workoutName,
        w.description,
        w.difficultyLevel,
        w.targetArea
      ]
        .filter(Boolean)
        .some(v => ('' + v).toLowerCase().includes(q));
    });
  }

  // Sorting Logic
  get sortedWorkouts(): Workout[] {
    if (!this.sortColumn) return this.filteredWorkouts;

    return [...this.filteredWorkouts].sort((a, b) => {
      let valA = a[this.sortColumn as keyof Workout];
      let valB = b[this.sortColumn as keyof Workout];

      if (valA === undefined || valA === null) valA = '' as any;
      if (valB === undefined || valB === null) valB = '' as any;

      if (typeof valA === 'string') valA = valA.toLowerCase() as any;
      if (typeof valB === 'string') valB = valB.toLowerCase() as any;

      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  setSort(col: string): void {
    if (this.sortColumn === col) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = col;
      this.sortAscending = true;
    }
    this.currentPage = 1;
  }

  // Pagination Slicing
  get paginatedWorkouts(): Workout[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.sortedWorkouts.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredWorkouts.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  // Difficulty Badging Helpers
  getDifficultyLabel(level: number | undefined | null): string {
    if (!level) return 'Beginner';
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Intermediate';
    return 'Expert';
  }

  getDifficultyClass(level: number | undefined | null): string {
    if (!level) return 'badge-beginner';
    if (level <= 2) return 'badge-beginner';
    if (level <= 4) return 'badge-intermediate';
    return 'badge-expert';
  }

  /** Helper for template */
  isApplied(workoutId: number | undefined | null): boolean {
    if (!workoutId) return false;
    return this.appliedWorkoutIds.has(workoutId);
  }

  onApply(workoutId: number | undefined | null): void {
    if (!workoutId) return;
    this.router.navigate(['/userworkoutform', workoutId]);
  }
}
