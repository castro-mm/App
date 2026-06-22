using App.Core.Specifications.Base;

namespace App.Core.Specifications.Params;

/// <summary>
/// Params modelo. Adicione as propriedades de filtro da sua entidade.
/// </summary>
public class ExemploParams : SpecificationParams
{
    public string? Nome { get; set; }
}
