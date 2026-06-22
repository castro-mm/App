using App.Core.Dtos.System;
using App.Core.Entities.System;
using App.Core.Interfaces.Repositories;
using App.Core.Interfaces.Services.Security;
using App.Core.Interfaces.Services.System;
using App.Infrastructure.Services.Base;

namespace App.Infrastructure.Services.System;

public class TrilhaDeAuditoriaService : Service<TrilhaDeAuditoriaDto, TrilhaDeAuditoria>, ITrilhaDeAuditoriaService
{
    private readonly IUnitOfWork _unitOfWork;

    public TrilhaDeAuditoriaService(IUnitOfWork unitOfWork, ICurrentUserService currentUserService) : base(unitOfWork, currentUserService)
    {
        _unitOfWork = unitOfWork;
    }

    // Implement any additional methods specific to TrilhaDeAuditoria if needed
    // For example, you might want to add methods for specific queries or operations
}

