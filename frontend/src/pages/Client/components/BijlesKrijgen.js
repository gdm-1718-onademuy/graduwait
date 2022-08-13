import React, { useState, useEffect } from 'react';
import Title from './Title';
import { Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import colors from '../../colours.scss';

import {
  auth,
  db,
  firebase
} from "../../../services/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function preventDefault(event) {
  event.preventDefault();
}

export default function BijlesKrijgen(props) {
  const [user, loading, error] = useAuthState(auth);
  const dataKrijgen = props.krijgen
  const isStudent = props.boolKrijgen
  const [dataBijlesKrijgen, setDataBijlesKrijgen] = useState([])
  const { t, i18n } = useTranslation()
  const navigate = useNavigate();




  useEffect(() => {
    if(isStudent){
      getDataByIds()
    }
  }, [user, loading]);

  const goMatch = ()  => {
    // hier met location werken naar match
    navigate(
      '/match',
      {state: { dataKrijgen: dataKrijgen}}
      //{state: { bijlesKrijger: bijlesKrijgen, bijlesGever: bijlesGeven, richting: richting, location: value, firstName: firstName, lastName: lastName, email: email}}
    )
    /*history.push({
        pathname: '/match',
        search: '?query='+ dataKrijgen,
        state: { data: dataKrijgen }
    });*/
 };
 
  const getDataByIds = async () => {
    if (dataKrijgen.length === 0){
      console.log("nog geen vakken")
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
            if (dataKrijgen.includes(doc.id)){
              var element = {}
              element.id = doc.id
              element.subject = doc.data().subject
              element.field = doc.data().field
              
              subjects.push(element)
            }
        });
        setDataBijlesKrijgen(subjects)
      }) 
    }
  }


  return ( 
    <React.Fragment>  
      <Title>{t('Dashboard.2')}</Title>

      {dataKrijgen.length > 0 ?
      <Button 
        type="button"
        fullWidth
        variant="contained"
        onClick={goMatch}
        style={{
          backgroundColor: colors.purple,
          color: 'white'
        }}
      >{t('Dashboard.9')}
      </Button>
      :
      <Typography color="text.secondary" sx={{ flex: 1 }}>
      {t('Dashboard.4')}
      </Typography>
      }
      {isStudent ?
      <div>
      
      {dataBijlesKrijgen && dataBijlesKrijgen.map((item, index) => (
      <Typography component="p">{item.subject}  
      </Typography>
      ))}
      </div>
      :
      <p>Is geen student</p>
      }
      
    </React.Fragment>
  );  
}