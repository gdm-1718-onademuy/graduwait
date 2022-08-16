import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Alert, TextField, Grid } from '@mui/material';

// components
import ProgressBar from './components/progressBar.js';
import LayoutForms from "./components/LayoutForms.js";
import ButtonNewHere from "./components/ButtonNewHere.js";
import Footer from "../../footer/Footer.js";

// styling
import colors from '../colours.scss';
import "./auth.scss";


import {
  auth,
  registerWithEmailAndPassword
} from "../../services/config/firebase";
import { passwordValidator, emailValidator} from "../../services/functions/validations";



function Register() {
  const location = useLocation()
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [emailExistsInDb, setEmailExistsInDb] = useState(true);
  const [user, loading, error] = useAuthState(auth);
  const [errorForm, setErrorForm] = useState("");
  const bijlesGeven = location.state.bijlesGever
  const bijlesKrijgen = location.state.bijlesKrijger
  const navigate = useNavigate();

  const checkIfEmailExists = async () => {
    // * CREATE FETCH DATA OBJECT 
    let fetchData = {
      crossDomain: false,
      method: 'POST',
      body: JSON.stringify({ 
          email, 
          js:true
      }),
      headers: {
          "Content-Type": "application/json",
      }
    }

    await fetch("/get-user-by-email", fetchData)
    .then(response => response.json())
    .then((data) => {
      setEmailExistsInDb(data)
    })
    .catch((error) => {
      setEmailExistsInDb(error)
    })
  }

  const register = () => {
    // * CHECK IF EMAIL IS UNIQUE 
    
    if (emailExistsInDb === false &&
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== "" &&
      passwordValidator(password) &&
      password === repeatPassword &&
      emailValidator(email)
    ){
      registerWithEmailAndPassword(email, password)
      navigate(
        '/location',
        {state: { bijlesKrijger: bijlesKrijgen, bijlesGever: bijlesGeven, firstName: firstName, lastName: lastName, email: email}}
      )
    } else {
      if (emailExistsInDb !== false){
        setErrorForm("You already have an account with this password. Do you want to login instead?")
      } else if (! emailValidator(email)){
        setErrorForm("Make sure your email is correctly formatted.")
      } else if (! passwordValidator(password)){
        setErrorForm("Make sure the password contains at least 8 characters, including a capital letter and digit.")
      } else if (password !== repeatPassword){
        setErrorForm("Make sure the passwords are identical.")
      } else {
        console.log("not working")
        setErrorForm("Fill in all the fields correctly")
      }
    }
  }

  useEffect(() => {
    //getData()
    if (loading) return;
  }, [user, loading]);

  useEffect(() => {
    if (emailExistsInDb !== true){
      register()
    }
  }, [emailExistsInDb]);

  return <>
    <LayoutForms /*errorRegister={errorRegister}*/>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link to="/" variant="body2">
            Go back   
          </Link>
        </Grid>
      </Grid>
      {errorForm ?
        <Grid item xs={12} >
          <Alert severity="error">{errorForm}</Alert>
        </Grid>:
      <></>
      }
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={
                    (e) => setFirstName(e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  error={! emailValidator(email) || email === ""}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  error={passwordValidator(password) === false ||  password === ""}
                  //helperText={passwordValidator(password) ? '' : 'Please make sure there are at least 8 characters, including a capital letter, a digit and a special sign.'}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="repeat_password"
                  label="Repeat password"
                  type="password"
                  id="repeat_password"
                  //value={password}
                  error={repeatPassword != password}
                  //helperText={passwordValidator(password) ? '' : 'Please make sure there are at least 8 characters, including a capital letter, a digit and a special sign.'}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  //autoComplete="current-password"
                />
              </Grid>

        

              <Grid item xs={12} sx={{ mt: 4 }}>
              <ProgressBar 
                percentage={25}
              />
              </Grid>

              <Grid item xs={12}>
                <Button 
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={checkIfEmailExists}
                  style={{
                    backgroundColor: colors.purple,
                    color: 'white'
                  }}
                >Next</Button>
              </Grid>

              <ButtonNewHere/>


        </LayoutForms> 
        <Footer/>
    </>
}

export default Register;