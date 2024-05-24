import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { FaPersonHiking } from "react-icons/fa6";

export default function Navbar({modalSearch, setModalSearch, setOpenPlaceCard, openTrip, setOpenTrip}) {
    const handleOpenMap = () => {
        setModalSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(false);
    };

    const handleOpenSearch = () => {
        setModalSearch(!modalSearch);
        setOpenPlaceCard(false);
        setOpenTrip(false);
    };

    const handleOpenTrip = () => {
        setModalSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(!openTrip);
    };

    return (
        <div className="navbar shadow-2xl font-mono flex justify-center sm:bg-bright-blue">
            <ul className="flex absolute z-[2000] sm:relative mt-2 sm:mt-0">
                <li 
                    className="navbar-option sm:border-r-2" 
                    onClick={handleOpenMap}
                >
                    <FaMapMarkerAlt/>MAPA
                </li>
                <li 
                    className="navbar-option sm:border-r-2"
                    onClick={handleOpenSearch}    
                >
                    <FaSearch/>SZUKAJ
                </li>
                <li 
                    className="navbar-option"
                    onClick={handleOpenTrip}
                >
                    <FaPersonHiking/>WYCIECZKA
                </li>
            </ul>
        </div>
    )
}