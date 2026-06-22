using Microsoft.EntityFrameworkCore;
using AppDbContext = App.Infrastructure.Data.ModeloContext;

namespace App.Api.Extensions;

public static class DatabaseServicesExtensions
{
    public static void AddDatabaseServices(this IServiceCollection services, WebApplicationBuilder builder)
    { 
        services.AddDbContext<AppDbContext>(options =>
        {
            options
                .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
                .UseLazyLoadingProxies();
            
            if (builder.Environment.IsDevelopment())
                options.EnableSensitiveDataLogging();
        });
    }
}