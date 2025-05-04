declare global {
    interface Window {
      naver: typeof naver;
    }
  }
  
  declare namespace naver {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
      }
  
      class Map {
        constructor(element: HTMLElement, options: MapOptions);
        getCenter(): LatLng;
        setCenter(latlng: LatLng): void;
      }
  
      class Marker {
        constructor(options: MarkerOptions);
      }
  
      interface MapOptions {
        center: LatLng;
        zoom: number;
      }
  
      interface MarkerOptions {
        position: LatLng;
        map: Map;
        title?: string;
      }
    }
  }
  