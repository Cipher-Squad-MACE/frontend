'use client';

import { useEffect } from "react";
import { useMap } from 'react-leaflet';

export default function Locate({ coords, zoom = 7 }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom, { duration: 1.5 });
    }
  }, [coords, zoom, map]);

  return null;
}
