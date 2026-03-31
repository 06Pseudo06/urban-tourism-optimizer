import { useState } from "react";

export default function Planner() {
  const [location, setLocation] = useState("");

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-4">Trip Planner</h1>
      <input
        className="p-2 text-black"
        placeholder="Enter Location"
        onChange={(e) => setLocation(e.target.value)}
      />

      {location && (
        <div className="mt-4">
          <h2>Suggested Plan for {location}</h2>
          <ul>
            <li>Visit less crowded park</li>
            <li>Travel at 6 AM</li>
          </ul>
        </div>
      )}
    </div>
  );
}