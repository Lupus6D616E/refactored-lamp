declare module 'leaflet-control-geocoder' {
  import * as L from 'leaflet'

  namespace Control {
    function geocoder(options?: any): L.Control
  }

  export = Control
}