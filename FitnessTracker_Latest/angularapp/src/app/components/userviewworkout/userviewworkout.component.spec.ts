import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserviewworkoutComponent } from './userviewworkout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserviewworkoutComponent', () => {
  let component: UserviewworkoutComponent;
  let fixture: ComponentFixture<UserviewworkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserviewworkoutComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewworkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userviewworkout_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_available_workouts_heading_in_the_userviewworkout_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Available Workouts');
  });
});
