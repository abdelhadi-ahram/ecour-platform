import React from "react";
import HomeworkAnswer from "./HomeworkAnswer"
import Serializer from "../Editor/Serializer";
import getFileName from "../getFileName"

import {
	Link, useParams
} from "react-router-dom";

import {
	useQuery, gql
} from "@apollo/client"

import {LoadingPage} from "../Loadings"

const GET_HOMEWORK_CONTENT = gql`
	query GetHomeworkContent($homeworkId: ID!){
		getHomeworkContent(homeworkId: $homeworkId){
		    title
		    content
		    isOpen
		    deadline
		    section {
		    	element{
		    		id
		    		name
		    	}
		    }
		    answer{
		    	id 
		    	content 
		    	file
		    }
		}
	}
`;


function StudentAnswer({answer, isOpen}){
	return(
	<div className="w-full bg-white dark:bg-zinc-800 rounded-xl px-4 rounded-md shadow border border-green-300 dark:border-zinc-600">
		<div className="flex flex-col space-y-1 py-2 ">
			<div className="flex items-center justify-between">
				<p className="text-gray-600 dark:text-gray-400 font-semibold">My answer:</p>
				{isOpen && <button className="update-btn">Update</button>}
			</div>
			<div className="flex flex-col">
				{
					answer?.content[0] == "[" && Serializer(JSON.parse(answer?.content))
				}

				{ answer.file && 
					<div className="w-full px-3 py-1 rounded-md dark:bg-zinc-800 my-2 flex items-center justify-between border dark:border-zinc-700 text-gray-700 dark:text-gray-300">
						<p>{
							getFileName(answer.file)
						}</p>
						<span className="text-blue-400 rounded-full bg-gray-100 dark:bg-zinc-700 p-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
						</span>
					</div>
				}
			</div>
		</div>
	</div>
	)
}

function HomeworkDetails(){
	const {homeworkId} = useParams()
	const {data, loading, error} = useQuery(GET_HOMEWORK_CONTENT, {variables : {homeworkId}, fetchPolicy: "network-only"})

	if(error){
		return <b className='text-red-500' >An error has occurred</b>
	}

	if(loading){
		return <LoadingPage />
	}

	return(
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<Link to={`/my/element/${data?.getHomeworkContent.section.element.id}`}>
						<p className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">{data?.getHomeworkContent.section.element.name}</p>
					</Link> 
					<span className='dark:text-gray-400'>/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getHomeworkContent.title}
					</p>
				</div>

				{ data?.getHomeworkContent.isOpen ? (
						<div className="rounded-full bg-green-50 dark:bg-zinc-700 px-3 py-2 flex items-center space-x-2 text-green-500 text-sm">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
							<span>Open untill {data?.getHomeworkContent.deadline}</span>
						</div>
					):(
						<div className="rounded-full bg-red-50 dark:bg-zinc-700 px-3 py-2 flex items-center space-x-2 text-red-500 dark:text-red-400 text-sm">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
							<span>This homework is closed</span>
						</div>
					)}
			</div>
			<div className="w-full bg-white dark:bg-zinc-800 rounded-xl px-4 py-1 rounded shadow">
				<div className="flex flex-col space-y-1">
					{
						data?.getHomeworkContent.content[0] == "[" && Serializer(JSON.parse(data?.getHomeworkContent.content))
					}
					{ data?.getHomeworkContent.file && 
					<div className="w-full px-3 py-1 rounded-md dark:bg-zinc-800 my-2 flex items-center justify-between border dark:border-zinc-700 text-gray-700 dark:text-gray-300">
						<p>{
							getFileName(data?.getHomeworkContent.file)
						}</p>
						<span className="text-blue-400 rounded-full bg-gray-100 dark:bg-zinc-700 p-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
						</span>
					</div>
				}
				</div>
			</div>


		{/*Add Homework answer*/}
			{
				data?.getHomeworkContent.answer ? (
					<StudentAnswer answer={data?.getHomeworkContent.answer} isOpen={data?.getHomeworkContent.isOpen} />
				) : (
					data?.getHomeworkContent.isOpen && <HomeworkAnswer homeworkId={homeworkId} />
				)
			}
		</div>
	)
}

export default HomeworkDetails;