using App.Core.Businesses.Validators.Interfaces;
using App.Core.Dtos;
using App.Core.Objects;
using App.Infrastructure.Services.Base;
using AppDbContext = App.Infrastructure.Data.ModeloContext;

namespace App.Infrastructure.Services.Businesses.Validators;

/// <summary>
/// Validator modelo. Implemente as regras de validação da sua entidade.
/// </summary>
public class ExemploValidator : Validator<ExemploDto>, IExemploValidator
{
    private readonly AppDbContext _context;
    private ValidationResult validationResult = new();

    public ExemploValidator(AppDbContext context)
    {
        _context = context;
    }

    public override ValidationResult Validate(ExemploDto? dto)
    {
        validationResult = base.Validate(dto);

        if (validationResult.IsValid) SetErrorsConditionally(dto!);

        return validationResult;
    }

    private void SetErrorsConditionally(ExemploDto dto)
    {
        validationResult.AddErrorIf(string.IsNullOrWhiteSpace(dto.Nome), "NOME_OBRIGATORIO", "O nome é obrigatório.");
        validationResult.AddErrorIf(dto.Nome?.Length < 3, "NOME_INVALIDO", "O nome deve ter pelo menos 3 caracteres.");
        validationResult.AddErrorIf(dto.Nome?.Length > 100, "NOME_EXCEDENTE", "O nome não pode exceder 100 caracteres.");

        // Exemplo de validação de unicidade
        validationResult.AddErrorIf(
            _context.Exemplos.Any(e => e.Nome.ToLower() == dto.Nome.ToLower() && (e.Id != dto.Id || dto.Id == 0)),
            "NOME_DUPLICADO",
            "Já existe um registro com este nome."
        );
    }
}
