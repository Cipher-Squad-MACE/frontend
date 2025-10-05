'use client';

import { useState, useEffect } from "react";
import worldData from '../countries.json'; // adjust path

export default function Sidebar({ locate, selectedType, setSelectedType }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [flowerList, setFlowerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load all countries on mount
  useEffect(() => {
    setCountryList(worldData.map(c => c.name));
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryObj = worldData.find(c => c.name === selectedCountry);
      setStateList(countryObj ? countryObj.states.map(s => s.name) : []);
      setSelectedState(""); // reset state selection
    } else {
      setStateList([]);
      setSelectedState("");
    }
  }, [selectedCountry]);

  // Fetch flower data from mockData.json
  useEffect(() => {
    fetch("/mockData.json")
      .then((res) => res.json())
      .then((data) => {
        // get unique phenophase names
        const uniqueFlowers = [...new Set(data.map(f => f.phenophase_name))];
        setFlowerList(uniqueFlowers);
      })
      .catch(() => setFlowerList([]));
  }, []);

  // Filtered flowers based on search term
  const filteredFlowers = flowerList.filter(flower =>
    flower.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Go button logic
  const handleGo = () => {
    const countryObj = worldData.find(c => c.name === selectedCountry);
    if (!countryObj) return;

    if (selectedState) {
      const stateObj = countryObj.states.find(s => s.name === selectedState);
      if (stateObj) {
        locate(stateObj.coordinates);
        return;
      }
    }
    locate(countryObj.coordinates);
  };

  return (
    <div className="w-1/5 h-full fixed bg-gray-100 p-6 overflow-y-auto border-r border-gray-300 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Where on Earth are you looking?</h2>

      {/* Country Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-semibold">Country:</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full p-2 border rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="">Select a country</option>
          {countryList.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* State Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-semibold">State / Region:</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry}
          className={`w-full p-2 border rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition
            ${!selectedCountry ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
          <option value="">Select a state/region</option>
          {stateList.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Go Button */}
      <button
        onClick={handleGo}
        disabled={!selectedCountry}
        className={`w-full p-2 rounded text-white font-semibold transition
          ${!selectedCountry ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        Go
      </button>

      <hr className="my-6 border-gray-300" />

      {/* Flower Search */}
      <h2 className="text-xl font-bold mb-2 text-gray-800">Select a Flower / Phenophase</h2>
      <input
        type="text"
        placeholder="Search flowers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      {/* Flower Radio Buttons */}
      <div className="flex flex-col gap-2">
        {filteredFlowers.length === 0 && <p className="text-gray-500 italic">No flowers found</p>}
        {filteredFlowers.map((flower, idx) => (
          <label key={idx} className="flex items-center gap-2 text-gray-700">
            <input
              type="radio"
              name="flower"
              value={flower}
              checked={selectedType === flower}
              onChange={() => setSelectedType(flower)}
              className="accent-blue-500"
            />
            {flower}
          </label>
        ))}
      </div>
    </div>
  );
}
