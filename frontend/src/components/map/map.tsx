import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import GeocoderControl from "./mapcontrol";
import { DraggableMarker } from "./marker";
import { LatLngLiteral } from "leaflet";
import { useState } from "react";
interface MapProps {
  // Callback function that takes the address string
  onAddressSelect: (address: string, point:LatLngLiteral) => void;
}

export const Map:React.FC<MapProps> = ({onAddressSelect}) => {
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 14.5995862,
    lng: 121.004245,
  });
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false);
  async function confirmLocation() {
    try {
      setLoading(true);
      onAddressSelect(address,position)
      console.log("Location saved");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <MapContainer
        center={position}
        zoom={18}
        scrollWheelZoom={false}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://localhost:7755/tile/{z}/{x}/{y}.png"
        />

        <GeocoderControl onSelect={({ position,address }) =>{setPosition(position)
setAddress(address)
        }} />
        <DraggableMarker
          position={position}
          onChange={(pos) => setPosition(pos)}
        />
      </MapContainer>
      <button
        className="btn"
        onClick={confirmLocation}
        disabled={loading}
        style={{ marginTop: "12px" }}
      >
        {loading ? "Saving..." : "Confirm location"}
      </button>
      <p>position: lat: {position.lat} lng: {position.lng} address:{address}</p>
    </div>
  );
}
