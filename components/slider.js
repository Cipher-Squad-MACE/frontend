export default function Slider({ day, setDay }) {
  return (
    <div
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
                 bg-white/30 backdrop-blur-md border border-white/50 
                 p-4 rounded-xl shadow-lg z-[9999]"
      style={{ width: '300px' }}
    >
      <input
        type="range"
        min="0"
        max="7"
        value={day}
        onChange={(e) => setDay(parseInt(e.target.value))}
        className="w-full accent-blue-500 cursor-pointer"
      />

      <p className="text-center text-gray-900 font-semibold mt-2 drop-shadow">
        {day === 0 ? "Today" : `${day} day${day > 1 ? "s" : ""} ago`}
      </p>
    </div>
  );
}
