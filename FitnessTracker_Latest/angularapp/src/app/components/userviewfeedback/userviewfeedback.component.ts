import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Modal } from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-view-feedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {

  feedbacks: any[] = [];
  userId!: string;
  isLoading = false;

  viewItem: any;
  deleteItem: any;

  message = '';

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (!id) {
      this.message = 'User not logged in';
      this.openModal('statusModal');
      return;
    }
    this.userId = id;
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getAllFeedbacksByUserId(this.userId).subscribe({
      next: (data: any[]) => {
        this.feedbacks = (data || []).map(f => ({
          ...f,
          feedbackText: f.feedbackText || f.FeedbackText
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Failed to load feedbacks';
        this.openModal('statusModal');
      }
    });
  }

  viewFeedback(f: any): void {
    this.viewItem = {
      ...f,
      feedbackText: f.feedbackText || f.FeedbackText
    };
    this.openModal('viewModal');
  }

  openDelete(f: any): void {
    this.deleteItem = f;
    this.openModal('deleteModal');
  }

  confirmDelete(): void {
    if (!this.deleteItem?.feedbackId) return;

    this.feedbackService.deleteFeedback(this.deleteItem.feedbackId).subscribe({
      next: () => {
        this.afterDeleteSuccess();
      },
      error: () => {
        this.afterDeleteSuccess();
      }
    });
  }

  afterDeleteSuccess(): void {
    this.feedbacks = this.feedbacks.filter(
      f => f.feedbackId !== this.deleteItem.feedbackId
    );

    this.deleteItem = undefined;
    this.closeModal('deleteModal');
  }

  cancelDelete(): void {
    this.deleteItem = undefined;
    this.closeModal('deleteModal');
  }

  openModal(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    let modal = Modal.getInstance(el);
    if (!modal) modal = new Modal(el);
    modal.show();
  }

  closeModal(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    Modal.getInstance(el)?.hide();
  }
}
