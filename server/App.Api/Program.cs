using App.Api.Extensions;
using App.Api.Middleware;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddInterceptorsServices();
builder.Services.AddDatabaseServices(builder);
builder.Services.AddMappingServices();
builder.Services.AddControllersServices();
builder.Services.AddBusinessServices();
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddEmailServices(builder.Configuration);

builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext();
});

var app = builder.Build();

// Modo seed: usado pelo pipeline CI/CD para popular o banco sem subir o servidor web
if (args.Contains("--seed"))
{
    await app.SeedIdentityAsync();
    return;
}

// Seed de Roles e Admin padrão no startup (fallback para desenvolvimento)
try
{
    await app.SeedIdentityAsync();
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Erro ao executar o seed de identidade na inicialização.");
}

// Configure the HTTP request pipeline.

// Necessário para que UseHttpsRedirection funcione corretamente atrás do proxy do Azure App Service
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseMiddleware<RequestApiMiddleware>();
app.UseHttpsRedirection();
app.UseSerilogRequestLogging();

app.UseCors(x => x.AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .WithOrigins(
                      "http://localhost:4200",
                      "https://localhost:4200",
                      "https://controledecontas.azurewebsites.net"
                  ));

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

app.Run();