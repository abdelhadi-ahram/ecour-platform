import React, { useState } from 'react'

// poeple page there are data n poeple kiyi skr l query tawistid 


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

function People({value}) {
    // search method with filter
     const results = Peoples.filter((p) => {
        return p.name.toLowerCase().startsWith(value.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });

      



  return (
    <div>
        {/* afficher data 3la 7asab dakchi li baghi t9lb 3lih */}
       { results && results.length > 0 ? results.map(results => (
                <div className='flex flex-row space-x-3 pt-3 hover:bg-gray-100 hover:select-none hover:rounded-lg '>
                    <div className='pl-5'>
                        <img src={results.img} className="w-[40px] h-[40px] rounded-lg" />
                        <div className='bg-green-500 w-[11px] h-[11px] border-[1px] border-white rounded-xl relative left-8 bottom-2'></div>
                    </div>
                    <div className='flex flex-col'>
                        <h1>{results.name}</h1>
                        <p className='text-sm text-gray-400 tracking-widest'>{results.situation}</p>
                    </div>
                </div>
       ))
          
       : (
                
            <div  className='flex flex-row space-x-3 py-3 hover:bg-gray-100 hover:select-none hover:rounded-lg '>
                {/* ila malga walo */}  
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

export default People