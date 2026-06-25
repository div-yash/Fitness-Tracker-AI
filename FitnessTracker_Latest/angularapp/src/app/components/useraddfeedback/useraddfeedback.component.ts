import { Component } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Modal } from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent {
  feedbackText = '';
  userId = 0;
  message = '';

  constructor(private feedbackService: FeedbackService,private authService:AuthService) {}

  ngOnInit(){
    this.userId = Number(this.authService.getUserId());
  }

  submitFeedback() {
    console.log(this.userId);
    if (!this.feedbackText.trim()) {
      this.message = 'Feedback is required.';
      this.openModal();
      return;
    }

    const feedback: Feedback = {
      UserId: this.userId,
      FeedbackText: this.feedbackText,
      Date: new Date()
    };

    this.feedbackService.sendFeedback(feedback).subscribe({
      next: () => {
        this.message = 'Successfully Added!';
        this.feedbackText = '';
        this.openModal();
      },
      error: () => {
        this.message = 'Error in adding Feedback';
        this.openModal();
      }
    });
  }

  openModal() {
    const modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
}
