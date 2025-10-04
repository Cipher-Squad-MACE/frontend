'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Client-side only dynamic import
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

// Move map to coordinates
function Locate({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 5);
  }, [coords, map]);
  return null;
}

// Convex hull for multiple points
function getConvexHull(points) {
  if (!points || points.length <= 1) return points;
  points = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const lower = [];
  for (let p of points) {
    while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = points.length-1; i >= 0; i--) {
    let p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

export default function MapComponent({ data = [], selectedType = '', locateCoords = null }) {
  return (
    <MapContainer
      key="main-map"
      center={[20, 0]}
      zoom={2}
      style={{ width: '80vw', height: '100vh', marginLeft: '20vw' }}
      minZoom={2}
      maxZoom={10}
      worldCopyJump={false} // prevents infinite map duplication
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {data
        .filter(f => !selectedType || f.type === selectedType)
        .map(f => {
          if (!f.coordinates) return null;
          const color = f.color || 'yellow';

          // Multiple coordinates -> polygon
          if (Array.isArray(f.coordinates[0])) {
            const hull = getConvexHull(f.coordinates);
            return <Polygon key={f.id} positions={hull} pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }} />;
          }

          // Single coordinate -> circle with fill
          return <Circle key={f.id} center={f.coordinates} radius={f.size || 500000} pathOptions={{ color, fillColor: color, fillOpacity: 0.4 }} />;
        })}

      {locateCoords && <Locate coords={locateCoords} />}
    </MapContainer>
  );
}
