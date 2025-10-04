import { useState } from "react";
import countriesData from "../countries.json"; // your JSON

export default function Sidebar({ flowerTypes, selectedType, setSelectedType, locate }) {
  const [country, setCountry] = useState("");
  const [stateSearch, setStateSearch] = useState("");

  // Country options from your JSON
  const countryOptions = countriesData.map(c => c.name.common);

  // States/subdivisions: if your JSON doesn’t have them, leave empty
  const stateOptions = []; // Or use another dataset

  const filteredStates = stateOptions.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="w-1/5 h-full fixed bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Where on Earth are you looking?</h2>

      <label className="block mb-2">Country:</label>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-full mb-4 p-1 border rounded"
      >
        <option value="">Select Country</option>
        {countryOptions.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label className="block mb-2">State / Region:</label>
      <input
        type="text"
        value={stateSearch}
        onChange={(e) => setStateSearch(e.target.value)}
        placeholder="Search state"
        className="w-full mb-4 p-1 border rounded"
        disabled={stateOptions.length === 0}
      />

      <button
        onClick={() => locate(country)}
        className="w-full bg-blue-500 text-white p-1 rounded mb-4"
      >
        Go
      </button>

      <hr className="my-4 border-gray-300" />

      <h2 className="text-xl font-bold mb-2">Flowers you can see</h2>
      <ul className="list-disc list-inside">
        {flowerTypes.map((type) => (
          <li
            key={type}
            className="cursor-pointer hover:text-blue-500"
            onClick={() => setSelectedType(type)}
          >
            {type}
          </li>
        ))}
      </ul>
    </div>
  );
}
