import React from 'react'
import { SelectBudget} from '../constants/options'
import { SelectTravelersList } from '../constants/options'
import { Button } from "@/components/ui/button"
import { useEffect } from 'react';
import { Form } from 'react-router-dom'
import ItineraryDisplay from '../components/ItineraryDisplay'

function Createtrip() { 

  // trying to store the form data in a state variable called Formdata, which is an object. The setFormdata function will be used to update this state variable when the user fills out the form.
  const[Formdata, setFormdata] = React.useState({})
  
  // State for handling API request status and response
  const [loading, setLoading] = React.useState(false)
  const [tripData, setTripData] = React.useState(null)

  // NEW: states for Geoapify-based autocomplete
  const [query, setQuery] = React.useState("")
  const [suggestions, setSuggestions] = React.useState([])

  // handleInputChange function is defined to update the Formdata state variable whenever there is a change in the form inputs. It takes the name of the input field and its value as parameters and updates the Formdata state accordingly.
  const handleInputChange = (name,value)=>{
    setFormdata(prevFormData => ({
      ...prevFormData,
      [name]:value
    }))
  }

  // useEffect hook to log the Formdata state variable to the console whenever it changes. This is useful for debugging and seeing how the form data is being updated as the user interacts with the form.
  useEffect(()=>{
    console.log(Formdata)
  }, [Formdata])


     // This function will be called when the user clicks the "Generate-Trip" button. It handles making the API call to the backend.
const OnGenerateTrip = async () => {

  console.log("FINAL FORM DATA:", Formdata);  //debug 

  // Basic validation
  if (
  !Formdata?.location?.name ||
  !Formdata?.duration ||
  !Formdata?.travelType ||
  !Formdata?.travelCompanions
  ) {
    alert("Please fill out all the fields before generating the trip.");
    return;
  }

    setLoading(true);
    setTripData(null);
    console.log("Generating trip with the following preferences:", Formdata);

    try {
      const response = await fetch("http://localhost:5000/api/itinerary/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: Formdata.location?.name || 'Unknown City',
          duration: Number(Formdata.duration),
          interests: [Formdata.travelType, Formdata.travelCompanions].filter(Boolean)
        }),
      });

      const data = await response.json();
      setTripData(data);
      console.log("Trip data generated:", data);
    } catch (error) {
      console.error("Error generating trip:", error);
      alert("Failed to generate trip. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }


  // The component returns a JSX structure that represents the form for creating a trip. It includes input fields for the destination, duration of stay, type of travel, and travel companions.
  // GooglePlacesAutocomplete has been removed and replaced with custom Geoapify-based input calling backend.
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:p-10 p-5 mt-10' text-center>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>Tell us about your ideal trip and we'll create a personalized itinerary for you!</p>


      <div className='mt-20 flex flex-col gap-9'>
        <div>
          <h2 className='text-xl my-3 font-medium'>Where do you want to go?`</h2>

          {/* Replaced Google autocomplete with custom backend-driven search */}
<div className="relative">
          <input
            type="text"
            placeholder="Enter destination"
            value={query}
            onChange={async (e) => {
              const value = e.target.value;
              setQuery(value);

              if (!value) {
                setSuggestions([]);
                return;
              }

              try {
                const res = await fetch("http://localhost:5000/api/places/search", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ query: value }),
                });

                const data = await res.json();
                setSuggestions(data);
              } catch (err) {
                console.error("Error fetching places:", err);
              }
            }}
            className='border border-gray-300 rounded-md p-2 w-full'
          />

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
          <ul className="border rounded-md mt-2 bg-white shadow-md absolute z-50 w-full max-h-60 overflow-y-auto">
            {suggestions.map((item, index) => (
<li
  key={index}
  className="p-2 hover:bg-gray-200 cursor-pointer"
  onMouseDown={() => {   // 🔥 FIXED HERE
    const selectedName =
      item.name || item.formatted || item.properties?.formatted;

    console.log("SELECTED PLACE:", selectedName);

    if (!selectedName) return;

    setQuery(selectedName);

    // FIX: force correct structure
    handleInputChange('location', { name: selectedName });

    setSuggestions([]);
  }}
>
  {item.name || item.formatted || item.properties?.formatted}
</li>
            ))}
          </ul>
          )}
</div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How long do you want to stay?</h2>
          <input type="number" placeholder='Enter number of days' className='border border-gray-300 rounded-md p-2 w-full'
          
          onChange={(e) => handleInputChange('duration', Number(e.target.value))}
          
          />
          {/* //trying to store value in duration variable and log it to console */}
          {/* onchange event handler is added to the input field for duration of stay. When a user enters a value in this field, the handleInputChange function is called with the name 'duration' and the value entered by the user. This allows the duration of stay to be stored in the Formdata state variable, which can then be used for further processing, such as generating a personalized itinerary based on the user's preferences. */}
          
          
        </div>

<div>
  <h2 className='text-xl my-3 font-medium'>What type of travel are you looking for?</h2>
  <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hover:shadow-lg'>
    {SelectBudget.map((item, index) => (
      <div
        key={index}
        // onclick event handler is added to each travel type option. When a user clicks on an option, the handleInputChange function is called with the name 'travelType' and the value of the selected option's title. This allows the selected travel type to be stored in the Formdata state variable, which can then be used for further processing, such as generating a personalized itinerary based on the user's preferences.
        onClick={() => handleInputChange('travelType', item.title)}
        className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
          Formdata.travelType === item.title
            ? "border-black bg-gray-200 scale-105"
            : ""
        }`}
      >
        <h2 className="text-3xl">{item.icon}</h2>
        <h2 className="font-bold text-lg">{item.title}</h2>
        <p className="text-gray-500">{item.desc}</p>
      </div>
    ))}
  </div>
</div>


<div>
  <h2 className='text-xl my-3 font-medium'>With whom are you planning to travel?</h2>
  <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
    {SelectTravelersList.map((item, index) => (
      <div
        key={index}

        // /onclick event handler is added to each travel companion option. When a user clicks on an option, the handleInputChange function is called with the name 'travelCompanions' and the value of the selected option's title. This allows the selected travel companions to be stored in the Formdata state variable, which can then be used for further processing, such as generating a personalized itinerary based on the user's preferences.
        onClick={() => handleInputChange('travelCompanions', item.title)}
        className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
          Formdata.travelCompanions === item.title
            ? "border-black bg-gray-200 scale-105"
            : ""
        }`}
      >
        <h2 className="text-3xl">{item.icon}</h2>
        <h2 className="font-bold text-lg">{item.title}</h2>
        <p className="text-gray-500">{item.desc}</p>
      </div>
    ))}
  </div>
</div>

        <div className='my-10 justify-end flex '>
          <Button onClick={OnGenerateTrip} disabled={loading}>
            {loading ? "Generating..." : "Generate-Trip"}
          </Button>
        </div>

        {/* Displaying generated trip data from the API */}
        {tripData && <ItineraryDisplay tripData={tripData} />}
      </div>
    </div>
  )
}

export default Createtrip