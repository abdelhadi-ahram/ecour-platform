import React from "react";
import Serializer from "../../../Editor/Serializer"
import LoadingAnswer from "./LoadingAnswer"
import {
	useMutation, useQuery,gql
} from "@apollo/client"

import {
	useParams, useNavigate
} from "react-router-dom"

const GET_QUESTION_ANSWER = gql`
query GetQuestionAnswer($questionId : ID!, $attemptId : ID!){
	getQuestionAnswer(questionId: $questionId, attemptId : $attemptId){
		content
	    mark
	    type
	    answer
   }
}
`;

const VERIFY_ANSWER = gql`
	mutation VerifyAnswer($questionId: ID!, $attemptId : ID!, $mark: Float ){
		verifyAnswer(questionId: $questionId, attemptId: $attemptId, mark: $mark){
			ok
		}
	}
`;

const VERIFY_ATTEMPT = gql`
	mutation VerifyAttempt($attemptId: ID!){
		verifyAttempt(attemptId: $attemptId){
			ok
		}
	}
`;

function parseStudentAnswer(type, answer){
	if(type == "Plain text") return <div className="border border-zinc-700 px-3 py-2 rounded-md">{Serializer(JSON.parse(answer) || "[]")}</div>
	else {
		const choices = JSON.parse(answer|| "[]")
		return (
			choices.map((choice, index) => {
				return (
					<div key={index} className="flex space-x-2 items-center">
						<span className={`${choice.isCorrect ? "text-green-500 " : "text-gray-400"}`}>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
						</span>
						<div key={index} 
						className={`flex justify-between w-full px-3 py-2 border rounded-md ${choice.isPicked ? "text-blue-400 border-blue-500 bg-zinc-700" : "text-gray-300 border-zinc-600"}`}>
							<p>{choice.content}</p>
							{choice.isPicked && <p className="text-sm">Picked</p>}
						</div>
					</div>
				)
			})
		)
	}
}

function Answer({question,fetchNext, index, isLastItem}){
	const {attemptId} = useParams()
	const inputRef = React.useRef()
	const navigate = useNavigate()
	var goNext = React.useRef(false)
	const [dataError, setDataError] = React.useState(false)

	const {data, error, loading} = useQuery(GET_QUESTION_ANSWER, {
		variables : {questionId : question, attemptId: attemptId},
		fetchPolicy : "network-only"
	})

	const [postVerification] = useMutation(VERIFY_ANSWER)

	const [verifyAttempt] = useMutation(VERIFY_ATTEMPT)

	function onKeyUp(e){
		e.preventDefault()
		if(e.key == "Enter"){
			if(inputRef.current.value == "" && ! goNext.current){
				goNext.current = true
			}
			else {
				goNext.current = false
				verfiyAnswer()
			}
		} else if(e.key == "Backspace"){
			inputRef.current.value = 0
		}else {
			if(/\.|[0-9]+$/g.test(e.key) ){
				if(inputRef.current.value == "0"){
					inputRef.current.value = e.key
				} else {
					inputRef.current.value += e.key
				}
			}
		}
	}

	React.useRef(() => {
		const timer = setTimeout(() => setDataError({error : false}), 3000 )
		return () => clearTimeout(timer)
	}, [dataError])

	React.useEffect(() => {
		document.addEventListener('keyup', onKeyUp)

		return () => {
			document.removeEventListener('keyup', onKeyUp)
		}
	})

	function verfiyAnswer(){
		const mark = parseFloat(inputRef.current.value || "0")
		if(!isNaN(mark)){
			const questionId = question
			postVerification({variables : {attemptId,questionId,mark}})
			.then(data => {
				fetchNext()
			},
			err => {
				setDataError({error : true, message : err.message})
			})
		} else {
			setDataError({error : true, message : "The mark should be a number"})
		}
	}


	function askForAttemptVerification(){
		verifyAttempt({variables: {attemptId}})
		.then((data) => {
			navigate("/my/")
		},(err) => {
			setDataError({error : true, message: err.message})
		})
	}

	if (loading) return <LoadingAnswer />

	return(
		<div className="flex flex-col space-y-3 py-1 px-2 flex-1 lg:overflow-y-auto">
			{dataError.error && (<div className="px-3 py-2 text-red-500 border border-red-500 rounded-md bg-zinc-700">
				{dataError.message}
			</div>)}
			<div className="border border-zinc-700 rounded px-3 py-2 flex items-center justify-between text-gray-400">
				<p>Question {index + 1 > 10 ? '0'+index+1 : index+1}</p>
				<div className="flex space-x-2">
					<p>Mark :</p>
					<input ref={inputRef} className={`w-12 rounded border bg-transparent focus:outline-none text-gray-200 text-center ${goNext.current ? "border-red-500" : "border-zinc-700"}`} placeholder="0" />
					<p className="text-gray-400">/ {data?.getQuestionAnswer.mark}</p>
				</div>
			</div>
			<div className="flex flex-col p-2 flex-1 overflow-y-auto">
				<div className="py-6 text-gray-100 text-lg select-none">
					{Serializer(JSON.parse(data?.getQuestionAnswer.content || "[]")) }
				</div>
				<div className="flex flex-col space-y-2">
					{
						parseStudentAnswer(data?.getQuestionAnswer.type, data?.getQuestionAnswer.answer)
					}
				</div>
			</div>
			<div className="flex items-center justify-end p-2">
				{ isLastItem ? (
					<button onClick={askForAttemptVerification} className="update-btn border border-green-300 dark:border-zinc-600 font-bold">Verify this attempt</button>
		        ) : (
		        	<button className="post-btn" onClick={verfiyAnswer}>Next</button>
		        )
				}
			</div>
		</div>
	)
}


export default Answer;