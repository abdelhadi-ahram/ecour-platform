import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Components/Login';
import Teacher from './Components/Teacher';
import Student from './Components/Student';


import Sidebar from './Components/Sidebar';
import './index.css';


export default function App() {
    return(
      // <div className ="bg-[#f5f6f8] w-screen h-screen px-4">
      //   <Sidebar />
      // </div>
      <Login />
    )
  }
