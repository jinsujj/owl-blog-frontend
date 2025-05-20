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
      const data = await getVisitorCoordinatesHistory(from, to, ip);
      if (data){
				const sortedData = data.sort((a,b) => {
					if(a.ip < b.ip) return -1; 
					if(a.ip > b.ip) return 1;
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				});
				setCoordinates(sortedData);
			}
    };

    fetchData();
  }, [from, to, ip]);

  // 3. 지도 렌더링
  useEffect(() => {
    if (!naverLoaded || !mapRef.current || coordinates.length === 0) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 기준
      zoom: 3,
      zoomControl: true,
      scrollWheel: true,
      disableDoubleClickZoom: false,
      draggable: true,
      pinchZoom: true,
    });

    let activeInfoWindow: naver.maps.InfoWindow | null = null;

    // 4. IP 기준으로 그룹핑
    type GroupedByIp = {
      ip: string;
      lat: string;
      lon: string;
      country: string;
      city: string;
      logs: {
        blogTitle: string;
        createdAt: string;
      }[];
    };

    const grouped: Record<string, GroupedByIp> = {};
    coordinates.forEach((coord) => {
      const key = coord.ip;
      if (!grouped[key]) {
        grouped[key] = {
          ip: coord.ip,
          lat: coord.lat,
          lon: coord.lon,
          country: coord.country,
          city: coord.city,
          logs: [],
        };
      }
      grouped[key].logs.push({
        blogTitle: coord.blogTitle,
        createdAt: coord.createdAt,
      });
    });

    // 5. 마커 및 InfoWindow 생성
    Object.values(grouped).forEach((group) => {
      const latlng = new window.naver.maps.LatLng(
        parseFloat(group.lat),
        parseFloat(group.lon)
      );

      const marker = new window.naver.maps.Marker({
        position: latlng,
        map,
        title: `${group.city} (${group.ip})`,
      });

      const blogLogs = group.logs.map(
        (log, idx) => `
          <div>
            <strong>📖 제목 ${idx + 1}:</strong> ${log.blogTitle}<br/>
            <strong>🕒 시간:</strong> ${new Date(log.createdAt).toLocaleString()}
          </div>`
      ).join('<hr style="margin: 6px 0;" />');

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
          word-break: break-word;
        ">
          ${blogLogs}
          <hr />
          <div><strong>🌐 IP:</strong> ${group.ip}</div>
          <div><strong>📍 위치:</strong> ${group.lat}, ${group.lon}</div>
          <div><strong>🌏 국가/도시:</strong> ${group.country} / ${group.city}</div>
        </div>
      `;

      const infoWindow = new window.naver.maps.InfoWindow({ content });

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
