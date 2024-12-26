import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
} from "react";
import { FaCity, FaPlusCircle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import {
    IDates,
    IDatesStorage,
    IPositions,
} from "../../../../interfaces/placeCard/interface";

interface PlaceCardProps {
    positions: IPositions[];
    selectedPosition: number | null;
    setOpenPlaceCard: Dispatch<SetStateAction<boolean>>;
    datesStorage: IDatesStorage;
    updateDatesStorage: (markerId: number, dates: IDates[]) => void;
    dates: IDates[];
    setDates: Dispatch<SetStateAction<IDates[]>>;
    setZoomLocationX: Dispatch<SetStateAction<number>>;
    setZoomLocationY: Dispatch<SetStateAction<number>>;
}

export default function PlaceCard({
    positions,
    selectedPosition,
    setOpenPlaceCard,
    datesStorage,
    updateDatesStorage,
    dates,
    setDates,
    setZoomLocationX,
    setZoomLocationY,
}: PlaceCardProps) {
    const todayDate = useMemo(() => new Date(), []);
    const formattedTodayDate = `${todayDate.getDate() < 10 ? "0" + todayDate.getDate() : todayDate.getDate()}/${todayDate.getMonth() + 1 < 10 ? "0" + (todayDate.getMonth() + 1) : todayDate.getMonth() + 1}`;
    const positionId = selectedPosition !== null ? selectedPosition - 1 : 0;

    useEffect(() => {
        setDates(datesStorage[positionId] || []);
    }, [setDates, datesStorage, positionId]);

    useEffect(() => {
        if (!dates.some((dateObj) => dateObj.date === formattedTodayDate)) {
            const newDates = [
                ...dates,
                {
                    id: dates.length + 1,
                    date: formattedTodayDate,
                    active: false,
                },
            ];

            setDates(newDates);
            updateDatesStorage(positionId, newDates);
        }
    }, [setDates, formattedTodayDate, dates, positionId, updateDatesStorage]);

    const handleDateStorage = useCallback(() => {
        const nextDay = new Date(todayDate);
        nextDay.setDate(todayDate.getDate() + dates.length);
        const formattedNextDay = `${nextDay.getDate() < 10 ? "0" + nextDay.getDate() : nextDay.getDate()}/${nextDay.getMonth() + 1 < 10 ? "0" + (nextDay.getMonth() + 1) : nextDay.getMonth() + 1}`;

        const newDates = [
            ...dates,
            { id: dates.length + 1, date: formattedNextDay, active: false },
        ];

        setDates(newDates);
        updateDatesStorage(positionId, newDates);
    }, [dates, setDates, positionId, updateDatesStorage, todayDate]);

    const handleActivateDate = useCallback(
        (id: number) => {
            const updatedDates = dates.map((dateObj) => {
                if (dateObj.id === id) {
                    return { ...dateObj, active: !dateObj.active };
                }
                return dateObj;
            });

            setDates(updatedDates);
            updateDatesStorage(positionId, updatedDates);
        },
        [dates, setDates, positionId, updateDatesStorage],
    );

    useEffect(() => {
        const isAnyDateActive = dates.some((dateObj) => dateObj.active);
        if (!isAnyDateActive && window.map && window.map.removeRoute) {
            window.map.removeRoute();
        }
    }, [dates]);

    const handleOpenPlaceCard = useCallback(() => {
        setOpenPlaceCard(false);
        setZoomLocationX(52.083);
        setZoomLocationY(19.375);
    }, [setOpenPlaceCard, setZoomLocationX, setZoomLocationY]);

    return (
        <div className="place-card absolute -inset-y-10 w-screen md:w-96 h-[calc(100%+40px)] bg-white dark:bg-second-black overflow-y-hidden z-[1099] transition">
            <div className="place-card-scroll h-full overflow-y-auto">
                <div
                    className="btn-back_place-card"
                    onClick={handleOpenPlaceCard}
                >
                    <IoArrowBack className="w-[30px] h-[30px] text-white" />
                </div>
                <div className="place-info max-w-x">
                    <img
                        className="w-full h-1/2"
                        src={positions[positionId].img}
                        alt={positions[positionId].name}
                    />
                    <h1 className="mt-3 mb-3 px-4 dark:text-white text-2xl sm:text-3xl font-bold transition">
                        {positions[positionId].name}
                    </h1>
                    <p className="icon-paragraph_place-card mb-2 pt-1 px-4">
                        <BiSolidCategory className="icon_place-card" />
                        Category: {positions[positionId].category}
                    </p>
                    <p className="icon-paragraph_place-card px-4 pb-4">
                        <FaCity className="icon_place-card" />
                        City/Village: {positions[positionId].location}
                    </p>
                </div>
                <div className="date-trip grid grid-cols-5 gap-2 my-3 px-4">
                    {dates.map((elem) => (
                        <div
                            key={elem.id}
                            className={`date-box_place-card ${
                                elem.active ? "bg-blue-900" : ""
                            }`}
                            onClick={() => handleActivateDate(elem.id)}
                        >
                            {elem.date}
                        </div>
                    ))}
                    <div
                        className="date-box_place-card"
                        onClick={handleDateStorage}
                    >
                        <FaPlusCircle className="w-10/12 h-1/2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
