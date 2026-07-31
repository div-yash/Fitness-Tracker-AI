# 💪 Fitness Tracker AI — Premium Gym & AI Diagnostics Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://fitness-tracker-ai-lemon.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-blue?style=for-the-badge&logo=render)](https://fitnesstracker-backend-ijcv.onrender.com/swagger/index.html)
[![AI Diagnostics](https://img.shields.io/badge/AI%20Diagnostics-Flask-blueviolet?style=for-the-badge&logo=flask)](https://fitness-tracker-ai-97qn.onrender.com)

**Fitness Tracker AI** is a premium, high-performance web application designed for fitness enthusiasts and administrators. The platform combines a custom glassmorphic user dashboard, structured workout plans, custom trainer request flows, and a machine-learning-powered **AI Symptom Checker & Diet Recommender** to deliver a complete startup-ready fitness experience.

---

## ⚡ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Angular 16, HTML5, Vanilla CSS, Bootstrap 5, Bootstrap Icons |
| **Backend API** | .NET Core 8.0 Web API, ASP.NET Core Identity, Entity Framework Core, JWT Token Auth |
| **Machine Learning** | Python Flask, Scikit-learn (Random Forest Classifier), Pandas |
| **Database** | PostgreSQL (Neon Serverless in Prod), SQL Server (Local fallback) |
| **DevOps & Hosting** | Docker, Docker Compose, Vercel (Frontend), Render (API & ML Services) |

---

## 🚀 Key Features

* **🎨 Glassmorphic Dark Dashboard**: A premium dark-theme homepage styled with high-contrast gradients, glowing accent orbs, real-time activity counters, and interactive feature navigators.
* **🏋️ Workout Management**:
  * **Admin Portal**: Full CRUD control to add, edit, or delete workouts.
  * **User Portal**: View workout lists, dynamic row configurations (5/10/20/50 per page), and interactive search.
  * **Table Column Sorting**: Instantly sort records (Workout Name, Days, Duration, Difficulty) in ascending/descending order.
  * **Pill Badges**: Color-coded difficulty badges (Green = Beginner, Blue = Intermediate, Red = Expert).
* **🧠 AI Symptom Checker**: Integrates a trained Random Forest model. Users input symptoms and receive instant predictions for precautions, diets, medications, and workout adjustments.
* **📋 Custom Programs**: Submit age, BMI index, gender, dietary preferences, and medical history. Admins can review, approve, or reject these custom training request cards.
* **🔒 Role-Based Authorization**: Protected routes (`AuthGuard`) for separate Admin and User experiences.

---

## 📂 Project Structure

```text
Fitness-Tracker-AI/
├── FitnessTracker_Latest/
│   ├── angularapp/          # Angular 16 Frontend (Dashboard, tables, forms, services)
│   ├── dotnetapp/           # .NET Core 8.0 Web API (Controllers, Auth, EF Core DbContext)
│   ├── run_and_test.ps1     # PowerShell script for automated backend API flow validation
│   └── insert_new_workouts.ps1 # Utility script for database population
├── Medicine-Recommendation-and-Disease-Prediction-using-Random-Forest/
│   ├── main.py              # Flask server entrypoint hosting the predictive endpoint
│   ├── model.pkl            # Trained Random Forest classifier binary
│   └── requirements.txt     # Python requirements
├── docker-compose.yml       # Orchestrates multi-container local execution
└── README.md                # Readme documentation (this file)
```

---

## ⚙️ Local Setup & Installation

### Option 1: One-Step Run with Docker Compose (Recommended)
Make sure you have Docker Desktop running, then run:

```bash
# 1. Clone the repository
git clone https://github.com/div-yash/Fitness-Tracker-AI.git
cd Fitness-Tracker-AI

# 2. Build and start all containers in detached mode
docker-compose up --build -d
```

Once loaded, you can access the services at:
* **Frontend UI**: `http://localhost:8081`
* **Backend Swagger API**: `http://localhost:8080/swagger`
* **Flask ML Service**: `http://localhost:5000`

---

### Option 2: Running Services Individually

#### Prerequisites
* Node.js v16+ & npm
* .NET 8.0 SDK
* Python 3.8+ & pip
* Local SQL Server instance

#### 1. Start the Flask ML Service
```bash
cd Medicine-Recommendation-and-Disease-Prediction-using-Random-Forest
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
*The ML server will start running on port `5000`.*

#### 2. Start the Backend API
```bash
cd ../FitnessTracker_Latest/dotnetapp
dotnet restore
dotnet run
```
*The API will start running on port `8080`.*

#### 3. Start the Angular UI
```bash
cd ../angularapp
npm install
npm run start
```
*The UI will launch on `http://localhost:8081`.*

---

## 🧪 Testing

To run the frontend unit tests in ChromeHeadless mode, run:
```bash
cd FitnessTracker_Latest/angularapp
npx ng test --watch=false --browsers=ChromeHeadless
```

---

## 🔗 AI API Specification
**POST** `https://fitness-tracker-ai-97qn.onrender.com/api/predict`

**Request Body**:
```json
{
  "symptoms": ["itching", "skin_rash", "nodal_skin_eruptions"]
}
```

**Response JSON**:
```json
{
  "predicted_disease": "Fungal infection",
  "description": "Fungal infection is a skin disease...",
  "precautions": ["bath twice", "use dettol", "keep area dry"],
  "medications": ["Antifungal Cream", "Fluconazole"],
  "diets": ["Probiotics", "Garlic", "Coconut oil"],
  "workouts": ["Light stretching", "Yoga"]
}
```

---

## 👤 Author
* **Divya Prakash** - [GitHub Profile](https://github.com/div-yash)
