import React from "react";
import TextEditor, {initialValue} from "../../Editor"
import {Transition} from "@headlessui/react"
import {LoadingPage} from "../../Loadings"
import {
	useParams, useNavigate
} from "react-router-dom"

import {
	useMutation,useQuery,gql
} from "@apollo/client"


function QuestionTypes({onChange, selectedItem}){
	const [isShown, setIsShown] = React.useState(false)
	const [selected, setSelected] = React.useState(selectedItem)

	const {data, error, loading} = useQuery(gql`
		query GetQuestionTypes{
			getQuestionTypes{
				id 
				type
			}
		}
	`)

	function itemChosen(item){
		onChange(item)
		setIsShown(false)
		setSelected(item)
	}

	React.useEffect(() => {
		if(selectedItem){
			setSelected(selectedItem)
		} else {
			setSelected(data?.getQuestionTypes)
		}
	}, [selectedItem])


	return (
		<div className="flex flex-col w-40">
			<div className="p-[5px] px-2 rounded-md border dark:border-zinc-600 dark:text-gray-300 flex justify-between" onClick={() => setIsShown(!isShown)}>
				<p>{
					selected.type || <span className="text-gray-500 dark:text-gray-400">Choose</span>
				}</p>
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
			</div>
			<div className="relative mt-[1px]">
				<Transition show={isShown}
	              enter="transform transition duration-[400ms]"
	              enterFrom="scale-y-0"
	              enterTo="scale-y-100"
	              leave="transform transition duration-[400ms]"
	              leaveFrom="scale-y-100"
	              leaveTo="scale-y-0"
            	>
					<div className="absolute z-40 shadow-lg top-0 left-0 w-full bg-gray-50 dark:bg-zinc-700 rounded-md">
							{
								data?.getQuestionTypes.map((item, index) => (
									<div onClick={() => itemChosen(item)} key={index} className="p-2 text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-600">{item.type}</div>
								))
							}
					</div>
				</Transition>
			</div>
		</div>
	)
}

function getQuestionProto(){
	return {
		content : initialValue,
		id: null,
		type: {},
		mark: 0,
		choices : []
	}
}


const ADD_QUESTIONS = gql`
	mutation AddQuestions($examId:ID!, $examData: String!){
		addQuestions(examId: $examId, examData: $examData){
			ok
		}
	}
`;

const GET_EXAM_QUESTIONS = gql`
	query GetExamQuestions($examId: ID!){
	  getExamQuestions(examId: $examId){
	  	id
	    content
	    mark
	    type {
	      id
	      type
	    }
	    choices {
	      id
	      isCorrect
	      content
	    }
	  }
	}
`;


