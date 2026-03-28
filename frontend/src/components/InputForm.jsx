import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InputForm() {
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/result", { state: { days, budget } });
  };

  return (
    <div>
      <input
        placeholder="Enter Days"
        onChange={(e) => setDays(e.target.value)}
      />

      <input
        placeholder="Enter Budget"
        onChange={(e) => setBudget(e.target.value)}
      />

      <button onClick={handleSubmit}>Plan Trip</button>
    </div>
  );
}