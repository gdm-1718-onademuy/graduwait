import React, { useEffect, useState } from "react";

import LayoutForms from "./components/LayoutForms.js";
import { emailValidator} from "../../services/functions/validations";
import { Link, useNavigate, useLocation } from "react-router-dom";


//import { Button } from '@material-ui/core';
import { Button, Alert, TextField, Grid, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';

import colors from '../colours.scss';
import "./auth.scss";

import { passwordResetLinkEmail } from "../../services/config/firebase.js";
import { color } from "@mui/system";


function Forgot() {
    const [errorForm, setErrorForm] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendMail, setSendMail] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [buttonToLogin, setButtonToLogin] = useState(false);
    const navigate = useNavigate();


    const passwordResetLinkEasyWay = async () => {
        console.log(await passwordResetLinkEmail(email))
        if (await passwordResetLinkEmail(email) === true){
            setErrorForm("")
            //setLoading(false)
            setIsSent(true)
            setButtonToLogin(true)
        } else {
            setErrorForm("Unable to send mail, try again later")
        }
        setLoading(false)
    }

    const sendMailForNewPassword = async () => {
        console.log("sending mail for new password")
        
        let response

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
        response = data
        })
        .catch((error) => {
        response = error
        })

        if (response !== false &&
            email !== "" &&
            emailValidator(email))
        {
            setLoading(true)
            console.log("oke verzend een mail")
            passwordResetLinkEasyWay()

        } else {
            if (email === ""){
                setErrorForm("Fill in your email")
            } else if (! emailValidator(email)){
                setErrorForm("Make sure your email is correctly formatted")
            } else if (response === false){
                setErrorForm("This email doesn't exist in our database. Register instead?")
            } 
        }
    }   

    return <>
        <LayoutForms>
            <Grid item xs={12} sm={12} className="custom-css-welcome-page">
            <div>
            
            {isSent === true &&
                <Grid item xs={12} > 
                    <Alert severity="success">The email is sent! Check your mailbox.</Alert>
                </Grid>
            }
            { errorForm &&  
                <Grid item xs={12} > 
                    <Alert sx={{ mt: 2 }} severity="error">{errorForm}</Alert> 
                </Grid>
            }


            <Box sx={{ mt: 4 }}>
   
                
            <Typography component="h4" variant="p">
                Forgot your password?
            </Typography>
            <Typography component="p" variant="p">
                Fill in your email, and we'll send you an email to create a new password.
            </Typography>
            </Box>

            <Box component="form" noValidate sx={{ mt: 3, width: '100%' }}>
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

            <Grid item xs={12} sx={{ mt: 3}}>
                {loading? 
                <Button 
                   type="button"
                   fullWidth
                   variant="outlined"
                   //onClick={() => setSendMail(true)}
                   onClick={sendMailForNewPassword}
                   color="primary"
                   disabled
                   style={{
                   //backgroundColor: colors.purple,
                   color: color.purple
                   }}
                   >Sending mail ...
               </Button>
                :
                <Button 
                    type="button"
                    fullWidth
                    variant="contained"
                    //onClick={() => setSendMail(true)}
                    
                    //onClick={sendMailForNewPassword}

                    onClick= 
                        {buttonToLogin?
                            () => navigate('/login')
                            :
                            sendMailForNewPassword
                            }
                    
                    color="primary"
                    style={{
                    backgroundColor: colors.purple,
                    color: 'white'
                    }}
                    >
                        {buttonToLogin?
                        "Go back to login"
                        :
                        "Send link to setup a new password"
                        }
                </Button>
                }
         
            </Grid>

            </Box>

            </div>
        </Grid>
        </LayoutForms>
    </>

}

export default Forgot;
