"use client";
import { useEffect, useState } from "react";

export default function Timer() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Avoid mismatched render before hydration

  return (
    <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow text-black font-mono">
      {time}
    </div>
  );
}
