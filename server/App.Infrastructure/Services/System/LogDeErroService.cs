using App.Core.Dtos.System;
using App.Core.Entities.System;
using App.Core.Interfaces.Repositories;
using App.Core.Interfaces.Services.Security;
using App.Core.Interfaces.Services.System;
using App.Infrastructure.Services.Base;

namespace App.Infrastructure.Services.System;

public class LogDeErroService : Service<LogDeErroDto, LogDeErro>, ILogDeErroService
{    
    private readonly IUnitOfWork _unitOfWork;

    public LogDeErroService(IUnitOfWork unitOfWork, ICurrentUserService currentUserService) : base(unitOfWork, currentUserService)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<LogDeErroDto> GetLogByTraceIdAsync(string traceId, CancellationToken cancellationToken)
    {
        var logDeErroList = await base.GetAllAsync(cancellationToken);

        if (logDeErroList == null || !logDeErroList.Any())
            return null!;

        var logDeErro = logDeErroList
            .Where(x => x.TraceId.ToString() == traceId)
            .FirstOrDefault();

        return logDeErro ?? null!;
    }
}


