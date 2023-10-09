﻿using la_mia_pizzeria_static.Database;
using la_mia_pizzeria_static.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace la_mia_pizzeria_static.Controllers
{

    [Authorize]
    public class PizzaController : Controller

    {
        private PizzaContext _myDb;

        public PizzaController (PizzaContext db)
        {
            _myDb = db;
        }
        public IActionResult Index()
        {
            using(PizzaContext db = new PizzaContext())
            {
                List<Pizza> pizze = db.Pizze.Include(pizza=>pizza.Categoria).ToList<Pizza>();

                return View("Index", pizze);
             }
        }

        public IActionResult Userindex()
        {
            using (PizzaContext db = new PizzaContext())
            {
                List<Pizza> pizze = db.Pizze.Include(pizza => pizza.Categoria).ToList<Pizza>();

                return View("Userindex", pizze);
            }
        }

        public IActionResult Dettagli(int id)
        {
            using(PizzaContext db = new PizzaContext())
            {
                Pizza? pizzaTrovata = db.Pizze.Where(pizza=>pizza.Id==id).Include(pizza=>pizza.Categoria).Include(pizza=>pizza.Gusti).FirstOrDefault();

                if(pizzaTrovata == null) 
                {
                    return NotFound($"La pizza con {id} non è nel nostro menù");

                } else
                {
                    return View("DettagliPizza", pizzaTrovata);
                }
            }
        }

        [Authorize(Roles = "ADMIN, USER")]

        [HttpGet]
        public IActionResult CreatePizza()
        {
            List<Categoria> categorie = _myDb.Categorie.ToList();

            List<SelectListItem> gustiSelezionati = new List<SelectListItem>();
            
            List<Gusto> gustiNelDb = _myDb.Gusti.ToList();

            foreach(Gusto gusto in gustiNelDb)
            {
                gustiSelezionati.Add(new SelectListItem
                {
                    Text = gusto.Name,
                    Value = gusto.Id.ToString(),
                });
            }

            PizzaFormModel model = new PizzaFormModel {Pizza = new Pizza(), Categorie = categorie, Gusti = gustiSelezionati};

            return View("CreatePizza", model);
        }

        [Authorize(Roles = "ADMIN, USER")]

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CreatePizza(PizzaFormModel data)
        {
            if (!ModelState.IsValid)
            {
                List<Categoria> categorie= _myDb.Categorie.ToList();

                data.Categorie = categorie;

                List<SelectListItem> gustiSelezionati = new List<SelectListItem>();
                List<Gusto> gustiNelDb = _myDb.Gusti.ToList();

                foreach(Gusto gusto in gustiNelDb)
                {
                    gustiSelezionati.Add(new SelectListItem
                    {
                        Text = gusto.Name,
                        Value = gusto.Id.ToString(),
                    });
                }

                data.Gusti = gustiSelezionati;

                return View("CreatePizza", data);
            }

            data.Pizza.Gusti = new List<Gusto>();

            if (data.gustoIdSelezionato != null)
            {
                foreach(string gustoSelezionato in data.gustoIdSelezionato)
                {
                    int intGustoSelezionato = int.Parse(gustoSelezionato);

                    Gusto? gustoInDb = _myDb.Gusti.Where(gusto => gusto.Id == intGustoSelezionato).FirstOrDefault();
                    if (gustoInDb != null)
                    {
                        data.Pizza.Gusti.Add(gustoInDb);
                    }
                }
            }

            if (data.Pizza.Pathimg == null) 
            {
                data.Pizza.Pathimg = "/img/default.jpg";
            }

            
             _myDb.Pizze.Add(data.Pizza);
             _myDb.SaveChanges();

             return RedirectToAction("Index");
            
        }

        [Authorize(Roles = "ADMIN")]

        [HttpGet]
        public IActionResult AggiornaPizza(int id)
        {
            
            Pizza? pizzaDaEditare = _myDb.Pizze.Where(pizza=>pizza.Id == id).Include(pizza=> pizza.Gusti).FirstOrDefault();

            if(pizzaDaEditare == null)
            {
                return NotFound($"La pizza con {id} non possibile modificarla!");

            } else
            {
                List<Categoria> categorie = _myDb.Categorie.ToList();

                List<Gusto> gustiNelDb = _myDb.Gusti.ToList();
                List<SelectListItem> gustiSelezionati = new List<SelectListItem>();

                foreach(Gusto gusto in  gustiNelDb)
                {
                    gustiSelezionati.Add(new SelectListItem
                    {
                        Text = gusto.Name,
                        Value = gusto.Id.ToString(),
                        Selected = pizzaDaEditare.Gusti.Any(gustoScelto => gustoScelto.Id == gusto.Id),
                    });
                }

                PizzaFormModel model = new PizzaFormModel {Pizza = pizzaDaEditare, Categorie=categorie, Gusti = gustiSelezionati};

                return View("UpdatePizza", model);
            }
            
        }

        [Authorize(Roles = "ADMIN")]


        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AggiornaPizza(int id, PizzaFormModel data)
        {
            if(!ModelState.IsValid)
            {
                List<Categoria> categorie = _myDb.Categorie.ToList();

                data.Categorie = categorie;

                List<Gusto> gustiNelDb = _myDb.Gusti.ToList();
                List<SelectListItem> gustoSelezionato  = new List<SelectListItem>();

                foreach(Gusto gusto in gustiNelDb)
                {
                    gustoSelezionato.Add(new SelectListItem
                    {
                        Text = gusto.Name,
                        Value = gusto.Id.ToString(),
                    });
                }

                data.Gusti = gustoSelezionato; 

                return View("UpdatePizza", data);
            }

            Pizza? pizzaDaEditare = _myDb.Pizze.Where(pizza=>pizza.Id == id).Include(pizza=>pizza.Gusti).FirstOrDefault();

            if(pizzaDaEditare != null)
            {
                pizzaDaEditare.Name = data.Pizza.Name;
                pizzaDaEditare.Description = data.Pizza.Description;
                pizzaDaEditare.Pathimg = data.Pizza.Pathimg;
                pizzaDaEditare.Price = data.Pizza.Price;
                pizzaDaEditare.CategoriaId = data.Pizza.CategoriaId;

                if(data.gustoIdSelezionato != null)
                {
                    foreach(string gustoSelezionato in data.gustoIdSelezionato)
                    {
                        int intGustoSelzionato = int.Parse(gustoSelezionato);

                        Gusto? gustoInDb = _myDb.Gusti.Where(gusto=>gusto.Id == intGustoSelzionato).FirstOrDefault();
                        
                        if (gustoInDb != null)
                        {
                            pizzaDaEditare.Gusti.Add(gustoInDb);
                        }
                    }
                }

                _myDb.SaveChanges();

                return RedirectToAction("Index");

            } else
            {
                return NotFound("Non è stata trovata la pizza da aggiornare");
            }
                
        }

        [Authorize(Roles = "ADMIN")]


        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CancellaPizza(int id)
        {
            
                Pizza? pizzaDaCancellare = _myDb.Pizze.Where(pizza => pizza.Id == id).FirstOrDefault();

                if(pizzaDaCancellare != null)
                {
                    _myDb.Pizze.Remove(pizzaDaCancellare);
                    _myDb.SaveChanges();
                    return RedirectToAction("Index");
                } else
                {
                    return NotFound("Nessuna pizza da cancellare");
                }
        }

    }
}
