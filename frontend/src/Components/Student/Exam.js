import React from "react";
import {LoadingPage} from "../Loadings"

import Serializer from "../Editor/Serializer"

import MakeAttempt from "../Dialog/StudentDialogs/MakeAttempt"

import {
	useParams,
	Link
} from "react-router-dom"

import {
	useQuery,
	gql
} from "@apollo/client"

const GET_EXAM_CONTENT = gql`
	query GetExamContent($examId: ID!){
	   getExamContent(examId: $examId){
	   		id
		    title
		    description
		    isOpen
		    message
		    studentAttemptsCount
		    section{
		    	name 
		      element{
		        id 
		        name
		      }
		    }
		    attempts {
		    	mark 
		    	createdAt
		    }
	  }
	}
`;

function Exam(){
	const {examId} = useParams()

	const {data, loading, error} = useQuery(GET_EXAM_CONTENT, {variables : {examId}, fetchPolicy: "network-only"})
	const [makeAttempt, setMakeAttempt] = React.useState(false)
	if(loading){
		return <LoadingPage />
	}

	if(error){
		return <b className="text-red-500">{JSON.stringify(error)}</b>
	}

	return(
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800">
				<div className="flex items-center space-x-2">
					<Link to={`/my/home`}>
						<p className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ">Home</p>
					</Link> 
					<span className="dark:text-gray-400">/</span>
					<Link to={`/my/element/${data?.getExamContent.section.element.id}`}>
						<p className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ">{data?.getExamContent.section.element.name}</p>
					</Link> 
					<span className="dark:text-gray-400">/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getExamContent.title}
					</p>
				</div>
			</div>

			<div className="w-full bg-white rounded-xl dark:bg-zinc-800 px-3 py-2 rounded shadow p-1">
				<div className="flex flex-col space-y-8 p-2">
					{
						Serializer(JSON.parse(data?.getExamContent.description || "[]"))
					}
				</div>

				<div className="p-4 ">
					<div className="flex flex-col items-center">
						<div className="rounded-md border border-gray-300 dark:border-zinc-700 px-10 py-4 flex flex-col items-center space-y-3">
							<p className={`${data?.getExamContent.isOpen ? "text-green-500 font-semibold" : "text-gray-400"} text-gray-400 text-sm`}>{data?.getExamContent.message}</p>
							<div>
							{
								data?.getExamContent.isOpen ?
									<button onClick={() => setMakeAttempt(true)} className="post-btn">Make an attempt</button>
								:
								<Link to={`/my/element/${data?.getExamContent.section.element.id}`}>
									<button className="cancel-btn">Back to home</button>
								</Link>
							}
							</div>
						</div>

						{makeAttempt && <MakeAttempt isShowing={makeAttempt} onCancel={() => setMakeAttempt(false)} />}
					</div>
				</div>
			</div>

			<div className="w-full bg-white rounded-xl dark:bg-zinc-800 px-3 py-2 rounded shadow p-1 flex flex-col space-y-3">
				<p className="text-gray-500 dark:text-gray-400 font-bold">My attempts</p>
				{
					data?.getExamContent.attempts.map((attempt, index) => {
						return (
							<div key={index} className="border border-gray-300 dark:border-zinc-700 p-2 rounded-lg flex items-center justify-between">
								<div className="text-gray-600 font-semibold dark:text-gray-300">Attempt {index+1}</div>
								{attempt.mark && <div className="dark:text-gray-300">Mark <span className="text-gray-200">{attempt.mark}</span></div>}
								<div className="dark:text-gray-300"><span className="text-gray-400">{attempt.createdAt}</span></div>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}


export default Exam;