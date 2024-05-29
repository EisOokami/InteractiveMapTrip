import { FaCity, FaPlusCircle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { useEffect, useState } from "react";
import "./PlaceCard.scss";

export default function PlaceCard({ positions, selectedPosition, setOpenPlaceCard, datesStorage, updateDatesStorage, setRouteBlocked }) {
    const todayDate = new Date();
    const formattedTodayDate = `${todayDate.getDate() < 10 ? "0" + todayDate.getDate() : todayDate.getDate()}/${(todayDate.getMonth() + 1) < 10 ? "0" + (todayDate.getMonth() + 1) : (todayDate.getMonth() + 1)}`;
    const positionId = selectedPosition - 1;

    const [dates, setDates] = useState(datesStorage[positionId] || []);

    useEffect(() => {
        if (!dates.some(dateObj => dateObj.date === formattedTodayDate)) {
            const newDates = [...dates, { id: dates.length + 1, date: formattedTodayDate, active: false }];

            setDates(newDates);
            updateDatesStorage(positionId, newDates);
        }
    }, [formattedTodayDate, dates, positionId, updateDatesStorage]);

    const handleDateStorage = () => {
        const nextDay = new Date(todayDate);
        nextDay.setDate(todayDate.getDate() + dates.length);
        const formattedNextDay = `${nextDay.getDate() < 10 ? "0" + nextDay.getDate() : nextDay.getDate()}/${(nextDay.getMonth() + 1) < 10 ? "0" + (nextDay.getMonth() + 1) : (nextDay.getMonth() + 1)}`;

        const newDates = [...dates, { id: dates.length + 1, date: formattedNextDay, active: false }];

        setDates(newDates);
        updateDatesStorage(positionId, newDates);
    };

    const handleActivateDate = (id) => {
        const updatedDates = dates.map(dateObj => {
            if (dateObj.id === id) {
                return { ...dateObj, active: !dateObj.active };
            }
            return dateObj;
        });
        
        setDates(updatedDates);
        updateDatesStorage(positionId, updatedDates);
        setRouteBlocked(false);
    };

    useEffect(() => {
        const isAnyDateActive = dates.some(dateObj => dateObj.active);
        if (!isAnyDateActive && window.map && window.map.removeRoute) {
            window.map.removeRoute();
        }
    }, [dates]);

    return (
        <div className="place-card absolute top-[10px] sm:top-[40px] md:top-[52px] lg:top-[60px] bottom-0 z-[1999] w-full sm:w-2/5 h-[110%] pt-10 sm:pt-0 bg-white transition-all ease-in shadow-2xl">
            <div className="place-card-scroll h-[calc(100vh-60px)] sm:h-[calc(100vh-50px)] md:h-[calc(100vh-60px)] overflow-y-auto">
                <div 
                    className="btn-back absolute flex justify-center items-center rounded-full bg-bright-blue z-[3000] top-12 sm:top-2 left-2 w-[35px] h-[35px] hover:bg-blue-700" 
                    onClick={() => setOpenPlaceCard(false)}
                >
                    <IoArrowBack className="w-[30px] h-[30px] text-white" />
                </div>
                <div className="place-info max-w-x">
                    <img className="w-full h-1/2" src={positions[positionId].img} alt="" />
                    <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-3 px-4">{positions[positionId].name}</h1>
                    <p className="flex items-center gap-1 md:text-lg pt-1 px-4 mb-2"><BiSolidCategory className="rounded-md bg-bright-blue text-white w-7 h-7 p-1" />Kategoria: {positions[positionId].category}</p>
                    <p className="flex items-center gap-1 md:text-lg px-4 pb-4"><FaCity className="rounded-md bg-bright-blue text-white w-7 h-7 p-1" />Miasto/Wioska: {positions[positionId].location}</p>
                </div>
                <div className="date-trip grid grid-cols-5 gap-2 my-3 px-4">
                    {dates.map((elem) => (
                        <div 
                            key={elem.id} 
                            className={elem.active ? "date-box bg-blue-900" : "date-box"} 
                            onClick={() => handleActivateDate(elem.id)}
                        >
                            {elem.date}
                        </div>
                    ))}
                    <div className="date-box" onClick={handleDateStorage}>
                        <FaPlusCircle className="w-10/12 h-1/2" />
                    </div>
                </div>
            </div>
        </div>
    );
}