import { data } from "../Data/data.js";
import { useState } from "react";
const markersData = data;

export const NavBar = (props) => {
  const [value, setValue] = useState(20);
  const [available, setAvailable] = useState([]);
  const [dis, setDis] = useState([]);
  return (
    <div className="container">
      <input
        type="radio"
        id="available"
        name="select"
        value="available"
        onChange={() => {
          setDis([]);
          for (let i = 0; i < markersData.length; i++) {
            if (markersData[i].status === true) {
              available.push(markersData[i]);
            }
            props.t(available);
          }
        }}
      />
      <label htmlFor="available">AVAILABLE</label>
      <input
        type="radio"
        id="not"
        name="select"
        value="not"
        onChange={() => {
          setAvailable([]);
          for (let i = 0; i < markersData.length; i++) {
            if (markersData[i].status === false) {
              dis.push(markersData[i]);
            }
            props.t(dis);
          }
        }}
      />
      <label htmlFor="not">NOT AVAILABLE</label>
      <input
        type="radio"
        id="all"
        name="select"
        value="all"
        onChange={() => {
          setAvailable([]);
          setDis([]);
          props.t(markersData);
        }}
      />
      <label htmlFor="all">ALL CARS</label>

      <input
        type="text"
        id="num"
        className="textInput"
        inputMode="numeric"
        value={value}
        placeholder="%"
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        maxLength={3}
        onChange={(e) => {
          setValue(e.target.value);
          const batteryCar = [];
          let tablica = [];

          if (available[0] === undefined && dis[0] === undefined) {
            tablica = markersData;
            for (let i = 0; i < tablica.length; i++) {
              if (tablica[i].battery > e.target.value) {
                batteryCar.push(tablica[i]);
              }
              props.t(batteryCar);
            }
            return tablica;
          } else if (available[0] !== undefined || dis[0] !== undefined) {
            tablica = available[0] !== undefined ? available : dis;
            for (let i = 0; i < tablica.length; i++) {
              if (tablica[i].battery > e.target.value) {
                batteryCar.push(tablica[i]);
              }
              props.t(batteryCar);
            }
            return tablica;
          }
        }}
      />
      <label htmlFor="num"> Battery % and More!</label>
    </div>
  );
};
