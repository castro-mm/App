using App.Core.Entities.System.Security;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using AppDbContext = App.Infrastructure.Data.ModeloContext;

namespace App.Api.Extensions;

public static class IdentityServicesExtensions
{
    const string adminEmail = "castro.mm@yahoo.com";
    const string adminPassword = "Admin@123";
    const string adminName = "Marcelo Moura de Castro";

    public static void AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Desabilitar o mapeamento automático de claims do JWT
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        services
            .AddIdentity<ApplicationUser, ApplicationRole>(
                options =>
                {
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 8;
                    options.Password.RequireNonAlphanumeric = true;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = true;
                    options.User.RequireUniqueEmail = true;
                    options.SignIn.RequireConfirmedEmail = true;

                    // Configurar token providers para reset de senha
                    options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultProvider;
                }
            )
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),
                    ClockSkew = TimeSpan.Zero
                };
            });
    }

    public static async Task SeedIdentityAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<WebApplication>>();

        var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        // Seed roles
        string[] roles = [ "Admin", "User" ];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var roleResult = await roleManager.CreateAsync(new ApplicationRole 
                { 
                    Name = role,
                    CriadoPor = adminName,
                    DataDeCriacao = DateTime.Now,
                    DataDeAtualizacao = DateTime.Now
                });

                if (roleResult.Succeeded)
                    logger.LogInformation("Role '{Role}' criada com sucesso.", role);
                else
                    logger.LogError("Falha ao criar role '{Role}': {Errors}", role, string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            }
        }

        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                NomeCompleto = adminName,
                IsActive = true,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                logger.LogInformation("Usuário admin criado com sucesso.");
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
            else
            {
                logger.LogError("Falha ao criar usuário admin: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
        else
        {
            logger.LogInformation("Usuário admin já existe, seed ignorado.");
        }
    }
}