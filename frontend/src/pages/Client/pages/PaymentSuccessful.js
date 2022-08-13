import React, { useEffect, useState } from "react";
import "./Payment.scss";
import { useNavigate } from "react-router-dom";

function PaymentSuccessful() {
    
    const navigate = useNavigate();

    const routeChange = () =>{ 
      let path = `dashboard`; 
      navigate(path);
    }

  return (
    <>
    <p> Your payment is successfully processed. <button onClick={routeChange}>Go back</button>
    </p>
    </>
  );
}
export default PaymentSuccessful;

//     <MollieElement/>
