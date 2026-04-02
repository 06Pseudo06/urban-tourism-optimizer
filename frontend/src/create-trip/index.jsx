import React from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { SelectBudget } from '../constants/options'

function Createtrip() {
  const[place, setPlace] = React.useState(null)
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:p-10 p-5 mt-10' text-center>
      <h2  className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-gray-500 text-xl'>Tell us about your ideal trip and we'll create a personalized itinerary for you!</p>
    

      <div className='mt-20 flex flex-col gap-9'>
        <div>
          <h2 className='text-xl my-3 font-medium'>Where do you want to go?`</h2>

          {/* key for using google places autocomplete API, stored in .env.local file and accessed using import.meta.env */}

          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} //API KEY from .env.local
            selectProps={{
              place,
              onChange:v=> {setPlace(v);console.log(v)} //trying to store value in place variable and log it to console
            }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How long do you want to stay?</h2>
          <input type="number" placeholder='Enter number of days' className='border border-gray-300 rounded-md p-2 w-full'/>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>What type of travel are you looking for?</h2>
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {/* map through the SelectTravelsList array and display the options */}
            {SelectBudget.map((item,index)=>{
              <div key={index}>
                    <h2>{item.icon}</h2>
              </div>
            })}
          </div>  
        </div>
      </div>
    </div>
  )
}

export default Createtrip