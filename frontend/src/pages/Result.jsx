
import { useLocation } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();

  return (
    <div>
      <h1>Trip Details</h1>
      <p>Days: {state?.days}</p>
      <p>Budget: {state?.budget}</p>
    </div>
  );
}