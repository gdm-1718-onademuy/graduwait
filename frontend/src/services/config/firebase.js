import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "bachelorproef-bijles.firebaseapp.com",
    projectId: "bachelorproef-bijles",
    storageBucket: "bachelorproef-bijles.appspot.com",
    messagingSenderId: "951655112072",
    appId: "1:951655112072:web:1e29276393540a1c07ae3d"
  };

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const storage = app.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();

// AUTH SECTION
// register with email and password
const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
  }  
   catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// login with google
const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// login with email and password
const signInWithEmailAndPassword = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      return err.message
    }
}

// logout 
const logout = () => {
  auth.signOut();
}

// send email with link to reset password
const passwordResetLinkEmail = async (email) => {
  let response
  await auth.sendPasswordResetEmail(email)
  .then(function() {
    console.log("password reset email sent")
    response = true
  })
  .catch (function(error){
    console.log("nie gelukt man")
    response = error
  })
  return response
}


// USER DATA
// add data of register form
const addDataUser = async (email, userid, firstName, lastName, bijlesKrijgen, bijlesGeven, richting, geolocation, kost, birthday, avatar) => {
  try {
    let lat = 0
    let lng = 0
    await fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+geolocation.description+'&key='+process.env.REACT_APP_GOOGLE_API_KEY)
    .then(response => {
      return response.json()
    })
    .then(data => {
      //handle data
      lat = data.results[0].geometry.location.lat
      lng = data.results[0].geometry.location.lng
      //return lat, lng
    })
    .catch(error => {
      //handle error
    });

    let coordinates = new firebase.firestore.GeoPoint(lat, lng)
    //console.log(coordinates)
    //console.log(email, userid, firstName, lastName, bijlesKrijgen, bijlesGeven, richting, lat, lng, kost, birthday, avatar)

    let object = {
      authProvider: "local",
      email: email, 
      firstname: firstName, 
      lastname: lastName, 
      richting: richting,
      woonplaats: geolocation.description,
      latlng: coordinates,
      birthday: birthday
    }

    object.uid = userid

    if (bijlesKrijgen){
      object.getTutoring = []
    }
    if (bijlesGeven){
      object.giveTutoring = []
    }
    if (avatar){
      object.avatar = avatar
    } 
    if (kost){
      object.kost = kost
    } 
    await db.collection("users").add(object);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

const showProfileData = async () => {
  //let items = []

  try { 
    await db
    .collection("users")
    .where("uid", "==", "fOQq6zveL3g2oHO24GdSAEi8gWG3")
    .get()
    .then((querySnapshot) => { 
      querySnapshot.forEach(function(doc) {
        return doc.data().firstname
    })
  })
  //return doc.data()

  } catch (err) {
    console.error(err);
    alert("An error occured while fetching user data");
  }

}


// AGENDA FUNCTIONALITIES
// add an appointment
const addAfspraak = async (tutorid, studentid, date, starthour, endhour, vakkenIds, opmerking) => {
    const today = new Date(); 

    let afspraak_id 

    const object = {
      daterequest: today,
      isconfirmed: false,
      tutorid: tutorid,
      studentid: studentid,
      date: date,
      starthour: starthour,
      endhour: endhour,
      subjectid: vakkenIds,
    }
    if(opmerking){
      object.opmerking= opmerking
    }
    //console.log(object)
    await db.collection("tutoring").add(object)
    .then(function(docRef) {
      //console.log("Document written with ID: ", docRef.id);
      afspraak_id = docRef.id
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        afspraak_id = error

    })
    return afspraak_id
};

// edit appointments (delete or confirm)
const editApp = async (todo, eventid) => {
  if(todo === "delete"){
    await db.collection("tutoring")
    .doc(eventid)
    .delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });

  } else if (todo === "confirm"){
    await db.collection("tutoring")
    .doc(eventid)
    .update({
      isconfirmed: true
    })
    .then(() => {
      console.log("Document successfully set confirmed on true!");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    })
  }

}


// SCHOOL FUNCTIONALITIES
// get the fields of study
const getFieldsOfStudy = async() => {
  const data = []
  
  await db.collection("course").get().then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
    querySnapshot.forEach(function(doc) {
      // * UPDATE DATA ARRAY 
      data.push(doc.data())

    })
  })

  return data
}

const getUserData = async(userid) => {
  let data 

  await db
  .collection("users")
  .where("uid", "==", userid)
  .get()
  .then((querySnapshot) => { 
    querySnapshot.forEach(function(doc) {
      data = doc.data()
    })
  })

  return data
};

const getReviews = async(userid) => {
  let data = []

  await db
  .collection("review")
  .where("to", "==", userid)
  .get()
  .then((querySnapshot) => { 
    querySnapshot.forEach(function(doc) {
      data.push(doc.data())
      //getMoreInfoUser(doc.data().from)
    })
  })

  return data
};

/*const getMoreInfoUser = async (userid) => {
  const object = {}
  object.id = doc.id
  //object.from = doc.data().from
  db
  .collection("users")
  .doc(doc.data().from)
  .get()
  .then((snapshot) => {
    //const person_from = {}
    object.from_firstname = snapshot.data().firstname
    object.from_lastname = snapshot.data().lastname
    object.from_id = snapshot.id
    //person_from.picture = doc.data().picture                
    //arrayPerson.push({person_from: person_from})
  }).catch((e) => console.log(e))
  // object.from.person_from.firstname
  object.to = doc.data().to
  //console.log(doc.data().date.toDate().toISOString().split('T')[0])
  object.datetime = doc.data().date.toDate().toISOString().split('T')[0]
  object.sterren = doc.data().sterren
  object.omschrijving = doc.data().omschrijving
  
  array.push({object: object})
}*/


/*const getCourses = () => {
  let courses = []
  db.collection("course")
    .get()
    .then((querySnapshot) => {  
      querySnapshot.forEach(function(doc) {
          courses.push(doc.data());
      });
      console.log(courses[0])
      var result = courses.map(course => ({ value: course.course_name }));
      console.log(result)

      //this.setState({ items: items });   //set data in state here
    })
  return courses
}*/

const getMatchingUsers = (userid) => {
  // make a variable with all users where 
  //  giveTutoring - array with minimum 1 value
  let usersGiveTutoring = []
  
  db
  .collection("users")
  .get()
  .then((querySnapshot) => { 
    querySnapshot.forEach(function(doc) {
        //if(user){
          if(doc.data().uid === userid){
            console.log("zelfde user, niks doen")
          } else {
            //console.log("andere user", doc.data().firstname)
            //console.log("met id", userid)
            usersGiveTutoring.push(doc.data())
          }
    })})
  return usersGiveTutoring
  //return courses
}


const getDataF = async () => {

  // * DATA ARRAY 
  const data = []
  
  await db.collection("course").get().then((querySnapshot) => { 
    querySnapshot.forEach(function(doc) {
      
      // * UPDATE DATA ARRAY 
      data.push(doc.data())

    })
  })

  return data
}

// export alle functies
export {
    auth,
    db,
    storage,
    firebase,
    signInWithGoogle,
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    showProfileData,
    //getCourses,
    addAfspraak,
    editApp,
    addDataUser,
    getMatchingUsers,
    getDataF,
    passwordResetLinkEmail,
    getFieldsOfStudy,
    getUserData,
    getReviews
  };