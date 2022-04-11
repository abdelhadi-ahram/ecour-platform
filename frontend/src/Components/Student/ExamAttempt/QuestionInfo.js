import React from "react"
import moment from "moment"

function QuestionInfo({estimatedTime, mark, resetQuestion, index}){
	const [idealTime, setIdealTime] = React.useState(0)
	var initialVal = 0;

	React.useEffect(() => {
		var timer;
		if(idealTime > 0)
		 timer = setTimeout(() => setIdealTime(idealTime - 1), 1000)

		return () => clearTimeout(timer)
	 }, [idealTime])

	React.useEffect(() => {
      setIdealTime(estimatedTime)
	 }, [estimatedTime])

	return(
		<div className="w-full flex items-center justify-between rounded-md border border-zinc-700 p-2">
			<div>
				<p className='text-gray-400 '>Question {(index < 10) ? "0" + index : index}</p>
			</div>
			<div className="flex items-center space-x-2">
				<div className="flex items-center space-x-1 text-gray-400 text-sm px-2 py-[1px] rounded-full bg-zinc-700 cursor-pointer" onClick={resetQuestion}>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
					<p className="text-gray-300">Reset</p>
				</div>
				<div className="flex items-center space-x-1 text-gray-400 text-sm px-2 py-[1px] rounded-full bg-zinc-700">
					<p >Mark</p>
					<p className="text-gray-300">{mark}pt</p>
				</div>
				<div className="flex items-center space-x-1 text-gray-400 text-sm px-2 py-[1px] rounded-full bg-zinc-700">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					<p className="text-gray-300">{idealTime > 3600 ? moment.utc(idealTime*1000).format("hh:mm:ss") : moment.utc(idealTime*1000).format("mm:ss")}</p>
				</div>
			</div>
		</div>
	)
}

export default QuestionInfo;