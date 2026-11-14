import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {
  feedbackList: any[] = [];
  filteredList: any[] = [];
  errorMessage = '';
  isLoading = false;
  searchTerm = '';

  // Pagination
  currentPage = 1;
  pageSize = 9;
  Math = Math;

  // Delete modal state
  showDeleteModal = false;
  selectedFeedbackId: number | null = null;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.feedbackService.getFeedbacks().subscribe({
      next: (data) => {
        this.feedbackList = (data || []).map(f => ({
          ...f,
          feedbackId: f.feedbackId ?? f['FeedbackId'],
          userId: f.userId ?? f['UserId'],
          feedbackText: f.feedbackText ?? f['FeedbackText'],
          date: f.date ?? f['Date'],
          user: (f as any).user ?? (f as any).User
        }));
        this.onSearch();
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load feedbacks from server.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    const term = (this.searchTerm || '').trim().toLowerCase();

    if (!term) {
      this.filteredList = [...this.feedbackList];
      return;
    }

    this.filteredList = this.feedbackList.filter(f => {
      const text = (f.feedbackText || '').toLowerCase();
      const author = (f.user?.username || `athlete ${f.userId}` || '').toLowerCase();
      return text.includes(term) || author.includes(term);
    });
  }

  get paginatedFeedbacks(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredList.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredList.length / this.pageSize);
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

  getInitials(name?: string): string {
    if (!name) return 'A';
    return name.slice(0, 2).toUpperCase();
  }

  confirmDelete(feedbackId: number | undefined): void {
    if (!feedbackId) return;
    this.selectedFeedbackId = feedbackId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedFeedbackId = null;
  }

  executeDelete(): void {
    if (!this.selectedFeedbackId) return;

    this.feedbackService.deleteFeedback(this.selectedFeedbackId.toString()).subscribe({
      next: () => {
        this.feedbackList = this.feedbackList.filter(
          f => f.feedbackId !== this.selectedFeedbackId
        );
        this.onSearch();
        this.closeDeleteModal();
      },
      error: (err) => {
        // Handle 200 or unexpected status
        this.feedbackList = this.feedbackList.filter(
          f => f.feedbackId !== this.selectedFeedbackId
        );
        this.onSearch();
        this.closeDeleteModal();
      }
    });
  }
}
