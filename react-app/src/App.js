import React, { useState, useEffect } from 'react'
import './App.css';
import { Events } from './components/Events';
import { Sidebar } from './components/Sidebar';


function App() { 
    /* 
        It seems that if you are going to declare a variable, you would most likely be modifying it in some way, 
        so we have a set function associated with the useState of the variable 
    */

    const [data, setData] = useState([{}])

    //* Only want this portion of changing the document title to trigger once on the initial page render
    useEffect(() => { 
        document.title = 'PocketPokemonDB';
    }, [])

    return ( 
        <div className="App"> 
            <Sidebar/>
            <div className="content">
                <Events />
            </div>

        </div>
    )
}

export default App