import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useState } from "react";

import { NavBar } from "./Components/Nav.js";
import { ErrorComponent } from "./Components/ErrorComponent.js";

import { data } from "./Data/data.js";
import { style } from "./mapstyle.js";
import "./App.css";

const markersData = data;
const { REACT_APP_API_KEY } = process.env;

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 52.237,
  lng: 21.017,
};

function App() {
  const [markers, setMarkers] = useState(markersData);
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState(null);
  // useEffect(() => {
  //   selected
  //     ? fetch(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selected.lat},${selected.lng}&key=${REACT_APP_API_KEY}`
  //       )
  //         .then((response) => response.json())
  //         .then((response) => {
  //           console.log(response);
  //           setAddress(response.results[0].formatted_address);
  //         })
  //         .catch((err) => console.log(err))
  //     : setSelected(null);
  // }, [selected]);

  const { isLoaded, loadedErr } = useJsApiLoader({
    googleMapsApiKey: `${REACT_APP_API_KEY}`,
  });
  if (loadedErr) return <ErrorComponent />;
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      <NavBar t={setMarkers} />
      <h1 className="car">CarSharing</h1>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: style,
        }}
        onDblClick={(event) => {
          setMarkers((current) => [
            ...current,
            {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            },
          ]);
        }}
      >
        <MarkerClusterer>
          {(clusterer) =>
            markers.map((marker) => (
              <Marker
                position={{ lat: marker.lat, lng: marker.lng }}
                onMouseDown={() => {
                  setSelected(marker);
                }}
                onClick={() => {
                  selected
                    ? fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selected.lat},${selected.lng}&key=${REACT_APP_API_KEY}`
                      )
                        .then((response) => response.json())
                        .then((response) => {
                          console.log(response);
                          setAddress(response.results[0].formatted_address);
                        })
                        .catch((err) => console.log("Loading..."))
                    : console.log("err");
                }}
                icon={{
                  url: marker.status
                    ? "https://svgsilh.com/svg/2027078-4caf50.svg"
                    : "https://svgsilh.com/svg/2027078-f44336.svg",
                  anchor: new window.google.maps.Point(25, 25),
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                key={marker.lat + marker.lng}
                clusterer={clusterer}
              />
            ))
          }
        </MarkerClusterer>
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
              setAddress(null);
            }}
          >
            <div className="container__car">
              <img
                src={require(`./assets/car.jpg`)}
                height={100}
                width={200}
                alt=""
              />

              <div className="container__car__infoBox">
                <div className="container__car__infoBox__status">
                  {selected.status ? (
                    <span className="available">AVAILABLE</span>
                  ) : (
                    <span className="disable">DISABLE</span>
                  )}
                  <div>
                    <span>CHARGE LEVEL</span> <br />
                    <div className="loader" battery={selected.battery}>
                      <span
                        className="loader__span"
                        style={{ width: selected.battery + "%" }}
                      >
                        ⚡
                      </span>
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <span>Location</span> <br />
                  <div className="location">{address}</div>
                </div>
                <hr />
                <div className="container__car__infoBox__rate">
                  <div className="container__car__infoBox__rate__current">
                    <p>
                      CURRENT RATE <br />
                      <span>1PLN</span>/min
                    </p>
                  </div>
                  <button className="container__car__infoBox__rate__button">
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
export default App;
