import React from 'react';
import classesImages from "./images";
import {Transition} from "@headlessui/react";
import Progressbar from './ProgressBar';

import {
  Link 
} from "react-router-dom"


function Element({element,module, index}){
  const [isMenuShown, setIsMenuShown] = React.useState(false)

  return(
    <div className="py-3 px-2 flex border border-gray-300 dark:border-zinc-600 rounded-xl select-none">

      <div className="w-1/5 flex">
        <div className="w-28 h-20 bg-gradient-to-br from-gray-900 to-zinc-900 rounded-xl overflow-hidden">
          <img class="w-full h-full" src={classesImages[index]} />
        </div>
      </div>

      <div className='w-full mx-3 space-y-5'>
        <div className="flex justify-between">
          <div class="flex flex-col items-start justify-start">
            <Link to={`/my/element/${element.id}`}><p className="text-gray-700 dark:text-gray-300 font-semibold text-md hover:text-gray-900 dark:hover:text-gray-200">{element.name}</p></Link>
            <p className="text-gray-500 dark:text-gray-400 font-small text-sm">{module}</p>
          </div>

        {/*The ellipsis*/}
          <div className="">
            <div className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg p-1  flex justify-start items-start " onClick={() => {setIsMenuShown(!isMenuShown)}}>
              <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </div>
            <div className="relative">
              <Transition show={isMenuShown}
                enter="transform transition duration-[400ms]"
                enterFrom="scale-0"
                enterTo="scale-y-100"
                leave="transform transition duration-[400ms]"
                leaveFrom="scale-100"
                leaveTo="scale-0">
                  <div className="fixed inset-0 right-4 opacity-0 z-10" onClick={() => {setIsMenuShown(false)}}></div>
                  <div className="absolute top-0 right-0 w-48 z-20 rounded-lg shadow-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 p-1">
                    <div className="p-2 rounded-lg font-semibold text-gray-500 dark:text-gray-300 text-md hover:text-[#6aa5ff] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-600 flex items-center space-x-2">
                      <svg className="w-6 h-6 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      <p>Favorite</p>
                    </div>
                    <div className="p-2 rounded-lg font-semibold text-gray-500 dark:text-gray-300 text-md hover:text-[#6aa5ff] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-600 flex items-center space-x-2">
                      <svg className="w-6 h-6 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      <p>Hide</p>
                    </div>
                  </div>
              </Transition>
            </div>
          </div>
        </div>

      {/*progressbar*/}
        <div className="">
          <Progressbar  progress={element.progress}/>
        </div>
      </div>

    </div>

  )
}

export default Element;