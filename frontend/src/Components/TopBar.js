import React from 'react';
import UserProvider from "../UserProvider"
import {showSidebar} from "./Sidebar"

export default function TopBar(props){
  const firstName = React.useContext(UserProvider)

  const [darkTheme, setDarkTheme] = React.useState(localStorage.theme === "dark")

  function changeTheme(){
    document.documentElement.classList.remove('dark')
    if (localStorage.theme === 'light') {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setDarkTheme(true)
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setDarkTheme(false)
    }

  }

  return(
    <div className="w-full px-2">
        <div className="py-1 flex items-center justify-between">
            <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg md:text-2xl">Welcome, {firstName}</p>
              <div className="flex items-center space-x-4 rounded-lg bg-white dark:bg-zinc-800 py-2 px-4">
                <div className={`${darkTheme ? "text-blue-500" : "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`} onClick={changeTheme}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                </div>
                <div className='text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div onClick={() => showSidebar(true)} className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 md:hidden">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </div>
              </div>
          </div>
    </div>
  )
}
