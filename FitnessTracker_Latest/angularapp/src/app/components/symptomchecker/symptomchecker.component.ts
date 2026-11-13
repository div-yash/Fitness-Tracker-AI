import { Component, OnInit } from '@angular/core';
import { RecommendationService, SymptomHistoryRecord } from './recommendation.service';

@Component({
  selector: 'app-symptomchecker',
  templateUrl: './symptomchecker.component.html',
  styleUrls: ['./symptomchecker.component.css']
})
export class SymptomcheckerComponent implements OnInit {
  customSymptoms: string = '';
  isLoading: boolean = false;
  result: any = null;
  errorMessage: string = '';
  saveSuccessMessage: string = '';
  historyList: SymptomHistoryRecord[] = [];
  userId: number = 0;

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

  ngOnInit(): void {
    const storedId = localStorage.getItem('UserId');
    if (storedId) {
      this.userId = parseInt(storedId, 10);
      this.loadHistory();
    }
  }

  loadHistory(): void {
    if (!this.userId) return;
    this.recommendationService.getUserDiagnosisHistory(this.userId).subscribe({
      next: (data) => {
        this.historyList = data || [];
      },
      error: (err) => {
        console.warn('Could not load diagnosis history:', err);
      }
    });
  }

  checkSymptoms(): void {
    this.errorMessage = '';
    this.saveSuccessMessage = '';
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
          this.autoSaveDiagnosis(symptomsQuery, data);
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

  autoSaveDiagnosis(symptoms: string, data: any): void {
    if (!this.userId) return;

    const record: SymptomHistoryRecord = {
      userId: this.userId,
      symptoms: symptoms,
      predictedDisease: data.disease,
      description: data.description,
      precautions: JSON.stringify(data.precautions || []),
      medications: JSON.stringify(data.medications || []),
      diets: JSON.stringify(data.diets || []),
      workouts: JSON.stringify(data.workouts || [])
    };

    this.recommendationService.saveDiagnosisHistory(record).subscribe({
      next: () => {
        this.saveSuccessMessage = 'Diagnostic result saved to your health history.';
        this.loadHistory();
      },
      error: (err) => {
        console.warn('Could not auto-save diagnosis to history:', err);
      }
    });
  }

  viewPastRecord(record: SymptomHistoryRecord): void {
    const parseSafe = (val?: string) => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return val.split(',').map(s => s.trim());
      }
    };

    this.result = {
      disease: record.predictedDisease,
      description: record.description || 'No description available.',
      precautions: parseSafe(record.precautions),
      medications: parseSafe(record.medications),
      diets: parseSafe(record.diets),
      workouts: parseSafe(record.workouts)
    };
    this.saveSuccessMessage = `Loaded past diagnosis from ${record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'history'}.`;
  }

  deleteHistoryRecord(id?: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (!id) return;
    if (confirm('Delete this diagnosis record from history?')) {
      this.recommendationService.deleteDiagnosisHistory(id).subscribe({
        next: () => {
          this.historyList = this.historyList.filter(item => item.id !== id);
        },
        error: (err) => {
          console.error('Failed to delete history record', err);
        }
      });
    }
  }

  reset(): void {
    this.popularSymptoms.forEach(s => s.selected = false);
    this.customSymptoms = '';
    this.result = null;
    this.errorMessage = '';
    this.saveSuccessMessage = '';
  }
}
