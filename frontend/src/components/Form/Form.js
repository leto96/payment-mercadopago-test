import React, { useEffect, useState } from 'react';
import postscribe from 'postscribe';
import axios from 'axios';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Spinner from  '../Spinner/Spinner';
import styles from './Form.module.css';

const initialState = [
  {
    value : '',
    name:'email',
    labelName:'Email',
    isSensible:false,
    id:'email',
    type:'email',
    placeholder:'myEmail@email.com'
  },
  {
    value : '',
    name:'docType',
    labelName:'Tipo de documento',
    isSensible:false,
    id:'docType',
    type:'select',
    dataCheckout:'docType',
    options: [{id: 'none', text: 'Selecione um documento'}]
  },
  {
    value : '',
    name:'docNumber',
    labelName:'Número do documento',
    isSensible:false,
    id:'docNumber',
    type:'text',
    dataCheckout:'docNumber',
    placeholder:'CPF'
  },
  {
    value : '',
    labelName:'Vencimento - mês',
    isSensible:true,
    id:'cardExpirationMonth',
    type:'text',
    dataCheckout:'cardExpirationMonth',
    placeholder:'MM'
  },
  {
    value : '',
    labelName:'Vencimento - ano',
    isSensible:true,
    id:'cardExpirationYear',
    type:'text',
    dataCheckout:'cardExpirationYear',
    placeholder:'YY'
  },
  {
    value : '',
    labelName:'Número do cartão',
    isSensible:true,
    id:'cardNumber',
    type:'text',
    dataCheckout:'cardNumber',
    placeholder:'00000000000000'
  },
  {
    value : '',
    labelName:'Código de segurança',
    isSensible:true,
    id:'securityCode',
    type:'text',
    dataCheckout:'securityCode',
    placeholder:'CVV'
  },
  {
    value : '',
    labelName:'Banco emissor',
    isSensible:true,
    id:'issuer',
    type:'select',
    dataCheckout:'issuer'
  },
  {
    value : '',
    name:'installments',
    labelName:'Parcelas',
    isSensible:false,
    id:'installments',
    type:'select'
  },
  {
    value : '80',
    name:'transactionAmount',
    isSensible:false,
    id:'transactionAmount',
    type:'text',
    hidden:true
  },
  {
    value : '',
    name:'paymentMethodId',
    isSensible:false,
    id:'paymentMethodId',
    type:'text',
    hidden:true,
    invalidMessage: ''
  },
  {
    value : '',
    name:'description',
    isSensible:false,
    id:'description',
    type:'text',
    hidden:true
  },
  {
    value : '',
    isSensible:false,
    labelName:'Titular do cartão',
    id:'cardholderName',
    dataCheckout:'cardholderName',
    type:'text',
    placeholder:'FULLNAME'
  }
];

