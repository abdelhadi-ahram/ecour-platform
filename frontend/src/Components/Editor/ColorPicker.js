import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {faPaintBrush} from '@fortawesome/free-solid-svg-icons'

function ColorPicker(){
  const [shown, setShown] = React.useState(false);
  const [panel, setPanel] = React.useState(<Palette />);

  function Palette(){
    const COLORS = [
      "gray", "blue", "indigo", "purple", "green", "orange", "yellow", "red", "teal", "amber", "lime",
      "cyan", "rose", "pink"
    ]

    return (
      <div className="bg-white dark:bg-zinc-700 grid grid-cols-4 gap-x-1 gap-y-1 grid-flow-row auto-rows-max absolute top-2 right-0 w-48 overflow-auto rounded shadow z-20 p-2 border border-gray-200 dark:border-zinc-600">
        {COLORS.map(color => {
          let className = "rounded-full w-6 h-6 bg-" + color +"-500";
          return (<div key={color} className={className} onClick={() => {setPanel(<ColorGradient color={color} />)}}></div>)
        })}
      </div>
    )
  }

  function ColorGradient({color}){
    const GRADIENTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    return(
      <div className="absolute top-2 right-0 w-48 bg-white dark:bg-zinc-700 rounded shadow z-20 p-1 border border-gray-200 dark:border-zinc-600">
        <div className="flex items-center space-x-2 p-1 border border-gray-100 bg-gray-100">
          <svg onMouseDown={() => setPanel(<Palette />)} className="w-5 h-5 text-gray-500 hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <div className={"rounded-full w-6 h-6 bg-" + color +"-500"}></div>
        </div>
        <div className="grid grid-cols-4 gap-x-1 gap-y-1 grid-flow-row auto-rows-max w-48 bg-white dark:bg-zinc-700 p-2">
          {GRADIENTS.map(gradient => {
            let className = "rounded-full w-6 h-6 bg-" + color +"-" + gradient + " ";
            console.log(className);
            return (<div key={color + gradient} className={className}></div>)
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => {setShown(!shown)}}>
        <FontAwesomeIcon icon={faPaintBrush} className={shown ? "text-purple-500" : "text-gray-500"} />
      </button>
      { shown && <div className="bg-black opacity-0 absolute inset-0 z-10" onClick={() => {setShown(false)} }></div>}
      <div className="relative w-8">
        { shown && panel }
      </div>
    </div>
  )
}



export default ColorPicker;
