import React from "react";
import {TEACHER_COURSES} from "../api"
import {LoadingPage} from "../Loadings"

import {
	useParams,
	Link
} from "react-router-dom"

import {
	useMutation,
	useQuery,
	gql
} from "@apollo/client"

function getType(type){
	switch(type){
		case "video":
      		return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
		case "pdf":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
		case "announce":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
		case "image":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
		case "homework":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
		case 'exam':
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		default :
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
	}
}

const GET_ELEMENT_CONTENT = gql`
	query GetElementContent($elementId: ID!){
	   getElementContent(elementId: $elementId){
	    id 
	    name
	    sections {
	      id 
	      name 
	      lectures {
	      	id
	        title
	        type
	        isFinished
	      }
	      homeworks {
	      	id
	        title
	        isFinished
	      }
	      exams {
	      	id 
	      	title 
	      	isFinished
	      }
	    }
	  }
	}
`;

const TOGGLE_LECTURE_FINISHED = gql`
	mutation ToggleLectureFinished($lectureId:ID, $homeworkId: ID, $examId: ID){
		toggleLectureFinished(lectureId: $lectureId, homeworkId: $homeworkId, examId: $examId){
			ok
		}
	}
`;

function Lecture({item, type}){

	const [toggleLectureFinished, {data, loading, error}] = useMutation(TOGGLE_LECTURE_FINISHED, {
		refetchQueries : [
			"GetElementContent"
		]
	})

	if(error) console.log(JSON.stringify(error))

	function toggle(){
		const variables = {}
		switch(type){
			case "homework":
				variables.homeworkId = item.id
				break
			case "exam":
				variables.examId = item.id
				break
			default:
				variables.lectureId = item.id
				break
		}
		//type == "homework" ? variables.homeworkId = item.id : (type == "exam" ? variables.examId = item.id : variables.lectureId = item.id)
		toggleLectureFinished({variables})
	}

	return(
		<div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded cursor-pointer">
			<div onClick={() => {}}  className="flex space-x-2 ">
				<span className="text-gray-400">{getType(item.type || type)}</span>
				<Link to={`/my/${type || "lecture"}/${item.id}`}>
					<p className="text-gray-600 dark:text-gray-200">{item.title}</p>
				</Link>
			</div>
            <div onClick={toggle} className={`${item.isFinished ? "text-green-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"} ${loading ? "animate-spin" : ""}`}>
	            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
		</div>
	)
}

function Section({section}){

	return(
		<div className="space-y-2 rounded">
			<div>
				<p className="text-gray-900 dark:text-gray-400 font-semibold text-md">{section.name}</p>
			</div>
			<div className="flex flex-col space-y-2">
				{section.lectures.map((item, index) => {
					return (
						<Lecture item={item} key={index} />
					)
				})}
				{section.homeworks.map((item, index) => {
					return (
						<Lecture type="homework" item={item} key={index} />
					)
				})}
				{section.exams.map((item, index) => {
					return (
						<Lecture type="exam" item={item} key={index} />
					)
				})}
			</div>
		</div>
	)
}



export default function Courses(){
	const {elementId} = useParams();
	const {data, loading, error} = useQuery(GET_ELEMENT_CONTENT, {variables : {elementId}})

	if(loading){
		return <LoadingPage />
	}

	if(error){
		return <b className="text-red-500">An error has been occurred</b>
	}

	return(
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800">
				<div className="flex items-center space-x-2">
					<Link to={`/my/home`}>
						<p className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ">Home</p>
					</Link> 
					<span className="dark:text-gray-400">/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getElementContent.name}
					</p>
				</div>
			</div>
			<div className="w-full bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 rounded shadow p-1">


				<div className="flex flex-col space-y-8 p-2">
					{data?.getElementContent.sections.map((item, index) => {
						return filledSection(item) ?
						 (
							<Section key={index} section={item} />
						)
						:
						null
					})}
				</div>
			</div>
		</div>
	)
}


function filledSection(section){
	return (section.exams.length || section.lectures.length || section.homeworks.length)
}