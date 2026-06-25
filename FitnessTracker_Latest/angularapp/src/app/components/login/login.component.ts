import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent{

  user = {
    Email: '',
    Password: ''
  }

  constructor(private authService: AuthService, private router: Router) {

  }
  
  login(from:NgForm){
    this.authService.login(from.value).subscribe((data)=>{
      console.log(data);
      if(this.authService.isAdmin()){
        console.log("in the admin nav")
        this.router.navigate(['/home'])
      }
      if(this.authService.isUser()){
        console.log("in the user nav")
        this.router.navigate(['/home'])
      }
    })
  }
}
