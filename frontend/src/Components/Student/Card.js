import React from "react"
import classesImages from "./images";
import {Transition} from "@headlessui/react"


export default function Card({item, index}){
  const [isMenuShown, setIsMenuShown] = React.useState(false)

  return(
    <div className="bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-600 rounded-lg flex">
      <div className="w-32 bg-gradient-to-br from-gray-900 to-zinc-900 rounded-lg overflow-hidden">
        <img class="w-full h-full" src={classesImages[index]} />
      </div>
      <div className='mx-3 my-3 w-full'>
        <div class="flex items-center justify-between w-full">
          <p className="text-gray-700 dark:text-gray-200 text-md">{item.name}</p>
          <div>
            <div className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg p-1 " onClick={() => {setIsMenuShown(!isMenuShown)}}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </div>
            <div className="relative">

            <Transition show={isMenuShown}
              enter="transform transition duration-[400ms]"
              enterFrom="scale-0"
              enterTo="scale-y-100"
              leave="transform transition duration-[400ms]"
              leaveFrom="scale-100"
              leaveTo="scale-0"
            >
            <div className="fixed inset-0 opacity-0 z-10" onClick={() => {setIsMenuShown(false)}}></div>
            <div className="absolute top-0 right-0 w-48 z-20 rounded-lg shadow-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 p-1">
              <div className="p-2 rounded-lg font-semibold text-gray-500 dark:text-gray-300 text-md hover:text-[#6aa5ff] hover:bg-blue-50 dark:hover:bg-zinc-600">Favorite</div>
              <div className="p-2 rounded-lg font-semibold text-gray-500 dark:text-gray-300 text-md hover:text-[#6aa5ff] hover:bg-blue-50 dark:hover:bg-zinc-600">Hide</div>
            </div>
        </Transition>
            </div>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{item.module}</p>
      </div>
    </div>
  )
}
