using App.Core.Businesses.Validators.Interfaces;
using App.Infrastructure.Services.Businesses.Validators;

namespace App.Api.Extensions;

public static class BusinessServicesExtensions
{
    public static void AddBusinessServices(this IServiceCollection services)
    {
        services.AddScoped<IExemploValidator, ExemploValidator>();

        // Adicione aqui os validators e business rules do seu domínio
        // Exemplo: services.AddScoped<IMinhaEntidadeValidator, MinhaEntidadeValidator>();
    }
}