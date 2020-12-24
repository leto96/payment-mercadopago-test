var mercadopago = require('mercadopago');

function payment(config = {}){

  if(!config.secureToken) throw new Error('config.secureToken is mandatory');
  const secureToken = config.secureToken;

  async function makePayment(data){
    mercadopago.configurations.setAccessToken(secureToken);

    // todo: Validations

    try {
      var payment_data = {
        transaction_amount: Number(data.transactionAmount),
        token: data.token,
        description: data.description,
        installments: Number(data.installments),
        payment_method_id: data.paymentMethodId,
        issuer_id: data.issuer,
        payer: {
          email: data.email,
          identification: {
            type: data.docType,
            number: data.docNumber
          }
        }
      };

      const paymentResult = await mercadopago.payment.save(payment_data);
      console.log(paymentResult);
      if(paymentResult.status === 200 || paymentResult.status === 201)
      return paymentResult;
      
    } catch (error) {

      console.log('error');
      console.log(error);
      
    }
  }

  return {
    makePayment
  }
}

module.exports = payment;