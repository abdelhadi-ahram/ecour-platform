import React from 'react'
import { motion } from "framer-motion"
import Navbar from './Navbar'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom'
import Files from './Files'
import All from './All'
import People from './People'

// we bring the data from the search input to give it to all components
 
function SearchBar({value}) {
    const search = value;
  return (


    <div className='bg-white border-[1px] border-gray-200 rounded-lg mx-[400px] duration-200 ease-out w-[500px] h-[440px] mt-[5px]'>

       <div>
           <Navbar />
       </div>
       <div>
           <Routes>
               <Route path='/' element={<All value={search} />}   />
               <Route path='/files' element={<Files value={search} />} />
               <Route path='/people' element={<People value={search} />} />
           </Routes>
       </div>

    </div>

  )
}

export default SearchBar