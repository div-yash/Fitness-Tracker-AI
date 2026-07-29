using System.Text;
using dotnetapp.Data;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using DotNetEnv;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using dotnetapp.AutoMapper;
// using dotnetapp.Middleware;
using AutoMapper;
using Serilog;
using dotnetapp.Middleware;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//The connection string is being declared in the environmental file


DotNetEnv.Env.Load();
string JWT_KEY = Environment.GetEnvironmentVariable("JWT_KEY") ?? "bdndfnbfjknvdfvjnvnsdkjnsdclnsdcbcsdcbsj";

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
    });
});


var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "Server=(localdb)\\mssqllocaldb;Database=FitnessTrackerDb;Trusted_Connection=True;MultipleActiveResultSets=true";

// Helper to convert postgres:// URI to connection string if needed
if (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://"))
{
    var databaseUri = new Uri(connectionString);
    var userInfo = databaseUri.UserInfo.Split(':');
    var user = userInfo[0];
    var password = userInfo.Length > 1 ? userInfo[1] : "";
    var host = databaseUri.Host;
    var port = databaseUri.Port == -1 ? 5432 : databaseUri.Port;
    var database = databaseUri.LocalPath.TrimStart('/');
    
    connectionString = $"Host={host};Port={port};Database={database};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (connectionString.Contains("Host=") || connectionString.Contains("Port=") || connectionString.Contains("sslmode="))
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});


builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<WorkoutService>();
builder.Services.AddScoped<FeedbackService>();
builder.Services.AddScoped<WorkoutRequestService>();

builder.Services.AddScoped<IPasswordHasher<ApplicationUser>,PasswordHasher<ApplicationUser>>();

var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new MappingProfile());
});
IMapper mapper = config.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", p => p.RequireRole("Admin"));
    options.AddPolicy("User", p => p.RequireRole("User"));
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{

    c.SwaggerDoc("v1", new OpenApiInfo { Title = "dotnetapp", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
 
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
 
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_KEY)),
 
            ValidateIssuer = !string.IsNullOrWhiteSpace(jwtIssuer),
            ValidIssuer = jwtIssuer,
 
            ValidateAudience = !string.IsNullOrWhiteSpace(jwtAudience),
            ValidAudience = jwtAudience,
 
            ValidateLifetime = true,
            RoleClaimType = ClaimTypes.Role,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddSwaggerGen();

Log.Logger=new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day
        )
        .CreateLogger();
builder.Host.UseSerilog();
builder.Services.AddControllers();
    
builder.Logging.AddLog4Net("log4net.config");
// builder.Services.AddTransient<ExceptionMiddleware>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

