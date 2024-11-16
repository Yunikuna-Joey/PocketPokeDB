// import { useParams } from "react-router-dom"


// const boosterPackPages = { 
//     GeneticApex: GeneticApex, 
//     PromoPackAV1: PromoPackAV1
// }

/* 
Tentative plan: 
    The parameter for this component could be the baseSetid 
    The baseSetid then is used to hit another endpoint to gather all the cards with the same baseSetId in the back-end
    Then we received JSON data for all the card data from this specific baseSet to display for the user on the front-end
*/
export const CardDetails = ({ baseSetId }) => { 
    // This will take in some pack, so we will need some kind of foreign key from the base set into the collection set 

    return ( 
        <div> 
            This will act as the page that will display the collection set 
            of the base set 
        </div>
    )
}