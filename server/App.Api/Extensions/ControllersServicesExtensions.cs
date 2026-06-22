using System.Text.Json.Serialization;

namespace App.Api.Extensions;

public static class ControllersServicesExtensions
{
    public static void AddControllersServices(this IServiceCollection services)
    {
        services.AddHttpClient();
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });
    }
}
