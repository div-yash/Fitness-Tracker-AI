import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule ,  HTTP_INTERCEPTORS} from '@angular/common/http';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdminviewworkoutComponent } from './components/adminviewworkout/adminviewworkout.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { UserviewworkoutComponent } from './components/userviewworkout/userviewworkout.component';
import { UserworkoutformComponent } from './components/userworkoutform/userworkoutform.component';
import { LoginComponent } from './components/login/login.component';
import { AdminaddworkoutComponent } from './components/adminaddworkout/adminaddworkout.component';
import { AdmineditworkoutComponent } from './components/admineditworkout/admineditworkout.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserappliedworkoutComponent } from './components/userappliedworkout/userappliedworkout.component';
import { ErrorComponent } from './components/error/error.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestedworkoutComponent } from './components/requestedworkout/requestedworkout.component';
import { SymptomcheckerComponent } from './components/symptomchecker/symptomchecker.component';
import { AuthInterceptor } from './Interceptors/auth.interceptor';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    AdminnavComponent,
    AdminviewworkoutComponent,
    AdminviewfeedbackComponent,
    NavbarComponent,
    HomeComponent,
    UserviewworkoutComponent,
    UserworkoutformComponent,
    LoginComponent,
    AdminaddworkoutComponent,
    AdmineditworkoutComponent,
    UserviewfeedbackComponent,
    UseraddfeedbackComponent,
    UsernavComponent,
    UserappliedworkoutComponent,
    RegistrationComponent,
    ErrorComponent,
    RequestedworkoutComponent,
    SymptomcheckerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
