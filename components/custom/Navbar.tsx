"use client";
import { ArrowRightCircle } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { LogInIcon, LogOutIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default  function Navbar() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userId,setUserId] = useState<String | undefined>("")
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session)
            // console.log(session)
            setUserId(session?.user?.id)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session)
        })

        return () => subscription.unsubscribe()
    }, [])



    function handleLogout() {
        supabase.auth.signOut()
            .then(() => {
                router.push('/login')
            })
            .catch((error) => {
                console.error('Error logging out:', error)
            })
    }

    return (
        <div className="  max-w-screen   flex justify-center items-center mt-4 p-2 sm:p-0">
            <div className="container  flex justify-between items-center">

                <span className="text-3xl underline decoration-wavy decoration-orange-600 cursor-pointer" onClick={() => router.push('/')}>Alfred.ai</span>

                <div className='flex gap-2 justify-center items-center'>

                    {isAuthenticated ? (
                        <Button onClick={handleLogout}>Logout <LogOutIcon /></Button>
                    ) : (
                        <Button onClick={() => router.push('/login')}>Login <LogInIcon /></Button>
                    )}

                    {/* <Link href="https://dash.cloudflare.com/profile/api-tokens" className="bg-yellow-600 text-white flex gap-2 p-2 rounded-md"> */}
                    <Link href={`/Cloudflare/${userId}`} className="bg-yellow-600 text-white flex gap-2 p-2 rounded-md">
                        Cloudflare 
                        <span>
                            <ArrowRightCircle />
                        </span>
                    </Link>
                </div>

            </div>

        </div>
    )
}