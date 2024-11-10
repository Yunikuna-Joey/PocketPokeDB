import { useState, useEffect } from 'react'

// This is going to be the Events/Home page that will serve as the landing page
export const Events = () =>  { 
    // Going to need list of events to refer to [probably want a dictionary with eventName: eventDescription]
    const [data, setData] = useState([{}])

    //* This will hit the back-end endpoint which will return the list of events into the array
    useEffect(() => { 
        fetch('/page').then(
            res => res.json()
        ).then( 
            data => { 
                setData(data)
                console.log(data)
            }
        )
    }, [])

    return ( 
        // <div>
        //     {typeof data.events === 'undefined' ? (
        //         <p> Loading... </p>
        //     ) : (
        //         data.events.map((event, i) => (
        //             <p key={i}>{event}</p>
        //         ))
        //     )} 
        // </div>
        <div className="event-metadata">
            Event Stuff that needs to be turned into cards
        </div>
    )
}