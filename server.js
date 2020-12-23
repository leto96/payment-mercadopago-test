const HARDCODEDEV = true;
(process.env.NODE_ENV === 'development' || HARDCODEDEV) ? require('dotenv').config(): null;
console.log( process.env.NODE_ENV === 'development' || HARDCODEDEV ? 'development' : 'production' );
const userFactory = require('./controller/userFactory');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const privateToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  // console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.post('/api/payment', async (req, res) => {
  // Create the test user
  try {
    const user =  userFactory();
    const result = await user.createTestUser(privateToken);
    
  } catch (error) {
    console.log('out error');
    // console.log(error);
    
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));