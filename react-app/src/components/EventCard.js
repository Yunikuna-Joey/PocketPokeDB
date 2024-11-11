import React from 'react';

const EventCard = ({ event }) => {
    return (
        <div className="event-card"> 
            <img src={event.eventCoverArt} alt={`${event.eventName} cover`} className="event-cover"/>
            <h3>{event.eventName}</h3>
            <p>{event.eventDescription}</p>
            <p>Start: {new Date(event.startTime).toLocaleString()}</p>
            <p>End: {new Date(event.endTime).toLocaleString()}</p>
        </div>
    )
};

export default EventCard;