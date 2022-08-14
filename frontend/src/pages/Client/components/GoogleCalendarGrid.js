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
  auth,db,editApp
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

export default function GoogleCalendarGrid() {
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

  return(
    <>Hey</>
  )

}

