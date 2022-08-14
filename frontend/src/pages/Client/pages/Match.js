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

    const goToAgenda = (userid, name, subjectids, isTutor, isTutee) => {
        console.log(userid, name, subjectids, isTutor, isTutee)
        navigate(
            '/agenda/' + userid,
            {state: { userid: userid, person: name, subjectids: subjectids, isTutor:isTutor, isTutee: isTutee }}
            //{state: { bijlesKrijger: bijlesKrijgen, bijlesGever: bijlesGeven, richting: richting, location: value, firstName: firstName, lastName: lastName, email: email}}
          )
    }

  /*const getUserById = async () => {
    // * CREATE FETCH DATA OBJECT 
    let fetchData = {
      crossDomain: false,
      method: 'POST',
      body: JSON.stringify({ 
          uid: user.uid, 
          js:true
      }),
      headers: {
          "Content-Type": "application/json",
      }
    }

    await fetch("/get-user-by-uid", fetchData)
    .then(response => response.json())
    .then((data) => {
        setUserInformation(data)
    })
    .catch((error) => {
        setUserInformation(error)
    })
  }*/

    useEffect(() => {
        if (user){
            setArraySubjects(location.state.dataKrijgen)
            console.log(location.state.dataKrijgen)
            //getUserById()
        }
        //findMatches(["3ot8CYJzwrehJEVGMUpl", "B2VBvQVb2VTgnlNCDux2", "LxcRRiHQhht0Aj5YRdvQ", "j4YpDs8BWvpubjl1P8Eb"])
    }, [user, loading]);

    /*useEffect(() => {
        console.log(userInformation) // eigenlijk niet nodig, dan krijg je server kant data
    }, [userInformation]);*/

    useEffect(() => {
        if (arraySubjects.length > 0){
            getLatLngLoggedIn()
        }
    }, [arraySubjects]);

    useEffect(() => {
        if (lngLoggedIn ){
            getAllUsers()
        }
    }, [lngLoggedIn]);

    useEffect(() => {
        if (allUsers.length>0 ){
            // do per user this
            getUsersWhoTutor()
        }
    }, [allUsers]);



    useEffect(() => {
        if (arrayGiveTutoring.length > 0){
            console.log(arrayGiveTutoring)
            part3()
        }
    }, [arrayGiveTutoring]);

    useEffect(() => {
        part4()
    }, [vakkenZelfde]);

    useEffect(() => {
        console.log(allUsers)
    }, [allUsers]);

    useEffect(() => {
        console.log(vakkenZelfde)
    }, [vakkenZelfde]);


    const getLatLngLoggedIn = async () => {
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

    const getAllUsers = async () => {
        //setAmountUsers(0)
        // alle users overlopen en tijdelijk opslaan in docDataUid
         // als deze uid niet zelfde is als ingelogde, ga verder
          // als deze user bijles GEEFT, ga verder
           // 
        const data = []
        await db
        .collection("users")
        .get()
        .then((querySnapshot) => { 
            if (user.uid !== null){
                //for (const shot of querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    data.push(doc.data())
        })}})
        setAllUsers(data)
    }

    const getUsersWhoTutor = async () => {
        //setAmountUsers(0)
        // alle users overlopen en tijdelijk opslaan in docDataUid
         // als deze uid niet zelfde is als ingelogde, ga verder
          // als deze user bijles GEEFT, ga verder
           // 
        const data = []
        for (const u of allUsers) {
            // if user is not signed in user && user is tutor && has selected minimum 1 subject
            if (u.uid !== user.uid && u.giveTutoring && u.giveTutoring.length > 0){
                console.log(u.firstname)
                console.log(u.giveTutoring)
                //setInfoUserMatch({"name": "ona"})
                setArrayGiveTutoring(u.giveTutoring)
                setDocDataUid(u.uid)


                /*var infoUMatch = {}
                infoUMatch.id = u.uid
                infoUMatch.person = u.firstname + " " + u.lastname
                infoUMatch.uid = u.uid
                infoUMatch.avatar = u.avatar
                //infoUserMatch.vakkenZelfde = vakkenZelfde
                infoUMatch.price = u.kost
                infoUMatch.distance = checkDistance(u.latlng._lat, u.latlng._long, latLoggedIn, lngLoggedIn) // hier eig met latLoggedIn en letLoggedIn
                console.log(infoUMatch)
                //data.push(element)
                setArrayGiveTutoring(u.giveTutoring)
                //setInfoUserMatch(infoUMatch)*/

            }
        }
    }

    const part3 = async () => {
        console.log("part3")
        console.log(arrayGiveTutoring)
        let map = {};
        arraySubjects.forEach(i => map[i] = false);
        arrayGiveTutoring.forEach(i => map[i] === false && (map[i] = true));
        for (const property in map) {
            if (map[property] === true){
                console.log(property, "dit is hetzelfde")
                //count++;
                console.log(vakkenNewZelfde)
                console.log(amountMatches)

                // aantal matches toevoegen met 1 als het erin voorkomt
                setAmountMatches(amountMatches+1)
                // dezelfde vakken bundelen in array state vakkenNewZelfde, dit per user
                setVakkenNewZelfde(vakkenNewZelfde => vakkenNewZelfde.concat(property))
                //vakkenNewZelfde.push(property)

                console.log(amountMatches, vakkenNewZelfde)

                // object maken met de info van dezelfde vakken
                const vakkenElement = {}
                vakkenElement.subjectid = property // de id van het vak
                db
                .collection("subject")
                .doc(property) // de doc bekijken van het subject om extra info op te halen
                .get()
                .then((querySnapshot) => { 
                    //console.log("zelfde vak", querySnapshot.data().subject)
                    console.log("vak met info", querySnapshot.data())
                    vakkenElement.subject = querySnapshot.data().subject
                    vakkenElement.field = querySnapshot.data().field
                    vakkenElement.info_en = querySnapshot.data().info_en
                    vakkenElement.info_nl = querySnapshot.data().info_nl
                    console.log(vakkenElement)
                    setVakkenZelfde(vakkenZelfde => vakkenZelfde.concat(vakkenElement))

                })
                // het vak toevoegen aan 'vakkenzelfde' element

                    //vakkenZelfde.push(vakkenElement)
                    //setVakkenZelfde(vakkenZelfde.concat(vakkenElement))
                    // save all data of each user
                    /*db.collection("users").where("uid", "==", docDataUid).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            // console.log(doc.id, " => ", doc.data());
                            var element = {}
                            element.id = doc.id
                    })})*/



                
            }
        }
        //const infoUserMatch = {}
        //setInfoUserMatch()
        //infoUserMatch.aantal = amountMatches
        //infoUserMatch.vakkenZelfde = vakkenZelfde
        //element.aantal = count

        //setVakkenZelfde([])

        
    }

    const part4 = async () => {
        console.log(amountMatches)
        console.log(vakkenZelfde)
        if (amountMatches > 0){
            //aantalUsers++;
            setAmountUsers(amountUsers+1)
            // console.log("potentiële tutor met naam:" + doc.data().firstname )
            const data = []
            // save all data of each user
            console.log(docDataUid)
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
                    element.distanceInKm = Math.round(element.distance *100) /100 
                    //console.log(element)
                    data.push(element)
                });
            })
            .catch((error) => {
                // console.log("Error getting ddocumednts: ", error);
                console.log("errorrr, not working")
            });
            console.log(data)
            setMatches(matches => matches.concat(data))
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
                {matches.length > 0 ?
                    console.log(matches)
                :
                    console.log("no matches")
                }
                  <CardContent key="1">
                    <Grid container spacing={3}>
                    <Grid item >

                    <Avatar
                        alt="Olivier"
                        //src={item.avatar}
                        sx={{ 
                            width: 150, 
                            height: 150,
                        }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" component="div">
                            Olvier Huyse
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            2 match(es)
                        </Typography>


                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <p><EuroIcon/>18 {t('Match.3')}</p>
                                <p><LocationOnIcon/> 17 {t('Match.2')}</p>
                                <p><Rating name="read-only" value={3} readOnly /></p>
                            </Grid>

                            <Grid item xs={4}>
                            <p>"LxcRRiHQhht0Aj5YRdvQ"</p>
                            <p>"8WZvrVMNbqC1EvNPBTsy"</p>
                            </Grid>
                        </Grid>
      
                            <br />
                        <Button onClick={() => goToAgenda("3mBoKVVbTAXyS4zgvm7pqQwsW9x1", "Olivier Huyse", ["LxcRRiHQhht0Aj5YRdvQ", "8WZvrVMNbqC1EvNPBTsy"], true /*isTutor*/, false /*istutee*/)}>Boek een afspraak</Button>
                    </Grid>
                </Grid>

                </CardContent>
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
                                <Button onClick={() => goToAgenda(item.uid, item.person, item.vakkenZelfde, item.isTutor, item.isTutee)}>Boek een afspraak</Button>
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

