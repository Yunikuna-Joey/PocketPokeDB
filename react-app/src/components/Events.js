import { useState, useEffect } from 'react'
import EventCard from './EventCard'

// This is going to be the Events/Home page that will serve as the landing page
export const Events = () =>  { 
    // Going to need list of events to refer to [probably want a dictionary with eventName: eventDescription]
    const [events, setEvents] = useState([])

    //* This will hit the back-end endpoint which will return the list of events into the array
    useEffect(() => { 
        fetch('/eventPage').then(
            res => res.json()
        ).then( 
            data => { 
                setEvents(data)
                console.log(data)
            }
        )
    }, [])

    return ( 
        <div className="event-metadata">
            {events.length === 0 ? ( 
                <p> Loading... </p>
            ) : (
                events.map((event, i) => (
                    <EventCard key={i} event={event}/>
                ))
            )}
        </div>
    )
}