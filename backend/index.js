// nodeman
const port = process.env.PORT || 8888
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const { auth } = require("./config/Initialize")
const app = express()

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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})