import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmineditworkoutComponent } from './admineditworkout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdmineditworkoutComponent', () => {
  let component: AdmineditworkoutComponent;
  let fixture: ComponentFixture<AdmineditworkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmineditworkoutComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmineditworkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_admineditworkout_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_edit_workout_heading_in_the_admineditworkout_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Edit Workout');
  });
});
