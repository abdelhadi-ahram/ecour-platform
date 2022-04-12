import getFileName from "./getFileName"
import Serializer from "../Editor/Serializer"
import VideoPlayer from "./VideoPlayer"

function parse(lecture){
	if(!lecture) return <></>

	const uri = "http://127.0.0.1:8000/media/"
	switch(lecture.type){
		case "text":
			return <>{Serializer(JSON.parse(lecture.content || "[]"))}</>
		case "video":
			return (<div><VideoPlayer src={uri + lecture.file} /></div>)
		case "image":
			return (<div><img alt="" src={uri + lecture.file} /></div>)
		default:
			return (
				<div className="w-full px-3 py-1 rounded-md bg-zinc-800 my-2 flex items-center justify-between border border-zinc-700">
					<p className="text-gray-300">{
						getFileName(lecture.file)
					}</p>
					<span className="text-blue-400 rounded-full bg-zinc-700 p-2">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
					</span>
				</div>	
			)
	}
}


function MediaParser({lecture}){
	return (
		<>
		{
			parse(lecture)
		}
		</>
	)
}

export default MediaParser;