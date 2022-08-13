import './scheduler.scss';
import React, { useEffect, useState } from "react";
import { ButtonComponent, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent, MultiSelectComponent, CheckBoxSelection } from '@syncfusion/ej2-react-dropdowns';
import { UploaderComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ToolbarComponent, ItemsDirective, ItemDirective, ContextMenuComponent } from '@syncfusion/ej2-react-navigations';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Year, TimelineViews, TimelineMonth, TimelineYear, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject, Resize, DragAndDrop, Agenda, Print, ExcelExport, ICalendarImport, ICalendarExport, Timezone, EventSettingsModel, actionBegin } from '@syncfusion/ej2-react-schedule';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { addClass, Browser, closest, extend, Internationalization, isNullOrUndefined, removeClass, remove, compile } from '@syncfusion/ej2-base';
import { DataManager, WebApiAdaptor, Predicate, Query } from '@syncfusion/ej2-data';
import { registerLicense } from '@syncfusion/ej2-base';
import { useAuthState } from "react-firebase-hooks/auth";
import * as dataSource from './datasource.json';
import {
    auth,
    db
} from "../../../services/config/firebase";
//import { tz } from 'moment-timezone';
import moment from "moment";
import "moment-timezone";
import { SampleBase } from './sample-base';


export default function Scheduler(props) {
  registerLicense(process.env.REACT_APP_SYNCFUSION_LICENSE_KEY);
  const [user, loading, error] = useAuthState(auth);
  const [remoteData, setRemoteData] = useState(null)
  const [jsonData, setJsonData] = useState(null)
  const userid = props.userid
  const name = props.name
  const subjectid = props.subjectid
  /*const localData = new EventSettingsModel({
    dataSource: [{
      EndTime: new Date(2022, 0, 8, 6, 30),
      StartTime: new Date(2022, 0, 8, 4, 20)
    }]
  })*/

  useEffect(() => {
    getAlreadyScheduled(userid)
  }, [user, loading]);

  // nu de methods doen:
  const onActionBegin = (args) => {

    // hoe geraak ik aan deze args?
    console.log(args)
    if (args.requestType === 'toolBarItemRendered') {
      // This block is execute after toolbarItem render
    }
    if (args.requestType === 'dateNavigate') {
        // This block is executed after previous and next navigation
    }
    if (args.requestType === 'viewNavigate') {
        // This block is execute after view navigation
    }
    if (args.requestType === 'eventCreated') {
        // This block is execute after an appointment create
    }
    if (args.requestType === 'eventChanged') {
        // This block is execute after an appointment change
    }
    if(args.requestType === 'eventRemoved') {
        // This block is execute after an appointment remove
    }
  }



      

  const getAlreadyScheduled = (userid) => {
    let data = []
    console.log(userid)

    ////// eerst de planning van de user van wie je de agenda bekijkt

    // als persoon van wie je de agenda bekijkt, bijles geeft
    db.collection("scheduled").where("tutor", "==", userid)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let element = {}              

            // als ingelogde user diegene is die bijles krijgt ervan, toon het gewoon
            if (doc.data().tutee === user.uid){
              element.Subject = doc.data().Subject
              element.id = doc.id
              element.tutor_id = doc.data().tutor
              element.location = doc.data().location
              element.tutee_id = doc.data().tutee
              element.tutor_name = doc.data().tutor_name
              element.tutee_name = doc.data().tutee_name
              element.CategoryColor = "#ffaa00"
            } // als het niet de ingelogde user is die bijles krijgt, maar iemand random, toon als niet available
            else {
              element.isBlock = true // geblokt
              element.Subject = "Not available"
              element.id = doc.id
              element.CategoryColor = "#ffaa00"
            }

            element.StartTime = new Date(parseInt(doc.data().StartTime.seconds.toString() + "000"))
            if (doc.data().EndTime){
              element.EndTime = new Date(parseInt(doc.data().EndTime.seconds.toString() + "000"))
              element.allDay = false
            } else {
              element.allDay = true
            }
            
            // donkerpaars als je bijles geeft en al confirmed hebt
            // lichtpaars als je bijles geeft en nog niet confirmed hebt
            data.push(element)
          });
      })
      .catch((error) => {
          console.log("Error getting document: ", error);

      });
    
    // als persoon van wie je de agenda bekijkt, bijles krijgt
    db.collection("scheduled").where("tutee", "==", userid)
    .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let element = {}

            // als ingelogde user diegene is die bijles geeft, toon het gewoon
            if (doc.data().tutor === user.uid){
              element.Subject = doc.data().Subject
              element.id = doc.id
              element.tutor_id = doc.data().tutor
              element.location = doc.data().location
              element.tutee_id = doc.data().tutee
              element.tutor_name = doc.data().tutor_name
              element.tutee_name = doc.data().tutee_name
              element.CategoryColor = "#ffaa00"
            } 
            else { // als het niet de ingelogde user is die bijles geeft, maar iemand random, toon als niet available
              element.isBlock = true // geblokt
              element.Subject = "Not available"
              element.id = doc.id
              element.CategoryColor = "#ffaa00"
            }

            element.StartTime = new Date(parseInt(doc.data().StartTime.seconds.toString() + "000"))
            if (doc.data().EndTime){
              element.EndTime = new Date(parseInt(doc.data().EndTime.seconds.toString() + "000"))
              element.allDay = false
            } else {
              element.allDay = true
            }
            

            // donkerpaars als je bijles geeft en al confirmed hebt
            // lichtpaars als je bijles geeft en nog niet confirmed hebt
            data.push(element)
          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });


    ////// dan de planning van de ingelogde user

    // als ingelogde persoon, bijles geeft
    db.collection("scheduled").where("tutor", "==", user.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let element = {}

          // als ingelogde user bijles geeft aan persoon in agenda, niet toevoegen want is hierboven al eens toegevoegd
            // dus als ingelogde user bijles geeft aan niet de persoon in agenda, wel toevoegen
          if (doc.data().tutee !== userid){

            element.Subject = doc.data().Subject
            element.id = doc.id
            element.tutor_id = doc.data().tutor
            element.location = doc.data().location
            element.tutee_id = doc.data().tutee
            element.tutor_name = doc.data().tutor_name
            element.tutee_name = doc.data().tutee_name
            element.CategoryColor = "#ffaa00"

            element.StartTime = new Date(parseInt(doc.data().StartTime.seconds.toString() + "000"))
            if (doc.data().EndTime){
              element.EndTime = new Date(parseInt(doc.data().EndTime.seconds.toString() + "000"))
              element.allDay = false
            } else {
              element.allDay = true
            }
          
          } 
          // donkerpaars als je bijles geeft en al confirmed hebt
          // lichtpaars als je bijles geeft en nog niet confirmed hebt
          data.push(element)
        });
    })
    .catch((error) => {
        console.log("Error getting ddocumednts: ", error);

    });
  
  // toon de informatie van de ingelogde persoon zelf.
  // als ingelogde persoon, bijles krijgt
  db.collection("scheduled").where("tutee", "==", user.uid)
  .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let element = {}

          //als ingelogde persoon bijles krijgt van de persoon in agenda, niet tonen want is hierboven al toegevoegd
            // dus als ingelogde persoon bijles krijgt van andere persoon, wel tonen
          if (doc.data().tutor !== userid){
            element.Subject = doc.data().Subject
            element.id = doc.id
            element.tutor_id = doc.data().tutor
            element.location = doc.data().location
            element.tutee_id = doc.data().tutee
            element.tutor_name = doc.data().tutor_name
            element.tutee_name = doc.data().tutee_name
            element.CategoryColor = "#ffaa00"

            element.StartTime = new Date(parseInt(doc.data().StartTime.seconds.toString() + "000"))
            if (doc.data().EndTime){
              element.EndTime = new Date(parseInt(doc.data().EndTime.seconds.toString() + "000"))
              element.allDay = false
            } else {
              element.allDay = true
            }
          }

          // donkerpaars als je bijles geeft en al confirmed hebt
          // lichtpaars als je bijles geeft en nog niet confirmed hebt
          data.push(element)
        });
    })
    .catch((error) => {
        console.log("Error getting ddocumednts: ", error);
    });

    setRemoteData(data)

  }





  return( <>
    <ScheduleComponent
      actionBegin={onActionBegin}
      currentView='Month'
      dateFormat='dd-MM-yyyy'
      firstDayOfWeek={1} //monday
      showWeekNumber={true}
      allowDragAndDrop={false}
      startHour='07:00'
      allowResizing={false} // mss weer op true zetten als alles lukt
      //selectedDate={new Date(2021, 1, 15)}
      // onChange={(e) => console.log(e.target.value)}
      
      //background="#fff"
      eventSettings={{ 
        dataSource: remoteData /*, resourceColorField: '#ffaa00'*/ }}
    >
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>

    </>
  )
   
}

