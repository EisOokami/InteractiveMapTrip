import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { FaPersonHiking } from "react-icons/fa6";

export default function Navbar({
    openSearch,
    setOpenSearch,
    setOpenPlaceCard,
    openTrip,
    setOpenTrip,
}) {
    const handleOpenMap = () => {
        setOpenSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(false);
    };

    const handleOpenSearch = () => {
        setOpenSearch(!openSearch);
        setOpenPlaceCard(false);
        setOpenTrip(false);
    };

    const handleOpenTrip = () => {
        setOpenSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(!openTrip);
    };

    return (
        <div className="navbar md:grid bg-white dark:bg-second-black border-t-2 md:border-t-0 md:border-r-2 dark:border-second-gray font-mono z-[1999] transition-colors duration-700">
            <ul className="flex justify-around md:flex-col md:justify-center">
                <motion.li
                    className={`option_navbar ${!openSearch && !openTrip ? "option-active_navbar" : ""}`}
                    onClick={handleOpenMap}
                >
                    <FaMapMarkerAlt />
                    <div className="option-bg-gradient_navbar"></div>
                </motion.li>
                <li
                    className={`option_navbar ${openSearch ? "option-active_navbar" : ""}`}
                    onClick={handleOpenSearch}
                >
                    <FaSearch />
                    <div className="option-bg-gradient_navbar"></div>
                </li>
                <li
                    className={`option_navbar ${openTrip ? "option-active_navbar" : ""}`}
                    onClick={handleOpenTrip}
                >
                    <FaPersonHiking />
                    <div className="option-bg-gradient_navbar"></div>
                </li>
            </ul>
        </div>
    );
}
