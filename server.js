try {
  const dotenv = require('dotenv');
  dotenv.config();
} catch (error) {
  // Do nothing, if we are in development mode, the dotenv will be present
  // and it will load de env vars
}

const userFactory = require('./controller/user/userFactory');
const paymentFactory = require('./controller/payments/payment');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const privateToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/payment', async (req, res) => {
  // Create the test user
  try {
    
    // To do - validation
    const requestData = req.body;
    
    const user =  userFactory();
    createdTestUser = await user.createTestUser(privateToken);

    const payment = paymentFactory({secureToken: privateToken});
    const paymentResult = await payment.makePayment(requestData);

    if(paymentResult.status === 200 || paymentResult.status === 201){
      res.status(200);
      res.send({status: 'Ok', message: 'Payment done successfully'});
    }else{
      res.status(500);
      res.send({status: 'Error', message: 'Something went wrong'});
    }
    
  } catch (error) {
    res.status(500);
    res.send({status: 'Error', message: 'Something went wrong'});
  }
});

if(process.env.NODE_ENV === 'production'){
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));