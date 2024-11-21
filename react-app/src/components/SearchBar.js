import { useState } from 'react' 

export const SearchBar = ({ onSearch }) => {
    //* Query will start as an empty string 
    const [query, setQuery] = useState('')

    //* Event listener will invoke the setQuery function to change the search query
    const inputEventListener = (event) => { 
        setQuery(event.target.value)
    }

    //* possible want this to be a automatic query search
    const handleFormSubmission = (event) => { 
        event.preventDefault();
        onSearch(query)
    }

    return (
        <form onSubmit={handleFormSubmission} className="search-form">
            <input 
                type="search"
                value={query}
                onChange={inputEventListener}
                placeholder="Search..."
                aria-label="Search"
                className="search-input"
            />
        </form>
    )
}