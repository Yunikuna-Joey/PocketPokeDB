import { useState } from 'react' 

export const SearchBar = ({ onSearch }) => {
    //* Query will start as an empty string 
    const [query, setQuery] = useState('')

    //* Event listener will invoke the setQuery function to change the search query
    const inputEventListener = (event) => { 
        setQuery(event.target.value)
    }

    const handleFormSubmission = (event) => { 
        event.preventDefault();
        onSearch(query)
    }
}