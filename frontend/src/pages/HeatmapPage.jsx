import Heatmap from "../components/Heatmap";

export default function HeatmapPage() {
  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl">Crowd Heatmap</h1>
      <Heatmap />
    </div>
  );
}