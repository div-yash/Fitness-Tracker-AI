import { Component, OnInit } from '@angular/core';
import { WorkoutrequestService } from '../../services/workoutrequest.service';

@Component({
  selector: 'app-requestedworkout',
  templateUrl: './requestedworkout.component.html',
  styleUrls: ['./requestedworkout.component.css']
})
export class RequestedworkoutComponent implements OnInit {
  workoutRequestList: any[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  isLoading: boolean = false;
  showModal: boolean = false;
  selectedItem: any = null;

  constructor(private workoutrequestService: WorkoutrequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.workoutrequestService.getAllWorkoutRequests().subscribe({
      next: (data) => {
        this.workoutRequestList = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load workout requests', err);
        this.isLoading = false;
      }
    });
  }

  setFilter(status: string): void {
    this.statusFilter = status;
  }

  get filteredRequests(): any[] {
    return this.workoutRequestList.filter(item => {
      // 1. Status Filter
      if (this.statusFilter !== 'all') {
        const itemStatus = (item.requestStatus || '').toLowerCase();
        if (itemStatus !== this.statusFilter.toLowerCase()) {
          return false;
        }
      }

      // 2. Search Term Filter
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase().trim();
        const username = (item.user?.username || '').toLowerCase();
        const email = (item.user?.email || '').toLowerCase();
        const workoutName = (item.workout?.workoutName || '').toLowerCase();
        const targetArea = (item.workout?.targetArea || '').toLowerCase();
        const diet = (item.dietaryPreferences || '').toLowerCase();
        const medical = (item.medicalHistory || '').toLowerCase();

        return username.includes(term) ||
               email.includes(term) ||
               workoutName.includes(term) ||
               targetArea.includes(term) ||
               diet.includes(term) ||
               medical.includes(term);
      }

      return true;
    });
  }

  get totalCount(): number {
    return this.workoutRequestList.length;
  }

  get pendingCount(): number {
    return this.workoutRequestList.filter(r => (r.requestStatus || '').toLowerCase() === 'pending').length;
  }

  get approvedCount(): number {
    return this.workoutRequestList.filter(r => (r.requestStatus || '').toLowerCase() === 'approved').length;
  }

  get rejectedCount(): number {
    return this.workoutRequestList.filter(r => (r.requestStatus || '').toLowerCase() === 'rejected').length;
  }

  onApprove(item: any, event?: Event): void {
    if (event) event.stopPropagation();
    const updated = { ...item, requestStatus: 'Approved' };

    this.workoutrequestService
      .updateWorkoutStatus(String(item.workoutRequestId), updated)
      .subscribe({
        next: () => {
          item.requestStatus = 'Approved';
        },
        error: (err) => console.error('Approve failed', err)
      });
  }

  onReject(item: any, event?: Event): void {
    if (event) event.stopPropagation();
    const updated = { ...item, requestStatus: 'Rejected' };

    this.workoutrequestService
      .updateWorkoutStatus(String(item.workoutRequestId), updated)
      .subscribe({
        next: () => {
          item.requestStatus = 'Rejected';
        },
        error: (err) => console.error('Reject failed', err)
      });
  }

  onView(item: any): void {
    this.selectedItem = item;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
  }

  getInitials(name?: string): string {
    if (!name || name.trim() === '') return 'FT';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  getBmiClass(bmi?: number): string {
    if (!bmi) return 'bmi-normal';
    if (bmi < 18.5) return 'bmi-underweight';
    if (bmi <= 24.9) return 'bmi-normal';
    if (bmi <= 29.9) return 'bmi-overweight';
    return 'bmi-obese';
  }

  getBmiLabel(bmi?: number): string {
    if (!bmi) return 'Normal';
    if (bmi < 18.5) return 'Underweight';
    if (bmi <= 24.9) return 'Normal';
    if (bmi <= 29.9) return 'Overweight';
    return 'Obese';
  }
}
