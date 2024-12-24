import { Dispatch, memo, SetStateAction, useCallback } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { FaPersonHiking } from "react-icons/fa6";

interface NavbarProps {
    openSearch: boolean;
    setOpenSearch: Dispatch<SetStateAction<boolean>>;
    setOpenPlaceCard: Dispatch<SetStateAction<boolean>>;
    openTrip: boolean;
    setOpenTrip: Dispatch<SetStateAction<boolean>>;
}

const Navbar = memo(function Navbar({
    openSearch,
    setOpenSearch,
    setOpenPlaceCard,
    openTrip,
    setOpenTrip,
}: NavbarProps) {
    const handleOpenMap = useCallback(() => {
        setOpenSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(false);
    }, [setOpenSearch, setOpenPlaceCard, setOpenTrip]);

    const handleOpenSearch = useCallback(() => {
        setOpenSearch(!openSearch);
        setOpenPlaceCard(false);
        setOpenTrip(false);
    }, [openSearch, setOpenPlaceCard, setOpenTrip, setOpenSearch]);

    const handleOpenTrip = useCallback(() => {
        setOpenSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(!openTrip);
    }, [openTrip, setOpenSearch, setOpenPlaceCard, setOpenTrip]);

    return (
        <div className="navbar md:grid bg-white dark:bg-second-black border-t-2 md:border-t-0 md:border-r-2 dark:border-second-gray font-mono z-[1999] transition">
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
});

export default Navbar;
