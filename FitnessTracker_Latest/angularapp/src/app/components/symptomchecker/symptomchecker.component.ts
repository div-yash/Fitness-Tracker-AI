import { Component } from '@angular/core';
import { RecommendationService } from './recommendation.service';

@Component({
  selector: 'app-symptomchecker',
  templateUrl: './symptomchecker.component.html',
  styleUrls: ['./symptomchecker.component.css']
})
export class SymptomcheckerComponent {
  customSymptoms: string = '';
  isLoading: boolean = false;
  result: any = null;
  errorMessage: string = '';

  // 40 popular symptoms for user selection
  popularSymptoms = [
    { id: 'itching', label: 'Itching', selected: false },
    { id: 'skin_rash', label: 'Skin Rash', selected: false },
    { id: 'continuous_sneezing', label: 'Continuous Sneezing', selected: false },
    { id: 'shivering', label: 'Shivering', selected: false },
    { id: 'chills', label: 'Chills', selected: false },
    { id: 'joint_pain', label: 'Joint Pain', selected: false },
    { id: 'stomach_pain', label: 'Stomach Pain', selected: false },
    { id: 'acidity', label: 'Acidity', selected: false },
    { id: 'vomiting', label: 'Vomiting', selected: false },
    { id: 'burning_micturition', label: 'Burning Micturition', selected: false },
    { id: 'fatigue', label: 'Fatigue', selected: false },
    { id: 'weight_gain', label: 'Weight Gain', selected: false },
    { id: 'anxiety', label: 'Anxiety', selected: false },
    { id: 'mood_swings', label: 'Mood Swings', selected: false },
    { id: 'weight_loss', label: 'Weight Loss', selected: false },
    { id: 'restlessness', label: 'Restlessness', selected: false },
    { id: 'lethargy', label: 'Lethargy', selected: false },
    { id: 'cough', label: 'Cough', selected: false },
    { id: 'high_fever', label: 'High Fever', selected: false },
    { id: 'breathlessness', label: 'Breathlessness', selected: false },
    { id: 'sweating', label: 'Sweating', selected: false },
    { id: 'dehydration', label: 'Dehydration', selected: false },
    { id: 'indigestion', label: 'Indigestion', selected: false },
    { id: 'headache', label: 'Headache', selected: false },
    { id: 'yellowish_skin', label: 'Yellowish Skin', selected: false },
    { id: 'nausea', label: 'Nausea', selected: false },
    { id: 'loss_of_appetite', label: 'Loss of Appetite', selected: false },
    { id: 'back_pain', label: 'Back Pain', selected: false },
    { id: 'constipation', label: 'Constipation', selected: false },
    { id: 'abdominal_pain', label: 'Abdominal Pain', selected: false },
    { id: 'diarrhoea', label: 'Diarrhoea', selected: false },
    { id: 'chest_pain', label: 'Chest Pain', selected: false },
    { id: 'weakness_in_limbs', label: 'Weakness in Limbs', selected: false },
    { id: 'fast_heart_rate', label: 'Fast Heart Rate', selected: false },
    { id: 'dizziness', label: 'Dizziness', selected: false },
    { id: 'cramps', label: 'Cramps', selected: false },
    { id: 'muscle_weakness', label: 'Muscle Weakness', selected: false },
    { id: 'stiff_neck', label: 'Stiff Neck', selected: false },
    { id: 'depression', label: 'Depression', selected: false },
    { id: 'muscle_pain', label: 'Muscle Pain', selected: false }
  ];

  constructor(private recommendationService: RecommendationService) {}

  checkSymptoms() {
    this.errorMessage = '';
    this.result = null;

    // Combine selected symptoms and custom symptoms
    const selected = this.popularSymptoms
      .filter(s => s.selected)
      .map(s => s.id);

    if (this.customSymptoms.trim()) {
      const customList = this.customSymptoms.split(',')
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length > 0);
      selected.push(...customList);
    }

    if (selected.length === 0) {
      this.errorMessage = 'Please select or type at least one symptom.';
      return;
    }

    const symptomsQuery = selected.join(',');
    this.isLoading = true;

    this.recommendationService.getRecommendations(symptomsQuery).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data.status === 'success') {
          this.result = data;
        } else {
          this.errorMessage = data.message || 'Failed to analyze symptoms.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Could not connect to the ML Microservice. Please verify it is running on Port 5000.';
        console.error(err);
      }
    });
  }

  reset() {
    this.popularSymptoms.forEach(s => s.selected = false);
    this.customSymptoms = '';
    this.result = null;
    this.errorMessage = '';
  }
}
