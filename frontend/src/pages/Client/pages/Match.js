import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import sortArray from 'sort-array'
import { Avatar, Paper, TableRow, TableHead, TableCell, TableBody, Typography, CardContent, Button, CssBaseline, Box, Container, Grid} from '@mui/material';
import { auth, db } from "../../../services/config/firebase";
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
    const [arraySubjects, setArraySubjects] = useState([])
    const [arrayGiveTutoring, setArrayGiveTutoring] = useState([])
    const [amountUsers, setAmountUsers] = useState(0) // de aantal
    const [amountMatches, setAmountMatches] = useState(0) // de count
    const [matches, setMatches] = useState()
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

    const goToAgenda = (userid, name, subjectid) => {
        // console.log(userid, name, subjectid)
        navigate(
            '/agenda/' + userid,
            {state: { userid: userid, name: name, subjectid: subjectid}}
            //{state: { bijlesKrijger: bijlesKrijgen, bijlesGever: bijlesGeven, richting: richting, location: value, firstName: firstName, lastName: lastName, email: email}}
          )
    }

    useEffect(() => {
        setArraySubjects(location.state.dataKrijgen)
        //findMatches(["3ot8CYJzwrehJEVGMUpl", "B2VBvQVb2VTgnlNCDux2", "LxcRRiHQhht0Aj5YRdvQ", "j4YpDs8BWvpubjl1P8Eb"])
    }, [user, loading]);

    useEffect(() => {
        part1()
    }, [arraySubjects]);

    useEffect(() => {
        part2()
    }, [lngLoggedIn]);

    useEffect(() => {
        part3()
    }, [arrayGiveTutoring]);

    useEffect(() => {
        part4()
    }, [vakkenZelfde]);


    const part1 = async (arraySubjects) => {
        await db.collection("users").where("uid", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    setLatLoggedIn(doc.data().latlng._lat)
                    setLngLoggedIn(doc.data().latlng._long)
                });
            })
            .catch((error) => {
                // console.log("Error getting ddocumednts: ", error);
            });
    }

    const part2 = async () => {
        //setAmountUsers(0)
        await db
        .collection("users")
        .get()
        .then((querySnapshot) => { 
            if (user.uid !== null){
                querySnapshot.forEach(function(doc) {
                    setDocDataUid(doc.data().uid)
                //if(user){
                //console.log(doc.data().uid, user.uid)
                if(doc.data().uid === user.uid ){
                    // console.log("zelfde user, niks doen")
                } else {
                    //console.log("andere user", doc.data().firstname)
                    if (doc.data().giveTutoring) {
                        if (doc.data().giveTutoring.length > 0) {
                            // dit zijn de potentiële tutors
                            //let count = 0
                            //let vakkenZelfde = []
                            //let vakkenNewZelfde = []
                            //let arrayGiveTutoring = doc.data().giveTutoring
                            setArrayGiveTutoring(doc.data().giveTutoring)
                            // console.log(arraySubjects, arrayGiveTutoring)
                        }
                    }
                }
        })}})
    }

    const part3 = async () => {
        let map = {};
        arraySubjects.forEach(i => map[i] = false);
        arrayGiveTutoring.forEach(i => map[i] === false && (map[i] = true));
        for (const property in map) {
            if (map[property] === true){
                //count++;
                setAmountMatches(amountMatches+1)
                setVakkenNewZelfde(vakkenNewZelfde.concat(property))
                //vakkenNewZelfde.push(property)

                const vakkenElement = {}
                vakkenElement.subjectid = property
                db
                .collection("subject")
                .doc(property)
                .get()
                .then((querySnapshot) => { 
                    //console.log("zelfde vak", querySnapshot.data().subject)
                    vakkenElement.subject = (querySnapshot.data().subject)
                    vakkenElement.field = (querySnapshot.data().field)
                    //vakkenZelfde.push(vakkenElement)
                    setVakkenZelfde(vakkenZelfde.concat(vakkenElement))
                })
            }
        }
        
    }

    const part4 = async () => {
        if (amountMatches > 0){
            //aantalUsers++;
            setAmountUsers(amountUsers+1)
            // console.log("potentiële tutor met naam:" + doc.data().firstname )
            const data = []
            // save all data of each user
            db.collection("users").where("uid", "==", docDataUid).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    var element = {}
                    element.id = doc.id
                    element.aantal = amountMatches
                    element.person = doc.data().firstname + " " + doc.data().lastname
                    element.uid = docDataUid
                    element.avatar = doc.data().avatar
                    element.vakkenZelfde = vakkenZelfde
                    element.price = doc.data().kost
                    element.distance = checkDistance(doc.data().latlng._lat,doc.data().latlng._long , latLoggedIn, lngLoggedIn) // hier eig met latLoggedIn en letLoggedIn
                    console.log(element)
                    data.push(element)
                });
            })
            .catch((error) => {
                // console.log("Error getting ddocumednts: ", error);
                console.log("errorrr, not working")
            });
            setMatches(data)
            console.log('match')
        }
        
    }




    /*const findMatches = async (arraySubjects) => {
        //console.log(user.uid)
        // eerst lat en long halen van de ingelogde user
        /*let lat_loggedin = 0
        let lng_loggedin = 0
        await db.collection("users").where("uid", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());

                    lat_loggedin = doc.data().latlng._lat
                    lng_loggedin = doc.data().latlng._long
                });
            })
            .catch((error) => {
                // console.log("Error getting ddocumednts: ", error);
            });
        
        let aantalUsers = 0
        await db
        .collection("users")
        .get()
        .then((querySnapshot) => { 
            if (user.uid !== null){
                querySnapshot.forEach(function(doc) {
                //setDocDataUid(doc.data().uid)
                //if(user){
                //console.log(doc.data().uid, user.uid)
                if(doc.data().uid === user.uid ){
                    // console.log("zelfde user, niks doen")
                } else {
                    //console.log("andere user", doc.data().firstname)
                    if (doc.data().giveTutoring) {
                        if (doc.data().giveTutoring.length > 0) {
                            // dit zijn de potentiële tutors
                            let count = 0
                            let vakkenZelfde = []
                            let vakkenNewZelfde = []
                            let arrayGiveTutoring = doc.data().giveTutoring
                            // console.log(arraySubjects, arrayGiveTutoring)
                            let map = {};
                            arraySubjects.forEach(i => map[i] = false);
                            arrayGiveTutoring.forEach(i => map[i] === false && (map[i] = true));
                            for (const property in map) {
                                if (map[property] === true){
                                    count++;
                                    vakkenNewZelfde.push(property)

                                    const vakkenElement = {}
                                    vakkenElement.subjectid = property
                                    db
                                    .collection("subject")
                                    .doc(property)
                                    .get()
                                    .then((querySnapshot) => { 
                                        //console.log("zelfde vak", querySnapshot.data().subject)
                                        vakkenElement.subject = (querySnapshot.data().subject)
                                        vakkenElement.field = (querySnapshot.data().field)
                                        vakkenZelfde.push(vakkenElement)
                                    })
                                }
                            }
                            if (count > 0){
                                aantalUsers++;
                                setAmountUsers(aantalUsers)
                                // console.log("potentiële tutor met naam:" + doc.data().firstname )
                                const data = []
                                // save all data of each user
                                db.collection("users").where("uid", "==", doc.data().uid).get()
                                .then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        // doc.data() is never undefined for query doc snapshots
                                        // console.log(doc.id, " => ", doc.data());
                                        var element = {}
                                        element.id = doc.id
                                        element.aantal = count
                                        element.person = doc.data().firstname + " " + doc.data().lastname
                                        element.uid = doc.data().uid
                                        element.avatar = doc.data().avatar
                                        element.vakkenZelfde = vakkenZelfde
                                        element.price = doc.data().kost
                                        element.distance = checkDistance(doc.data().latlng._lat,doc.data().latlng._long , lat_loggedin, lng_loggedin) // hier eig met latLoggedIn en letLoggedIn
                                        console.log(element)
                                        data.push(element)
                                    });
                                })
                                .catch((error) => {
                                    // console.log("Error getting ddocumednts: ", error);
                                });
                                setMatches(data)
                                console.log('match')
                            }
                            /*db
                            .collection("users").doc("CzNWACORe23csQjyNfYC")
                            .get()
                            .then((querySnapshot) => {  
                                //setUserData(querySnapshot.data())
                                console.log(querySnapshot.data())
                                //userLat = querySnapshot.data().city._lat
                                //userLong = querySnapshot.data().city._long
                            })
                            //const distance = getDistance({ latitude: doc.data().city._lat, longitude: doc.data().city._long },{ latitude: userLat, longitude: userLong })
                            
                        }
                    }
                }
                })
            }
    })    
   //set data in state heres
    //setFilter("MostMatches")
    }*/

    useEffect(() => {
        console.log(matches)
    }, [matches])

    return (
        <>
            <LoggedIn/>
            <LayoutFull>
            <Title> Er werd(en) {amountUsers} persoon/personen met matches gevonden in de buurt</Title>
            <Button onClick={() => setFilter("MostMatches")}>Filter by most matches</Button>
            <Button onClick={() => setFilter("PriceLowHigh")}>Filter by price low to high</Button>
            <Button onClick={() => setFilter("PriceHighLow")}>Filter by price high to low</Button>
            <Button onClick={() => setFilter("DistanceCloseFar")}>Filter by distance close to far</Button>
            <Button onClick={() => setFilter("DistanceFarClose")}>Filter by distance far to close</Button>
            <Button onClick={() => setFilter("ReviewBestWorse")}>Filter by reviews best to worse</Button>
            <Button onClick={() => setFilter("ReviewWorseBest")}>Filter by reviews worse to best</Button>

                <p>Matches willen niet printen, maar wel als je een filter instelt:</p>

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
                                        <p><LocationOnIcon/> {item.distance}  {t('Match.2')}</p>
                                        <p><Rating name="read-only" value={3} readOnly /></p>
                                    </Grid>

                                    <Grid item xs={4}>

                                        {item.vakkenZelfde && item.vakkenZelfde.map((vak, index)=> 
                                            <p>{vak.subject} </p>
                                        )}
                                    </Grid>
        
                            
                                </Grid>
              
                                    <br />
                                <Button onClick={() => goToAgenda(item.uid, item.person, item.vakkenZelfde)}>Boek een afspraak</Button>
                            </Grid>
                        </Grid>

                        </CardContent>
                    : 
                        <></>
                    }
                
                    </>
                ))}

            </LayoutFull>
        </>
    )
}

