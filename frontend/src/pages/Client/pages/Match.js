import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import sortArray from 'sort-array'
import { Avatar, Paper, TableRow, TableHead, TableCell, TableBody, Typography, CardContent, Button, CssBaseline, Box, Container, Grid} from '@mui/material';
import { auth, db, getUserData, getSubjectById, getAllUsers } from "../../../services/config/firebase";
import {useTranslation} from 'react-i18next';
import EuroIcon from '@mui/icons-material/Euro';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Rating from '@mui/material/Rating';

// styling
import "./Match.scss";

// components
import LoggedIn from "../../auth/components/LoggedIn";
import LayoutFull from '../components/Layout/LayoutFull';
import Title from '../components/Title';

// functions 
import { checkDistance /*, getTutors, loadMapApi, loadTheScript, loadScript */} from '../../../services/functions/matching';

export default function Match() {
    const [tutors, setTutors] = useState([])
    const [user, loading, error] = useAuthState(auth)
    const [userInformation, setUserInformation] = useState()
    const [allUsers, setAllUsers] = useState([])
    const [arraySubjects, setArraySubjects] = useState([])
    const [arrayGiveTutoring, setArrayGiveTutoring] = useState([])
    const [amountUsers, setAmountUsers] = useState(0) // de aantal
    const [amountMatches, setAmountMatches] = useState(0) // de count
    const [matches, setMatches] = useState([])
    const [filter, setFilter] = useState("")
    const [filterQuery, setFilterQuery] = useState("")
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation()
    const [latLoggedIn, setLatLoggedIn] = useState(0)
    const [lngLoggedIn, setLngLoggedIn] = useState(0)
    const [vakkenZelfde, setVakkenZelfde] = useState([])
    const [vakkenNewZelfde, setVakkenNewZelfde] = useState([])
    const [docDataUid, setDocDataUid] = useState()
    const [infoUserMatch, setInfoUserMatch] = useState({})
    


    useEffect(() => {
        if (user){
            findMatches(location.state.dataKrijgen)
            //console.log(location.state.dataKrijgen)
            //getUserById()
        }
        //findMatches(["3ot8CYJzwrehJEVGMUpl", "B2VBvQVb2VTgnlNCDux2", "LxcRRiHQhht0Aj5YRdvQ", "j4YpDs8BWvpubjl1P8Eb"])
    }, [user, loading]);


    useEffect(() => {

        if(!matches){
            return
        }

        let sorted = matches
        if (filter === "PriceLowHigh"){
            sorted = sortArray(matches, {by: 'price', order: 'desc'})
        } else if (filter === "PriceHighLow") {
            sorted = sortArray(matches, {by: 'price', order: 'asc'})
        } else if (filter === "DistanceCloseFar") {
            sorted = sortArray(matches, {by: 'distance', order: 'desc'})
        } else if (filter === "DistanceFarClose") {
            sorted = sortArray(matches, {by: 'distance', order: 'asc'})
        } else if (filter === "ReviewBestWorse") {
            sorted = sortArray(matches, {by: 'review', order: 'desc'})
        } else if (filter === "ReviewWorseBest") {
            sorted = sortArray(matches, {by: 'review', order: 'asc'})
        } else if (filter === "MostMatches"){
            sorted = sortArray(matches, {by: 'aantal', order: 'desc'})
        }

        setMatches(sorted)
        // dit rerenderen?
    },[filter]);

    const goToAgenda = (userid, name, subjectids, isTutor, isTutee, rate, emailTutor) => {
        console.log(userid, name, subjectids, isTutor, isTutee, rate, emailTutor)
        navigate(
            '/agenda/' + userid,
            {state: { userid: userid, person: name, subjectids: subjectids, isTutor:isTutor, isTutee: isTutee, rate: rate, emailTutor: emailTutor }}
            //{state: { bijlesKrijger: bijlesKrijgen, bijlesGever: bijlesGeven, richting: richting, location: value, firstName: firstName, lastName: lastName, email: email}}
          )
    }

    const findMatches = async (arraySubjects) => {
        //setArraySubjects(arraySubjects)
        // eerst lat en long halen van de ingelogde user
        const geopoints = await getUserData(user.uid)
        let lat_loggedin = geopoints.latlng._lat
        let lng_loggedin = geopoints.latlng._long

        let aantalUsers = 0
        const data = []
        const allUsers = await getAllUsers()
        //console.log(allUsers[0])
        for (const u in allUsers) {
            const usr = allUsers[u]
            if(allUsers[u].uid !== user.uid && allUsers[u].giveTutoring){
                if(allUsers[u].giveTutoring.length > 0){
                    //console.log(usr)

                    let count = 0
                    let vakkenZelfde = []
                    let vakkenNewZelfde = []
                    let arrayGiveTutoring = allUsers[u].giveTutoring
                    // console.log(arraySubjects, arrayGiveTutoring)
                    let map = {};
                    arraySubjects.forEach(i => map[i] = false);
                    arrayGiveTutoring.forEach(i => map[i] === false && (map[i] = true));
                    for (const property in map) {
                        if (map[property] === true){
                            count++;
                            vakkenNewZelfde.push(property)

                            const subjectdata = await getSubjectById(property)

                            const vakkenElement = {}
                            vakkenElement.subjectid = property
                            vakkenElement.subject = subjectdata.subject
                            vakkenElement.field = subjectdata.field
                            vakkenZelfde.push(vakkenElement)
                        }
                    }
                    if (count > 0){
                        aantalUsers++;
                        setAmountUsers(aantalUsers)
                        // console.log("potentiële tutor met naam:" + doc.data().firstname )
                        //const data = []
                        // save all data of each user
                        const specificuser = await getUserData(usr.uid)
                        var element = {}
                        element.id = specificuser.uid
                        element.aantal = count
                        element.person = specificuser.firstname + " " + specificuser.lastname
                        element.uid = specificuser.uid
                        element.avatar = specificuser.avatar
                        element.vakkenZelfde = vakkenZelfde
                        element.price = specificuser.kost
                        element.email = specificuser.email
                        element.distance = checkDistance(specificuser.latlng._lat,specificuser.latlng._long , lat_loggedin, lng_loggedin) // hier eig met latLoggedIn en letLoggedIn
                        console.log(element)
                        data.push(element)
                        //setMatches(matches => matches.concat(data))
                        
                    }
                }
            }
        }
    setMatches(data)
    console.log('match')


     
   //set data in state heres
    //setFilter("MostMatches")
    }

    useEffect(() => {
        console.log(matches)
    }, [matches])

    return (
        <>
            <LoggedIn/>
            <LayoutFull>
            <Title> {amountUsers} {t('Match.5')}</Title>
            <Paper sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    //height: '10vh',
                    overflow: 'auto',
                    margin: "0 0 30px 0",
                    }}>
            <Button fullWidth variant="outlined" onClick={() => setFilter("MostMatches")}>{t('Match.6')}</Button>
            <Button fullWidth variant="outlined" onClick={() => setFilter("PriceLowHigh")}>{t('Match.7')}</Button>
            <Button fullWidth variant="outlined" onClick={() => setFilter("PriceHighLow")}>{t('Match.8')}</Button>
            <Button fullWidth variant="outlined" onClick={() => setFilter("DistanceCloseFar")}>{t('Match.9')}</Button>
            <Button fullWidth variant="outlined" onClick={() => setFilter("DistanceFarClose")}>{t('Match.10')}</Button>
            <Button fullWidth variant="outlined" onClick={() => setFilter("ReviewBestWorse")}>{t('Match.11')}</Button>
            <Button fullWidth variant="outlined" onClick={() => setFilter("ReviewWorseBest")}>{t('Match.12')}</Button>
            </Paper>
                {matches && matches.map((item, index) => 
                (
                    <>
                    {item.aantal > 0 ?
                        <CardContent key={item.uid}>
                            <Grid container spacing={3}>
                            <Grid item >

                            <Avatar
                                alt={item.person}
                                src={item.avatar}
                                sx={{ 
                                    width: 150, 
                                    height: 150,
                                }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="div">
                                    {item.person} 
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {item.aantal} match(es)
                                </Typography>


                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <p><EuroIcon/>{item.price} {t('Match.3')}</p>
                                        <p><LocationOnIcon/> {(item.distance/1000).toFixed(1)}  {t('Match.2')}</p>
                                        <p><Rating name="read-only" value={3} readOnly /></p>
                                    </Grid>

                                    <Grid item xs={4}>

                                        {item.vakkenZelfde && item.vakkenZelfde.map((vak, index)=> 
                                            <p>{vak.subject} </p>
                                        )}
                                    </Grid>
        
                            
                                </Grid>
              
                                    <br />
                                <Button onClick={() => goToAgenda(item.uid, item.person, item.vakkenZelfde, item.isTutor, item.isTutee, item.price, item.email)}>{t('Match.13')}</Button>
                            </Grid>
                        </Grid>

                        </CardContent>
                    : 
                    <> {/* test user*/}
                  
                </>



                    }
                
                    </>
                ))}

            </LayoutFull>
        </>
    )
}

