using Microsoft.AspNetCore.Identity;

namespace App.Core.Entities.System.Security;

public class ApplicationUserRole : IdentityUserRole<int>
{
    public virtual required ApplicationUser User { get; set; }
    public virtual required ApplicationRole Role { get; set; }
}