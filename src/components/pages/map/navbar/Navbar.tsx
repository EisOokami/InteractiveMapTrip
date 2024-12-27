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
    setZoomLocationX: Dispatch<SetStateAction<number>>;
    setZoomLocationY: Dispatch<SetStateAction<number>>;
}

const Navbar = memo(function Navbar({
    openSearch,
    setOpenSearch,
    setOpenPlaceCard,
    openTrip,
    setOpenTrip,
    setZoomLocationX,
    setZoomLocationY,
}: NavbarProps) {
    const handleOpenMap = useCallback(() => {
        setOpenSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(false);
        setZoomLocationX(52.083);
        setZoomLocationY(19.375);
    }, [
        setOpenSearch,
        setOpenPlaceCard,
        setOpenTrip,
        setZoomLocationX,
        setZoomLocationY,
    ]);

    const handleOpenSearch = useCallback(() => {
        setOpenSearch(!openSearch);
        setOpenPlaceCard(false);
        setOpenTrip(false);
        setZoomLocationX(52.083);
        setZoomLocationY(19.375);
    }, [
        openSearch,
        setOpenPlaceCard,
        setOpenTrip,
        setOpenSearch,
        setZoomLocationX,
        setZoomLocationY,
    ]);

    const handleOpenTrip = useCallback(() => {
        setOpenSearch(false);
        setOpenPlaceCard(false);
        setOpenTrip(!openTrip);
        setZoomLocationX(52.083);
        setZoomLocationY(19.375);
    }, [
        openTrip,
        setOpenSearch,
        setOpenPlaceCard,
        setOpenTrip,
        setZoomLocationX,
        setZoomLocationY,
    ]);

    return (
        <div className="navbar md:grid bg-white dark:bg-dark-mode-black border-t-2 md:border-t-0 md:border-r-2 dark:border-dark-mode-gray-2 font-mono z-[1999] transition">
            <ul className="flex justify-around md:flex-col md:justify-center">
                <motion.li
                    className={`navbar__option ${!openSearch && !openTrip ? "navbar__option--active" : ""}`}
                    onClick={handleOpenMap}
                >
                    <FaMapMarkerAlt />
                    <div className="navbar__option--bg-gradient"></div>
                </motion.li>
                <li
                    className={`navbar__option ${openSearch ? "navbar__option--active" : ""}`}
                    onClick={handleOpenSearch}
                >
                    <FaSearch />
                    <div className="navbar__option--bg-gradient"></div>
                </li>
                <li
                    className={`navbar__option ${openTrip ? "navbar__option--active" : ""}`}
                    onClick={handleOpenTrip}
                >
                    <FaPersonHiking />
                    <div className="navbar__option--bg-gradient"></div>
                </li>
            </ul>
        </div>
    );
});

export default Navbar;
