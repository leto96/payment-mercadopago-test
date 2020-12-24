const HARDCODEDEV = true;
(process.env.NODE_ENV === 'development' || HARDCODEDEV) ? require('dotenv').config(): null;
console.log( process.env.NODE_ENV === 'development' || HARDCODEDEV ? 'development' : 'production' );

const userFactory = require('./controller/user/userFactory');
const paymentFactory = require('./controller/payments/payment');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const privateToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.post('/api/payment', async (req, res) => {
  // Create the test user
  try {
    
    // To do - validation
    const requestData = req.body;
    
    const user =  userFactory();
    createdTestUser = await user.createTestUser(privateToken);

    const payment = paymentFactory({secureToken: privateToken});
    const paymentResult = await payment.makePayment(requestData);

    console.log(paymentResult);
    if(paymentResult.status === 200 || paymentResult.status === 201){
      res.stauts(200);
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

app.listen(port, () => console.log(`Listening on port ${port}`));