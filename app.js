require('dotenv').config()

const express = require('express');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000

// SDK do Mercado Pago
const mercadopago = require('mercadopago');
// Adicione as credenciais
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN ?? ''
});

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

let hbs = exphbs.create({});
hbs.handlebars.registerHelper('json', function (obj) {
    return JSON.stringify(obj);
})

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/webhook', function (req, res) {
    res.json({
        id: response.body.id
    });
});

app.post("/create_preference", (req, res) => {

    let preference = {
        items: [
            {
                title: req.query.title,
                unit_price: Number(req.query.price),
                quantity: Number(req.query.quantity),
                description: 'Dispositivo de loja de comércio eletrônico móvel',
                currency_id: 'BRL',
            }
        ],
        notification_url: "https://thiagosan-mp-commerce-nodej-6ae8bfdbf611.herokuapp.com/webhook",
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "visa"
                }
            ],
            installments: 6
        }
    };

    mercadopago.preferences.create({
        ...preference,
        external_reference: process.env.EXTERNAL_REF ?? '',
    })
        .then(function (response) {
            res.json({
                id: response.body.id
            });
        }).catch(function (error) {
            console.log(error);
        });
});


app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.listen(port, () => {
    console.log(`The server is now running on Port ${port}`);
});