import React from "react";
import Question from "./Question"
import {
  useQuery, gql
} from "@apollo/client"

import {
  useParams, useNavigate
} from "react-router-dom"

import moment from "moment"

const GET_ATTEMPT_DETAILS = gql`
query GetAttemptDetails($attemptId: ID!){
  getAttemptDetails(attemptId: $attemptId){
    leftTime
    sequentiel
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
  const [leftTime, setLeftTime] = React.useState(0)
  const {data, error, loading} = useQuery(GET_ATTEMPT_DETAILS, {variables : {attemptId}})

  const navigate = useNavigate()

  React.useEffect(() => {
    if(data){
      setLeftTime(data.getAttemptDetails.leftTime)
      setQuestions([...data.getAttemptDetails.questions])
    }
  }, [data])

  var timer = null;

  React.useEffect(() => {
    var timer;
    if(leftTime)
      if(leftTime > 0)
        timer = setTimeout(()=> setLeftTime(leftTime - 1), 1000)

    return () => clearTimeout(timer)
  }, [leftTime])

  React.useEffect(() => {
    var hidden = "hidden";
    window.addEventListener('blur', onchange)
     // Standards:
      if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
      else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
      else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
      else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
      // IE 9 and lower:
      else if ("onfocusin" in document)
        document.onfocusout = onchange;
      // All others:
      else
        window.onpageshow = window.onpagehide = onchange;

      function onchange(e){
        //console.log(e)
      }

      window.addEventListener('popstate', (event) => {
        //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
      });

  }, [])

  function fetchNext(){
    if(selected < questions.length - 1){
      setSelected(selected + 1)
    }
  }

  if(error){
    return <b className="text-red-500">{JSON.parse(error.message).text}</b>
  }

	return(
		<div className=" px-1 flex space-x-3 grow overflow-y-hidden">
          <div className="w-3/4 shrink overflow-y-auto pr-2 bg-white dark:bg-zinc-800 flex flex-col rounded-md">
            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 blur sticky top-0"></div>
            <div className="flex-1 grow flex flex-col overflow-y-auto" >
              {questions[selected] && <Question question={questions[selected]?.id} fetchNext={fetchNext} />}
            </div>
          </div>


          <div className="w-1/4 rounded-lg p-1 grow-0 bg-white dark:bg-zinc-800 flex flex-col">
            <div className="rounded mx-2 my-2 py-1 border border-gray-300 dark:border-zinc-700 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className={` font-semibold ${leftTime < 30 ? "text-red-400" : "text-gray-600 dark:text-gray-300"}`}>{moment.utc(leftTime*1000).format("HH:mm:ss")}</p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-3 p-2">
                {
                  questions?.map((question, index) => {
                    const isSelected = selected == index
                    const sequentiel = data.getAttemptDetails.sequentiel
                    return <button disabled={sequentiel} key={index} className={`p-[4px] flex flex-col items-center justify-center border rounded-lg ${isSelected ? "border-indigo-400 text-indigo-500 bg-blue-50 dark:bg-zinc-700" : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-zinc-600"} disabled:cursor-not-allowed`}>{index}</button>
                  })
                }
              </div>
            </div>
            <div className="flex flex-col items-center p-2 justify-center">
              <button className="update-btn border border-green-300 dark:border-zinc-600 font-semibold">Finish the exam</button>
            </div>
          </div>

        </div>
	)
}


export default ExamAttempt;