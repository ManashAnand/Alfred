"use client";

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, BrainCircuit } from "lucide-react";
import axios from 'axios';
import { getCookie } from 'cookies-next';

import { useToast } from "@/hooks/use-toast"
import ShareAlfred from './ShareAlfred';



const ScrollArea = dynamic(() => import("@/components/ui/scroll-area").then(mod => mod.ScrollArea), { ssr: false });
const Avatar = dynamic(() => import("@/components/ui/avatar").then(mod => mod.Avatar), { ssr: false });
const AvatarFallback = dynamic(() => import("@/components/ui/avatar").then(mod => mod.AvatarFallback), { ssr: false });
const AvatarImage = dynamic(() => import("@/components/ui/avatar").then(mod => mod.AvatarImage), { ssr: false });

const Chatbot = ({ sliderPosition, userId }: { sliderPosition: number, userId: string }) => {
  const bearer = getCookie('Bearer');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you with your resume?", sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [feedLoading, setFeedLoading] = useState(false)
  const { toast } = useToast()


  // Memoize messages to prevent re-renders
  const messageComponents = useMemo(() => (
    messages.map((message, index) => (
      <div
        key={index}
        className={`flex group/message ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Avatar className="w-8 h-8">
            <AvatarFallback>{message.sender === 'user' ? 'U' : 'A'}</AvatarFallback>
            <AvatarImage src={message.sender === 'user' ? '/placeholder-user.jpg' : '/placeholder.svg?height=40&width=40'} />
          </Avatar>
          <div className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {message.text}
            <button
              onClick={() => navigator.clipboard.writeText(message.text)}
              className="  p-1 rounded hover:border-2 mx-4 dark:hover:bg-gray-700 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200"
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              {/* copy */}
            </button>
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
      const { data } = await axios.post(`/api/ask?user_id_of_dev=${userId}`, { message: inputMessage }, {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Content-Type': 'application/json',
        },
      });
      setMessages(prev => [...prev, { text: data.message, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: "Maybe your cloudflare credentials are not correct or our server is busy or might be you ask too much question too soon, Would you like to buy a Premium model ?", sender: 'bot' }]);
    }
  };

  const handleShare = () => {

  }

  const handleFeedData = async () => {
    const currentFeed = messages
      .map((message) => `${message.sender}: ${message.text}`)
      .join('\n');

    console.log(currentFeed)
    setFeedLoading(true)
    try {
      const { data } = await axios.post(`/api/add_user_feed?user_id_of_dev=${userId}`, { currentFeed: currentFeed }, {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(data)
      if (!data.owner) {
        toast({
          title: "Sir, Respectfully you are not the owner",
          description: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }),
        })
      }
      if (data.status == "success") {
        if (data.owner) {
          toast({
            title: "Data sent to your personal Alfred",
            description: new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }),
          })
        }
      }

      setFeedLoading(false)
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending current feed to your Alfred",
        description: new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
      })

      setFeedLoading(false)
    }
    finally {
      setFeedLoading(false)
    }
  }
  return (
    <div className="w-full lg:w-[50%] p-4 flex flex-col h-[98vh] " style={{ width: `${100 - sliderPosition}%` }}>
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
            <div className="flex gap-2">

              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
              <Button onClick={handleFeedData} size="icon" disabled={feedLoading}>
                <BrainCircuit className="h-4 w-4" />
                <span className="sr-only">Feed Data</span>
              </Button>
            </div>
          </div>

         <ShareAlfred userId={userId}/>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
