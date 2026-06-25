import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SymptomcheckerComponent } from './symptomchecker.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RecommendationService } from './recommendation.service';

describe('SymptomcheckerComponent', () => {
  let component: SymptomcheckerComponent;
  let fixture: ComponentFixture<SymptomcheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [SymptomcheckerComponent],
      providers: [RecommendationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymptomcheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Frontend_should_create_symptomchecker_component', () => {
    expect(component).toBeTruthy();
  });
});
