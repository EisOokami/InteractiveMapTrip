import { useState } from "react";
import Map from "./map/Map";
import Navbar from "./navbar/Navbar";
import Search from "./search/Search";
import PlaceCard from "./placeCard/PlaceCard";
import Trip from "./trip/Trip";

const positions = [
    {
        id: 1,
        name: "Sky Tower",
        img: "https://skytower.pl/cache/img/78/7889493635f4edb7c19d6c1b72047ca5.webp",
        x: 51.0945,
        y: 17.0197,
        location: "Wrocław",
        category: "Centrum handlowe"
    },
    {
        id: 2,
        name: "Antalya Kebab u Bogusi",
        img: "https://d-art.ppstatic.pl/kadry/k/r/1/22/1e/65c0e1f838515_o_full.jpg",
        x: 53.001,
        y: 17.000,
        location: "Opole",
        category: "Restauracja"
    },
    {
        id: 3,
        name: "Zagłębiowski Park Sportowy - ArcelorMittal Park",
        img: "https://lh5.googleusercontent.com/proxy/RfFucqcqYCBiq_-rsoPjGje67Cy9R1Zmtkkdp6dbq0ajWAjKj3iTu-T0dfSQGQvIpXwd39FVrJG14EcAFqKI7uG77jUezUOzodPpTDN8MUdHOH_BIzUthZ-4aN947xS6W0-BUGv8vxoDZdWoGu1WAN6BjOKoW1c-",
        x: 53.001,
        y: 22.000,
        location: "Sosnowiec",
        category: "Park"
    },
    {
        id: 4,
        name: "Camper & Camping Park",
        img: "https://cdn2.acsi.eu/6/5/7/e/657eb320d5a9c.jpg?impolicy=gallery-detail",
        x: 50.501,
        y: 18.000,
        location: "Gdańsk",
        category: "Park"
    },
    {
        id: 5,
        name: "Miejskie Centrum Sportu i Rekreacji w Płońsku",
        img: "https://ciechanow.cozadzien.pl/img/2020/04/30/_min/10e2c8dc13504108cd96a7ac5b14f8e2.jpg",
        x: 51.001,
        y: 20.000,
        location: "Płońsk",
        category: "Ośrodek zdrowia"
    },
    {
        id: 6,
        name: "Barlinecki Park Krajobrazowy",
        img: "https://www.zpkwz.pl/images/barlinecki_park_projekt.jpg",
        x: 52.001,
        y: 15.000,
        location: "Barlinek",
        category: "Park"
    },
    {
        id: 7,
        name: "Galeria Łódzka",
        img: "https://www.galeria-lodzka.pl/fileadmin/user_upload/TEST/Stage_images/GLL_photos/GL_STRONA_WWW_1920X1080_2.jpg",
        x: 54.301,
        y: 19.000,
        location: "Łódź",
        category: "Centrum handlowe"
    },
    {
        id: 8,
        name: "Zegrzyńskie Lake Beach",
        img: "https://inmasovianstyle.com/wp-content/uploads/2022/07/nieporet_2021_1-1170x680-1-1170x680.jpg",
        x: 53.001,
        y: 19.000,
        location: "Nieporęt",
        category: "Kompleks pływacki"
    },
];

export default function App() {
    const [modalSearch, setModalSearch] = useState(false);
    const [valueLocation, setValueLocation] = useState("");
    const [valueName, setValueName] = useState("");
    const [zoomLocationX, setZoomLocationX] = useState(52.083);
    const [zoomLocationY, setZoomLocationY] = useState(19.375);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [openPlaceCard, setOpenPlaceCard] = useState(false);
    const [datesStorage, setDatesStorage] = useState({});
    const [openTrip, setOpenTrip] = useState(false);
    const [showRoute, setShowRoute] = useState(false); 
    const [routingControl, setRoutingControl] = useState(null);

    const updateDatesStorage = (positionId, dates) => {
        setDatesStorage(prevState => ({
            ...prevState,
            [positionId]: dates
        }));
    };

    return (
        <div className="app">
            <Navbar
                modalSearch={modalSearch}
                setModalSearch={setModalSearch} 
                setOpenPlaceCard={setOpenPlaceCard}
                openTrip={openTrip}
                setOpenTrip={setOpenTrip}
            />
            <div className="sm:flex">
                <Search
                    modalSearch={modalSearch}
                    positions={positions}
                    valueLocation={valueLocation}
                    valueName={valueName}
                    setValueLocation={setValueLocation}
                    setValueName={setValueName}
                    setZoomLocationX={setZoomLocationX}
                    setZoomLocationY={setZoomLocationY}
                    selectedPosition={selectedPosition}
                    setSelectedPosition={setSelectedPosition}
                    openPlaceCard={openPlaceCard}
                    setOpenPlaceCard={setOpenPlaceCard}
                    datesStorage={datesStorage}
                    updateDatesStorage={updateDatesStorage}
                />
                {
                    openPlaceCard ? (
                        <PlaceCard
                            positions={positions}
                            selectedPosition={selectedPosition}
                            setOpenPlaceCard={setOpenPlaceCard}
                            datesStorage={datesStorage}
                            updateDatesStorage={updateDatesStorage}
                        />
                    )
                    : null
                }
                {
                    openTrip ? (
                        <Trip 
                            positions={positions}
                            datesStorage={datesStorage}
                            showRoute={showRoute}
                            setShowRoute={setShowRoute}
                            routingControl={routingControl}
                            setRoutingControl={setRoutingControl}
                        />
                    )
                    : null
                }
                <Map
                    setModalSearch={setModalSearch}
                    positions={positions}
                    zoomLocationX={zoomLocationX}
                    zoomLocationY={zoomLocationY}
                    setZoomLocationX={setZoomLocationX}
                    setZoomLocationY={setZoomLocationY}
                    setSelectedPosition={setSelectedPosition}
                    setOpenPlaceCard={setOpenPlaceCard}
                    setOpenTrip={setOpenTrip}
                />
            </div>
        </div>
    )
}