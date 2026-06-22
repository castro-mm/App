using App.Api.Controllers.Base;
using App.Api.Objects;
using App.Core.Businesses.Validators.Interfaces;
using App.Core.Dtos;
using App.Core.Entities;
using App.Core.Interfaces.Services;
using App.Core.Interfaces.Services.Security;
using App.Core.Objects;
using App.Core.Specifications;
using App.Core.Specifications.Params;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers;

/// <summary>
/// Controller modelo. Renomeie e adapte para sua entidade.
/// </summary>
public class ExemploController : BaseApiController<ExemploDto, Exemplo>
{
    private readonly IExemploService _service;
    private readonly IExemploValidator _validator;
    private readonly ICurrentUserService _currentUserService;

    public ExemploController(
        IExemploService service,
        IExemploValidator validator,
        ICurrentUserService currentUserService) : base(service, validator)
    {
        _service = service;
        _validator = validator;
        _currentUserService = currentUserService;
    }

    [HttpGet("get-by-params")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult> GetAsync([FromQuery] ExemploParams specParams, CancellationToken cancellationToken)
    {
        var validationResult = new ValidationResult();

        if (specParams == null)
        {
            validationResult.AddError("PARAMETROS_NAO_INFORMADOS", "Os parâmetros de consulta não foram informados.");
            return BadRequest(Result.Failure(validationResult.Errors));
        }

        var spec = new ExemploSpecification(specParams, _currentUserService);
        var pagedResult = await _service.GetPagedResultWithSpecAsync(spec, specParams.PageIndex, specParams.PageSize, cancellationToken);

        if (pagedResult == null || !pagedResult.Items.Any())
        {
            validationResult.AddError("REGISTROS_NAO_ENCONTRADOS", "Nenhum registro encontrado com os parâmetros informados.");
            return NotFound(Result.Failure(validationResult.Errors));
        }

        return Ok(Result.Successful(pagedResult));
    }
}
