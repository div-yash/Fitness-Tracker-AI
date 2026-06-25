import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserviewworkoutComponent } from './components/userviewworkout/userviewworkout.component';
import { UserworkoutformComponent } from './components/userworkoutform/userworkoutform.component';
import { LoginComponent } from './components/login/login.component';
import { AdminaddworkoutComponent } from './components/adminaddworkout/adminaddworkout.component';
import { AdmineditworkoutComponent } from './components/admineditworkout/admineditworkout.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserappliedworkoutComponent } from './components/userappliedworkout/userappliedworkout.component';
import { AdminviewworkoutComponent } from './components/adminviewworkout/adminviewworkout.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RequestedworkoutComponent } from './components/requestedworkout/requestedworkout.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ErrorComponent } from './components/error/error.component';
import { AuthGuard } from './components/authguard/auth.guard';
import { SymptomcheckerComponent } from './components/symptomchecker/symptomchecker.component';

const routes: Routes = [
  //default
  {path:'',redirectTo:'home',pathMatch:'full'},

  //admin
  {path:'adminaddworkout',component:AdminaddworkoutComponent,canActivate:[AuthGuard],data:{roles:['Admin']}},
  {path:'admineditworkout/:id',component:AdmineditworkoutComponent,canActivate:[AuthGuard],data:{roles:['Admin']}},
  {path:'adminviewworkout',component:AdminviewworkoutComponent,canActivate:[AuthGuard],data:{roles:['Admin']}},
  {path:'adminviewfeedback',component:AdminviewfeedbackComponent,canActivate:[AuthGuard],data:{roles:['Admin']}},
  {path:'adminnav',component:AdminnavComponent,canActivate:[AuthGuard],data:{roles:['Admin']}},
 
  //user
  {path:'userviewworkout',component:UserviewworkoutComponent,canActivate:[AuthGuard],data:{roles:['User']}},
  {path:'userworkoutform/:workoutId',component:UserworkoutformComponent,canActivate:[AuthGuard],data:{roles:['User']}},
  {path:'useraddfeedback', component:UseraddfeedbackComponent,canActivate:[AuthGuard],data:{roles:['User']}},
  {path:'userviewfeedback', component:UserviewfeedbackComponent,canActivate:[AuthGuard],data:{roles:['User']}},
  {path:'userappliedworkout', component:UserappliedworkoutComponent,canActivate:[AuthGuard],data:{roles:['User']}},
  {path:'usernav', component:UsernavComponent,canActivate:[AuthGuard],data:{roles:['User']}},
  {path:'requestedworkout',component:RequestedworkoutComponent,canActivate: [AuthGuard],data:{roles:['Admin']}},
  {path:'symptomchecker',component:SymptomcheckerComponent,canActivate:[AuthGuard],data:{roles:['User']}},
  
  //common
  {path:'home',component:HomeComponent},
  {path:'registration',component:RegistrationComponent},
  {path:'login',component:LoginComponent},
  {path:'navbar',component:NavbarComponent},
  
  //error
  {path:'error',component:ErrorComponent},
  {path:'**',redirectTo:'error'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
