import React, { useState } from 'react';
import './App.css';
import styles from './App.module.css'
import Form from './components/Form/Form';
import ResponseMessage from './components/ResponseMessage/ResponseMessage';
import SuccessShow from './components/SuccessShow/SuccessShow';

const initalBackendState = {
  status: '',
  message: ''
}

const App = () => {
  const [backendResponse, setBackendResponse] = useState(initalBackendState);
  const [paymentCompleteSuccessfully, setPaymentCompleteSuccessfully] = useState(false);

  const onResponseHandler = (responseData) => {
    setBackendResponse(responseData);
    if(responseData.status === 'Ok'){
      setPaymentCompleteSuccessfully(true);
    }
  }

  const showMessage = (backendResponse.status === 'Error' ? <ResponseMessage status={backendResponse.status} message={backendResponse.message} />: null)

  return (
    <div className={styles.container}>
      {paymentCompleteSuccessfully ? <SuccessShow /> : <Form onResponseHandler={onResponseHandler} /> }
      {showMessage}
    </div>
  )

}

export default App;