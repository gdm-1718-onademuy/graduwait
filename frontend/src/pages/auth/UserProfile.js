import React, { useEffect, useState, useRef, useMemo } from "react";
import throttle from 'lodash/throttle';
import "./UserProfile.scss";

// birthday
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { useAuthState } from "react-firebase-hooks/auth";
import LoggedIn from "../auth/components/LoggedIn";
import { CssBaseline, Box, Container, Typography, Grid, Paper, View} from '@mui/material';
import Title from '../Client/components/Title'; 
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, Rating, Link, Alert, Avatar, Autocomplete} from '@mui/material';

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import parse from 'autosuggest-highlight/parse';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {useTranslation} from 'react-i18next';
import LayoutForms from "./components/LayoutForms";
import colors from '../colours.scss';
import { passwordValidator, emailValidator} from "../../services/functions/validations";
import { reload, updatePassword } from "firebase/auth";
import ButtonNewHere from "./components/ButtonNewHere";
import {
  auth, getFieldsOfStudy, saveNewPassword, getUserData, getReviews, addDataUser, changeTutoring, addKostUser
} from "../../services/config/firebase";


function UserProfile() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation()
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
 // const [woonplaats, setWoonplaats] = useState("");
  const [value, setValue] = useState(null);
  const [richting, setRichting] = useState("");
  const [locatie, setLocatie] = useState("");
  const [kost, setKost] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [birthday, setBirthday] = useState();
  const [birthdayToShow, setBirthdayToShow] = useState();
  const [birthdaysHighschool, setBirthdaysHighschool] = useState("");
  const [reviews, setReviews] = useState([])
  const [reviewsWithout, setReviewsWithout] = useState([])
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const loaded = useRef(false);
  const [fieldsOfStudy, setFieldsOfStudy] = useState("")
  const [change, setChange] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [isTutor, setIsTutor] = useState(false);
  const [isTutee, setIsTutee] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [popUpExtraInfo, setPopUpExtraInfo] = useState(false);
  const [addKost, setAddKost] = useState()

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState("");
  const [newPasswordAdding, setNewPasswordAdding] = useState(false);



  const [errorForm, setErrorForm] = useState("");


  const { t } = useTranslation()

  const tutorChange = async (event, toDo) => {
    event.preventDefault()
    // als TUTOR WORDEN -> DAN ZORGEN DAT JE PRIJS, EN NOG WAT DINGEN TOEVOEGT
    if (toDo = "enableTutoring"){
      setPopUpExtraInfo(true)
    } else {
      await changeTutoring(user.uid, toDo)
      setRefresh(true)
    }
    
    //console.log(response)
   // setFieldsOfStudy(response)

    //const isChanged = await changeTutoring(user.uid, toDo)
    //console.log(await changeTutoring(user.uid, toDo))
  }

  useEffect(async() => {
    if (popUpExtraInfo === true){
      console.log("popup extra info")
    }
   
  }, [popUpExtraInfo])


  useEffect(async() => {
    console.log(refresh)
    if (refresh === true){
      const userData = await getUserData(user.uid)
      if (userData.getTutoring){
        setIsTutee(true)
      }
      if (userData.giveTutoring){
        setIsTutor(true)
      }
      setRefresh(false)
    } 
    
  }, [refresh])



  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

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

  /*const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );*/


