using App.Core.Dtos.System;
using App.Core.Entities.Base;
using App.Core.Interfaces;
using App.Core.Mappings;

namespace App.Core.Entities.System;

public class TrilhaDeAuditoria : Entity, IConvertibleToDto<TrilhaDeAuditoriaDto>
{
    public required string Entidade { get; set; }
    public required string Metodo { get; set; }
    public required string Caminho { get; set; }
    public required string Operacao { get; set; }
    public string? ValoresAntigos { get; set; }
    public string? ValoresNovos { get; set; }
    public required string Ip { get; set; }
    public required string Navegador { get; set; }
    public required string Usuario { get; set; }
    public required Guid TraceId { get; set; }
    public required string Hash { get; set; }

    public TrilhaDeAuditoriaDto ConvertToDto() => this.ToDto();
    public void ConvertFromDto(TrilhaDeAuditoriaDto dto) => this.FromDto(dto);
}
