namespace App.Api.Helpers;

public static class EmailTemplates
{
    private const string PrimaryColor = "#4F6EF7";
    private const string PrimaryDark  = "#3B5BDB";
    private const string TextMain     = "#1f2937";
    private const string TextMuted    = "#6b7280";
    private const string Background   = "#f3f4f6";
    private const string CardBg       = "#ffffff";
    private const string BorderColor  = "#e5e7eb";

    public static string ConfirmEmail(string nomeCompleto, string confirmLink, string appName) =>
        Base(appName,
            title: "Confirme seu e-mail",
            iconSvg: IconCheck,
            heading: "Bem-vindo ao " + appName + "!",
            intro: $"Olá, <strong>{nomeCompleto}</strong>",
            message: "Obrigado por criar sua conta. Para começar a usar o sistema, confirme seu endereço de e-mail clicando no botão abaixo.",
            buttonLabel: "Confirmar meu e-mail",
            buttonLink: confirmLink,
            warning: "Se você não criou esta conta, ignore este e-mail com segurança.");

    public static string ForgotPassword(string forgotPasswordLink, string appName) =>
        Base(appName,
            title: "Redefinição de senha",
            iconSvg: IconLock,
            heading: "Redefinição de senha",
            intro: "Olá,",
            message: "Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha. Este link é válido por <strong>24 horas</strong>.",
            buttonLabel: "Redefinir minha senha",
            buttonLink: forgotPasswordLink,
            warning: "Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanece a mesma.");

    public static string AdminResetPassword(string nomeCompleto, string resetLink, string appName) =>
        Base(appName,
            title: "Redefinição de senha",
            iconSvg: IconLock,
            heading: "Sua senha foi redefinida",
            intro: $"Olá, <strong>{nomeCompleto}</strong>",
            message: "O administrador do sistema solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha.",
            buttonLabel: "Criar nova senha",
            buttonLink: resetLink,
            warning: "Se você não reconhece esta solicitação, entre em contato com o administrador do sistema imediatamente.");

    private static string Base(
        string appName,
        string title,
        string iconSvg,
        string heading,
        string intro,
        string message,
        string buttonLabel,
        string buttonLink,
        string warning) => $@"<!DOCTYPE html>
<html lang=""pt-BR"">
<head>
  <meta charset=""UTF-8"" />
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
  <title>{title}</title>
</head>
<body style=""margin:0;padding:0;background-color:{Background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;"">
  <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:{Background};padding:40px 16px;"">
    <tr>
      <td align=""center"">
        <table width=""560"" cellpadding=""0"" cellspacing=""0"" style=""max-width:560px;width:100%;"">

          <!-- Header -->
          <tr>
            <td align=""center"" style=""padding-bottom:24px;"">
              <table cellpadding=""0"" cellspacing=""0"" border=""0"" style=""display:inline-table;"">
                <tr>
                  <td style=""vertical-align:middle;padding-right:10px;"">
                    <svg width=""40"" height=""40"" viewBox=""0 0 512 512"" xmlns=""http://www.w3.org/2000/svg"">
                      <rect width=""512"" height=""512"" rx=""96"" fill=""#4F6EF7""/>
                      <path d=""M140 256C140 180 196 128 268 128C310 128 344 142 372 170L330 204C314 188 292 180 268 180C224 180 192 212 192 256C192 300 224 332 268 332C292 332 314 324 330 308L372 342C344 370 310 384 268 384C196 384 140 332 140 256Z"" fill=""white""/>
                      <rect x=""210"" y=""250"" width=""28"" height=""60"" rx=""8"" fill=""white""/>
                      <rect x=""250"" y=""220"" width=""28"" height=""90"" rx=""8"" fill=""white""/>
                      <rect x=""290"" y=""190"" width=""28"" height=""120"" rx=""8"" fill=""white""/>
                    </svg>
                  </td>
                  <td style=""vertical-align:middle;"">
                    <span style=""font-size:20px;font-weight:700;color:{TextMain};letter-spacing:-0.5px;"">{appName}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style=""background-color:{CardBg};border-radius:12px;border:1px solid {BorderColor};overflow:hidden;"">

              <!-- Card top bar -->
              <table width=""100%"" cellpadding=""0"" cellspacing=""0"">
                <tr>
                  <td style=""background-color:{PrimaryColor};height:5px;""></td>
                </tr>
              </table>

              <!-- Card body -->
              <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""padding:40px 40px 32px;"">

                <!-- Icon -->
                <tr>
                  <td align=""center"" style=""padding-bottom:24px;"">
                    <div style=""display:inline-block;background-color:#EEF2FF;border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;"">
                      {iconSvg}
                    </div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align=""center"" style=""padding-bottom:8px;"">
                    <h1 style=""margin:0;font-size:22px;font-weight:700;color:{TextMain};"">{heading}</h1>
                  </td>
                </tr>

                <!-- Intro -->
                <tr>
                  <td align=""center"" style=""padding-bottom:16px;"">
                    <p style=""margin:0;font-size:15px;color:{TextMain};"">{intro}</p>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style=""padding-bottom:32px;"">
                    <p style=""margin:0;font-size:15px;line-height:1.6;color:{TextMuted};text-align:center;"">{message}</p>
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align=""center"" style=""padding-bottom:32px;"">
                    <a href=""{buttonLink}""
                       style=""display:inline-block;background-color:{PrimaryColor};color:#ffffff;font-size:15px;font-weight:600;
                              text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.2px;"">
                      {buttonLabel}
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style=""border-top:1px solid {BorderColor};padding-top:24px;"">
                    <p style=""margin:0;font-size:13px;color:{TextMuted};text-align:center;"">
                      {warning}
                    </p>
                  </td>
                </tr>

                <!-- Link fallback -->
                <tr>
                  <td style=""padding-top:20px;"">
                    <p style=""margin:0;font-size:12px;color:{TextMuted};text-align:center;"">
                      Se o botão não funcionar,
                      <a href=""{buttonLink}"" style=""color:{PrimaryColor};font-size:12px;"">clique aqui</a>
                      para acessar o link diretamente.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align=""center"" style=""padding-top:28px;"">
              <p style=""margin:0;font-size:12px;color:{TextMuted};"">
                &copy; {DateTime.UtcNow.Year} {appName}. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>";

    private const string IconCheck = @"<svg width=""28"" height=""28"" viewBox=""0 0 24 24"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"" style=""vertical-align:middle;"">
      <path d=""M5 13l4 4L19 7"" stroke=""#4F6EF7"" stroke-width=""2.5"" stroke-linecap=""round"" stroke-linejoin=""round""/>
    </svg>";

    private const string IconLock = @"<svg width=""28"" height=""28"" viewBox=""0 0 24 24"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"" style=""vertical-align:middle;"">
      <rect x=""3"" y=""11"" width=""18"" height=""11"" rx=""2"" stroke=""#4F6EF7"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""/>
      <path d=""M7 11V7a5 5 0 0 1 10 0v4"" stroke=""#4F6EF7"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round""/>
    </svg>";
}
