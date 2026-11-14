import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from 'src/app/services/feedback.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-view-feedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  filteredFeedbacks: any[] = [];
  userId!: string;
  isLoading = false;
  serverError = '';
  searchTerm = '';

  // Modal states
  showViewModal = false;
  viewItem: any = null;
  showDeleteModal = false;
  deleteItem: any = null;

  // Pagination
  currentPage = 1;
  pageSize = 6;
  Math = Math;

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (!id) {
      this.serverError = 'You must be logged in to view your feedback.';
      return;
    }
    this.userId = id;
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.serverError = '';
    this.feedbackService.getAllFeedbacksByUserId(this.userId).subscribe({
      next: (data: any[]) => {
        this.feedbacks = (data || []).map(f => ({
          ...f,
          feedbackId: f.feedbackId ?? f['FeedbackId'],
          feedbackText: f.feedbackText ?? f['FeedbackText'],
          date: f.date ?? f['Date']
        }));
        this.onSearch();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.serverError = 'Failed to load your feedback history.';
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    const term = (this.searchTerm || '').trim().toLowerCase();

    if (!term) {
      this.filteredFeedbacks = [...this.feedbacks];
      return;
    }

    this.filteredFeedbacks = this.feedbacks.filter(f => {
      const text = (f.feedbackText || '').toLowerCase();
      return text.includes(term);
    });
  }

  get paginatedFeedbacks(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredFeedbacks.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFeedbacks.length / this.pageSize);
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

  addNewFeedback(): void {
    this.router.navigate(['/useraddfeedback']);
  }

  openViewModal(item: any): void {
    this.viewItem = item;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewItem = null;
  }

  openDeleteModal(item: any): void {
    this.deleteItem = item;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteItem = null;
  }

  confirmDelete(): void {
    if (!this.deleteItem?.feedbackId) return;

    this.feedbackService.deleteFeedback(this.deleteItem.feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(
          f => f.feedbackId !== this.deleteItem.feedbackId
        );
        this.onSearch();
        this.closeDeleteModal();
      },
      error: () => {
        this.feedbacks = this.feedbacks.filter(
          f => f.feedbackId !== this.deleteItem.feedbackId
        );
        this.onSearch();
        this.closeDeleteModal();
      }
    });
  }
}
