import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
//import { Button } from '@material-ui/core';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import {
  auth,
} from "../../services/config/firebase";

// styling
import colors from '../colours.scss';
import "./auth.scss";

// components
import LayoutForms from "./components/LayoutForms.js";
import ButtonNewHere from "./components/ButtonNewHere.js";
import Footer from "../../footer/Footer";


function Welcome() {
  //useContext
  const [isChecked, setIsChecked] = useState(false);

  const [user, loading, error] = useAuthState(auth);
  const [bijlesKrijgen, setBijlesKrijgen] = useState(false);
  const [bijlesGeven, setBijlesGeven] = useState(false);
  const [errorChecked, setErrorChecked] = useState("");
  const navigate = useNavigate();

  const GoToRegister = event => {
    if(bijlesKrijgen || bijlesGeven ){
      navigate(
        '/register',
        {state: { bijlesKrijger: bijlesKrijgen, bijlesGever: bijlesGeven}}
      );
    } else {
      // Je moet minstens 1 aanduiden
      setErrorChecked("You need to atleast select one.")
    }
  }

  useEffect(() => {
    if (loading) return;
    /*if (user) navigate("/dashboard");*/
  }, [user, loading]);

  return <>
      <LayoutForms>
        <Grid item xs={12} sm={12} className="custom-css-welcome-page">
          <div>
          <Box sx={{ mt: 4 }}>
          <Typography component="h4" variant="p">
            Welcome student!
          </Typography>
          <Typography component="p" variant="p">
            We're connecting students make tutoring possible on an easy and efficient way.
            Do you want to be a tutor? 
            Do you want to give tutoring?   
            Or both?
          </Typography>
          </Box>

          { errorChecked && <Alert sx={{ mt: 2, width: '100%' }} severity="error">{errorChecked}</Alert>}

          <Box component="form" noValidate sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={20} sx={{ m: 1, p: -1}} >
            <FormControlLabel
                control={<Checkbox value="bijlesKrijgen" color="secondary" />}
                label=" I want to get tutored."
                id="krijgen"
                value={bijlesKrijgen}
                onChange={(e) => 
                  setBijlesKrijgen(!bijlesKrijgen)
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ m: 1, p: -1}} >
            <FormControlLabel
                control={<Checkbox value="bijlesGeven" color="secondary"/>}
                value={bijlesGeven}
                id="geven"
                onChange={(e) => 
                  setBijlesGeven(!bijlesGeven)
                }
                label=" I want to tutor."
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3}}>
              <Button 
                type="button"
                fullWidth
                variant="contained"
                onClick={GoToRegister}
                color="primary"
                style={{
                  backgroundColor: colors.purple,
                  color: 'white'
                }}
              >Let's go!</Button>
          </Grid>

          </Box>

          <ButtonNewHere></ButtonNewHere>
          </div>
      </Grid>
    </LayoutForms>
    <Footer/>
  </>
}

export default Welcome;