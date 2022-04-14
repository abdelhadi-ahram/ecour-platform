import React, { useState } from 'react'
import { Link } from 'react-router-dom'


function Navbar() {

    {/* khtad tga navbar ila gis all d people d files kola whda igha stods arktawi s page ns */}
    const [all,setAll] = useState(true);
    const [files,setFiles] = useState(false);
    const [people,setPeople] = useState(false);

    const AllEvent = () => {
        setAll(true);
        setFiles(false);
        setPeople(false);
        

    }

    const FilesEvent = () => {
        setAll(false);
        setFiles(true);
        setPeople(false);
    }

    const PeopleEvent = () => {
        setAll(false);
        setFiles(false);
        setPeople(true);
    }
    
  
  return (
    <div className='flex space-x-3 my-3 mx-6'>
        <Link to='/'><div onClick={AllEvent} className={`flex  items-center space-x-2 cursor-pointer pb-1 ${all ? "border-b-[2px] border-black duration-75 delay-100" : "text-gray-400"}`}>
            <h1 className='font-semibold'>All</h1>
            <div className='bg-gray-100 w-5 h-5 rounded-md text-sm text-gray-300 flex justify-center items-center'>3</div>
        </div></Link>
        <Link to='/files'><div onClick={FilesEvent} className={`flex  items-center cursor-pointer pb-1 ${files ? "border-b-[2px] border-black duration-75 delay-100" : "text-gray-400"}`}>
            <svg class="w-6 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
            <h1 className='font-semibold pr-2'>Files</h1>
            <div className='bg-gray-100 w-5 h-5 text-sm rounded-md text-gray-300 flex justify-center items-center'>3</div>
        </div></Link>
        <Link to='/people'><div onClick={PeopleEvent} className={`flex  items-center cursor-pointer pb-1 ${people ? "border-b-[2px] border-black duration-75 delay-100" : "text-gray-400"}`}>
        <svg class="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>            <h1 className='font-semibold pr-2'>People</h1>
            <div className='bg-gray-100 w-5 h-5 text-sm rounded-md text-gray-300 flex justify-center items-center'>3</div>
        </div></Link>
    </div>
  )
}

export default Navbar