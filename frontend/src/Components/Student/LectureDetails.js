import React from "react";
import {LoadingPage} from "../Loadings"

import Serializer from "../Editor/Serializer"

import {
	useParams,
	Link
} from "react-router-dom"

import {
	useQuery,
	gql
} from "@apollo/client"

const GET_LECTURE_CONTENT = gql`
	query GetLectureContent($lectureId: ID!){
	   getLectureContent(lectureId: $lectureId){
		    title
		    content
		    section{
		      element{
		        id 
		        name
		      }
		    }
	  }
	}
`;

function LectureDetails(){
	const {lectureId} = useParams()

	const {data, loading, error} = useQuery(GET_LECTURE_CONTENT, {variables : {lectureId}, fetchPolicy: "network-only"})

	if(loading){
		return <LoadingPage />
	}

	if(error){
		return <b className="text-red-500">Error occurred</b>
	}

	return(
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800">
				<div className="flex items-center space-x-2">
					<Link to={`/my/element/${data?.getLectureContent.section.element.id}`}>
						<p className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ">{data?.getLectureContent.section.element.name}</p>
					</Link> 
					<span>/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getLectureContent.title}
					</p>
				</div>
			</div>
			<div className="w-full bg-white rounded-xl dark:bg-zinc-800 px-3 py-2 rounded shadow p-1">
				<div className="flex flex-col space-y-8 p-2">
					{
						Serializer(JSON.parse(data?.getLectureContent.content || "[]"))
					}
				</div>
			</div>
		</div>
	)
}


export default LectureDetails;