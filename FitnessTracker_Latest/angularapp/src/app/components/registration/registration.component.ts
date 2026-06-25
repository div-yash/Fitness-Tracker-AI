import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent{
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
 
 
  user = {
   Email: "",
   Password: "",
   ConfirmPassword: "",
   Username: "",
   MobileNumber: "",
   UserRole: ""
  }

 constructor(private router: Router, private authService : AuthService) {}

 register(formData: NgForm) {
  if(formData.invalid){
    formData.control.markAllAsTouched();
    return;
  }

  const {
    Email,Password,ConfirmPassword,Username,MobileNumber,UserRole
  }=formData.value;

  if(Password!=ConfirmPassword){
    return;
  }

  const payload:User={ 
    Email : Email,
    Password:Password,
    Username:Username,
    MobileNumber:MobileNumber,
    UserRole:UserRole
  };

   console.log(formData.value)
   this.authService.register(payload).subscribe(() => {
     this.router.navigate(['/login'])
   }, (err) => console.log(err))
 }
}
