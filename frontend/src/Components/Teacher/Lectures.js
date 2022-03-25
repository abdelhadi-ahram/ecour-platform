import React from "react"
import DeleteDialog from "../Dialog/Delete"
import Alert from "../Dialog/Alert"
import {
  useMutation,
  gql
} from "@apollo/client"

import {
  useNavigate
} from "react-router-dom"

function getType(type){
	switch(type){
		case "pdf":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
		case "announce":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
		case "image":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
		default :
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
	}
}

const DELETE_LECTURE = gql`
  mutation DeleteLecture($lectureId : ID!){
    deleteLecture(lectureId : $lectureId){
      ok
    }
  }
`;

function Lectures({lectures}){
  const [deleteLectureId, setDeleteLectureId] = React.useState(0)

  const navigate = useNavigate()

  const [deleteLectureById, {data, loading, error}] = useMutation(DELETE_LECTURE, {
    refetchQueries : [
      "GetElementLectures"
    ]
  })

  function deleteLecture(id){
    setDeleteLectureId(id)
  }

  function updateLecture(id, type){
    if(type == "text"){
      return navigate("/my/update-lecture-text/" + id)
    }
    navigate("/my/update-lecture-file/" + id)
  }

  function Notify(){
    return(
      <>
      {
        (deleteLectureId !== 0) && <DeleteDialog onCancel={() => {setDeleteLectureId(0)}} onDelete={() => deleteLectureById({variables : {lectureId : deleteLectureId}})} />
      }
      {
        data?.deleteLecture.ok && <Alert text="The lecture hase been removed successfully" />
      }
      </>
    )
  }

  return(
    <>
      <Notify />
      {lectures.map((lecture, index) => {
          return (
            <div key={index} className="flex justify-between px-3 py-2 hover:bg-gray-50 rounded">
              <div className="flex space-x-2">
                <span className="text-gray-400">{getType(lecture.type)}</span>
                <p className="text-gray-700">{lecture.title}</p>
              </div>
              <div className="flex space-x-3">
                <span className="text-red-400 hover:text-red-500" onClick={() => {deleteLecture(lecture.id)}}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </span>
                <span className="text-green-400 hover:text-green-500" onClick={() => updateLecture(lecture.id, lecture.type)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </span>
              </div>
            </div>
          )
        })}
    </>
  )
}


export default Lectures;
