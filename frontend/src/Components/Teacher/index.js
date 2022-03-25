import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../Sidebar';
import RightPanel from '../RightPannel';
import Dashboard from './Dashboard';
import Buttons from './teacherButtons';
import Department from './Department';
import Students from "./Students"

import '../../index.css';

import {
  Routes, Route
} from "react-router-dom";

export default function Teacher() {
  return(
<div className="w-screen h-screen bg-[#f5f6f8] font-nunito flex">
  <div className="h-screen flex flex-col items-center justify-center px-6 py-8">
    <Sidebar>
    <Buttons />
    </Sidebar>
  </div>

  <div className="w-full h-screen">
    <RightPanel >
      <Routes>
        <Route path="*" element={<Department />} />
        <Route path="/students" element={<Students />} />
        <Route path="/manage-department" element={<b>Hello world</b>} />
      </Routes>
    </RightPanel>
  </div>

</div>
  )
}
