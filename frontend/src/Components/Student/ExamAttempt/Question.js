import React from "react";
import moment from "moment"
import {
	useQuery,gql
} from "@apollo/client"

import Choices from "./Choices"
import Serializer from "../../Editor/Serializer"
import TextEditor from "../../Editor"

import {
	useParams
} from "react-router-dom"

const arr = ["To enjoy life","To worship god", "None of those"]

function QuestionInfo({estimatedTime, mark}){
	const [idealTime, setIdealTime] = React.useState(estimatedTime)

	React.useEffect(() => {
      if(idealTime > 0)
        setTimeout(()=> setIdealTime(idealTime - 1), 1000)
	 }, [idealTime])

	React.useEffect(() => {
      setIdealTime(estimatedTime)
	 }, [estimatedTime])

	return(
		<div className="w-full flex items-center justify-between rounded-md border border-zinc-700 p-2">
			<div>
				<p className='text-gray-400 '>Question 01</p>
			</div>
			<div className="flex items-center space-x-2">
				<div className="flex items-center space-x-1 text-gray-400 text-sm px-2 py-[1px] rounded-full bg-zinc-700">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
					<p className="text-gray-300">Reset</p>
				</div>
				<div className="flex items-center space-x-1 text-gray-400 text-sm px-2 py-[1px] rounded-full bg-zinc-700">
					<p >Mark</p>
					<p className="text-gray-300">{mark}pt</p>
				</div>
				<div className="flex items-center space-x-1 text-gray-400 text-sm px-2 py-[1px] rounded-full bg-zinc-700">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					<p className="text-gray-300">{idealTime > 3600 ? moment.utc(idealTime*1000).format("hh:mm:ss") : moment.utc(idealTime*1000).format("mm:ss")}</p>
				</div>
			</div>
		</div>
	)
}


const GET_QUESTION_CONTENT = gql`
query GetQuestionContent($attemptId: ID!, $questionId: ID!){
	getQuestionContent(attemptId: $attemptId, questionId: $questionId){
		estimatedTime
		mark
		content
		type {
			id 
			type
		}
		choices {
			id
			content
		}
	}
}
`;

function Question({question, fetchNext}){
	const [questionId, setQuestionId] = React.useState(question)
	const {attemptId} = useParams()

	const {data, error, loading} = useQuery(GET_QUESTION_CONTENT, {
		variables : {questionId, attemptId}
	})

	/*React.useEffect(() => {
		setQuestionId(question)
	}, [data])*/

	React.useEffect(() => {
		setQuestionId(question)
	}, [question])

	if(error) return <b className="text-red-500">{error.message}</b>
	return(
		<div className="flex flex-col space-y-3 py-1 px-2 flex-1 overflow-y-auto">
			<QuestionInfo mark={data?.getQuestionContent.mark} estimatedTime={data?.getQuestionContent.estimatedTime} />
			<div className="flex flex-col p-2 flex-1 overflow-y-auto">
				<div className="py-6 text-gray-100 text-lg select-none">
					{Serializer(JSON.parse(data?.getQuestionContent.content || "[]")) }
				</div>
				{
					<Choices type={data?.getQuestionContent.type.type} choices={data?.getQuestionContent.choices} />
				}
			</div>
			<div className="flex items-center justify-end p-2">
              <button onClick={fetchNext} className="post-btn">Next</button>
            </div>
		</div>
	)
}

export default Question;