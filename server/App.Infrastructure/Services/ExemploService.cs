using App.Core.Dtos;
using App.Core.Entities;
using App.Core.Interfaces.Repositories;
using App.Core.Interfaces.Services;
using App.Core.Interfaces.Services.Security;
using App.Infrastructure.Services.Base;

namespace App.Infrastructure.Services;

/// <summary>
/// Service modelo. Renomeie e adicione métodos específicos do domínio.
/// </summary>
public class ExemploService : Service<ExemploDto, Exemplo>, IExemploService
{
    public ExemploService(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
        : base(unitOfWork, currentUserService)
    {
    }

    // Adicione aqui métodos específicos quando necessário
}
