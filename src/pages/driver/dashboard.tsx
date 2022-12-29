import GoogleMapReact, { Position } from "google-map-react";
import React, { useEffect, useState } from "react";

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
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
  }, []);
  return (
    <div>
      <div
        className="overflow-hidden"
        // div의 Size를 지정해줘야 UI상에 map이 나타남
        // index.tsx에서 React.StricMode를 제거해줘야 구글맵 에러없이 정상적으로 사용 가능
        style={{ width: window.innerWidth, height: "95vh" }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDmDlwyEyPrI0dFVqp30vfChtkmSMNXyIw" }}
          defaultCenter={{ lat: 37.5433063, lng: 127.0716184 }}
          draggable={false}
          defaultZoom={15}
        ></GoogleMapReact>
      </div>
    </div>
  );
};
