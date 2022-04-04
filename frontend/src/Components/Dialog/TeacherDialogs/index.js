import SelectSection from "./SelectSection"
import SelectType from "./SelectType"
import AddLectureText from "./AddLectureText"
import AddLectureFile from "./AddLectureFile"
import UpdateLectureFile from "./UpdateLectureFile"
import UpdateLectureText from "./UpdateLectureText"
import AddHomework from "./AddHomework"
import UpdateHomework from "./UpdateHomework"

import {
  Routes, Route, Navigate
} from "react-router-dom";



export function AddLecture(){


  return(
    <Routes>
      <Route path="/select-section" element={<SelectSection />} />
      <Route path="/select-type/:sectionId" element={<SelectType />} />
      <Route path="/add-lecture-text/:sectionId" element={<AddLectureText />} />
      <Route path="/add-lecture-file/:sectionId" element={<AddLectureFile />} />
      <Route path="/update-lecture-file/:lectureId" element={<UpdateLectureFile />} />
      <Route path="/update-lecture-text/:lectureId" element={<UpdateLectureText />} />
      <Route path="/add-homework/:sectionId" element={<AddHomework />} />
      <Route path="/update-homework/:homeworkId" element={<UpdateHomework />} />
    </Routes>
  )
}
