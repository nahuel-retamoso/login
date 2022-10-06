const socket = io.connect();

const authorSchema = new schema.Entity('author', {}, { idAttribute: 'email' });
const messageSchema = new schema.Entity('message', { author: authorSchema });

function render(data) {
    const html = data.map(elem => {
        return (`<div><strong>${elem.author}</strong>:<em>${elem.text}</em></div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function insertPorcentaje(porcentaje) {
    document.getElementById('porcentaje').innerHTML = porcentaje;
}

function addMessage(e) {
    const mensaje = {
        author: {
            id: document.getElementById('id').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('text').value
    };

    const normalizedData = normalize(mensaje, messageSchema);

    socket.emit('new-message', normalizedData);
    return false;
}

socket.on('messages', data => {
    const normalizedLength = JSON.stringify(data.result).length;
    const denormalizedData = denormalize(data.result, messageSchema, data.entities);
    const denormalizedLength = JSON.stringify(denormalizedData).length;

    const porcentaje = (normalizedLength * 100) / denormalizedLength;

    render(denormalizedData);
    insertPorcentaje(porcentaje);
});

console.log('Longitud objeto original: ', JSON.stringify(empresa).length);
console.log('Longitud objeto normalizado: ', JSON.stringify(normalizedEmpresa).length);