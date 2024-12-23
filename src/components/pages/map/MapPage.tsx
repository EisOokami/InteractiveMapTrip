import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { fetchPositions } from "../../../services/firebaseDatabase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../services/firebaseConfig";
import {
    IDates,
    IDatesStorage,
    IPositions,
    ISortedDates,
} from "../../../interfaces/interface";

import Map from "./map/Map";
import Navbar from "./navbar/Navbar";
import Search from "./search/Search";
import PlaceCard from "./placeCard/PlaceCard";
import Trip from "./trip/Trip";
import DarkModeBtn from "../../ui/darkModeBtn/DarkModeBtn";

const animationSettings = {
    initial: {
        width: 0,
    },
    animate: {
        width: 400,
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
    const [valueLocation, setValueLocation] = useState<string>("");
    const [valueName, setValueName] = useState<string>("");
    const [zoomLocationX, setZoomLocationX] = useState<number>(52.083);
    const [zoomLocationY, setZoomLocationY] = useState<number>(19.375);
    const [selectedPosition, setSelectedPosition] = useState<number | null>(
        null,
    );
    const [openPlaceCard, setOpenPlaceCard] = useState<boolean>(false);
    const [datesStorage, setDatesStorage] = useState<IDatesStorage>({});
    const [openTrip, setOpenTrip] = useState<boolean>(false);
    const [showRoute, setShowRoute] = useState<boolean>(false);
    const [transportMode, setTransportMode] = useState<string>("car");
    const [routingControl, setRoutingControl] =
        useState<L.Routing.Control | null>(null);
    const [sortedDates, setSortedDates] = useState<ISortedDates[]>([]);
    const [dates, setDates] = useState<IDates[]>([]);
    const [positions, setPositions] = useState<IPositions[]>([]);
    const [isPositionLoading, setIsPositionLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                signInAnonymously(auth)
                    .then(() => {
                        setIsAuthenticated(true);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPositions(setPositions, setIsPositionLoading);
        }
    }, [isAuthenticated]);

    const updateDatesStorage = (markerId: number, dates: IDates[]) => {
        setDatesStorage((prevState) => ({
            ...prevState,
            [markerId]: dates,
        }));
    };

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

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col justify-center items-center w-screen h-screen">
                <div className="grid justify-items-center gap-5">
                    <h3 className="text-4xl">Loading...</h3>
                    <h3 className="text-2xl">You are signing in as a Guest</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="app flex flex-col h-svh">
            <div className="flex-grow flex">
                <div className="hidden md:flex">
                    <Navbar
                        openSearch={openSearch}
                        setOpenSearch={setOpenSearch}
                        setOpenPlaceCard={setOpenPlaceCard}
                        openTrip={openTrip}
                        setOpenTrip={setOpenTrip}
                    />
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
                            <Search
                                positions={positions}
                                valueLocation={valueLocation}
                                valueName={valueName}
                                setValueLocation={setValueLocation}
                                setValueName={setValueName}
                                setZoomLocationX={setZoomLocationX}
                                setZoomLocationY={setZoomLocationY}
                                setSelectedPosition={setSelectedPosition}
                                setOpenPlaceCard={setOpenPlaceCard}
                            />
                            {openPlaceCard && (
                                <PlaceCard
                                    positions={positions}
                                    selectedPosition={selectedPosition}
                                    setOpenPlaceCard={setOpenPlaceCard}
                                    datesStorage={datesStorage}
                                    updateDatesStorage={updateDatesStorage}
                                    dates={dates}
                                    setDates={setDates}
                                />
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
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="md:relative flex-grow h-full">
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
                    <DarkModeBtn />
                </div>
            </div>
            <div className="md:hidden">
                <Navbar
                    openSearch={openSearch}
                    setOpenSearch={setOpenSearch}
                    setOpenPlaceCard={setOpenPlaceCard}
                    openTrip={openTrip}
                    setOpenTrip={setOpenTrip}
                />
            </div>
        </div>
    );
}
