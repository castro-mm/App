using App.Core.Entities;
using App.Core.Interfaces.Services.Security;
using App.Core.Specifications.Base;
using App.Core.Specifications.Params;

namespace App.Core.Specifications;

/// <summary>
/// Specification modelo. Ajuste os critérios de filtro conforme sua entidade.
/// </summary>
public class ExemploSpecification : Specification<Exemplo>
{
    public ExemploSpecification(ExemploParams specParams, ICurrentUserService currentUserService) : base(specParams)
    {
        AddCriteria(x =>
            (x.Nome.Contains(specParams.Nome ?? string.Empty) || string.IsNullOrEmpty(specParams.Nome)) &&
            (x.UserId == currentUserService.UserId)
        );
    }
}
