"use client";
import { useParams } from 'next/navigation'
import React from 'react'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { Send, GripVertical } from "lucide-react"
// import Chatbot from '@/components/custom/Chatbot';
// import DocViewer from '@/components/custom/DocViewer';
const Chatbot = dynamic(() => import('@/components/custom/Chatbot'), {
    loading: () => <div>Loading chat...</div>
  })
  
  const DocViewer = dynamic(() => import('@/components/custom/DocViewer'), {
    loading: () => <div>Loading document viewer...</div>
  })

const ChatSection = () => {
    const { user_id } = useParams()
    const userId = Array.isArray(user_id) ? user_id[0] : user_id
    

    const [sliderPosition, setSliderPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)



    const handleMouseDown = () => {
        setIsDragging(true)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: any) => {
        if (isDragging && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect()
            const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100
            setSliderPosition(Math.min(Math.max(newPosition, 20), 80))
        }
    }

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mousemove', handleMouseMove)

        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isDragging])

    return (
        <div className="  w-full  flex flex-col mt-4 ">
            <div
                ref={containerRef}
                className="flex flex-col lg:flex-row h-screen bg-background relative"
                onMouseMove={handleMouseMove}
            >
                {/* Resume Preview */}
                <DocViewer sliderPosition={sliderPosition} />

                {/* Slider */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-gray-300 cursor-col-resize hidden lg:block"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                        <GripVertical className="text-gray-600" />
                    </div>
                </div>

                {/* Chatbot */}
                <Chatbot sliderPosition={sliderPosition} />
            </div>
        </div>
    )
}

export default ChatSection
