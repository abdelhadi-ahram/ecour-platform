import React from 'react';
import Logout from "./Dialog/Logout"
import {Transition} from '@headlessui/react'

import {
  makeVar, useReactiveVar, useQuery, gql
} from "@apollo/client"
import {
  Link
} from "react-router-dom"

export const showSidebar = makeVar(false)
export const selectButton = makeVar("")

const GET_LOGGED_USER = gql`
    {
      getLoggedUser{
        firstName 
        role
        isAuthenticated
      }
    }
  `;

export default function Sidebar(props){
  const [selected,setSelected]= React.useState(0);
  const [showLogout,setShowLogout]= React.useState(false);
  const isSideBarShown = useReactiveVar(showSidebar)
  const selectedButton = useReactiveVar(selectButton)

  const {data, error} = useQuery(GET_LOGGED_USER)

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
              const isSelected = item.name == selectedButton
              return (
                <Link key={index} to={item.to} onClick={() => showSidebar(false) }>
                  <div className={`flex items-center ${isSelected ? "bg-blue-400 dark:bg-blue-500 text-gray-50 dark:text-gray-300 rounded-xl" : "hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded-lg"}`}>
                    <div className="p-2 rounded-lg">{item.icon}</div>
                  </div>
                </Link>
              )
              })}
          </div>

          { data?.getLoggedUser.isAuthenticated ? (
            <div className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-100 dark:hover:bg-zinc-700 dark:hover:text-red-500" onClick={() => {setShowLogout(true)}}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            ) : (
              <Link to='/login'>
                <div className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-100 dark:hover:bg-zinc-700 dark:hover:text-red-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                </div>
              </Link>
            )
          }
        </div>
      </div>


    {/*Side bar for small screens*/}
   <Transition show={isSideBarShown}>
      <div className="fixed md:hidden inset-0 z-20 md:bg-zinc-900 md:relative md:h-screen flex-col  px-6 py-8 overflow-hidden">
          <div className="fixed inset-0 bg-black opacity-60 z-0"></div>
          <Transition.Child
            as={React.Fragment}
            enter="transform transition duration-[400ms]"
            enterFrom="-translate-x-full scale-0"
            enterTo="scale-x-100"
            leave="transform transition duration-[400ms]"
            leaveFrom="scale-x-100"
            leaveTo="scale-x-0"
          >
            <div className="relative z-20 flex flex-col bg-white dark:bg-zinc-800 shadow rounded-2xl h-full px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-400 dark:bg-blue-500 text-white darl:text-gray-200 flex justify-center items-center rounded-xl ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-200 font-semibold">Ecole superieur d'Agadir</p>
                </div>
                <span onClick={() => showSidebar(false)} className="hover:text-gray-500 text-gray-400 dark:hover:text-gray-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
              </div>
              <div className="flex flex-col justify-center h-full space-y-2">
                {props.buttons.map((item, index) => {
                  const isSelected = item.name == selectedButton
                  return (
                    <Link key={index} to={item.to} onClick={() => showSidebar(false)}>
                      <div className={`cursor-pointer rounded-lg space-x-3 flex items-center ${isSelected ? "bg-blue-50 dark:bg-zinc-700" :"hover:bg-gray-100 dark:hover:bg-zinc-700"}`}>
                        <div className={`p-2 rounded-lg ${isSelected ? "text-blue-400 dark:text-blue-500" : "text-gray-500 dark:text-gray-400"}`}>{item.icon}</div>
                        <div className={` ${isSelected ? "text-gray-500 font-semibold dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>{item.name}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              { data?.getLoggedUser.isAuthenticated ? (
                  <div onClick={logoutFromSmallScreen} className="cursor-pointer flex items-center space-x-3 p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-100 dark:hover:bg-zinc-700 dark:hover:text-red-500" >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <p className="text-gray-400 text-lg">Logout</p>
                  </div>
                ) : (
                  <Link to="/login">
                    <div className="cursor-pointer flex items-center space-x-3 p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-100 dark:hover:bg-zinc-700 dark:hover:text-red-500" >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      <p className="text-gray-400 text-lg">Login</p>
                    </div>
                  </Link>
                )}

            </div>
          </Transition.Child>
      </div>
    </Transition>
  </>
  )
}
