import React, { useState, useEffect } from 'react';
import Title from './Title';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';

import {
  auth,
  db
} from "../../../services/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";



function preventDefault(event) {
  event.preventDefault();
}
 
export default function BijlesGeven(props) {
  const [user, loading, error] = useAuthState(auth);
  const dataGeven = props.geven
  const isTutor = props.boolGeven
  const [dataBijlesGeven, setDataBijlesGeven] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    if(isTutor){
      getDataByIds()
    }
  }, [user, loading]);

  const getDataByIds = async () => {
    if (dataGeven.length === 0){
      console.log("nog geen gevraagde bijlessen")
    } else {
      console.log("wel al gevraagde bijlessen")
      const subjects = []
      // voeg toe aan firestore bij ik beheers
      await db
      .collection("subject")
      .get()
      .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
        querySnapshot.forEach(function(doc) {
            //doc.data().giveTutoring.push(id)
            if (dataGeven.includes(doc.id)){
              var element = {}
              element.id = doc.id
              element.subject = doc.data().subject
              element.field = doc.data().field
              
              subjects.push({element: element})
            }
        });
        setDataBijlesGeven(subjects)
      })
    }
  }

  


  return (
    <React.Fragment>
      <Title>{t('Dashboard.3')}</Title>
      {isTutor ?
      <div>
        {dataBijlesGeven && dataBijlesGeven.map((item, index) => (
        <Typography component="p" key={item.element.id}>{item.element.subject}
        </Typography>
        ))}
      </div>
      :
      <Typography color="text.secondary" sx={{ flex: 1 }}>
      {t('Dashboard.7')}
      </Typography>

      }
      
    </React.Fragment>
  );
}