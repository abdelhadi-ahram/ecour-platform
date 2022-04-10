import React from "react";
import Answer from "./Answer"
import {
  useQuery, gql
} from "@apollo/client"

import {
  useParams, useNavigate
} from "react-router-dom"

import moment from "moment"

const GET_ATTEMPT_DETAILS = gql`
query GetAttemptContent($attemptId: ID!){
  getAttemptContent(attemptId: $attemptId){
    id 
    student{
      fullName
    }
    questions {
      id
    }
  }
}
`;

function ExamAttempt(){
  const {attemptId} = useParams()
  const [questions, setQuestions] = React.useState([])
  const [selected, setSelected] = React.useState(0)
  const {data, error, loading} = useQuery(GET_ATTEMPT_DETAILS, {variables : {attemptId}, fetchPolicy : "network-only"})

  const navigate = useNavigate()

  React.useEffect(() => {
    if(data){
      setQuestions([...data.getAttemptContent.questions])
    }
  }, [data])

  function fetchNext(){
    if(selected < questions.length - 1){
      setSelected(selected + 1)
    }
  }

  if(error){
    return <b className="text-red-500">{JSON.stringify(error)}</b>
  }

  function selectQuestion(index){
    setSelected(index)
  }

	return(
		<div className=" px-1 flex flex-col space-y-3 lg:overflow-y-auto lg:space-y-0 lg:flex-row lg:space-x-3 grow lg:overflow-y-hidden">
          <div className="lg:w-3/4 lg:shrink lg:overflow-y-auto pr-2 bg-white dark:bg-zinc-800 flex flex-col rounded-md">
            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 blur sticky top-0"></div>
            <div className="flex-1 grow flex flex-col overflow-y-auto" >
              {questions.length && <Answer isLastItem={selected === (questions.length-1)} index={selected} question={questions[selected]?.id} fetchNext={fetchNext} />}
            </div>
          </div>


          <div className="lg:w-1/4 rounded-lg p-1 grow-0 bg-white dark:bg-zinc-800 flex flex-col py-2 space-y-3">
            <div className="p-1 rounded-md border border-zinc-700 flex space-x-3 items-center">
              <div className="w-7 h-7 bg-zinc-600 rounded-lg"></div>
              <p className="text-gray-400">{data?.getAttemptContent.student.fullName}</p>
            </div>
            <div className="flex-1">
              <div className="flex flex-col space-y-3">
                {
                  questions?.map((question, index) => {
                    const isSelected = selected == index
                    return (
                      <button onClick={() => selectQuestion(index)} key={index} className={`p-[4px] flex flex-col items-center justify-center border rounded-lg ${isSelected ? "border-indigo-400 text-indigo-500 bg-blue-50 dark:bg-zinc-700" : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-zinc-600"} disabled:bg-green-500`}>
                        Question {index + 1}
                      </button>
                      )
                  })
                }
              </div>
            </div>
          </div>

        </div>
	)
}


export default ExamAttempt;