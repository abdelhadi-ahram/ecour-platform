import React from 'react';


export default function Sidebar(props){
  const [selected,setSelected]= React.useState(0);
  const [showLogout,setShowLogout]= React.useState(0);

  function hideLogout(){
    setShowLogout(false);
  }

  return(
    <div className="flex flex-col items-center bg-white dark:bg-zinc-800 shadow rounded-2xl h-full px-5 py-5">
      <div className="p-2 bg-blue-400 dark:bg-blue-500 text-white darl:text-gray-200 flex justify-center items-center rounded-xl ">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
      </div>
      <div className="flex flex-col justify-center h-full">
        {props.children}
      </div>
      <div className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-100 dark:hover:bg-zinc-700" onClick={() => {setShowLogout(true)}}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </div>

</div>
  )
}
