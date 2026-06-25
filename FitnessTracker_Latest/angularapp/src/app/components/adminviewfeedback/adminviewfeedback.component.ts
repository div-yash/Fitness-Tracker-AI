import { Component } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent {

feedbackList: Feedback[]=
[];
errorMessage:string='';
isLoading: boolean = false;

constructor(private feedbackService: FeedbackService)
{

}
ngOnInit(): void
{
this.loadFeedbacks();
}
loadFeedbacks(): void {
  this.isLoading = true; // Start loading
  this.feedbackService.getFeedbacks().subscribe({
    next: (data) => {
      this.feedbackList = data;
      this.isLoading = false; // Stop loading
    },
    error: (error) => {
      console.error(error);
      this.errorMessage = "Unable to load feedbacks";
      this.isLoading = false; // Stop loading even on error
    }
  });
}
deleteFeedback(feedbackId:number | undefined):void
{
  if(!feedbackId) return;

  if(confirm('Are you sure you want to delete this feedback?')
  )
{
    this.feedbackService.deleteFeedback(feedbackId.toString()).subscribe(
      {
      next:()=>{
        this.loadFeedbacks();
      },
      error:(error)=>
      {
        console.error(error);
        this.errorMessage='Failed to delete feedback'
      }
    }
    );
  }
}
}
