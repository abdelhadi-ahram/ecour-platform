import React from "react";
import Editor from "../Editor"
import DragFile from "../DragFile"

import {
	useMutation,
	gql
} from "@apollo/client"

const ADD_HOMEWORK_ANSWER = gql`
	mutation AddHomeworkAnswer($homeworkId:ID!,$content:String,$file:Upload){
		addHomeworkAnswer(homeworkId: $homeworkId, content: $content, file: $file){
			ok
		}
	}
`;

function HomeworkAnswer({homeworkId}){
	const [input, setInput] = React.useState(initialValue)
	const [drag, setDrag] = React.useState(false)
	const [file, setFile] = React.useState(null)

	const [addHomeworkAnswer, {data, loading, error}] = useMutation(ADD_HOMEWORK_ANSWER, {
		refetchQueries : [
			"GetHomeworkContent"
		]
	})

	function onDrop(files){
		if (files[0]) setFile(files[0])
	}
	
	function isEditorEmpty(){
		return (input[0]?.children.text == "")
	}

	function postData(){
		const content = JSON.stringify(input);
		addHomeworkAnswer({variables: {homeworkId, content, file}})
	}

	function resetValue(){}

	return(
		<div className="w-full bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 rounded-md shadow p-1 border border-gray-300 dark:border-zinc-600">
			<div className="flex flex-col space-y-2 p-2">
				<div className="flex items-center justify-between">
					<p className="text-gray-700 dark:text-gray-400 font-semibold">Add your work here<span className="text-gray-500 text-sm font-normal mx-3">Drag and drop file here</span></p>
					{file && 
		              <div className="px-4 py-1 rounded-full bg-blue-50 dark:bg-zinc-700 flex justify-between items-center space-x-4 border-2 border-dashed border-blue-400">
		              	<p className="text-gray-600 dark:text-gray-400 font-semibold">{file.name}</p>
		              	<span className="text-gray-500 hover:text-gray-600" onClick={() => setFile(null)}>
		              		<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
		              	</span>
		              </div>}
				</div>

				<div className="relative">
					<DragFile setDrag={setDrag} onDrop={onDrop}>
						{
							drag && (
							<div className="absolute inset-0 rounded-lg border-2 border-dashed border-blue-400 flex flex-col items-center justify-center bg-blue-50 dark:bg-zinc-700 z-20">
								<p className="text-gray-500 font-semibold">Drop file here</p>
							</div>)
						}

						<Editor resetValue={(fun) => resetValue = fun} height="150px" value={input} setValue={setInput} />
					</DragFile>
				</div>

				<div className="flex items-center justify-end">
					<button onClick={postData} className="post-btn">Submit</button>
				</div>
			</div>
		</div>
	)
}

const initialValue = [
	{
		type: "paragraph",
		children : [{text: ''}]
	}
]

export default HomeworkAnswer;