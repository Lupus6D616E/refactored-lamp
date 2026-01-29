import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'             // you can keep it here instead of main.tsx
// import 'leaflet-defaulticon-compatibility' // optional — fixes broken default marker

const position = [14.59899, 121.00541] as [number, number]

export default function Map() {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '500px', width: '50%' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='http://localhost:8080/tile/{z}/{x}/{y}.png'
      />

      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}