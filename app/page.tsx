
import Homepage from "@/components/custom/Homepage";
import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
 
  return (

    <div className="  max-w-screen  flex flex-col justify-center items-center mt-4 ">
      <div className="container ">

        <Homepage />
        <div className="gap-4 md:grid grid-cols-3 mb-4 flex flex-col">
          {
            Array.from([1, 2, 3, 4, 5, 6]).map(i => {
              return (

                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
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
      </div>

    </div>
  );
}