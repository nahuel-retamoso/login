const express = require('express');
const { MensajesDAO } = require('./daos/mensajesDao.js');
const socketio = require('socket.io');
const { generateProduct } = require('./faker.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

app.set('view engine', 'hbs');
app.set('views', './public');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const io = socketio(server);

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    const mensajesDao = new MensajesDAO();
    const mensajes = await mensajesDao.obtenerMensajes();
    socket.emit('messages', mensajes);
});

io.on('new-message', async data => {
    try {
        const mensajes = new MensajesDAO();
        await mensajes.guardarMensaje(data);
        io.emit('messages', await mensajes.obtenerMensajes());
        } catch (error) {
            console.log(error);
            }
            });

app.get('/api/products-tests', auth, (req, res) => {
    const product = generateProduct();
    if (product.length > 0) {
        
        res.render('view.hbs', { product });
    }
    io.emit('productos', product);
});

const AdvancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://nahuelretamoso:<password>@cluster0.rrceole.mongodb.net/sessions?retryWrites=true&w=majority',
    mongoOptions: AdvancedOptions }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

function auth(req, res, next) {
    if (req.session?.user === 'alex' && req.session?.admin) {
        return next();
    }
    return res.status(401).send('error de autorización');
}

app.get('/login', (req, res) => {
    res.render('login.hbs');
});

app.post('/login', (req, res) => {
    const { user, password } = req.body;
    if (user === 'alex' && password === '123') {
        req.session.user = user;
        req.session.admin = true;
        return res.redirect('/private');
    }
    res.redirect('/login');
});