import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import GeocoderControl from "../mapcontrol";
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

  async function reverseGeocode(lat:number, lon:number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&layer=address`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Testing/1.0 (1)' // Identify your app
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Address:', data.display_name);
    setAddress(data.display_name)
    console.log(address)
  } catch (error) { 
    console.error('Error fetching data:', error);
  }
}



  async function confirmLocation() {
    try {
      setLoading(true);
      await reverseGeocode(position.lat,position.lng)
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
      type="button"
        className="btn"
        onClick={confirmLocation}
        disabled={loading}
        style={{ marginTop: "12px" }}
      >
        {loading ? "Saving..." : "Confirm location"}
      </button>
          <button
      type="button"
        className="btn"
        onClick={async () => { await reverseGeocode(position.lat,position.lng)}}
        disabled={loading}
        style={{ marginTop: "12px" }}
      >
        {loading ? "Saving..." : "Set cursor as address"}
        
      </button>
      <p> address to be selected: {address} </p>
      <p> you can manually change it below  </p>
    </div>
  );
}
