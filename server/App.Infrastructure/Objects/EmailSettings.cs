namespace App.Infrastructure.Objects;

public class EmailSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string Sender { get; set; } = string.Empty;
}
