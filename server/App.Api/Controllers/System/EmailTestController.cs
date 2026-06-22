using App.Core.Interfaces.Services.System;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers.System;

[Route("api/[controller]")]
[ApiController]
public class EmailTestController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailTestController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost]
    public async Task<IActionResult> Send([FromBody] EmailTestRequest request)
    {
        await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
        return Ok(new { message = "E-mail enviado com sucesso." });
    }
}

public record EmailTestRequest(string To, string Subject, string Body);
