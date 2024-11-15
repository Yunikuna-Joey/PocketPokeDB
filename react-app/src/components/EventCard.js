import React from 'react';
import { Link } from 'react-router-dom'

const EventCard = ({ event }) => {

    // Used to convert the time into PST/PDT respectively 
    const formatTime = (time) => {
        const localDate = new Date(time);
        const options = {
            timeZone: "America/Los_Angeles", 
            month: "2-digit",    
            day: "2-digit",      
            year: "numeric",     
            hour: "2-digit",     
            minute: "2-digit",   
            hour12: true,       
        };

        let formattedDateTime = localDate.toLocaleString("en-US", options);

        const [datePart, timePart] = formattedDateTime.split(', ');
        return `${datePart} at ${timePart}`;
    };

    /* 
        Used to mapping out the eventName to their url 
        eventRoutes = { eventId : url path (only) }
    */
    const eventRoutes = { 
        1: "/events/WonderEvent1", 
        2: "/events/LaprasDropEvent", 
        3: "/events/GAEmblemEvent1",
        4: "/events/WonderEvent2",
    }



    return (
        <div className="event-card"> 
            <img
                src={event.eventCoverArt}
                alt={event.eventName}
                className="event-image"
            />

            <h3> 
                <Link to={eventRoutes[event.id]}>
                    {event.eventName}
                </Link> 
            </h3>

            <div className="event-duration">
                <p>{formatTime(event.startTime)}</p>
                <p> - </p>
                <p>{formatTime(event.endTime)}</p>
            </div>
            
            <p>{event.eventDescription}</p>

        </div>
    )
};

export default EventCard;