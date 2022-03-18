import React from 'react';

export default function Card() {

    return(
      <div className='bg-white rounded-xl p-2'>
          <div className='flex flex-row'>
            <div className='w-1/6'>
              <div className='rounded-xl flex justify-center items-center'><svg className="w-7 h-7 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
            </div>

            <div className='w-full'>
            <div className= ''><h2>Oussama Eddaoui</h2></div>
            <div className= 'w-full description text-gray-600'><p>This is the description of the card</p></div>

            </div>

          </div>

        </div>
    )
  }
