import {
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
    useCallback,
} from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { MdDirectionsBike } from "react-icons/md";
import { FaCar, FaWalking, FaInfoCircle } from "react-icons/fa";
import {
    IDatesMap,
    IDatesStorage,
    IPositions,
    IRouteSegments,
    ISortedDates,
} from "../../../../interfaces/trip/interface";

import PlaceCardForNavigation from "./placeCardForNavigation/PlaceCardForNavigation";
import RouteInfo from "./routeInfo/RouteInfo";

interface TripProps {
    positions: IPositions[];
    datesStorage: IDatesStorage;
    showRoute: boolean;
    setShowRoute: Dispatch<SetStateAction<boolean>>;
    routingControl: L.Routing.Control | null;
    setRoutingControl: Dispatch<SetStateAction<L.Routing.Control | null>>;
    transportMode: string;
    setTransportMode: Dispatch<SetStateAction<string>>;
    sortedDates: ISortedDates[];
    setSortedDates: Dispatch<SetStateAction<ISortedDates[]>>;
}

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
}: TripProps) {
    const [isRoute, setIsRoute] = useState<string | null>(null);
    const [routeSegments, setRouteSegments] = useState<IRouteSegments[]>([]);
    const [routeTime, setRouteTime] = useState<string[]>([]);
    const [routeDistance, setRouteDistance] = useState<string[]>([]);
    const [isNavigationDisabled, setIsNavigationDisabled] =
        useState<boolean>(false);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    useEffect(() => {
        const datesMap: IDatesMap = {};

        Object.keys(datesStorage).forEach((positionId) => {
            const dates = datesStorage[+positionId];

            dates.forEach((dateObj) => {
                if (dateObj.active) {
                    if (!datesMap[dateObj.date]) {
                        datesMap[dateObj.date] = [];
                    }

                    datesMap[dateObj.date].push(positions[+positionId]);
                }
            });
        });

        const sortedDatesArray = Object.keys(datesMap)
            .sort((a, b) => {
                const [dayA, monthA] = a.split("/").map(Number);
                const [dayB, monthB] = b.split("/").map(Number);
                return (
                    new Date(2024, monthA - 1, dayA).getTime() -
                    new Date(2024, monthB - 1, dayB).getTime()
                );
            })
            .map((date) => ({ date, places: datesMap[date] }));

        setSortedDates(sortedDatesArray);
    }, [datesStorage, positions, setSortedDates]);

    const handleNavigation = useCallback(
        async (places: IPositions[], date: string) => {
            setIsNavigationDisabled(true);
            setIsRoute(null);
            setRouteSegments([]);

            if (showRoute && routingControl) {
                routingControl.remove();
                setRoutingControl(null);
                setShowRoute(false);
                setIsNavigationDisabled(false);
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
                    extendToWaypoints: false,
                    missingRouteTolerance: 0,
                },
                // createMarker: () => null,
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
                const totalDistance = (
                    route.summary.totalDistance / 1000
                ).toFixed(2);
                const totalTime = (route.summary.totalTime / 3600).toFixed(2);

                let distanceInstructions = 0;
                let timeInstructions = 0;
                const resultDistanceInstructions = [];
                const resultTimeInstructions = [];

                setRouteTime([]);
                setRouteDistance([]);

                route.instructions.forEach(
                    (obj: { time: number; distance: number; type: string }) => {
                        timeInstructions += obj.time;
                        distanceInstructions += obj.distance;

                        if (obj.type === "WaypointReached") {
                            resultDistanceInstructions.push(
                                (distanceInstructions / 1000).toFixed(2),
                            );
                            resultTimeInstructions.push(
                                convertTime(timeInstructions),
                            );

                            distanceInstructions = 0;
                            timeInstructions = 0;
                        }
                    },
                );

                resultDistanceInstructions.push(
                    (distanceInstructions / 1000).toFixed(2),
                );
                resultTimeInstructions.push(convertTime(timeInstructions));

                setRouteTime(resultTimeInstructions);
                setRouteDistance(resultDistanceInstructions);
                setRouteSegments([
                    { distance: totalDistance, time: totalTime },
                ]);
                setShowRoute(true);
                setIsNavigationDisabled(false);
            });

            await newRoutingControl.addTo(window.map);

            setIsRoute(date);

            setRoutingControl(newRoutingControl);
            window.map.fitBounds(L.latLngBounds(waypoints));
        },
        [
            routingControl,
            setRoutingControl,
            showRoute,
            transportMode,
            setShowRoute,
        ],
    );

    const convertTime = (totalSeconds: number): string => {
        const totalMinutes = totalSeconds / 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return `${hours}.${minutes.toString().padStart(2, "0")}`;
    };

    const handleDragEnd = useCallback(
        (event: DragEndEvent, date: string, places: IPositions[]) => {
            const { active, over } = event;

            if (over && active.id !== over.id && routeSegments.length === 0) {
                const activeIndex = places.findIndex(
                    (place) => place.id === active.id,
                );
                const overIndex = places.findIndex(
                    (place) => place.id === over.id,
                );

                const newPlaces = [...places];
                const [removed] = newPlaces.splice(activeIndex, 1);
                newPlaces.splice(overIndex, 0, removed);

                const newSortedDates = sortedDates.map((sortedDate) =>
                    sortedDate.date === date
                        ? { date, places: newPlaces }
                        : sortedDate,
                );

                setSortedDates(newSortedDates);
            }
        },
        [setSortedDates, sortedDates, routeSegments],
    );

    return (
        <div className="trip absolute flex flex-col w-screen md:w-full h-full pt-6 px-3 bg-white dark:bg-second-black z-[1999] transition">
            <h1 className="mb-3 dark:text-white text-2xl sm:text-3xl font-bold">
                Trip Plan
            </h1>
            <div className="transport-modes grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                <button
                    type="button"
                    className={`btn-global ${
                        transportMode === "car" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("car")}
                >
                    <FaCar />
                </button>
                <button
                    type="button"
                    className={`btn-global ${
                        transportMode === "bike" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("bike")}
                >
                    <MdDirectionsBike />
                </button>
                <button
                    type="button"
                    className={`btn-global ${
                        transportMode === "walk" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("walk")}
                >
                    <FaWalking />
                </button>
            </div>
            <div className="cards-place grid justify-items-center overflow-x-hidden overflow-y-scroll">
                {sortedDates.length ? (
                    sortedDates.map(({ date, places }, index) => (
                        <div key={index}>
                            <DndContext
                                sensors={sensors}
                                onDragEnd={(e: DragEndEvent) =>
                                    handleDragEnd(e, date, places)
                                }
                                modifiers={[restrictToVerticalAxis]}
                                collisionDetection={closestCenter}
                            >
                                <h2 className="mb-2 dark:text-white text-xl font-semibold transition">
                                    {date}
                                </h2>
                                <SortableContext
                                    items={places}
                                    strategy={verticalListSortingStrategy}
                                >
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
                                                        routeDistance={
                                                            routeDistance
                                                        }
                                                        routeTime={routeTime}
                                                    />
                                                )}
                                        </div>
                                    ))}
                                </SortableContext>
                                <div className="btn-navigation flex mt-3">
                                    <button
                                        type="button"
                                        className="btn-global"
                                        onClick={() =>
                                            handleNavigation(places, date)
                                        }
                                        disabled={isNavigationDisabled}
                                    >
                                        Navigation
                                    </button>
                                    {isRoute === date && (
                                        <p className="msg-info_trip">
                                            <FaInfoCircle className="text-blue-800 text-2xl" />
                                            Route has been planned
                                        </p>
                                    )}
                                </div>
                            </DndContext>
                        </div>
                    ))
                ) : (
                    <div className="date-section mb-4">
                        <h1 className="mb-2 dark:text-white text-2xl font-semibold transition">
                            Add places for the trip
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}
