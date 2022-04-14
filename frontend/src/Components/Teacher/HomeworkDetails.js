import React from "react";
import Serializer from "../Editor/Serializer";
import UpdateHomework from "../Dialog/TeacherDialogs/UpdateHomework"

import {
	Link, useParams
} from "react-router-dom";

import {
	useQuery, gql
} from "@apollo/client"

import {LoadingPage} from "../Loadings"

const GET_HOMEWORK_CONTENT = gql`
	query GetHomeworkById($homeworkId: ID!){
		getHomeworkById(homeworkId: $homeworkId){
		    title
		    content
		    file
		    deadlineDate 
		    deadlineTime
		    section{
		    	element{
		    		name
		    	}
		    }
		    studentAnswers{
		    	id
		        createdAt
		        student {
					fullName
					cin
					email
		        }
		    }
		}
	}
`;



function HomeworkDetails(){
	const [isUpdate, setIsUpdate] = React.useState(false)
	const {homeworkId} = useParams()
	const {data, loading, error} = useQuery(GET_HOMEWORK_CONTENT, {variables : {homeworkId}})

	if(error){
		return <b className='text-red-500' >An error has occurred</b>
	}

	if(loading){
		return <LoadingPage />
	}

	return(
	<>
	{
		isUpdate && <UpdateHomework homework={data?.getHomeworkById} onCancel={setIsUpdate} />
	}
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<Link to={`/my/home`}>
						<p className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ">{data?.getHomeworkById.section.element.name}</p>
					</Link> 
					<span className="dark:text-gray-300">/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getHomeworkById.title}
					</p>
				</div>
			</div>
			<div className="w-full bg-white dark:bg-zinc-800 rounded-xl px-4 py-2 rounded shadow">
				<div className="flex justify-end w-full">
					<button className="update-btn" onClick={() => setIsUpdate(true)} >update</button>
				</div>
				<div className="flex flex-col space-y-1">
					<div className="">
					{
						data?.getHomeworkById.content[0] == "[" && Serializer(JSON.parse(data?.getHomeworkById.content))
					}
					</div>

					{ data?.getHomeworkById.file && 
						<div className="w-full px-3 py-1 rounded-md dark:bg-zinc-800 my-2 flex items-center justify-between border dark:border-zinc-700 text-gray-700 dark:text-gray-300">
							<p>{
								data?.getHomeworkById.file
							}</p>
							<span className="text-blue-400 rounded-full bg-gray-100 dark:bg-zinc-700 p-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
							</span>
						</div>	}

				</div>
			</div>


			<div className="w-full bg-white dark:bg-zinc-800 rounded-md flex flex-col space-y-3 px-4 py-2">
				<p className="font-semibold text-gray-700 dark:text-gray-300">Answers:</p>
				<div className="w-full flex flex-col space-y-1">
				{
					data?.getHomeworkById.studentAnswers.map((item, index)=> {
						return (
							<Link to={`/my/home/homework-answer/${item.id}`}>
								<div key={index} className="w-full rounded-md bg-white dark:bg-zinc-800 flex px-2 py-1 items-center space-x-3 border dark:border-zinc-700">
									<div>
										<div className="rounded-lg w-9 h-9 bg-gray-400"></div>
									</div>
									<div className="w-full text-gray-800 dark:text-gray-200">{item.student.fullName}</div>	
									<div className="w-full text-center text-gray-800 dark:text-gray-200">{item.student.email}</div>
									<div className="w-full flex items-center justify-center text-gray-600 dark:text-gray-400">
										{item.createdAt}
									</div>		
								</div>
							</Link>)
					})
				}
				</div>
			</div>

		</div>
	</>
	)
}

export default HomeworkDetails;