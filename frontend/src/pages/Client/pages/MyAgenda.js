import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import "./Agenda.scss";
import { auth, db } from "../../../services/config/firebase";
import LoggedIn from "../../auth/components/LoggedIn";
import GoogleCalendarGrid from "../components/GoogleCalendarGrid";
import {Box, Grid, Paper, Container, CssBaseline } from '@mui/material';
import Scheduler from "../components/Scheduler";

export default function MyAgenda() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  //const { afspraakid } = useParams(); 
  const location = useLocation(); 

  useEffect(() => {
    //getDataUser()

    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

  useEffect(() => {
    //getDataUser()
    console.log(location.state)
  }, [location]);

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
      <Grid container spacing={3}>
            <Grid  item xs={12} >
            <Paper sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          height:'80vh',
                          overflow: 'auto'
                        }}>
        {!location.state?
        <GoogleCalendarGrid />
        :
        <GoogleCalendarGrid userid = {location.state.userid} person={location.state.person} subjectids={location.state.subjectids} isTutor = {location.state.isTutor} isTutee = {location.state.isTutee} rate = {location.state.rate} />
        }
        </Paper>
      </Grid>
      </Grid>
      </Container>
    </Box>
    </Box>
    </>
  );
}
