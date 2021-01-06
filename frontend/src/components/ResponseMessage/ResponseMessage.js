import React, { useState } from 'react';
import styles from './ResponseMessage.module.css';

const Input = (props) => {
  return (
    <div className={styles.group}>
      <div className={styles.mainMessage}>
        {props.status}
      </div>
      <div className={styles.descriptive}>
        {props.message}
      </div>
    </div>
  )
}

export default Input;