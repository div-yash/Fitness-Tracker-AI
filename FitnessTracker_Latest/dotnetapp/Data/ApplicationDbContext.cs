using dotnetapp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<WorkoutRequest> WorkoutRequests { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<User> Users { get; set; }
    }
}