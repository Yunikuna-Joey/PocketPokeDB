import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from "react-router-dom";

import { SearchBar } from './SearchBar';
import { FilterMenu } from './FilterMenu';

export const CardDetails = () => { 
    //* This will take in some pack, so we will need some kind of foreign key from the base set into the collection set 
    const { basePackId } = useParams()

    //* cardData is used to hold all of the meta-data about the cards associated with a certain familySet
    const [cardData, setCardData] = useState([])
    
    //* variables to hold the filters selected by the user 
    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [selectedOptions2, setSelectedOptions2] = useState([]);

    //* page will be utilized with infinite scrolling and lazy loading to provide automated loading experience for card data
    const [page, setPage] = useState(1)

    const pageSize = 20

    //* if there is more content available for loading, set the boolean to be true to indicate loading process
    const [contentAvailable, setContentAvailable] = useState(true)

    //* Used to determine which is the last card value 
    const observer = useRef()

    //* Hold the search term the user wants to use 
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSearchData = useCallback(async () => { 
        try { 
            //* Do not need to implement page data as the scope is within a particular pack and very unlikely to be more than 5 copies of a certain card 
            const response = await fetch(`/searchCardQuery/${basePackId}?search=${searchTerm}`)
            const data = await response.json()

            setContentAvailable(data.length > 0)
            setCardData(data)
        }

        catch (error) { 
            console.error("[fetchSearchData] - Error fetching search data: ", error)
        }

    }, [basePackId, searchTerm])

    //* function to fetch more data from the end point after the initial load
    const fetchCardData = useCallback(async () => {
        try { 
            const response = await fetch(`/subpackinfo/${basePackId}?page=${page}&page_size=${pageSize}`)
            const data = await response.json()

            setContentAvailable(data.length === pageSize)

            // setCardData(prevCards => [...prevCards, ...data])
            setCardData((prevCards) => {
                const newCards = data.filter((card) => !prevCards.some((prevCard) => prevCard.id === card.id));
                return [...prevCards, ...newCards];
            });
        }
        catch(error) { 
            console.error("[fetchCardDataJS]- Error fetching card data: ", error)
        }
    }, [basePackId, page])

    //* Function to grab filtered data 
    const fetchFilteredData = useCallback(async () => {
        try { 
            const response = await fetch(`/requestFilteredInfo/${basePackId}?pokemonCover=${selectedOptions1}&rarity=${selectedOptions2}&page=${page}&page_size=${pageSize}`)
            const data = await response.json()

            // setContentAvailable(data.length === pageSize)
            // setCardData(prevCards => [...prevCards, ...data])

            setCardData((prevCards) => { 
                const newCards = data.filter((card) => !prevCards.some((prevCard) => prevCard.id === card.id)); 
                return [...prevCards, ...newCards];
            });
        }
        catch(error) { 
            console.error("[fetchFilteredData]- Error fetching filtered data: ", error)
        }

    }, [selectedOptions1, selectedOptions2, basePackId, page])

    const fetchSearchFilterData = useCallback(async () => { 
        try { 
            const response = await fetch(`/requestSearchFilterData/${basePackId}?pokemonCover=${selectedOptions1}&rarity=${selectedOptions2}&term=${searchTerm}`)
            const data = await response.json()

            setContentAvailable(data.length > 0)
            setCardData(data)
        }

        catch(error) {
            console.error("[fetchSearchFilterData]- Error fetching filtered data: ", error)
        }
    }, [basePackId, selectedOptions1, selectedOptions2, searchTerm])

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
    
    const handleOptionChange = (option, action, listId, resetSearch) => {
        // FilterMenu1
        if (listId === 1) {
            if (action === 'add' && !selectedOptions1.includes(option)) {
                setSelectedOptions1([...selectedOptions1, option]);
            } 
            else if (action === 'remove') {
                setSelectedOptions1(selectedOptions1.filter(item => item !== option));
            }
        }

        // FilterMenu2
        else if (listId === 2) {
            if (action === 'add' && !selectedOptions2.includes(option)) {
                setSelectedOptions2([...selectedOptions2, option]);
            } 
            else if (action === 'remove') {
                setSelectedOptions2(selectedOptions2.filter(item => item !== option));
            }
        }

        // reset the search input 
        if (resetSearch) resetSearch("")
    };

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

    //* Delay implementation 
    useEffect(() => {        
        // Debounce logic to prevent flooding
        const handler = setTimeout(() => {
            // if (searchTerm && (selectedOptions1.length > 0 || selectedOptions2.length > 0)) {
            //     fetchSearchFilterData()
            // }
            if (searchTerm) {
                fetchSearchData()
            }
             
            else if (selectedOptions1.length > 0 || selectedOptions2.length > 0) {
                fetchFilteredData()
            }  
            else {
                fetchCardData()
            }
        }, 500);  // 500ms delay
    
        // Cleanup function to cancel timeout
        return () => clearTimeout(handler);
    }, [selectedOptions1, selectedOptions2, searchTerm])

    //* Effect to handle pagination
    useEffect(() => {
        if (page > 1) {
            if (searchTerm && (selectedOptions1.length > 0 || selectedOptions2.length > 0)) {
                fetchSearchFilterData(); // Load more with search and filters
            } 
            else if (selectedOptions1.length > 0 || selectedOptions2.length > 0) {
                fetchFilteredData(); // Load more with filters only
            } 
            else if (searchTerm) {
                fetchSearchData(); // Load more with search only
            } 
            else {
                fetchCardData(); // Load more without filters or search
            }
        }
    }, [page, searchTerm, selectedOptions1, selectedOptions2]);

    //* Potential full depdendency array 
    // [selectedOptions1, selectedOptions2, searchTerm, fetchCardData, fetchFilteredData, fetchSearchData, fetchSearchFilterData]

    useEffect(() => { 
        if (searchTerm) { 
            setCardData([]);
            setPage(1)
            setContentAvailable(true)
            fetchSearchData()
        }
    }, [searchTerm, fetchSearchData])

    useEffect(() => { 
        if (selectedOptions1.length > 0 || selectedOptions2.length > 0) {
            setCardData([]);
            setPage(1)
            setContentAvailable(true)
            fetchFilteredData()
        }
    }, [selectedOptions1, selectedOptions2, fetchFilteredData])


    // passes the value into the search-term variable 
    const handleSearch = (term) => {
        setSearchTerm(term)
    }

    return ( 
        <div className='parent-ctn'>
            <div className="search-and-filter">
                <SearchBar 
                    value={searchTerm}
                    onSearch={handleSearch} 
                    onInputChange={setSearchTerm}
                /> 

                <FilterMenu
                    optionList={optionList1}
                    selectedOptions={selectedOptions1}
                    onOptionChange={(option, action) => handleOptionChange(option, action, 1, setSearchTerm)}
                />
                <FilterMenu
                    optionList={optionList2}
                    selectedOptions={selectedOptions2}
                    onOptionChange={(option, action) => handleOptionChange(option, action, 2, setSearchTerm)}
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
                        </div>
                    ))
                ) : (
                    <p>No Results</p>
                )}
            </div>

        </div>
    )
}