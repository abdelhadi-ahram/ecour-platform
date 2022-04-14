import React from 'react';
import Sidebar from '../Sidebar';
import RightPanel from '../RightPannel';
import {buttons} from './teacherButtons';
import Department from './Department';
import StudentManagment from "./Students"
import LectureDetails from "./LectureDetails"
import HomeworkDetails from "./HomeworkDetails"
import AddExam from './Exam/AddExam'
import EditExam from './Exam/EditExam'
import ExamDetails from "./Exam/ExamDetails"
import StudentAttempts from "./Exam/StudentAttempts"
import CorrectAttempt from "./Exam/CorrectAttempt"

import {
  Routes, Route, Navigate
} from "react-router-dom";

export default function Teacher() {
  return(
<div className="w-screen h-screen bg-gray-100 dark:bg-zinc-900 font-nunito flex">
    <Sidebar buttons={buttons} />

  <div className="w-full h-screen">
      <Routes>
        <Route path="/home/*" element={<RightPanel><Department /></RightPanel>} />
        <Route path="/students" element={<RightPanel><StudentManagment /></RightPanel>} />
        <Route path="/home/manage-department" element={<RightPanel><b>Hello world</b></RightPanel>} />
        <Route path="/home/lecture-details/:lectureId" element={<RightPanel><LectureDetails /></RightPanel>} />
        <Route path="/home/homework-details/:homeworkId" element={<RightPanel><HomeworkDetails /></RightPanel>} />
        <Route path="/home/add-exam/:sectionId" element={<RightPanel><AddExam /></RightPanel>} />
        <Route path="/home/edit-exam/:examId" element={<RightPanel withoutCalendar><EditExam /></RightPanel>} />
        <Route path="/home/exam-details/:examId" element={<RightPanel><ExamDetails /></RightPanel>} />
        <Route path="/home/exam-results/:examId" element={<RightPanel><StudentAttempts /></RightPanel>} />
        <Route path="/home/correct-attempt/:attemptId" element={<RightPanel withoutCalendar><CorrectAttempt /></RightPanel>} />
      </Routes>
  </div>

</div>
  )
}
