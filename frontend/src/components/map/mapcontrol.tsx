import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L, { LatLngLiteral } from 'leaflet'
import 'leaflet-control-geocoder'

interface GeocoderProps {
  onSelect: (data: {
    position: LatLngLiteral;
    address: string;
  }) => void;
}



export function GeocoderControl({ onSelect }: GeocoderProps){
  const map = useMap()

  useEffect(() => {
    const geocoder = (L.Control as any).geocoder({
      defaultMarkGeocode: false,
      position: 'topright',
    }).on("markgeocode", (e: any) => {
        const center = e.geocode.center as L.LatLng;
        const position: LatLngLiteral = {
          lat: center.lat,
          lng: center.lng,
        }
        map.setView(position, 16);
        onSelect({
          position,
          address: e.geocode.name,
        });
      })

    geocoder.addTo(map)

    return () => {
      map.removeControl(geocoder)
    }
  }, [map, onSelect])

  return null
}

export default GeocoderControl