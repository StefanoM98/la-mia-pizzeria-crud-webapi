﻿using la_mia_pizzeria_static.Database;
using la_mia_pizzeria_static.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace la_mia_pizzeria_static.Controllers.API
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PizzasController : ControllerBase
    {

        private PizzaContext _myDb;

        public PizzasController(PizzaContext myDb)
        {
            _myDb = myDb;
        }

        [HttpGet]
        public IActionResult GetPizze()
        {

            List<Pizza> pizze = _myDb.Pizze.Include(pizza => pizza.Gusti).ToList();

            return Ok(pizze);

        }


        [HttpGet]
        public IActionResult RicercaPizze(string? cerca)
        {
            if (cerca == null)
            {
                return BadRequest(new { Message = "Manca la stringa per la ricerca" });
            }


            List<Pizza> pizzeTrovate = _myDb.Pizze.Where(pizza => pizza.Name.ToLower().Contains(cerca.ToLower())).ToList();

            return Ok(pizzeTrovate);

        }

        [HttpGet]
        public IActionResult RicercaId(int id)
        {

            Pizza? pizza = _myDb.Pizze.Where(pizza => pizza.Id == id).Include(pizza => pizza.Gusti).FirstOrDefault();

            if (pizza != null)
            {
                return Ok(pizza);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]

        public IActionResult CreaPizza([FromBody] Pizza nuovaPizza)
        {
            try
            {
                _myDb.Pizze.Add(nuovaPizza);

                _myDb.SaveChanges();

                return Ok();
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut ("{id}")]

        public IActionResult ModificaPizza (int id, [FromBody] Pizza pizzaAggiornata)
        {
            Pizza? pizzaModificata = _myDb.Pizze.Where(pizza => pizza.Id == id).FirstOrDefault();

            if(pizzaModificata == null)
            {
                return NotFound();
            }

            pizzaModificata.Name = pizzaAggiornata.Name;
            pizzaModificata.Description = pizzaAggiornata.Description;
            pizzaModificata.Pathimg = pizzaAggiornata.Pathimg;
            pizzaModificata.Price = pizzaAggiornata.Price;
            pizzaModificata.Categoria = pizzaAggiornata.Categoria;
            pizzaModificata.Gusti = pizzaAggiornata.Gusti;

            _myDb.SaveChanges();

            return Ok();
        }

    }
}
