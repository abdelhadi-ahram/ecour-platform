import React from 'react';
import TopBar from './TopBar';

const DEPARTMENT = [
  {
    "name" : "GI",
    "id" : 1,
  },
  {
    "name" : "TCC",
    "id" : 2,
  },
  {
    "name" : "GBI",
    "id" : 1,
  }
]


export default function RightPannel(props){
  const [selected, setSelected] = React.useState(0)
  const ar = [1,2,5,6,3,2,8,5,9,5,8,4]
  return(
    <div className="w-full h-screen overflow-y-auto pt-8 pr-8 flex flex-col">
        <div className="w-[1/2] justify-center">
          <TopBar />
        </div>

       <div className="py-3 px-2 flex space-x-3 grow overflow-y-hidden">

            <div className="w-3/4 shrink overflow-y-scroll">
                  {props.children}
            </div>


            <div className="w-1/4 bg-white rounded-lg shadow p-1 grow-0">

            </div>

        </div>

    </div>
  )
}
