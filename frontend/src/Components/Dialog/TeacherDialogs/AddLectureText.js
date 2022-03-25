
import {useParams, useNavigate} from "react-router-dom"
import React from "react"

import {
  useMutation,
  gql
} from "@apollo/client";

import TextEditor from "../../Editor";

const ADD_LECTURE_TEXT = gql`
  mutation addLectureText($title: String!, $content: String!, $sectionId : ID!){
    addLectureText(title: $title, content: $content, sectionId: $sectionId){
      ok
    }
  }
`;


function AddLectureText(){
  const {sectionId} = useParams()
  const navigate = useNavigate()

  const [input, setInput] = React.useState(initialValue);
  const [title, setTitle] = React.useState("");

  const [addLecture, {data, loading, error}] = useMutation(ADD_LECTURE_TEXT,
   {refetchQueries : [
         "GetElementLectures"
       ]
    })

  function cancelClicked(){
    navigate("/my")
  }

  function postData(){
    var content = JSON.stringify(input)
    addLecture({variables : {title, content, sectionId}})
    navigate("/my")
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 fixed inset-0  z-0"></div>
      <div className="w-[800px] p-6 rounded-xl bg-white z-10 flex flex-col items-center justify-center space-y-1">
        <div className="w-full flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-gray-600 font-semibold">Title</p>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300" />
            </div>

            <div className="flex flex-col space-y-1">
              <p className="text-gray-600 font-semibold">Content</p>
              <TextEditor value={input} setValue={setInput} />
            </div>

            <div className="flex items-center justify-end">
              <button onClick={cancelClicked} className="px-4 py-[6px] text-gray-500 bg-gray-100 rounded-md mx-3 text-md hover:bg-gray-200 hover:text-gray-600">Cancel</button>
              <button disabled={!(title && input)} onClick={postData} className="px-4 py-[6px] text-white bg-blue-400 disabled:bg-blue-300 font-bold rounded-md text-md shadow border border-white focus:ring-1 focus:ring-blue-400 hover:shadow-lg">Post</button>
            </div>
        </div>
      </div>
    </div>
  )
}


const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: " " },
    ]
  }
]

export default AddLectureText;

