import './scheduler.scss';
import * as React from 'react';
import { ButtonComponent, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent, MultiSelectComponent, CheckBoxSelection } from '@syncfusion/ej2-react-dropdowns';
import { UploaderComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ToolbarComponent, ItemsDirective, ItemDirective, ContextMenuComponent } from '@syncfusion/ej2-react-navigations';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Year, TimelineViews, TimelineMonth, TimelineYear, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject, Resize, DragAndDrop, Agenda, Print, ExcelExport, ICalendarImport, ICalendarExport, Timezone } from '@syncfusion/ej2-react-schedule';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { addClass, Browser, closest, extend, Internationalization, isNullOrUndefined, removeClass, remove, compile } from '@syncfusion/ej2-base';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
//import { tz } from 'moment-timezone';
import moment from "moment";
import "moment-timezone";
import { SampleBase } from './sample-base';

export default class Scheduler extends SampleBase {
    scheduleObj;
    eventTypeObj;
    titleObj;
    notesObj;
    contextMenuObj;
    isTimelineView = false;
    selectedTarget;
    intl = new Internationalization();
    workWeekObj;
    resourceObj;
    weekDays = [
        { text: 'Sunday', value: 0 },
        { text: 'Monday', value: 1 },
        { text: 'Tuesday', value: 2 },
        { text: 'Wednesday', value: 3 },
        { text: 'Thursday', value: 4 },
        { text: 'Friday', value: 5 },
        { text: 'Saturday', value: 6 }
    ];
    exportItems = [
        { text: 'iCalendar', iconCss: 'e-icons e-export' },
        { text: 'Excel', iconCss: 'e-icons e-export-excel' }
    ];
    contextMenuItems = [
        { text: 'New Event', iconCss: 'e-icons e-plus', id: 'Add' },
        { text: 'New Recurring Event', iconCss: 'e-icons e-repeat', id: 'AddRecurrence' },
        { text: 'Today', iconCss: 'e-icons e-timeline-today', id: 'Today' },
        { text: 'Edit Event', iconCss: 'e-icons e-edit', id: 'Save' },
        { text: 'Delete Event', iconCss: 'e-icons e-trash', id: 'Delete' },
        {
            text: 'Delete Event', id: 'DeleteRecurrenceEvent', iconCss: 'e-icons e-trash',
            items: [
                { text: 'Delete Occurrence', id: 'DeleteOccurrence' },
                { text: 'Delete Series', id: 'DeleteSeries' }
            ]
        },
        {
            text: 'Edit Event', id: 'EditRecurrenceEvent', iconCss: 'e-icons e-edit',
            items: [
                { text: 'Edit Occurrence', id: 'EditOccurrence' },
                { text: 'Edit Series', id: 'EditSeries' }
            ]
        }
    ];
    calendarCollections = [
        { CalendarText: 'My Calendar', CalendarId: 1, CalendarColor: '#c43081' },
        { CalendarText: 'Company', CalendarId: 2, CalendarColor: '#ff7f50' },
        { CalendarText: 'Birthday', CalendarId: 3, CalendarColor: '#AF27CD' },
        { CalendarText: 'Holiday', CalendarId: 4, CalendarColor: '#808000' }
    ];
    timezoneData = [
        { text: 'UTC -12:00', value: 'Etc/GMT+12' },
        { text: 'UTC -11:00', value: 'Etc/GMT+11' },
        { text: 'UTC -10:00', value: 'Etc/GMT+10' },
        { text: 'UTC -09:00', value: 'Etc/GMT+9' },
        { text: 'UTC -08:00', value: 'Etc/GMT+8' },
        { text: 'UTC -07:00', value: 'Etc/GMT+7' },
        { text: 'UTC -06:00', value: 'Etc/GMT+6' },
        { text: 'UTC -05:00', value: 'Etc/GMT+5' },
        { text: 'UTC -04:00', value: 'Etc/GMT+4' },
        { text: 'UTC -03:00', value: 'Etc/GMT+3' },
        { text: 'UTC -02:00', value: 'Etc/GMT+2' },
        { text: 'UTC -01:00', value: 'Etc/GMT+1' },
        { text: 'UTC +00:00', value: 'Etc/GMT' },
        { text: 'UTC +01:00', value: 'Etc/GMT-1' },
        { text: 'UTC +02:00', value: 'Etc/GMT-2' },
        { text: 'UTC +03:00', value: 'Etc/GMT-3' },
        { text: 'UTC +04:00', value: 'Etc/GMT-4' },
        { text: 'UTC +05:00', value: 'Etc/GMT-5' },
        { text: 'UTC +05:30', value: 'Asia/Calcutta' },
        { text: 'UTC +06:00', value: 'Etc/GMT-6' },
        { text: 'UTC +07:00', value: 'Etc/GMT-7' },
        { text: 'UTC +08:00', value: 'Etc/GMT-8' },
        { text: 'UTC +09:00', value: 'Etc/GMT-9' },
        { text: 'UTC +10:00', value: 'Etc/GMT-10' },
        { text: 'UTC +11:00', value: 'Etc/GMT-11' },
        { text: 'UTC +12:00', value: 'Etc/GMT-12' },
        { text: 'UTC +13:00', value: 'Etc/GMT-13' },
        { text: 'UTC +14:00', value: 'Etc/GMT-14' }
    ];
    majorSlotData = [
        { Name: '1 hour', Value: 60 },
        { Name: '1.5 hours', Value: 90 },
        { Name: '2 hours', Value: 120 },
        { Name: '2.5 hours', Value: 150 },
        { Name: '3 hours', Value: 180 },
        { Name: '3.5 hours', Value: 210 },
        { Name: '4 hours', Value: 240 },
        { Name: '4.5 hours', Value: 270 },
        { Name: '5 hours', Value: 300 },
        { Name: '5.5 hours', Value: 330 },
        { Name: '6 hours', Value: 360 },
        { Name: '6.5 hours', Value: 390 },
        { Name: '7 hours', Value: 420 },
        { Name: '7.5 hours', Value: 450 },
        { Name: '8 hours', Value: 480 },
        { Name: '8.5 hours', Value: 510 },
        { Name: '9 hours', Value: 540 },
        { Name: '9.5 hours', Value: 570 },
        { Name: '10 hours', Value: 600 },
        { Name: '10.5 hours', Value: 630 },
        { Name: '11 hours', Value: 660 },
        { Name: '11.5 hours', Value: 690 },
        { Name: '12 hours', Value: 720 }
    ];
    minorSlotData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    timeFormatData = [
        { Name: "12 hours", Value: "hh:mm a" },
        { Name: "24 hours", Value: "HH:mm" }
    ];
    weekNumberData = [
        { Name: 'Off', Value: 'Off' },
        { Name: 'First Day of Year', Value: 'FirstDay' },
        { Name: 'First Full Week', Value: 'FirstFullWeek' },
        { Name: 'First Four-Day Week', Value: 'FirstFourDayWeek' }
    ];
    importTemplateFn(data) {
        const template = '<div class="e-template-btn"><span class="e-btn-icon e-icons e-upload-1 e-icon-left"></span>${text}</div>';
        return compile(template.trim())(data);
    }
    updateLiveTime() {
        let scheduleTimezone = this.scheduleObj ? this.scheduleObj.timezone : 'Etc/GMT';
        let timeBtn = document.querySelector('.schedule-overview #timeBtn');
        if (timeBtn) {
            timeBtn.innerHTML = '<span class="e-btn-icon e-icons e-clock e-icon-left"></span>' +
                new Date().toLocaleTimeString('en-US', { timeZone: scheduleTimezone });
        }
    }
    ;
    onImportClick(args) {
        this.scheduleObj.importICalendar(args.event.target.files[0]);
    }
    onPrint() {
        this.scheduleObj.print();
    }
    onExportClick(args) {
        if (args.item.text === 'Excel') {
            let exportDatas = [];
            let eventCollection = this.scheduleObj.getEvents();
            let resourceCollection = this.scheduleObj.getResourceCollections();
            let resourceData = resourceCollection[0].dataSource;
            for (let resource of resourceData) {
                let data = eventCollection.filter((e) => e.CalendarId === resource.CalendarId);
                exportDatas = exportDatas.concat(data);
            }
            this.scheduleObj.exportToExcel({ exportType: 'xlsx', customData: exportDatas, fields: ['Id', 'Subject', 'StartTime', 'EndTime', 'CalendarId'] });
        }
        else {
            this.scheduleObj.exportToICalendar();
        }
    }
    getEventData() {
        const date = this.scheduleObj.selectedDate;
        return {
            Id: this.scheduleObj.getEventMaxID(),
            Subject: '',
            StartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), 0, 0),
            EndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours() + 1, 0, 0),
            Location: '',
            Description: '',
            IsAllDay: false,
            CalendarId: 1
        };
    }
    onToolbarItemClicked(args) {
        switch (args.item.text) {
            case 'Day':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineDay' : 'Day';
                break;
            case 'Week':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWeek' : 'Week';
                break;
            case 'WorkWeek':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWorkWeek' : 'WorkWeek';
                break;
            case 'Month':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineMonth' : 'Month';
                break;
            case 'Year':
                this.scheduleObj.currentView = this.isTimelineView ? 'TimelineYear' : 'Year';
                break;
            case 'Agenda':
                this.scheduleObj.currentView = 'Agenda';
                break;
            case 'New Event':
                const eventData = this.getEventData();
                this.scheduleObj.openEditor(eventData, 'Add', true);
                break;
            case 'New Recurring Event':
                const recEventData = this.getEventData();
                this.scheduleObj.openEditor(recEventData, 'Add', true, 1);
                break;
        }
    }
    timelineTemplate() {
        return (<div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='timeline_views' checked={false} created={() => { document.getElementById('timeline_views').setAttribute('tabindex', '-1'); }} change={(args) => {
                this.isTimelineView = args.checked;
                switch (this.scheduleObj.currentView) {
                    case 'Day':
                    case 'TimelineDay':
                        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineDay' : 'Day';
                        break;
                    case 'Week':
                    case 'TimelineWeek':
                        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWeek' : 'Week';
                        break;
                    case 'WorkWeek':
                    case 'TimelineWorkWeek':
                        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineWorkWeek' : 'WorkWeek';
                        break;
                    case 'Month':
                    case 'TimelineMonth':
                        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineMonth' : 'Month';
                        break;
                    case 'Year':
                    case 'TimelineYear':
                        this.scheduleObj.currentView = this.isTimelineView ? 'TimelineYear' : 'Year';
                        break;
                    case 'Agenda':
                        this.scheduleObj.currentView = 'Agenda';
                        break;
                }
            }}/>
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Timeline Views</div>
      </div>);
    }
    multiDragTemplate() {
        return (<div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='multi_drag' checked={false} created={() => { document.getElementById('multi_drag').setAttribute('tabindex', '-1'); }} change={(args) => { this.scheduleObj.allowMultiDrag = args.checked; }}/>
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Allow Multi Drag</div>
      </div>);
    }
    groupTemplate() {
        return (<div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='grouping' checked={true} created={() => { document.getElementById('grouping').setAttribute('tabindex', '-1'); }} change={(args) => { this.scheduleObj.group.resources = args.checked ? ['Calendars'] : []; }}/>
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Grouping</div>
      </div>);
    }
    gridlineTemplate() {
        return (<div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='gridlines' checked={true} created={() => { document.getElementById('gridlines').setAttribute('tabindex', '-1'); }} change={(args) => { this.scheduleObj.timeScale.enable = args.checked; }}/>
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Gridlines</div>
      </div>);
    }
    autoHeightTemplate() {
        return (<div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='row_auto_height' checked={false} created={() => { document.getElementById('row_auto_height').setAttribute('tabindex', '-1'); }} change={(args) => { this.scheduleObj.rowAutoHeight = args.checked; }}/>
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Row Auto Height</div>
      </div>);
    }
    tooltipTemplate() {
        return (<div style={{ height: '46px', lineHeight: '23px' }}>
        <div className='icon-child' style={{ textAlign: 'center' }}>
          <SwitchComponent id='tooltip' checked={false} created={() => { document.getElementById('tooltip').setAttribute('tabindex', '-1'); }} change={(args) => { this.scheduleObj.eventSettings.enableTooltip = args.checked; }}/>
        </div>
        <div className='text-child' style={{ fontSize: '14px' }}>Tooltip</div>
      </div>);
    }
    getResourceData(data) {
        let resources = this.scheduleObj.getResourceCollections().slice(-1)[0];
        let resourceData = resources.dataSource.filter((resource) => resource.CalendarId === data.CalendarId)[0];
        return resourceData;
    }
    getHeaderStyles(data) {
        if (data.elementType === 'event') {
            let resourceData = this.getResourceData(data);
            let calendarColor = '#3f51b5';
            if (resourceData) {
                calendarColor = (resourceData.CalendarColor).toString();
            }
            return { background: calendarColor, color: '#FFFFFF' };
        }
        else {
            return { alignItems: 'center', color: '#919191' };
        }
    }
    getHeaderTitle(data) {
        return (data.elementType === 'cell') ? 'Add Appointment' : 'Appointment Details';
    }
    getHeaderDetails(data) {
        return this.intl.formatDate(data.StartTime, { type: 'date', skeleton: 'full' }) + ' (' +
            this.intl.formatDate(data.StartTime, { skeleton: 'hm' }) + ' - ' +
            this.intl.formatDate(data.EndTime, { skeleton: 'hm' }) + ')';
    }
    getEventType(data) {
        const resourceData = this.getResourceData(data);
        let calendarText = '';
        if (resourceData) {
            calendarText = resourceData.CalendarText.toString();
        }
        return calendarText;
    }
    buttonClickActions(e) {
        const quickPopup = closest(e.target, '.e-quick-popup-wrapper');
        const getSlotData = () => {
            let cellDetails = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements());
            if (isNullOrUndefined(cellDetails)) {
                cellDetails = this.scheduleObj.getCellDetails(this.scheduleObj.activeCellsData.element);
            }
            const addObj = {};
            addObj.Id = this.scheduleObj.getEventMaxID();
            addObj.Subject = isNullOrUndefined(this.titleObj.value) ? 'Add title' : this.titleObj.value;
            addObj.StartTime = new Date(+cellDetails.startTime);
            addObj.EndTime = new Date(+cellDetails.endTime);
            addObj.IsAllDay = cellDetails.isAllDay;
            addObj.Description = isNullOrUndefined(this.notesObj.value) ? 'Add notes' : this.notesObj.value;
            addObj.CalendarId = this.eventTypeObj.value;
            return addObj;
        };
        if (e.target.id === 'add') {
            const addObj = getSlotData();
            this.scheduleObj.addEvent(addObj);
        }
        else if (e.target.id === 'delete') {
            const eventDetails = this.scheduleObj.activeEventData.event;
            let currentAction = 'Delete';
            if (eventDetails.RecurrenceRule) {
                currentAction = 'DeleteOccurrence';
            }
            this.scheduleObj.deleteEvent(eventDetails, currentAction);
        }
        else {
            const isCellPopup = quickPopup.firstElementChild.classList.contains('e-cell-popup');
            const eventDetails = isCellPopup ? getSlotData() :
                this.scheduleObj.activeEventData.event;
            let currentAction = isCellPopup ? 'Add' : 'Save';
            if (eventDetails.RecurrenceRule) {
                currentAction = 'EditOccurrence';
            }
            this.scheduleObj.openEditor(eventDetails, currentAction, true);
        }
        this.scheduleObj.closeQuickInfoPopup();
    }
    onPopupOpen(args) {
        if (args.type === "QuickInfo" && !args.target.classList.contains('e-appointment')) {
            this.eventTypeObj.index = args.data.CalendarId - 1;
        }
    }
    headerTemplate(props) {
        return (<div className="quick-info-header">
        <div className="quick-info-header-content" style={this.getHeaderStyles(props)}>
          <div className="quick-info-title">{this.getHeaderTitle(props)}</div>
          <div className="duration-text">{this.getHeaderDetails(props)}</div>
        </div>
      </div>);
    }
    contentTemplate(props) {
        return (<div className="quick-info-content">
        {props.elementType === 'cell' ?
                <div className="e-cell-content">
            <div className="content-area">
              <TextBoxComponent id="title" ref={(textbox) => this.titleObj = textbox} placeholder="Title"/>
            </div>
            <div className="content-area">
              <DropDownListComponent id="eventType" ref={(ddl) => this.eventTypeObj = ddl} dataSource={this.calendarCollections} fields={{ text: "CalendarText", value: "CalendarId" }} placeholder="Choose Type" index={0} popupHeight="200px"/>
            </div>
            <div className="content-area">
              <TextBoxComponent id="notes" ref={(textbox) => this.notesObj = textbox} placeholder="Notes"/>
            </div>
          </div>
                :
                    <div className="event-content">
            <div className="meeting-type-wrap">
              <label>Subject</label>:
              <span>{props.Subject}</span>
            </div>
            <div className="meeting-subject-wrap">
              <label>Type</label>:
              <span>{this.getEventType(props)}</span>
            </div>
            <div className="notes-wrap">
              <label>Notes</label>:
              <span>{props.Description}</span>
            </div>
          </div>}
      </div>);
    }
    footerTemplate(props) {
        return (<div className="quick-info-footer">
        {props.elementType === "cell" ?
                <div className="cell-footer">
            <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" onClick={this.buttonClickActions.bind(this)}/>
            <ButtonComponent id="add" cssClass='e-flat' content="Add" isPrimary={true} onClick={this.buttonClickActions.bind(this)}/>
          </div>
                :
                    <div className="event-footer">
            <ButtonComponent id="delete" cssClass='e-flat' content="Delete" onClick={this.buttonClickActions.bind(this)}/>
            <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" isPrimary={true} onClick={this.buttonClickActions.bind(this)}/>
          </div>}
      </div>);
    }
    getDateHeaderText(value) {
        return this.intl.formatDate(value, { skeleton: 'Ed' });
    }
    getWeather(value) {
        switch (value.getDay()) {
            case 0:
                return '<img class="weather-image"  src= "https://ej2.syncfusion.com/react/demos/src/schedule/images/weather-clear.svg" /><div class="weather-text">25°C</div>';
            case 1:
                return '<img class="weather-image" src="https://ej2.syncfusion.com/react/demos/src/schedule/images/weather-clouds.svg"/><div class="weather-text">18°C</div>';
            case 2:
                return '<img class="weather-image" src="https://ej2.syncfusion.com/react/demos/src/schedule/images/weather-rain.svg"/><div class="weather-text">10°C</div>';
            case 3:
                return '<img class="weather-image" src="https://ej2.syncfusion.com/react/demos/src/schedule/images/weather-clouds.svg"/><div class="weather-text">16°C</div>';
            case 4:
                return '<img class="weather-image" src="https://ej2.syncfusion.com/react/demos/src/schedule/images/weather-rain.svg"/><div class="weather-text">8°C</div>';
            case 5:
                return '<img class="weather-image" src="https://ej2.syncfusion.com/react/demos/src/schedule/images/weather-clear.svg"/><div class="weather-text">27°C</div>';
            case 6:
                return '<img class="weather-image" src="https://ej2.syncfusion.com/react/demos/src/schedule/images/weather-clouds.svg"/><div class="weather-text">17°C</div>';
            default:
                return null;
        }
    }
    dateHeaderTemplate(props) {
        return (<div><div>{this.getDateHeaderText(props.date)}</div><div className="date-text" dangerouslySetInnerHTML={{ __html: this.getWeather(props.date) }}></div></div>);
    }
    onResourceChange(args) {
        let resourcePredicate;
        for (let value of args.value) {
            if (resourcePredicate) {
                resourcePredicate = resourcePredicate.or(new Predicate('CalendarId', 'equal', value));
            }
            else {
                resourcePredicate = new Predicate('CalendarId', 'equal', value);
            }
        }
        this.scheduleObj.resources[0].query = resourcePredicate ? new Query().where(resourcePredicate) : new Query().where('CalendarId', 'equal', 1);
    }
    render() {
        let generateEvents = () => {
            let eventData = [];
            let eventSubjects = [
                'Bering Sea Gold', 'Technology', 'Maintenance', 'Meeting', 'Travelling', 'Annual Conference', 'Birthday Celebration',
                'Farewell Celebration', 'Wedding Anniversary', 'Alaska: The Last Frontier', 'Deadliest Catch', 'Sports Day', 'MoonShiners',
                'Close Encounters', 'HighWay Thru Hell', 'Daily Planet', 'Cash Cab', 'Basketball Practice', 'Rugby Match', 'Guitar Class',
                'Music Lessons', 'Doctor checkup', 'Brazil - Mexico', 'Opening ceremony', 'Final presentation'
            ];
            let weekDate = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));
            let startDate = new Date(weekDate.getFullYear(), weekDate.getMonth(), weekDate.getDate(), 10, 0);
            let endDate = new Date(weekDate.getFullYear(), weekDate.getMonth(), weekDate.getDate(), 11, 30);
            eventData.push({
                Id: 1,
                Subject: eventSubjects[Math.floor(Math.random() * (24 - 0 + 1) + 0)],
                StartTime: startDate,
                EndTime: endDate,
                Location: '',
                Description: 'Event Scheduled',
                RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;COUNT=10;',
                IsAllDay: false,
                IsReadonly: false,
                CalendarId: 1
            });
            for (let a = 0, id = 2; a < 500; a++) {
                let month = Math.floor(Math.random() * (11 - 0 + 1) + 0);
                let date = Math.floor(Math.random() * (28 - 1 + 1) + 1);
                let hour = Math.floor(Math.random() * (23 - 0 + 1) + 0);
                let minutes = Math.floor(Math.random() * (59 - 0 + 1) + 0);
                let start = new Date(new Date().getFullYear(), month, date, hour, minutes, 0);
                let end = new Date(start.getTime());
                end.setHours(end.getHours() + 2);
                let startDate = new Date(start.getTime());
                let endDate = new Date(end.getTime());
                eventData.push({
                    Id: id,
                    Subject: eventSubjects[Math.floor(Math.random() * (24 - 0 + 1) + 0)],
                    StartTime: startDate,
                    EndTime: endDate,
                    Location: '',
                    Description: 'Event Scheduled',
                    IsAllDay: id % 10 === 0,
                    IsReadonly: endDate < new Date(),
                    CalendarId: (a % 4) + 1
                });
                id++;
            }
            if (Browser.isIE) {
                Timezone.prototype.offset = (date, timezone) => moment.tz.zone(timezone).utcOffset(date.getTime());
            }
            let overviewEvents = extend([], eventData, undefined, true);
            let timezone = new Timezone();
            let currentTimezone = timezone.getLocalTimezoneName();
            for (let event of overviewEvents) {
                event.StartTime = timezone.convert(event.StartTime, 'UTC', currentTimezone);
                event.EndTime = timezone.convert(event.EndTime, 'UTC', currentTimezone);
            }
            return overviewEvents;
        };
        return (<div className='schedule-control-section'>
        <div className='col-lg-12 control-section'>
          <div className='content-wrapper'>
            <div className='schedule-overview'>
              <div className='overview-header'>
                <div className='overview-titlebar'>
                  <div className='left-panel'>
                    <div className='schedule-overview-title' style={{ border: '1px solid transparent' }}>Scheduler Overview Functionalities</div>
                  </div>
                  <div className='center-panel'>
                    <ButtonComponent id='timezoneBtn' cssClass='title-bar-btn' iconCss='e-icons e-time-zone' disabled={true} content='UTC'/>
                    <ButtonComponent id='timeBtn' cssClass='title-bar-btn' iconCss='e-icons e-clock' disabled={true} content='Time'/>
                  </div>
                  <div className='right-panel'>
                    <div className='control-panel calendar-export'>
                      <ButtonComponent id='printBtn' cssClass='title-bar-btn' iconCss='e-icons e-print' onClick={(this.onPrint.bind(this))} content='Print'/>
                    </div>
                    <div className='control-panel'>
                      <UploaderComponent id='fileUpload' type='file' allowedExtensions='.ics' cssClass='calendar-import' buttons={{ browse: this.importTemplateFn({ text: 'Import' })[0] }} multiple={false} showFileList={false} selected={(this.onImportClick.bind(this))}/>
                    </div>
                    <div className='control-panel calendar-export'>
                      <DropDownButtonComponent id='exporting' content='Export' items={this.exportItems} select={this.onExportClick.bind(this)}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className='overview-toolbar'>
                <div style={{ height: '70px', width: 'calc(100% - 90px)' }}>
                  <ToolbarComponent id='toolbar_options' width='100%' height={70} overflowMode='Scrollable' scrollStep={100} created={() => setInterval(() => { this.updateLiveTime(); }, 1000)} clicked={this.onToolbarItemClicked.bind(this)}>
                    <ItemsDirective>
                      <ItemDirective prefixIcon='e-icons e-plus' tooltipText='New Event' text='New Event'/>
                      <ItemDirective prefixIcon='e-icons e-repeat' tooltipText='New Recurring Event' text='New Recurring Event'/>
                      <ItemDirective type='Separator'/>
                      <ItemDirective prefixIcon='e-icons e-day' tooltipText='Day' text='Day'/>
                      <ItemDirective prefixIcon='e-icons e-week' tooltipText='Week' text='Week'/>
                      <ItemDirective prefixIcon='e-icons e-week' tooltipText='WorkWeek' text='WorkWeek'/>
                      <ItemDirective prefixIcon='e-icons e-month' tooltipText='Month' text='Month'/>
                      <ItemDirective prefixIcon='e-icons e-month' tooltipText='Year' text='Year'/>
                      <ItemDirective prefixIcon='e-icons e-agenda-date-range' tooltipText='Agenda' text='Agenda'/>
                      <ItemDirective tooltipText='Timeline Views' text='Timeline Views' template={this.timelineTemplate.bind(this)}/>
                      <ItemDirective type='Separator'/>
                      <ItemDirective tooltipText='Grouping' text='Grouping' template={this.groupTemplate.bind(this)}/>
                      <ItemDirective tooltipText='Gridlines' text='Gridlines' template={this.gridlineTemplate.bind(this)}/>
                      <ItemDirective tooltipText='Row Auto Height' text='Row Auto Height' template={this.autoHeightTemplate.bind(this)}/>
                      <ItemDirective tooltipText='Tooltip' text='Tooltip' template={this.tooltipTemplate.bind(this)}/>
                      <ItemDirective tooltipText='Allow Multi Drag' text='Allow Multi Drag' template={this.multiDragTemplate.bind(this)}/>
                    </ItemsDirective>
                  </ToolbarComponent>
                </div>
                <div style={{ height: '70px', width: '90px' }}>
                  <ButtonComponent id='settingsBtn' cssClass='overview-toolbar-settings' iconCss='e-icons e-settings' iconPosition='Top' content='Settings' onClick={() => {
                let settingsPanel = document.querySelector('.overview-content .right-panel');
                if (settingsPanel.classList.contains('hide')) {
                    removeClass([settingsPanel], 'hide');
                    this.workWeekObj.refresh();
                    this.resourceObj.refresh();
                }
                else {
                    addClass([settingsPanel], 'hide');
                }
                this.scheduleObj.refreshEvents();
            }}/>
                </div>
              </div>
              <div className='overview-content'>
                <div className='left-panel'>
                  <div className='overview-scheduler'>
                    <ScheduleComponent id='scheduler' cssClass='schedule-overview' ref={(schedule) => this.scheduleObj = schedule} width='100%' height='100%' group={{ resources: ['Calendars'] }} timezone='UTC' eventSettings={{ dataSource: generateEvents() }} dateHeaderTemplate={this.dateHeaderTemplate.bind(this)} quickInfoTemplates={{
                header: this.headerTemplate.bind(this),
                content: this.contentTemplate.bind(this),
                footer: this.footerTemplate.bind(this)
            }} popupOpen={this.onPopupOpen.bind(this)}>
                      <ResourcesDirective>
                        <ResourceDirective field='CalendarId' title='Calendars' name='Calendars' dataSource={this.calendarCollections} query={new Query().where('CalendarId', 'equal', 1)} textField='CalendarText' idField='CalendarId' colorField='CalendarColor'>
                        </ResourceDirective>
                      </ResourcesDirective>
                      <ViewsDirective>
                        <ViewDirective option='Day'/>
                        <ViewDirective option='Week'/>
                        <ViewDirective option='WorkWeek'/>
                        <ViewDirective option='Month'/>
                        <ViewDirective option='Year'/>
                        <ViewDirective option='Agenda'/>
                        <ViewDirective option='TimelineDay'/>
                        <ViewDirective option='TimelineWeek'/>
                        <ViewDirective option='TimelineWorkWeek'/>
                        <ViewDirective option='TimelineMonth'/>
                        <ViewDirective option='TimelineYear'/>
                      </ViewsDirective>
                      <Inject services={[Day, Week, WorkWeek, Month, Year, Agenda, TimelineViews, TimelineMonth, TimelineYear, DragAndDrop, Resize, Print, ExcelExport, ICalendarImport, ICalendarExport]}/>
                    </ScheduleComponent>
                    <ContextMenuComponent id='ContextMenu' cssClass='schedule-context-menu' ref={(menu) => this.contextMenuObj = menu} target='.e-schedule' items={this.contextMenuItems} beforeOpen={(args) => {
                let newEventElement = document.querySelector('.e-new-event');
                if (newEventElement) {
                    remove(newEventElement);
                    removeClass([document.querySelector('.e-selected-cell')], 'e-selected-cell');
                }
                let targetElement = args.event.target;
                if (closest(targetElement, '.e-contextmenu')) {
                    return;
                }
                this.selectedTarget = closest(targetElement, '.e-appointment,.e-work-cells,.e-vertical-view .e-date-header-wrap .e-all-day-cells,.e-vertical-view .e-date-header-wrap .e-header-cells');
                if (isNullOrUndefined(this.selectedTarget)) {
                    args.cancel = true;
                    return;
                }
                if (this.selectedTarget.classList.contains('e-appointment')) {
                    let eventObj = this.scheduleObj.getEventDetails(this.selectedTarget);
                    if (eventObj.RecurrenceRule) {
                        this.contextMenuObj.showItems(['EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
                        this.contextMenuObj.hideItems(['Add', 'AddRecurrence', 'Today', 'Save', 'Delete'], true);
                    }
                    else {
                        this.contextMenuObj.showItems(['Save', 'Delete'], true);
                        this.contextMenuObj.hideItems(['Add', 'AddRecurrence', 'Today', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
                    }
                    return;
                }
                this.contextMenuObj.hideItems(['Save', 'Delete', 'EditRecurrenceEvent', 'DeleteRecurrenceEvent'], true);
                this.contextMenuObj.showItems(['Add', 'AddRecurrence', 'Today'], true);
            }} select={(args) => {
                let selectedMenuItem = args.item.id;
                let eventObj = {};
                if (this.selectedTarget && this.selectedTarget.classList.contains('e-appointment')) {
                    eventObj = this.scheduleObj.getEventDetails(this.selectedTarget);
                }
                switch (selectedMenuItem) {
                    case 'Today':
                        this.scheduleObj.selectedDate = new Date();
                        break;
                    case 'Add':
                    case 'AddRecurrence':
                        let selectedCells = this.scheduleObj.getSelectedElements();
                        let activeCellsData = this.scheduleObj.getCellDetails(selectedCells.length > 0 ? selectedCells : this.selectedTarget);
                        if (selectedMenuItem === 'Add') {
                            this.scheduleObj.openEditor(activeCellsData, 'Add');
                        }
                        else {
                            this.scheduleObj.openEditor(activeCellsData, 'Add', false, 1);
                        }
                        break;
                    case 'Save':
                    case 'EditOccurrence':
                    case 'EditSeries':
                        if (selectedMenuItem === 'EditSeries') {
                            let query = new Query().where(this.scheduleObj.eventFields.id, 'equal', eventObj.RecurrenceID);
                            eventObj = new DataManager(this.scheduleObj.eventsData).executeLocal(query)[0];
                        }
                        this.scheduleObj.openEditor(eventObj, selectedMenuItem);
                        break;
                    case 'Delete':
                        this.scheduleObj.deleteEvent(eventObj);
                        break;
                    case 'DeleteOccurrence':
                    case 'DeleteSeries':
                        this.scheduleObj.deleteEvent(eventObj, selectedMenuItem);
                        break;
                }
            }}>
                    </ContextMenuComponent>
                  </div>
                </div>
                <div className='right-panel hide'>
                  <div className='control-panel e-css'>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>First Day of Week</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="weekFirstDay" dataSource={this.weekDays} fields={{ text: 'text', value: 'value' }} value={0} popupHeight={150} change={(args) => { this.scheduleObj.firstDayOfWeek = args.value; }}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Work week</label>
                      </div>
                      <div className='col-right'>
                        <MultiSelectComponent id="workWeekDays" cssClass='schedule-workweek' ref={(workWeek) => this.workWeekObj = workWeek} dataSource={this.weekDays} mode='CheckBox' fields={{ text: 'text', value: 'value' }} enableSelectionOrder={false} showClearButton={false} showDropDownIcon={true} popupHeight={150} value={[1, 2, 3, 4, 5]} change={(args) => this.scheduleObj.workDays = args.value}>
                          <Inject services={[CheckBoxSelection]}/>
                        </MultiSelectComponent>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Resources</label>
                      </div>
                      <div className='col-right'>
                        <MultiSelectComponent id="resources" cssClass='schedule-resource' ref={(resources) => this.resourceObj = resources} dataSource={this.calendarCollections} mode='CheckBox' fields={{ text: 'CalendarText', value: 'CalendarId' }} enableSelectionOrder={false} showClearButton={false} showDropDownIcon={true} popupHeight={150} value={[1]} change={this.onResourceChange.bind(this)}>
                          <Inject services={[CheckBoxSelection]}/>
                        </MultiSelectComponent>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Timezone</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="timezone" dataSource={this.timezoneData} fields={{ text: 'text', value: 'value' }} value='Etc/GMT' popupHeight={150} change={(args) => {
                this.scheduleObj.timezone = args.value;
                this.updateLiveTime();
                document.querySelector('.schedule-overview #timezoneBtn').innerHTML =
                    '<span class="e-btn-icon e-icons e-time-zone e-icon-left"></span>' + args.itemData.text;
            }}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Day Start Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='dayStartHour' showClearButton={false} value={new Date(new Date().setHours(0, 0, 0))} change={(args) => this.scheduleObj.startHour = this.intl.formatDate(args.value, { skeleton: 'Hm' })}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Day End Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='dayEndHour' showClearButton={false} value={new Date(new Date().setHours(23, 59, 59))} change={(args) => this.scheduleObj.endHour = this.intl.formatDate(args.value, { skeleton: 'Hm' })}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Work Start Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='workHourStart' showClearButton={false} value={new Date(new Date().setHours(9, 0, 0))} change={(args) => this.scheduleObj.workHours.start = this.intl.formatDate(args.value, { skeleton: 'Hm' })}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Work End Hour</label>
                      </div>
                      <div className='col-right'>
                        <TimePickerComponent id='workHourEnd' showClearButton={false} value={new Date(new Date().setHours(18, 0, 0))} change={(args) => this.scheduleObj.workHours.end = this.intl.formatDate(args.value, { skeleton: 'Hm' })}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Slot Duration</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="slotDuration" dataSource={this.majorSlotData} fields={{ text: 'Name', value: 'Value' }} value={60} popupHeight={150} change={(args) => { this.scheduleObj.timeScale.interval = args.value; }}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Slot Interval</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="slotInterval" dataSource={this.minorSlotData} value={2} popupHeight={150} change={(args) => { this.scheduleObj.timeScale.slotCount = args.value; }}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Time Format</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="timeFormat" dataSource={this.timeFormatData} fields={{ text: 'Name', value: 'Value' }} value={"hh:mm a"} popupHeight={150} change={(args) => { this.scheduleObj.timeFormat = args.value; }}/>
                      </div>
                    </div>
                    <div className='col-row'>
                      <div className='col-left'>
                        <label style={{ lineHeight: '34px', margin: '0' }}>Week Numbers</label>
                      </div>
                      <div className='col-right'>
                        <DropDownListComponent id="weekNumber" dataSource={this.weekNumberData} fields={{ text: 'Name', value: 'Value' }} value={"Off"} popupHeight={150} change={(args) => {
                if (args.value == "Off") {
                    this.scheduleObj.showWeekNumber = false;
                }
                else {
                    this.scheduleObj.showWeekNumber = true;
                    this.scheduleObj.weekRule = args.value;
                }
            }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>);
    }
}

