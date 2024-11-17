import { useParams } from "react-router-dom";

// The different event components 
import { WonderEvent1 } from './CustomEventPages';
import { WonderEvent2 } from './CustomEventPages';
import { LaprasDropEvent } from './CustomEventPages';
import { GAEmblemEvent1 } from './CustomEventPages';

const eventComponents = { 
    WonderEvent1: WonderEvent1, 
    WonderEvent2: WonderEvent2, 
    LaprasDropEvent: LaprasDropEvent, 
    GAEmblemEvent1: GAEmblemEvent1
}

export const EventDetails = () => { 

    const { eventName } = useParams(); 

    const SingleComponent = eventComponents[eventName]

    if (!SingleComponent) { 
        return <p>Event not found</p>
    }

    return <SingleComponent />
}