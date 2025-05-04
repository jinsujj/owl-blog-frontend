'use client';

import { useEffect, useRef, useState } from 'react';
import { CoordinateVO, getVisitorCoordinatesHistory } from '../api/historyApi';


export default function NaverMapWithMarkers({from,to,}: {from: string;to: string;}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<CoordinateVO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVisitorCoordinatesHistory(from, to);
      if (data) setCoordinates(data);
    };
  
    fetchData();
  }, [from, to]);
  

  useEffect(() => {
    if (!window.naver || !mapRef.current || coordinates.length === 0) return;

    const center = new window.naver.maps.LatLng(
      parseFloat(coordinates[0].lat),
      parseFloat(coordinates[0].lon)
    );

    const map = new window.naver.maps.Map(mapRef.current, {
      center,
      zoom: 3,
    });

    coordinates.forEach((coord) => {
      const latlng = new window.naver.maps.LatLng(
        parseFloat(coord.lat),
        parseFloat(coord.lon)
      );

      new window.naver.maps.Marker({
        position: latlng,
        map,
        title: `${coord.city} (${coord.ip})`,
      });
    });
  }, [coordinates]);

  return (
    <div>
      <div id="map" ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
}
