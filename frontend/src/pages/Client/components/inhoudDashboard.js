import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Typography, TextField, Button, Snackbar, Grid, Paper} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';

// components
import BijlesKrijgen from './BijlesKrijgen';
import BijlesGeven from './BijlesGeven';
import Title from './Title';
import HuidigeSessie from './HuidigeSessie';

// firebase
import {
  auth,
  db,
  firebase
} from "../../../services/config/firebase";
  
  export default function InhoudDashboard() {
    const [showResults, setShowResults] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [subjects, setSubjects] = useState("")
    const [id, setId] = useState("0")
    const [field, setField] = useState()
    const [info_nl, setInfo_nl] = useState()
    const [info_en, setInfo_en] = useState()
    const onClick = () => setShowResults(true)
    //const showDetail = () => setShowDetails(true)
    const [user, loading, error] = useAuthState(auth);
    const [searchMatch, setSearchMatch] = useState([])
    const navigate = useNavigate();
    const [subject, setSubject] = useState("")
    const [dataBijlesKrijgen, setDataBijlesKrijgen] = useState([])
    const [dataBijlesGeven, setDataBijlesGeven] = useState([])
    const [isTutor, setIsTutor] = useState(false)
    const [isStudent, setIsStudent] = useState(false)
    const { t, i18n } = useTranslation()
    const [language, setLanguage] = useState(i18n.language)
    const [openSnackbar, setOpenSnackBar] = React.useState(false);

    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const showDetail = (id, subject, field, info_nl, info_en) => {
      setShowDetails(true)
      setId(id)
      setSubject(subject)
      setField(field)
      setInfo_nl(info_nl)
      setInfo_en(info_en)
    }

    const closeSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackBar(false);
    }

    const getSubjects = async () => {
      const dataa = []
      await db
      .collection("subject")
      .get()
      .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
        querySnapshot.forEach(function(doc) {
            var element = {}
            element.id = doc.id
            element.subject = doc.data().subject
            element.field = doc.data().field
            element.info_nl = doc.data().info_nl
            element.info_en = doc.data().info_en
            
            dataa.push({element: element})
        });
        setSubjects(dataa)   //set data in state here
      })
    }

    const getdataBijlessen = async () => {
      // voeg toe aan firestore bij ik beheers
      await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
        querySnapshot.forEach(function(doc) {
          if (doc.data().giveTutoring){
            setDataBijlesGeven(doc.data().giveTutoring)
            setIsTutor(true)
          } else {
            setIsTutor(false)
          }
          if (doc.data().getTutoring){
            setIsStudent(true)
            setDataBijlesKrijgen(doc.data().getTutoring)

          } else {
            setIsStudent(false)
          }
        });
        setShowResults(false)
      })
    }


    const searchSubjects = (text) => {
      setShowResults(true)
      console.log(text)
      let matches = subjects.filter((subject) => {
        const regex = new RegExp(`${text}`, "gi");
        return subject.element.subject.match(regex) 
      })
      setSearchMatch(matches)
    }

    const ikBeheers = async (e) => {
      e.preventDefault();
      // voeg toe aan firestore bij ik beheers
      await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
        querySnapshot.forEach(function(doc) {
            //doc.data().giveTutoring.push(id)
            db
            .collection("users")
            .doc(doc.id).update({
              giveTutoring: firebase.firestore.FieldValue.arrayUnion(id)
            })
        });
      })
      getdataBijlessen()
      setShowResults(false)
      setShowDetails(false)
      setOpenSnackBar(true)
    }

    const ikBeheersNietmeer = async (e) => {
      e.preventDefault()
      //console.log(id)
      await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
        querySnapshot.forEach(function(doc) {
            //doc.data().giveTutoring.push(id)
            db
            .collection("users")
            .doc(doc.id).update({
              giveTutoring: firebase.firestore.FieldValue.arrayRemove(id)
            })
        });
      })
      getdataBijlessen()
      setShowResults(false)
      setShowDetails(false)
      setOpenSnackBar(true)

    }

    const ikWilBijles = async (e) => {
      e.preventDefault();
      // voeg toe aan firestore bij ik wil bijles voor
      await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
        querySnapshot.forEach(function(doc) {
            //doc.data().giveTutoring.push(id)
            db
            .collection("users")
            .doc(doc.id).update({
              getTutoring: firebase.firestore.FieldValue.arrayUnion(id)
            })
        });
      })
      getdataBijlessen()
      setShowResults(false)
      setShowDetails(false)
      setOpenSnackBar(true)

    }

    const ikWilBijlesNietmeer = async (e) => {
      e.preventDefault();
      // voeg toe aan firestore bij ik wil bijles voor
      await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
        querySnapshot.forEach(function(doc) {
            //doc.data().giveTutoring.push(id)
            db
            .collection("users")
            .doc(doc.id).update({
              getTutoring: firebase.firestore.FieldValue.arrayRemove(id)
            })
        });
      })
      getdataBijlessen()
      setShowResults(false)
      setShowDetails(false)
      setOpenSnackBar(true)

    }


    useEffect(() => {
      getSubjects()
      if (user){
        getdataBijlessen()
        console.log(isStudent, isTutor)
      }
      //if (loading) return;
      //if (user) navigate("/dashboard");
    }, [user, loading]);

    useEffect(() => {
      setLanguage(i18n.language)
    }, [i18n.language]);

    useEffect(() => {
      console.log(isTutor)
      console.log(isStudent)
  
    }, [isTutor, isStudent]);

    /*useEffect(() => {
      //rerenderen als er op een knop is geduwd van bijles geven of krijgen
      if (user){
        getdataBijlessen()
      }
      //if (loading) return;
      //if (user) navigate("/dashboard");
    }, [user]);*/



    const Overview = () => (
      <Grid container spacing={3}>
        {isStudent && isTutor ?
          <>
            {/* Huidige sessie */}
          <Grid item xs={12} md={4} lg={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '63vh',
                      overflow: 'auto'
                    }}
                  >
                    <HuidigeSessie  />
                  </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
          <Paper
              sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '63vh',
              overflow: 'auto'

              }}
          >
              <BijlesKrijgen krijgen={dataBijlesKrijgen} boolKrijgen={isStudent} /> 
          </Paper>
          </Grid>
    
          <Grid item xs={12} md={4} lg={4}>
          <Paper sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '63vh',
                      overflow: 'auto'

                  }}>
              <BijlesGeven geven={dataBijlesGeven} boolGeven={isTutor}/>
          </Paper>
          </Grid>
          </>
          :
          <> {isStudent ?
              <>
                    {/* Huidige sessie */}
          <Grid item xs={12} md={6} lg={6}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '70vh',
                      overflow: 'auto'

                    }}
                  >
                    <HuidigeSessie  />
                  </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
          <Paper
              sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '70vh',                        
              overflow: 'auto'

              }}
          >
              <BijlesKrijgen krijgen={dataBijlesKrijgen} boolKrijgen={isStudent} /> 
          </Paper>
          </Grid></>
            : 
              <>
                    {/* Huidige sessie */}
          <Grid item xs={12} md={6} lg={6}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '70vh',
                      overflow: 'auto'

                    }}
                  >
                    <HuidigeSessie  />
                  </Paper>
          </Grid>
    
          <Grid item xs={12} md={6} lg={6}>
          <Paper sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '70vh',
                      overflow: 'auto'

                  }}>
              <BijlesGeven geven={dataBijlesGeven} boolGeven={isTutor}/>
          </Paper>
          </Grid></>
            }
      
          </>
        }
      
          </Grid>
    )

      
      const SearchResults = () => (
        <Grid contaisner spacing={3}>
          <Grid item xs={12}>
          <Paper sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '66.5vh',
                      overflow: 'auto'

                  }}>
               <React.Fragment>                
              { showDetails ? 
                <>
                <Title>{subject}</Title>
                <Typography component="h3">
                  <>{field}</>
                </Typography>
                <Typography component="p">
                  {language === "en" ?
                  <>{info_en}</>
                  :
                  <>{info_nl}</>
                  } 
                </Typography>
                <br></br>
                {isTutor?
                  <>
                  {dataBijlesGeven.includes(id)?
                    <Button 
                      variant="outlined" 
                      onClick={ikBeheersNietmeer}
                      style={{backgroundColor: "#953AA8",color:"white", maxWidth: "300px"}}>
                      {t('Dashboard.11')}
                    </Button> 
                    :
                    ( dataBijlesKrijgen.includes(id) ?
                      <Button 
                      disabled
                      variant="outlined" 
                      //onClick={ikBeheers}
                      //style={{backgroundColor: "#953AA8",color:"white", maxWidth: "300px"}}>
                      >{t('Dashboard.8')}
                    </Button> 
                    :
                      <Button 
                      variant="outlined" 
                      onClick={ikBeheers}
                      style={{backgroundColor: "#953AA8",color:"white", maxWidth: "300px"}}>
                      {t('Dashboard.8')}
                    </Button> 
                      
                    )
                   
                  }
                 </>: <></>
                }
                {isStudent?
                  <>
                  {dataBijlesKrijgen.includes(id)?
                    <Button 
                      variant="outlined" 
                      onClick={ikWilBijlesNietmeer}
                      style={{backgroundColor: "#E07730",color:"white", maxWidth: "300px"}}
                      >{t('Dashboard.12')}
                    </Button>
                    :
                    (dataBijlesGeven.includes(id)?
                    <Button 
                      disabled
                      variant="outlined" 
                      //onClick={ikWilBijles}
                      //style={{backgroundColor: "#E07730",color:"white"}}
                      >{t('Dashboard.13')}
                    </Button>   
                    :
                    <Button 
                      variant="outlined" 
                      onClick={ikWilBijles}
                      style={{backgroundColor: "#E07730",color:"white", maxWidth: "300px"}}
                      >{t('Dashboard.13')}
                    </Button>   
                    )
                   
                  }
                </>: <></>
                }
                </>
              : 
                <>
                <Title>Search results</Title>
                {searchMatch && searchMatch.map((item, index) => (
                  <div>
                    <Typography id={index} onClick={(e) => showDetail(item.element.id, item.element.subject, item.element.field, item.element.info_nl, item.element.info_en)} component="p"> {item.element.subject} ({item.element.field}) 
                     </Typography>                      
                    </div>
                ))}
         
                </>
              }
            
                </React.Fragment>
          </Paper>
          </Grid>
          </Grid>
      )

    return (
        <> 
        <Snackbar open={openSnackbar} autoHideDuration={12000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          {t('Dashboard.10')}
        </Alert>

      </Snackbar>
        {
        subjects && 
          <TextField
            margin="normal"
            fullWidth
            id="search"
            label={t('Dashboard.4')}
            name="search"
            autoComplete="search"
            autoFocus
            onChange={(e) => searchSubjects(e.target.value)}
          />
        }
  
        { showResults ? < SearchResults /> : <Overview />}
      </>
    );
  }

