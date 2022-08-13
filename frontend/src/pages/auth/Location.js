import React, { useEffect, useState, useRef, useMemo } from "react";
import {FormControlLabel, Checkbox, Alert, FormControl, Autocomplete, TextField, Box, Grid, Typography, Button, Select, MenuItem, InputLabel, ButtonTypography, createTheme, ThemeProvider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { Link, useNavigate, useLocation } from "react-router-dom";

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
    </>
  }

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
    {
      label: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { label: 'City of God', year: 2002 },
    { label: 'Se7en', year: 1995 },
    { label: 'The Silence of the Lambs', year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: 'Life Is Beautiful', year: 1997 },
    { label: 'The Usual Suspects', year: 1995 },
    { label: 'Léon: The Professional', year: 1994 },
    { label: 'Spirited Away', year: 2001 },
    { label: 'Saving Private Ryan', year: 1998 },
    { label: 'Once Upon a Time in the West', year: 1968 },
    { label: 'American History X', year: 1998 },
    { label: 'Interstellar', year: 2014 },
    { label: 'Casablanca', year: 1942 },
    { label: 'City Lights', year: 1931 },
    { label: 'Psycho', year: 1960 },
    { label: 'The Green Mile', year: 1999 },
    { label: 'The Intouchables', year: 2011 },
    { label: 'Modern Times', year: 1936 },
    { label: 'Raiders of the Lost Ark', year: 1981 },
    { label: 'Rear Window', year: 1954 },
    { label: 'The Pianist', year: 2002 },
    { label: 'The Departed', year: 2006 },
    { label: 'Terminator 2: Judgment Day', year: 1991 },
    { label: 'Back to the Future', year: 1985 },
    { label: 'Whiplash', year: 2014 },
    { label: 'Gladiator', year: 2000 },
    { label: 'Memento', year: 2000 },
    { label: 'The Prestige', year: 2006 },
    { label: 'The Lion King', year: 1994 },
    { label: 'Apocalypse Now', year: 1979 },
    { label: 'Alien', year: 1979 },
    { label: 'Sunset Boulevard', year: 1950 },
    {
      label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { label: 'The Great Dictator', year: 1940 },
    { label: 'Cinema Paradiso', year: 1988 },
    { label: 'The Lives of Others', year: 2006 },
    { label: 'Grave of the Fireflies', year: 1988 },
    { label: 'Paths of Glory', year: 1957 },
    { label: 'Django Unchained', year: 2012 },
    { label: 'The Shining', year: 1980 },
    { label: 'WALL·E', year: 2008 },
    { label: 'American Beauty', year: 1999 },
    { label: 'The Dark Knight Rises', year: 2012 },
    { label: 'Princess Mononoke', year: 1997 },
    { label: 'Aliens', year: 1986 },
    { label: 'Oldboy', year: 2003 },
    { label: 'Once Upon a Time in America', year: 1984 },
    { label: 'Witness for the Prosecution', year: 1957 },
    { label: 'Das Boot', year: 1981 },
    { label: 'Citizen Kane', year: 1941 },
    { label: 'North by Northwest', year: 1959 },
    { label: 'Vertigo', year: 1958 },
    {
      label: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { label: 'Reservoir Dogs', year: 1992 },
    { label: 'Braveheart', year: 1995 },
    { label: 'M', year: 1931 },
    { label: 'Requiem for a Dream', year: 2000 },
    { label: 'Amélie', year: 2001 },
    { label: 'A Clockwork Orange', year: 1971 },
    { label: 'Like Stars on Earth', year: 2007 },
    { label: 'Taxi Driver', year: 1976 },
    { label: 'Lawrence of Arabia', year: 1962 },
    { label: 'Double Indemnity', year: 1944 },
    {
      label: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { label: 'Amadeus', year: 1984 },
    { label: 'To Kill a Mockingbird', year: 1962 },
    { label: 'Toy Story 3', year: 2010 },
    { label: 'Logan', year: 2017 },
    { label: 'Full Metal Jacket', year: 1987 },
    { label: 'Dangal', year: 2016 },
    { label: 'The Sting', year: 1973 },
    { label: '2001: A Space Odyssey', year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: 'Toy Story', year: 1995 },
    { label: 'Bicycle Thieves', year: 1948 },
    { label: 'The Kid', year: 1921 },
    { label: 'Inglourious Basterds', year: 2009 },
    { label: 'Snatch', year: 2000 },
    { label: '3 Idiots', year: 2009 },
    { label: 'Monty Python and the Holy Grail', year: 1975 },
  ];
  