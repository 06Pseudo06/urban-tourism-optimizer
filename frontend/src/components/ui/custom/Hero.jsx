import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-8'>
        <h1 className='font-extrabold text-center'>
            <span className='text-[#f56551] text-[55px]'>Turn Your Travel Dreams Into Reality🎢</span>
            <span className='text-[#8e1e1e] text-[45px] mt-2'>Plan Your Perfect Trip in Seconds</span><br /><br />
            <p className='text-xl text-gray-500 text-center'>“Because every journey deserves to be unforgettable, not just in places you visit but in the memories you create along the way.”</p>
            <br /><br />
            <Link to={'./create-trip'}>
                <Button>Lets get started..</Button>
            </Link>
        </h1>
    </div>
  )
}

export default Hero