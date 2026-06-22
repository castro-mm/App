using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers;

public class FallbackController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/html");
    }
}
