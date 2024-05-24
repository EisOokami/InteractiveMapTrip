import { useState } from 'react';
import "./Search.scss";

export default function Search({ modalSearch, positions, valueLocation, valueName, setValueLocation, setValueName, setZoomLocationX, setZoomLocationY,setSelectedPosition, setOpenPlaceCard }) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    if (!modalSearch) return null;

    const handleChangeLocation = (e) => {
        setValueLocation(e.target.value.toLowerCase());
    };

    const handleChangeName = (e) => {
        setValueName(e.target.value.toLowerCase());
    };

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(category)
                ? prevSelected.filter(cat => cat !== category)
                : [...prevSelected, category]
        );
    };

    const handleZoomLocation = (x, y, key) => {
        setZoomLocationX(x);
        setZoomLocationY(y);
        setSelectedPosition(key);
        setOpenPlaceCard(true);
    };

    const uniqueCategories = [...new Set(positions.map(pos => pos.category))];

    const filteredPositions = positions.filter(elem =>
        elem.name.toLowerCase().includes(valueName) &&
        elem.location.toLowerCase().includes(valueLocation) &&
        (selectedCategories.length === 0 || selectedCategories.includes(elem.category))
    );

    return (
        <div className="search absolute sm:relative bottom-0 z-[1999] w-full sm:w-1/2 h-full p-5 pt-10 sm:pt-1 bg-white transition-all ease-in shadow-2xl">
            <input 
                className="input-search" 
                type="text" 
                placeholder="Lokalizacja" 
                onChange={handleChangeLocation} 
            />
            <input 
                className="input-search" 
                type="text" 
                placeholder="Nazwa obiektu" 
                onChange={handleChangeName} 
            />
            <div className="relative">
                <button
                    onClick={handleDropdownToggle}
                    className="text-white bg-bright-blue hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm mt-3 px-5 py-2.5 text-center inline-flex items-center w-full transition-all ease-in"
                    type="button"
                >
                    Wybierz kategorie
                </button>

                {dropdownVisible && (
                    <div className="absolute z-10 bg-white rounded-lg shadow mt-2 w-full">
                        <ul className="p-3 space-y-1 text-sm text-gray-700">
                            {uniqueCategories.map((category, key) => (
                                <li key={key}>
                                    <div className="flex items-center p-2 rounded hover:bg-gray-100">
                                        <input
                                            id={`checkbox-item-${key}`}
                                            type="checkbox"
                                            value={category}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        <label 
                                            htmlFor={`checkbox-item-${key}`} 
                                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="card-search mt-3 overflow-y-auto max-h-[74vh]">
                {filteredPositions.map((elem) => (
                    <a 
                        key={elem.id} 
                        href="#" 
                        className="flex flex-row items-center bg-white border border-gray-200 rounded-lg shadow max-w-xl hover:bg-gray-100 mb-3" 
                        onClick={() => handleZoomLocation(elem.x, elem.y, elem.id)}
                    >
                        <img 
                            className="object-cover h-36 w-28 rounded-l-lg" 
                            src={elem.img} 
                            alt={elem.name} 
                        />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                            <h5 className="font-bold tracking-tight text-gray-900">{elem.name}</h5>
                            <p className="mt-2 text-sm font-normal text-gray-700">{elem.category}</p>
                            <p className="text-sm italic font-normal">{elem.location}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}