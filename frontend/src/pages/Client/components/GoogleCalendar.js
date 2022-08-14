import React, { useState, useEffect, handleClientLoad } from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import Button from '@mui/material/Button';
import { styled, Box } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Title from './Title';
import {useTranslation} from 'react-i18next';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  auth,db,editAppointment
} from "../../../services/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import './GoogleCalendar.scss';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';
import Typography from '@mui/material/Typography';

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
  width: 600,
  height: '90vh',
  bgcolor: 'white',
  border: '2px solid white',
  p: 2,
  px: 4,
  pb: 3,
};

//import googleCalendarPlugin from '@fullcalendar/google-calendar' // a plugin!


// nu gwn kijken welke agenda dit is en dingen toevoegen 
// -> https://dev.to/nouran96/google-calendar-events-with-react-544g

function GoogleCalendarGrid(props) {
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
  const [open, setOpen] = React.useState(false);
  const [openEvent, setOpenEvent] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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


  const [checked, setChecked] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  })

  const searchEvent = async (eventid) => {  
    await db.collection("tutoring")
    .doc(eventid)
    .get()
    .then((querySnapshot) => { 
      setAfspraakarray(querySnapshot.data())
      if(querySnapshot.data().tutorid === user.uid){
        setIsTutorEvent(true)
        getFullName(querySnapshot.data().studentid)

      } else if (querySnapshot.data().studentid === user.uid){
        setIsTutorEvent(false)
        getFullName(querySnapshot.data().tutorid)

      }
      setAfspraakid(eventid)
      getVakken(querySnapshot.data().subjectid)
      setShowEvent(true)
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    })
  }

  const getVakken = (subjectid) => {
    const arrayVakken = []
    subjectid.map((item) => ( 
      db.collection("subject")
      .doc(item)
      .get()
      .then((querySnapshot) => {
        arrayVakken.push(querySnapshot.data().subject)
      })
    ))
    setVakken(arrayVakken)
  }


  useEffect(() => {
    if(props.afspraakid === "me"){
      setAfspraakid(props.afspraakid)
      setShowEvent(false)
    } else {
      setAfspraakid(props.afspraakid)
      searchEvent(props.afspraakid)
    }
    fetchUserAgenda()
    getEvents()
  }, []);

  useEffect(() => {
    if(afspraakid === "me"){
      setShowEvent(false)
    } else {
      searchEvent(afspraakid)
    }
  }, [afspraakid]);

  useEffect(() => {
    console.log(checked)
    console.log(schema)
  }, [checked]);

  useEffect(() => {
    console.log(vrijeTijd)
  }, [vrijeTijd]);

  useEffect(() => {
    console.log(schema)
  }, [schema]);




  const handleChange = (event) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    });
  };  

  /*    console.log(event.target.id)
    schema.map((item, index) => (
      if(event.target.id == index)

    ))*/

   

  const getEvents = async () => {
    var eventsArray=[]

    // WANNEER IS TUTOR
    await db
    .collection("tutoring")
    .where("tutorid", "==", user.uid)
    .get()
    .then((querySnapshot) => { 
      querySnapshot.forEach(function(doc) {
        const longstart = doc.data().date + "T" + doc.data().starthour
        const longend = doc.data().date + "T" + doc.data().endhour
        const studentid = doc.data().studentid
        const eventid = doc.id
        const isConfirmed = doc.data().isconfirmed
        const arrayEvent = {   
          id: eventid,
          title: "Tutoring",
          start: longstart,
          end: longend,
        } 
        if(isConfirmed) {
          arrayEvent.color = '#953AA8'
        } else {
          if(studentid === user.uid){
            arrayEvent.color= 'C386CF'
          } 
          
        }
        eventsArray.push(arrayEvent)

        //console.log(doc.data())
      })})

    // WANNEER USER IS STUDENT
    await db
    .collection("tutoring")
    .where("studentid", "==", user.uid)
    .get()
    .then((querySnapshot) => { 
      querySnapshot.forEach(function(doc) {
        const longstart = doc.data().date + "T" + doc.data().starthour
        const longend = doc.data().date + "T" + doc.data().endhour
        const studentid = doc.data().studentid
        const isConfirmed = doc.data().isconfirmed
        const eventid = doc.id
        const arrayEvent = {   
          id: eventid,
          title: "Tutoring",
          start: longstart,
          end: longend,
        } 
        if(isConfirmed) {
          arrayEvent.color = '#E07730' //donkerste blauw
        } else {
          if(studentid === user.uid){
            arrayEvent.color= '#FFBA3D' 
          } 
        }
        eventsArray.push(arrayEvent)

        //console.log(doc.data())
      })})

    setEvents(eventsArray)
  }

  const handleDateClick = (arg) => { // bind with an arrow function
    const date = arg.dateStr
    console.log(date)
  }

  const getFullName = async (userid) => {
    let docdata 
    let docfirst
    await db
    .collection("users")
    .where("uid", "==", userid)
    .get()
    .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
      querySnapshot.forEach(function(doc) {

          //doc.data().giveTutoring.push(id)
          docdata = doc.data().firstname + " " + doc.data().lastname   
          docfirst = doc.data().firstname
      });
    })
    setFullname(docdata)
    setFirstname(docfirst)
  }
  const showDetails = (arg) => { // bind with an arrow function
    const color = arg.event.backgroundColor
    const afspraakid = arg.event.id
    setAfspraakid(afspraakid)
    searchEvent(afspraakid)
  }
  const closeEvent = () => { 
    setShowEvent(false)
  }

  const confirmApp = (event) => { 
    event.preventDefault()
    const value = "confirm"
    editAppointment(value, afspraakid)
    searchEvent(afspraakid)
    setAfspraakarray()
    getEvents()

  }

  const deleteApp = () => { 
    const value = "delete"
    editAppointment(value, afspraakid)
    closeEvent()
    getEvents()

  }


  const saveBusinessHours = (event) => {
    event.preventDefault();
    console.log("add planning")

  }

  const Legend = () => (
    // als is tutor
    // geconfirmde afspraken = paars
    // nog niet geconfirmd = 

    // als is student
    // geconfirmde afspraken = paars
    // nog niet geconfirmd = 
    <>
    <Grid container spacing={0} /*totaal is 12 bij xs*/> 

    <Grid item xs={1.5}> 
    <Brightness1RoundedIcon sx={{ color: "#953AA8" }}/>
    </Grid>
    <Grid item xs={10.5}>  
    <Typography mb={2} component="p" >{t('Legende.1')}</Typography>

    </Grid>
    <Grid item xs={1.5}> 
    <Brightness1RoundedIcon sx={{ color: "#C386CF" }}/>
    </Grid>
    <Grid item xs={10.5}>  
    <Typography mb={4} component="p" >{t('Legende.2')}</Typography>
    </Grid>
    </Grid>
    <Grid container spacing={0} /*totaal is 12 bij xs*/> 
    <Grid item xs={1.5}> 
    <Brightness1RoundedIcon sx={{ color: "#E07730" }}/>
    </Grid>
    <Grid item xs={10.5}>  
    <Typography mb={2} component="p" >{t('Legende.3')}</Typography>
    </Grid>
    <Grid item xs={1.5}> 
    <Brightness1RoundedIcon sx={{ color: "#FFBA3D" }}/>
    </Grid>
    <Grid item xs={10.5}>  
    <Typography mb={6} component="p" >{t('Legende.4')}</Typography>
    </Grid>
    </Grid>


    </>
  )

  const DataEvent = () => (
    <>

    <Grid  container spacing={2} /*totaal is 12 bij xs*/> 
    <Grid item justify="flex-end" xs={12}>  
    <CloseIcon onClick={closeEvent}/>
    </Grid>
    <Grid item xs={12}>  
    <Grid item xs={12}>  
    {isTutorEvent && isTutorEvent?
        <Title>{t('Afspraak.8')}</Title>
      : 
        <Title>{t('Afspraak.1')}</Title>
    }
    </Grid>
    
    {afspraakarray.isconfirmed  
          ?
          <> 
          {isTutorEvent && isTutorEvent?
            <Alert severity="success">{t('Afspraak.10')}{t('Afspraak.11')}</Alert>
          :
            <Alert severity="success">{t('Afspraak.10')}{firstname}</Alert>
          }
          </>
          : <>
            {isTutorEvent && isTutorEvent?
            <Alert severity="warning">{t('Afspraak.12')}</Alert>

          :
            <Alert severity="warning">{t('Afspraak.13')}{firstname}</Alert>
          }
          </>
          }
    </Grid>
    {isTutorEvent && isTutorEvent?
      <>
        <Grid item xs={4}>  
        Student
        </Grid>
        <Grid item xs={8}>  
        {fullname}
        </Grid>
      </>
    : 
      <>
        <Grid item xs={4}>  
        <>{t('Afspraak.2')}</>
        </Grid>
        <Grid item xs={8}>  
        {fullname}

        </Grid>
      </>
    }


    <Grid item xs={4}>  
    {t('Afspraak.3')}
    </Grid>
    <Grid item xs={8}>  
    {afspraakarray.date}
        </Grid>

    <Grid item xs={4}>  
    {t('Afspraak.4')}
    </Grid>
    <Grid item xs={8}>  
      {afspraakarray.starthour}

        </Grid>

        <Grid item xs={4}>  
        {t('Afspraak.5')}
        </Grid>
        <Grid item xs={8}>
        {afspraakarray.endhour}
        
        </Grid>

        <Grid item xs={4}>  
        {t('Afspraak.6')}        
        </Grid >

        <Grid item xs={8}>  
        {vakken && vakken.map((item, index) => (
          <>{item} 
          <Grid item xs={4}>  
          </Grid >
          </>
         ))}
         
         </Grid>

          
        
        {afspraakarray.opmerking ?
            <Grid item xs={12}>  
            Manon Neirynck voegde de opmerking toe: "{afspraakarray.opmerking}"
            </Grid>
          : 
          <></>
          }
    

  </Grid>
        {isTutorEvent && isTutorEvent?
              <>
                {afspraakarray.isconfirmed  
                  ?
                  <></>
                  : 
                  <Button id={afspraakid} onClick={confirmApp}>{t('Afspraak.9')}</Button>
                }
              </>
            : 
              <></>
          }
      
          <br></br>
          <Grid item xs={12}>
           <Button variant="outlined" fullWidth color="error" startIcon={<DeleteIcon />} onClick={deleteApp}>{t('Afspraak.7')}</Button>
           </Grid>
          </>
      
  )

  const fetchUserAgenda = async () => {
    var businessHours=[]
    //const userid = user.uid

     await db
        .collection("users")
        .get()
        .then((querySnapshot) => { 
          querySnapshot.forEach(function(doc) {
            if(doc.data().uid === user?.uid){
              //setSchema(doc.data().openingHours)
              //console.log("zelfde user, goedzo")
              const currState = {...checked}

              var days = []
              //mss met for proberen
              Object.keys(doc.data().openingHours).forEach(key => {
                let number = 0
                if(key === "monday"){
                  number = 1
                  // waarom doet deze het nie juist
                  /*setChecked({
                    ...checked,
                    tuesday: true,
                  })*/
                  //functie aanmaken met parameter meegven
                  currState['monday'] = true
                  days[1] = { "from": "0" + doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes()  + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" };
                  //days.push(monday)

                } else if (key === "tuesday"){
                  number = 2
                  //const currState = {...checked}
                  currState['tuesday'] = true
                  days[2] = { "from": "0"+ doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0"  };
                  /*var tuesday = {}
                  tuesday.from = doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0"
                  tuesday.to = doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                  days.push({tuesday: tuesday})
                  */
                  //setChecked(currState)
                } else if (key === "wednesday"){
                  number = 3
                  currState['wednesday'] = true
                  days[3] = { "from": doc.data().openingHours[key].from.toDate().getHours().padStart(2, '0') + ":" + doc.data().openingHours[key].from.toDate().getMinutes().padStart(2, '0'), "to": doc.data().openingHours[key].to.toDate().getHours().padStart(2, '0') + ":" + doc.data().openingHours[key].to.toDate().getMinutes().padStart(2, '0') };
                } else if (key === "thursday"){
                  number = 4
                  currState['thursday'] = true
                  days[4] = { "from": doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0"  };

                } else if (key === "friday"){
                  number = 5
                  currState['friday'] = true
                  days[5] = { "from": "0"+ doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0"  };

                } else if (key === "saturday"){
                  number = 6
                  currState['saturday'] = true
                  days[6] = { "from": doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0"  };

                } else if (key === "sunday"){
                  number = 7
                  currState['sunday'] = true
                  days[7] = { "from": doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0"  };
                }
                /*setChecked({
                  ...checked,
                  key: true,
                })*/
                setChecked(currState)
                setSchema(days)

                var hourfrom = ""
                var hourTo = ""
                //console.log(doc.data().openingHours[key].from.toDate().getHours())
                if(doc.data().openingHours[key].from.toDate().getHours().toString().length <2){
                  hourfrom = "0"+doc.data().openingHours[key].from.toDate().getHours()
                } else {
                  hourfrom = doc.data().openingHours[key].from.toDate().getHours()
                }
                if(doc.data().openingHours[key].to.toDate().getHours().toString().length <2){
                  hourTo = "0"+doc.data().openingHours[key].to.toDate().getHours()
                } else {
                  hourTo = doc.data().openingHours[key].to.toDate().getHours()
                }

                const arrayDay = { 
                  daysOfWeek: [number],
                  startTime: hourfrom+ ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0",
                  endTime: hourTo + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                }
                //console.log(arrayDay)
                businessHours.push(arrayDay)
              });
              
                
                //console.log(hey)
                //businessHours.push(arrayDay)
              //console.log(businessHours)
              setVrijeTijd(businessHours)
            } 
          })
        })        
  }

  return (
    <>
            <Grid container spacing={3}>
            <Grid  item xs={12} md={8} lg={8}>
            <Paper sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          height:'80vh',
                          overflow: 'auto'
                        }}>
     <Title>{t('Agenda.1')} </Title>

    {vrijeTijd?
     <>
      <StyledModal
          aria-labelledby="unstylede-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <Box sx={style}>
            <Title>{t('Agenda.3')} </Title>
  
            <Grid container spacing={2} /*totaal is 12 bij xs*/> 
            {Object.keys(checked).map(function(key, index) {
              //key = bv monday
              //checked[key] = bv true
              //number = bv 1
              var number = 0
              if(key === "monday"){
                number = 1
              } else if (key === "tuesday"){
                number = 2
              } else if (key === "wednesday"){
                number = 3
              } else if (key === "thursday"){
                number = 4
              } else if (key === "friday"){
                number = 5
              } else if (key === "saturday"){
                number = 6
              } else if (key === "sunday"){
                number = 7
              }
              if(checked[key]){
                //console.log(schema)
                //console.log(vrijeTijd)
                //for (let i = 0; i < 7; i++) { 
                    //if(/*vrijeTijd[i].daysOfWeek[0] === number*/ vrijeTijd){
                      if(schema[number]){
  
                console.log(schema[number].from)
                return (
                <>    
                <Grid item xs={4}>  
                    <FormControlLabel
                      value={t('Weekdagen.'+ number)}
                      control={<Switch checked={checked[key]} onChange={handleChange} id={number} name={key} />}
                      label={t('Weekdagen.'+ number)}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={4}>  
                    <TextField
                      id="time"
                      label="From"
                      type="time"
                      name="from"
                      fullWidth
                      value={schema[number].from}
                      onChange={(newValue) => {
                        setSchema({number: newValue})
                      }}  
                      InputLabelProps={{
                      shrink: true,
                      }}
                      inputProps={{
                      step: 300, // 5 min
                      }}
                      //defaultValue="08:00"
  
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="time"
                      label="To"
                      type="time"
                      name="from"
                      fullWidth
                      value={schema[number].to}
                      //defaultValue={schema[number]}
                      InputLabelProps={{
                      shrink: true,
                      }}
                      inputProps={{
                      step: 300, // 5 min
                      }}
                  />
                  </Grid>
                  </>)
                       //}
                     }
                    //}
              } else {
                return(
                <>
                <Grid item xs={4}>
                    <FormControlLabel
                      value={t('Weekdagen.'+ number)}
                      control={<Switch checked={checked[key]} onChange={handleChange} name={key} />}
                      label={t('Weekdagen.'+ number)}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="time"
                      disabled
                      label="From"
                      type="time"
                      name="from"
                      fullWidth
                      value="09:00"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="time"
                      disabled
                      label="To"
                      type="time"
                      name="from"
                      fullWidth
                 
                  />
                  </Grid>
                  </>)
              }
  
            })}
    
                  
  
  
  
          </Grid>
            <Box component="form" onSubmit={saveBusinessHours} noValidate sx={{ mt: 1 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => saveBusinessHours}
            >
              Opslaan
            </Button>
          </Box>
          </Box>
        </StyledModal>
      <StyledModal
          aria-labelledby="unstylede-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openEvent}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <Box sx={style}>
            <Title>{t('Agenda.3')} EVENT</Title>
  
            <Box component="form" onSubmit={saveBusinessHours} noValidate sx={{ mt: 1 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => saveBusinessHours}
            >
              Opslaan
            </Button>
          </Box>
          </Box>
        </StyledModal>
      

      { vrijeTijd ?
      
      <FullCalendar 
      plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
      initialView="dayGridMonth"
      weekends={true}
      dateClick={handleDateClick}
      eventClick={showDetails}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      }}
      businessHours={vrijeTijd}  
      events={events}
  
    />
  
      :
      <p>Loading</p>
      }
      
        </>
      :
      <p>Loading</p>
    }
   </Paper>
   </Grid>

         
   <Grid item xs={12} md={4} lg={4}>

  
          {showEvent && afspraakarray && showEvent? //afspraakarray.isconfirmed 
          <>
            {isTutorEvent && isTutorEvent? 
            
              <>  
              {afspraakarray.isconfirmed ? // dus als is tutor en als is confirmed
              <>
                <Paper sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          height:'80vh',
                          border: '2px solid #953AA8'
                        }}>
                 <DataEvent/>
                </Paper>
              </>
              :
              <>
                <Paper sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          height:'80vh',
                          border: '2px solid #C386CF'
                        }}>
                 <DataEvent/>
                </Paper>
              </>
              }  
       
                </>
              :
              <>  {afspraakarray.isconfirmed ?
                <>
                  <Paper sx={{ 
                            p: 2, 
                            display: 'flex', 
                            flexDirection: 'column',
                            height:'80vh',
                            border: '2px solid #E07730'
                          }}>
                   <DataEvent/>
                  </Paper>
                </>
                :
                <>
                  <Paper sx={{ 
                            p: 2, 
                            display: 'flex', 
                            flexDirection: 'column',
                            height:'80vh',
                            border: '2px solid #FFBA3D'
                          }}>
                   <DataEvent/>
                  </Paper>
                </>
                }  </>
            }
            
          
          </>
          :
          <>
             <Paper sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          height:'80vh'
                        }}>    
          <Title>{t('Legende.5')}</Title>
          <Legend/>
          <Typography mb={2} component="p" >{t('Agenda.6')}</Typography>
          <Button variant="outlined" onClick={handleOpen}>{t('Agenda.5')}</Button>
          </Paper>
          </>
          }     
        

          
        </Grid>
   </Grid>
  </>
  );
}

export default GoogleCalendarGrid;
