import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../Sidebar';
import RightPanel from '../RightPannel';
import Courses from './Courses';
import Dashboard from './Dashboard';

import Buttons from './studentsButtons';
import '../../index.css';

export default function Student() {
  return(
    <div className="w-screen h-screen bg-[#f5f6f8] font-nunito flex">
      <div className="h-screen flex flex-col items-center justify-center px-6 py-8">
        <Sidebar>
          <Buttons />
        </Sidebar>
        </div>
        <div className="w-full h-screen">
          <RightPanel >
            <Courses />
          </RightPanel>
      </div>

    </div>
  )

}
