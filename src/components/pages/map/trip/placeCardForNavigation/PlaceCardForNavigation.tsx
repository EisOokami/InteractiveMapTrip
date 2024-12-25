import { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IPositions } from "../../../../../interfaces/trip/interface";

interface PlaceCardForNavigationProps {
    place: IPositions;
    convertTime: (totalSeconds: number) => string;
}

export default function PlaceCardForNavigation({
    place,
    convertTime,
}: PlaceCardForNavigationProps) {
    const id = place.id;
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useSortable({
            id,
        });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        position: isDragging ? "relative" : "inherit",
        zIndex: isDragging ? 1000 : 0,
        cursor: isDragging ? "grabbing" : "grab",
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
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
        </div>
    );
}
