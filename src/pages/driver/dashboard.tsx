import GoogleMapReact, { Position } from "google-map-react";
import React, { useEffect, useState } from "react";

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();
  // 현재 위치 찾기 성공하면 driver 위치값을 State에 저장
  const onSucess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    // geolocation.watchPosition: 장치의 위치가 바뀔 때마다, 자동으로 새로운 위치를 사용해 호출할 처리함수를 등록
    // enableHighAccuracy 옵션: 정확한 위치 사용 옵션, 전력/로딩 시간 더 소모
    navigator.geolocation.watchPosition(onSucess, onError, {
      enableHighAccuracy: true,
    });
  }, [driverCoords.lat, driverCoords.lng]);
  // driver 위치 변경될 때마다 map 이동
  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng]);
  // map, maps class 다루기
  // map : 현재 보여지는 맵에 대한 정보, maps: 여러가지 동작기능을 줄 수 있는 객체
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        // div의 Size를 지정해줘야 UI상에 map이 나타남
        // index.tsx에서 React.StricMode를 제거해줘야 구글맵 에러없이 정상적으로 사용 가능
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDmDlwyEyPrI0dFVqp30vfChtkmSMNXyIw" }}
          defaultCenter={{ lat: 37.5433063, lng: 127.0716184 }}
          draggable={false}
          defaultZoom={16}
          // onGoogleApiLoaded를 사용하여 Google 지도의 map 및 maps 객체에 접근할 수 있습니다.
          // 이 경우 yesIWantToUseGoogleMapApiInternals를 true로 설정해야 합니다.
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
        >
          <div
            //@ts-ignore
            lat={driverCoords.lat}
            lng={driverCoords.lng}
            className="text-lg"
          >
            🛵
          </div>
        </GoogleMapReact>
      </div>
    </div>
  );
};
