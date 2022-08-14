import { getListSubheaderUtilityClass } from "@mui/material"
import { getMatchingUsers } from "../config/firebase"
import {computeDistanceBetween, LatLng} from 'spherical-geometry-js'
//import computeDistanceBetween from google.maps.geometry.spherical

const getTutors =  (userid) => {
    //console.log("The tutors")
    //const userid = "chjPApWrFziPLM7QWu0p"
    //console.log("hey")
    return getMatchingUsers(userid)
    //const data = []
}
/*
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
};*/
/*
const loadScript = () => {
  loadScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
    document.querySelector('head'),
    'google-maps',
  );

}*/

// output the distance between two geopoints (latitude and longitude)
const checkDistance = (lat_from, lng_from, lat_to, lng_to) => {
  var distance_from = new LatLng(lat_from, lng_from);
  var distance_to = new LatLng(lat_to, lng_to);

  const distanceInMeters = computeDistanceBetween(distance_from, distance_to);
  return distanceInMeters
}


export {
    getTutors,
    checkDistance
};