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
            <div>
                {images?.imageUrls?.map((image: ImageType) => (
                    <div key= {image.name}>
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