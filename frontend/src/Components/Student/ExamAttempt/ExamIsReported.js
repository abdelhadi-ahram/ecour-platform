import React from "react";
import {
	Link
} from "react-router-dom"

function ExamIsReported(){
	return(
		<div className="flex-1 h-full flex flex-col items-center justify-center">
			<div className="w-[92%] md:w-[400px] px-6 py-4 shadow-lg bg-white dark:bg-zinc-700 rounded-lg flex flex-col space-y-3 border border-gray-300 dark:border-0">
				<p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">You having been suspended</p>
				<p className="text-gray-500 dark:text-gray-400">
					This exam has been reported and you can not continue due to a cheaing attempt
				</p>
				<div className="w-full flex items-center justify-center">
					<Link to="/my/home"><button className="bg-gray-100 dark:bg-zinc-600 text-gray-600 dark:text-gray-400 px-4 py-[5px] rounded-lg hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-zinc-500 dark:hover:text-gray-300 shadow font-semibold">Back to home</button></Link>
				</div>
			</div>
		</div>
	)
}

export default ExamIsReported;