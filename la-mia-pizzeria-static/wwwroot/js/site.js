// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

loadPizze();
document.getElementById("search").addEventListener('keyup_enter', searchPizza)

function searchPizza() {
    let searchString = document.getElementById('search').value
    loadPizze(searchString);
}

function loadPizze(searchKey) {
    axios.get('https://localhost:7087/api/Pizzas/GetPizze', {
        params: {
            search: searchKey
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



