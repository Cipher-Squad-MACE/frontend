'use client';

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import mockData from '../public/mockData.json'; // adjust path

// Dynamic imports
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

// Helper: assign consistent colors per flower name
const flowerColors = {};
const getColor = (flower) => {
  if (!flowerColors[flower]) {
    flowerColors[flower] = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
  }
  return flowerColors[flower];
};

export default function MapComponent({ selectedType }) {
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const grouped = {};
    mockData.forEach(item => {
      const name = item.phenophase_name;
      if (!grouped[name]) grouped[name] = [];
      grouped[name].push([item.latitude, item.longitude]);
    });
    setGroupedData(grouped);
  }, []);

  // Get exactly 3 coordinates
  const selectedCoords = selectedType && groupedData[selectedType]
    ? groupedData[selectedType].slice(0, 3)
    : [];

  // Close the loop for the polygon/dotted line
  const loopedCoords = selectedCoords.length > 1
    ? [...selectedCoords, selectedCoords[0]] // add first point at end
    : selectedCoords;

  return (
    <MapContainer
      center={[20, 0]} // fixed center
      zoom={2}         // fixed zoom
      style={{ width: '80vw', height: '100vh', marginLeft: '20vw', backgroundColor: '#f3f4f6' }}
      minZoom={2}
      maxZoom={20}
      worldCopyJump={false}
      maxBounds={[[-90, -180], [90, 180]]}
      maxBoundsViscosity={1.0}
      attributionControl={false} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        noWrap={true}
      />

      {/* Render circles */}
      {selectedCoords.map((coord, idx) => (
        <CircleMarker
          key={idx}
          center={coord}
          radius={10}
          pathOptions={{
            color: getColor(selectedType),
            fillColor: getColor(selectedType),
            fillOpacity: 0.6
          }}
        />
      ))}

      {/* Connect all coordinates with dotted lines forming a closed loop */}
      {loopedCoords.length > 1 && (
        <Polyline
          positions={loopedCoords}
          pathOptions={{
            color: getColor(selectedType),
            weight: 2,
            dashArray: '5,5' // dotted
          }}
        />
      )}
    </MapContainer>
  );
}
