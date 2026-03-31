// export default function Card({ title, value }) {
//   return (
//     <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
//       <h2 className="text-gray-400">{title}</h2>
//       <p className="text-2xl font-bold">{value}</p>
//     </div>
//   );
// }

import { motion } from "framer-motion";

export default function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl"
    >
      <h2 className="text-gray-400 text-sm">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}