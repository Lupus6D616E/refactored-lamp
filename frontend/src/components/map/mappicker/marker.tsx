import { Marker } from "react-leaflet";
import { LatLngLiteral, LeafletEvent } from "leaflet";
import L from "leaflet";

interface DraggableMarkerProps {
  position: LatLngLiteral;
  onChange: (position: LatLngLiteral) => void;
}

export function DraggableMarker({
  position,
  onChange,
  
}: DraggableMarkerProps) {
 const defaultMarkerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
  return (
    <Marker
      position={position}
      icon={defaultMarkerIcon}
      draggable
      eventHandlers={{
        dragend: (e: LeafletEvent) => {
          const marker = e.target as L.Marker;
          const newPos = marker.getLatLng();

          const coords: LatLngLiteral = {
            lat: newPos.lat,
            lng: newPos.lng,
          };
          onChange(coords);
        },
      }}
    />
  );
}
