import React from "react";
import TextEditor from "../../Editor"

import {
	useParams, useNavigate
} from "react-router-dom"

import {
	useMutation,
	gql
} from "@apollo/client"


const ADD_EXAM = gql`
	mutation AddExam($sectionId: ID!, $title: String!, $description: String, $startsAt: String, $duration: String, $attempts: Int, $sequentiel:Boolean) {
		addExam(sectionId: $sectionId, title: $title, description: $description, startsAt: $startsAt, duration: $duration, attempts: $attempts, sequentiel: $sequentiel){
			id
		}
	}
`;

function Boolean({value, onChange, selected}){
	const [isSelected, setIsSelected] = React.useState(selected)
	return(
		<div onClick={() => {onChange(!isSelected); setIsSelected(!isSelected)}} className={`w-full rounded flex items-center justify-between px-2 py-1 border ${isSelected ? "bg-blue-50 dark:bg-zinc-700 border-blue-400 text-blue-400" : "bg-transparent border-gray-300 dark:border-zinc-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-zinc-600"}`} >
			<p>{value}</p>
			<span className={`${isSelected ? "text-blue-400" : "text-gray-300"}`}>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			</span>
		</div>
	)
}

function AddExam(){
	const {sectionId} = useParams()
	const [editorValue, setEditorValue] = React.useState(initialValue)

	const navigate = useNavigate()

	const [addExam, {data, error, loading}] = useMutation(ADD_EXAM)

	const [examData, setExamData] = React.useState({
		title : "",
		duration: "",
		startsAtTime : "",
		startsAtDate: "",
		sequentiel: false,
		attempts: 1
	})

	function handleChange(e){
		const name = e.target.name 
		const value = e.target.value 

		setExamData({
			...examData,
			[name] : value
		})
	}

	function postData(){
		const {title,duration,startsAtTime,startsAtDate,sequentiel,attempts} = examData;
		const startsAt = startsAtDate + " " + startsAtTime;
		const description = JSON.stringify(editorValue)
		addExam({variables: {
			sectionId, title, duration, sequentiel, attempts, startsAt, description
		}})

		/*
			onComplete : (data) => {
			if(data?.addExam.id){
				navigate(`/my/edit-exam/${data.addExam.id}`)
			}
		}
		*/
	}

	React.useEffect(() => {
		if(data?.addExam.id){
			navigate(`/my/edit-exam/${data.addExam.id}`)
		}
	}, [data])

	function resetValue(){}

	return(
		<div className="bg-white dark:bg-zinc-800 rounded-md px-4 flex flex-col space-y-3 py-4 shadow">
			<div className="w-full flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
				<div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
            <div className="flex flex-col space-y-1 w-full">
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Starts at</p>
              <div className="flex items-center space-x-3 w-full rounded border border-gray-300 dark:border-zinc-700 dark:text-gray-200 px-2 py-1 hover:border-gray-300 dark:hover:border-zinc-600">
              	<input onChange={handleChange} name="startsAtDate" value={examData.startsAtDate} type="date" className="bg-transparent focus:outline-none" />
              	<input onChange={handleChange} name="startsAtTime" value={examData.startsAtTime} type="time" className="bg-transparent focus:outline-none" />
               </div>
            </div>

					<div className="flex flex-col space-y-1 w-full">
						<p className="text-gray-600 dark:text-gray-400 font-semibold">Duration</p>
						<div className="flex items-center space-x-3">
							<input onChange={handleChange} value={examData.duration} name="duration" type="time" className="w-full rounded bg-transparent border border-gray-300 dark:border-zinc-700 dark:text-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300 dark:hover:border-zinc-600" />
						</div>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex flex-col space-y-1 w-full">
						<p className="text-gray-600 dark:text-gray-400 font-semibold">Attempts</p>
						<div className="flex items-center space-x-3">
							<input onChange={handleChange} name="attempts" value={examData.attempts} type="number" className="w-full rounded bg-transparent border border-gray-300 dark:border-zinc-700 dark:text-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300 dark:hover:border-zinc-600" />
						</div>
					</div>

					<div className="flex flex-col space-y-1 w-full">
						<p className="text-gray-600 dark:text-gray-400 font-semibold">Sequentiel</p>
						<div className="flex items-center space-x-3">
							<Boolean selected={examData.sequentiel} onChange={(value) => setExamData({...examData, sequentiel:value})} value={examData.sequentiel} value="Sequentiel" />
						</div>
					</div>
				</div>
	    </div>

	        <div className="flex flex-col space-y-1 w-full">
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Title</p>
              <input placeholder="Enter title" onChange={handleChange} name="title" value={examData.title} className="w-full rounded bg-transparent border border-gray-300 dark:border-zinc-700 dark:text-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300 dark:hover:border-zinc-600" />
            </div>

            <div>
            	<p className="text-gray-600 dark:text-gray-400 font-semibold">Description</p>
            	<TextEditor resetValue={(fun) => resetValue = fun} height="150px" value={editorValue} setValue={setEditorValue} />
            </div>

            <div className="flex items-center justify-end">
              <button onClick={postData} className="post-btn">Post</button>
            </div>
		</div>
	)
}

const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: " " },
    ]
  }
]


export default AddExam;