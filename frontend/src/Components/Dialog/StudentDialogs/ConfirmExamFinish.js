import React from "react";
import {Transition}from "@headlessui/react"
import moment from "moment"

function ConfirmExamFinish({isShown, onCancel, onOk, leftTime}){
	return(
	<div className="">
		<div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
		      <div className="bg-black opacity-20 dark:opacity-40 fixed inset-0  z-0"></div>
		      <Transition
		          as={React.Fragment}
		          appear="true"
		          show={isShown}
		          enter="transform transition duration-[400ms]"
		          enterFrom=" scale-0"
		          enterTo="scale-100"
		          leave="transform transition duration-[400ms]"
		          leaveFrom="scale-100"
		          leaveTo="scale-0"
		        >
		        <div className="w-[400px] p-6 rounded-xl bg-white dark:bg-zinc-800 z-40 flex flex-col items-center justify-center space-y-1">
		          <div className="w-full flex flex-col space-y-4">
		            <p className="text-gray-600 dark:text-gray-300 font-bold text-md">Confirm quitting</p>
		            <div>
			            <p className="text-gray-600 dark:text-gray-400 ">Are you sure you want to quit this exam? </p>
			            <p className="text-gray-600 dark:text-gray-400 ">there still 
			            <span className="px-2 bg-gray-100 dark:bg-zinc-700 rounded mx-2">{moment.utc(leftTime*1000).format("HH:mm:ss")}</span> for this exam to be closed</p>
		            </div>
		            <div className="flex items-center justify-center">
		              <button onClick={onCancel} className="cancel-btn">Cancel</button>
		              <button onClick={onOk} className="bg-red-50 dark:bg-zinc-700 text-red-500 font-semibold py-[6px] px-3 rounded-md hover:bg-red-50 hover:text-red-500 dark:hover:bg-zinc-600 dark:hover:text-red-400">Confirm</button>
		            </div>
		          </div>
		        </div>
		      </Transition>
		</div>
	</div>
	)
}

export default ConfirmExamFinish;