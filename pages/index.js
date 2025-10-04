'use client';

import { useState, useEffect } from "react";
import MapComponent from "../components/map";
import Sidebar from "../components/sidebar";
import Slider from "../components/slider";
import Timer from "../components/timer";

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [day, setDay] = useState(0);
  const [locateCoords, setLocateCoords] = useState(null);

  // Load data from JSON
  useEffect(() => {
    fetch("/mockData.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const flowerTypes = Array.from(new Set(data.map((f) => f.type)));

  // Locate function: uses coordinates from JSON
  const locate = (countryName) => {
    const countryData = data.find(f => f.country === countryName);
    if (countryData && countryData.coordinates) {
      const coords = Array.isArray(countryData.coordinates[0])
        ? countryData.coordinates[0]
        : countryData.coordinates;
      setLocateCoords(coords);
    } else {
      setLocateCoords(null);
    }
  };

  // Filter data by selected day
  const filteredData = data.filter((f) => {
    const patchDate = new Date(f.date);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - day);
    return patchDate.toDateString() === targetDate.toDateString();
  });

  return (
    <div className="h-screen w-screen relative">
      <Sidebar
        flowerTypes={flowerTypes}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        locate={locate}
      />
      <MapComponent
        data={filteredData}
        selectedType={selectedType}
        locateCoords={locateCoords}
      />
      <Slider day={day} setDay={setDay} />
      <Timer />
    </div>
  );
}
