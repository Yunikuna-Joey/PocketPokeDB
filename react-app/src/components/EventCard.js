import React from 'react';

const EventCard = ({ event }) => {
    return (
        <div className="event-card"> 
            <img
                src={event.eventCoverArt}
                alt={event.eventName}
                className="event-image"
            />

            <h3>{event.eventName}</h3>

            <div className="event-duration">
                <p>{new Date(event.startTime).localDate.toLocaleString()}</p>
                <p> - </p>
                <p>{new Date(event.endTime).localDate.toLocaleString()}</p>
            </div>
            
            <p>{event.eventDescription}</p>

        </div>
    )
};

export default EventCard;