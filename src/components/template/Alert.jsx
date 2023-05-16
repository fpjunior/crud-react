import Alert from 'react-bootstrap/Alert';
import React, { useState, useEffect } from 'react';

function AlertComponent({ variant, content, show }) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(show);
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [show]);

  return (
    <>
      {showAlert && (
        <Alert show={showAlert} variant={variant}>
          {content}
        </Alert>
      )}
    </>
  );
}

export default AlertComponent;
