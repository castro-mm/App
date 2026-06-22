using App.Core.Dtos.System;
using App.Core.Entities.System;
using Microsoft.AspNetCore.Http;

namespace App.Core.Interfaces.Services.System;

public interface IArquivoService : IService<ArquivoDto, Arquivo>
{
    Task<ArquivoDto> SaveFileAsync(IFormFile file, DateTime dataDaUltimaModificacao, CancellationToken cancellationToken);
}
