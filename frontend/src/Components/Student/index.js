import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../Sidebar';
import RightPanel from '../RightPannel';
import ElementDetails from './ElementDetails';
import Dashboard from './Dashboard';
import LectureDetails from "./LectureDetails"
import HomeworkDetails from "./HomeworkDetails"
import Exam from './Exam'
import ExamAttempt from "./ExamAttempt"

import {buttons} from './studentsButtons';
import '../../index.css';

import {
  Routes, Route
} from "react-router-dom"

export default function Student() {

  return(
    <div className="w-screen h-screen bg-gray-100 dark:bg-zinc-900 font-nunito flex">
        
        <Sidebar buttons={buttons} />
        
         <div className="w-full h-screen">

            <Routes>
              <Route path="/home" element={<RightPanel ><Dashboard /></RightPanel >} />
              <Route path="/element/:elementId" element={<RightPanel ><ElementDetails /></RightPanel >} />
              <Route path="/lecture/:lectureId" element={<RightPanel ><LectureDetails /></RightPanel >} />
              <Route path="/homework/:homeworkId" element={<RightPanel ><HomeworkDetails /></RightPanel >} />
              <Route path="/exam/:examId" element={<RightPanel ><Exam /></RightPanel >} />
              <Route path="/attempt/:attemptId" element={<RightPanel withoutCalendar ><ExamAttempt /></RightPanel >} />
            </Routes>

      </div>

      </div>
  )
}
