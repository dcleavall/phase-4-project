import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import CustomToolbar from './Toolbar';
import Popup from 'react-popup';
import Input from './Input';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class CustomCalendar extends Component {
  state = {
    events: []
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    // Simulate fetching events from an API or data source
    const events = [
      {
        id: 1,
        title: 'Event 1',
        start: new Date(2023, 6, 12, 10, 0),
        end: new Date(2023, 6, 12, 12, 0)
      },
      {
        id: 2,
        title: 'Event 2',
        start: new Date(2023, 6, 13, 14, 0),
        end: new Date(2023, 6, 13, 16, 0)
      }
    ];

    this.setState({ events });
  };

  renderEventContent = (slotInfo) => {
    const date = moment(slotInfo.start).format('MMMM D, YYYY');
    return (
      <div>
        <p>Date: <strong>{date}</strong></p>
        <p>Location: {slotInfo.location}</p>
      </div>
    );
  };

  onSelectEventHandler = (slotInfo) => {
    Popup.create({
      title: slotInfo.title,
      content: this.renderEventContent(slotInfo),
      buttons: {
        right: [
          {
            text: 'Edit',
            className: 'info',
            action: () => {
              Popup.close();
              this.openPopupForm(slotInfo);
            }
          },
          {
            text: 'Delete',
            className: 'danger',
            action: () => {
              this.deleteEvent(slotInfo.id);
              Popup.close();
            }
          }
        ]
      }
    });
  };

  onSelectEventSlotHandler = (slotInfo) => {
    this.openPopupForm(slotInfo);
  };

  openPopupForm = (slotInfo) => {
    let newEvent = false;
    let popupTitle = 'Update Event';
    if (!slotInfo.hasOwnProperty('id')) {
      slotInfo.id = moment().format('x');
      slotInfo.title = null;
      slotInfo.location = null;
      popupTitle = 'Create Event';
      newEvent = true;
    }

    let titleChange = (value) => {
      slotInfo.title = value;
    };

    let locationChange = (value) => {
      slotInfo.location = value;
    };

    Popup.create({
      title: popupTitle,
      content: (
        <div>
          <Input
            onChange={titleChange}
            placeholder="Event Title"
            defaultValue={slotInfo.title}
          />
          <Input
            onChange={locationChange}
            placeholder="Event Location"
            defaultValue={slotInfo.location}
          />
        </div>
      ),
      buttons: {
        left: ['cancel'],
        right: [
          {
            text: 'Save',
            className: 'success',
            action: () => {
              if (newEvent) {
                this.createEvent(slotInfo);
              } else {
                this.updateEvent(slotInfo);
              }
              Popup.close();
            }
          }
        ]
      }
    });
  };

  eventStyleGetter = (event, start, end, isSelected) => {
    const current_time = moment().format('YYYY MM DD');
    const event_time = moment(event.start).format('YYYY MM DD');
    const background = current_time > event_time ? '#DE6987' : '#8CBD4C';
    return {
      style: {
        backgroundColor: background
      }
    };
  };

  createEvent = (event) => {
    const { events } = this.state;
    const newEvent = { ...event };
    // Perform any necessary validations or modifications
    events.push(newEvent);
    this.setState({ events });
  };

  updateEvent = (updatedEvent) => {
    const { events } = this.state;
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    this.setState({ events: updatedEvents });
  };

  deleteEvent = (eventId) => {
    const { events } = this.state;
    const updatedEvents = events.filter((event) => event.id !== eventId);
    this.setState({ events: updatedEvents });
  };

  render() {
    const { events } = this.state;

    return (
      <div className="calendar-container">
        <Calendar
          popup
          selectable
          localizer={localizer}
          defaultView="month"
          components={{ toolbar: CustomToolbar }}
          style={{ height: 600 }}
          events={events}
          eventPropGetter={this.eventStyleGetter}
          onSelectEvent={this.onSelectEventHandler}
          onSelectSlot={this.onSelectEventSlotHandler}
        />
        <Popup />
      </div>
    );
  }
}

export default CustomCalendar;
