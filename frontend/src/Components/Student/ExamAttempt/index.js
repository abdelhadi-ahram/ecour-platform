import React from "react";
import Question from "./Question"
import AttemptSummary from "./AttemptSummary"
import {toggleFullScreen} from "./toggleFullScreen"
import ExamIsReported from "./ExamIsReported"
import {LoadingPage} from "../../Loadings"
import ConfirmExamFinish from "../../Dialog/StudentDialogs/ConfirmExamFinish"

import {
  useMutation, useQuery, gql
} from "@apollo/client"

import {
  useParams, useNavigate
} from "react-router-dom"

import moment from "moment"

const GET_ATTEMPT_DETAILS = gql`
query GetAttemptDetails($attemptId: ID!){
  getAttemptDetails(attemptId: $attemptId){
    leftTime
    isReported
    sequentiel
    questions {
      id
    }
  }
}
`;

const REPORT_EXAM = gql`
  mutation ReportExam($attemptId: ID!){
    reportExam(attemptId: $attemptId) {
      ok
    }
  }
`;

const FINISH_EXAM = gql`
  mutation FinishExam($attemptId: ID!) {
    finishExam(attemptId: $attemptId){
      ok
    }
  }
`;

function ExamAttempt(){
  const {attemptId} = useParams()
  const [questions, setQuestions] = React.useState([])
  const [selected, setSelected] = React.useState(0)
  const [leftTime, setLeftTime] = React.useState(0)
  const [examCompleted, setExamCompleted] = React.useState(false)
  const [examIsReported, setExamIsReported] = React.useState(true)
  const [showFinishExamCnfirmation, setShowFinishExamCnfirmation] = React.useState(false)

  const {data, error, loading} = useQuery(GET_ATTEMPT_DETAILS, {variables : {attemptId}, fetchPolicy: "network-only"})
  const [reportExam] = useMutation(REPORT_EXAM, {
    onCompleted : (data) => setExamIsReported(true)
  });
  const [finishExam] = useMutation(FINISH_EXAM, {
    onCompleted : (data) => navigate("/my/home")
  });

  const navigate = useNavigate()

  React.useEffect(() => {
    if(data){
      setExamIsReported(data.getAttemptDetails.isReported)
      setLeftTime(data.getAttemptDetails.leftTime)
      setQuestions([...data.getAttemptDetails.questions])
    }
  }, [data])

  function StopExam(){
    reportExam({variables : {attemptId}})
  }

  React.useEffect(() => {
    var timer;
    if(leftTime)
      if(leftTime > 0)
        timer = setTimeout(()=> setLeftTime(leftTime - 1), 1000)

    return () => clearTimeout(timer)
  }, [leftTime])

  React.useEffect(() => {
    toggleFullScreen()

    function confirmLeaving(event){
      event.preventDefault()
      return "Are you sure you want to finish this exam?"
    }
    
    window.addEventListener("beforeunload", confirmLeaving)
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
      StopExam();
    }

    return () => {
      window.removeEventListener("beforeunload", confirmLeaving)
      window.removeEventListener('blur', onchange)
      document.removeEventListener("visibilitychange", onchange);
      document.removeEventListener("mozvisibilitychange", onchange);
      document.removeEventListener("webkitvisibilitychange", onchange);
      document.removeEventListener("msvisibilitychange", onchange);
      document.onfocusout = window.onpageshow = window.onpagehide = null
    }

  }, [])

  function fetchNext(){
    if(selected < questions.length - 1){
      setSelected(selected + 1)
    }
  }

  if(error){
    return <b className="text-red-500">{JSON.parse(error.message).text}</b>
  }

  function selectQuestion(index){
    if(!data?.getAttemptDetails.sequentiel){
      setSelected(index)
    }
  }

  function questionIsClicked(index){
    console.log("hello world how are you doing today")
    if(examCompleted && !data?.getAttemptDetails.sequentiel){
      setExamCompleted(false)
      setSelected(index)
    }
    else if(!data?.getAttemptDetails.sequentiel) setSelected(index)
  }

  function handleFinishExamClicked(){
    if(leftTime > 60)
      return setShowFinishExamCnfirmation(true)
    finishExam({variables : {attemptId}})
  }

  if(data){
    return(
    <div className=" px-1 flex flex-col space-y-3 overflow-y-auto lg:space-y-0 lg:flex-row lg:space-x-3 grow lg:overflow-y-hidden">
      {
        examIsReported ? (
          <ExamIsReported />
        ) : (
        <>
          <div className="lg:w-3/4 lg:shrink lg:overflow-y-auto pr-2 bg-white dark:bg-zinc-800 flex flex-col rounded-md shadow-lg">
            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 blur sticky top-0"></div>
            <div className="lg:hidden rounded mx-2 my-2 py-1 border border-gray-300 dark:border-zinc-700 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className={` font-semibold ${leftTime < 30 ? "text-red-400" : "text-gray-600 dark:text-gray-300"}`}>{moment.utc(leftTime*1000).format("HH:mm:ss")}</p>
            </div>
            <div className="flex-1 grow flex flex-col overflow-y-auto" >
              {questions.length && (
                examCompleted ?
                <AttemptSummary />
                : 
                <Question index={selected} isLast={questions.length-1 == selected} question={questions[selected]?.id} fetchNext={fetchNext} setExamCompleted={setExamCompleted} />
              )}
            </div>
          </div>


          <div className="lg:w-1/4 rounded-lg p-1 grow-0 bg-white dark:bg-zinc-800 flex flex-col shadow-lg">
            <div className="hidden lg:flex rounded mx-2 my-2 py-1 border border-gray-300 dark:border-zinc-700 items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className={` font-semibold ${leftTime < 30 ? "text-red-400" : "text-gray-600 dark:text-gray-300"}`}>{moment.utc(leftTime*1000).format("HH:mm:ss")}</p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-3 p-2">
                {
                  questions?.map((question, index) => {
                    const isSelected = selected == index
                    const sequentiel = data.getAttemptDetails.sequentiel
                    return <button onClick={() => questionIsClicked(index)} disabled={sequentiel} key={index} className={`p-[4px] flex flex-col items-center justify-center border rounded-lg ${isSelected ? "border-indigo-400 text-indigo-500 bg-blue-50 dark:bg-zinc-700" : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-zinc-600"} disabled:cursor-not-allowed`}>{index}</button>
                  })
                }
              </div>
            </div>
            <div className="flex flex-col items-center p-[5px] justify-center">
              <button onClick={handleFinishExamClicked} className="bg-green-500 text-white px-4 py-[6px] rounded-lg dark:border-zinc-600 font-bold text-md">Finish the exam</button>
            </div>
            {showFinishExamCnfirmation && <ConfirmExamFinish leftTime={leftTime} isShown={showFinishExamCnfirmation} onCancel={() => setShowFinishExamCnfirmation(false)} onOk={() => finishExam({variables : {attemptId}})} /> }
          </div>
        </>
        )
      }
    </div>
  )
  }

  return <LoadingPage />
	
}


export default ExamAttempt;