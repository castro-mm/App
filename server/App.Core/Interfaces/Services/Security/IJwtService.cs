using App.Core.Entities.System.Security;

namespace App.Core.Interfaces.Services.Security;

public interface IJwtService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
}
