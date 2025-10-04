export default function Slider({ day, setDay }) {
  return (
    <div
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
                 bg-white/30 backdrop-blur-md border border-white/50 
                 p-4 rounded-xl shadow-lg z-50"
      style={{ width: '300px' }}
    >
      <input
        type="range"
        min="0"
        max="7"
        value={day}
        onChange={(e) => setDay(parseInt(e.target.value))}
        className="w-full accent-blue-500"
      />
      <p className="text-center text-white font-semibold mt-2">Days ago: {day}</p>
    </div>
  );
}
