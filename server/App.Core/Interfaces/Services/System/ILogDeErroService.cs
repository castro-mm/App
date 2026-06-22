using App.Core.Dtos.System;
using App.Core.Entities.System;

namespace App.Core.Interfaces.Services.System;

public interface ILogDeErroService : IService<LogDeErroDto, LogDeErro>
{
    Task<LogDeErroDto> GetLogByTraceIdAsync(string traceId, CancellationToken cancellationToken);
}

