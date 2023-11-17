"use client"

import fetchSuggestion from '@/lib/fetchSuggestionFromChatGPT'
import React, { FormEvent, useState } from 'react'
import useSWR from 'swr'

export default function PromptInput() {
    const [input, setInput] = useState("")
    // validating for refreshing the cache, mutating if we want to call manually.
    const {data: suggestion, isLoading, mutate, isValidating} = useSWR(
        '/api/suggestion', 
        fetchSuggestion,
        {revalidateOnFocus: false},
    )
    const loading = isLoading || isValidating
    const submitPrompt = async (useSuggestion?: boolean) => {
        const inputPrompt = input
        setInput("") // clearing after generate/usesuggestion
        console.log(inputPrompt)
        const prompt = useSuggestion ? suggestion : inputPrompt
        const response = await fetch('/api/generateimage', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({ prompt: prompt })
            }
        )
        const data = await response.json()

    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await submitPrompt()
    }
    return (
        <div className='m-10'>
            <form 
                className='flex flex-col lg:flex-row shadow-md
                shadow-slate-400/10 border rounded-md lg:divide-x'
                onSubmit={handleSubmit}
            >
                <textarea 
                    className='flex-1 p-4 outline-none rounded-md'
                    placeholder= {
                        (loading && "ChatGPT is thinking of a suggestion..") ||
                        suggestion || 
                        'Enter a prompt..'
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className={`p-4 ${input ? 
                        'bg-violet-500 text-white transition-colors duration-200' 
                        : 
                        'text-gray-300 cursor-not-allowed'}`
                    }
                    type='submit'
                    disabled={!input}
                >
                    Generate
                </button>
                <button
                    type='button'
                    className='p-4 bg-violet-400
                    text-white transition-colors duration-200 font-bold 
                    disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-400'
                    onClick={() => submitPrompt(true)}
                >
                    Use Suggestion
                </button>
                <button
                    type='button'
                    className='p-4 bg-white text-violet-500 border-none
                    transition-colors duration-200 rounded-b-md md:rounded-r-md
                    md:rounded-bl-none font-bold'
                    onClick={mutate}
                >
                    New Suggestion
                </button>
            </form>
            {input && (
                <p className='italic pt-2 pl-2 font-light'>
                    Suggestion: {" "}
                    <span className='text-violet-500'>
                        {loading ? "ChatGPT is thinking..": suggestion}
                    </span>
                </p>
            )}
        </div>
    )
}
