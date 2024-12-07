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
    // const [filteredCardData, setFilteredCardData] = useState([])
    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [selectedOptions2, setSelectedOptions2] = useState([]);

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

    const fetchFilteredData = useCallback(async () => {
        //***********************************************************************************
        //* This function will hit the request filtered information and populate it into the cardData that was intiially declared 
        //* Then we will test with the lastCardReference when we overwrite data
        
        try { 
            const response = await fetch(`/requestFilteredInfo/${basePackId}?pokemonCover=${selectedOptions1}&rarity=${selectedOptions2}&page=${page}&page_size=${pageSize}`)
            const data = await response.json()

            setContentAvailable(data.length === pageSize)
            setCardData(prevCards => [...prevCards, ...data])
        }
        catch(error) { 
            console.error("[fetchFilteredData]- Error fetching filtered data: ", error)
        }
    }, [selectedOptions1, selectedOptions2, basePackId, page])

    //* Everything below this will be utilized for creating the filter menu 
    const [optionList1, setOptionList1] = useState([])
    useEffect(() => {
        const url = `/populateOptionList1/${basePackId}`;
        console.log("Fetching from URL:", url);

        fetch(`/populateOptionList1/${basePackId}`).then(
            res => res.json()
        ).then(
            data => {
                setOptionList1(data)
                console.log("This is optionList1 data", data)
            }
        ).catch(error => console.error("Error fetching optionList1:", error));
    }, [basePackId])

    const [optionList2, setOptionList2] = useState([])
    useEffect(() => {
        fetch(`/populateOptionList2/${basePackId}`).then(
            res => res.json()
        ).then(
            data => {
                setOptionList2(data)
                console.log("This is optionList2 data", data)
            }
        )
    }, [basePackId])
    
    const handleOptionChange = (option, action, listId) => {
        // FilterMenu1
        if (listId === 1) {
            if (action === 'add' && !selectedOptions1.includes(option)) {
                setSelectedOptions1([...selectedOptions1, option]);
            } else if (action === 'remove') {
                setSelectedOptions1(selectedOptions1.filter(item => item !== option));
            }
        }

        // FilterMenu2
        else if (listId === 2) {
            if (action === 'add' && !selectedOptions2.includes(option)) {
                setSelectedOptions2([...selectedOptions2, option]);
            } else if (action === 'remove') {
                setSelectedOptions2(selectedOptions2.filter(item => item !== option));
            }
        }
    };

    // reset the card data when user applies a filter
    useEffect(() => {
        setCardData([]);
        setPage(1)
        setContentAvailable(true)
    }, [selectedOptions1, selectedOptions2])

    // Initially loads the first 20 card data 
    // useEffect(() => {
    //     fetchCardData()
    // }, [fetchCardData])

    useEffect(() => {
        if (selectedOptions1.length > 0 || selectedOptions2.length > 0) {
            fetchFilteredData()
        }
        else { 
            fetchCardData();
        }
    }, [selectedOptions1, selectedOptions2, fetchCardData, fetchFilteredData]);

    return ( 
        <div className='parent-ctn'>
            <div className="search-and-filter">
                <SearchBar /> 
                <FilterMenu
                    optionList={optionList1}
                    selectedOptions={selectedOptions1}
                    onOptionChange={(option, action) => handleOptionChange(option, action, 1)}
                />
                <FilterMenu
                    optionList={optionList2}
                    selectedOptions={selectedOptions2}
                    onOptionChange={(option, action) => handleOptionChange(option, action, 2)}
                />                                                                
            </div>

            <div className="selected-bubbles">
                {selectedOptions1.map((option, index) => (
                    <div key={`option2-${index}`} className="bubble">
                        {option}
                        <button
                            className="remove-button"
                            onClick={() => handleOptionChange(option, 'remove', 1)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
                {selectedOptions2.map((option, index) => (
                    <div key={`option2-${index}`} className="bubble">
                        {option}
                        <button
                            className="remove-button"
                            onClick={() => handleOptionChange(option, 'remove', 2)}
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