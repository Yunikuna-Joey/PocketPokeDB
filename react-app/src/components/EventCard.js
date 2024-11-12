import React from 'react';

const EventCard = ({ event }) => {
    return (
        <div className="event-card"> 
            <img
                // src={`${process.env.PUBLICURL}/assets/${event.eventCoverArt}`}
                src={event.eventCoverArt}
                alt={event.eventName}
                className="event-image"
            />

            <h3>{event.eventName}</h3>
            <p>{event.eventDescription}</p>
            <p>Start: {new Date(event.startTime).toLocaleString()}</p>
            <p>End: {new Date(event.endTime).toLocaleString()}</p>
        </div>
    )
};

export default EventCard;