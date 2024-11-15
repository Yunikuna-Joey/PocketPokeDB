import React from 'react'
import { Link } from 'react-router-dom'

export const Sidebar = () => { 
    //* Previous implementation
    return ( 
        <div className="sideMenu"> 
            <h2> PokemonPocketDB </h2>
            {/* Most likely insert an icon next to it to expand and collapse the menu */}

            <ul> 
                <li><Link to="/">Events</Link></li>
                <li><Link to="cardpackinfo">Cards | Pack Info</Link></li>
                <li><Link to="decks">Decks</Link></li>
            </ul>
        </div>
    )
}
