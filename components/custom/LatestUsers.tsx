"use client";

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios';
import { getCookie } from 'cookies-next';

const LatestUsers = () => {
    const bearer = getCookie('Bearer');
    const [lastestUser,setLatestUser] = useState<any[]>([]);

    useEffect(() => {
        const  latestUser = async () => {
            try {
                const { data } = await axios.get(`/api/lastestUser?totalUser=${6}`, {
                  headers: {
                    Authorization: `Bearer ${bearer}`,
                    'Content-Type': 'application/json',
                  },
                });
                console.log(data)
                if(data.success){
                    setLatestUser(data.data)
                }
              } catch (error) {
                console.error('Error sending message:', error);
              }
        }

        latestUser()
    },[])


  return (
  
    <div className="gap-4 md:grid grid-cols-3 mb-4 flex flex-col">
       {
            lastestUser?.map(i => {
              return (

                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Card Title 2</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card Content</p>
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
                </Card>


              )
            })
          }

    </div>
  )
}

export default LatestUsers
