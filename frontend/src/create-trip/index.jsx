import React from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

function Createtrip() {
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:p-10 p-5 mt-10' text-center>
      <h2  className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-gray-500 text-xl'>Tell us about your ideal trip and we'll create a personalized itinerary for you!</p>
    

      <div className='m-20'>
        <div>
          <h2 className='text-xl my-3 font-medium'>Where do you want to go?`</h2>
          <GooglePlacesAutocomplete
          
          />
        </div>
      </div>
    </div>
  )
}

export default Createtrip