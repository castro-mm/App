using App.Core.Entities.System.Security;

namespace App.Core.Entities.Base;

public class Entity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime DataDeCriacao { get; set; }
    public DateTime DataDeAtualizacao { get; set; }

    public required virtual ApplicationUser User { get; set; }

}
