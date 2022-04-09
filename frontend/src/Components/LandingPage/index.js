import React from "react";
import {buttons} from "./buttons"
import Sidebar from '../Sidebar';
import LandingPageRightPanel from "./LandingPageRightPanel"

function LandingPage(){
	return(
		<div className="w-screen h-screen bg-[#f5f6f8] dark:bg-zinc-900 font-nunito flex">
		    <Sidebar buttons={buttons} />

		  <div className="w-full h-screen">
		  	<LandingPageRightPanel />
		  </div>

		</div>
	)
}

export default LandingPage