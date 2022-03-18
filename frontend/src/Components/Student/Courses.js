import React from "react";
import {TEACHER_COURSES} from "../api"


const MODULES = [
  {
    "module" : "Module 01",
    "name" : "Algorithmes",
    "id" : 1,
  },
  {
    "module" : "Module 02",
    "name" : "C Language",
    "id" : 2,
  },
  {
    "module" : "Module 03",
    "name" : "English",
    "id" : 3,
  },
  {
    "module" : "Module 04",
    "name" : "French",
    "id" : 4,
  },
  {
    "module" : "Module 05",
    "name" : "Tec",
    "id" : 5,
  },
  {
    "module" : "Module 06",
    "name" : "Maths",
    "id" : 6,
  }
]

function getType(type){
	switch(type){
		case "pdf":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
		case "announce":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
		case "image":
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
		default :
			return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
	}
}

function Section({name, content}){
	return(
		<div>
		<div>
			<p className="text-gray-900 font-semibold text-md">{name}</p>
		</div>
		<div className="flex flex-col space-y-2">
			{content.map((item, index) => {
				return (
					<div className="flex justify-between px-3 py-2 hover:bg-gray-50 rounded">
						<div className="flex space-x-2">
							<span className="text-gray-400">{getType(item.type)}</span>
							<p className="text-gray-600">{item.name}</p>
						</div>

					</div>
				)
			})}
		</div>
		</div>
	)
}



function Dashboard(){
	const [selected, setSelected] = React.useState(0);

	return(
		<div className="flex flex-col space-y-3">
		<div className="rounded-xl bg-white flex overflow-hidden shadow p-1">
			{MODULES.map((item,index) => {
				let isSelected = selected == index;
				return(
					<div onClick={() => {setSelected(index)}} key={index} className={`py-2 w-32 flex justify-center items-center rounded-lg cursor-pointer ${isSelected ? "bg-blue-50 text-blue-400 font-semibold" : "bg-white text-gray-400 hover:text-gray-500"}`}>{item.name}</div>
				)
			})}
		</div>

			<div className="w-full bg-white rounded-lg px-3 py-2">


				<div className="flex flex-col space-y-8 p-2">
					{TEACHER_COURSES.map((item, index) => {
						return (
							<Section name={item.name} content={item.content} />
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Dashboard;
