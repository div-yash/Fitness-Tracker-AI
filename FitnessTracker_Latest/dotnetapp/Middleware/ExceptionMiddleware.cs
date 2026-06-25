using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using dotnetapp.Exceptions;
using dotnetapp.Models;

namespace dotnetapp.Middleware
{
    public class ExceptionMiddleware : IMiddleware
    {
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger,IHostEnvironment env){
            _logger=logger;
            _env=env;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try{
                await next(context);
            }
            catch(Exception ex){
                _logger.LogError(ex,"Error occured. TraceId:{TraceId}",
                context.TraceIdentifier);
                
                if(context.Response.HasStarted){
                    _logger.LogWarning("Response has already started; cannot write error response. TraceId:{TraceId}",context.TraceIdentifier);
                    return;
                }

                context.Response.ContentType="application/json";

                context.Response.StatusCode=ex switch{
                    WorkoutNotFoundException => StatusCodes.Status404NotFound, 
                    ArgumentException => StatusCodes.Status400BadRequest,
                    UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                    _ =>StatusCodes.Status500InternalServerError 
                };

                var response=new ApiErrorResponse{
                    Message=ex.Message,
                    Details= _env.IsDevelopment() ? ex.StackTrace:null,
                    TraceId=context.TraceIdentifier
            };

            var jsonOptions=new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response,jsonOptions)
            );
        }
    }
    private static void WriteToDailyLogFile(
        IWebHostEnvironment env,
        HttpContext context,
        Exception ex,
        int statusCode
    ){
        try{
            var logFolder=Path.Combine(env.ContentRootPath,"CustomErrorLogs");
            Directory.CreateDirectory(logFolder);

            var projectName=env.ApplicationName;
            var datePart=DateTime.Now.ToString("yyyy_MM_dd");
            var fileName=$"{projectName}_{datePart}.log";
            var filePath=Path.Combine(logFolder,fileName);

            var sb=new StringBuilder();

            sb.AppendLine("........................:/");
            sb.AppendLine($"DateTime     : {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
            sb.AppendLine($"StatusCode   : {statusCode}");
            sb.AppendLine($"Method       : {context.Request.Method}");
            sb.AppendLine($"Path         : {context.Request.Path}");
            sb.AppendLine($"QueryString  : {context.Request.QueryString}");
            sb.AppendLine($"TraceId      : {context.TraceIdentifier}");
            sb.AppendLine($"Exception    : {ex.GetType().FullName}");
            sb.AppendLine($"Message      : {ex.Message}");
            sb.AppendLine(ex.StackTrace);
            if(ex.InnerException!=null){
                sb.AppendLine("InnerException: ");
                sb.AppendLine(ex.InnerException.ToString());
            }
            sb.AppendLine("................:/");
            sb.AppendLine();

            File.AppendAllText(filePath, sb.ToString());
        }
        catch{
            
        }
    }
}
}