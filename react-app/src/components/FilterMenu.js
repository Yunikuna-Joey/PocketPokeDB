import { useState } from 'react';

export const FilterMenu = () => { 
    const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const isOptionSelected = (option) => selectedOptions.includes(option);

    return (
        <div className="multi-select-dropdown">
            <button onClick={toggleDropdown} className="dropdown-button">
                {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select options'}
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
    );
}