import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminviewworkoutComponent } from './adminviewworkout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminviewworkoutComponent', () => {
  let component: AdminviewworkoutComponent;
  let fixture: ComponentFixture<AdminviewworkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminviewworkoutComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewworkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_adminviewworkout_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_workouts_heading_in_the_adminviewworkout_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Workouts');
  });
});
