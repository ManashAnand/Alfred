"use client";

import dynamic from 'next/dynamic';
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import axios from "axios";
import { getCookie } from 'cookies-next';
import { useToast } from "@/hooks/use-toast"

import { useState } from "react";
import { useRouter } from "next/navigation";

const UsefulLinksField = dynamic(() => import('@/components/custom/UseFullLinksField'), {
    loading: () => <div>Loading Usefull links...</div>,
    ssr: false
  })
  
  const TagField = dynamic(() => import('@/components/custom/TagField'), {
    loading: () => <div>Loading Tags...</div>,
    ssr: false
  })



const formSchema = z.object({
    firstName: z.string().min(2, { message: "firstName must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "firstName must be at least 2 characters." }),
    myself: z.string().min(2, { message: "About must be at least 2 characters." }),
    leetcode: z.string().optional(),
    github: z.string().optional(),
    codeforces: z.string().optional(),
    atcoder: z.string().optional(),
    codechef: z.string().optional(),
    kaggle: z.string().optional(),
    medium: z.string().optional(),
    blogs: z.string().optional(),
    portfolio: z.string().optional(),
    twitter: z.string().optional(),
    resume: z.any().optional(),
    Tag: z.any().optional(),
})

const frameworks = [
    {
        value: "frontend-developer",
        label: "Frontend Developer",
    },
    {
        value: "backend-developer",
        label: "Backend Developer",
    },
    {
        value: "fullstack-developer",
        label: "Full Stack Developer",
    },
    {
        value: "mobile-developer",
        label: "Mobile Developer",
    },
    {
        value: "ui-designer",
        label: "UI Designer",
    },
    {
        value: "ux-designer",
        label: "UX Designer",
    },
    {
        value: "product-designer",
        label: "Product Designer",
    },
    {
        value: "graphic-designer",
        label: "Graphic Designer",
    },
    {
        value: "devops-engineer",
        label: "DevOps Engineer",
    },
    {
        value: "data-scientist",
        label: "Data Scientist",
    },
    {
        value: "ml-engineer",
        label: "Machine Learning Engineer",
    },
    {
        value: "cloud-architect",
        label: "Cloud Architect",
    }
]

const FormPage = () => {
    const [loading, setLoading] = useState<Boolean>(false);
    const router = useRouter()
    const bearer = getCookie('Bearer');
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const { toast } = useToast()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            myself: "",
            leetcode: "",
            github: "",
            codeforces: "",
            atcoder: "",
            codechef: "",
            kaggle: "",
            medium: "",
            blogs: "",
            portfolio: "",
            twitter: "",
            resume: "",
            Tag: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true)
        console.log(values)
        // return
        try {
            const formData = new FormData()

            // Add all text fields
            Object.keys(values).forEach(key => {
                if (key !== 'resume') {
                    formData.append(key, values[key as keyof typeof values]?.toString() || '')
                }
            })

            // Add resume file if it exists
            if (values.resume instanceof FileList && values.resume.length > 0) {
                formData.append('resume', values.resume[0])
            }



            const { data } = await axios.post('/api/user-social-data', formData, {
                headers: {
                    'Authorization': `Bearer ${bearer}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (data.status === 'success') {
                console.log(data.data)
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
                // router.push(`/Chatbot`)
            }
            setLoading(false)
            // console.log(data)
        } catch (error) {
            console.log(error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }


    return (
        <>

            <div className="  max-w-screen  flex  flex-col mt-4 justify-between items-center mb-2">
                <div className="container ">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="sm:flex gap-2 px-2 sm:px-0">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="first name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display first name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="last name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display last name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="myself"
                                render={({ field }) => (
                                    <FormItem className="px-2 sm:px-0">
                                        <FormLabel>About </FormLabel>

                                        <Textarea  {...field} />
                                        <FormDescription>
                                            This is your public display about you.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <div className="px-2 sm:px-0">Usefull links </div>
                            <UsefulLinksField form={form} />
                            <div className="max-w-xl">
                                <FormField
                                    control={form.control}
                                    name="resume"
                                    render={({ field: { onChange, ...field } }) => (
                                        <FormItem className="px-2 sm:px-0">
                                            <FormLabel>Resume </FormLabel>

                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => {
                                                        const files = e.target.files
                                                        onChange(files)
                                                    }}
                                                    {...field}
                                                    value={undefined} // This prevents 
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Upload your resume (PDF, DOC, or DOCX)

                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <TagField form={form} />

                            <Button type="submit" className="mx-2 sm:mx-0">{loading ? "Loading..." : "Submit"}</Button>
                        </form>
                    </Form>
                </div>

            </div>
        </>
    )
}

export default FormPage
