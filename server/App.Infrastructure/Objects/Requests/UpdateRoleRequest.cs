namespace App.Infrastructure.Objects.Requests;

public class UpdateRoleRequest
{
    public int Id { get; set; }
    public required string Name { get; set; }
}
