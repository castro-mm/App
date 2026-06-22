using App.Core.Dtos.System;
using App.Core.Entities.Base;
using App.Core.Interfaces;
using App.Core.Mappings;

namespace App.Core.Entities.System;

public class Arquivo : Entity, IConvertibleToDto<ArquivoDto>
{
    public required string Nome { get; set; }
    public required string Extensao { get; set; }
    public required long Tamanho { get; set; }
    public required string Tipo { get; set; }
    public required byte[] Dados { get; set; } 
    public required DateTime DataDaUltimaModificacao { get; set; }

    public void ConvertFromDto(ArquivoDto dto) => this.FromDto(dto);
    public ArquivoDto ConvertToDto() => this.ToDto();
}

public static class ArquivoExtensions
{
}
