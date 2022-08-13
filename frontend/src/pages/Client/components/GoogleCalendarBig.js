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
  auth,db, addAfspraak
} from "../../../services/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



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
  height: '80vh',
  bgcolor: 'white',
  border: '2px solid white',
  p: 2,
  px: 4,
  pb: 3,
};

//import googleCalendarPlugin from '@fullcalendar/google-calendar' // a plugin!


// nu gwn kijken welke agenda dit is en dingen toevoegen 
// -> https://dev.to/nouran96/google-calendar-events-with-react-544g

function GoogleCalendarGridBig(props) {
  // Declare a new state variable, which we'll call "count"

  //const scopes ="https://www.googleapis.com/auth/userSinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";
  const scopes ="https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";
  const [user, loading, error] = useAuthState(auth);
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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation()
  const weekdays = [1, 2, 3, 4, 5, 6, 7]
  const [days, setDays] = useState({});
  const [vrijeTijd, setVrijeTijd] = useState()
  const [schema, setSchema] = useState()
  const [date, setDate] = useState()
  const [starthour, setStarthour] = useState()
  const [endhour, setEndhour] = useState()
  const [subjects, setSubjects] = useState([])
  const [ok, setOk] = useState(false)
  const [startTimeBusiness, setStartTimeBusiness] = useState()
  const [endTimeBusiness, setEndTimeBusiness] = useState()
  const [opmerking, setOpmerking] = useState()
  const [bijlesVakken, setBijlesVakken] = useState([])
  const [events, setEvents] = useState([])
  const [userWholeName, setUserWholeName] = useState()
  const [openSnackbar, setOpenSnackBar] = React.useState(false);
  const [checkedVakken, setCheckedVakken] = useState()


  const [checked, setChecked] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  })
  //const [name, setName] = useState()
  const userid = props.userid
  const name = props.name
  const subjectid = props.subjectid

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

  

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const aanvraagTutor = async (event) => {
    event.preventDefault();
    const bijlesVakken = []
    const vakkenIds = []
    const vakkenNamen = []
    if(checkedVakken){
      Object.keys(checkedVakken).map(function(key, index) {
        if(checkedVakken[key] === true){
          subjectid.map((item) => {
            if(key === item.subjectid){
              bijlesVakken.push(item)
              vakkenIds.push(item.subjectid)
              vakkenNamen.push(item.subject)
            }
          })
        }
      })
    } else {
      bijlesVakken.push(subjectid[0])
      vakkenIds.push(subjectid[0].subjectid)
      vakkenNamen.push(subjectid[0].subject)
    }

    //bijlesVakken is een array van objects met daarin telkens de subjectid, subject en field
    //vakkenIds is een array van alle id's dat die persoon bijles over wilt
    //vakkenNamen is een array van alle namen van de vakken dat die persoon bijles over wilt
    const tutorid = userid
    const studentid = user.uid
    const naam = userWholeName
    const datum = date
    const prijs = 18.00

    const afspraakid = await addAfspraak(tutorid, studentid, date, starthour, endhour, vakkenIds, opmerking)
    console.log(afspraakid)
    sendMailAfspraak(naam, bijlesVakken, datum, opmerking, prijs, starthour, endhour, afspraakid)
    
    getEvents()
    handleClose()
    
  };

  const sendMailAfspraak = async (naam, bijlesVakken, datum, opmerking, prijs, starthour, endhour, afspraakid) => {
    const respObject = {naam, bijlesVakken, datum, opmerking, prijs, starthour, endhour, afspraakid}

    const fetchData = {
      crossDomain: false,
      method: 'POST',
      body: JSON.stringify(respObject),
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"  
      },
      credentials: 'include',
      }

     await fetch("/sendAppointmentConfirmation", fetchData)
         .then(() => {
             console.log("gelukt om te sturen")
             setOpenSnackBar(true);

         })

  }


  /*let calendar = new Calendar(CalenderEl, {
    plugins: [googleCalendarPlugin]
  })*/  

  useEffect(() => {
    fetchUserAgenda()
    getEvents()
    if (props.subjectid.length > 1){
      console.log(subjectid)
      const currState = {...checkedVakken}
      //let items = {}
      subjectid.map((item, index) => 
        //item = {[item.subjectid]: true}
        currState[item.subjectid] = true
      )
      setCheckedVakken(currState)
    }
      if (events){
        console.log(events)
      }
      //console.log(props.userid)
      //console.log(props.name)
      console.log(subjectid)
      //userid={id} name={name} subjectid={subjectid}
  }, []);

  useEffect(() => {
    console.log(subjects)
  }, [subjects]);
  useEffect(() => {
    console.log(checkedVakken)
  }, [checkedVakken]);


  const handleChange = (event) => {
    setCheckedVakken({
      ...checkedVakken,
      [event.target.id]: event.target.checked,
    });
  };

  


  const getEvents = async () => {
    var eventsArray=[]

    await db
    .collection("tutoring")
    .where("tutorid", "==", userid)
    .get()
    .then((querySnapshot) => { 
      querySnapshot.forEach(function(doc) {
        const longstart = doc.data().date + "T" + doc.data().starthour
        const longend = doc.data().date + "T" + doc.data().endhour
        const studentid = doc.data().studentid
        const isConfirmed = doc.data().isconfirmed
        const arrayEvent = {   
          title: "Tutoring",
          start: longstart,
          end: longend
        } 
        if(isConfirmed) {
          arrayEvent.color = 'purple'
        } else {
          if(studentid === user.uid){
            arrayEvent.color= 'purple'
          } else {
            arrayEvent.color = 'orange'
          }
          
        }
        eventsArray.push(arrayEvent)

        //console.log(doc.data())
      })})
    setEvents(eventsArray)
  }

  const handleDateClick = (arg) => { // bind with an arrow function
    console.log(arg)
    const month = String(arg.date.getMonth() + 1).padStart(2, '0');
    const day = String(arg.date.getDate()).padStart(2, '0')

    setDate(arg.date.getFullYear() + "-" + month + "-" + day)
    setStarthour(String(arg.date.getHours()).padStart(2, '0') + ":" + String(arg.date.getMinutes()).padStart(2,'0'))
    setEndhour(String(arg.date.getHours()+1).padStart(2, '0') + ":" + String(arg.date.getMinutes()).padStart(2,'0'))
    setOk(true)
    //setDate(date)
    if (inBusinessHours(arg.date, vrijeTijd)){
      handleOpen()
    } else {
      console.log("error")
      //console.log("zwaar nie ok")
    }
    //console.log(date)
  }



  const inBusinessHours = (date, businessHours) => {
    let dateDay = date.getDay();
    for (var i = 0; i < businessHours.length; i++) {
      // check if date should conform to this dict's start and end times
      if (businessHours[i].daysOfWeek.includes(dateDay)) {
        // toLocaleTimeString with arg it-IT will return 24hr time
        let timeStr = date.toLocaleTimeString('it-IT')
        setStartTimeBusiness(businessHours[i].startTime)
        setEndTimeBusiness(businessHours[i].endTime)
  
        // if time after or equal to business hour start for day
        if (businessHours[i].startTime <= timeStr) {
          // if time before or equal to business hour end for day
          if (businessHours[i].endTime >= timeStr) {
            return true
          }
        }
        //  if the day matches, but any of the times do not, dont check any more
        //    days and just return false immediately
        return false
      }
    }
    // if date clicked's weekday is not in businessHours at all
    return false;
  }

  const fetchUserAgenda = async () => {
    var businessHours=[]
    //const userid = user.uid

     await db
        .collection("users")
        .get()
        .then((querySnapshot) => { 
          querySnapshot.forEach(function(doc) {
            if(doc.data().uid === userid){
              //setSchema(doc.data().openingHours)
              //console.log("zelfde user, goedzo")
              const currState = {...checked}

              console.log(doc.data().openingHours)
              setUserWholeName(doc.data().firstname + " " + doc.data().lastname)
              setEmail(doc.data().email)

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
                  days[1] = { "from": doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0"  };
                  //days.push(monday)

                } else if (key === "tuesday"){
                  number = 2
                  //const currState = {...checked}
                  currState['tuesday'] = true
                  days[2] = { "from": doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0", "to": doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0"  };
                  /*var tuesday = {}
                  tuesday.from = doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0"
                  tuesday.to = doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                  days.push({tuesday: tuesday})
                  */
                  //setChecked(currState)
                } else if (key === "wednesday"){
                  number = 3
                  currState['wednesday'] = true
                  var wednesday = {}
                  wednesday.from = doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0"
                  wednesday.to = doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                  
                  days.push({wednesday: wednesday})
                } else if (key === "thursday"){
                  number = 4
                  currState['thursday'] = true
                  var thursday = {}
                  thursday.from = doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0"
                  thursday.to = doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                  days.push({thursday: thursday})

                } else if (key === "friday"){
                  number = 5
                  currState['friday'] = true
                  var friday = {}
                  friday.from = doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0"
                  friday.to = doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                  days.push({friday: friday})


                } else if (key === "saturday"){
                  number = 6
                  currState['saturday'] = true
                  var saturday = {}
                  saturday.from = doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0"
                  saturday.to = doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                  days.push({saturday: saturday})

                } else if (key === "sunday"){
                  number = 7
                  currState['sunday'] = true
                  var sunday = {}
                  sunday.from = doc.data().openingHours[key].from.toDate().getHours() + ":" + doc.data().openingHours[key].from.toDate().getMinutes() + "0"
                  sunday.to = doc.data().openingHours[key].to.toDate().getHours() + ":" + doc.data().openingHours[key].to.toDate().getMinutes() + "0" 
                  days.push({sunday: sunday})


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
    {vrijeTijd?
      <Grid item xs={12} lg={12} sx={{ 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        overflow: 'auto'
        }}>
       <Snackbar open={openSnackbar} autoHideDuration={12000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          You have requested this appointment. You will get an email once this has been confirmed.
        </Alert>
      </Snackbar>

      <StyledModal
          aria-labelledby="unstylede-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <Box sx={style}>
            <Title>{t('Agenda.4')}</Title>
            { open && ok?
            <>
            <Grid container spacing={2} /*totaal is 12 bij xs*/> 
              <Grid item xs={4}>  
              Naam 
              </Grid>
              <Grid item xs={8}>  
              Manon Neirynck
              </Grid>

              <Grid item xs={4}>  
              Datum
              </Grid>
              <Grid item xs={8}>  
                    <TextField
                      id="date"
                      label="Date"
                      type="date"
                      name="date"
                      disabled
                      onChange={(e) => setDate(e.target.value)}
                      InputLabelProps={{
                      shrink: true,
                      }}
                      sx={{ width: 200 }}
                      value={date}
                      //defaultValue="2021-05-01"
                      //InputProps={{inputProps: { min: "2020-05-01"} }}
  
                    />
                  </Grid>

              <Grid item xs={4}>  
              Van
              </Grid>
              <Grid item xs={3}>  
                    <TextField
                      required
                      id="time"
                      label="From"
                      type="time"
                      name="from"
                      readonly='true'
                      onChange={(e) => {
                        if(e.target.value < startTimeBusiness){
                          console.log("error")
                        } else {
                          setStarthour(e.target.value)
                        }}
                      }
                      InputLabelProps={{
                      shrink: true,
                      }}
                      inputProps={{
                      step: 300, // 5 min
                      }}
                      fullWidth
                      //defaultValue="08:00"
                      value={starthour}
                      InputProps={{inputProps: { min: "09:00" }}}
  
                    />
                  </Grid>
                  <Grid item xs={5}> </Grid>


                  <Grid item xs={4}>  
                  Tot
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="time"
                      label="To"
                      type="time"
                      name="from"
                      fullWidth
                      disabled
                      //defaultValue={schema[number]}
                      onChange={(e) => {
                        if(e.target.value > endTimeBusiness){
                          console.log("error")
                        } else {
                          setEndhour(e.target.value)}
                        }}
                      InputLabelProps={{
                      shrink: true,
                      }}
                      inputProps={{
                      step: 300, // 5 min
                      }}
                      value={endhour}
                  />
                  </Grid>
                  <Grid item xs={5}>

                  <ButtonGroup 
                  variant="text" aria-label="text button group" size="large"
                  >
                  <Button onClick={(e) => {
                      const totalInMinutes = (parseInt(endhour.split(":")[0]) * 60) + parseInt(endhour.split(":")[1]);
                      const otherMinutes = 30;
                      var grandTotal = totalInMinutes - otherMinutes;
                      var bookH = String( Math.floor(grandTotal / 60)).padStart(2, '0')
                      var bookM = String(grandTotal % 60).padStart(2, '0')
                      var bookingDurationToHour = bookH + ':' + bookM;
                      if(bookingDurationToHour > starthour){
                        setEndhour(bookingDurationToHour)
                      } else {
                        alert("Niet binnen de business hours")
                      }
                      }}>-</Button>
                    <Button onClick={(e) => {
                      const totalInMinutes = (parseInt(endhour.split(":")[0]) * 60) + parseInt(endhour.split(":")[1]);
                      const otherMinutes = 30;
                      var grandTotal = otherMinutes + totalInMinutes;
                      var bookH = String( Math.floor(grandTotal / 60)).padStart(2, '0')
                      var bookM = String(grandTotal % 60).padStart(2, '0')
                      var bookingDurationToHour = bookH + ':' + bookM;
                      if(bookingDurationToHour <= endTimeBusiness){
                        setEndhour(bookingDurationToHour)
                      } else {
                        alert("Niet binnen de business hours")
                      }
                      }}>+</Button>
                  </ButtonGroup>

                  
                  </Grid>

                  <Grid item xs={4}>  
                  Vakken
                  </Grid>
                    { subjectid.length > 1 ? 

                       <Grid item xs={8}>
                        <FormGroup>
                        {subjectid.map((item, index) => (
                          <FormControlLabel control={
                          <Checkbox 
                            id={item.subjectid}
                            checked={checked[item.subjectid]}
                            onChange={handleChange}
                            defaultChecked />
                          } 
                          label={item.subject} />
                        ))}
                      </FormGroup>
                      </Grid>

                      : 

                      <Grid item xs={8}>
                     <FormControlLabel control={<Checkbox disabled checked />} label={subjectid[0].subject} />
                      </Grid>
                    }
               
                  

                  <Grid item xs={4}>  
                  Voeg een opmerking toe
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="text"
                      type="textarea"
                      name="text"
                      multiline
                      //defaultValue={schema[number]}
                      InputLabelProps={{
                      shrink: true,
                      }}
                      fullWidth
                      onChange={(e) => setOpmerking(e.target.value)}
                      //sx={{ width: 1000 }}
                  />
                  </Grid>
    
            </Grid>
            <Box component="form" onSubmit={aanvraagTutor} noValidate sx={{ mt: 1 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => aanvraagTutor}
            >
              Boek deze afspraak
            </Button>
          </Box>
            </>
            : 
            <></>
            }

            
          </Box>
        </StyledModal>
      { vrijeTijd ?
      <FullCalendar
      plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
      initialView="dayGridMonth"
      weekends={true}
      dateClick={handleDateClick}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      }}
      businessHours={vrijeTijd}
      selectConstraint= "businessHours"
      selectable="true"
      events={events}
    />
  
      :
      <p>Loading</p>
      }
      
        </Grid>
      
        
      :
      <p>Loading</p>
    }
    
  </>
  );
}

export default GoogleCalendarGridBig;