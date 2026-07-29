import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from 'src/app/models/workout.model';
import { WorkoutService } from 'src/app/services/workout.service';

@Component({
  selector: 'app-adminviewworkout',
  templateUrl: './adminviewworkout.component.html',
  styleUrls: ['./adminviewworkout.component.css']
})
export class AdminviewworkoutComponent implements OnInit {
  workouts: Workout[] = [];
  filtered: Workout[] = [];
  loading = false;
  serverError = '';
  searchTerm = '';
  selectedWorkoutId: number | null = null;
  showDeleteModal = false;

  // Pagination & Sorting properties
  currentPage = 1;
  pageSize = 10;
  sortColumn = '';
  sortAscending = true;
  Math = Math;

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
    this.currentPage = 1;
    const t = (this.searchTerm || '').trim().toLowerCase();

    if (!t) {
      this.filtered = [...this.workouts];
      return;
    }
  
    this.filtered = this.workouts.filter(w => {
      const name = (w.workoutName || w['WorkoutName'] || '').toString().toLowerCase();
      const desc = (w.description || w['Description'] || '').toString().toLowerCase();
      
      return name.includes(t) || desc.includes(t);
    });
  }

  // Sorting Logic
  get sortedWorkouts(): Workout[] {
    if (!this.sortColumn) return this.filtered;

    return [...this.filtered].sort((a, b) => {
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
    return Math.ceil(this.filtered.length / this.pageSize);
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

  editWorkout(id: number | undefined): void {
    this.router.navigate([`/admineditworkout/${id}`]);
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) return;
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
