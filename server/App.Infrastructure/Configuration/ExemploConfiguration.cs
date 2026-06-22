using App.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace App.Infrastructure.Configuration;

/// <summary>
/// EF Configuration modelo. Ajuste as propriedades e relacionamentos.
/// </summary>
public class ExemploConfiguration : IEntityTypeConfiguration<Exemplo>
{
    public void Configure(EntityTypeBuilder<Exemplo> builder)
    {
        ConfigureTable(builder);

        builder.Property(e => e.Nome).IsRequired().HasMaxLength(100).HasColumnType("VARCHAR(100)");
        builder.Property(e => e.Descricao).IsRequired(false).HasMaxLength(500).HasColumnType("VARCHAR(500)");
        builder.Property(e => e.DataDeCriacao).IsRequired().HasColumnType("DATETIME2").HasDefaultValueSql("GETDATE()").ValueGeneratedOnAdd();
        builder.Property(e => e.DataDeAtualizacao).IsRequired().HasColumnType("DATETIME2").HasDefaultValueSql("GETDATE()");

        ConfigureRelationships(builder);
    }

    private void ConfigureTable(EntityTypeBuilder<Exemplo> builder)
    {
        builder.ToTable(nameof(Exemplo));
        builder.HasKey(e => e.Id);
    }

    private void ConfigureRelationships(EntityTypeBuilder<Exemplo> builder)
    {
        builder.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
    }
}
