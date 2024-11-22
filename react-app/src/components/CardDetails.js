import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from "react-router-dom";

import { SearchBar } from './SearchBar';
import { FilterMenu } from './FilterMenu';

/* 
Tentative plan: 
    The parameter for this component could be the baseSetid 
    The baseSetid then is used to hit another endpoint to gather all the cards with the same baseSetId in the back-end
    Then we received JSON data for all the card data from this specific baseSet to display for the user on the front-end
*/
export const CardDetails = () => { 
    // This will take in some pack, so we will need some kind of foreign key from the base set into the collection set 
    const { basePackId } = useParams()

    //* cardData is used to hold all of the meta-data about the cards associated with a certain familySet
    const [cardData, setCardData] = useState([])

    //* page will be utilized with infinite scrolling and lazy loading to provide automated loading experience for card data
    const [page, setPage] = useState(1)

    const pageSize = 20

    //* if there is more content available for loading, set the boolean to be true to indicate loading process
    const [contentAvailable, setContentAvailable] = useState(true)

    const observer = useRef()

    //* function to fetch more data from the end point after the initial load
    const fetchCardData = useCallback(async () => {
        try { 
            const response = await fetch(`/subpackinfo/${basePackId}?page=${page}&page_size=${pageSize}`)
            const data = await response.json()

            setContentAvailable(data.length === pageSize)

            setCardData(prevCards => [...prevCards, ...data])
        }
        catch(error) { 
            console.error("[fetchCardDataJS]- Error fetching card data: ", error)
        }
    }, [basePackId, page])

    //* Utilize IntersectionObserver to load more content when last element in DOM is visible
    const lastCardReference = useCallback(
        (node) => { 
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => { 
                if (entries[0].isIntersecting && contentAvailable) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node)
        }, [contentAvailable]
    )

    //* Everything below this will be utilized for creating the filter menu 
    const optionList1 = ['1option1', '1option2', '1option3']
    const optionList2 = ['2option1', '2option2', '2option3']
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    const handleOptionChange = (option, action) => {
        if (action === 'add' && !selectedOptions.includes(option)) {
            setSelectedOptions([...selectedOptions, option]);
        } else if (action === 'remove') {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        }
    };

    const handleRemoveOption = (option) => {
        setSelectedOptions(selectedOptions.filter(item => item !== option));
    };

    // use the base pack id from the family set to query the booster packs which match the family set [collectionSet packs that match FamilySet id's]
    // useEffect(() => { 
    //     fetch(`/subpackinfo/${basePackId}`).then(
    //         res => res.json()
    //     ).then(
    //         data => { 
    //             setCardData(data)
    //         }
    //     )
    // })
    //* new implementation of above useEffect case [test]
    useEffect(() => {
        fetchCardData()
    }, [fetchCardData])

    return ( 
        <div className='parent-ctn'>
            <div className="search-and-filter">
                <SearchBar /> 
                <FilterMenu 
                    optionList={optionList1}
                    selectedOptions={selectedOptions}
                    // onOptionChange={handleAddOption}
                    onOptionChange={handleOptionChange}
                />  
                <FilterMenu 
                    optionList={optionList2}
                    selectedOptions={selectedOptions}
                    // onOptionChange={handleAddOption}
                    onOptionChange={handleOptionChange}
                />                                                                
            </div>

            <div className="selected-bubbles">
                {selectedOptions.map((option, index) => (
                    <div key={index} className="bubble"> 
                        {option}
                        <button
                            className='remove-button'
                            onClick={() => handleRemoveOption(option)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            <div className="card-container">
                {cardData.length > 0 ? (
                    cardData.map((card, index) => (
                        <div
                            key={`${card.id}-${index}`}
                            ref={index === cardData.length - 1 ? lastCardReference : null}  // Attach ref to the last card
                            className="card-element"
                        >
                            <h3>{card.name}</h3>
                            <img src={card.coverArt} className="card-image" alt={card.name} loading="lazy" />
                            <p>Rarity: {card.rarity}</p>
                            <p>Hit Points: {card.hitPoints}</p>
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>

        </div>
    )
}