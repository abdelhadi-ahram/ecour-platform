import React from "react";
import TextEditor from "../../Editor";
import Drag from "../../DragFile";

import {
	useNavigate, useParams
} from "react-router-dom";

import {
	useMutation,
	gql
} from "@apollo/client";


const ADD_HOMEWORK = gql`
	mutation AddHomework($title: String!, $deadline: String!, $sectionId: ID!, $content: String, $file: Upload){
	  addHomework(title: $title, deadline: $deadline, sectionId: $sectionId, content: $content, file: $file){
	    ok
	  }
}
`;

function AddHomework(){
	const {sectionId} = useParams()
	const navigate = useNavigate()
	const [title, setTitle] = React.useState("")
	const [date, setDate] = React.useState("")
	const [time, setTime] = React.useState("12:00")
	const [input, setInput] = React.useState(initialValue)
	const [file, setFile] = React.useState(null)
	const [drag, setDrag] = React.useState(false)

	const [addHomework, {data, loading, error}] = useMutation(ADD_HOMEWORK, {
		refetchQueries : [
			"GetElementLectures"
		]
	})

	function cancelClicked(){
		navigate("/my/home")
	}

	function onDrop(files){
		if (files[0]) setFile(files[0])
	}

	if(error){
		console.log(JSON.stringify(error))
	}

	function postData(){
		const deadline = (date + " " + time)
		const content = JSON.stringify(input)
		addHomework({variables: {
			title, deadline, sectionId, content, file
		}})

		navigate("/my/home")
	}

	function resetValue(){}

	return(
		<div className="fixed inset-0 z-20 flex flex-col items-center justify-center">
	      <div className="bg-black opacity-20 dark:opacity-40 fixed inset-0  z-0"></div>
	      <div className="w-[92%] lg:w-[800px] p-6 rounded-xl bg-white dark:bg-zinc-800 z-10 flex flex-col items-center justify-center space-y-1">
	        <div className="w-full flex flex-col space-y-4">
	        	<div className="w-full flex justify-between items-center space-x-4">
	            <div className="flex flex-col space-y-1 w-full">
	              <p className="text-gray-600 dark:text-gray-300 font-semibold">Title</p>
	              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded bg-transparent border border-gray-200 dark:border-zinc-700 dark:text-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300 dark:hover:border-zinc-600" />
	            </div>

	            <div className="flex flex-col space-y-1 w-full">
	              <p className="text-gray-600 dark:text-gray-300 font-semibold">Deadline</p>
	              <div className="flex items-center space-x-3">
	              	<input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full rounded bg-transparent border border-gray-200 dark:border-zinc-700 dark:text-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300 dark:hover:border-zinc-600" />
	              	<input value={time} onChange={(e) => {setTime(e.target.value)}} type="time" className="w-full rounded bg-transparent border border-gray-200 dark:border-zinc-700 dark:text-gray-200 px-2 py-1 focus:outline-none hover:border-gray-300 dark:hover:border-zinc-600" />
	            	</div>
	            </div>
	          </div>

	            <div className="">
		            <div className="flex flex-col space-y-1">
		              <div className="flex justify-between items-center">
		              	<p className="text-gray-600 dark:text-gray-300 font-semibold">Content <span className="text-gray-400 text-sm">(drag and drop a file here)</span></p>
		              	{file && 
			              <div className="px-4 py-1 rounded-full bg-blue-50 dark:bg-zinc-700 flex justify-between items-center space-x-4 border-2 border-dashed border-blue-400">
			              	<p className="text-gray-600 dark:text-gray-400 font-semibold">{file.name}</p>
			              	<span className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onClick={() => setFile(null)}>
			              		<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
			              	</span>
			              </div>}
		              </div>
		              <Drag setDrag={setDrag} onDrop={onDrop}>
		              	<div className="relative">
		              		{
		              			drag && <div className="absolute inset-0 z-10 border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-zinc-700 flex flex-col items-center justify-center space-y-2 rounded-lg">
		              				<svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
		              				<p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">Drag and drop a file right here!</p>
		              			</div>
		              		}
		              		<TextEditor resetValue={(fun) => {resetValue = fun}} height="120px" value={input} setValue={setInput} />
		              	</div>
		              </Drag>
		            </div>
	            </div>

	            <div className="flex items-center justify-end">
	              <button onClick={cancelClicked} className="px-4 py-[6px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 rounded-md mx-3 text-md hover:bg-gray-200 hover:text-gray-600 dark:hover:text-gray-300 dark:text-gray-400">Cancel</button>
	              <button onClick={postData} className="px-4 py-[6px] text-white bg-blue-400 disabled:bg-blue-300 dark:disabled:opacity-40 font-bold rounded-md text-md shadow border border-transparent focus:ring-1 focus:ring-blue-400 hover:shadow-lg">Post</button>
	            </div>
	        </div>
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

export default AddHomework