import { Dispatch, memo, SetStateAction, useCallback } from "react";
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

    const styleIsActiveMap =
        !openSearch && !openTrip ? "navbar__option--active" : "";
    const styleIsActiveSearch = openSearch ? "navbar__option--active" : "";
    const styleIsActiveTrip = openTrip ? "navbar__option--active" : "";

    return (
        <nav className="sidebar md:grid font-mono bg-white dark:bg-dark-mode-black border-t-2 border-b-2 md:border-t-0 md:border-b-0 md:border-r-2 dark:border-dark-mode-gray-2 z-[1999] transition">
            <ul className="flex justify-around md:flex-col md:justify-center">
                <li
                    className={`navbar__option ${styleIsActiveMap}`}
                    onClick={handleOpenMap}
                >
                    <FaMapMarkerAlt />
                    <div className="navbar__option--bg-gradient"></div>
                </li>
                <li
                    className={`navbar__option ${styleIsActiveSearch}`}
                    onClick={handleOpenSearch}
                >
                    <FaSearch />
                    <div className="navbar__option--bg-gradient"></div>
                </li>
                <li
                    className={`navbar__option ${styleIsActiveTrip}`}
                    onClick={handleOpenTrip}
                >
                    <FaPersonHiking />
                    <div className="navbar__option--bg-gradient"></div>
                </li>
            </ul>
        </nav>
    );
});

export default Navbar;
