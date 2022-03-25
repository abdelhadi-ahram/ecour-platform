import React from 'react'

const Progress_bar = ({bgcolor,progress}) => {


    return (
    <div  className="w-full bg-gray-100 rounded-full h-[6px] overflow-hidden">
      <div className="w-[80%] h-[6px] bg-gradient-to-r from-indigo-400 via-sky-500 to-blue-400"></div>
    </div>
    )
}

export default Progress_bar;
