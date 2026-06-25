using AutoMapper;
using dotnetapp.Dtos;
using dotnetapp.Models;

namespace dotnetapp.AutoMapper
{
    public class MappingProfile:Profile
    {
        public MappingProfile(){
            CreateMap<WorkoutRequest,WorkoutRequestDtos>().ReverseMap();

            CreateMap<Feedback,FeedbackDtos>();
            CreateMap<FeedbackDtos,Feedback>();

            CreateMap<WorkoutRequest,WorkoutRequestDtos>().ReverseMap();
            CreateMap<Workout,WorkoutDtos>().ReverseMap();
        }
    }
}