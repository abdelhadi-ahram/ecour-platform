import React from "react";
import moment from "moment"
import {
	useMutation, useQuery, gql
} from "@apollo/client"

import Choices from "./Choices"
import QuestionInfo from "./QuestionInfo"
import Serializer from "../../Editor/Serializer"
import TextEditor, {initialValue} from "../../Editor"
import LoadingQuestion from "./LoadingQuestion"

import {
	useParams
} from "react-router-dom"


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

const SAVE_QUESTION = gql`
	mutation SaveStudentAnswer($attemptId: ID!, $questionId: ID!, $content: String!){
		saveStudentAnswer(attemptId: $attemptId, questionId: $questionId, content: $content){
			ok 
			nextQuestion
		}
	}
`;


const generateChoicesForm = (type) => {
	if (type === "Multi choice") return []
	return ""
}


function Question({question, fetchNext, index, isLast, setExamFinished}){
	const [questionId, setQuestionId] = React.useState(question)
	const {attemptId} = useParams()
	const [selectedChoices, setSelectedChoices] = React.useState(0)
	const [content, setContent] = React.useState(initialValue)
	var resetValue = () => {}

	const [saveQuestionAnswer, saveQuestionResponse] = useMutation(SAVE_QUESTION)

	const {data, error, loading} = useQuery(GET_QUESTION_CONTENT, {
		variables : {questionId, attemptId},
		fetchPolicy: "network-only"
	})

	React.useEffect(() => {
		setSelectedChoices(generateChoicesForm(data?.getQuestionContent.type.type))
	}, [data])

	React.useEffect(() => {
		setQuestionId(question)
	}, [question])


	if (loading) return <LoadingQuestion />
	if(error) {
		console.log(error.message)
		return <b className="text-red-500">{error.message}</b>
	}

	function resetQuestion(){
		setContent(initialValue)
	}

	function saveQuestion(){
		const answer = {questionId , attemptId}
		if(data?.getQuestionContent.type.type == "Plain text"){
			answer.content = JSON.stringify(content)
		} else{
			if(typeof selectedChoices == "string"){
				answer.content = JSON.stringify([selectedChoices])
			} else {
				answer.content = JSON.stringify([...selectedChoices])
			}
		}
		saveQuestionAnswer({variables : answer})
		.then((data) => {
			if(isLast) setExamFinished(true)
			else fetchNext()
		}, (err) => {
			console.log(err)
		})
	}

	return(
		<div className="flex flex-col space-y-3 py-1 px-2 flex-1 overflow-y-auto">
			<QuestionInfo index={index} resetQuestion={resetQuestion} mark={data?.getQuestionContent.mark} estimatedTime={data?.getQuestionContent.estimatedTime} />
			<div className="flex flex-col p-2 flex-1 overflow-y-auto">
				<div className="py-6 text-gray-100 text-lg select-none">
					{Serializer(JSON.parse(data?.getQuestionContent.content || "[]")) }
				</div>
				{
					data && (selectedChoices !== 0) && ( 
						data.getQuestionContent.type.type == "Plain text" ? (
							<TextEditor resetValue={(fun) => resetValue = fun} height="150px" maxHeight="200px" value={content} setValue={setContent} />
						) : (
							<Choices selectedChoices={selectedChoices} setSelectedChoices={setSelectedChoices} choices={data.getQuestionContent.choices} />
						)
					)
				}
			</div>

			<div className="flex items-center justify-end p-2">
              <button onClick={saveQuestion} className="post-btn">Next</button>
            </div>
		</div>
	)
}

export default Question;