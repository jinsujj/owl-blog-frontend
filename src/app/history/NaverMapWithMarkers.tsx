'use client';

import { useEffect, useRef, useState } from 'react';
import { CoordinateVO, getVisitorCoordinatesHistory } from '../api/historyApi';

export default function NaverMapWithMarkers({ from, to, ip }: { from: string; to: string; ip: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<CoordinateVO[]>([]);
  const [naverLoaded, setNaverLoaded] = useState<boolean>(false);

  // 1. naver maps sdk loading
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setNaverLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 2. 좌표 data fetch
  useEffect(() => {
    const fetchData = async () => {
      console.log("ip "+ ip);
      const data = await getVisitorCoordinatesHistory(from, to, ip);
      if (data) setCoordinates(data);
    };

    fetchData();
  }, [from, to, ip]);

  // 3. 지도 렌더링
  useEffect(() => {
    if (!naverLoaded || !mapRef.current || coordinates.length === 0) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 3,
      zoomControl: true,
      scrollWheel: true,
      disableDoubleClickZoom: false,
      draggable: true,
      pinchZoom: true,
    });

    let activeInfoWindow: naver.maps.InfoWindow | null = null; 

    coordinates.forEach((coord) => {
      const latlng = new window.naver.maps.LatLng(
        parseFloat(coord.lat),
        parseFloat(coord.lon)
      );

      const marker = new window.naver.maps.Marker({
        position: latlng,
        map,
        title: `${coord.city} (${coord.ip})`,
      });

      const content = `
        <div style="
          padding: 12px 16px;
          font-size: 14px;
          line-height: 1.6;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.1);
          max-width: 1000px;
          width: 100%;
          word-break: break-word;
        ">
          <div><strong>📖 제목:</strong> ${coord.blogTitle}</div>
          <div><strong>🌐 IP:</strong> ${coord.ip}</div>
          <div><strong>📍 위치:</strong> ${coord.lat}, ${coord.lon}</div>
          <div><strong>🕒 시간:</strong> ${new Date(coord.createdAt).toLocaleString()}</div>
          <div><strong>🌏 국가/도시:</strong> ${coord.country} / ${coord.city}</div>
        </div>
      `;


      const infoWindow = new window.naver.maps.InfoWindow({
        content,
        maxWidth: 300,
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (activeInfoWindow === infoWindow) {
          infoWindow.close();
          activeInfoWindow = null;
        } else {
          if (activeInfoWindow) activeInfoWindow.close();
          infoWindow.open(map, marker);
          activeInfoWindow = infoWindow;
        }
      });
    });
  }, [from, to, naverLoaded, coordinates]);

  return <div id="map" ref={mapRef} style={{ width: '100%', height: '700px', zIndex: 1 }} />;
}
