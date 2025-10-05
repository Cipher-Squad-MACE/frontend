'use client';

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Slider from "../components/slider";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("../components/map"), { ssr: false });
const Sidebar = dynamic(() => import("../components/sidebar"), { ssr: false });

export default function Home() {
  const [data, setData] = useState([]); // flower or other points
  const [selectedType, setSelectedType] = useState("");
  const [day, setDay] = useState(0);
  const [locateCoords, setLocateCoords] = useState(null);

  // Load data (optional flower data)
  useEffect(() => {
    fetch("/mockData.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData([])); // fallback to empty
  }, []);

  // Function passed to Sidebar to zoom map
  const locate = (coords) => {
    if (coords) {
      setLocateCoords(coords);
    } else {
      setLocateCoords(null);
    }
  };

  // Filter data by selected day (optional)
  const filteredData = data.filter((f) => {
    if (!f.date) return true;
    const patchDate = new Date(f.date);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - day);
    return patchDate.toDateString() === targetDate.toDateString();
  });

  return (
    <div className="h-screen w-screen relative">
      <Sidebar
        locate={locate}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <MapComponent
        data={filteredData}
        selectedType={selectedType}
        locateCoords={locateCoords}
      />
      <Slider day={day} setDay={setDay} />
    </div>
  );
}
