"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import axios from 'axios';

import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/use-toast';





const PersonalFlare = () => {
    const bearer = getCookie('Bearer');

    const { toast } = useToast()
    const { user_id } = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const formSchema = z.object({
        CLOUDFLARE_ACCOUNT_ID: z.string().min(2, {
            message: "CLOUDFLARE_ACCOUNT_ID must be at least 2 characters.",
        }),
        CLOUDFLARE_AUTH_TOKEN: z.string().min(2, {
            message: "CLOUDFLARE_ACCOUNT_ID must be at least 2 characters.",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            CLOUDFLARE_ACCOUNT_ID: "",
            CLOUDFLARE_AUTH_TOKEN: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        setLoading(true)
        try {
            const { data } = await axios.post(`/api/cloudflare?user_id=${user_id}`, {
                CLOUDFLARE_ACCOUNT_ID: values.CLOUDFLARE_ACCOUNT_ID,
                CLOUDFLARE_AUTH_TOKEN: values.CLOUDFLARE_AUTH_TOKEN,

            }, {
                headers: {
                    Authorization: `Bearer ${bearer}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(data)
            if(data.success){
                toast({
                    title: "Alfred at your service sir",
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
                router.push('/')
            }
            setLoading(false)
        } catch (error) {
            console.error('Error sending message:', error);
            setLoading(false)
        } finally {
            setLoading(false)
        }
        setOpen(false)
    }

    return (
        <>
            <div className="flex justify-center items-center">

                <div className="container  mt-10">
                    <div className='my-5'>
                        <h1>Get your Cloudflare Id and Auth Token from cloudflare official site </h1>
                        <Link
                            href="https://dash.cloudflare.com/profile/api-tokens"
                            className="bg-yellow-600 text-white mt-2 gap-2 p-2 rounded-md max-w-xs flex justify-center items-center active:scale-95">
                            Cloudflare Official API Token
                        </Link>

                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="CLOUDFLARE_ACCOUNT_ID"
                                render={({ field }) => (
                                    <FormItem className='max-w-xl'>
                                        <FormLabel>CLOUDFLARE ACCOUNT ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CLOUDFLARE ACCOUNT ID" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your private CLOUDFLARE ACCOUNT ID.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="CLOUDFLARE_AUTH_TOKEN"
                                render={({ field }) => (
                                    <FormItem className='max-w-xl'>
                                        <FormLabel>CLOUDFLARE AUTH TOKEN</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CLOUDFLARE AUTH TOKEN" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your private CLOUDFLARE AUTH TOKEN.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" disabled={loading}>{loading? "Loading...":"Submit"}</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently add your Cloudflare Id and auth token to our database
                                            .
                                        </AlertDialogDescription>
                                        <AlertDialogDescription>
                                            Cross verify your credentials ,

                                        </AlertDialogDescription>
                                        <AlertDialogDescription className='text-red-600'>

                                            If you put a wrong credential there is no way we can give you an alert and simply your Alfred will not work for you.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                                            {loading ? "Loading ...":"Confirm"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </form>
                    </Form>
                </div>
            </div>

        </>
    )
}

export default PersonalFlare
