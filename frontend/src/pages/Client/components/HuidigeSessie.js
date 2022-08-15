import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import {useTranslation} from 'react-i18next';
import React, { useState, useEffect, handleClientLoad } from 'react';
import { auth, getAppointmentsUser, getUserData } from '../../../services/config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";


function preventDefault(event) {
  event.preventDefault();
} 
 
export default function HuidigeSessie() {
  const { t } = useTranslation()
  const [user, loading, error] = useAuthState(auth);
  const [isTutor, setIsTutor] = useState("")
  const [isTutee, setIsTutee] = useState("")
  const [events, setEvents] = useState([])

  useEffect(async () => {
    if (user){
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
    }
  }, [user]);


  useEffect(async () => {
    if (user){
      if (isTutor !== "" && isTutee !== ""){
        const eventsOfUser = await getAppointmentsUser(user.uid, isTutor, isTutee, "own")
        console.log(eventsOfUser)
        if (eventsOfUser.length>0){
          const events = []
          for (const event in eventsOfUser){
            console.log(eventsOfUser[event])
            console.log(eventsOfUser[event].end)
            const dateEvent = new Date(eventsOfUser[event].end)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            console.log(dateEvent, today)
            if (dateEvent < today){
              console.log("oke je mag het opslaan")
              //events.push()
            }
    
          }
        }
        //setEvents(eventsOfUser)
      }
    }
  }, [isTutee, isTutor, user]);

  useEffect( () => {
    if (events.length>0){
      for (const event in events){
        console.log(events[event])
        console.log(events[event].end)
        const dateEvent = new Date(events[event].end)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log(today, dateEvent)
        if (dateEvent > today){

        }


        console.log(dateEvent > today) 
      }
    }
  }, [events]);


  return (
    <React.Fragment>
      <Title>{t('Dashboard.1')}</Title>
      <Typography component="p">
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>

      {t('Dashboard.5')}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
        </Link>
      </div>
    </React.Fragment>
  );
}