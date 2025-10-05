'use client';

import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Handles zoom and fly-to behavior
export default function MapUpdater({ targetCoords }) {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoords && targetCoords.length === 2) {
      map.flyTo(targetCoords, 6, { animate: true, duration: 2 });
    }
  }, [map, targetCoords]);

  return null;
}
