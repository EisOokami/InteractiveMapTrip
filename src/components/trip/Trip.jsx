import { useState, useEffect } from "react";
import "./Trip.scss"
import L from "leaflet";
import "leaflet-routing-machine";

export default function Trip({ positions, datesStorage, showRoute, setShowRoute, routingControl, setRoutingControl }) {
    const [sortedDates, setSortedDates] = useState([]);
    /* eslint-disable no-unused-vars */
    const [routeInfo, setRouteInfo] = useState(null);
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

    const handleNavigation = (places) => {
        if (showRoute && routingControl) {
            routingControl.remove();
            setRoutingControl(null);
            setRouteInfo(null);
            setShowRoute(false);
            return;
        }
        
        if (places.length < 2) return;

        const waypoints = places.map(place => L.latLng(place.x, place.y));
        
        const newRoutingControl = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: "#6FA1EC", weight: 4 }]
            },
            createMarker: () => null,
            routeWhileDragging: false,
            addWaypoints: false
        }).on('routesfound', (e) => {
            const route = e.routes[0];
            const summary = route.summary;
            const distance = (summary.totalDistance / 1000).toFixed(2);
            const time = (summary.totalTime / 3600).toFixed(2);
            setRouteInfo({ distance, time });
            setShowRoute(true); 
        }).addTo(window.map);

        setRoutingControl(newRoutingControl);
        window.map.fitBounds(L.latLngBounds(waypoints));
    };

    useEffect(() => {
        const isAnyDateActive = Object.values(datesStorage).some(dates => dates.some(date => date.active));
        if (!isAnyDateActive && routingControl) {
            routingControl.remove();
            setRoutingControl(null);
            setRouteInfo(null);
            setShowRoute(false);
        }
    }, [datesStorage, routingControl, setShowRoute, setRoutingControl]);

    return (
        <div className="trip absolute shadow-2xl top-0 sm:top-[40px] md:top-[52px] lg:top-[60px] bottom-0 z-[1999] w-full sm:w-2/5 h-[110%] pt-8 sm:pt-0 bg-white transition-all ease-in">
            <div className="trip-info max-w-x p-4">
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">Trip Plan</h1>
                <div className="cards-place overflow-y-auto h-[87vh]">
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
                                        className="text-white bg-bright-blue hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                                        onClick={() => handleNavigation(places)}
                                    >
                                        Nawigacja
                                    </button>
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
