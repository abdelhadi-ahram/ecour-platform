import React from "react";
import Question from "./Question"
import {
  useQuery, gql
} from "@apollo/client"

import {
  useParams
} from "react-router-dom"

import moment from "moment"

const GET_ATTEMPT_DETAILS = gql`
query GetAttemptDetails($attemptId: ID!){
  getAttemptDetails(attemptId: $attemptId){
    leftTime
    questions {
      id
    }
  }
}
`;

function ExamAttempt(){
  const {attemptId} = useParams()
  const [questions, setQuestions] = React.useState(null)
  const [selected, setSelected] = React.useState(0)
  const [leftTime, setLeftTime] = React.useState(0)
  const {data, error, loading} = useQuery(GET_ATTEMPT_DETAILS, {variables : {attemptId}})

  React.useEffect(() => {
    if(data){
      setLeftTime(data.getAttemptDetails.leftTime)
      setQuestions([...data.getAttemptDetails.questions])
    }
  }, [data])

  var timer = null;

  React.useEffect(() => {
    if(leftTime)
      setTimeout(()=> setLeftTime(leftTime - 1), 1000)
  }, [leftTime])

	return(
		<div className=" px-1 flex space-x-1 grow overflow-y-hidden">
          <div className="w-3/4 shrink overflow-y-auto pr-2 bg-zinc-800 flex flex-col rounded-md">
            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 blur sticky top-0"></div>
            <div className="flex-1" >
              <Question />
            </div>
            <div className="flex items-center justify-end p-2">
              <button className="post-btn">Next</button>
            </div>
          </div>


          <div className="w-1/4 rounded-lg p-1 grow-0 bg-zinc-800 flex flex-col">
            <div className="rounded mx-2 my-2 py-1 border border-zinc-700 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className={` font-semibold ${leftTime < 30 ? "text-red-400" : "text-gray-300"}`}>{moment.utc(leftTime*1000).format("HH:mm:ss")}</p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-3 p-2">
                {
                  questions?.map((question, index) => {
                    return <div key={index} className="p-2 text-gray-300 flex flex-col items-center justify-center border border-zinc-600 bg-zinc-700 rounded-lg">{index}</div>
                  })
                }
              </div>
            </div>
            <div className="flex flex-col items-center p-2 justify-center">
              <button className="update-btn">Finish the exam</button>
            </div>
          </div>

        </div>
	)
}


export default ExamAttempt;