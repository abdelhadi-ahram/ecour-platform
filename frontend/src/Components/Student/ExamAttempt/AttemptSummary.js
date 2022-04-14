import React from "react";

function AttemptSummary(){
	return(
		<div className="flex-1 flex flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center space-y-3">
				<svg className="w-32 h-32 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
				<p className="text-xl text-gray-300 font-semibold">Your attempt has been saved successfully</p>
			</div>
		</div>	
	)
}

export default AttemptSummary