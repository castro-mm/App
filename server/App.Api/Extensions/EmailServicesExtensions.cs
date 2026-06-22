using App.Core.Interfaces.Services.System;
using App.Infrastructure.Objects;
using App.Infrastructure.Services.System;

namespace App.Api.Extensions;

public static class EmailServicesExtensions
{
    public static void AddEmailServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<EmailSettings>(configuration.GetSection("AzureEmail"));
        services.AddScoped<IEmailService, EmailService>();
    }
}
