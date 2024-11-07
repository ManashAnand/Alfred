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
import { Badge } from "@/components/ui/badge"

import { TwitterIcon, User2Icon, GithubIcon, Code2Icon, CodeIcon, ComputerIcon, TextIcon, UserCircle } from "lucide-react";



const LatestUsers = () => {
    const bearer = getCookie('Bearer');
    const [lastestUser, setLatestUser] = useState<any[]>([]);

    useEffect(() => {
        const latestUser = async () => {
            try {
                const { data } = await axios.get(`/api/lastestUser?totalUser=${6}`, {
                    headers: {
                        Authorization: `Bearer ${bearer}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(data)
                if (data.success) {
                    setLatestUser(data.data)
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }

        latestUser()
    }, [])

    interface SocialLink {
        platform: string;
        url: string;
        icon: React.ReactNode;
    }


    return (

        <div className="gap-4 md:grid grid-cols-3 mb-4 flex flex-col">
            {
                lastestUser?.map(cardowner => {
                    const socialLinks: SocialLink[] = [
                        { platform: 'leetcode', url: cardowner.leetcode, icon: <CodeIcon /> },
                        { platform: 'github', url: cardowner.github, icon: <GithubIcon /> },
                        { platform: 'codeforces', url: cardowner.codeforces, icon: <Code2Icon /> },
                        { platform: 'atcoder', url: cardowner.atcoder, icon: <CodeIcon /> },
                        { platform: 'codechef', url: cardowner.codechef, icon: <Code2Icon /> },
                        { platform: 'kaggle', url: cardowner.kaggle, icon: <ComputerIcon /> },
                        { platform: 'medium', url: cardowner.medium, icon: <TextIcon /> },
                        { platform: 'blogs', url: cardowner.blogs, icon: <TextIcon /> },
                        { platform: 'portfolio', url: cardowner.portfolio, icon: <User2Icon /> },
                        { platform: 'twitter', url: cardowner.twitter, icon: <TwitterIcon /> }
                    ].filter(link => link.url !== "");    // Only keep links that aren't empty

                    return (

                        <Card key={cardowner?.user_id}>
                            <CardHeader>
                                <CardTitle>{cardowner?.firstName} {cardowner?.lastName}</CardTitle>
                            </CardHeader>
                            <CardContent className='flex gap-2'>
                                {
                                    cardowner?.tags?.map((tag: { tag_id: string, label: string }) => {
                                        return (
                                            <div key={tag.tag_id}>
                                                <Badge variant="outline">{tag?.label}</Badge>

                                            </div>
                                        )
                                    })
                                }
                            </CardContent>
                            <CardContent className='gap-2'>
                                {socialLinks.map((link) => (
                                    <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className='flex w-full justify-between items-center my-2 hover:bg-slate-800 p-2 rounded-md'>

                                        {link.icon} {link.platform}
                                    </a>
                                ))}
                            </CardContent>
                            <CardFooter>
                                About
                            </CardFooter>
                            <CardFooter>
                            {cardowner?.myself?.slice(0, 10)}
                                {(cardowner?.myself?.length || 0) > 10 ? '...' : ''}
                        
                            </CardFooter>
                        </Card>


                    )
                })
            }

        </div>
    )
}

export default LatestUsers
