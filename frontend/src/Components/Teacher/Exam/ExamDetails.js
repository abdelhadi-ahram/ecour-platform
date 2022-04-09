import React from "react";
import Serializer from "../../Editor/Serializer";
import UpdateHomework from "../../Dialog/TeacherDialogs/UpdateHomework"
import moment from "moment"

import {
	Link, useParams
} from "react-router-dom";

import {
	useQuery, gql
} from "@apollo/client"

import {LoadingPage} from "../../Loadings"

const GET_EXAM_BY_ID = gql`
	query GetExamById($examId: ID!){
		getExamById(examId: $examId){
		    id
		    title
		    description
		    startsAt
		    duration
		    section {
		   	  id
		      name
		      element {
		      	id
		        name
		      }
		    }
		    questions {
		      content
		      mark
		      type{
		        type
		      }
		      choices {
		        content
		        isCorrect
		      }
		    }
		}
	}
`;

function Question({question, index}){
	return (
		<div className="border border-zinc-600 rounded-md py-2 px-3">
			<div className="flex space-x-2">
				<div className="py-2">
					<div className="rounded-full bg-zinc-700 w-6 h-6 flex items-center justify-center">{index}</div>
				</div>
				<div className="w-full flex flex-col space-y-1">
					<p className="">{Serializer(JSON.parse(question.content))}</p>
					<div className="flex flex-col space-y-1">
					{
						question.choices.map((choice, index) => { return (
							<div key={index} className={`w-full p-2 flex rounded border justify-between ${choice.isCorrect ? "border-zinc-600 bg-zinc-700" : "border-zinc-700 bg-zinc-800"}`}>
								<p className="text-gray-300">{choice.content}</p>
								<span className={`${choice.isCorrect ? "text-gray-300" : "text-gray-400"}`}>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
								</span>
							</div>
						)})
					}
					</div>
				</div>
			</div>
			
		</div>
	)
}


function ExamDetails(){
	const [isUpdate, setIsUpdate] = React.useState(false)
	const {examId} = useParams()
	const {data, loading, error} = useQuery(GET_EXAM_BY_ID, {variables : {examId}})

	if(error){
		return <b className='text-red-500' >An error has occurred</b>
	}

	if(loading){
		return <LoadingPage />
	}

	return(
	<>
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<Link to={`/my`}>
						<p className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ">{data?.getExamById.section.element.name}</p>
					</Link> 
					<span className="dark:text-gray-300">/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getExamById.title}
					</p>
				</div>
				<div className="flex justify-end">
					<Link to={`/my/edit-exam/${examId}`}><button className="update-btn">Update</button></Link>
				</div>
			</div>

			{/*Body*/}
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800 flex flex-col space-y-3">
				
				{/*description*/}
				<div className="w-full flex flex-col space-y-2 py-3">
					<div className="flex flex-col space-y-1">
						<div className="flex justify-between items-center">
							<p className="text-gray-400 font-semibold">Description</p>
							<div className="flex items-center space-x-2 px-2">
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
								<p className="text-gray-300 text-sm">{moment.utc(data?.getExamById.duration*1000).format("hh:mm")}</p>
							</div>
						</div>
						<div className="px-2">
							{
								data?.getExamById.description[0] == "[" && Serializer(JSON.parse(data?.getExamById.description))
							}
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<p className="text-gray-400 font-semibold">Starts at</p>
						<div className="px-2 text-gray-300">
							{
								data?.getExamById.startsAt
							}
						</div>
					</div>

					<div className="flex flex-col space-y-1">
						<p className="text-gray-400 font-semibold">Questions</p>
						<div className="px-2 text-gray-300 flex flex-col space-y-2">
							{
								data?.getExamById.questions.map((question, index) => {
									return <Question key={index} question={question} index={index} />
								})
							}
						</div>
					</div>
				</div>
			</div>

			{/**/}
		</div>
	</>
	)
}

export default ExamDetails;