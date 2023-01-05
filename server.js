const express = require('express');
const Datastore = require('nedb');
const app = express();
require('dotenv').config
app.listen(3000, () => console.log('Server is Live'))
app.use(express.static('public'));
app.use(express.json({limit: '5mb' }));

const timestamp = Date.now();
const invoiceDB = new Datastore ('invoice.db');
const ipnDB = new Datastore ('ipn.db');
invoiceDB.loadDatabase();
ipnDB.loadDatabase();

app.post('/invoice', (request, response) => {
    
    invoiceDB.insert({
        'payId': request.body.paymentId, 
        'time': timestamp, 
        'body': request.body
    });
    console.log(invoiceDB);
    
    response.json({
        status: 'success',
    })
})

app.post('/ipn', (request, response) => {
    
    ipnDB.insert(request.body);
    console.log(request);
    
    response.json({
        status: 'success',
    })
})