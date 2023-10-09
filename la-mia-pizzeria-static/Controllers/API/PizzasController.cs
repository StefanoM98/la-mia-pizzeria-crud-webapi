using la_mia_pizzeria_static.Database;
using la_mia_pizzeria_static.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace la_mia_pizzeria_static.Controllers.API
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PizzasController : ControllerBase
    {


        [HttpGet]
        public IActionResult GetPizze()
        {
            using (PizzaContext db = new PizzaContext())
            {
                List<Pizza> pizze = db.Pizze.Include(pizza => pizza.Gusti).ToList();

                return Ok(pizze);
            }
        }
        
        public IActionResult SearchPizze(string? cerca)
        {
            if (cerca == null)
            {
                return BadRequest(new { Message = "Manca la stringa per la ricerca" });
            }

            using (PizzaContext db = new PizzaContext())
            {
                List<Pizza> pizzeTrovate = db.Pizze.Where(pizza=> pizza.Name.ToLower().Contains(cerca.ToLower())).ToList();

                return Ok(pizzeTrovate);
            }
        }

    }
}
