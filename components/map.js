'use client';

import { useEffect } from "react";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamic imports for heavy components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });

// Import hook normally
import { useMap } from 'react-leaflet';

function Locate({ coords, zoom = 5 }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom, { duration: 1.5 });
    }
  }, [coords, zoom, map]);

  return null;
}

export default function MapComponent({ data = [], selectedType = '', locateCoords = null }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ width: '80vw', height: '100vh', marginLeft: '20vw', backgroundColor: '#f3f4f6' }}
      minZoom={2}
      maxZoom={20}
      worldCopyJump={false}
      maxBounds={[[-90, -180], [90, 180]]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        noWrap={true}
      />

      {/* Render data (flowers or points) */}
      {data.filter(f => !selectedType || f.type === selectedType).map(f => {
        if (!f.coordinates) return null;
        const color = f.color || 'yellow';

        if (Array.isArray(f.coordinates[0])) {
          return <Polygon key={f.id} positions={f.coordinates} pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }} />;
        }

        return <Circle key={f.id} center={f.coordinates} radius={f.size || 500000} pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }} />;
      })}

      {/* Fly to selected country/state */}
      {locateCoords && <Locate coords={locateCoords} zoom={5} />}
    </MapContainer>
  );
}
