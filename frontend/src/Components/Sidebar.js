import React from 'react';
import Logout from "./Dialog/Logout"
import {Transition} from '@headlessui/react'

import {makeVar, useReactiveVar} from "@apollo/client"

export const showSidebar = makeVar(false)


export default function Sidebar(props){
  const [selected,setSelected]= React.useState(0);
  const [showLogout,setShowLogout]= React.useState(false);
  const isSideBarShown = useReactiveVar(showSidebar)

  function hideLogout(){
    setShowLogout(false)
    //setTimeout(() => setShowLogout(false), 400);
  }

  function logoutFromSmallScreen(){
    showSidebar(false)
    setTimeout(() => setShowLogout(true), 0)
  }


  return(
    <>
      {
        showLogout && <Logout onCancel={hideLogout} />
      }
      <div className="hidden md:flex inset-0 z-20 relative md:h-screen flex-col items-center justify-center px-6 py-8 ">
        <div className="md:flex flex-col items-center bg-white dark:bg-zinc-800 shadow rounded-2xl h-full px-5 py-5">
          <div className="p-2 bg-blue-400 dark:bg-blue-500 text-white darl:text-gray-200 flex justify-center items-center rounded-xl ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
          </div>
          <div className="flex flex-col space-y-3 justify-center h-full">
            {props.buttons.map((item, index) => {
                return (<div key={index} className="rounded-lg hover:bg-zinc-700 text-gray-500 hover:text-gray-400 flex items-center">
                  <div className="p-2 rounded-lg">{item.icon}</div>
                </div>)
              })}
          </div>

          <div className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-100 dark:hover:bg-zinc-700 dark:hover:text-red-500" onClick={() => {setShowLogout(true)}}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </div>
        </div>
      </div>


    {/*Side bar for small screens*/}
   <Transition
          show={isSideBarShown}
          enter="transform transition duration-[400ms]"
          enterFrom=" scale-0"
          enterTo="scale-100"
          leave="transform transition duration-[400ms]"
          leaveFrom="scale-100"
          leaveTo="scale-0"
        >
      <div className="fixed md:hidden inset-0 z-20 md:bg-zinc-900 md:relative md:h-screen flex-col  px-6 py-8">
          <div className="fixed inset-0 bg-black opacity-60 z-0"></div>
          <div className="relative z-20 flex flex-col bg-white dark:bg-zinc-800 shadow rounded-2xl h-full px-5 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-400 dark:bg-blue-500 text-white darl:text-gray-200 flex justify-center items-center rounded-xl ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-xl text-gray-200 font-semibold">Ecole superieur d'Agadir</p>
              </div>
              <span onClick={() => showSidebar(false)} className="text-gray-400 hover:text-gray-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
            </div>
            <div className="flex flex-col justify-center h-full space-y-2">
              {props.buttons.map((item, index) => {
                return (<div key={index} className="cursor-pointer rounded-lg hover:bg-zinc-700 flex items-center space-x-3">
                  <div className="p-2 rounded-lg text-gray-400">{item.icon}</div>
                  <div className="text-gray-400">{item.name}</div>
                </div>)
              })}
            </div>

            <div onClick={logoutFromSmallScreen} className="cursor-pointer flex items-center space-x-3 p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-100 dark:hover:bg-zinc-700 dark:hover:text-red-500" >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <p className="text-gray-400 text-lg">Logout</p>
            </div>
          </div>
      </div>
    </Transition>
  </>
  )
}