/*
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (user){
      fetchUserName()
      if(reviews.length >0){
        console.log(reviews)
      }

      console.log(isTutor)
      console.log(isTutee)
      //console.log(reviews[0].object.from.person_from.firstname)
    }
  }, [user, loading]);*/

  useEffect(async() => {
    // get the users data
    if (user){
      console.log(user.uid)
      const userData = await getUserData(user.uid)
      setEmail(userData.email)
      setFirstName(userData.firstname)
      setLastName(userData.lastname)
      setLocatie(userData.woonplaats)
      setAvatar(userData.avatar)
      setRichting(userData.richting)
      setBirthday(userData.birthday.toDate().toISOString().split('T')[0])
      setBirthdayToShow(userData.birthday.toDate().toISOString().split('T')[0])
      if (userData.getTutoring){
        setIsTutee(true)
      }
      if (userData.giveTutoring){
        setKost(userData.kost)
        setIsTutor(true)
      }
  
      // get the fields of study
      const fieldsStudyData = await getFieldsOfStudy()
      setFieldsOfStudy(fieldsStudyData)
  
      // get the reviews 
      const reviewsDataWithout = await getReviews(user.uid)
      setReviewsWithout(reviewsDataWithout)
      //console.log(reviewsData)
    }

}, [loading, user])


  useEffect(async() => {
    if (reviewsWithout.length > 0){
      for (const review of reviewsWithout) {
        const response = await getUserData(review.from)
        const reviewData = {
          from_uid : review.from,
          from_name : response.firstname + " " + response.lastname,
          stars : review.sterren,
          date : review.date.toDate().toISOString().split('T')[0],
          description : review.omschrijving
        }
        if (response.avatar) {
          reviewData.avatar = response.avatar
        }
        setReviews(reviews => reviews.concat(reviewData))
      }
    }
  }, [reviewsWithout])

  const slaGegevensOp = () => {
    addDataUser(email, user.uid, firstName, lastName, isTutee, isTutor, richting, locatie, kost, birthday, avatar)
    // save gegevens
    // connectie met firestore save data
    //console.log(lastName, firstName)
    //console.log("gegevens")
    //setChange(false)
  }

  const doAddCost = async () => {
    if(addKost !== ""){
      await addKostUser(user.uid, addKost)
      await changeTutoring(user.uid, "enableTutoring")
      setPopUpExtraInfo(false)
      setRefresh(true)
      
    }
  }

  const saveNewPassword =  () => {
    if (newPassword !== "" &&
    repeatPassword !== "" &&
    passwordValidator(newPassword) &&
    newPassword === repeatPassword 
  ){
    //saveNewPassword()
    console.log("save new password")
    setNewPasswordAfterValidation()
    //newPasswordAdding(true)
  } else {
    if (! passwordValidator(newPassword)){
      setErrorForm("Make sure the password contains at least 8 characters, including a capital letter and digit.")
    } else if (newPassword !== repeatPassword){
      setErrorForm("Make sure the passwords are identical.")
    } else {
      setErrorForm("Fill in all the fields correctly")
    }
  }
  }


  const setNewPasswordAfterValidation = async () => {
      // * CREATE FETCH DATA OBJECT 
      let fetchData = {
        crossDomain: false,
        method: 'POST',
        body: JSON.stringify({ 
            password: newPassword, 
            uid:user.uid,
            js:true
        }),
        headers: {
            "Content-Type": "application/json",
        }
      }

      await fetch("/update-password", fetchData)
      .then(response => response.json())
      .then((data) => {
        setPasswordUpdated(data)
        setNewPasswordAdding(false)
        cancel()
      })
      .catch((error) => {
        setPasswordUpdated(error)
      })
        
    }
  

  useEffect(async() => {
    if (passwordUpdated !== false){
      // dan
      // TO DO: hier nog een verificatie zoals bij dashboard! 
      setChange(false)
      setChangePassword(false)
    } else {
      // TO DO: een error zetten dat het niet is gelukt
    }
  }, [passwordUpdated])

  const cancel = () => {
    setChange(false)
    setChangePassword(false)
    setPopUpExtraInfo(false)
    user.reload()
  }

  const ChangePassword = () => {
    return(
      <>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            {errorForm ?
              <Grid item xs={12} >
              <Alert severity="error">{errorForm}</Alert>
            </Grid>:
            <></>
            }
        
              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.9')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  name="newPassword"
                  label={t('Userdata.9')}
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  error={passwordValidator(newPassword) === false ||  newPassword === ""}
                  //helperText={passwordValidator(password) ? '' : 'Please make sure there are at least 8 characters, including a capital letter, a digit and a special sign.'}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.10')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  name="repeatPassword"
                  label={t('Userdata.10')}
                  type="password"
                  id="repeatPassword"
                  value={repeatPassword}
                  error={repeatPassword != newPassword}
                  //helperText={passwordValidator(password) ? '' : 'Please make sure there are at least 8 characters, including a capital letter, a digit and a special sign.'}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  //autoComplete="current-password"
                />
              </Grid>
            </Grid>
             
            <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
                <Button 
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={saveNewPassword}
                  style={{
                    backgroundColor: colors.purple,
                    color: 'white'
                  }}
                >{t('Buttons.5')} </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={cancel}
                  style={{
                    color: colors.purple,
                    //color: 'white'
                  }}
                > {t('Buttons.6')}          
                </Button>
              </Grid>
            </Grid>
          </Box>
      </>
    )
  }

  const onChange = (e) => {
    const {name, value} = e.target
    setLastName(value)
  }

  const PopUp = () => {
    return (
    <>
    <Container component="main" maxWidth="xs">
      <Box
          sx={{
          marginTop: 4,
          display: 'block',
          flexDirection: 'column',
          alignItems: 'center',
          verticalAlign: 'middle'
        }}
      >   
          <Paper
            sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '85vh',                        
            overflow: 'auto',
            }}
        >
          
          <Box
          sx={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
      <Grid container justifyContent="flex-end">
        </Grid>
          {errorForm ?
            <Grid item xs={12} >
            <Alert severity="error">{errorForm}</Alert>
          </Grid>:
          <></>
          }
          <Box component="form" noValidate autoComplete="off" /*onSubmit={handleSubmit}*/ sx={{ mt: 6 }}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
                <p>{t('Userdata.14')}</p>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="kost"
              label={t('Userdata.13')}
              name="kost"
              autoComplete="kost"
              value={addKost}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 20 } }}
              onChange={(e) => {
                if(e.target.value <= 20){
                  setAddKost(e.target.value)
                } 
              }
              }
            />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="button"
                fullWidth
                variant="contained"
                onClick={doAddCost}
                style={{
                  backgroundColor: colors.purple,
                  color: 'white'
                }}
              >{t('Buttons.7')}</Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={cancel}
                  style={{
                    color: colors.purple,
                    //color: 'white'
                  }}
                > {t('Buttons.6')}          
                </Button>
              </Grid>
            </Grid>
            </Box>
            </Box>
          </Paper>
          </Box>
          </Container>

    </>
    )
  }

  const EditGegevensUser = () => (

    <>
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <p>{t('Userdata.3')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <p>{email}</p>
              </Grid>

              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.1')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                value={firstName}
                id="firstName"
                label={t('Userdata.1')}
                name="firstName"
                autoComplete="firstName"
                // autoFocus
                onChange={(e) => setFirstName(e.target.value)}
              />
              </Grid>

              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.2')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                value={lastName}
                id="lastName"
                label={t('Userdata.2')}
                name="lastName"
                // autoComplete="lastName"
                // autoFocus
                onKeyDown={onChange}
              />
              </Grid>
              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.12')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    required
                    label="Birthday"
                    inputFormat="dd/MM/yyyy"
                    maxDate={birthdaysHighschool}
                    value={birthday}
                    onChange={(e) => setBirthday(e)}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </Grid>

              
              
              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.4')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
              <Autocomplete
                id="google-map-demo"
                //fullWidth
                //sx={{ width: 350 }}
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
                  <TextField {...params} label="Location" fullWidth />
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
              
              {/*
              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.5')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  //sx={{ width: 360 }}
                  variant="outlined"
                  id="richting"
                  value={richting}
                  label={t('Userdata.5')}
                  onChange={(e) => setRichting(e.target.value)}
                >
                  {fieldsOfStudy && fieldsOfStudy.length > 0 && fieldsOfStudy.map((option , id) => (
                  <MenuItem key={id} value={option.course_name}>
                  {option.course_name }
                  </MenuItem>
                ))}
                </Select>
              </Grid>
                  */}
                  

              {isTutor?
              <>
              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.6')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
              <TextField
                    required
                    fullWidth
                    id="kost"
                    label={t('Userdata.6')}
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
              </>
              :
              <></>
              }


            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
                <Button 
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={slaGegevensOp}
                  style={{
                    backgroundColor: colors.purple,
                    color: 'white'
                  }}
                >{t('Buttons.5')} </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={cancel}
                  style={{
                    color: colors.purple,
                    //color: 'white'
                  }}
                > {t('Buttons.6')}          
                </Button>
              </Grid>
            </Grid>
          </Box>
    </>
  )

  const GegevensUser = () => (
    <>
    
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
        <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              m: 1,
            }}
          >
              {avatar ?
                      <Avatar
                      alt={firstName}
                      src={avatar}
                    sx={{ 
                        width: 100, 
                        height: 100,
                      }}
                  
                    />
                :
                  <Avatar sx={{ bgcolor: "purple", width: 100, height: 100 }}>{firstName.charAt(0)}{lastName.charAt(0)}</Avatar>
                } 
              </Box>
                
            <Grid container spacing={0}>
            
              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.1')}</p>
              </Grid> 
              <Grid item xs={12} sm={8}>  
                <p>{firstName}</p>
              </Grid>

              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.2')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <p>{lastName}</p>
              </Grid>

              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.3')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <p>{email}</p>
              </Grid>

              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.12')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <p>{birthdayToShow}</p>
              </Grid>

              

              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.4')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                <p>{locatie}</p>
              </Grid>

              <Grid item xs={12} sm={4}>
                <p>{t('Userdata.5')}</p>
              </Grid>
              <Grid item xs={12} sm={8}>
                    <p>{richting}</p>
                  </Grid>
              {isTutor ? 
                <>
                  <Grid item xs={12} sm={4}>
                    <p>{t('Userdata.6')}</p>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <p>{kost}</p>
                  </Grid>
                </>
                : <></>
              }

            </Grid>

              <Grid item xs={12}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                 //sx={{ mt: 3, mb: 2 }}
                  style={{
                    backgroundColor: colors.purple,
                    color: 'white'
                  }}
                  onClick={(e) => {setChange(true)}}
                > 
                {t('Buttons.3')}       
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ mt: 1}}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  //sx={{ mt: 3, mb: 2 }}
                  style={{
                    backgroundColor: colors.purple,
                    color: 'white'
                  }}
                  onClick={(e) => {{setChange(true)
                    setChangePassword(true)}}}
                > 
                {t('Buttons.4')}         
                </Button>
              </Grid>

          </Box>
    </>
  )




  return (
    <>
    {!popUpExtraInfo ?
    <>

    <LoggedIn/>
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={5} lg={5}>
                <Paper sx={{ 
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '80vh',
                        overflow: 'auto'
                        }}>
                  <Title>User profile</Title>
                  <Stack direction="row" spacing={2}>
                  {/*<Avatar >N</Avatar>*/}
                  { change  && change ?
                    changePassword && changePassword ?
                      <ChangePassword/>
                    :
                      <EditGegevensUser />
                  
                  :
                    <GegevensUser />  
                  }
                  
                </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={7} lg={7}>
                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    height: '10vh',
                    overflow: 'auto',
                    margin: "0 0 30px 0",
                    }}
                >
                  {isTutor? 
                    <Button
                    //blue 
                    type="button"
                    fullWidth
                    variant="outlined"
                    onClick={event => tutorChange(event, "disableTutoring")}
                    style={{
                      color: colors.blue,
                    }}
                    >{t('Profile.3')}
                    </Button>
                  :
                    <Button
                    //blue 
                    type="button"
                    fullWidth
                    variant="contained"
                    onClick={event => tutorChange(event, "enableTutoring")}
                    style={{
                      backgroundColor: colors.blue,
                      color: 'white'
                    }}
                    >
                    {t('Profile.1')}
                    </Button>
                  }

                  {isTutee?
                    <Button
                    //blue 
                    type="button"
                    fullWidth
                    variant="outlined"
                    onClick={event => tutorChange(event, "disableGettingTutored")}
                    style={{
                      //backgroundColor: colors.purple,
                      color: colors.purple
                    }}
                    //purple
                    >
                      {t('Profile.4')}
                    </Button>
                  :
                    <Button
                    //blue 
                    type="button"
                    fullWidth
                    variant="contained"
                    onClick={event => tutorChange(event, "enableGettingTutored")}
                    style={{
                      backgroundColor: colors.purple,
                      color: 'white'
                    }}>{t('Profile.2')}
                    </Button>
                  }
                </Paper>

                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '65.3vh',
                    overflow: 'auto',
                    }}
                >
                <Title>{t('Userdata.11')}</Title>
                {reviews && reviews.length > 0 && reviews.map(review => (
                                    
                  <Card key={review.from_uid}>
                    <div> 
                      <CardHeader
                      avatar={<Avatar src={review.avatar} />}
                      title={review.from_name}
                      />  
                      <CardContent> 
                        <Rating value={review.stars} max={5} readOnly />
                        <Typography component="p">
                          {review.description}
                        </Typography>
                        <Typography component="p">
                          {review.date}
                        </Typography>
                      </CardContent>
                    </div>
                  </Card>
                ))}

                </Paper>
              </Grid>
              </Grid>

        </Container>
      </Box>
      </Box>
    </>
    :
    <PopUp/>
    }
    </>

  );
}
export default UserProfile;
//{review.object.from.person_from.firstname} 