import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
errorTitle:string="Something Went Wrong"
errorMessage:string="We're sorry, but an error occurred. Please try again later."
}
