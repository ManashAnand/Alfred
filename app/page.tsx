
import Homepage from "@/components/custom/Homepage";
import * as React from "react"
import LatestUsers from "@/components/custom/LatestUsers";

export default function Home() {

  return (

    <div className="  max-w-screen  flex flex-col justify-center items-center mt-4 ">
      <div className="container ">

        <Homepage />
        <LatestUsers />

      </div>

    </div>
  );
}