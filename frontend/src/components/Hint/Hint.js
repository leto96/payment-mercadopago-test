import React from "react";
import styles from './Hint.module.css';


const Hint = (props) => {
  return (<div className={styles.hint}>
    <p>Use um email não existente (ex: test@email.com)</p>
    <p>Não use seu CPF (pode gerar um <a href="https://www.4devs.com.br/gerador_de_cpf" target='_blank'>aqui</a></p>
    <p>Não use seu cartão, use um de teste disponível na tabela do <a href="https://www.mercadopago.com.br/developers/pt/guides/online-payments/checkout-api/testing#bookmark_cart%C3%B5es_de_teste" target='_blank'>mercadopago</a></p>
    <p>Use qualquer nome</p>
    <p>Nada é cobrado, nenhuma informação de cartão de crédito é salva, apenas armazenada no MercadoPago em banco de testes</p>    
  </div>)
}

export default Hint;