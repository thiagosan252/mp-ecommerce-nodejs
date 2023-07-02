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

app.get('/success', function (req, res) {
    console.log('Success = Query', req.query)
    if (req.query)
        res.json({ query: JSON.stringify(req.query) });
    else
        res.json({})
});

app.get('/failure', function (req, res) {
    console.log('Failure = Query', req.query)
    if (req.query)
        res.json({ query: JSON.stringify(req.query) });
    else
        res.json({})
});

app.get('/pending', function (req, res) {
    console.log('Pending = Query', req.query)
    if (req.query)
        res.json({ query: JSON.stringify(req.query) });
    else
        res.json({})
});

app.post('/webhook', function (req, res) {
    console.log('Webhook = Query', req.query)
    if (req.query)
        res.json({ query: JSON.stringify(req.query) });
    else
        res.json({})
});

app.post("/create_preference", (req, res) => {

    mercadopago.preferences.create({
        items: [
            {
                id: "1234",
                title: req.query.title,
                picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                unit_price: Number(req.query.price),
                quantity: Number(req.query.quantity),
                description: 'Dispositivo de loja de comércio eletrônico móvel',
                currency_id: 'BRL',
            }
        ],
        notification_url: `${process.env.FRONT_URL}/webhook`,
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "visa"
                }
            ],
            installments: 6
        },
        external_reference: process.env.EXTERNAL_REF ?? '',
        payer: {
            name: 'Lalo',
            surname: 'Landa',
            address: {
                street_name: 'Rua Falsa 123',
                street_number: 12,
                zip_code: '86071650'
            }
        },
        back_urls: {
            success: `${process.env.FRONT_URL}/success`,
            failure: `${process.env.FRONT_URL}/failure`,
            pending: `${process.env.FRONT_URL}/pending`
        },
        auto_return: "approved",
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