# Payment MercadoPago :money_with_wings:

Frontend and API are both working togheter in the same project, [here is a guide](https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/) on how to do it

The payment is configured in the filling some data in the front that is sent to mercado pago endpoint partially, getting data and setting payment configuration.

![mercado pago](https://www.mercadopago.com.br/developers/bundles/images/api-integration-flowchart-pt.png)

The Node backend, doesn't receive the credit card data (number, cvv...), this data is only sent to mercado pago, mercado pago then returns a token, in which is sent to Node backend where the payment is finished.

Example [here](https://test-payment-mercadopago.herokuapp.com/)