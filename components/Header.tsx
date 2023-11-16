import React from 'react'
import Image from 'next/image'

function Header() {
  return (
    <header className='sticky top-0 shadow-lg'>
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 text-center flex items-center justify-center">
                <h1 className="text-3xl font-semibold text-white flex items-center">
                <Image src="/header_drop.png" alt="logo" width="45" height="50" className="mr-2" />
                <span>Inspire</span>
                <span className="text-pink-300">Art</span>
                <span className="text-red-300 font-bold">:</span>
            </h1>
            <div className="ml-2">
                <p className="mt-2 text-gray-200 text-xs md:text-base">
                <span className="italic font-bold">SIMPLY</span>, unleash your creativity.
                </p>
            </div>
        </div>
    </header>
  )
}

export default Header