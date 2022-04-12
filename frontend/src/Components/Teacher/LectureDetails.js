import React from "react";
import {LoadingPage} from "../Loadings"
import UpdateLectureText from "../Dialog/TeacherDialogs/UpdateLectureText"
import UpdateLectureFile from "../Dialog/TeacherDialogs/UpdateLectureFile"
import MediaParser from "../Media/MediaParser"

import {
	useParams,
	Link
} from "react-router-dom"

import {
	useQuery,
	gql
} from "@apollo/client"

const GET_LECTURE_CONTENT = gql`
	query GetLectureById($lectureId: ID!){
	   getLectureById(lectureId: $lectureId){
	   		id
		    title
		    content
		    seen
		    file
		    type
		    accessedBy{
		      fullName
		      email
		    }
		    section{
		    	name
		    	element {
		    		id 
		    		name
		    	}
		    }
	  }
	}
`;

function LectureDetails(){
	const {lectureId} = useParams()
	const [isUpdate, setIsUpdate] = React.useState(false)
	const {data, loading, error} = useQuery(GET_LECTURE_CONTENT, {variables : {lectureId}})

	if(loading){
		return <LoadingPage />
	}

	if(error){
		return <b className="text-red-500">Error occurred</b>
	}

	return(
		<>
		{
			isUpdate && (
				data?.getLectureById.type === "text" ? (
						<UpdateLectureText onCancel={setIsUpdate} />
					) : (
						<UpdateLectureFile onCancel={setIsUpdate} />
					)
				)
		}
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800">
				<div className="flex items-center space-x-2">
					<Link to={`/my`}>
						<p className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">{data?.getLectureById.section.element.name}</p>
					</Link> 
					<span className="dark:text-gray-300">/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getLectureById.title}
					</p>
				</div>
			</div>
			<div className="w-full bg-white dark:bg-zinc-800 rounded-xl px-4 py-2 rounded shadow p-1 flex flex-col space-y-3">
				<div className="flex justify-end w-full">
					<button className="update-btn" onClick={() => setIsUpdate(true)}>update</button>
				</div>
				<div className="flex flex-col space-y-4 dark:text-gray-300">
					<MediaParser lecture={data?.getLectureById} />
				</div>
			</div>

			<div className="w-full bg-white dark:bg-zinc-800 rounded-md flex flex-col space-y-2 px-4 py-2">
				<p className="font-semibold text-gray-700 dark:text-gray-300">Accessed by: <span className="text-gray-500 dark:text-gray-400 text-sm">({data?.getLectureById.seen} times)</span></p>
				{
					data?.getLectureById.accessedBy.map((item, index)=> {
						return (
							<div key={index} className="w-full rounded-md bg-white dark:bg-zinc-800 flex px-2 py-1 items-center space-x-3 border dark:border-zinc-700">
								<div>
									<div className="rounded-lg w-9 h-9 bg-gray-400"></div>
								</div>
								<div className="w-full dark:text-gray-200">{item.fullName}</div>	
								<div className="w-full text-center dark:text-gray-200">{item.email}</div>
								<div className="w-full flex items-center justify-center">
									<span className="text-green-400">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
									</span>
								</div>		
							</div>)
					})
				}
			</div>
		</div>
		</>
	)
}


export default LectureDetails;