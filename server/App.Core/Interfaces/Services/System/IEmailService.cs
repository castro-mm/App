namespace App.Core.Interfaces.Services.System;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}
