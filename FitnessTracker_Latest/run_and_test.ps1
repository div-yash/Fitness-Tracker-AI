# Start the backend API in the background
Write-Host "Starting backend dotnetapp..."
$dotnetProcess = Start-Process dotnet -ArgumentList "run" -WorkingDirectory "e:\FitnessTracker\FitnessTracker_Latest\dotnetapp" -PassThru -NoNewWindow

# Wait for backend to start up
Start-Sleep -Seconds 12

$baseUrl = "http://localhost:8080"

try {
    # 1. Register Admin
    Write-Host "`n1. Registering Admin user..."
    $regBody = @{
        email = "admin@fitnesstracker.com"
        password = "Password123!"
        username = "admin"
        mobileNumber = "1234567890"
        userRole = "Admin"
    } | ConvertTo-Json

    $regResponse = Invoke-RestMethod -Uri "$baseUrl/api/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "Registration Response:"
    Write-Host ($regResponse | ConvertTo-Json -Depth 5)

    # 2. Login Admin
    Write-Host "`n2. Logging in Admin..."
    $loginBody = @{
        email = "admin@fitnesstracker.com"
        password = "Password123!"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful. JWT token retrieved."

    # 3. Add Workout (Admin Action)
    Write-Host "`n3. Creating new workout schedule..."
    $workoutBody = @{
        workoutName = "Morning Cardio Blast"
        description = "High-intensity cardio exercises to burn fat and increase stamina."
        difficultyLevel = 3
        createdAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        targetArea = "Full Body"
        daysPerWeek = 4
        averageWorkoutDurationInMinutes = 45
    } | ConvertTo-Json

    $headers = @{
        Authorization = "Bearer $token"
    }

    $workoutResponse = Invoke-RestMethod -Uri "$baseUrl/api/workout" -Method Post -Body $workoutBody -ContentType "application/json" -Headers $headers
    Write-Host "Workout Creation Response:"
    Write-Host ($workoutResponse | ConvertTo-Json -Depth 5)

    # 4. Fetch All Workouts
    Write-Host "`n4. Fetching all workouts..."
    $fetchResponse = Invoke-RestMethod -Uri "$baseUrl/api/workout" -Method Get -Headers $headers
    Write-Host "Total workouts in database: $($fetchResponse.Count)"
    Write-Host ($fetchResponse | ConvertTo-Json -Depth 5)

} catch {
    Write-Error $_
} finally {
    # Stop the backend API process
    Write-Host "`nStopping backend dotnetapp..."
    Stop-Process -Id $dotnetProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Name dotnetapp -Force -ErrorAction SilentlyContinue
}
