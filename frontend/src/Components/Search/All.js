import React, { useState } from 'react'
import Navbar from './Navbar';

// we have all the data and after that we filter it to search 

const Peoples = [
            {
                "img" : require('../BranchChef/img/img1.jpg'),
                "name" : "Mustapha Ait" ,
                "situation" : "Active Now",
            },
            {
                "img" : require('../BranchChef/img/img2.jpg'),
                "name" : "Abdelhadi Ahram" ,
                "situation" : "Active Now",
            },
            {
                "img" : require('../BranchChef/img/img3.jpg'),
                "name" : "Oussama Eddaoui" ,
                "situation" : "Active Now",
            },
            
        ]

 const Files = [
            {
                "icon" : <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>,
                "nameFile" : "Ahram Folder",
                "type" : "folder",
            },
            {
                "icon" : <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
                "nameFile" : "Eddaoui Image",
                "type" : "image",
            },
            {
                "icon" : <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
                "nameFile" : "Mustapha Video",
                "type" : "video",
            },
        ]
  


function All({value}) {
    
    // filter the data 1
    const results = Peoples.filter((p) => {
        return p.name.toLowerCase().startsWith(value.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });


    // filter the data 2
      const results2 = Files.filter((p) => {
        return p.nameFile.toLowerCase().startsWith(value.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      }); 
    // concat the data 1 with data 2 collect them
      const data = results.concat(results2);
      

  return (
    <div>
        {/* search  */}

        
       
        { data && data.length > 0 ? data.map(result => {
            return (
                <div>
                {result.name ?
                <div className='flex flex-row space-x-3 pt-3 hover:bg-gray-100 hover:select-none hover:rounded-lg '>
                    <div className='pl-5'>
                        <img src={result.img} className="w-[40px] h-[40px] rounded-lg" />
                        <div className='bg-green-500 w-[11px] h-[11px] border-[1px] border-white rounded-xl relative left-8 bottom-2'></div>
                    </div>
                    <div className='flex flex-col'>
                        <h1>{result.name}</h1>
                        <p className='text-sm text-gray-400 tracking-widest'>{result.situation}</p>
                    </div>
                </div>  : <div></div>}    
                {result.nameFile ? 
                <div className='flex pb-1 flex-row space-x-3 pt-3 hover:bg-gray-100 hover:select-none hover:rounded-lg '>
                    <div className='pl-5'>
                        <div className='bg-gray-100 w-[40px] h-[40px] rounded-lg text-gray-400 flex justify-center items-center '>
                            {result.icon}
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h1>{result.nameFile}</h1>
                        <p className='text-sm text-gray-400 tracking-widest'>{result.type}</p>
                    </div>
                </div>
                : <div></div>}
                
            </div>
       )}) : 
      
            (
                <div  className='flex flex-row space-x-3 py-3 hover:bg-gray-100 hover:select-none hover:rounded-lg '>
                    {/* if we didn't found anything */}
                    <div className='flex justify-center items-center space-x-3 ml-6'>
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>  
                        <h1 className='text-gray-400 text-xl font-semibold'>No results found!</h1>
                    </div>
                </div>
            )
         
        
        }

    </div>
  )
}

export default All