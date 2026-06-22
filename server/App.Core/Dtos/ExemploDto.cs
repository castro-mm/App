using App.Core.Entities;
using App.Core.Interfaces;
using App.Core.Mappings;

namespace App.Core.Dtos;

/// <summary>
/// DTO modelo. Renomeie para o nome real do seu DTO.
/// </summary>
public class ExemploDto : IDto, IConvertibleToEntity<Exemplo>
{
    public int Id { get; set; }
    public required string Nome { get; set; }
    public string? Descricao { get; set; }
    public DateTime DataDeCriacao { get; set; } = DateTime.Now;
    public DateTime DataDeAtualizacao { get; set; } = DateTime.Now;
    public int UserId { get; set; }

    public Exemplo ConvertToEntity() => this.ToEntity();
}
