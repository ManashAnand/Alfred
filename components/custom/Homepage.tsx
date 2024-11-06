"use client";

import React, { useState } from 'react'
import Lottie from "lottie-react";
import aibot from '@/public/aibot.json'
// import aibot from '@/assets/aibot.json';
import { User2Icon, MessageCircle, ComputerIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { getCookie } from 'cookies-next';

const Homepage = () => {
    const router = useRouter()
    const bearer = getCookie('Bearer');
    const [userId, setUserId] = useState<string | null>(null);


    const fetchUserData = async (bearer: string) => {
        try {
            const response = await fetch('/api/get_user_id', {
                headers: {
                    'Authorization': `Bearer ${bearer}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (bearer) {
            fetchUserData(bearer)
                .then(data => setUserId(data.user_id))
                .catch(error => console.error('Error:', error));
        }
    }, [bearer]);


    return (
        <>
            <section className="text-gray-600 body-font ">
                <div className="container  flex px-5 py-24 md:flex-row flex-col items-center  min-w-full ">
                    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center min-w-1/2 ">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white/80 ">Your
                            <span className='underline mx-2 decoration-wavy decoration-orange-600'>
                                AI
                            </span>
                            personality, Social Platform
                        </h1>
                        <p className="mb-8 leading-relaxed min-w-full text-white/70">
                            Hey we have an oppurtunity for you ?
                            <br className="hidden lg:inline-block" />
                            But you are offline, how to have an idea of you
                            <br className="hidden lg:inline-block" />
                            Bad timing let try after sometime , or
                            <span className='text-red-400 ml-2'>

                                choose someone else
                            </span>

                        </p>
                        <div className="flex justify-center min-w-1/2">
                            <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                                onClick={() => router.push('/form')}
                            >
                                Create you own AI <ComputerIcon className='ml-2' />
                            </button>
                            <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
                                onClick={() => router.push(`/Chatbot/${userId}`)}
                            >
                                Go to your Chat <MessageCircle className='ml-2' />
                            </button>
                        </div>
                    </div>
                    <div className="lg:max-w-md lg:w-full md:w-1/2 w-5/6">
                        <Lottie animationData={aibot} loop={true} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Homepage