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
        category: "Centrum handlowe",
        time: 3600
    },
    {
        id: 2,
        name: "Antalya Kebab u Bogusi",
        img: "https://d-art.ppstatic.pl/kadry/k/r/1/22/1e/65c0e1f838515_o_full.jpg",
        x: 50.551,
        y: 18.000,
        location: "Opole",
        category: "Restauracja",
        time: 1800
    },
    {
        id: 3,
        name: "Zagłębiowski Park Sportowy - ArcelorMittal Park",
        img: "https://lh5.googleusercontent.com/proxy/RfFucqcqYCBiq_-rsoPjGje67Cy9R1Zmtkkdp6dbq0ajWAjKj3iTu-T0dfSQGQvIpXwd39FVrJG14EcAFqKI7uG77jUezUOzodPpTDN8MUdHOH_BIzUthZ-4aN947xS6W0-BUGv8vxoDZdWoGu1WAN6BjOKoW1c-",
        x: 50.201,
        y: 19.000,
        location: "Sosnowiec",
        category: "Park",
        time: 1800
    },
    {
        id: 4,
        name: "Camper & Camping Park",
        img: "https://cdn2.acsi.eu/6/5/7/e/657eb320d5a9c.jpg?impolicy=gallery-detail",
        x: 54.301,
        y: 18.650,
        location: "Gdańsk",
        category: "Park",
        time: 1800
    },
    {
        id: 5,
        name: "Miejskie Centrum Sportu i Rekreacji w Płońsku",
        img: "https://ciechanow.cozadzien.pl/img/2020/04/30/_min/10e2c8dc13504108cd96a7ac5b14f8e2.jpg",
        x: 52.501,
        y: 17.000,
        location: "Płońsk",
        category: "Ośrodek zdrowia",
        time: 3600
    },
    {
        id: 6,
        name: "Barlinecki Park Krajobrazowy",
        img: "https://www.zpkwz.pl/images/barlinecki_park_projekt.jpg",
        x: 52.001,
        y: 15.000,
        location: "Barlinek",
        category: "Park",
        time: 1800
    },
    {
        id: 7,
        name: "Galeria Łódzka",
        img: "https://www.galeria-lodzka.pl/fileadmin/user_upload/TEST/Stage_images/GLL_photos/GL_STRONA_WWW_1920X1080_2.jpg",
        x: 51.701,
        y: 19.500,
        location: "Łódź",
        category: "Centrum handlowe",
        time: 3600
    },
    {
        id: 8,
        name: "Zegrzyńskie Lake Beach",
        img: "https://inmasovianstyle.com/wp-content/uploads/2022/07/nieporet_2021_1-1170x680-1-1170x680.jpg",
        x: 53.001,
        y: 19.000,
        location: "Nieporęt",
        category: "Kompleks pływacki",
        time: 3600
    },
    {
        id: 9,
        name: "Star Paintball",
        img: "https://hydra.fit/cdn/shop/files/image_aa9199bd-0bd3-4461-9b77-af47c452d735_1024x1024.heic?v=1683040367",
        x: 53.251,
        y: 15.000,
        location: "Szczecin",
        category: "Paintball center",
        time: 5400
    },
    {
        id: 10,
        name: "Plaza Rzeszów",
        img: "https://pliki.propertynews.pl/i/04/43/51/044351_r0_940.jpg",
        x: 50.001,
        y: 22.000,
        location: "Rzeszów",
        category: "Centrum handlowe",
        time: 3600
    },
    {
        id: 11,
        name: "Frangos Pizza & Burger House",
        img: "https://smacznego.moja-ostroleka.pl/libs/r.php?src=https://smacznego.moja-ostroleka.pl/uploads/smacznego/frangos/frangos_308.jpg&w=600",
        x: 53.071,
        y: 21.580,
        location: "Ostrołęka",
        category: "Restauracja",
        time: 1800
    },
    {
        id: 12,
        name: "Queen Mama",
        img: "https://d-art.ppstatic.pl/kadry/k/r/1/d4/70/5ef5ec75052b3_o_large.jpg",
        x: 51.201,
        y: 22.600,
        location: "Lublin",
        category: "Restauracja",
        time: 1800
    },
];

export default function App() {
    const [modalSearch, setModalSearch] = useState(false);
    const [valueLocation, setValueLocation] = useState("");
    const [valueName, setValueName] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [zoomLocationX, setZoomLocationX] = useState(52.083);
    const [zoomLocationY, setZoomLocationY] = useState(19.375);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [openPlaceCard, setOpenPlaceCard] = useState(false);
    const [datesStorage, setDatesStorage] = useState({});
    const [openTrip, setOpenTrip] = useState(false);
    const [showRoute, setShowRoute] = useState(false); 
    const [transportMode, setTransportMode] = useState('car');
    const [routingControl, setRoutingControl] = useState(null);
    const [sortedDates, setSortedDates] = useState([]);
    const [showRouteNavigation, setShowRouteNavigation] = useState(false);
    const [routeBlocked, setRouteBlocked] = useState(false);

    const updateDatesStorage = (date, properties) => {
        setDatesStorage(prevState => ({
            ...prevState,
            [date]: properties
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
                    dropdownVisible={dropdownVisible}
                    setDropdownVisible={setDropdownVisible}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
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
                            setRouteBlocked={setRouteBlocked}
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
                            transportMode={transportMode}
                            setTransportMode={setTransportMode}
                            setDatesStorage={setDatesStorage}
                            updateDatesStorage={updateDatesStorage}
                            sortedDates={sortedDates}
                            setSortedDates={setSortedDates}
                            showRouteNavigation={showRouteNavigation}
                            setShowRouteNavigation={setShowRouteNavigation}
                            routeBlocked={routeBlocked}
                            setRouteBlocked={setRouteBlocked}
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