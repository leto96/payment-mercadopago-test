import React, { useState } from 'react';
import styles from './Input.module.css'

const Input = (props) => {
  const isSensible = props.isSensible || false;

  const extraAttr = {};
  if(!isSensible){
    extraAttr['name'] = props.name;
    extraAttr['hidden'] = props.hidden;
  }

  const onChangeChildHandler = (e) => {
    props.onChange(props.index, e);
  }

  let generatedInvalidMessage = null;
  if(props.invalidMessage && props.invalidMessage !== ''){
    generatedInvalidMessage = <p className={styles.validationMessage}>{props.invalidMessage}</p>
  }

  let input;
    
  if(props.type !== 'select'){
    input = (<input
      className={styles.input}
      id={props.id}
      type={props.type}
      value={props.value}
      data-checkout={props.dataCheckout}
      placeholder={props.placeholder}
      {...extraAttr}
      onChange={onChangeChildHandler}
    />)
  }
  
  if(props.type === 'select'){
    input = (<select
      className={styles.input}
      id={props.id}
      value={props.value}
      data-checkout={props.dataCheckout}
      placeholder={props.placeholder}
      {...extraAttr}
      onChange={onChangeChildHandler}
    >
      {props.options && props.options.map(option => (
        <option key={option.value} value={option.value}>{option.text}</option>
      ))}
    </select>)
  }
  
  return (
    <div className={props.hidden ? styles.hiddenGroup : styles.group}>
      <label className={styles.label} htmlFor={props.id}>{props.labelName}</label>
      {input}
      {generatedInvalidMessage}
    </div>
  )
}

export default Input;