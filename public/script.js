const form = document.getElementById("form");
async function handleForm(event) { 
    event.preventDefault(); // Prevent page refresh
    const uri = 'https://bux.digital/v1/pay/?', // Payment URL
        params = { // Create parameters
            merchant_name: document.getElementById('merchant-name').value,
            invoice: document.getElementById('invoice').value,
            order_key: document.getElementById('order-key').value,
            merchant_addr: document.getElementById('merchant-addr').value,
            amount: document.getElementById('amount').value,
            offer_name: document.getElementById('offer-name').value,
            offer_description: document.getElementById('offer-description').value,
            success_url: 'https://' + document.getElementById('success-url').value,
            cancel_url: 'https://' + document.getElementById('cancel-url').value,
            ipn_url: 'https://' + document.getElementById('ipn-url').value,
            return_json: document.getElementById('return-json').value
        };
    let invoiceUri = uri + new URLSearchParams(params).toString(),  // Convert params to URL
        invoiceHeader = new Headers(); // Define headers
    invoiceHeader.append('Content-Type', 'application/json'); // Append headers
    const invoice = new Request(invoiceUri, { // Define GET request for invoice
        method: 'GET',
        headers: invoiceHeader,
        mode: 'cors'
        });
    await fetch(invoice) // Fetch invoice API
        .then(response => response.json())
        .then((data) => {
            paymentUrl = data.paymentUrl;
            console.log(paymentUrl);
            console.log(data);
            window.open(paymentUrl);
            const postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch('/invoice', postOptions)
                .then(response =>{
                    console.log(response);
                });
        })
        .catch((err) => {
            console.log('ERROR:', err.message); // Console Log error
        });
} 
form.addEventListener('submit', handleForm);
