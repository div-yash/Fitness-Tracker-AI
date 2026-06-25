import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserworkoutformComponent } from './userworkoutform.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserworkoutformComponent', () => {
  let component: UserworkoutformComponent;
  let fixture: ComponentFixture<UserworkoutformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserworkoutformComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserworkoutformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userworkoutform_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_workout_application_form_heading_in_the_userworkoutform_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Workout Application Form');
  });
});
