import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserappliedworkoutComponent } from './userappliedworkout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserappliedworkoutComponent', () => {
  let component: UserappliedworkoutComponent;
  let fixture: ComponentFixture<UserappliedworkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserappliedworkoutComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserappliedworkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userappliedworkout_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_applied_workouts_heading_in_the_userappliedworkout_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Applied Workouts');
  });
});
