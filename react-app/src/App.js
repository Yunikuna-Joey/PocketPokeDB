import React, { useEffect } from 'react'
import './App.css';
import { Events } from './components/Events';
import { Sidebar } from './components/Sidebar';
import { CardPackInfo } from './components/CardPackInfo';
import { Decks } from './components/Decks'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WonderEvent1 } from './components/CustomEventPages';


function App() { 
    /* 
        It seems that if you are going to declare a variable, you would most likely be modifying it in some way, 
        so we have a set function associated with the useState of the variable 
    */

    //* Only want this portion of changing the document title to trigger once on the initial page render
    useEffect(() => { 
        document.title = 'PocketPokemonDB';
    }, [])

    /* 
        Wrap the entire main app in a Router tag to allow for link redirection 
        Wrap Routes as parent container with Route as child containers in order to declare url paths for different React components 
    */

    return ( 
        <Router>
            <div className="App"> 
                <Sidebar/>
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Events />} />
                        <Route path="/cardpackinfo" element={<CardPackInfo />} />
                        <Route path="/decks" element={<Decks />} />

                        <Route path="/WonderEvent1" element={<WonderEvent1 />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App