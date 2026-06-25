import { TestBed } from '@angular/core/testing';

import { WorkoutService } from './workout.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WorkoutService);
  });

  fit('Frontend_should_create_workout_service', () => {
    expect(service).toBeTruthy();
  });
});
