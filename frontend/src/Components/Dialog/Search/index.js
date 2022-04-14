import React from "react";
import {Transition} from "@headlessui/react"

function Search(){
	return(
	<div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 dark:opacity-60 fixed inset-0  z-40"></div>
      <Transition
          as={React.Fragment}
          appear="true"
          show={true}
          enter="transform transition duration-[400ms]"
          enterFrom=" scale-0"
          enterTo="scale-100"
          leave="transform transition duration-[400ms]"
          leaveFrom="scale-100"
          leaveTo="scale-0"
        >
        <div className="w-[92%] md:w-[600px] p-6 rounded-xl bg-white dark:bg-zinc-800 z-40 flex flex-col items-center justify-center space-y-1">
         	ekjbdjeh
        </div>	
      </Transition>
    </div>
	)
}

export default Search;