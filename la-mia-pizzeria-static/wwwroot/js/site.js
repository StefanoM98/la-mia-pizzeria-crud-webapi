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

function createPizza() {
    const pizza = {
        Name: "Pizza scausa",
        Description: "La nostra pizza più scrausa",
        Pathimg: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXwBFRcXHhoeOyEhO3xTRlN8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fP/AABEIAIIArQMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAADBAECBQAG/8QAMxAAAgIBAwMDAwMCBQUAAAAAAQIAAxEEEiExQVETImEFcYEykaEjQhQVUoLRQ2KSsfD/xAAZAQADAQEBAAAAAAAAAAAAAAAAAgMBBAX/xAAkEQADAQADAQABAwUAAAAAAAAAAQIRAxIhMUETIjIEFEJRYf/aAAwDAQACEQMRAD8ABWuXDLgjrLev+oYwfiCVG0j+nncp5GR+8kngtt/mcrbl4d8pX+5hQyClmbg+PMTe/nG0j48ydTodVSteoDp6VnQqQcfGJyUl8E8nyYNJL0JdOvPgbSay7TPuocpnqOxjZ+rWNj1AWPkMREShXgyAhY4HXxMV0vhWuOK/kh5/qdmMVoqfJ9x/cxZrmb3MSxPzC0/TNRZzs2jyxxHE+kYHut/8RG63RLvxcfwzN2euZxAI55mv/lNOcl7M/cSl+g06Icl/3h+lRn9xxmP6C2HA5PidXoLGc+kxrYfOMxtAlI2Ln3c5PWXV1RfdyOMfEEmhavt8M62jWVOC7M+Oh3ZhAz2fqD7sAZY5jupvVNPkk7cY48wOmcW1hgO+JrukhYiar0tRWDwxK8cGMuwKLWpOAIMCWzI9nh0uFqZr6d/VpUnrjn7y5mfobwj7D0bp95pHkZnZx12R53LHWih6TO+oaZmYWVnA/u+PmaMntKEjG+laqpbvRVmYuO6kAEfea/ESv0VfqBxlT1BHY/EuNXVWSl1mGHcjrM+B9PO6y1mAfPvSF0zf4mv2ccc56CA1CWBS4UgEd5XQ02DJw1dbAewnJMjyJfWdnDVfxQ7YTey4zsQbVHgQyJjAnU1lmCoMk9prabSLSAx9z+fEjMO2WvkniQrT9PawZu9q+O8drqo0q+1VX57wpMytZccE7s5OMfHedGTC8OR3XK/WN/5hUTgHAz1PEudZUBln+wHeYysrKQwwOwzGdDXWwJJB2nAyYvejXxylprUstoVhkq3MHq6w9TYgaAKdQxRzg9V6/mMF89AZTSWHn2Qtpt2P6lY2n5gtrlAM8gDrNW/Tj1w9ThGPVTzmB1PpBTSMMcZOBwv5kX58LxQtbXjRv64PIP6eYzofp5TQ1rkrZjcQemTzC0NWylQeje4fbtHRbUAMsFz0zGlS1jEq6VajMet622uMGRNWxFddrgEGIX0mlvKnoZG+Nz6vh18XMr8f0GJqaS/enP6h1mXC02GuwN+/2i8d9WNzcfeTXIz0kEZla3BHnxCTuPMaBOm5SJg/U2KXqrrnCz0PMydVprLNQ7NWWyeCPES20vCnFMuvTPfN1m5+inCjxCKMsAOSegnMpVyGJPPJ8mO/TaP+u32T/mRcu7w65tcfFqG9Lpxp055c9TD5kEyJ05ixHC26esuSCoHkdphauuwWWVE4P6lM2uRnJxA3LUyEW7Se2esSlqGl4zHSmx1wyZXvjnMPoq9jMNvs6Z7j4kvSSw2M6L9+spqMLUi152A9PM56X/ToVuvA3+PqyyAkEcZxOOpYqVrYkKImiILATw3XjnAhkQZZ+oJxBjdUTtsYq/rAseox0ETtZ3BSsBa1PJ/1YjjbUGePmLeo7uxCft3gkzViI9QrcbK/YWOT3JMI2ocr7jBHCAMxEq1gJzg4846xsQfQ517LsNJ2kDkDo33E0tPqV1NbJYAD0IB/mYFgGcIO2YSrVMhBJbjjrzN7NA+NNavpp21tVYVbp2PmQIqbL25pHqUDnHUrDpYHQESFTj8Lcd9lj+j+ktOdh/EdDZEx0baQR1E0kfcocdDOjhrVjOT+o4+r7BjK4M5WBPxJPWXOUxtRUbHrReC5x9pqKAihVGFHAES039TVO3ZBgRi7UJUOTk+BMSS9HbbSQUnEE+pRDjO5vCxW+5lQ2W4CYyFBmYLTjLKVDHiI7/0Uni31m1ZbqLlUErWg8dcfeL2aimhuzt94otttq7TYdo+ZRUXJ7565k3rKKF+SRfZbd/UGE7/8Q409msw9Y2j54EHpkR32sf37TXN1VFWXsRFXuxwIqn026U/DMs0l2mALj/cDmX0YS1mVvaMZmjc636NypDKVyCDxMtA1b71AYEc/Mo0LNto6/WfTdPcKrCWfoep2/eE1QqQq9RBR1zx0/ExG+k6m7UtZW6lHYncTyufM2L6Rp/p9aIuRUNuTNeJCTreCdxRmU8FQRkfEPv0bKRsZR/aYn+ogZwPIhjTXszvI8SLr06+iAgYIAH6jiRauUGAeDiXrwrjdyoI58iTq/bd6RAVOxBzDdN+MDTdZprAVYgdxnrHnsQYsrI2P+r7xPU0hArK2cjzFmRnAGWBHI+YfTKX+SNoGM6W/Y21j7WP7TK0F/raZS36l9pjO6TWxRRpckms2azx0l1uUj3cEeYtprxbVtY+5f5ErdXuI5nbL1ajzKnq8YDT2enU23l2biUsvrqRsnc57yNOjKDY34mfZqN+rG7lA3aSda8LRHmjFnr3ne6k46L0A/Eoq5GW6xoWp1LD94ueST2J4E3MGT0hQSw8CXcDgA/JlXIVSF5JkpWQct1mesbEinuJ9owPmIfVH1N9q+xmXHG3pNC9C6gBhjuoMHpy9VgAbOB0hqRjTpDf06i/S/SnWxgr2HITwJFbkrtPMrfawUMg5J55gvelo3ZHfEO3YJjqvR7T2hGdRz3k33FdO4IBLgjBiC2thlUndnqvicGsYgPuwx7nOIv5N6/kCpJxngjqIc6ivbjaceJ2qesgUg8oSQcc4i+1s4DdOuRFcllWoncTnwegg7Q3qFWIBhR7HH9x89hJtVWYEjPzGSwSnvwXwcZd/wJbTuPXHX/iXsRQvHBkUDBBA5yJrwUnTsF1eoRV2rkHEfSqx+inHmRpzW+vuKAYVQP5mis39NP0T9dysQLT6Y1sGLcjsIx16zhOx8ysyl8OerdvWJ61immO04Ii2m0tT8MOT0OeSI1qWRtMyseccRLT2rksCSR0+Jzb6dMr9p2pQaZs7eAf3nJWSAScZjOoT1azjqeAYubAhy4K/iURmg+VdgR7x3+Jay0BQQCSYtZeDbv6Z4has3YABwP5g/BkTWrOVLLtbrgdob/B2FM7mDfGOY3WpRFYV4J7QoqDOWbv2zxEfpndpmdVVYjlCC+TncRG7HrLYswZZbQdS9QOFXAxK6oIGBcAqw4Mz9yM7TT9MnUMf8R6iLtTt4hKDhSztg4zLXadjn0X/ANsXTK2f1ARjpBPS+LA2owyKQvuPfvAHepyDmXNy8gj8yUGceI5PDlYn5zzCDHQgiCU+mTmSLfWcemDFYx1pJx0xBvqK6cbjj48xhabLM+3aPmItoWt1GHJA7mNK1k7rEaf0kYoNuMG1t347TUU8RGpgihVwABgCG9T5nQkcbY0WUQZtgdxPMoyO59pxjrHwTSgZb6jgc4mUtlmncrzjuIYmxLUNRAX+7zKOznhsFj0JE5HLXw7otZ6Xt1z2DahK+ZBe24AOcqBwAOISoV9GYY8YjlRor6YIPaI9H7SZw0lr2AFeP4E2NFUK68Ac+fMDWybuuFEOLM42xpTonycn4DM2GAHTvIawnpB5JEIiSyjPpzut+ALtP6i5U7bByGgCS6+nqRsbP7zTCyllSOu1lBE2p0E8EDpWPurbn5i+oqdgfW3AjoQMiNPp7aDmhsr/AKTCJqV6MCG8GRcYXnkZh2MM7T7vtOpsIbngTX1empvAbAVs9RB1JTphtCDJ6lucw0fsJWAMR8yK0ZH4PJjLpWHJU4Q/wZQXBdxCjA/uMMbB2sD1P6VR3k89MmLm3knqTAtY1hyxkqQJWZw56rRiss0arUfeK1tGUJxKoiwxMnPA+eYJ7EqQvawRR3PEHpNSmpoV0bOPafuJpgucSjKG7QgU95IAzJFgdYSz2WjDdm8w40e3lekDYoIk06p6eHyy/wDqADVVO08KMxpU8wdVyWLlGBhQ03TMCKqiXBEECD3xJwf/AIw0MCbp26CIbxJ/EAwsSIJ61YciWzOyIaGCzUqOgi1lRY+0R9iPxEdR9RppBWsh3+OgmGgzpVqQ2XttX+TErbvUbgbVHRYO/Uve+6xsnt8Qe/AmgG3eZZWyYm2oUdOZ3qsw8TTDRbVU6dc2N+AMmK3fXGxiisL/ANzc/wARO5S1Z/eKQ0zEFuvs1D7rnLn5hdLrbNKGCYIY55istAY9R2kDvOnRAI7QLzp00AKkraNpI+02aySoyZ06YzQokyJ0DC0gzp00CJ06dMAy/q7sFADEA9RmY4nTowHQdnUTp0ABHrDp+mdOgYyx6GJHqZE6AI6SJ06Bp//Z",
        Price: 17,
        CategoryId: 2
    }
    axios.post('https://localhost:7087/api/Pizzas/CreaPizza', pizza);

    GetPizze();
}

let creaPizzaBtn = document.getElementById('newPizza')
creaPizzaBtn.addEventListener('click', function () {
    createPizza()
})




