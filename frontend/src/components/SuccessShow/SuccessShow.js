import React from 'react';
import image from './O9IY2T0.jpg'
import styles from './SuccessShow.module.css';

const SuccessShow = (props) => {
  return (
    <>
      <div className={styles.thanksMessage}>Thank you!</div>
      <p className={styles.buildingMessage}>We are still building...</p>
      <img className={styles.image} src={image} alt="Building Image" />
      <a className={styles.autorlink} href="https://br.freepik.com/vectors/fundo">dooder logo</a>
    </>
  )
}

export default SuccessShow;