import React from 'react';
import TopBar from './TopBar';
import Calender from "./Calender"


export default function RightPannel(props){
  const [selected, setSelected] = React.useState(0)
  return(
    <div className="w-full h-screen overflow-y-auto pt-4 pr-8 flex flex-col">
        <div className="w-[1/2] justify-center">
          <TopBar />
        </div>

      {
        props.withoutCalendar ?(
          <div className="py-3 px-2 flex space-x-1 grow overflow-y-hidden">
              {props.children}
          </div>
        ):(
            <div className="py-3 px-2 flex space-x-1 grow overflow-y-hidden">
              <div className="w-3/4 shrink overflow-y-auto pr-2">
                <div className="w-full h-2 bg-gray-100 dark:bg-zinc-900 blur sticky top-0"></div>
                    {props.children}
              </div>


              <div className="w-1/4 rounded-lg p-1 grow-0">
                <Calender />
              </div>

            </div>
        )
      }

    </div>
  )
}
