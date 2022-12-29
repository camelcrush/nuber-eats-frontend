import GoogleMapReact from "google-map-react";
import React, { useEffect, useState } from "react";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
// children 에러로 인해 아래와 같이 컴포넌트로 만들어 마커를 추가해줘야 함
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🛵</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
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
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      // 지오코딩은 주소 (예: '1600 Amphitheatre Parkway, Mountain View, CA')를 지리 좌표(예: 위도 37.423021, 경도 -122.083739)로 변환하는 프로세스입니다.
      // 이 지리적 좌표를 사용하여 마커를 배치하거나 지도의 위치를 지정할 수 있습니다.
      // 역 지오코딩은 지리 좌표를 사람이 읽을 수 있는 주소로 변환하는 과정
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  // map, maps class 다루기
  // map : 현재 보여지는 맵에 대한 정보, maps: 여러가지 동작기능을 줄 수 있는 객체
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const onGetRouteClick = () => {
    // Direction 표시 로직, typescript를 꼭 설치하자! npm i @types/google.maps
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng - 0.05
            ),
          },
          // 한국에서는 정책상 TRANSITA 모드만 됨... Driving을 구현하려면 카카오맵 등을 사용고려 필요
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
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
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick}>Get route</button>
    </div>
  );
};
