const express = require('express');
const Datastore = require('nedb');
const axios = require('axios');
const app = express();

// Set the server port to the value specified in the PORT environment variable,
// or to 3000 if PORT is not set
const port = process.env.PORT || 3000

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up JSON body parsing middleware with the specified MIME types and maximum
// request body size
const jsonOptions = {
    type: ['*/json'],
    limit: '750kb'
  }  
app.use(express.json(jsonOptions));

// Set up form data parsing middleware
app.use(express.urlencoded({ extended: true }));

// Create instances of the nedb module for storing data
const invoiceDB = new Datastore ('invoice.db');
const ipnDB = new Datastore ('ipn.db');

// Load the databases from the file system
invoiceDB.loadDatabase();
ipnDB.loadDatabase();

// define postIpn function
async function postIpn(request, res) {
    const ipn = request.body;
    
    // validate ip address
    const ipAddress = request.socket.remoteAddress;
    // compare... 


    // validate existence of transaction
    const url = `https://ecash.badger.cash:8332/tx/${ipn.txn_id}?slp=true`;
    const result = await axios.get(url);
    const txData = result.data;


    // validate that transaction settles new order
    const orderKey = ipn.custom; 
    // compare payment status of order in Agent database...


    // Log the request body
    console.log(request.body);
    
    // Insert the request body into the ipnDB database
    ipnDB.insert(request.body);
    
    // Send a response with the message 'OK'
    response.send('OK');
}

// Set up route for handling POST requests to '/invoice'
app.post('/invoice', (request, response) => {
    // Create a timestamp
    const timestamp = Date.now();
    
    // Insert the request body, payment ID, and timestamp into the invoice database
    invoiceDB.insert({
        'payId': request.body.paymentId, 
        'time': timestamp, 
        'body': request.body
    });
    
    // Send a response with the message 'OK'
    response.send('OK');
})

// Set up route for handling POST requests to '/ipn'
app.post('/ipn', postIpn);

// Start the server and listen for requests on the specified port
app.listen(port, () => console.log(`Server is live at port ${port}`))