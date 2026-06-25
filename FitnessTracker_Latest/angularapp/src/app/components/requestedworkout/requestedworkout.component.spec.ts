import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestedworkoutComponent } from './requestedworkout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestedworkoutComponent', () => {
  let component: RequestedworkoutComponent;
  let fixture: ComponentFixture<RequestedworkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedworkoutComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedworkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_requestedworkout_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_workout_requests_for_approval_heading_in_the_requestedworkout_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Workout Requests for Approval');
  });
});
