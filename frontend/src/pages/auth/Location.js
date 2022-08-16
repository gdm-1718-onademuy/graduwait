import React, { useEffect, useState, useRef, useMemo } from "react";
import {FormControlLabel, Checkbox, Alert, FormControl, Autocomplete, TextField, Box, Grid, Typography, Button, Select, MenuItem, InputLabel, ButtonTypography, createTheme, ThemeProvider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "../../footer/Footer.js";
import ProgressBar from './components/progressBar.js';
import { useAuthState } from "react-firebase-hooks/auth";
import colors from '../colours.scss';
import LayoutForms from "./components/LayoutForms.js";
import ButtonNewHere from "./components/ButtonNewHere.js";

import {
  auth,
  db,
  getFieldsOfStudy
} from "../../services/config/firebase";


const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
function loadScript(src, position, id) {
    if (!position) {
      return;
    }
  
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
  }
  
  const autocompleteService = { current: null };
  
  export default function Location() {
    const location = useLocation()
    const [value, setValue] = useState("");
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const loaded = useRef(false);
    const [meetingMyAddress, setMeetingMyAddress] = useState(false);
    const [richting, setRichting] = useState('');
    const [fieldsOfStudy, setFieldsOfStudy] = useState("")
    const [user, loading, error] = useAuthState(auth);
    const bijlesGeven = location.state.bijlesGever
    const bijlesKrijgen = location.state.bijlesKrijger
    const firstName = location.state.firstName
    const lastName = location.state.lastName
    const email = location.state.email
    const [errorForm, setErrorForm] = useState("");

    
    const navigate = useNavigate();

    useEffect(async() => {
        const response = await getFieldsOfStudy()
        setFieldsOfStudy(response)
    }, [])

    useEffect(() => {

  
      if (loading) return;
    }, [loading]);


    const next = () => {
      if (value !== "" && richting !== ""){
        navigate(
          '/extra',
          {state: { bijlesKrijger: bijlesKrijgen, bijlesGever: bijlesGeven, richting: richting, location: value, firstName: firstName, lastName: lastName, email: email, meetingMyAddress: meetingMyAddress}}
        )
      } else {
        if (! richting){
          setErrorForm("Please select your field of study and educational institution.")
        } else if (! value) {
          setErrorForm("Please select your home address")
        }
        
      }
    }
  
    if (typeof window !== 'undefined' && !loaded.current) {
      if (!document.querySelector('#google-maps')) {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
          document.querySelector('head'),
          'google-maps',
        );
      }
  
      loaded.current = true;
    }
  
    const fetch = useMemo(
      () =>
        throttle((request, callback) => {
          autocompleteService.current.getPlacePredictions(request, callback);
        }, 200),
      [],
    );

     
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("going next")
    }
  
    useEffect(() => {
      let active = true;
  
      if (!autocompleteService.current && window.google) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
      }
      if (!autocompleteService.current) {
        return undefined;
      }
  
      if (inputValue === '') {
        setOptions(value ? [value] : []);
        return undefined;
      }
  
      fetch({ input: inputValue }, (results) => {
        if (active) {
          let newOptions = [];
  
          if (value) {
            newOptions = [value];
          }
  
          if (results) {
            newOptions = [...newOptions, ...results];
          }
  
          setOptions(newOptions);
        }
      });
  
      return () => {
        active = false;
      };
    }, [value, inputValue, fetch]);
  
    return <>
      <LayoutForms>
        {errorForm ?
          <Grid item xs={12} >
            <Alert severity="error">{errorForm}</Alert>
          </Grid>:
        <></>
        }
            
            <Grid item xs={12}>
            <FormControl fullWidth> 
              <InputLabel variant="outlined" id="richting">Field of study, educational institution</InputLabel>
                <Select
                  fullWidth
                  //sx={{ width: 360 }}
                  variant="outlined"
                  id="richting"
                  value={richting}
                  label="Field of study, educational institution"
                  onChange={(e) => setRichting(e.target.value)}
                >
                  {fieldsOfStudy && fieldsOfStudy.length > 0 && fieldsOfStudy.map((option , id) => (
                    
                  <MenuItem fullWidth key={id} value={option.course_name}>
                  {option.course_name }
                  </MenuItem>
                ))}
                </Select>
                </FormControl>

              </Grid>
               
               {/*
              <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={top100Films}
                autoComplete
                sx={{ width: 400 }}
                renderInput={(params) => <TextField {...params} label="Movie" />}
              />
              </Grid>
                  */}
              
                  
              
              <Grid item xs={12}>
                
              <Autocomplete
                id="google-map-demo"
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.description
                }
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                onChange={(event, newValue) => {
                  setOptions(newValue ? [newValue, ...options] : options);
                  setValue(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField fullWidth {...params} label="Home address" />
                )}
                renderOption={(props, option) => {
                  const matches = option.structured_formatting.main_text_matched_substrings;
                  const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [match.offset, match.offset + match.length]),
                  );
          
                  return (
                    <li {...props}>
                      <Grid container alignItems="center">
                        <Grid item>
                          <Box
                            component={LocationOnIcon}
                            sx={{ color: 'text.secondary', mr: 2 }}
                          />
                        </Grid>
                        <Grid item xs>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={{
                                fontWeight: part.highlight ? 700 : 400,
                              }}
                            >
                              {part.text}
                            </span>
                          ))}
          
                          <Typography variant="body2" color="text.secondary">
                            {option.structured_formatting.secondary_text}
                          </Typography>
                        </Grid>
                      </Grid>
                    </li>
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ m: 1, p: -1}}>
                  <FormControlLabel
                  control={<Checkbox value="meetingMyAddress" color="secondary" />}
                  label="Possibility to meet at my address"
                  id="meetingMyAddress"
                  value={meetingMyAddress}
                  onChange={(e) => 
                    setMeetingMyAddress(!meetingMyAddress)
                  }
              />
            </Grid>

              

              <Grid item xs={12} sx={{ mt: 4 }}>
              <ProgressBar 
                percentage={50}
              />
              </Grid>


              <Grid item xs={12}>
                <Button 
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={next}
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