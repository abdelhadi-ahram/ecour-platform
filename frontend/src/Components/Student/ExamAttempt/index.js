import React from "react";

function ExamAttempt(){
	return(
		<div className=" px-2 flex space-x-1 grow overflow-y-hidden">
          <div className="w-3/4 shrink overflow-y-auto pr-2">
            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-900 blur sticky top-0"></div>
                hello world
          </div>


          <div className="w-1/4 rounded-lg p-1 grow-0">
            hello world
          </div>

        </div>
	)
}


export default ExamAttempt;