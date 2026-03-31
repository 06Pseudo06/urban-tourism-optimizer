// export default function Heatmap() {
//   return (
//     <div className="grid grid-cols-3 gap-2 mt-4">
//       {["low", "medium", "high"].map((level, i) => (
//         <div
//           key={i}
//         //   className={`h-24 rounded ${
//         //     level === "low"
//         //       ? "bg-green-500"
//         //       : level === "medium"
//         //       ? "bg-yellow-500"
//         //       : "bg-red-500"
//         //   }`}

//         className="h-28 rounded-xl cursor-pointer shadow-lg hover:scale-105 transition"
//         />
//       ))}
//     </div>
//   );
// }


import { useState } from "react";

export default function Heatmap() {
  const [selected, setSelected] = useState(null);

  const levels = ["Low", "Medium", "High"];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {levels.map((level, i) => (
          <div
            key={i}
            onClick={() => setSelected(level)}
            className={`h-28 rounded-xl cursor-pointer shadow-lg hover:scale-105 transition flex items-center justify-center text-white font-semibold ${
              level === "Low"
                ? "bg-green-500"
                : level === "Medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {level}
          </div>
        ))}
      </div>

      {/* Info box */}
      {selected && (
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
          <h2 className="text-xl font-bold">{selected} Congestion Area</h2>
          <p className="text-gray-300 mt-2">
            Suggested: Visit alternative nearby locations to avoid crowd.
          </p>
        </div>
      )}
    </div>
  );
}