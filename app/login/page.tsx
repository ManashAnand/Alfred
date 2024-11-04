"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { login , signup} from "./action"

export default function LoginSignup() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [loginEmail,setEmailLogin] = useState<string>("")
  const [loginPassword,setLoginPassword] = useState<string>("")

  const [signupEmail,setEmailSingup] = useState<string>("")
  const [signupPassword,setSingupPassword] = useState<string>("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Here you would typically send the form data to your backend
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call

    setIsLoading(false)
  }

  const handleLogin = async (email:string,password:string) => {
      // await login(email,password)
      setIsLoading(true)
      const formData = new FormData()
      formData.append('email',email)
      formData.append('password',password)
      console.log(formData)
      await login(formData)
      setIsLoading(false)


  }
  const handleSignup = async (email:string,password:string) => {
      // await login(email,password)
      
      setIsLoading(true)
      const formData = new FormData()
      formData.append('email',email)
      formData.append('password',password)
      console.log(formData)
      await signup(formData)
      setIsLoading(false)

  }
  

  return (
    <div className="min-h-screen w-full flex justify-center items-center ">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Login or create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div >
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="Enter your email" required value={loginEmail} onChange={(e) => setEmailLogin(e.target.value)}/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" placeholder="Enter your password" required  value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit" disabled={isLoading} onClick={() => handleLogin(loginEmail,loginPassword)}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  {/* <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input id="signup-name" placeholder="Enter your name" required />
                  </div> */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="Enter your email" required value={signupEmail} onChange={(e) => setEmailSingup(e.target.value)}/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" placeholder="Create a password" required value={signupPassword} onChange={e => setSingupPassword(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit" disabled={isLoading} onClick={() => handleSignup(signupEmail,signupPassword)}>
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}