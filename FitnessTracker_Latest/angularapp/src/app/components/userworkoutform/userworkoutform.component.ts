import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutRequest } from 'src/app/models/workoutrequest.model';
import { WorkoutrequestService } from 'src/app/services/workoutrequest.service';

@Component({
  selector: 'app-userworkoutform',
  templateUrl: './userworkoutform.component.html',
  styleUrls: ['./userworkoutform.component.css']
})

export class UserworkoutformComponent implements OnInit {

  workout: WorkoutRequest = {
    WorkoutRequestId: 0,
    UserId: 0,
    WorkoutId: 0,
    Age: null,
    BMI: null,
    Gender: '',
    DietaryPreferences: '',
    MedicalHistory: '',
    RequestedDate: '',
    RequestStatus: 'Pending'
  };

  errorMessage = '';
  submitted = false;
  selectedMedicalHistory: string = '';
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workoutRequestService: WorkoutrequestService
  ) { }


  ngOnInit(): void {
    const idFromRoute = Number(this.route.snapshot.paramMap.get('workoutId'));
    this.workout.WorkoutId = idFromRoute;
    const storedUserId = localStorage.getItem('UserId');
    this.workout.UserId = Number(storedUserId);
  }

  back(): void {
    this.router.navigate(['/userviewworkout']);
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      this.errorMessage = 'All fields are required';
      form.control.markAllAsTouched();
      return;
    }
    if(this.workout.MedicalHistory === ''){
      this.workout.MedicalHistory = this.selectedMedicalHistory
    }
    if (
      this.workout.Age &&
      this.workout.BMI &&
      this.workout.Gender &&
      this.workout.DietaryPreferences &&
      this.workout.MedicalHistory
    ) {
      this.errorMessage = '';
      this.submitted = true;
      this.workout.RequestedDate = new Date().toISOString();

      this.workoutRequestService.addWorkoutRequest(this.workout).subscribe({
        next: () => {
          alert('Successfully Added');
          form.resetForm();
          this.submitted = false;
          this.router.navigate(['/userviewworkout']);
        },

        error: (err) => {
          this.submitted = false;

          const msg = (err?.error ?? '').toString().toUpperCase();
          const status = err?.status;

          if (msg.includes('DUPLICATE') || status === 409) {
            this.errorMessage = 'You have already applied for this workout.';
            return;
          }

          // this.errorMessage = 'Something went wrong. Please try again.';
          console.error('Add user workout request error:', err);
        }
      });
    }
  }

}
