using App.Infrastructure.Interceptors;

namespace App.Api.Extensions;

public static class InterceptorsServicesExtensions
{
    public static void AddInterceptorsServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<AuditSaveChangesInterceptor>();
    }
}
