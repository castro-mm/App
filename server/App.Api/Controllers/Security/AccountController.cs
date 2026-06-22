using System.Security.Claims;
using App.Api.Helpers;
using App.Core.Interfaces.Services.Security;
using App.Core.Interfaces.Services.System;
using App.Core.Objects;
using App.Infrastructure.Objects.Requests;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers.Security;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IIdentityService _identityService;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _env;

    public AccountController(
        IIdentityService identityService,
        IEmailService emailService,
        IConfiguration configuration,
        IWebHostEnvironment env)
    {
        _identityService = identityService;
        _emailService = emailService;
        _configuration = configuration;
        _env = env;
    }

    #region [ Autenticação ]

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var userId = await _identityService.RegisterUserAsync(request.Email, request.Password, request.NomeCompleto);

        if (!_identityService.ValidationResult.IsValid)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        var token = await _identityService.GenerateEmailConfirmationTokenAsync(userId);

        var clientBaseUrl = _configuration["App:ClientBaseUrl"];
        var appName = _configuration["App:Name"] ?? "App";
        var confirmLink = $"{clientBaseUrl}/secure/confirm-email?email={Uri.EscapeDataString(request.Email)}&token={Uri.EscapeDataString(token)}";

        var body = EmailTemplates.ConfirmEmail(request.NomeCompleto, confirmLink, appName);

        await _emailService.SendEmailAsync(request.Email, $"Confirmação de E-mail - {appName}", body);

        return Ok(Result.Successful(new { UserId = userId }, "Conta criada com sucesso! Verifique seu e-mail para ativá-la."));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _identityService.LoginUserAsync(request.Email, request.Password);

        if (!_identityService.ValidationResult.IsValid)
            return Unauthorized(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful(new { Token = token }));
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_configuration["Google:ClientId"]]
            };
            payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
        }
        catch
        {
            return Unauthorized(Result.Failure([new ValidationError("TOKEN_INVALIDO", "Token do Google inválido ou expirado.")]));
        }

        var token = await _identityService.LoginWithExternalProviderAsync("Google", payload.Subject, payload.Email, payload.Name);

        if (!_identityService.ValidationResult.IsValid)
            return Unauthorized(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful(new { Token = token }));
    }

    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = GetCurrentUserId();
        if (!_identityService.ValidationResult.IsValid)
            return Unauthorized(Result.Failure(_identityService.ValidationResult.Errors));

        var result = await _identityService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Senha alterada com sucesso."));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var token = await _identityService.GeneratePasswordResetTokenAsync(request.Email);

        // Por segurança, sempre retorna a mesma mensagem, mesmo se o e-mail não existir
        if (string.IsNullOrEmpty(token))
            return Ok(Result.Successful("Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."));

        var clientBaseUrl = _configuration["App:ClientBaseUrl"];
        var appName = _configuration["App:Name"] ?? "App";
        var resetLink = $"{clientBaseUrl}/secure/reset-password?email={Uri.EscapeDataString(request.Email)}&token={Uri.EscapeDataString(token)}";

        if (_env.IsDevelopment())
            return Ok(Result.Successful(new { resetLink }, "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."));

        var body = EmailTemplates.ForgotPassword(resetLink, appName);

        await _emailService.SendEmailAsync(request.Email, $"Recuperação de Senha - {appName}", body);

        return Ok(Result.Successful("Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _identityService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Senha redefinida com sucesso."));
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
    {
        var result = await _identityService.ConfirmEmailAsync(email, token);

        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("E-mail confirmado com sucesso!"));
    }

    #endregion

    #region [ Usuario Autenticado ]

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        if (userId == 0) 
            _identityService.ValidationResult.AddError("USUARIO_NAO_AUTENTICADO", "Usuário não autenticado.");
        
        if (!_identityService.ValidationResult.IsValid)
            return Unauthorized(Result.Failure(_identityService.ValidationResult.Errors));

        // TODO: Avaliar se o Result pode ser aplicado no middleware do request da api para evitar a declaração do Result em todos os controllers

        var user = await _identityService.GetCurrentUserAsync(userId);

        if (user == null)
            _identityService.ValidationResult.AddError("USUARIO_NAO_ENCONTRADO", "Usuário não encontrado.");
        
        if (!_identityService.ValidationResult.IsValid)
            return NotFound(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful(user));
    }

    [Authorize]
    [HttpPut("me/photo")]
    public async Task<IActionResult> UpdatePhoto([FromBody] UpdatePhotoRequest request)
    {
        var userId = GetCurrentUserId();
        if (!_identityService.ValidationResult.IsValid)
            return Unauthorized(Result.Failure(_identityService.ValidationResult.Errors));

        var result = await _identityService.UpdateUserPhotoAsync(userId, request.FotoUrl);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Foto de perfil atualizada com sucesso."));
    }

    [Authorize]
    [HttpDelete("me/photo")]
    public async Task<IActionResult> RemovePhoto()
    {
        var userId = GetCurrentUserId();
        if (!_identityService.ValidationResult.IsValid)
            return Unauthorized(Result.Failure(_identityService.ValidationResult.Errors));

        var result = await _identityService.RemoveUserPhotoAsync(userId);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Foto de perfil removida com sucesso."));
    }

    #endregion    


    #region [ Gestão de Usuários (Admin) ]

    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<ActionResult> GetAllUsers()
    {
        var users = await _identityService.GetAllUsersAsync();
        return Ok(Result.Successful(users));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users/{id}")]
    public async Task<ActionResult> GetUserById(int id)
    {
        var user = await _identityService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(Result.Failure(_identityService.ValidationResult.Errors, "Usuário não encontrado."));

        return Ok(Result.Successful(user));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("users/{id}")]
    public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        var result = await _identityService.UpdateUserAsync(id, request.NomeCompleto, request.Email, request.Role, request.IsActive);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Usuário atualizado com sucesso."));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("users/{id}/role")]
    public async Task<ActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleRequest request)
    {
        var result = await _identityService.UpdateUserRoleAsync(id, request.Role);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Função do usuário atualizada com sucesso."));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("users/{id}/deactivate")]
    public async Task<ActionResult> DeactivateUser(int id)
    {
        var result = await _identityService.DeactivateUserAsync(id);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Usuário desativado com sucesso."));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("users/{id}/activate")]
    public async Task<ActionResult> ActivateUser(int id)
    {
        var result = await _identityService.ActivateUserAsync(id);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Usuário ativado com sucesso."));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("users/{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var result = await _identityService.DeleteUserAsync(id);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Usuário excluído com sucesso."));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("users/{id}/admin-reset-password")]
    public async Task<ActionResult> AdminResetPassword(int id)
    {
        var user = await _identityService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(Result.Failure(_identityService.ValidationResult.Errors, "Usuário não encontrado."));

        var token = await _identityService.AdminResetPasswordAsync(user.Email);
        if (string.IsNullOrEmpty(token))
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        var clientBaseUrl = _configuration["App:ClientBaseUrl"];
        var appName = _configuration["App:Name"] ?? "App";
        var resetLink = $"{clientBaseUrl}/secure/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";

        if (_env.IsDevelopment())
            return Ok(Result.Successful(new { resetLink }, "E-mail de redefinição de senha enviado com sucesso."));

        var body = EmailTemplates.AdminResetPassword(user.NomeCompleto, resetLink, appName);

        await _emailService.SendEmailAsync(user.Email, $"Redefinição de Senha - {appName}", body);

        return Ok(Result.Successful("E-mail de redefinição de senha enviado com sucesso."));
    }

    #endregion

    #region [ Gestão de Roles (Admin) ]

    [Authorize(Roles = "Admin")]
    [HttpGet("roles")]
    public async Task<ActionResult> GetAllRoles()
    {
        var roles = await _identityService.GetAllRolesAsync();
        return Ok(Result.Successful(roles));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("roles/{id}")]
    public async Task<ActionResult> GetRoleById(int id)
    {
        var role = await _identityService.GetRoleByIdAsync(id);
        if (role == null)
            return NotFound(Result.Failure(_identityService.ValidationResult.Errors, "Perfil não encontrado."));

        return Ok(Result.Successful(role));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("roles")]
    public async Task<ActionResult> CreateRole([FromBody] CreateRoleRequest request)
    {
        var currentUserId = GetCurrentUserId();
        if (!_identityService.ValidationResult.IsValid)
            return Unauthorized(Result.Failure(_identityService.ValidationResult.Errors));

        var currentUser = await _identityService.GetCurrentUserAsync(currentUserId);
        var criadoPor = currentUser?.NomeCompleto ?? "Sistema";

        var roleId = await _identityService.CreateRoleAsync(request.Name, criadoPor);
        if (!_identityService.ValidationResult.IsValid)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful(new { Id = roleId }, "Perfil criado com sucesso."));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("roles/{id}")]
    public async Task<ActionResult> UpdateRole(int id, [FromBody] UpdateRoleRequest request)
    {
        var result = await _identityService.UpdateRoleAsync(id, request.Name);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Perfil atualizado com sucesso."));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("roles/{id}")]
    public async Task<ActionResult> DeleteRole(int id)
    {
        var result = await _identityService.DeleteRoleAsync(id);
        if (!result)
            return BadRequest(Result.Failure(_identityService.ValidationResult.Errors));

        return Ok(Result.Successful("Perfil excluído com sucesso."));
    }

    #endregion

    #region [ Métodos Privados ]

    private int GetCurrentUserId()
    {
        var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userId = int.TryParse(userClaim, out var id) ? id : 0;

        if (userId == 0)
            _identityService.ValidationResult.AddError("USUARIO_NAO_AUTENTICADO", "Usuário não autenticado.");

        return userId;
    }

    #endregion
}

