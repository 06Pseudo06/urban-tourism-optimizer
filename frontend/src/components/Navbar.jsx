import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-black text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Urban Optimizer</h1>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/planner">Planner</Link>
        <Link to="/heatmap">Heatmap</Link>
        <Link to="/transport">Transport</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}