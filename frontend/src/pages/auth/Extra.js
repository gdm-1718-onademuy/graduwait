import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Alert, TextField, Grid, Button, InputLabel} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// components
import LayoutForms from "./components/LayoutForms.js";
import ProgressBar from './components/progressBar.js';
import ButtonNewHere from "./components/ButtonNewHere.js";

// styling
import colors from '../colours.scss';
import "./auth.scss";

// firebase
import {
  auth,
  //registerWithEmailAndPassword,
  storage, 
  addDataUser
} from "../../services/config/firebase";


function Extra() {
  const location = useLocation()
  const [kost, setKost] = useState("");
  const [avatar, setAvatar] = useState("");
  //const [birthday, setBirthday] = useState(new Date('2003-01-01T01:00:00'));
  const [percentage, setPercentage] = useState(0);
  const [user, loading, error] = useAuthState(auth);
  const bijlesGeven = location.state.bijlesGever
  const bijlesKrijgen = location.state.bijlesKrijger
  const richting = location.state.richting
  const geolocation = location.state.location
  const firstName = location.state.firstName
  const lastName = location.state.lastName
  const email = location.state.email
  const [birthday, setBirthday] = useState("");
  const [birthdaysHighschool, setBirthdaysHighschool] = useState("");
  const [errorForm, setErrorForm] = useState("");


  const handleChange = (newBirthday) => {
    setBirthday(newBirthday);
  };

  const navigate = useNavigate();

  const go_dashboard = () => {
    //addDataUser(email, user.uid, firstName, lastName, bijlesKrijgen, bijlesGeven, richting, geolocation, kost, birthday, avatar)
    if (birthday !== ""){
      if (bijlesGeven === true){
          if (birthday.getTime() < birthdaysHighschool.getTime()){
            if (bijlesGeven){
              if (kost !== ""){
                addDataUser(email, user.uid, firstName, lastName, bijlesKrijgen, bijlesGeven, richting, geolocation, kost, birthday, avatar)
                navigate(
                  '/dashboard',
                )
              } else {
                setErrorForm("Choose a price per hour to earn by tutoring.")
              }
            } else {
                addDataUser(email, user.uid, firstName, lastName, bijlesKrijgen, bijlesGeven, richting, geolocation, kost, birthday, avatar)
                navigate(
                  '/dashboard',
                )
            }
          } else {
            setErrorForm("You should be born on " + birthdaysHighschool.toISOString().split('T')[0] + " or earlier.")
          }
      }
    } else {
      setErrorForm("Fill in your birthday.")
    }
    
    //registerWithEmailAndPassword(email, password, firstName, lastName, woonplaats, kost, locatie, richting, bijlesGeven, bijlesKrijgen, avatar);
  }


  useEffect(() => {
    console.log(avatar)
  }, [avatar]);

  useEffect(() => {
    let year_today = new Date().getFullYear() 
    let year_highschool = year_today-16

    setBirthdaysHighschool(new Date(year_highschool + '-12-31'));
    //setBirthday(new Date(year_highschool + '-12-31'))
  }, []);

  const onFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0]
    const storageRef = storage.ref()
    const fileRef = storageRef.child(file.name)
    await fileRef.put(file)
    setAvatar(await fileRef.getDownloadURL())
  }



  return <>
    { (bijlesGeven || bijlesKrijgen) ? (
        <LayoutForms>
          <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/location" variant="body2">
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

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    required
                    label="Birthday"
                    inputFormat="dd/MM/yyyy"
                    maxDate={birthdaysHighschool}
                    value={birthday}
                    onChange={handleChange}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                  </LocalizationProvider>
                </Grid>
              
              {bijlesGeven ? 
                  <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="kost"
                    label="Price per hour for tutoring. (not above €20)"
                    name="kost"
                    autoComplete="kost"
                    value={kost}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 20 } }}
                    onChange={(e) => {
                      if(e.target.value <= 20){
                        setKost(e.target.value)
                      } 
                    }
                    }
                  />
                </Grid>
              : <></>}

              <Grid item xs={12}>
              <InputLabel>Select a profile picture</InputLabel>
              </Grid>
              <Grid item xs={12}>
                <input
                    accept="image/*"
                    className="hey"
                    fullWidth
                    //style={{ display: 'none' }}
                    id="avatar"
                    multiple
                    type="file"
                    name="avatar" 
                    onChange={onFileChange}
                />
              </Grid>      

              <Grid item xs={12} sx={{ mt: 4 }}>
              <ProgressBar 
                percentage={75}
              />
              </Grid>

              <Grid item xs={12}>
              <Button 
                type="button"
                fullWidth
                variant="contained"
                onClick={go_dashboard}
                style={{
                  backgroundColor: colors.purple,
                  color: 'white'
                }}
              >Next</Button>
              </Grid>

              <ButtonNewHere/>

        </LayoutForms>

 
      ) : (
        <span>Loading</span>
      )}    
    </>
}

export default Extra;