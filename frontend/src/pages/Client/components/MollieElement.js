import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
//import { DataReadAble } from '../../../helpers/DataRawReadAble'
//import axios from 'axios'



function MollieElement() {
  //const navigate = useNavigate();

  // data user
  //const [data, setData] = useContext(DataReadAble)

  /* create user
  useEffect(() => {
    if(data){
        const persoonObject = data.order.contactPersonen.persoon1

        // gegevens om dan toe te voegen aan firebase
        const email = persoonObject.email
        const username = Math.random().toString(36).slice(-8)
        const firstname = persoonObject.firstname
        const lastname = persoonObject.lastname
        const dateOfBirth = persoonObject.date_of_birth
    }
  }, [data])*/

  // mollie payment
  const getParking = async () => {
    /*
   await fetch("/getParking") 
   .then(response => response.json())
   .then((data) => {
       //createOrderInFirestore(data, uid)
       console.log(data)
       console.log("succesvol uitgevoerd")
   })*/
   const respObject = {naam: "ona", email:  "ona.demuytere@icloud.com", reis:"ok", datum:"07/01/2021", boot:"hey", prijs:10, voorschot:2}

   const fetchData = {
                crossDomain: false,
                method: 'POST',
                body: JSON.stringify(respObject),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"  
                },
                credentials: 'include',
                
            }

    // PAYMENT
    await fetch("/sendAppointmentConfirmation", fetchData)
        .then(() => {
            console.log("gelukt om te sturen")
        })
   
}

const handleButton = async () => {
    let amount = 20 //data.order.price

    // nog prijs bij rekenen van belasting en persoonlijk 
    const taxPrice = 0.1 * amount
    const ownPrice = 0.02 * amount
    amount = amount + taxPrice + ownPrice

    const fetchData = {
        crossDomain: false,
        method: 'POST',
        body: JSON.stringify({
            naam: 'Ona',
            amount: amount,
            js:true
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"  
        },
        credentials: 'include',

    } 

    console.log(fetchData)
    
    //console.log(fetchData)
    await fetch("/makePayment",  fetchData) 
    .then(response => response.json())
    .then((data) => {
        //createOrderInFirestore(data, uid)
        console.log(data)
        console.log("succesvol uitgevoerd")
    })
    

    /*axios.post('/makePayment', fetchData).then(function(response){
      console.log(response.data);
    });*/
  }

// CREATE ORDER IN FIREBASE
/*const createOrderInFirestore = async (mollie, uid) => {
    const dataObject = data.order
    dataObject.voorschot = false
    dataObject.timestamp = Date.now()
    dataObject.uid = uid
    dataObject.payed = false
    
    const resp = await addNewHoliday(dataObject) // DATA
    await addIdToElement('orders', resp.id)

    localStorage.setItem('orderId', resp.id)
    localStorage.setItem('order', JSON.stringify(dataObject))
    redirectToPaymentPage(mollie)
}*/

// REDIRECT TO PAYMENT PAGE
/*
const redirectToPaymentPage = (mollie) => {
    window.location = mollie.payment._links.checkout.href
}
*/

  // payment button
  /*const payNow = () =>{ 
    let path = `paymentSuccessful`; 
    history.push(path);
  }*/
  
    return (
        <div>
            <p>Overview met de gegevens: betaling van 20 euro door Ona</p>
            <button onClick={getParking}>Test met get parking</button>
            <button onClick={handleButton}>Pay the moneyzzzzz</button>

        </div>
    )
}


export default MollieElement
