$connString = "Server=localhost;Database=FitnessTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
$conn = New-Object System.Data.SqlClient.SqlConnection($connString)
try {
    $conn.Open()
    $workouts = @(
        @{ Name="Full Body Burn Xtreme"; Desc="Combination of strength and cardio for overall fitness improvement."; Diff=4; Target="Full Body"; Days=5; Dur=50 },
        @{ Name="Upper Strength Focus"; Desc="Heavy lifting routine targeting chest, shoulders, and arms."; Diff=5; Target="Upper Body"; Days=4; Dur=65 },
        @{ Name="Lower Body Sculpt"; Desc="Squat, lunges, and leg press focused workout for toned legs."; Diff=3; Target="Lower Body"; Days=4; Dur=45 },
        @{ Name="Core Stability Pro"; Desc="Exercises designed to improve balance and core strength."; Diff=3; Target="Core"; Days=5; Dur=35 },
        @{ Name="Fat Burn Express"; Desc="Quick calorie-burning workout for busy schedules."; Diff=4; Target="Full Body"; Days=6; Dur=25 },
        @{ Name="Mobility & Stretch"; Desc="Dynamic stretching routine to enhance flexibility and prevent injury."; Diff=2; Target="Flexibility"; Days=5; Dur=30 },
        @{ Name="Home Workout Basic"; Desc="Simple bodyweight exercises for beginners at home."; Diff=1; Target="Full Body"; Days=3; Dur=20 },
        @{ Name="Power Strength Routine"; Desc="Advanced strength workout for muscle growth and endurance."; Diff=5; Target="Upper Body"; Days=5; Dur=70 },
        @{ Name="Endurance Cardio Plus"; Desc="Long-duration cardio session for heart and stamina improvement."; Diff=4; Target="Full Body"; Days=4; Dur=60 },
        @{ Name="Core & Abs Blast"; Desc="Intense abdominal workout for six-pack development."; Diff=4; Target="Core"; Days=5; Dur=30 },
        @{ Name="Active Recovery Flow"; Desc="Light workout focusing on recovery and relaxation."; Diff=1; Target="Full Body"; Days=6; Dur=25 },
        @{ Name="Explosive HIIT Circuit"; Desc="Fast-paced HIIT workout to maximize fat loss."; Diff=5; Target="Full Body"; Days=3; Dur=30 },
        @{ Name="Leg Strength Builder"; Desc="Workout focusing on hamstrings, quads, and calves."; Diff=4; Target="Lower Body"; Days=4; Dur=55 },
        @{ Name="Flexibility Booster Yoga"; Desc="Yoga-based routine to improve flexibility and posture."; Diff=2; Target="Flexibility"; Days=5; Dur=40 },
        @{ Name="Quick Sweat Session"; Desc="Short but intense workout to break a sweat quickly."; Diff=3; Target="Full Body"; Days=6; Dur=20 }
    )

    foreach ($w in $workouts) {
        $cmd = $conn.CreateCommand()
        $cmd.CommandText = "INSERT INTO Workouts (WorkoutName, Description, DifficultyLevel, CreatedAt, TargetArea, DaysPerWeek, AverageWorkoutDurationInMinutes) VALUES (@Name, @Desc, @Diff, GETUTCDATE(), @Target, @Days, @Dur)"
        $cmd.Parameters.AddWithValue("@Name", $w.Name) | Out-Null
        $cmd.Parameters.AddWithValue("@Desc", $w.Desc) | Out-Null
        $cmd.Parameters.AddWithValue("@Diff", $w.Diff) | Out-Null
        $cmd.Parameters.AddWithValue("@Target", $w.Target) | Out-Null
        $cmd.Parameters.AddWithValue("@Days", $w.Days) | Out-Null
        $cmd.Parameters.AddWithValue("@Dur", $w.Dur) | Out-Null
        
        $res = $cmd.ExecuteNonQuery()
        Write-Host "Inserted: $($w.Name) - Result: $res"
    }
} catch {
    Write-Error $_
} finally {
    $conn.Close()
}
