"use client"

import React from 'react'
import useSWR from 'swr'
import fetchImages from "../lib/fetchImages"
import Image from "next/image"

type ImageType = {
    name: string;
    url: string;
  };

function Images() {
    const {
        data: images,
        isLoading,
        isValidating,
    } = useSWR("/api/getimages", fetchImages, { // the first param is a key
        revalidateOnFocus: false,
    })
    console.log(images?.imageUrls)
    return (
        <div>
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            xl:grid-cols-4 2xl:grid-cols-5 px-0 md:px-10'>
                {images?.imageUrls?.map((image: ImageType, i:number) => (
                    <div key= {image.name}
                        className=
                        {`relative cursor-help 
                        ${
                            i === 0 && "md:col-span-2 md:row-span-2"
                        }
                        hover:scale-[103%] transition-transform
                        duration-200 ease-in-out`
                    }
                    >
                        <div className='absolute flex justify-center items-center
                        w-full h-full bg-white opacity-0 hover:opacity-80
                         transition-opacity duration-200 z-10'>
                            <p className='text-center font-light text-lg p-5'>
                                {/* this removes the timestamp and file extension */}
                                {image.name.split("_").shift()?.toString().split(".").shift()}
                            </p>
                        </div>
                        <Image 
                            src={image.url}
                            alt={image.name}
                            height={800}
                            width={800}
                            className='w-full rounded-sm shadow-2xl 
                            drop-shadow-lg -z-10'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Images