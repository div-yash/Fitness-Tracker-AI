import { Component } from '@angular/core';
import { WorkoutRequest } from '../../models/workoutrequest.model';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutrequestService } from '../../services/workoutrequest.service';

@Component({
  selector: 'app-requestedworkout',
  templateUrl: './requestedworkout.component.html',
  styleUrls: ['./requestedworkout.component.css']
})
export class RequestedworkoutComponent {
  workoutRequestList: any[] = []
  showModal = false;
  selectedItem: any = null;


  constructor(private workoutrequestService: WorkoutrequestService) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {

    this.workoutrequestService.getAllWorkoutRequests().subscribe({
      next: (data) => this.workoutRequestList = data,
      error: (err) => console.error(err)
    });
  }


  onApprove(item: any) {
    const updated = { ...item, requestStatus: 'Approved' };

    this.workoutrequestService
      .updateWorkoutStatus(String(item.workoutRequestId), updated)
      .subscribe(() => {
        item.requestStatus = 'Approved';
      });
  }


  onReject(item: any) {
    const updated = { ...item, requestStatus: 'Rejected' };

    this.workoutrequestService
      .updateWorkoutStatus(String(item.workoutRequestId), updated)
      .subscribe(() => {
        item.requestStatus = 'Rejected';   // update UI instantly
      });
  }


  onView(item: any) {
    this.selectedItem = item;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedItem = null;
  }

}
