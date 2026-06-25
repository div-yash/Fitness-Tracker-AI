import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminaddworkoutComponent } from './adminaddworkout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminaddworkoutComponent', () => {
  let component: AdminaddworkoutComponent;
  let fixture: ComponentFixture<AdminaddworkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminaddworkoutComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminaddworkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_adminaddworkout_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_create_new_workout_heading_in_the_adminaddworkout_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Create New Workout');
  });
});
