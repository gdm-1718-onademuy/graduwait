import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import "./Agenda.scss";
import { auth, db } from "../../../services/config/firebase";
import LoggedIn from "../../auth/components/LoggedIn";
import GoogleCalendarGrid from "../components/GoogleCalendarGrid";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Scheduler from "../components/Scheduler";

export default function MyAgenda() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  //const { afspraakid } = useParams(); 

  useEffect(() => {
    //getDataUser()
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

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
        <GoogleCalendarGrid /*afspraakid={afspraakid}*/ />
      </Container>
    </Box>
    </Box>
    </>
  );
}
