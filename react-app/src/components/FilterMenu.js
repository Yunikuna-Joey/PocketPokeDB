import { useState } from 'react';

export const FilterMenu = ({ optionList, selectedOptions, onOptionChange}) => { 
    //* This will take in the filtering options based from the parent component 
    const options = optionList
    
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
        if (selectedOptions.includes(option)) {
            onOptionChange(option, 'remove')
        }
        else { 
            onOptionChange(option, 'add')
        }
    };

    const isOptionSelected = (option) => selectedOptions.includes(option);

    const buttonName = optionList.length === 8 ? 'Select Rarity' : 'Select Pack'

    return (
        <div className="filter-container">
            <div className="multi-select-dropdown">
                <button onClick={toggleDropdown} className="dropdown-button">
                    {buttonName}
                </button>
                {isOpen && (
                    <ul className="dropdown-menu">
                        {options.map((option, index) => (
                            <li key={index} onClick={() => handleOptionClick(option)} className="dropdown-option">
                                <input
                                    type="checkbox"
                                    checked={isOptionSelected(option)}
                                    readOnly
                                />
                                <span>{option}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}