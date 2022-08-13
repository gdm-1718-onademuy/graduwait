import './scheduler.scss';
import React, { useEffect, useState } from "react";
import { ButtonComponent, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent, MultiSelectComponent, CheckBoxSelection } from '@syncfusion/ej2-react-dropdowns';
import { UploaderComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ToolbarComponent, ItemsDirective, ItemDirective, ContextMenuComponent } from '@syncfusion/ej2-react-navigations';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Year, TimelineViews, TimelineMonth, TimelineYear, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject, Resize, DragAndDrop, Agenda, Print, ExcelExport, ICalendarImport, ICalendarExport, Timezone, EventSettingsModel } from '@syncfusion/ej2-react-schedule';
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


export default function Scheduler() {
  registerLicense(process.env.REACT_APP_SYNCFUSION_LICENSE_KEY);
  const [user, loading, error] = useAuthState(auth);
  const [remoteData, setRemoteData] = useState(null)
  const [jsonData, setJsonData] = useState(null)
  /*const localData = new EventSettingsModel({
    dataSource: [{
      EndTime: new Date(2022, 0, 8, 6, 30),
      StartTime: new Date(2022, 0, 8, 4, 20)
    }]
  })*/

  const dataFirestore = () => {
    let data = []
    // als persoon bijles geeft
    db.collection("scheduled").where("tutor", "==", user.uid)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let element = {}
            element.Subject = doc.data().Subject
            element.id = doc.id
            element.tutor_id = doc.data().tutor
            element.location = doc.data().location
            element.tutee_id = doc.data().tutee
            element.tutor_name = doc.data().tutor_name
            element.tutee_name = doc.data().tutee_name
            element.color = "#ffaa00"
            /*if (doc.data().CategoryColor == "Confirmed") {
              element.resourceColorField = "#ffaa00"
            } else {
              element.resourceColorField = "#56ca85"
            }*/
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
          console.log("Error getting ddocumednts: ", error);
      });
    
    // als persoon bijles krijgt
    db.collection("scheduled").where("tutee", "==", user.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
            console.log(doc.data().Subject)
            let element = {}
            element.Subject = doc.data().Subject
            element.id = doc.id
            element.tutor_id = doc.data().tutor
            element.location = doc.data().location
            element.tutee_id = doc.data().tutee
            element.tutor_name = doc.data().tutor_name
            element.tutee_name = doc.data().tutee_name
            element.color = "#ffaa00"

            /*if (doc.data().CategoryColor == "Confirmed") {
              element.resourceColorField = "#ffaa00"
            } else {
              element.resourceColorField = "#56ca85"
            }*/
            element.StartTime = new Date(parseInt(doc.data().StartTime.seconds.toString() + "000"))

            if (doc.data().EndTime){
              element.EndTime = new Date(parseInt(doc.data().EndTime.seconds.toString() + "000"))
              element.allDay = false
            } else {
              element.allDay = true
            }
            // donkerblauw als je bijles geeft en al confirmed hebt
            console.log(element)
            data.push(element)

            // lichtblauw als je bijles geeft en (nog) niet confirmed hebt
        });
    })
    .catch((error) => {
        console.log("Error getting ddocumednts: ", error);
    });
    setRemoteData(data)

  }



  useEffect(() => {
    dataFirestore()
  }, [user, loading]);

  return( <>
    <ScheduleComponent
      currentView='Month'
     /* eventSettings={ remoteData
        /*dataSource = [{
        EndTime: new Date(2022, 8,30),
        StartTime: new Date(2022, 8, 20)
      }]}*/
      //selectedDate={new Date(2021, 1, 15)}
      
      //background="#fff"
      eventSettings={{ dataSource: remoteData /*, resourceColorField: '#ffaa00'*/ }}
      //eventSettings={{ dataSource: remoteData }} 
    >
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>

    </>
  )
   
}

