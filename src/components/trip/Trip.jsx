import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdDirectionsBike, MdError } from "react-icons/md";
import {
    FaCar,
    FaWalking,
    FaInfoCircle,
    FaLongArrowAltDown,
} from "react-icons/fa";
import L from "leaflet";
import "leaflet-routing-machine";

const animationVariants = {
    whileHover: {
        scale: 1.1,
        transition: { duration: 0.1 },
    },
    whileTap: {
        scale: 0.85,
        transition: { duration: 0.1 },
    },
};

export default function Trip({
    positions,
    datesStorage,
    showRoute,
    setShowRoute,
    routingControl,
    setRoutingControl,
    transportMode,
    setTransportMode,
    sortedDates,
    setSortedDates,
    routeBlocked,
    setRouteBlocked,
}) {
    const [isRoute, setIsRoute] = useState(null);
    const [routeSegments, setRouteSegments] = useState([]);
    const [routeTime, setRouteTime] = useState([]);
    const [routeDistance, setRouteDistance] = useState([]);

    useEffect(() => {
        const datesMap = {};

        Object.keys(datesStorage).forEach((positionId) => {
            const dates = datesStorage[positionId];
            dates.forEach((dateObj) => {
                if (dateObj.active) {
                    if (!datesMap[dateObj.date]) {
                        datesMap[dateObj.date] = [];
                    }

                    datesMap[dateObj.date].push(positions[positionId]);
                }
            });
        });

        const sortedDatesArray = Object.keys(datesMap)
            .sort((a, b) => {
                const [dayA, monthA] = a.split("/").map(Number);
                const [dayB, monthB] = b.split("/").map(Number);
                return (
                    new Date(2024, monthA - 1, dayA) -
                    new Date(2024, monthB - 1, dayB)
                );
            })
            .map((date) => ({ date, places: datesMap[date] }));

        setSortedDates(sortedDatesArray);
    }, [datesStorage, positions, setSortedDates]);

    const handleNavigation = async (places, date) => {
        setIsRoute(null);
        setRouteSegments([]);
        setRouteBlocked(false);

        if (showRoute && routingControl) {
            routingControl.remove();
            setRoutingControl(null);
            setShowRoute(false);
            return;
        }

        if (places.length < 2) return;

        const waypoints = places.map((place) => L.latLng(place.x, place.y));
        const profile =
            transportMode === "car"
                ? "driving"
                : transportMode === "bike"
                  ? "cycling"
                  : "walking";

        const newRoutingControl = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: "#6FA1EC", weight: 4 }],
            },
            createMarker: () => null,
            routeWhileDragging: false,
            addWaypoints: false,
            router: L.Routing.mapbox(
                "pk.eyJ1IjoicGFwb2I2NTE2MyIsImEiOiJjbHdvc2ZjeXowNmEzMmxwMXl2bWp0bG9lIn0.rjsesOn8yBOT8uQN4wYI8w",
                {
                    profile: `mapbox/${profile}`,
                },
            ),
        });

        newRoutingControl.on("routesfound", (e) => {
            const route = e.routes[0];
            const totalDistance = (route.summary.totalDistance / 1000).toFixed(
                2,
            );
            const totalTime = (route.summary.totalTime / 3600).toFixed(2);
            const currentTime =
                new Date().getHours() + Number("0." + new Date().getMinutes());

            if (parseFloat(totalTime) + currentTime > 24) {
                setRouteBlocked(true);
                newRoutingControl.remove();
                setRoutingControl(null);
                setShowRoute(false);
                return false;
            }

            let distanceInstructions = 0;
            let timeInstructions = 0;
            let resultDistanceInstructions = [];
            let resultTimeInstructions = [];

            setRouteTime([]);
            setRouteDistance([]);

            route.instructions.forEach((obj) => {
                timeInstructions += obj.time;
                distanceInstructions += obj.distance;

                if (obj.type === "WaypointReached") {
                    resultDistanceInstructions.push(
                        (distanceInstructions / 1000).toFixed(2),
                    );
                    resultTimeInstructions.push(convertTime(timeInstructions));

                    distanceInstructions = 0;
                    timeInstructions = 0;
                }
            });

            resultDistanceInstructions.push(
                (distanceInstructions / 1000).toFixed(2),
            );
            resultTimeInstructions.push(convertTime(timeInstructions));

            setRouteTime(resultTimeInstructions);
            setRouteDistance(resultDistanceInstructions);
            setRouteSegments([{ distance: totalDistance, time: totalTime }]);
            setShowRoute(true);
        });

        if (!routeBlocked) {
            await newRoutingControl.addTo(window.map);
        }

        setIsRoute(date);

        setRoutingControl(newRoutingControl);
        window.map.fitBounds(L.latLngBounds(waypoints));
    };

    const convertTime = (totalSeconds) => {
        const totalMinutes = totalSeconds / 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return `${hours}.${minutes.toString().padStart(2, "0")}`;
    };

    return (
        <div className="trip absolute flex flex-col w-screen md:w-full h-full pt-6 px-3 bg-white dark:bg-second-black z-[1999] transition-colors duration-700">
            <h1 className="mb-3 dark:text-white text-2xl sm:text-3xl font-bold">
                Trip Plan
            </h1>
            <div className="transport-modes grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                <motion.button
                    type="button"
                    className={`btn-global ${
                        transportMode === "car" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("car")}
                    variants={animationVariants}
                    whileTap="whileTap"
                >
                    <FaCar />
                </motion.button>
                <motion.button
                    type="button"
                    className={`btn-global ${
                        transportMode === "bike" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("bike")}
                    variants={animationVariants}
                    whileTap="whileTap"
                >
                    <MdDirectionsBike />
                </motion.button>
                <motion.button
                    type="button"
                    className={`btn-global ${
                        transportMode === "walk" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("walk")}
                    variants={animationVariants}
                    whileTap="whileTap"
                >
                    <FaWalking />
                </motion.button>
            </div>
            <div className="cards-place grid justify-items-center overflow-x-hidden overflow-y-scroll">
                {sortedDates.length ? (
                    sortedDates.map(({ date, places }, index) => (
                        <div key={index}>
                            <h2 className="mb-2 dark:text-white text-xl font-semibold transition-colors duration-700">
                                {date}
                            </h2>
                            {places.map((place, index) => (
                                <div key={index}>
                                    <PlaceCardForNavigation
                                        place={place}
                                        convertTime={convertTime}
                                    />
                                    {routeSegments.length > 0 &&
                                        index !== places.length - 1 && (
                                            <RouteInfo
                                                index={index}
                                                routeDistance={routeDistance}
                                                routeTime={routeTime}
                                            />
                                        )}
                                </div>
                            ))}
                            <div className="btn-navigation flex mt-3">
                                <motion.button
                                    type="button"
                                    className="btn-global"
                                    onClick={() =>
                                        handleNavigation(places, date)
                                    }
                                    disabled={routeBlocked}
                                    variants={animationVariants}
                                    whileTap="whileTap"
                                >
                                    Navigation
                                </motion.button>
                                {routeBlocked ? (
                                    <p className="msg-info_trip">
                                        <MdError className="text-red-500 text-2xl" />
                                        Route exceeds the 24-hour time limit
                                    </p>
                                ) : null}
                                {isRoute === date && !routeBlocked ? (
                                    <p className="msg-info_trip">
                                        <FaInfoCircle className="text-blue-800 text-2xl" />
                                        Route has been planned
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="date-section mb-4">
                        <h1 className="mb-2 dark:text-white text-2xl font-semibold transition-colors duration-700">
                            Add places for the trip
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}

function PlaceCardForNavigation({ place, convertTime }) {
    return (
        <div className="place-card_trip">
            <img
                src={place.img}
                alt={place.name}
                className="w-full h-36 object-cover rounded-t-lg"
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h3 className="place-card-paragraph_trip">{place.name}</h3>
                <p className="place-card-paragraph_trip italic">
                    {place.location}
                </p>
                <p className="place-card-paragraph_trip">
                    Category: {place.category}
                </p>
                <p className="place-card-paragraph_trip">
                    Time spent: ≈{convertTime(place.time)} hours
                </p>
            </div>
        </div>
    );
}

function RouteInfo({ index, routeDistance, routeTime }) {
    return (
        <div className="route-info">
            <ul>
                <li key={index + 1200} className="mb-2">
                    {routeDistance.map((distance, indexDistance) => {
                        if (indexDistance === index) {
                            return (
                                <div
                                    key={indexDistance}
                                    className="grid place-items-center"
                                >
                                    <FaLongArrowAltDown className="route-info-icon_trip" />
                                    <p className="route-info-paragraph_trip">
                                        Total distance: {distance} km
                                    </p>
                                </div>
                            );
                        }
                    })}
                    {routeTime.map((time, indexTime) => {
                        if (indexTime === index) {
                            return (
                                <div
                                    key={indexTime}
                                    className="grid place-items-center"
                                >
                                    <p className="route-info-paragraph_trip">
                                        Total time: {time} hours
                                    </p>
                                    <FaLongArrowAltDown className="route-info-icon_trip" />
                                </div>
                            );
                        }
                    })}
                </li>
            </ul>
        </div>
    );
}
