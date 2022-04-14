import React from "react";
import {
	useQuery, gql
} from "@apollo/client"
import {LoadingPage} from '../../Loadings'
import {
	useParams, Link
} from "react-router-dom"

const GET_EXAM_ATTEMPT= gql`
query GetExamByIdForAttempts($examId: ID!){
  getExamById(examId: $examId){
  	title
    section {
      element {
        name
      }
    }
    studentAttempts {
      id
      isVerified
      createdAt
      totalMarks
      mark
      student {
        fullName
      }
    }
  }
}
`;

function StudentAttempts(){
	const {examId}= useParams()
	const {data, loading, error} = useQuery(GET_EXAM_ATTEMPT, {variables :{examId}})

	if(loading) return <LoadingPage />
	if(error) return <b className="text-red-500">{error.message}</b>
	return(
		<div className="flex flex-col space-y-3">
			<div className="w-full rounded-xl py-2 px-4 bg-white dark:bg-zinc-800">
				<div className="flex items-center space-x-2">
					<Link to={`/my/home/element/${data?.getExamById.section.element.id}`}>
						<p className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ">{data?.getExamById.section.element.name}</p>
					</Link> 
					<span className="dark:text-gray-400">/</span>
					<p className="text-gray-700 dark:text-gray-300">
						{data?.getExamById.title} (Students attempts)
					</p>
				</div>
			</div>

			<div className="w-full flex flex-col space-y-3 rounded-xl py-2 px-4 bg-white dark:bg-zinc-800">
				<p className="heading-text">Attempts</p>
				<div className="flex flex-col space-y-1">
				{
					data?.getExamById.studentAttempts.map((attempt, index) => {
						return (
							<Link to={`/my/home/correct-attempt/${attempt.id}`}>
							<div key={index} className="cursor-pointer group border dark:border-zinc-700 p-1 px-3 rounded-lg flex items-center justify-between dark:hover:bg-zinc-700">
								<div className="dark:text-gray-300 flex item-center space-x-3">
									<div>
										<div className="w-7 h-7 rounded-lg bg-gray-300 dark:bg-zinc-700 group-hover:bg-zinc-600"></div>
									</div>
									<div className="group-hover:text-blue-200">{attempt.student.fullName}</div>
								</div>
								<div className="dark:text-gray-300 flex item-center space-x-3">
									Mark: <span className="text-gray-200 font-semibold mx-2">{attempt.mark}</span> / {attempt.totalMarks}
								</div>
								<div className="flex space-x-3">
									<div className="text-gray-500 dark:text-gray-400 hidden sm:block">{attempt.createdAt}</div>
									<span className={`${attempt.isVerified ? "text-green-500" : "text-gray-500"}`}>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
									</span>
								</div>
							</div>
							</Link>
						)
					})
				}
				</div>
			</div>
		</div>	
	)
}

export default StudentAttempts;