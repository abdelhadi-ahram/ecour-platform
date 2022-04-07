import React from "react"

const generateChoicesForm = (type) => {
	if (type === "Multi choice") return []
	return ""
}

function Choices({choices, type}){
	const [selected, setSelected] = React.useState(null);
	React.useEffect(() => {
		setSelected(generateChoicesForm(type))
	}, [type])

	function selectChoice(choiceId){
		if (typeof selected == 'string'){
			setSelected(choiceId)
		} else{
			let choices = []
			if(selected.includes(choiceId)){
				choices = selected.filter(item => {return item != choiceId})
			} else {
				choices = [...selected, choiceId]
			}
			setSelected(choices)
		}
	}

	function isChoiceSelected(choiceId){
		if (typeof selected == 'string'){
			return choiceId == selected
		} else{
			return selected.includes(choiceId)
		}
	}

	return (
		<div className="flex flex-col space-y-2 pl-6">
			{
				choices?.map((item, index) => {
					const isSelected = isChoiceSelected(item.id)
					return (
						<div onClick={() => selectChoice(item.id)} key={index} className={`px-3 py-2 cursor-pointer flex justify-between border select-none rounded group ${isSelected ? "border-indigo-400 text-indigo-400 bg-zinc-700" : "border-zinc-700 text-gray-400 hover:border-zinc-600"}`}>
							<div className="flex space-x-2">
								<div>
									<div className={`w-6 h-6 rounded-full flex flex-col items-center justify-center ${isSelected ? "bg-zinc-800" : "bg-zinc-700 text-gray-300 group-hover:text-gray-200"}`}>{index}</div>
								</div>
								<p className='text-gray-300'>{item.content}</p>
							</div>
							<svg className={`w-6 h-6 ${isSelected ? "" : "group-hover:text-gray-200"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						</div>
					)
				})
			}
		</div>
	)
}

export default Choices;