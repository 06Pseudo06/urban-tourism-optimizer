import React, { use } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { SelectBudget} from '../constants/options'
import { SelectTravelersList } from '../constants/options'
import { Button } from "@/components/ui/button"
import { useEffect } from 'react';
import { Form } from 'react-router-dom'

function Createtrip() {
  const [place, setPlace] = React.useState(null)

  // trying to store the form data in a state variable called Formdata, which is an array. The setFormdata function will be used to update this state variable when the user fills out the form.
  const[Formdata, setFormdata] = React.useState([])

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


     // This function will be called when the user clicks the "Generate-Trip" button. It can be used to process the form data and generate a personalized itinerary based on the user's preferences. The implementation of this function will depend on how you want to handle the trip generation logic, such as making API calls to a backend service or using a local algorithm to create the itinerary.
  const OnGenerateTrip=() => {
    if(FormData?.duration >5 &&!FormData?.travelType || !FormData?.location || !FormData?.travelCompanions){
      return;
    }
    console.log("Generating trip with the following preferences:", Formdata);
    // Add your trip generation logic here, such as making an API call to a backend service or using a local algorithm to create the itinerary based on the Formdata.
  }


  // The component returns a JSX structure that represents the form for creating a trip. It includes input fields for the destination, duration of stay, type of travel, and travel companions. The GooglePlacesAutocomplete component is used for the destination input, allowing users to search for places using the Google Places API. The options for the type of travel and travel companions are rendered using the SelectBudget and SelectTravelersList arrays, respectively. Finally, there is a button to generate the trip based on the provided information.
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:p-10 p-5 mt-10' text-center>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>Tell us about your ideal trip and we'll create a personalized itinerary for you!</p>


      <div className='mt-20 flex flex-col gap-9'>
        <div>
          <h2 className='text-xl my-3 font-medium'>Where do you want to go?`</h2>

          {/* key for using google places autocomplete API, stored in .env.local file and accessed using import.meta.env */}

          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} //API KEY from .env.local
            selectProps={{
              place,
              onChange: v => { setPlace(v); handleInputChange('location', v) } //trying to store value in place variable and log it to console
            }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How long do you want to stay?</h2>
          <input type="number" placeholder='Enter number of days' className='border border-gray-300 rounded-md p-2 w-full'
          
          onChange={(e) => handleInputChange('duration', e.target.value)}
          
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
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md"
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
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md"
              >
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='my-10 justify-end flex '>
          <Button>Generate-Trip</Button>
        </div>
      </div>
    </div>
  )
}

export default Createtrip