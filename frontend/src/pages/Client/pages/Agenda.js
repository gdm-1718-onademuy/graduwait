import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import "./Agenda.scss";
import { auth, db } from "../../../services/config/firebase";
import LoggedIn from "../../auth/components/LoggedIn";
i//mport GoogleCalendarGrid from "../components/GoogleCalendar";
//import GoogleCalendarGridBig from "../components/GoogleCalendarBig";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {useTranslation} from 'react-i18next';
import Title from '../components/Title';
import { formControlClasses } from "@mui/material";
import Scheduler from "../components/SchedulerOtherProfile";
import Footer from "../../../footer/footer";



export default function Agenda() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [userData, setUserData] = useState();
  const [ownAgenda, setOwnAgenda] = useState();
  const [userid, setUserid] = useState();
  const [subjectid, setSubjectid] = useState();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { t } = useTranslation()
  const location = useLocation(); 
 
  useEffect(() => {
    //console.log(location.state)
    setName(location.state.name)
    setUserid(location.state.userid)
    setSubjectid(location.state.subjectid)
    //getDataUser()
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

  /*useEffect(() => {
    console.log(userid, name, subjectid)
  }, [userid])*/


  return (
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
        <p>Agenda from {name}</p>
        {name && userid && subjectid ? 
          <Scheduler userid={userid} name={name} subjectid={subjectid}></Scheduler>
        :
          <p> Loading</p>
        }
           {/*
            <Title>{t('Agenda.2')} {name}  </Title>
            {userid && name && subjectid?
            <GoogleCalendarGridBig userid={id} name={name} subjectid={subjectid}/>
            :
            <p>Loading</p>
            }
          */}

    </Container>
    </Box>
    </Box>
    </>
  );
}
