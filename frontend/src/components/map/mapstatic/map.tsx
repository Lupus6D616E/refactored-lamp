// MapWithMarker.tsx
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";



const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';  

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapWithMarkerProps = {
  center: [number, number]; // [lat, lng]
  popupContent: string;
  zoom?: number;
};

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    // This runs every time center or zoom changes
    map.setView(center, zoom, { animate: true }); // animate: false if you prefer instant jump
    setTimeout(() => {
      markerRef.current?.openPopup();
    }, 300);
  }, [center, zoom, map]); // dependencies are important

  return null;
}

export function StaticMap({
  center,
  popupContent,
  zoom = 18,
}: MapWithMarkerProps) {
  return (
    <MapContainer
      // You can keep an initial center/zoom here (any value is fine)
      center={center} // or use [0,0] or your default
      zoom={zoom}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={TILE_URL}
      />

      {/* This component moves the view when props change */}
      <MapUpdater center={center} zoom={zoom} />

      <Marker position={center}>
        <Popup>{popupContent || "No description provided"}</Popup>
      </Marker>
    </MapContainer>
  );
}
