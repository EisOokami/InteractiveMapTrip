import { LayersControl, MapContainer, Marker, TileLayer, useMap, LayerGroup } from "react-leaflet";
import { Icon } from "leaflet";
import "./Map.scss";

function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    window.map = map;
    return null;
}

export default function Map({ setModalSearch, positions, zoomLocationX, zoomLocationY, setZoomLocationX, setZoomLocationY, setSelectedPosition, setOpenPlaceCard, setOpenTrip }) {
    const handleZoomLocation = (x, y, key) => {
        setModalSearch(true);
        setOpenPlaceCard(true);
        setOpenTrip(false);
        setZoomLocationX(x);
        setZoomLocationY(y);
        setSelectedPosition(key);
    };

    return (
        <MapContainer center={[zoomLocationX, zoomLocationY]} zoom={7} scrollWheelZoom={true}>
            <ChangeView center={[zoomLocationX, zoomLocationY]} />
            <LayersControl>
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Google Map Satellite">
                    <LayerGroup>
                        <TileLayer
                            attribution="Google Maps Satellite"
                            url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                        />
                        <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
                    </LayerGroup>
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Circle">
                    <TileLayer
                        url="https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=fa595c9430dc4c019d1d936817687bb3"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            {positions.map((elem) => (
                <Marker
                    key={elem.id}
                    position={[elem.x, elem.y]}
                    icon={new Icon({
                        iconUrl: "https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-Picture.png",
                        shadowUrl: elem.img,
                        iconSize: [50, 50],
                        iconAnchor: [25, 50],
                        shadowSize: [26, 26],
                        shadowAnchor: [13, 44]
                    })}
                    eventHandlers={{
                        click: () => handleZoomLocation(elem.x, elem.y, elem.id),
                    }}
                />
            ))}
        </MapContainer>
    );
}