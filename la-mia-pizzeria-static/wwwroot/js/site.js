// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


document.getElementById("cerca").addEventListener('keyup', searchPizza)

function searchPizza() {
    let searchString = document.getElementById('cerca').value
    if (searchString.length > 0) {
        loadPizze(searchString);
    } else {
        GetPizze();
    }
}


function GetPizze() {
    axios.get('https://localhost:7087/api/Pizzas/GetPizze')
        .then((resp) => {
        console.log(resp)
        let result = resp.data;

        const pizzaTable = document.getElementById('pizza-table');
        const noPizza = document.getElementById('no-pizze');

        if (result.length == 0) {
            pizzaTable.classList.add('d-none');
            noPizza.classList.remove('d-none');

        } else {

            document.getElementById('pizze').innerHTML = ""

            result.forEach(pizza => {
                document.getElementById('pizze').innerHTML +=
                    `
                        <tr>
                            <td>
                                <a href="/Pizza/Dettagli/${pizza.id}"> ${pizza.id}</a>
                            </td>
                            <td class="name">
                                ${pizza.name}
                            </td>
                            <td class="description">
                                ${pizza.description}
                            </td>
                            <td class="price">
                                ${pizza.price}
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger delete-btn" id="${pizza.id}">
                                CANCELLA
                                </button>
                            </td>
                        </tr>
                    `
            })
            let btnDelete = document.querySelectorAll(".delete-btn")
            for (var i = 0; i < btnDelete.length; i++) {
                console.log('cancellato')
                let id = btnDelete[i].id;
                btnDelete[i].addEventListener('click', function () {
                    deletePizza(id)
                })
            }
        }
    })

    
   

}


function loadPizze(searchKey) {
    axios.get('https://localhost:7087/api/Pizzas/RicercaPizze', {
        params: {
            cerca: searchKey
        }
    }).then((resp) => {
        console.log(resp)
        let result = resp.data;

        const pizzaTable = document.getElementById('pizza-table');
        const noPizza = document.getElementById('no-pizze');
       
        if (result.length == 0) {
            pizzaTable.classList.add('d-none');
            noPizza.classList.remove('d-none');

        } else {

            document.getElementById('pizze').innerHTML = ""
            
            result.forEach(pizza => {
                document.getElementById('pizze').innerHTML +=
                    `
                        <tr>
                            <td>
                                <a href="/Pizza/Dettagli/${pizza.id}"> ${pizza.id}</a>
                            </td>
                            <td class="name">
                                ${pizza.name}
                            </td>
                            <td class="description">
                                ${pizza.description}
                            </td>
                            <td class="price">
                                ${pizza.price}
                            </td>
                        </tr>
                    `
            })

        }
    })
        .catch((resp) => {
            alert(resp)
        })
}


function deletePizza(pizzaId) {
    axios.delete('https://localhost:7087/api/Pizzas/CancellaPizza/' + pizzaId)
        .then(resp => {
            console.log(pizzaId)
            GetPizze();
        });
}




