"use client";

import React, { useState } from 'react'

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, GripVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios';
import { getCookie } from 'cookies-next';


const Chatbot = ({ sliderPosition }: { sliderPosition: number }) => {

    const bearer = getCookie('Bearer');
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI assistant. How can I help you with your resume?", sender: 'bot' },
    ])

    const [inputMessage, setInputMessage] = useState('')

    const handleSendMessage = async () => {
        if (inputMessage.trim() !== '') {
            setMessages(prev => {
                const newMessages = [...prev, { text: inputMessage, sender: 'user' }];
                // setMessages(prev => [...prev, {
                //     text: "I'm processing your request. How else can I assist you?",
                //     sender: 'bot'
                // }])
                return newMessages;
            });
            console.log(inputMessage)

            const { data } = await axios.post('/api/ask', { message: inputMessage }, {
                headers: {
                    'Authorization': `Bearer ${bearer}`,
                    'Content-Type': 'application/json'  
                }
            });
            console.log(data)
            setMessages(prev => [...prev, { 
                text: data.message, 
                sender: 'bot' 
            }]);
            setInputMessage('');
        }
    }

    return (
        <>
            <div className="w-full lg:w-[50%] p-4 flex flex-col h-screen " style={{ width: `${100 - sliderPosition}%` }}>
                <Card className="flex-grow flex flex-col">
                    <CardHeader>
                        <CardTitle>Resume Assistant</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <ScrollArea className="flex-grow mb-4 pr-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        } mb-4`}
                                >
                                    <div
                                        className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                    >
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback>{message.sender === 'user' ? 'U' : 'A'}</AvatarFallback>
                                            <AvatarImage src={message.sender === 'user' ? '/placeholder-user.jpg' : '/placeholder.svg?height=40&width=40'} />
                                        </Avatar>
                                        <div
                                            className={`mx-2 p-3 rounded-lg ${message.sender === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                                }`}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                        <div className="flex items-center">
                            <Input
                                placeholder="Type your message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-grow mr-2"
                            />
                            <Button onClick={handleSendMessage} size="icon">
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send message</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Chatbot
