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

  return(
    <div className="w-full h-screen overflow-y-auto pt-8 pr-8">
        <div className="w-[1/2] justify-center">
          <TopBar />
        </div>

        <div className="py-3 px-2 flex space-x-3">

            <div className="w-3/4 flex flex-col ">
                  {props.children}

            </div>


            <div className="w-1/4 bg-white rounded-lg shadow p-1">

            </div>

        </div>

    </div>
  )
}
