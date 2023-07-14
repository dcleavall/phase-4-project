import React, { Component } from 'react';


const navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
};

class CustomToolbar extends Component {
  onClickAllEvents = () => {
    this.props.fetchEvents();
  };

  onClickPastEvents = () => {
    this.props.pastEvents();
  };

  onClickUpcomingEvents = () => {
    this.props.upcomingEvents();
  };

  render() {
    const { label } = this.props;
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button
            type="button"
            className="btn btn-control"
            onClick={() => this.navigate(navigate.PREVIOUS)}
          >
            <i className="fa fa-arrow-left"></i> Prev
          </button>
        </span>
        <span className="rbc-btn-group">
          <button
            type="button"
            className="btn btn-control"
            onClick={() => this.navigate(navigate.NEXT)}
          >
            Next <i className="fa fa-arrow-right"></i>
          </button>
        </span>
        <span className="rbc-toolbar-label">{label}</span>
        <span className="rbc-btn-group">
          <button
            type="button"
            className="btn btn-control"
            onClick={this.onClickAllEvents}
          >
            All
          </button>
        </span>
        <span className="rbc-btn-group">
          <button
            type="button"
            className="btn btn-past"
            onClick={this.onClickPastEvents}
          >
            Past
          </button>
        </span>
        <span className="rbc-btn-group">
          <button
            type="button"
            className="btn btn-upcoming"
            onClick={this.onClickUpcomingEvents}
          >
            Upcoming
          </button>
        </span>
      </div>
    );
  }

  navigate = (action) => {
    this.props.onNavigate(action);
  };
}

export default CustomToolbar;
