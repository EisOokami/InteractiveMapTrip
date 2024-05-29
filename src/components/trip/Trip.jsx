import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdDirectionsBike, MdError } from "react-icons/md";
import { FaCar, FaWalking, FaInfoCircle, FaLongArrowAltDown } from "react-icons/fa";
import L from "leaflet";
import "leaflet-routing-machine";
import "./Trip.scss";

/* eslint-disable no-unused-vars */
export default function Trip({ positions, datesStorage, showRoute, setShowRoute, routingControl, setRoutingControl, transportMode, setTransportMode, updateDatesStorage, sortedDates, setSortedDates, showRouteNavigation, setShowRouteNavigation, routeBlocked, setRouteBlocked }) {
    const [routeInfo, setRouteInfo] = useState(null);
    const [isRoute, setIsRoute] = useState(null);
    const [positionPlace, setPositionPlace] = useState([]);
    const [routeSegments, setRouteSegments] = useState([]);
    const [routeTime, setRouteTime] = useState([]);
    const [routeDistance, setRouteDistance] = useState([]);
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
    }, [datesStorage, positions, setSortedDates]);

    const handleNavigation = async (places, date) => {
        setIsRoute(null);
        setRouteSegments([]);
        setRouteBlocked(false);

        if (showRoute && routingControl) {
            routingControl.remove();
            setRoutingControl(null);
            setRouteInfo(null);
            setShowRoute(false);
            setShowRouteNavigation(false);
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
        });

        newRoutingControl.on('routesfound', (e) => {
            const route = e.routes[0];
            const totalDistance = (route.summary.totalDistance / 1000).toFixed(2);
            const totalTime = (route.summary.totalTime / 3600).toFixed(2);
            const currentTime = new Date().getHours() + Number("0."+new Date().getMinutes());

            if (parseFloat(totalTime) + currentTime > 24) {
                setRouteBlocked(true);
                newRoutingControl.remove();
                setRoutingControl(null);
                setRouteInfo(null);
                setShowRoute(false);
                setShowRouteNavigation(false);
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
                    resultDistanceInstructions.push((distanceInstructions / 1000).toFixed(2));
                    resultTimeInstructions.push(convertTime(timeInstructions));

                    distanceInstructions = 0;
                    timeInstructions = 0;
                }
            });
            
            resultDistanceInstructions.push((distanceInstructions / 1000).toFixed(2));
            resultTimeInstructions.push(convertTime(timeInstructions));
            
            setRouteTime(resultTimeInstructions);
            setRouteDistance(resultDistanceInstructions);
            setRouteSegments([{ distance: totalDistance, time: totalTime }]);
            setShowRoute(true);
        });

        if (!routeBlocked) {
            await newRoutingControl.addTo(window.map);
        }

        setShowRouteNavigation(true);
        setIsRoute(date);
    
        setRoutingControl(newRoutingControl);
        window.map.fitBounds(L.latLngBounds(waypoints));
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(positionPlace);
        const [reorderedItem] = items[1].splice(result.source.index, 1);
        items[1].splice(result.destination.index, 0, reorderedItem);

        setPositionPlace(items[1]);
        updateDatesStorage(items[0], items[1]);
    };

    const convertTime = (totalSeconds) => {
        const totalMinutes = totalSeconds / 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return `${hours}.${minutes.toString().padStart(2, '0')}`;
    };

    return (
        <div className="trip absolute shadow-2xl top-0 sm:top-[40px] md:top-[52px] lg:top-[60px] bottom-0 z-[1999] w-full sm:w-2/5 pt-8 sm:pt-0 bg-white transition-all ease-in">
            <div className="trip-info max-w-x p-4 pb-0">
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
                            <DragDropContext key={date} onDragEnd={handleOnDragEnd} className="date-section mb-4">
                                <h2 className="text-xl font-semibold mb-2">{date}</h2>
                                <Droppable droppableId="place-item">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            onMouseDown={() => setPositionPlace([date, places])}
                                        >
                                            {places.map((place, index) => (
                                                <Draggable 
                                                    key={place.id} 
                                                    draggableId={String(place.id)}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <>
                                                            <div
                                                                className="mb-2 p-3 md:flex md:flex-row md:items-center w-full bg-white border hover:bg-gray-100 border-gray-300 rounded-lg"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                >
                                                                <img src={place.img} alt={place.name} className="w-full h-32 md:w-1/3 md:h-44 object-cover mb-2 rounded-md"/>
                                                                <div className="flex flex-col justify-between p-4 leading-normal">
                                                                    <h3 className="text-lg font-medium">{place.name}</h3>
                                                                    <p className="text-sm italic text-gray-600">{place.location}</p>
                                                                    <p className="text-sm text-gray-600">Kategoria: {place.category}</p>
                                                                    <p className="text-sm text-gray-600">Czas spędzania: ≈{convertTime(place.time)} godzin</p>
                                                                </div>
                                                            </div>
                                                            {
                                                                routeSegments.length > 0 && index !== places.length-1 && (
                                                                    <div className="navigation-info">
                                                                        <ul>
                                                                            <li key={index+1200} className="mb-2">
                                                                                {
                                                                                    routeDistance.map((distance, indexDistance) => {
                                                                                        if (indexDistance === index) {
                                                                                            return (
                                                                                                <div key={indexDistance} className="grid place-items-center">
                                                                                                    <FaLongArrowAltDown className=" text-2xl"/>
                                                                                                    <p className="font-medium">Całkowity dystans: {distance} km</p>
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    })
                                                                                }
                                                                                {
                                                                                    routeTime.map((time, indexTime) => {
                                                                                        if (indexTime === index) {
                                                                                            return (
                                                                                                <div key={indexTime} className="grid place-items-center">
                                                                                                    <p className="font-medium">Czas całkowity: {time} godzin</p>
                                                                                                    <FaLongArrowAltDown className=" text-2xl"/>
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    })
                                                                                }                                
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                )
                                                            }
                                                        </>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                <div className="flex btn-navigation mt-3">
                                    <button
                                        type="button"
                                        className="btn-global"
                                        onClick={() => handleNavigation(places, date)}
                                        disabled={routeBlocked}
                                    >
                                        Nawigacja
                                    </button>
                                    {
                                        routeBlocked
                                        ? (
                                            <p className="flex items-center gap-1 text-lg font-bold"><MdError className="text-red-500 text-2xl" />Trasa przekracza limit czasu 24 godzin</p>
                                        )
                                        : null
                                    }
                                    {
                                        isRoute === date && !routeBlocked
                                        ? (
                                            <p className="flex items-center gap-1 text-lg font-bold"><FaInfoCircle className="text-blue-800 text-2xl" />Trasa została zaplanowana</p>
                                        ) 
                                        : null
                                    }
                                </div>
                            </DragDropContext>
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
