import { MdDirectionsBike } from "react-icons/md";
import { FaCar, FaWalking, FaInfoCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./Trip.scss"
import L from "leaflet";
import "leaflet-routing-machine";

/* eslint-disable no-unused-vars */
export default function Trip({ positions, datesStorage, setOpenTrip, showRoute, setShowRoute, routingControl, setRoutingControl }) {
    const [sortedDates, setSortedDates] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [isRoute, setIsRoute] = useState(null);
    const [transportMode, setTransportMode] = useState('car');
    /* eslint-enable no-unused-vars */ 

    useEffect(() => {
        const datesMap = {};
        
        Object.keys(datesStorage).forEach(positionId => {
            const dates = datesStorage[positionId];
            dates.forEach(dateObj => {
                if (dateObj.active) {
                    if (!datesMap[dateObj.date]) {
                        datesMap[dateObj.date] = [];
                    }
                    datesMap[dateObj.date].push(positions[positionId]);
                }
            });
        });

        const sortedDatesArray = Object.keys(datesMap).sort((a, b) => {
            const [dayA, monthA] = a.split('/').map(Number);
            const [dayB, monthB] = b.split('/').map(Number);
            return new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB);
        }).map(date => ({ date, places: datesMap[date] }));

        setSortedDates(sortedDatesArray);
    }, [datesStorage, positions]);

    const handleNavigation = (places, date) => {
        setIsRoute(null);

        if (showRoute && routingControl) {
            routingControl.remove();
            setRoutingControl(null);
            setRouteInfo(null);
            setShowRoute(false);
            return;
        }
        
        if (places.length < 2) return;

        const waypoints = places.map(place => L.latLng(place.x, place.y));
        
        const profile = transportMode === 'car' ? 'driving' : (transportMode === 'bike' ? 'cycling' : 'walking');

        const newRoutingControl = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: "#6FA1EC", weight: 4 }]
            },
            createMarker: () => null,
            routeWhileDragging: false,
            addWaypoints: false,
            router: L.Routing.mapbox('pk.eyJ1IjoicGFwb2I2NTE2MyIsImEiOiJjbHdvc2ZjeXowNmEzMmxwMXl2bWp0bG9lIn0.rjsesOn8yBOT8uQN4wYI8w', {
                profile: `mapbox/${profile}`
            })
        }).on('routesfound', (e) => {
            const route = e.routes[0];
            const summary = route.summary;
            const distance = (summary.totalDistance / 1000).toFixed(2);
            const time = (summary.totalTime / 3600).toFixed(2);
            setRouteInfo({ distance, time });
            setShowRoute(true); 
        }).addTo(window.map);

        setIsRoute(date);

        setRoutingControl(newRoutingControl);
        window.map.fitBounds(L.latLngBounds(waypoints));
    };

    // useEffect(() => {
    //     const isAnyDateActive = Object.values(datesStorage).some(dates => dates.some(date => date.active));
    //     if (!isAnyDateActive && routingControl) {
    //         routingControl.remove();
    //         setRoutingControl(null);
    //         setRouteInfo(null);
    //         setShowRoute(false);
    //     }
    // }, [datesStorage, routingControl, setShowRoute, setRoutingControl]);

    return (
        <div className="trip absolute shadow-2xl top-0 sm:top-[40px] md:top-[52px] lg:top-[60px] bottom-0 z-[1999] w-full sm:w-2/5 h-[110%] pt-8 sm:pt-0 bg-white transition-all ease-in">
            <div className="trip-info max-w-x p-4">
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">Trip Plan</h1>
                <div className="transport-modes grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                    <button
                        type="button"
                        className={transportMode === "car" ? "btn-global bg-blue-800" : "btn-global"}
                        onClick={() => setTransportMode("car")}
                    >
                        <FaCar />Samochody
                    </button>
                    <button
                        type="button"
                        className={transportMode === "bike" ? "btn-global bg-blue-800" : "btn-global"}
                        onClick={() => setTransportMode("bike")}
                    >
                        <MdDirectionsBike />Rower
                    </button>
                    <button
                        type="button"
                        className={transportMode === "walk" ? "btn-global bg-blue-800" : "btn-global"}
                        onClick={() => setTransportMode("walk")}
                    >
                        <FaWalking />Pieszo
                    </button>
                </div>
                <div className="cards-place overflow-y-auto h-[calc(100vh-300px)] sm:h-[calc(100vh-26svh)] lg:h-[calc(100vh-27vh)]">
                    {
                        sortedDates.length ? sortedDates.map(({ date, places }) => (
                            <div key={date} className="date-section mb-4">
                                <h2 className="text-xl font-semibold mb-2">{date}</h2>
                                <div className="places-list grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {places.map(place => (
                                        <div key={place.id} className="place-item p-3 border border-gray-300 rounded-lg">
                                            <img src={place.img} alt={place.name} className="w-full h-32 object-cover mb-2 rounded-md"/>
                                            <h3 className="text-lg font-medium">{place.name}</h3>
                                            <p className="text-sm italic text-gray-600">{place.location}</p>
                                            <p className="text-sm text-gray-600">Category: {place.category}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="btn-navigation mt-3">
                                    <button
                                        type="button"
                                        className="btn-global"
                                        onClick={() => handleNavigation(places, date)}
                                    >
                                        Nawigacja
                                    </button>
                                    {
                                    isRoute === date 
                                    ? (
                                        <p className="flex items-center gap-1 text-lg font-bold"><FaInfoCircle className=" text-blue-800" />Trasa została zaplanowana</p>
                                    ) 
                                    : null}
                                </div>
                            </div>
                        ))
                        : (
                            <div className="date-section mb-4">
                                <h1 className="text-2xl font-semibold mb-2">Dodaj miejsca dla wycieczki</h1>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
