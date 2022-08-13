import { getListSubheaderUtilityClass } from "@mui/material"
import { getMatchingUsers } from "../config/firebase"
//import computeDistanceBetween from google.maps.geometry.spherical

const getTutors =  (userid) => {
    //console.log("The tutors")
    //const userid = "chjPApWrFziPLM7QWu0p"
    //console.log("hey")
    return getMatchingUsers(userid)
    //const data = []
}

const loadMapApi = () => {
    const mapsURL = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDgGvE6KuXANNc2uj4M1oJVDvtYp5sBEdI&libraries=geometry,places&language=no&region=NO&v=quarterly`;
    const scripts = document.getElementsByTagName('script');
    // Go through existing script tags, and return google maps api tag when found.
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf(mapsURL) === 0) {
            return scripts[i];
        }
    }

    const googleMapScript = document.createElement('script');
    googleMapScript.src = mapsURL;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);

    return googleMapScript;
};

const loadScript = (src, position, id) => {
    if (!position) {
      return;
    }
  
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
  }
const loadTheScript = () => {
  loadScript(
    `https://maps.googleapis.com/maps/api/js?key=AIzaSyDgGvE6KuXANNc2uj4M1oJVDvtYp5sBEdI&libraries=places`,
    document.querySelector('head'),
    'google-maps',
  );
}

// output the distance between two geopoints (latitude and longitude)
const checkDistance = (lat_from, lng_from, lat_to, lng_to) => {
    //let google = loadMapApi()
    //var _kCord = new window.google.maps.LatLng(50.293483, 3.43232);
    //var _pCord = new window.google.maps.LatLng(50.2323, 3.432);
    //console.log(_kCord, _pCord)
    //var _pCord = new google.maps.LatLng(lat_to, lng_to);
    //const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(_kCord, _pCord);
    //console.log(distanceInMeters)

    //console.log(_kCord)
    let distance = lat_from + lng_from
    distance = Math.round(distance *100) /100
    return distance
}


export {
    getTutors,
    checkDistance,
    loadMapApi, 
    loadTheScript,
    loadScript
};