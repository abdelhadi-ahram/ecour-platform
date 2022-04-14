import React from "react";
import Serializer from "../Editor/Serializer"

import {
	useParams, Link
} from "react-router-dom"
import {
	useQuery, gql
} from "@apollo/client"

const HOMEWORK_ANSWER = gql`
query GetHomeworkAnswer($homeworkAnswerId : ID!){
  getHomeworkAnswer(homeworkAnswerId: $homeworkAnswerId){
    id
    content
    file 
    createdAt
    student {
      fullName
    }
    homework {
      id
      title
      section {
        id
        name
        element {
          id
          name
        }
      }
  }
  }
}
`;

 function getFileName(file){
	const arr = file?.split("/");
	if(arr) return arr[arr.length-1]
	return ""
}

function HomeworkAnswer(){
	const {homeworkAnswerId} = useParams()
	const {data, error, loading} = useQuery(HOMEWORK_ANSWER, {variables : {homeworkAnswerId}})

	return(
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<Link to={`/my/home`}>
						<p className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ">{data?.getHomeworkAnswer.homework.section.element.name}</p>
					</Link> 
					<span className="dark:text-gray-300">/</span>
					<Link to={`/my/home/homework-details/${data?.getHomeworkAnswer.homework.id}`}>
						<p className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ">
							{data?.getHomeworkAnswer.homework.title}
						</p>
					</Link>
					<span className="dark:text-gray-300">/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getHomeworkAnswer.student.fullName}'s answer
					</p>
				</div>
			</div>

			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800 flex justify-between items-center">
				{Serializer(JSON.parse(data?.getHomeworkAnswer.content || "[]"))}
				{ data?.getHomeworkAnswer.file &&
					<div className="w-full px-3 py-1 rounded-md bg-zinc-800 my-2 flex items-center justify-between border border-zinc-700">
						<p className="text-gray-300">{
							getFileName(data?.getHomeworkAnswer.file)
						}</p>
						<span className="text-blue-400 rounded-full bg-zinc-700 p-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
						</span>
					</div>
				}
			</div>
		</div>
	)
}

export default HomeworkAnswer;