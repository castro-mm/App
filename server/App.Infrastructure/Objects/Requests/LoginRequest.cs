namespace App.Infrastructure.Objects.Requests;

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}
