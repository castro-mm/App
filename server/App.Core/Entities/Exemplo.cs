using App.Core.Dtos;
using App.Core.Entities.Base;
using App.Core.Interfaces;
using App.Core.Mappings;

namespace App.Core.Entities;

/// <summary>
/// Entidade modelo. Renomeie para o nome real da sua entidade.
/// </summary>
public class Exemplo : Entity, IConvertibleToDto<ExemploDto>
{
    public required string Nome { get; set; }
    public string? Descricao { get; set; }

    public void ConvertFromDto(ExemploDto dto) => this.FromDto(dto);
    public ExemploDto ConvertToDto() => this.ToDto();
}
