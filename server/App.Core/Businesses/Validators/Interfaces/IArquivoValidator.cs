using App.Core.Dtos.System;
using App.Core.Objects;
using Microsoft.AspNetCore.Http;

namespace App.Core.Businesses.Validators.Interfaces;

public interface IArquivoValidator : IValidator<ArquivoDto>
{
    ValidationResult Validate(int id);
    ValidationResult Validate(IFormFile file);
}
