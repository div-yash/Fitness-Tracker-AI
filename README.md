# Fitness Tracker AI Application

A modern, highly premium, sporty Fitness Tracker application built with Angular, .NET Core API, SQL Server, and a Flask-based Machine Learning disease prediction microservice.

**Repository URL**: [https://github.com/div-yash/Fitness-Tracker-AI](https://github.com/div-yash/Fitness-Tracker-AI)

---

## 🌟 Features & Architecture

The application comprises three core components orchestrated to run together:

1. **Frontend (`angularapp`)**:
   - Built with **Angular 16** featuring a custom modern high-contrast active dashboard.
   - Styled with a premium sporty design system (active orange `#fc6100`, slate black, glassmorphism, responsive data grids, and smooth button micro-animations).
   - Includes user authentication, workout log forms, interactive feedback, and a dedicated **AI Symptom Checker**.
2. **Backend API (`dotnetapp`)**:
   - Built with **.NET Core (REST API)** using JWT-based authorization.
   - Manages workout schedules, user registrations/logins, and feedback data persistence.
3. **ML Prediction Service (`ml-service`)**:
   - A Flask microservice wrapping a **Random Forest Classifier** trained for disease prediction.
   - Exposes a JSON POST endpoint `/api/predict` that maps 40 popular symptoms to diagnosed conditions, generating comprehensive recommendations (description, precautions, diets, medications, and workouts).
4. **Database**:
   - **SQL Server** containerized database with mapped volumes for persistent storage.

---

## 🚀 How to Run the Project

### Option 1: Using Docker Compose (Recommended)

Running the entire multi-container application locally requires only one command. Make sure you have Docker Desktop running, then:

1. Navigate to the project root directory:
   ```bash
   cd E:\FitnessTracker
   ```
2. Build and start all services in the background:
   ```bash
   docker-compose up --build -d
   ```
3. Once running, access the services:
   - **Frontend App**: [http://localhost:8081](http://localhost:8081)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **ML Prediction Service**: [http://localhost:5000](http://localhost:5000)
   - **SQL Server**: `localhost,1433`

4. To stop the containers, run:
   ```bash
   docker-compose down
   ```

---

### Option 2: Running Services Individually (Local Setup)

If you prefer to run the components individually:

#### Prerequisites
- .NET 10.0 SDK
- Node.js (v16+) & npm
- Python 3.8+ & pip
- Local SQL Server instance

#### 1. Machine Learning Prediction Service
1. Navigate to the ML service directory:
   ```bash
   cd E:\FitnessTracker\Medicine-Recommendation-and-Disease-Prediction-using-Random-Forest
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the service:
   ```bash
   python main.py
   ```
   *The Flask microservice will start on port `5000`.*

#### 2. .NET Core Backend API
1. Navigate to the backend directory:
   ```bash
   cd E:\FitnessTracker\FitnessTracker_Latest\dotnetapp
   ```
2. Configure the database connection string in [.env](file:///E:/FitnessTracker/FitnessTracker_Latest/dotnetapp/.env) or [appsettings.json](file:///E:/FitnessTracker/FitnessTracker_Latest/dotnetapp/appsettings.json).
3. Start the API:
   ```bash
   dotnet run
   ```
   *The backend server runs on port `8080` (or as configured).*

#### 3. Angular Frontend
1. Navigate to the frontend directory:
   ```bash
   cd E:\FitnessTracker\FitnessTracker_Latest\angularapp
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
   *The application will open on [http://localhost:8081](http://localhost:8081).*

---

## 🧪 Running Unit Tests

To run the Angular frontend unit tests:

1. Navigate to the frontend directory:
   ```bash
   cd E:\FitnessTracker\FitnessTracker_Latest\angularapp
   ```
2. Run Karma tests in single-run mode with ChromeHeadless:
   ```bash
   npx ng test --watch=false --browsers=ChromeHeadless
   ```

---

## 📂 Project Structure

```text
E:\FitnessTracker
├── FitnessTracker_Latest/
│   ├── angularapp/          # Angular Frontend code (styles, components, services)
│   ├── dotnetapp/           # .NET Core Web API (Controllers, Models, Services)
│   └── run_and_test.ps1     # PowerShell script for automated API flow testing
├── Medicine-Recommendation-and-Disease-Prediction-using-Random-Forest/
│   ├── main.py              # Flask server entrypoint
│   ├── model.pkl            # Trained Random Forest classifier binary
│   ├── templates/ & static/ # UI assets for standalone Flask app
│   └── *.csv                # Datasets (diet, medications, precautions, workouts)
├── docker-compose.yml       # Orchestrates mssql, dotnetapp, ml-service, and frontend
└── README.md                # Project documentation (this file)
```