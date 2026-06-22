using Azure;
using Azure.Communication.Email;
using App.Core.Interfaces.Services.System;
using App.Infrastructure.Objects;
using Microsoft.Extensions.Options;

namespace App.Infrastructure.Services.System;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var client = new EmailClient(_settings.ConnectionString);

        var emailMessage = new EmailMessage(
            senderAddress: _settings.Sender,
            content: new EmailContent(subject)
            {
                Html = body
            },
            recipients: new EmailRecipients(
                new List<EmailAddress>
                {
                    new EmailAddress(to)
                }));

        await client.SendAsync(WaitUntil.Completed, emailMessage);
    }
}
