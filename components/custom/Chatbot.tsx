"use client";

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import axios from 'axios';
import { getCookie } from 'cookies-next';

// Dynamic imports for larger components
// Update the dynamic import to include the ScrollArea type
const ScrollArea = dynamic(() => import("@/components/ui/scroll-area").then(mod => mod.ScrollArea), { ssr: false });
const Avatar = dynamic(() => import("@/components/ui/avatar").then(mod => mod.Avatar), { ssr: false });
const AvatarFallback = dynamic(() => import("@/components/ui/avatar").then(mod => mod.AvatarFallback), { ssr: false });
const AvatarImage = dynamic(() => import("@/components/ui/avatar").then(mod => mod.AvatarImage), { ssr: false });

const Chatbot = ({ sliderPosition }: { sliderPosition: number }) => {
  const bearer = getCookie('Bearer');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you with your resume?", sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Memoize messages to prevent re-renders
  const messageComponents = useMemo(() => (
    messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Avatar className="w-8 h-8">
            <AvatarFallback>{message.sender === 'user' ? 'U' : 'A'}</AvatarFallback>
            <AvatarImage src={message.sender === 'user' ? '/placeholder-user.jpg' : '/placeholder.svg?height=40&width=40'} />
          </Avatar>
          <div className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {message.text}
          </div>
        </div>
      </div>
    ))
  ), [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
    setInputMessage('');

    try {
      const { data } = await axios.post('/api/ask', { message: inputMessage }, {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Content-Type': 'application/json',
        },
      });
      setMessages(prev => [...prev, { text: data.message, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="w-full lg:w-[50%] p-4 flex flex-col h-screen" style={{ width: `${100 - sliderPosition}%` }}>
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Resume Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow mb-4 pr-4">
            {messageComponents}
          </ScrollArea>
          <div className="flex items-center">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
  );
};

export default Chatbot;
