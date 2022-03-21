import React from 'react';

export default function TopBar(props){
  return(
    <div className="w-full px-2">
        <div className="py-1 flex items-center justify-between">
            <p className="text-gray-800 font-semibold text-2xl">Welcome ,{props.name}</p>
              <div className="flex items-center space-x-6">
                <div className='text-gray-500'>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div className="w-9 h-9 rounded-xl overflow-hidden flex justify-center items-center">
                  <img className="w-10 h-10" src="https://yt3.ggpht.com/ytc/AKedOLRXvOP4sWis_K32w4U4zUjF7PGiP2o0ixeYHHJ_HQ=s48-c-k-c0x00ffffff-no-rj" />
                </div>
              </div>
          </div>
    </div>
  )
}