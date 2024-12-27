import { FaLongArrowAltDown } from "react-icons/fa";

interface RouteInfoProps {
    index: number;
    routeDistance: string[];
    routeTime: string[];
}

export default function RouteInfo({
    index,
    routeDistance,
    routeTime,
}: RouteInfoProps) {
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
                                    <FaLongArrowAltDown className="trip__route-info--icon" />
                                    <p className="trip__route-info--paragraph">
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
                                    <p className="trip__route-info--paragraph">
                                        Total time: {time} hours
                                    </p>
                                    <FaLongArrowAltDown className="trip__route-info--icon" />
                                </div>
                            );
                        }
                    })}
                </li>
            </ul>
        </div>
    );
}
