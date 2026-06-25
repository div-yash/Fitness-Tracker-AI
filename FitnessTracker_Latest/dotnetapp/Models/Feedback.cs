using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Feedback
    {
        public int FeedbackId {get;set;}
        public int UserId {get;set;}
        public User? User {get;set;}
        public string FeedbackText {get;set;}
        public DateTime Date {get;set;}
    }
}