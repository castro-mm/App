using App.Core.Entities;
using App.Core.Entities.System;
using App.Core.Entities.System.Security;
using App.Infrastructure.Interceptors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Data;

public class ModeloContext : IdentityDbContext<
    ApplicationUser, 
    ApplicationRole, 
    int, 
    IdentityUserClaim<int>, 
    ApplicationUserRole, 
    IdentityUserLogin<int>, 
    IdentityRoleClaim<int>, 
    IdentityUserToken<int>
    >
{
    private readonly AuditSaveChangesInterceptor _auditInterceptor;

    public ModeloContext(DbContextOptions<ModeloContext> options, AuditSaveChangesInterceptor auditInterceptor) : base(options)
    {
        _auditInterceptor = auditInterceptor;
    }

    #region [ System ]

    public DbSet<TrilhaDeAuditoria> TrilhasDeAuditoria { get; set; } 
    public DbSet<LogDeErro> LogsDeErro { get; set; }
    public DbSet<Arquivo> Arquivos { get; set; }

    #endregion

    #region [ Entities ]

    public DbSet<Exemplo> Exemplos { get; set; }

    // Adicione aqui os DbSets das entidades do seu domínio
    // Exemplo: public DbSet<MinhaEntidade> MinhasEntidades { get; set; }

    #endregion

    override protected void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ModeloContext).Assembly);
    }

    override protected void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.AddInterceptors(_auditInterceptor);
    }
}
