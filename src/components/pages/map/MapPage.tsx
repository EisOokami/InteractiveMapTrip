import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { fetchPositions } from "../../../services/firebaseDatabase";
import {
    IDates,
    IDatesStorage,
    IPositions,
    ISortedDates,
} from "../../../interfaces/interface";

import LoadingNavbar from "../../ui/loadings/loadingNavbar/LoadingNavbar";
import LoadingSearch from "../../ui/loadings/loadingSearch/LoadingSearch";
import LoadingPlaceCard from "../../ui/loadings/loadingPlaceCard/LoadingPlaceCard";
import LoadingTrip from "../../ui/loadings/loadingTrip/LoadingTrip";
import LoadingMap from "../../ui/loadings/loadingMap/LoadingMap";
import LoadingDarkModeBtn from "../../ui/loadings/loadingDarkModeBtn/LoadingDarkModeBtn";
const Map = lazy(() => import("./map/Map"));
const Navbar = lazy(() => import("./navbar/Navbar"));
const Search = lazy(() => import("./search/Search"));
const PlaceCard = lazy(() => import("./placeCard/PlaceCard"));
const Trip = lazy(() => import("./trip/Trip"));
const DarkModeBtn = lazy(() => import("../../ui/darkModeBtn/DarkModeBtn"));

const animationSettings = {
    initial: {
        width: 0,
    },
    animate: {
        width: 385,
        transition: {
            duration: 0.5,
            delay: 0.5,
        },
    },
    exit: {
        width: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function MapPage() {
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openTrip, setOpenTrip] = useState<boolean>(false);
    const [openPlaceCard, setOpenPlaceCard] = useState<boolean>(false);
    const [zoomLocationX, setZoomLocationX] = useState<number>(52.083);
    const [zoomLocationY, setZoomLocationY] = useState<number>(19.375);
    const [selectedPosition, setSelectedPosition] = useState<number | null>(
        null,
    );
    const [datesStorage, setDatesStorage] = useState<IDatesStorage>({});
    const [showRoute, setShowRoute] = useState<boolean>(false);
    const [transportMode, setTransportMode] = useState<string>("car");
    const [routingControl, setRoutingControl] =
        useState<L.Routing.Control | null>(null);
    const [sortedDates, setSortedDates] = useState<ISortedDates[]>([]);
    const [dates, setDates] = useState<IDates[]>([]);
    const [positions, setPositions] = useState<IPositions[]>([]);
    const [isPositionLoading, setIsPositionLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchPositions(setPositions, setIsPositionLoading);
    }, []);

    const updateDatesStorage = useCallback(
        (markerId: number, dates: IDates[]) => {
            setDatesStorage((prevState) => ({
                ...prevState,
                [markerId]: dates,
            }));
        },
        [],
    );

    if (isPositionLoading) {
        return (
            <div className="flex flex-col justify-center items-center w-screen h-screen">
                <div className="grid justify-items-center gap-5">
                    <h3 className="text-4xl">Loading...</h3>
                    <h3 className="text-2xl">
                        Fetching positions from the database
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="app flex flex-col h-svh">
            <div className="flex-grow flex">
                <div className="hidden md:flex">
                    <Suspense fallback={<LoadingNavbar />}>
                        <Navbar
                            openSearch={openSearch}
                            setOpenSearch={setOpenSearch}
                            setOpenPlaceCard={setOpenPlaceCard}
                            openTrip={openTrip}
                            setOpenTrip={setOpenTrip}
                            setZoomLocationX={setZoomLocationX}
                            setZoomLocationY={setZoomLocationY}
                        />
                    </Suspense>
                </div>
                <AnimatePresence>
                    {openSearch && (
                        <motion.div
                            key="search"
                            className="search-container relative h-full md:h-screen z-[1001] md:z-0"
                            variants={animationSettings}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Suspense fallback={<LoadingSearch />}>
                                <Search
                                    positions={positions}
                                    setZoomLocationX={setZoomLocationX}
                                    setZoomLocationY={setZoomLocationY}
                                    setSelectedPosition={setSelectedPosition}
                                    setOpenPlaceCard={setOpenPlaceCard}
                                />
                            </Suspense>
                            {openPlaceCard && (
                                <Suspense fallback={<LoadingPlaceCard />}>
                                    <PlaceCard
                                        positions={positions}
                                        selectedPosition={selectedPosition}
                                        setOpenPlaceCard={setOpenPlaceCard}
                                        datesStorage={datesStorage}
                                        updateDatesStorage={updateDatesStorage}
                                        dates={dates}
                                        setDates={setDates}
                                        setZoomLocationX={setZoomLocationX}
                                        setZoomLocationY={setZoomLocationY}
                                    />
                                </Suspense>
                            )}
                        </motion.div>
                    )}
                    {openTrip && (
                        <motion.div
                            key="trip"
                            className="trip-container relative h-full md:h-screen z-[1001] md:z-0"
                            variants={animationSettings}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Suspense fallback={<LoadingTrip />}>
                                <Trip
                                    positions={positions}
                                    datesStorage={datesStorage}
                                    showRoute={showRoute}
                                    setShowRoute={setShowRoute}
                                    routingControl={routingControl}
                                    setRoutingControl={setRoutingControl}
                                    transportMode={transportMode}
                                    setTransportMode={setTransportMode}
                                    sortedDates={sortedDates}
                                    setSortedDates={setSortedDates}
                                />
                            </Suspense>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="md:relative flex-grow h-full">
                    <Suspense fallback={<LoadingMap />}>
                        <Map
                            setOpenSearch={setOpenSearch}
                            positions={positions}
                            zoomLocationX={zoomLocationX}
                            zoomLocationY={zoomLocationY}
                            setZoomLocationX={setZoomLocationX}
                            setZoomLocationY={setZoomLocationY}
                            setSelectedPosition={setSelectedPosition}
                            setOpenPlaceCard={setOpenPlaceCard}
                            setOpenTrip={setOpenTrip}
                        />
                    </Suspense>
                    <Suspense fallback={<LoadingDarkModeBtn />}>
                        <DarkModeBtn />
                    </Suspense>
                </div>
            </div>
            <div className="md:hidden">
                <Suspense fallback={<LoadingNavbar />}>
                    <Navbar
                        openSearch={openSearch}
                        setOpenSearch={setOpenSearch}
                        setOpenPlaceCard={setOpenPlaceCard}
                        openTrip={openTrip}
                        setOpenTrip={setOpenTrip}
                        setZoomLocationX={setZoomLocationX}
                        setZoomLocationY={setZoomLocationY}
                    />
                </Suspense>
            </div>
        </div>
    );
}
