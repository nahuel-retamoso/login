
const formAgregarProducto = document.getElementById('agregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('update', producto);
    formAgregarProducto.reset()
})


socket.on('productos', productos => {
    // makeHtmlTable(productos).then(html => {
    //     document.getElementById('productos').innerHTML = html
    // })
    console.log(productos)
})

// function makeHtmlTable(productos) {
//     return fetch('plantillas/tabla-productos.hbs')
//         .then(respuesta => respuesta.text())
//         .then(plantilla => {
//             const template = Handlebars.compile(plantilla);
//             const html = template({ productos })
//             return html
//         })
// }
