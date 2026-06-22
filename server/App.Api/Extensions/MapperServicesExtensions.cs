using App.Core.Interfaces.Repositories;
using App.Core.Interfaces.Services;
using App.Core.Interfaces.Services.Security;
using App.Core.Interfaces.Services.System;
using App.Infrastructure.Data.Repositories;
using App.Infrastructure.Services;
using App.Infrastructure.Services.Security;
using App.Infrastructure.Services.System;

namespace App.Api.Extensions;

public static class MapperServicesExtensions
{
    public static void AddMappingServices(this IServiceCollection services)
    {
        services.AddScoped<IIdentityService, IdentityService>();        
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        services.AddScoped<ILogDeErroService, LogDeErroService>();
        services.AddScoped<ITrilhaDeAuditoriaService, TrilhaDeAuditoriaService>();
        services.AddScoped<IArquivoService, ArquivoService>();

        services.AddScoped<IExemploService, ExemploService>();

        // Adicione aqui os serviços de domínio da sua solução
        // Exemplo: services.AddScoped<IMinhaEntidadeService, MinhaEntidadeService>();
    }
}