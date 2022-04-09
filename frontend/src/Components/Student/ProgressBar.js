import React from 'react'

const Progress_bar = ({bgcolor,progress}) => {

  const myProgress = `${progress}%`;

    return (
    <div  className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-[6px] overflow-hidden">
      <div style={{width: myProgress}} className="h-[6px] bg-gradient-to-r from-indigo-400 dark:from-purple-400 via-sky-500 dark:via-indigo-500 to-blue-400 dark:to-blue-500"></div>
    </div>
    )
}

export default Progress_bar;
