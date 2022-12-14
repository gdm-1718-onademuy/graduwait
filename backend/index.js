// nodeman
const port = process.env.PORT || 8888
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const { auth } = require("./config/Initialize")
const app = express()
const XMLHttpRequest = require('xhr2');
const cors = require("cors")


//const env = require('dotenv')
//env.config({path:'../.env'})

// request voor api
//var request = require("request")
// mollie importen
//const { createMollieClient } = require("@mollie/api-client")
//const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
//var xhr = new XMLHttpRequest();


require('dotenv').config()


app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, './build')));

// TELL APP THAT THERE WILL BE JSON INPUT 
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))




app.get('/', (req, res) => {
  res.send('Hello World!')
})


// GET USER BY EMAIL
app.post('/get-user-by-email', async (req, res) => {
  
  // * GET EMAIL 
  const {email} = req.body

  // * CHECK IF USER EXIST
  const user_object = await auth.getUserByEmail(email)
  .catch((error) => {}) 
  
  // * RETURN OBJECT
  let response = user_object? user_object : false
  return res.json(response)
})

// GET USER BY UID
app.post('/get-user-by-uid', async (req, res) => {
  
  // * GET EMAIL 
  const {uid} = req.body

  // * CHECK IF USER EXIST
  const user_object = await auth.getUser(uid)
  .catch((error) => {})
  
  // * RETURN OBJECT
  let response = user_object? user_object : false
  return res.json(response)
})



// UPDATE THE USER'S PASSWORD
app.post('/update-password', async (req, res) => {
  
  // * GET EMAIL 
  const {password, uid} = req.body

  // * CHECK IF USER EXIST
  const password_resetting = await auth.updateUser(uid,{
    password: password
  })
  .catch((error) => {})
  
  // * RETURN OBJECT
  let response = password_resetting? password_resetting : false
  return res.json(response)
})

// ORDER CONFIG MAIL  
app.post('/sendAppointmentConfirmation', cors(), (req, res) => {
  //const { naam, vakkenNamen, datum, opmerking, prijs, starthour, endhour, afspraakid, location, emailTutor } = req.body
  const url = "https://api.smtp2go.com/v3/email/send"
  const xhr = new XMLHttpRequest()

  xhr.open("POST", url)
  xhr.setRequestHeader("Accept", "application/json")
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status)
        console.log(xhr.responseText)
    }
  }

  const data = JSON.stringify({
    //"api_key": "api-00580A8A6E3411EC94A5F23C91BBF4A0",
    "api_key": process.env.SMPT_API_KEY,
    "to": [`${naam} <${emailTutor}>`],
    "sender": "Graduwait <info.graduwait@gmail.com>",
    "template_id": "2214556",
    "template_data": {
      
    "tutor_name":naam,
    "date":datum,
    "starthour":starthour,
    "endhour":endhour,
    "subjects":vakkenNamen,
    "opmerking":opmerking,
    //"confirm_url":`http://localhost:3000/agenda/myagenda/${afspraakid}`,
    "confirm_url":`https://graduwait-4g3l4.ondigitalocean.app/dashboard`,
    "price":prijs, 
    //"location": location
    },
    "custom_headers": [
      {
        "header": "Reply-To",
        "value": "Graduwait <info.graduwait@gmail.com"
      }
    ]
  })

  xhr.send(data)
  .then(response => {
    return res.json({resp: false, response})
  })
  .catch(error => {
    return res.json({resp: true, error,})
  })
})

// CANCEL OR CONFIRM MAIL
app.post('/sendCancelorConfirm', cors(), (req, res) => {

  const {status, name, subjects, date, starthour, endhour, opmerking, id, location, template_id, email_to} = req.body
  
  const url = "https://api.smtp2go.com/v3/email/send"
  const xhr = new XMLHttpRequest()

  xhr.open("POST", url)
  xhr.setRequestHeader("Accept", "application/json")
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status)
        console.log(xhr.responseText)
    }
  }

  const data = JSON.stringify({
    //"api_key": "api-00580A8A6E3411EC94A5F23C91BBF4A0",
    "api_key": process.env.SMPT_API_KEY,
    "to": [`${name} <${email_to}>`], // deze nog aanpassen aan daarom niet per see email tutor
    "sender": "Graduwait <info.graduwait@gmail.com>",
    "template_id": template_id,
    "template_data": {
      
    "tutor_name":name,
    "date":date,
    "starthour":starthour,
    "endhour":endhour,
    "subjects":subjects,
    "opmerking":opmerking,
    //"confirm_url":`http://localhost:3000/agenda/myagenda/${afspraakid}`,
    "location": location
    },
    "custom_headers": [
      {
        "header": "Reply-To",
        "value": "Graduwait <info.graduwait@gmail.com>"
      }
    ]
  })

  xhr.send(data)
  .then(response => {
    return res.json({resp: false, response})
  })
  .catch(error => {
    return res.json({resp: true, error,})
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})