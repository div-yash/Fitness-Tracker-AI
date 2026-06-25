export interface WorkoutRequest{
    WorkoutRequestId?:number;
    UserId?:number;
    WorkoutId?:number;
    Age:number;
    BMI:number;
    Gender:string;
    DietaryPreferences:string;
    MedicalHistory:string;
    RequestedDate:string;
    RequestStatus:string;
}