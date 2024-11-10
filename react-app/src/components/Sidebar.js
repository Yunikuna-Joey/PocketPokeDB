import React from 'react'

export const Sidebar = () => { 
    //* Previous implementation
    return ( 
        <div className="sideMenu"> 
            <h2> PokemonPocketDB </h2>
            {/* Most likely insert an icon next to it to expand and collapse the menu */}

            <ul> 
                <li><a href='#events'>Events</a></li>
                <li><a href='#cards'>Cards | Pack Info</a></li>
                <li><a href='#decks'>Decks</a></li>
            </ul>
        </div>
    )
}