function EditExam(){
	const navigate = useNavigate()
	const {examId} = useParams()
	const [questions, setQuestions] = React.useState([getQuestionProto()])
	const [selected, setSelected] = React.useState(0)
	const [dataError, setDataError] = React.useState({error: false, message: ""})
	var resetValue = () => {};

	const [editorValue, setEditorValue] = React.useState([{
		...getQuestionProto()
	}])

	const [sendQuestions , sendQuestionsData] = useMutation(ADD_QUESTIONS, {
		onError : error => {
			console.log(error)
		}
	})

	const {data, error, loading} = useQuery(GET_EXAM_QUESTIONS, {variables : {examId}})


	//if an error occurred
	React.useEffect(() => {
		if(dataError.error) setTimeout(() => setDataError({error: false, message: ""}), 5000)
	}, [dataError])

	React.useEffect(() => {
		resetValue(questions[selected].content)
	}, [selected])

	//if data is changed
	React.useEffect(() => {
		if(data){
			const questionsData = data.getExamQuestions.map(item => {
				return {
					mark: item.mark,
					type: item.type, 
					id: item.id, 
					content: JSON.parse(item.content),
					choices: item.choices.map(choice => {return {isCorrect: choice.isCorrect, content: choice.content, id: choice.id} })
				}})
			if(questionsData.length)
				setQuestions([...questionsData])
			else 
				setQuestions([getQuestionProto()])
		} 
	}, [data])

	function addChoice(e){
		if (e.keyCode === 13) {
	    // Cancel the default action, if needed
	    e.preventDefault();

	    const selectedQuestion = questions[selected];
	    selectedQuestion.choices.push({content: e.target.value, isCorrect: false, id:null});
			setQuestions([...questions])
			e.target.value = ""
	  }
	}


	function setQuestionContent(value){
		const selectedQuestion = questions[selected];
		selectedQuestion.content = value 
		setQuestions([...questions])
	}

	function addQuestion(){
		const question = getQuestionProto();
		questions.push(question)
		setQuestions([...questions])
		setSelected(questions.length-1)
	}

	function setIsCorrect(index){
		const selectedQuestion = questions[selected];
		selectedQuestion.choices[index].isCorrect = !selectedQuestion.choices[index].isCorrect
		setQuestions([...questions])
	}

	function setQuestionType(item){
		const selectedQuestion = questions[selected];
		selectedQuestion.type = item
		setQuestions([...questions])
	}

	function setQuestionMark(e){
		if(e.target.value.match(/^\s*|[0-9]+(.)?[0-9]+?$/)){
			const selectedQuestion = questions[selected];
			selectedQuestion.mark = e.target.value
			setQuestions([...questions])
		}
	}

	function deleteQuestion(){
		setQuestions( questions.length > 1 ?
			questions.filter((item, index) => {
				return selected !== index
			}) :
			 [getQuestionProto()]
		)
		setSelected(selected == 0 ? selected : selected - 1)
	}

	function publishExam(){
		let valid = true;
		const questionsData = questions.map((item) => {
			valid = !(!item.type.id || parseFloat(item.mark) == 0 || (item.type.type != "Plain text" && item.choices.length == 0)) 
			return {...item, type: item.type.id};
		})
		if(!valid){ 
			setDataError({error: true, message : "Make sure that you've entered a valid mark, type and choices"})
			return 
		}
		//Add questions
		sendQuestions({variables : {examId : examId, examData: JSON.stringify(questionsData)},
			onCompleted : (data) => {
				navigate("/my/home")
			}
	})
		//console.log(questionsData)
	}

	if(sendQuestionsData.loading){
		return <LoadingPage />
	}

	return(
		<>
		<div className="py-3 lg:px-2 w-full flex flex-col lg:flex-row lg:space-x-1 lg:grow lg:overflow-y-hidden">
		  <div className="w-full lg:w-3/4 lg:shrink lg:overflow-y-auto lg:pr-2">
				<div className="w-full h-2 bg-gray-100 dark:bg-zinc-900 blur sticky top-0"></div>
				{/*<div className="flex space-x-3">*/}

		   		{/*Showng errors to the user*/}
				<div className="flex-1 overflow-y-auto flex flex-col space-y-2">
					<div className="w-full bg-white dark:bg-zinc-800 py-2 px-3 rounded-md flex flex-col space-y-3 shadow-md">
						<Transition show={dataError.error}
			              enter="transform transition duration-[400ms]"
			              enterFrom="scale-y-0"
			              enterTo="scale-y-100"
			              leave="transform transition duration-[400ms]"
			              leaveFrom="scale-y-100"
			              leaveTo="scale-y-0"
			            >
				            <p className="rounded-md bg-red-50 dark:bg-zinc-700 px-3 py-2 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400">
				            	{dataError.message}
				            </p>
		              </Transition>
							<div className="flex justify-between">
									<div className="flex justify-between space-x-3">
											<div className="flex flex-col space-y-1">
												<p className="text-gray-500 dark:text-gray-400 font-semibold">Type</p>
												<QuestionTypes selectedItem={questions[selected].type} onChange={setQuestionType} />
											</div>
											<div className="flex flex-col space-y-1">
												<p className="text-gray-500 dark:text-gray-400 font-semibold">Mark</p>
												<input onChange={setQuestionMark} value={questions[selected].mark} className="input w-48" />
											</div>
									</div>

									<div className="">
										<div onClick={deleteQuestion} className="text-red-400 p-[6px] rounded-full dark:bg-zinc-700 bg-red-50">
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
										</div>
									</div>
							</div>

							<div className="flex flex-col space-y-2">
								<p className="text-gray-500 dark:text-gray-400 font-semibold">Question</p>
								<TextEditor resetValue={(fun) => resetValue = fun} maxHeight="100px" value={questions[selected].content} setValue={setQuestionContent} />
							</div>
					</div>

					{ (questions[selected].type.id && questions[selected].type.type !== "Plain text") &&
						<div className="w-full bg-white dark:bg-zinc-800 py-2 px-3 rounded-md flex flex-col space-y-3 shadow-lg">
							<div className="flex flex-col space-y-2">
								<p className="text-gray-500 dark:text-gray-400 font-semibold">Choices</p>
								<div className="flex flex-col space-y-2">
									{
										questions[selected].choices.map((item, index) => {
											const {isCorrect} = item
											return (
												<div key={index} className={`w-full p-2 flex rounded border justify-between ${isCorrect ? "text-green-500 bg-green-50 border-green-500 dark:border-green-500 dark:bg-zinc-700" : "bg-white border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"}`}>
													<p className="text-gray-700 dark:text-gray-300">{item.content}</p>
													<span onClick={() => setIsCorrect(index)} className={`${isCorrect ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}>
														<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
													</span>
												</div>
											)
										})
									}
									<div className="w-full">
										<input placeholder="Enter a choice" onKeyUp={addChoice} className="w-full rounded p-2 bg-transparent text-gray-800 dark:text-gray-300 focus:outline-none border border-gray-400 dark:border-zinc-600 mt-2" />
									</div>
								</div>
							</div>
						</div>
					}

				</div>
			</div>

		{/* left Sidebar for users */}
			<div className="w-full lg:w-1/4 rounded-lg p-1 lg:grow-0 lg:overflow-y-auto">
					<div className="flex flex-col space-y-3">
						<div className="flex w-full">
								<button onClick={publishExam} className="update-btn w-full flex justify-center items-center space-x-3 border dark:border-0 border-green-500">
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>
									<span>Publish</span>
								</button>
						</div>

						<div className="w-full rounded-md shadow-md bg-white dark:bg-zinc-800 py-2 px-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-3 gap-2">
								{
									questions.map((item, index) => {
										const warning = (!item.type.id || parseInt(item.mark) === 0 || (item.type.type != "Plain text" && item.choices.length == 0) )
										return <div onClick={() => setSelected(index)} key={index} className={`w-full cursor-pointer bg-gray-100 dark:bg-zinc-700 py-[4px] rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-200 text-md border ${selected == index ? "border-blue-400 text-blue-400":`${warning ? "border-yellow-500 text-yellow-500" : "border-gray-300 hover:dark:border-gray-400 dark:border-zinc-600 dark:hover:border-zinc-500"}`}`}>Q-{index+1}</div>
									})
								}
								<div onClick={addQuestion} className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 border-gray-400 dark:border-zinc-600 dark:hover:border-zinc-500 p-[4px] rounded-lg text-gray-700 dark:text-gray-200 text-md flex justify-center items-center">
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
								</div>
						</div>
					</div>
			</div>

		</div>
	</>
	)
}


export default EditExam;