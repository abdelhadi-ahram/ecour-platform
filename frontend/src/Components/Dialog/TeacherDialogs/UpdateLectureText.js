
import {useParams, useNavigate} from "react-router-dom"
import React from "react"

import {PulseSquare} from "../../Loadings"

import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";

import TextEditor from "../../Editor";

const UPDATE_LECTURE_TEXT = gql`
  mutation UpdateLectureText($lectureId:ID!, $title: String!, $content: String!){
    updateLecture(id: $lectureId, title: $title, content: $content){
      ok
    }
  }
`;

const GET_LECTURE = gql`
  query GetLectureById($lectureId : ID!){
    getLectureById(lectureId : $lectureId){
      title
      content
    }
  }
`;


function UpdateLectureText(){
  const {lectureId} = useParams()
  const navigate = useNavigate()

  const [input, setInput] = React.useState(null);
  const [title, setTitle] = React.useState("");

  const {data, error, loading} = useQuery(GET_LECTURE, {
    variables : {lectureId},
    fetchPolicy: "network-only"
  })

  const [updateLecture, updateLectureResponse] = useMutation(UPDATE_LECTURE_TEXT, 
  {refetchQueries : [
       "GetElementLectures"
     ]
  })

  function cancelClicked(){
    navigate("/my")
  }

  function postData(){
    var content = JSON.stringify(input)
    updateLecture({variables : {lectureId, title, content}})
    navigate("/my")
  }

  React.useEffect(() => {
    var content;
    if(data?.getLectureById?.content){
      content = JSON.parse(data?.getLectureById?.content)
    }
    setTitle(data?.getLectureById?.title || "")
    setInput(content)
  }, [data])

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
      <div className="bg-black opacity-20 dark:opacity-40 fixed inset-0  z-0"></div>
      <div className="w-[800px] p-6 rounded-xl bg-white dark:bg-zinc-800 z-10 flex flex-col items-center justify-center space-y-1">
        <div className="w-full flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-gray-600 dark:text-gray-300 font-semibold">Title</p>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full input" />
            </div>

            <div className="flex flex-col space-y-1">
              <p className="text-gray-600 dark:text-gray-300 font-semibold">Content</p>
              {input ? (<TextEditor height="150px" value={input} setValue={setInput} />) : (<PulseSquare width="full" height="[200px]" />)}
            </div>

            <div className="flex items-center justify-end">
              <button onClick={cancelClicked} className="cancel-btn">Cancel</button>
              <button disabled={!(title && input)} onClick={postData} className="post-btn">Post</button>
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
      { text: " default" },
    ]
  }
]

export default UpdateLectureText;

