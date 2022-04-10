import React from "react";

function LoadingAnswer(){
	return(
		<div className="flex flex-col space-y-3 py-1 px-2 flex-1 overflow-y-auto animate-pulse">
			<div className="w-full flex items-center justify-between rounded-md border border-gray-300 dark:border-zinc-700 p-2">
				<div className="w-32 h-6 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
				<div className="flex items-center space-x-2">
					<div className="rounded-full bg-gray-200 dark:bg-zinc-700 h-6 w-16"></div>
					<div className="rounded-full bg-gray-200 dark:bg-zinc-700 h-6 w-16"></div>
					<div className="rounded-full bg-gray-200 dark:bg-zinc-700 h-6 w-16"></div>
				</div>
			</div>
			<div className="flex flex-col p-2 flex-1 overflow-y-auto space-y-4 py-10">
				<div className="py-6 bg-gray-200 dark:bg-zinc-700 h-16 w-full rounded"></div>
				<div className="flex flex-col space-y-2 pl-6">
					<div className="px-3 py-2 w-full h-10 bg-gray-200 dark:bg-zinc-700"></div>
					<div className="px-3 py-2 w-full h-10 bg-gray-200 dark:bg-zinc-700"></div>
					<div className="px-3 py-2 w-full h-10 bg-gray-200 dark:bg-zinc-700"></div>
					<div className="px-3 py-2 w-full h-10 bg-gray-200 dark:bg-zinc-700"></div>
				</div>
			</div>
			<div className="flex items-center justify-end p-2 w-full">
              <div className="bg-gray-200 dark:bg-zinc-700 rounded-md w-32 h-8"></div>
            </div>
		</div>
	)
}

export default LoadingAnswer;