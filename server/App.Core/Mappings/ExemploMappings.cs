using App.Core.Dtos;
using App.Core.Entities;

namespace App.Core.Mappings;

public static class ExemploMappings
{
    public static Exemplo ToEntity(this ExemploDto dto)
    {
        ArgumentNullException.ThrowIfNull(dto, nameof(dto));

        return new Exemplo
        {
            Id = dto.Id,
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            DataDeCriacao = dto.DataDeCriacao,
            DataDeAtualizacao = dto.DataDeAtualizacao,
            UserId = dto.UserId,
            User = null!
        };
    }

    public static ExemploDto ToDto(this Exemplo entity)
    {
        ArgumentNullException.ThrowIfNull(entity, nameof(entity));

        return new ExemploDto
        {
            Id = entity.Id,
            Nome = entity.Nome,
            Descricao = entity.Descricao,
            DataDeCriacao = entity.DataDeCriacao,
            DataDeAtualizacao = entity.DataDeAtualizacao,
            UserId = entity.UserId,
        };
    }

    public static void FromDto(this Exemplo entity, ExemploDto dto)
    {
        ArgumentNullException.ThrowIfNull(entity, nameof(entity));
        ArgumentNullException.ThrowIfNull(dto, nameof(dto));

        entity.Nome = dto.Nome;
        entity.Descricao = dto.Descricao;
        entity.DataDeAtualizacao = dto.DataDeAtualizacao;
        entity.UserId = dto.UserId;
    }
}
