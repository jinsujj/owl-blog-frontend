'use client';

import { useEffect, useRef, useState } from 'react';
import { CoordinateVO, getVisitorCoordinatesHistory } from '../api/historyApi';

export default function NaverMapWithMarkers({ from, to }: { from: string; to: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<CoordinateVO[]>([]);
  const [naverLoaded, setNaverLoaded] = useState<boolean>(false);

  // 1. naver maps 로딩 상태 감지
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setNaverLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 2. 좌표 로딩
  useEffect(() => {
    const fetchData = async () => {
      const data = await getVisitorCoordinatesHistory(from, to);
      if (data) setCoordinates(data);
    };

    fetchData();
  }, [from, to]);

  // 3. 지도 렌더링
  useEffect(() => {
    if (!naverLoaded || !mapRef.current || coordinates.length === 0) return;
    const center = new window.naver.maps.LatLng(
      parseFloat('37.5665'),
      parseFloat('126.978')
    );

    const map = new window.naver.maps.Map(mapRef.current, {
      center: center,
      zoom: 3,
      zoomControl: true,
      scrollWheel: true,
      disableDoubleClickZoom: false,
      draggable: true,
      pinchZoom: true,
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
  }, [from,to, naverLoaded, coordinates]);

  return <div id="map" ref={mapRef} style={{ width: '100%', height: '700px',  zIndex: 9999 }} />;
}
