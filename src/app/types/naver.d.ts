export {};
declare global {
  interface Window {
    naver: typeof naver;
  }

  namespace naver {
    namespace maps {
      namespace Event {
        type EventTarget = Map | Marker | InfoWindow;
  
        type EventName =
          | 'click'
          | 'dblclick'
          | 'mousedown'
          | 'mouseup'
          | 'mouseover'
          | 'mouseout'
          | 'dragstart'
          | 'drag'
          | 'dragend'
          | 'idle'
          | 'zoom_changed';
  
        function addListener<K extends EventName>(
          instance: EventTarget,
          eventName: K,
          listener: (event: EventPayloadMap[K]) => void
        ): void;
      }
  
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
  
      class InfoWindow {
        constructor(options: InfoWindowOptions);
        open(map: Map, marker: Marker): void;
        close(): void;
      }
  
      interface InfoWindowOptions {
        content: string | HTMLElement;
        maxWidth?: number;
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        disableAnchor?: boolean;
        pixelOffset?: Point;
      }
  
      class Point {
        constructor(x: number, y: number);
      }
  
      enum MapTypeId {
        NORMAL,
        TERRAIN,
        SATELLITE,
        HYBRID,
      }
  
      enum ControlPosition {
        TOP_LEFT,
        TOP_CENTER,
        TOP_RIGHT,
        LEFT_TOP,
        LEFT_CENTER,
        LEFT_BOTTOM,
        RIGHT_TOP,
        RIGHT_CENTER,
        RIGHT_BOTTOM,
        BOTTOM_LEFT,
        BOTTOM_CENTER,
        BOTTOM_RIGHT,
      }
  
      interface MapOptions {
        center: LatLng;
        zoom: number;
        minZoom?: number;
        maxZoom?: number;
        zoomControl?: boolean;
        zoomControlOptions?: {
          position: ControlPosition;
        };
        mapTypeControl?: boolean;
        mapTypeControlOptions?: {
          position: ControlPosition;
          style?: number;
        };
        scaleControl?: boolean;
        logoControl?: boolean;
        logoControlOptions?: {
          position: ControlPosition;
        };
        mapDataControl?: boolean;
        mapTypeId?: MapTypeId;
        draggable?: boolean;
        pinchZoom?: boolean;
        scrollWheel?: boolean;
        disableDoubleClickZoom?: boolean;
        keyboardShortcuts?: boolean;
        tileTransition?: boolean;
        background?: string;
      }
  
      interface MarkerOptions {
        position: LatLng;
        map: Map;
        title?: string;
      }
    }
  }
}