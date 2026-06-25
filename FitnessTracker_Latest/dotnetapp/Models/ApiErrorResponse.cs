using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Models
{
    public class ApiErrorResponse
    {
        public string Message {get;set;}="";
        public string? Details{get;set;}
        public string TraceId {get;set;}="";
    }
}