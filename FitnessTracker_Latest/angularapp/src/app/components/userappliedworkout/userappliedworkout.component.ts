import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from 'src/app/services/workout.service';
import { WorkoutrequestService } from 'src/app/services/workoutrequest.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-userappliedworkout',
  templateUrl: './userappliedworkout.component.html',
  styleUrls: ['./userappliedworkout.component.css']
})
export class UserappliedworkoutComponent implements OnInit {
  appliedList: any[] = [];
  filteredList: any[] = [];
  userId = localStorage.getItem('UserId');
  loading = false;
  serverError = '';
  searchTerm = '';
  statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';

  // Delete modal state
  showDeleteModal = false;
  selectedRequestId: number | null = null;

  constructor(
    private workoutReqService: WorkoutrequestService,
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAppliedWorkouts();
  }

  getAppliedWorkouts(): void {
    this.loading = true;
    this.serverError = '';

    forkJoin({
      workouts: this.workoutService.getAllWorkouts(),
      applications: this.workoutReqService.getAppliedWorkouts(this.userId)
    }).subscribe({
      next: ({ workouts, applications }) => {
        const workoutMap = new Map<number, any>();
        (workouts || []).forEach((w: any) => {
          workoutMap.set(Number(w.workoutId), w);
        });

        this.appliedList = (applications || []).map((app: any) => {
          const w = workoutMap.get(Number(app.workoutId));
          return {
            ...app,
            workoutName: w?.workoutName || app.workoutName || 'Custom Program',
            targetArea: w?.targetArea || 'Full Body',
            duration: w?.averageWorkoutDurationInMinutes || 45,
            daysPerWeek: w?.daysPerWeek || 3,
            difficultyLevel: w?.difficultyLevel || 2
          };
        });

        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.serverError = 'Failed to load your workout applications.';
        this.loading = false;
      }
    });
  }

  setFilter(status: 'all' | 'pending' | 'approved' | 'rejected'): void {
    this.statusFilter = status;
    this.applyFilter();
  }

  applyFilter(): void {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredList = this.appliedList.filter(item => {
      const statusMatch =
        this.statusFilter === 'all' ||
        (item.requestStatus || '').toLowerCase() === this.statusFilter;

      if (!statusMatch) return false;
      if (!term) return true;

      const name = (item.workoutName || '').toLowerCase();
      const diet = (item.dietaryPreferences || '').toLowerCase();
      const med = (item.medicalHistory || '').toLowerCase();
      return name.includes(term) || diet.includes(term) || med.includes(term);
    });
  }

  get totalCount(): number {
    return this.appliedList.length;
  }

  get pendingCount(): number {
    return this.appliedList.filter(i => (i.requestStatus || '').toLowerCase() === 'pending').length;
  }

  get approvedCount(): number {
    return this.appliedList.filter(i => (i.requestStatus || '').toLowerCase() === 'approved').length;
  }

  get rejectedCount(): number {
    return this.appliedList.filter(i => (i.requestStatus || '').toLowerCase() === 'rejected').length;
  }

  getBmiClass(bmi: number | string | undefined): string {
    const val = Number(bmi);
    if (!val || isNaN(val)) return 'text-muted';
    if (val < 18.5) return 'text-info';
    if (val < 25) return 'text-success';
    if (val < 30) return 'text-warning';
    return 'text-danger';
  }

  getBmiLabel(bmi: number | string | undefined): string {
    const val = Number(bmi);
    if (!val || isNaN(val)) return 'N/A';
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal';
    if (val < 30) return 'Overweight';
    return 'Obese';
  }

  browseWorkouts(): void {
    this.router.navigate(['/userviewworkout']);
  }

  openDeleteModal(id: number): void {
    this.selectedRequestId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedRequestId = null;
  }

  confirmDelete(): void {
    if (!this.selectedRequestId) return;
    this.workoutReqService.deleteWorkoutApplication(this.selectedRequestId).subscribe({
      next: () => {
        this.appliedList = this.appliedList.filter(item => item.workoutRequestId !== this.selectedRequestId);
        this.applyFilter();
        this.closeDeleteModal();
      },
      error: () => {
        this.appliedList = this.appliedList.filter(item => item.workoutRequestId !== this.selectedRequestId);
        this.applyFilter();
        this.closeDeleteModal();
      }
    });
  }
}
