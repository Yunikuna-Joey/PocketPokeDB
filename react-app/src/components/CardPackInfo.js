import { useState, useEffect } from 'react'
import { CardPackTile } from './CardPackTile'

export const CardPackInfo = () => { 
    // we will need to load in the pack [3]
    const [packList, setPackList] = useState([])

    //* Invokes a call to our back-end endpoint to gather the necessary information 
    useEffect(() => { 
        fetch('/packPage').then(
            res => res.json()
        ).then(
            data => { 
                setPackList(data)
                console.log(data)
            }
        )
    }, [])

    /* 
        Tentative Plan: 
        --> Load in only the Parent name for the booster packs (i.e Genetic Apex, Promotional Pack A)
        
        Option #1
            --> The booster pack tile will then lead to the different faces (if any) 
            --> Then another click into the face pack 
            --> Then display all the cards available 
            
        Option #2 [Idea is less clicks on this]
            ==> initial click will then bring us to a page all of the cards available
            ==> we will have the abiltiy to search and filter 
            ==> just need a good way of displaying the cards now... 
    */ 

    return ( 
        <div className="booster-pack-metadata"> 
            {packList.length === 0 ? (
                <p> Hello World </p>    
            ) : ( 
                packList.map((pack, i) => (
                    <CardPackTile key={i} boosterPack={pack}/>
                ))
            )} 
        </div>
    )
}