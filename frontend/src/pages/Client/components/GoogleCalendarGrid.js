import React, { useState, useEffect, handleClientLoad } from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { styled, Box } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { TextField, Grid, Modal, Button, Switch, FormControlLabel, Paper, Alert, Typography}  from '@mui/material';
import Title from './Title';
import {useTranslation} from 'react-i18next';
import {
  auth, editAppointment, getAppointmentsUser, getUserData
} from "../../../services/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import './GoogleCalendar.scss';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';


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
  const [isTutor, setIsTutor] = useState(false)
  const [isTutee, setIsTutee] = useState(false)
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

  // modal
  const [open, setOpen] = useState(false);
  const handleOpen = (args) => {
    if(args.event.title !== ""){
      setAppointmentId(args.event.id)
      setOpen(true);
    }
  }
  const handleClose = () => setOpen(false);


  
  useEffect( () => {
    //console.log(Object.keys(props).length === 0)
    if(Object.keys(props).length !== 0){
      console.log(props)
      setPerson(props.person)
      setUserid(props.userid)
      setSubjectids(props.subjectids)
      setOtherIsTutor(props.isTutor)
      setOtherIsTutee(props.isTutee)
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
      /*var result = events.filter(event => {
        return event.id === appointmentId
      })*/
    }
  }, [appointmentId]);
  useEffect( () => {
    console.log(open)
  }, [open]);

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
      console.log("events")
      const userData = await getUserData(user.uid)
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
    if (isTutor !== "" && isTutee !== ""){
      const eventsOfUser = await getAppointmentsUser(user.uid, isTutor, isTutee, "own")
      setEvents(eventsOfUser)

      if (!isOwnAgenda){
        console.log(otherIsTutor, otherIsTutee, person, userid)
        const eventsOfOtherUser = await getAppointmentsUser(user.uid, otherIsTutor, otherIsTutee, userid)
        setEvents(events => events.concat(eventsOfOtherUser))
      }
    }
  }, [isTutee, isTutor, isOwnAgenda]);

  useEffect( () => {
    setShowAgenda(true)
    console.log(events)
  }, [events]);

  const changeStatusAppointment = async (status) => {
    //console.log(status)
    //console.log(appointmentDetails.id)
    const response = await editAppointment(status, appointmentDetails.id)
    console.log(response)
  }

  /*const showDetails = (arg) => {
    console.log(arg.event.id)     
    setPopUpDetail(true)
  }*/

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
          {appointmentDetails.tuteeid}
          </Grid>

         <Grid item xs={4}>  
         {t('Profile.5')}
          </Grid>
          <Grid item xs={8}>  
          {appointmentDetails.tutorid}
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
          {appointmentDetails.location}
          </Grid>
          
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
      />
      :
      <p>Loading</p>
      }
   

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DataEvent/>
        </Box>
      </Modal>
  
      
  </>
  );
}
