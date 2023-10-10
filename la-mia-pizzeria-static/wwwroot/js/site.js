// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

loadPizze()
function loadPizze(searchKey) {
    axios.get('https://localhost:7087/api/Pizzas/GetPizze', {
        params: {
            search: searchKey
        }
    }).then((resp) => {
        console.log(resp);
    })
}