// app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication(); 

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        string[] roleNames = { "Admin", "User" };
        foreach (var roleName in roleNames)
        {
            if (!roleManager.RoleExistsAsync(roleName).GetAwaiter().GetResult())
            {
                roleManager.CreateAsync(new IdentityRole(roleName)).GetAwaiter().GetResult();
            }
        }

        var authService = services.GetRequiredService<IAuthService>();

        // Seed Admin user
        var adminEmail = "admin@fitnesstracker.com";
        var adminUser = context.Users.FirstOrDefault(u => u.Email == adminEmail);
        if (adminUser == null)
        {
            var model = new User
            {
                Email = adminEmail,
                Username = "admin",
                Password = "Password123!",
                MobileNumber = "1234567890",
                UserRole = "Admin"
            };
            authService.Registration(model, "Admin").GetAwaiter().GetResult();
        }

        // Seed Standard User
        var userEmail = "user@fitnesstracker.com";
        var standardUser = context.Users.FirstOrDefault(u => u.Email == userEmail);
        if (standardUser == null)
        {
            var model = new User
            {
                Email = userEmail,
                Username = "user",
                Password = "Password123!",
                MobileNumber = "9876543210",
                UserRole = "User"
            };
            authService.Registration(model, "User").GetAwaiter().GetResult();
        }

        // Seed Workouts
        if (!context.Workouts.Any())
        {
            context.Workouts.AddRange(
                new Workout
                {
                    WorkoutName = "Morning Cardio Blast",
                    Description = "High-intensity cardio exercises to burn fat and increase stamina.",
                    DifficultyLevel = 3,
                    CreatedAt = DateTime.UtcNow,
                    TargetArea = "Full Body",
                    DaysPerWeek = 4,
                    AverageWorkoutDurationInMinutes = 45
                },
                new Workout
                {
                    WorkoutName = "Yoga and Flexibility Routine",
                    Description = "Gentle yoga poses and breathing exercises to improve flexibility and mindfulness.",
                    DifficultyLevel = 1,
                    CreatedAt = DateTime.UtcNow,
                    TargetArea = "Flexibility",
                    DaysPerWeek = 3,
                    AverageWorkoutDurationInMinutes = 30
                },
                new Workout
                {
                    WorkoutName = "Strength Training Core",
                    Description = "Targeted weight training focusing on building abdominal and back muscles.",
                    DifficultyLevel = 4,
                    CreatedAt = DateTime.UtcNow,
                    TargetArea = "Core",
                    DaysPerWeek = 5,
                    AverageWorkoutDurationInMinutes = 60
                },
                new Workout
                {
                    WorkoutName = "HIIT Cardio Burner",
                    Description = "Short bursts of intense exercise alternated with low-intensity recovery periods.",
                    DifficultyLevel = 5,
                    CreatedAt = DateTime.UtcNow,
                    TargetArea = "Full Body",
                    DaysPerWeek = 3,
                    AverageWorkoutDurationInMinutes = 40
                }
            );
            context.SaveChanges();
        }

        // Retrieve seeded user and workout for feedback and requests
        var seededUser = context.Users.FirstOrDefault(u => u.Email == userEmail);
        var seededWorkout1 = context.Workouts.FirstOrDefault(w => w.WorkoutName == "Strength Training Core");
        var seededWorkout2 = context.Workouts.FirstOrDefault(w => w.WorkoutName == "Yoga and Flexibility Routine");

        if (seededUser != null && seededWorkout1 != null && seededWorkout2 != null)
        {
            // Seed Feedbacks
            if (!context.Feedbacks.Any())
            {
                context.Feedbacks.AddRange(
                    new Feedback
                    {
                        UserId = seededUser.UserId,
                        FeedbackText = "Great workout plans, really helped me improve my daily core strength!",
                        Date = DateTime.UtcNow.AddDays(-2)
                    },
                    new Feedback
                    {
                        UserId = seededUser.UserId,
                        FeedbackText = "Loved the Yoga and Flexibility routine, the instructions are super clear.",
                        Date = DateTime.UtcNow.AddDays(-1)
                    }
                );
            }

            // Seed WorkoutRequests
            if (!context.WorkoutRequests.Any())
            {
                context.WorkoutRequests.AddRange(
                    new WorkoutRequest
                    {
                        UserId = seededUser.UserId,
                        WorkoutId = seededWorkout1.WorkoutId,
                        Age = 28,
                        BMI = 22.5,
                        Gender = "Male",
                        DietaryPreferences = "Vegetarian",
                        MedicalHistory = "None",
                        RequestedDate = DateTime.UtcNow.AddDays(-3),
                        RequestStatus = "Approved"
                    },
                    new WorkoutRequest
                    {
                        UserId = seededUser.UserId,
                        WorkoutId = seededWorkout2.WorkoutId,
                        Age = 28,
                        BMI = 22.5,
                        Gender = "Male",
                        DietaryPreferences = "Vegetarian",
                        MedicalHistory = "None",
                        RequestedDate = DateTime.UtcNow.AddDays(-1),
                        RequestStatus = "Pending"
                    }
                );
            }
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the DB.");
    }
}

app.Run();