const Form = (props) => {
  const [formData, setFormData] = useState(initialState);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [changedForm, setChangedForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const updateStateFormData = (key, field, value) => {
    const newFormState = [...formData];
    newFormState[key][field] = value;
    setFormData(newFormState);
  }

  const findIndexKeyById = (id) => {
    return formData.map(data => data.id).indexOf(id)
  }

  const setCardToken = (status, response) => {
    if (status === 200 || status === 201) {
      setFormData([...formData, 
        {
          id:'token',
          type:'text',
          hidden:true,
          value: response.id,
          name:'token'
        }]);
      setFormSubmitted(true);
    }else{
      props.onResponseHandler({
        status: 'Error',
        message: response.message
      });
      setLoading(false);
    }
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if(!formSubmitted){
      // To do validation
      let $form = document.getElementById('paymentForm');
      setLoading(true);

      if(changedForm){
        window.Mercadopago.createToken($form, setCardToken.bind(this));
      }
    }
  }

  const getInstallments = (paymentMethodId, transactionAmount, issuerId) => {
    window.Mercadopago.getInstallments({
      "payment_method_id": paymentMethodId,
      "amount": parseFloat(transactionAmount),
      "issuer_id": parseInt(issuerId)
    }, setInstallments.bind(this));
  }
 
  function setInstallments(status, response){
    let key = findIndexKeyById('installments');
    if (status === 200) {
      cleanInvalidMessage('installments'); // clean error message
      let options = response[0].payer_costs.map( installments => (
        {
          text: installments.recommended_message,
          value: installments.installments
        }));

      updateStateFormData(key, 'options', options);
      updateStateFormData(key, 'value', String(response[0].payer_costs[0].installments));

    } else {
      updateStateFormData(key, 'invalidMessage', response.message);
    }
  }

  const getIssuers = (paymentMethodId) => {
    window.Mercadopago.getIssuers(
      paymentMethodId,
      setIssuers.bind(this)
    );
  }

  const setIssuers = (status, response) => {
    let key = findIndexKeyById('issuer');
    if (status === 200) {
      cleanInvalidMessage('issuer'); // clean error message
      let options = response.map( issuer => (        
      {
        text: issuer.name,
        value: issuer.id
      }));
      updateStateFormData(key, 'options', options);
      updateStateFormData(key, 'value', String( response[0].id ));

      let auxPaymentMethodId;
      let auxTransactionAmount;
      formData.map( (val) => {
        if(val.id === 'paymentMethodId') auxPaymentMethodId = val.value;
        if(val.id === 'transactionAmount') auxTransactionAmount = val.value;
        return null;
      });

      getInstallments(
        auxPaymentMethodId,
        auxTransactionAmount,
        formData[key].value
      );
    } else {
      updateStateFormData(key, 'invalidMessage', response.message);
    }
  }

  const setPaymentMethod = (status, response) => {
    let key = findIndexKeyById('paymentMethodId');
    if (status === 200) {
      let paymentMethod = response[0];
      // 10 is the paymentmethod object in array it is hardcoded for now, but it needs to be changed to
      // an more elegant solution
      updateStateFormData(key, 'value', paymentMethod.id);
      getIssuers(paymentMethod.id);
    } else {
      // Something went wrong, the problem is from the card number
      key = findIndexKeyById('cardNumber');
      updateStateFormData(key, 'invalidMessage', 'Invalid card');
    }
  }

  const enableButton = () => {
    // Fields check to enable
    const fieldsId = ['email', 'docType', 'docNumber', 'cardExpirationMonth', 'cardExpirationYear', 
      'cardNumber', 'securityCode', 'issuer', 'installments', 'cardholderName'];

    // Comparar com todos os fields
    return formData.reduce( (avaliation, currentValue) => {
      let result = avaliation;
      let findResult = fieldsId.find(element => element === currentValue.id)
      if(findResult === undefined){
        result = result && true
      }else{
        if(currentValue.value !== '')
          result = result && true;
        else{
          result = result && false;
        }
      }
      return result;
    }, true);
  }

  const onChangeHandler = (key, e) => {
    let eventValue = e.target.value;
    let value = maskValues(formData[key].id, eventValue); //Masked Value
    if(formData[key]['dataCheckout'] && formData[key]['dataCheckout'] === 'cardNumber'){
      cleanInvalidMessage('cardNumber');
      if (value.length >= 6) {
        let bin = value.substring(0,6);
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethod.bind(this));
      }
    }

    setChangedForm(true);
    updateStateFormData(key, 'value', value);
    
    enableButton() ? setButtonDisabled(false) : setButtonDisabled(true)
  }

  const setReadyDocTypes = () => {
    // Helper: catch calls from MercadoPago, and identify update data from doc types
    var proxied = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
      // Proxy the call
      var pointer = this;
      var intervalId = window.setInterval(function(){
        var urlLikeLookingFor = "https://api.mercadopago.com/v1/identification_types";
          if(pointer.readyState !== 4){
            return; // wait until be ready
          }
          if( pointer.responseURL.substr(0, 51) === urlLikeLookingFor){
            // The response is from the docTypes "get"
            const parsedResponse = JSON.parse(pointer.response);
            let options = parsedResponse.map( docType => (
              {
                text: docType.name,
                value: docType.id
              }));

            let key = findIndexKeyById('docType');
            updateStateFormData(key, 'value', options[0].value);
          }
          
          clearInterval(intervalId);

      }, 1);
      return proxied.apply(this, [].slice.call(arguments));
    };
    window.Mercadopago.getIdentificationTypes();
  }

  const cleanInvalidMessage = (field) => {
    let key = findIndexKeyById(field);
    updateStateFormData(key, 'invalidMessage', '');
  }

  // Load mercadopago Script to use as said in documentation (https://www.mercadopago.com.br/developers/pt/guides/online-payments/checkout-api/receiving-payment-by-card/)
  useEffect(() => {
    postscribe('#root', '<script id="mercadoPagoScript" src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>')

    const mercadoPagoScript = document.getElementById('mercadoPagoScript');
    mercadoPagoScript.addEventListener('load', () => {
      window.Mercadopago.setPublishableKey("TEST-bd5383a9-43a9-494b-a54d-4bcfb4824fd3");
      setReadyDocTypes();
    });
  }, []);

  useEffect( () => {
    if(formSubmitted){
      const formatedPostData = formatDataToPost(formData);

      axios({
        url: '/api/payment',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: formatedPostData
      })
      .then(res => {
        props.onResponseHandler(res.data);

      })
      .catch(e => {
        props.onResponseHandler(e.response.data);
      })
      .finally(() => {
        setLoading(false);
      })
    }
  }, [formSubmitted]);

  const formatDataToPost = () => {
    const filteredFormData = formData.filter( (data) => {
      return !!data.name
    });

    const formatedData = {};
    filteredFormData.forEach( (data) => {
      formatedData[data.name] = data.value;
    });
    return formatedData;
  }

  return (
    <form id='paymentForm' className={styles.Form}>
      { formData.map( (inp, index) => <Input
        {...inp}
        index={index}
        key={index}
        onChange={(index, e) => onChangeHandler(index, e)}
        />
      )}
      
      { loading ? <Spinner /> : <Button disabeld={buttonDisabled} onSubmitHandler={onSubmitHandler} value={'Comprar'}/> }
    </form>
  )
}

const maskValues = (id, value) => {
  // Remove everything that is not digit from formData specific fields
  switch (id) {
    case 'docNumber':
    case 'securityCode':
    case 'cardExpirationMonth':
    case 'cardExpirationYear':
    case 'cardNumber':
      return value.replaceAll(/\D/g, '');
    default:
      return value;
  }
}

export default Form;