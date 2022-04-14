import React, { useState } from 'react'
import SearchBar from './SearchBar'

function Index() {
    const [select,setSelected] = useState(false);
    const [value,setValue] = useState("");
    const eventWrite = (e) => {
      const keyword = e.target.value;
      setValue(keyword);
    }

  return (
   <div className='bg-gray-100 h-screen '>
   <div className='px-4 py-[80px]'>
   <div className='flex justify-center w-[500px] ml-[400px] bg-white items-center border-[1px] border-gray-200 rounded-lg'> 
     
        <svg className="w-7 h-7 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input 
        onSelect={() => setSelected(true)}
        // onMouseLeave={() => setSelected(false)}
        type="text" 
        onChange={eventWrite}
        value={value}
        className=' w-[400px] px-5 py-4 focus:outline-none rounded-lg' 
        placeholder='Search...' />

        <h1 onClick={() => setSelected(false)} className='text-sm font-semibold border-b-2 border-black cursor-pointer'>clear</h1>
     </div>
     
    {
      select ? <div><SearchBar value={value} /></div> : <div></div>
    }
    
    </div>
    </div>
    
  )
}

export default Index