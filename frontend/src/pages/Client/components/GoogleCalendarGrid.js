import React, { useState, useEffect, handleClientLoad } from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { styled, Box } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { TextField, Select, Snackbar, MenuItem, Checkbox, FormGroup, Grid, Modal, ButtonGroup, Button, Switch, FormControlLabel, Paper, Alert, Typography}  from '@mui/material';
import Title from './Title';
import {useTranslation} from 'react-i18next';
import {
  auth, editAppointment, getAppointmentsUser, getUserData, makeAppointment
} from "../../../services/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import './GoogleCalendar.scss';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const label = { inputProps: { 'aria-label': 'Switch demo' } };



const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid white',
  boxShadow: 24,
  p: 4,
};

//import googleCalendarPlugin from '@fullcalendar/google-calendar' // a plugin!


// nu gwn kijken welke agenda dit is en dingen toevoegen 
// -> https://dev.to/nouran96/google-calendar-events-with-react-544g

export default function GoogleCalendarGrid(props) {
  // Declare a new state variable, which we'll call "count"

  //const scopes ="https://www.googleapis.com/auth/userSinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";
  const scopes ="https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";
  const [user, loading, error] = useAuthState(auth);
  const [events, setEvents] = useState(null);
  /*const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const name = "ona";
  const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
  const api_key = process.env.GOOGLE_API_KEY*/
  const gapi = window.gapi
  const CLIENT_ID = "901790934116-p1qqbqv7peieeir28llvh6hu3pfd1g8f.apps.googleusercontent.com"
  const CLIENT_SECRET = "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"
  const NAME = "ona";
  const REFRESH_TOKEN = "1//04TZz01KmeylyCgYIARAAGAQSNwF-L9IrY0XHLA35lZxTkqVam7zdzDBTXSOIz9Ga_hnG1LlzoJcPOsyMX9LY8mt0mDLr-O-q2Vs"
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"
  const [openEvent, setOpenEvent] = React.useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation()
  const weekdays = [1, 2, 3, 4, 5, 6, 7]
  const [days, setDays] = useState({});
  const [vrijeTijd, setVrijeTijd] = useState()
  const [schema, setSchema] = useState()
  const [showEvent, setShowEvent] = useState(false)
  const [afspraakarray, setAfspraakarray] = useState([])
  const [afspraakid, setAfspraakid] = useState()
  const [isTutorEvent, setIsTutorEvent] = useState()
  const [fullname, setFullname] = useState()
  const [firstname, setFirstname] = useState()
  const [vakken, setVakken] = useState([])
  const [isTutor, setIsTutor] = useState("")
  const [isTutee, setIsTutee] = useState("")
  const [popUpDetail, setPopUpDetail] = useState(false)
  const [appointmentId, setAppointmentId] = useState("")
  const [appointmentDetails, setAppointmentDetails] = useState()
  const [showAgenda, setShowAgenda] = useState(false)
  const [isOwnAgenda, setIsOwnAgenda] = useState()
  const [person, setPerson] = useState()
  const [subjectids, setSubjectids] = useState()
  const [userid, setUserid] = useState()
  const [otherIsTutor, setOtherIsTutor] = useState()
  const [otherIsTutee, setOtherIsTutee] = useState()
  const [modalAppointment, setModalAppointment] = useState(false)
  const [date, setDate] = useState()
  const [starthour, setStarthour] = useState()
  const [endhour, setEndhour] = useState()
  const [subjects, setSubjects] = useState([])
  const [ok, setOk] = useState(false)
  const [opmerking, setOpmerking] = useState()
  const [checkedVakken, setCheckedVakken] = useState({})
  const [minDate, setMinDate] = useState()
  const [errorForm, setErrorForm] = useState("");
  const [location, setLocation] = useState("");
  const [possibleLocations, setPossibleLocations] = useState([{label:"Online", value:"online"}])
  const [scheduleAppointment, setScheduleAppointment] = useState(false)
  const [rate, setRate] = useState()
  const [emailTutor, setEmailTutor] = useState()
  const [tuteeName, setTuteeName] = useState()
  const [tutorName, setTutorName] = useState()
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [locationAppointment, setLocationAppointment] = useState();


  // modal
  const [open, setOpen] = useState(false);
  const handleOpen = (args) => {
    if(args.event.title !== "NA"){
      setAppointmentId(args.event.id)
      setOpen(true);
    }
  }
  const handleClose = () => setOpen(false);


  
  useEffect( () => {
    //console.log(Object.keys(props).length === 0)
    if(Object.keys(props).length !== 0){
      setPerson(props.person)
      setUserid(props.userid)
      setSubjectids(props.subjectids)
      setOtherIsTutor(props.isTutor)
      setOtherIsTutee(props.isTutee)
      setRate(props.rate)
      setEmailTutor(props.emailTutor)
      setIsOwnAgenda(false)
    } else {
      setIsOwnAgenda(true)
    }
  }, [props]);

  useEffect(async () => {
    if (appointmentId !== ""){
      const detailData = await events.find(event => {
        return event.id === appointmentId
      })
      setAppointmentDetails(detailData)

      const tuteeData = await getUserData(detailData.tuteeid)
      const tutorData = await getUserData(detailData.tutorid)
      if (tutorData && tuteeData){
        //console.log(tuteeData.firstname, tuteeData.lastname)
        setTuteeName(tuteeData.firstname + " " + tuteeData.lastname)
        setTutorName(tutorData.firstname + " " + tutorData.lastname)

        if (detailData.location === "tutor"){
          setLocationAppointment(tutorData.woonplaats)
        } else if (detailData.location === "tutee"){
          setLocationAppointment(tuteeData.woonplaats)
        } else {
          setLocationAppointment("online")
        }
      }


    }
  }, [appointmentId]);

  useEffect( () => {
    console.log(open)
  }, [open]);

  useEffect( () => {
    console.log(locationAppointment)
  }, [locationAppointment]);

  /*useEffect(async () => {
    //console.log(user)
    if (user){
      //console.log("events")
      const userData = await getUserData(user.uid)
      if (userData.getTutoring){
        setIsTutee(true)
      }
      if (userData.giveTutoring){
        setIsTutor(true)
      }
      const eventsOfUser = await getAppointmentsUser(user.uid, isTutee, isTutor)
      setEvents(eventsOfUser)
      //console.log(eventsOfUser)
    }
  }, [user]);*/

  
  useEffect(async () => {
    //console.log(user)
    if (user){
      getTomorrowsDate()
      const userData = await getUserData(user.uid)
      if(userData.meetingsAddress){
        //const checkLabel = obj => obj.label === 'tutee'
        const isFound = possibleLocations.some(element => {
          if (element.value === "tutee") {
            return true;
          } else 
          return false
        })
        //console.log(!possibleLocations.some(checkLabel))
        //if(!possibleLocations.some(checkLabel)){
        if(!isFound){
          setPossibleLocations(possibleLocations => possibleLocations.concat({label:t('Afspraak.16'), value:"tutee"}))
        }
      }
      if (userData.getTutoring){
        setIsTutee(true)
      } else {
        setIsTutee(false)
      }
      if (userData.giveTutoring){
        setIsTutor(true)
      } else {
        setIsTutor(false)
      }
      //console.log(eventsOfUser)
    }
  }, [user]);

  useEffect(async () => {
    console.log(subjectids)
  }, [subjectids]);

  useEffect(async () => {
    if (user){
    if (isTutor !== "" && isTutee !== ""){
      const eventsOfUser = await getAppointmentsUser(user.uid, isTutor, isTutee, "own")
      setEvents(eventsOfUser)

      if (!isOwnAgenda){
        const eventsOfOtherUser = await getAppointmentsUser(user.uid, otherIsTutor, otherIsTutee, userid)
        setEvents(events => events.concat(eventsOfOtherUser))
      }
    }
  }
  }, [isTutee, isTutor, isOwnAgenda, user]);

  useEffect( async () => {
    if (userid){
      const userData = await getUserData(userid)
      if(userData.meetingsAddress){
        const isFound = possibleLocations.some(element => {
          //console.log(element.value)
          if (element.value === "tutor") {
            return true;
          } else 
          return false
        })
        //console.log(!possibleLocations.some(checkLabel))
        //if(!possibleLocations.some(checkLabel)){
        if(!isFound){
          setPossibleLocations(possibleLocations => possibleLocations.concat({label:t('Afspraak.17'), value:"tutor"}))
        }
      }
    }
    //setPossibleLocations(possibleLocations.concat(newLocation))
  }, [userid]);

  useEffect( () => {
    console.log(checkedVakken)
    //setPossibleLocations(possibleLocations.concat(newLocation))
  }, [checkedVakken]);




  useEffect( () => {
    setShowAgenda(true)
    console.log(events)
  }, [person]);


  const changeStatusAppointment = async (status) => {
    //console.log(status)
    //console.log(appointmentDetails.id)
    const response = await editAppointment(status, appointmentDetails.id)
    console.log(response)
  }

  const getTomorrowsDate =  () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setMinDate(tomorrow)
  }

  const addAppointment = (arg) => {
    if (!isOwnAgenda){
      console.log(arg)
      const month = String(arg.date.getMonth() + 1).padStart(2, '0');
      const day = String(arg.date.getDate()).padStart(2, '0')
      setModalAppointment(true)
      setOpen(true)
  
      const startHour = String(arg.date.getHours()).padStart(2, '0') + ":" + String(arg.date.getMinutes()).padStart(2,'0')
      const endHour = String(arg.date.getHours()+1).padStart(2, '0') + ":" + String(arg.date.getMinutes()).padStart(2,'0')
      setDate(arg.date.getFullYear() + "-" + month + "-" + day)
      setStarthour(String(arg.date.getHours()).padStart(2, '0') + ":" + String(arg.date.getMinutes()).padStart(2,'0'))
      setEndhour(String(arg.date.getHours()+1).padStart(2, '0') + ":" + String(arg.date.getMinutes()).padStart(2,'0'))
  
  
    }

    //handleOpen()
  }
  useEffect( () => {
    if (scheduleAppointment){
      aanvraagTutor()
    }
  }, [scheduleAppointment]);

  const aanvraagTutor = async () => {

    //console.log("do request")
    const bijlesVakken = []
    const vakkenIds = []
    const vakkenNamen = []
    if(checkedVakken){
      Object.keys(checkedVakken).map(function(key, index) {
        if(checkedVakken[key] === true){
          subjectids.map((item) => {
            if(key === item.subjectid){
              bijlesVakken.push(item)
              vakkenIds.push(item.subjectid)
              vakkenNamen.push(item.subject)
            }
          })
        }
      })
    } else {
      bijlesVakken.push(subjectids[0])
      vakkenIds.push(subjectids[0].subjectid)
      vakkenNamen.push(subjectids[0].subject)
    }
    console.log("done")

    console.log(vakkenIds)

    const tutorid = userid
    const studentid = user.uid
    const loggedinuser = await getUserData(user.uid)
    const naam = loggedinuser.firstname + " " + loggedinuser.lastname
    const datum = date

    const afspraakid = await makeAppointment(tutorid, studentid, date, starthour, endhour, vakkenIds, opmerking, location)
    console.log(afspraakid)
    sendMailAfspraak(naam, vakkenNamen, datum, opmerking, rate, starthour, endhour, afspraakid, location)
    
    //getEvents()
    //handleClose()
    //setScheduleAppointment(false)*/

   // makeAppointment()

  }

  const sendMailAfspraak = async (naam, vakkenNamen, datum, opmerking, prijs, starthour, endhour, afspraakid, location) => {
    const respObject = {naam, vakkenNamen, datum, opmerking, prijs, starthour, endhour, afspraakid, location, emailTutor}

    console.log(emailTutor)
    let response

    const fetchData = {
      crossDomain: false,
      method: 'POST',
      body: JSON.stringify(respObject),
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"  
      }
      ,credentials: 'include',
      }

      await fetch("/sendAppointmentConfirmation", fetchData)
        .then((response) => {
          console.log(response)
          handleClose()
          setOpenSnackBar(true);

          //console.log("gelukt om te sturen")
        })
        /*.then(response => response.json())
        .then((data) => {
        response = data
        })
        .catch((error) => {
        response = error
        })

        console.log(response)*/
    handleClose()
  }
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleChange = (event) => {
    setCheckedVakken({
      ...checkedVakken,
      [event.target.id]: event.target.checked,
    });
  };



  /*const showDetails = (arg) => {
    console.log(arg.event.id)     
    setPopUpDetail(true)
  }*/

  const RequestAppointment = () => (
    <>
     {errorForm &&
      <Grid item xs={12} >
        <Alert severity="error">{errorForm}</Alert>
      </Grid>
     }
    <Title>{t('Agenda.4')}</Title>
    <Grid container spacing={2} /*totaal is 12 bij xs*/> 
      <Grid item xs={4}>  
      {t('Afspraak.2')}
      </Grid>

      <Grid item xs={8}>  
      {tutorName}
      </Grid>

      <Grid item xs={4}>  
      {t('Afspraak.3')}
      </Grid>

      <Grid item xs={8}>  
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            required

            inputFormat="dd/MM/yyyy"
            value={date}
            onChange={(e) => setDate(e)}
            minDate={minDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={4}>  
      {t('Afspraak.4')}
      </Grid>
      
      <Grid item xs={8}>  
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
          renderInput={(params) => <TextField {...params} />}
          label={t('Afspraak.4')}
          value={starthour}
          minTime={new Date(0, 0, 0, 8)}
          maxTime={new Date(0, 0, 0, 18, 45)}
          onChange={(e) => {
            setStarthour(e);
          }}
          shouldDisableTime={(timeValue, clockType) => {
            if (clockType === 'minutes' && timeValue % 30) {
              return true;
            }
            return false;
          }}
        />
      </LocalizationProvider>
    </Grid>


      <Grid item xs={4}>  
      {t('Afspraak.5')}
      </Grid>
      
      <Grid item xs={8}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
          renderInput={(params) => <TextField {...params} />}
          label={t('Afspraak.5')}
          value={endhour}
          minTime={new Date(0, 0, 0, 8)}
          maxTime={new Date(0, 0, 0, 18, 45)}
          onChange={(e) => {
            setEndhour(e);
          }}
          shouldDisableTime={(timeValue, clockType) => {
            if (clockType === 'minutes' && timeValue % 30) {
              return true;
            }
            return false;
          }}
        />
      </LocalizationProvider>
      </Grid>

      <Grid item xs={4}>  
          {t('Afspraak.14')}
      </Grid>
      <Grid item xs={8}>  
          <Select 
          id="demo-simple-select"
          fullWidth
          onChange={(e)=>setLocation(e.target.value)}
          label={t('Afspraak.14')}
          value={location}>
        {possibleLocations?.map(possible => {
            return (
              <MenuItem key={possible.value} value={possible.value}>
                {possible.label ?? possible.value}
              </MenuItem>
            );
        })}
      </Select>
      </Grid>

          <Grid item xs={4}>  
          {t('Afspraak.6')}
          </Grid>

            { subjectids.length > 1 ? 

               <Grid item xs={8}>
                <FormGroup>
                {subjectids.map((item, index) => (
                  

                  <FormControlLabel control={
                  <Checkbox 
                    id={item.subjectid}
                    checked={checkedVakken[item.subjectid]}
                    onChange={handleChange}
                    //defaultChecked
                    />
                  } 
                  label={item.subject} />
                ))}
              </FormGroup>
              </Grid>
              :
              <Grid item xs={8}>
             <FormControlLabel control={<Checkbox disabled checked />} label={subjectids[0].subject} />
              </Grid>
            }
          
          <Grid item xs={4}>  
          {t('Afspraak.15')}
          </Grid>

          <Grid item xs={8}>
            <TextField
              id="text"
              type="textarea"
              name="text"
              multiline
              fullWidth
              value={opmerking}
              onChange={(e) => setOpmerking(e.target.value)}
              //onChange={(e) => setOpmerking(e.target.value)}
              //sx={{ width: 1000 }}
            />
          </Grid>

    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      onClick={() => setScheduleAppointment(true)}
    >
      {t('Afspraak.18')}
    </Button>
    </Grid>
  </>

  )

  const DataEvent = () => (
    <>
    {appointmentDetails &&
    <>
    <Grid container spacing={2} /*totaal is 12 bij xs*/> 
    <Grid key={appointmentDetails.id} item justify="flex-end" xs={12}>  
    </Grid>
    <Grid item xs={12}>  
    <Grid item xs={12}>  
        <Title>{appointmentDetails.title}</Title>
    </Grid>
      {appointmentDetails.role === "tutor"?
        <>
        {appointmentDetails.isconfirmed ?
          <Alert severity="success">{t('Afspraak.10')}{t('Afspraak.11')}</Alert>
          :
          <Alert severity="warning">{t('Afspraak.12')}</Alert>
        }
        <>
        <Grid  container spacing={1} /*totaal is 12 bij xs*/> 
         <Grid item xs={4}>  
         {t('Profile.6')}
          </Grid>
          <Grid item xs={8}>  
          {tuteeName}
          </Grid>

         <Grid item xs={4}>  
         {t('Profile.5')}
          </Grid>
          <Grid item xs={8}>  
          {tutorName}
          </Grid>

          <Grid item xs={4}>  
          {t('Afspraak.3')}
          </Grid>
          <Grid item xs={8}>  
          {appointmentDetails.date}
          </Grid>

          <Grid item xs={4}>  
          {t('Afspraak.4')}
          </Grid>
          <Grid item xs={8}>  
          {appointmentDetails.starthour}
          </Grid>

          <Grid item xs={4}>  
          {t('Afspraak.5')}
          </Grid>
          <Grid item xs={8}>
          {appointmentDetails.endhour}
          </Grid>

          <Grid item xs={4}>  
          {t('Afspraak.14')}
          </Grid>
          <Grid item xs={8}>
          {locationAppointment}
          </Grid>
          
          {appointmentDetails.opmerking &&
          <>
          <Grid item xs={4}>  
          {t('Afspraak.15')}
          </Grid>
          <Grid item xs={8}>
          {appointmentDetails.opmerking}
          </Grid>
          </>
          }
        </Grid>
        </>
        {appointmentDetails.isconfirmed ?
          <></>
          :
          <Button variant="contained" fullWidth color="success" onClick={() => changeStatusAppointment("confirm")}>{t('Afspraak.9')}</Button>
        }
        </>
      :
        <>
        {appointmentDetails.isconfirmed ?
            <Alert severity="warning">{t('Afspraak.13')}{firstname}</Alert>
            :
          <Alert severity="success">{t('Afspraak.10')}{firstname}</Alert>
        }
        </>
      }

    </Grid>

          <Grid item xs={12}>
           <Button variant="outlined" fullWidth color="error" startIcon={<DeleteIcon />} onClick={() => changeStatusAppointment("cancel")}>{t('Afspraak.7')}</Button>
           </Grid>
    </Grid> 
    </>
    }
   </>
      
  )

  return (
    <>

     {isOwnAgenda? 
     <Title>{t('Agenda.1')}</Title>
     :
     <Title>{t('Agenda.2')} {person}</Title>
     }
     
      {showAgenda ?
      <FullCalendar 
      plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
      initialView="dayGridMonth"
      weekends={true}
      //dateClick={}
      //dateClick={handleDateClick}
      eventClick={handleOpen}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      }}
      //businessHours={vrijeTijd}  
      events={events}
      
      dateClick={addAppointment}
      />
      :
      <p>Loading</p>
      }
   
      <Snackbar open={openSnackbar} autoHideDuration={12000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          You have requested this appointment. You will get an email once this has been confirmed.
        </Alert>
      </Snackbar>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {modalAppointment?
             <>
             {errorForm &&
              <Grid item xs={12} >
                <Alert severity="error">{errorForm}</Alert>
              </Grid>
             }
            <Title>{t('Agenda.4')}</Title>
            <Grid container spacing={2} /*totaal is 12 bij xs*/> 
              <Grid item xs={4}>  
              {t('Afspraak.2')}
              </Grid>
        
              <Grid item xs={8}>  
              {person}
              </Grid>
        
              <Grid item xs={4}>  
              {t('Afspraak.3')}
              </Grid>
        
              <Grid item xs={8}>  
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    required
        
                    inputFormat="dd/MM/yyyy"
                    value={date}
                    onChange={(e) => setDate(e)}
                    minDate={minDate}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
        
              <Grid item xs={4}>  
              {t('Afspraak.4')}
              </Grid>
              
              <Grid item xs={8}>  
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                  renderInput={(params) => <TextField {...params} />}
                  label={t('Afspraak.4')}
                  value={starthour}
                  minTime={new Date(0, 0, 0, 8)}
                  maxTime={new Date(0, 0, 0, 18, 45)}
                  onChange={(e) => {
                    setStarthour(e);
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    if (clockType === 'minutes' && timeValue % 30) {
                      return true;
                    }
                    return false;
                  }}
                />
              </LocalizationProvider>
            </Grid>
        
        
              <Grid item xs={4}>  
              {t('Afspraak.5')}
              </Grid>
              
              <Grid item xs={8}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                  renderInput={(params) => <TextField {...params} />}
                  label={t('Afspraak.5')}
                  value={endhour}
                  minTime={new Date(0, 0, 0, 8)}
                  maxTime={new Date(0, 0, 0, 18, 45)}
                  onChange={(e) => {
                    setEndhour(e);
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    if (clockType === 'minutes' && timeValue % 30) {
                      return true;
                    }
                    return false;
                  }}
                />
              </LocalizationProvider>
              </Grid>
        
              <Grid item xs={4}>  
                  {t('Afspraak.14')}
              </Grid>
              <Grid item xs={8}>  
                  <Select 
                  id="demo-simple-select"
                  fullWidth
                  onChange={(e)=>setLocation(e.target.value)}
                  label={t('Afspraak.14')}
                  value={location}>
                {possibleLocations?.map(possible => {
                    return (
                      <MenuItem key={possible.value} value={possible.value}>
                        {possible.label ?? possible.value}
                      </MenuItem>
                    );
                })}
              </Select>
              </Grid>
                  <Grid item xs={4}>  
                  {t('Afspraak.6')}
                  </Grid>
        
                    { subjectids && subjectids.length > 1 ? 
        
                       <Grid item xs={8}>
                        <FormGroup>
                        {subjectids.map((item, index) => (
                          
        
                          <FormControlLabel control={
                          <Checkbox 
                            id={item.subjectid}
                            checked={checkedVakken[item.subjectid]}
                            onChange={handleChange}
                            //defaultChecked
                            />
                          } 
                          label={item.subject} />
                        ))}
                      </FormGroup>
                      </Grid>
                      :
                      <Grid item xs={8}>
                     <FormControlLabel control={<Checkbox disabled checked />} label={subjectids[0].subject} />
                      </Grid>
                    }
                  
                  <Grid item xs={4}>  
                  {t('Afspraak.15')}
                  </Grid>
        
                  <Grid item xs={8}>
                    <TextField
                      id="text"
                      type="textarea"
                      name="text"
                      multiline
                      fullWidth
                      value={opmerking}
                      onChange={(e) => setOpmerking(e.target.value)}
                      //onChange={(e) => setOpmerking(e.target.value)}
                      //sx={{ width: 1000 }}
                    />
                  </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={aanvraagTutor}
            >
              {t('Afspraak.18')}
            </Button>
          </>
          :
          <DataEvent/>
          }
        </Box>
      </Modal>
  
      
  </>
  );
}
