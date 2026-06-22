using App.Core.Entities.System;
using App.Core.Interfaces;
using App.Core.Mappings;

namespace App.Core.Dtos.System;

public class ArquivoDto : IDto, IConvertibleToEntity<Arquivo>
{
    public int Id { get; set; }
    public required string Nome { get; set; }
    public required string Extensao { get; set; }
    public required long Tamanho { get; set; }
    public required string Tipo { get; set; }
    public required byte[] Dados { get; set; }     
    public required DateTime DataDaUltimaModificacao { get; set; }
    public DateTime DataDeCriacao { get; set; }
    public DateTime DataDeAtualizacao { get; set; }
    public int UserId { get; set; }

    Arquivo IConvertibleToEntity<Arquivo>.ConvertToEntity() => this.ToEntity();
}